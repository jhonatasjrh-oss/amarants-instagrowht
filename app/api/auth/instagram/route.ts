import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function GET(request: NextRequest) {
  const appId       = process.env.INSTAGRAM_APP_ID
  const redirectUri = process.env.INSTAGRAM_REDIRECT_URI

  if (!appId || !redirectUri) {
    return NextResponse.json({ error: 'Instagram OAuth não configurado' }, { status: 500 })
  }

  // Lê userId da sessão Supabase via cookie
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: () => {},
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Usuário não autenticado' }, { status: 401 })
  }

  const state = `${crypto.randomUUID()}:${user.id}`

  const params = new URLSearchParams({
    client_id:     appId,
    redirect_uri:  redirectUri,
    scope:         'instagram_manage_comments',
    response_type: 'code',
    state,
  })

  const authUrl = `https://www.facebook.com/dialog/oauth?${params}`

  const response = NextResponse.redirect(authUrl)

  response.cookies.set('ig_oauth_state', state, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge:   60 * 10,
    path:     '/',
  })

  return response
}
