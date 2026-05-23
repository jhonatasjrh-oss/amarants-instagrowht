import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const getSupabase = () =>
  createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

function htmlClose(success: boolean, errorMsg?: string) {
  if (success) {
    return new NextResponse(
      `<!DOCTYPE html><html><body><script>
        window.opener && window.opener.postMessage({ type: 'INSTAGRAM_CONNECTED', success: true }, '*');
        window.close();
        setTimeout(function(){ if(!window.closed) window.location.href = 'http://localhost:3000/connect-instagram?connected=true'; }, 500);
      </script></body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    )
  }
  console.log('[callback] ERRO:', errorMsg)
  const encoded = encodeURIComponent(errorMsg || 'Erro desconhecido')
  return new NextResponse(
    `<!DOCTYPE html><html><body><script>
      window.opener && window.opener.postMessage({ type: 'INSTAGRAM_CONNECTED', success: false, error: '${errorMsg?.replace(/'/g, "\\'")}' }, '*');
      window.close();
      setTimeout(function(){ window.location.href = '${APP_URL}/connect-instagram?error=${encoded}'; }, 300);
    </script></body></html>`,
    { headers: { 'Content-Type': 'text/html' } }
  )
}

export async function GET(request: NextRequest) {
  console.log('[callback] ROTA ATINGIDA')
  console.log('[callback] URL completa:', request.url)
  console.log('[callback] params:', Object.fromEntries(new URL(request.url).searchParams))
  const { searchParams } = new URL(request.url)
  const code       = searchParams.get('code')
  const stateParam = searchParams.get('state')
  const errorParam = searchParams.get('error')

  if (errorParam) {
    const desc = searchParams.get('error_description') || errorParam
    return htmlClose(false, desc)
  }

  if (!stateParam) {
    return htmlClose(false, 'Parâmetro state ausente.')
  }

  if (!code) {
    return htmlClose(false, 'Código de autorização não recebido.')
  }

  // Extrai userId do state (formato: `uuid:userId`)
  // O state vem via URL — não depende de cookie cross-origin
  const userId = stateParam.split(':')[1]
  if (!userId) {
    return htmlClose(false, 'State inválido — userId não encontrado.')
  }
  console.log('[callback] state válido, userId:', userId)

  try {
    // 1. Troca code → short-lived token
    const tokenForm = new URLSearchParams({
      client_id:     process.env.INSTAGRAM_APP_ID!,
      client_secret: process.env.INSTAGRAM_APP_SECRET!,
      grant_type:    'authorization_code',
      redirect_uri:  process.env.INSTAGRAM_REDIRECT_URI!,
      code,
    })

    const shortRes  = await fetch('https://api.instagram.com/oauth/access_token', {
      method:  'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body:    tokenForm,
    })
    const shortData = await shortRes.json()

    if (shortData.error_type || shortData.error) {
      const msg = shortData.error_message || shortData.error || 'Erro ao obter token'
      return htmlClose(false, msg)
    }

    const shortToken = shortData.access_token as string
    const igUserId   = String(shortData.user_id)
    console.log('[callback] short token obtido:', !!shortToken)

    // 2. Troca short-lived → long-lived token
    const longParams = new URLSearchParams({
      grant_type:    'ig_exchange_token',
      client_secret: process.env.INSTAGRAM_APP_SECRET!,
      access_token:  shortToken,
    })

    const longRes  = await fetch(`https://graph.instagram.com/access_token?${longParams}`)
    const longData = await longRes.json()

    if (longData.error) {
      const msg = longData.error.message || 'Erro ao renovar token'
      return htmlClose(false, msg)
    }

    const longToken = longData.access_token as string
    const expiresIn = longData.expires_in as number
    const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString()
    console.log('[callback] long token obtido:', !!longToken)

    // 3. Busca perfil do usuário
    const profileParams = new URLSearchParams({
      fields:       'id,username,followers_count,media_count,profile_picture_url,biography',
      access_token: longToken,
    })

    const profileRes  = await fetch(`https://graph.instagram.com/me?${profileParams}`)
    const profileData = await profileRes.json()
    console.log('[callback] perfil:', profileData)

    if (profileData.error) {
      const msg = profileData.error.message || 'Erro ao buscar perfil'
      return htmlClose(false, msg)
    }

    const username = profileData.username as string

    // 4. Salva no Supabase
    const sb = getSupabase()
    const { error: upsertErr } = await sb
      .from('brand_kit')
      .upsert({
        user_id:                    userId,
        instagram_access_token:     longToken,
        instagram_token_expires_at: expiresAt,
        instagram_user_id:          igUserId,
        instagram_handle:           username,
        instagram_connected:        true,
        updated_at:                 new Date().toISOString(),
      }, { onConflict: 'user_id' })

    if (upsertErr) {
      console.error('[ig-callback] upsert error:', upsertErr.message)
      return htmlClose(false, upsertErr.message)
    }
    console.log('[callback] upsert ok, userId:', userId)

    // 5. Sucesso — notifica opener e fecha popup
    const response = htmlClose(true)
    response.cookies.delete('ig_oauth_state')
    return response

  } catch (err: any) {
    console.error('[ig-callback]', err.message)
    return htmlClose(false, err.message)
  }
}
