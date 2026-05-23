import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const IG_BASE    = 'https://graph.instagram.com/v21.0'
const getSupabase = () =>
  createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = request.headers.get('x-user-id') || searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ success: false, error: 'userId obrigatório' }, { status: 400 })
    }

    const sb = getSupabase()
    const { data: kit, error: kitErr } = await sb
      .from('brand_kit')
      .select('instagram_access_token,instagram_token_expires_at,instagram_connected')
      .eq('user_id', userId)
      .single()

    if (kitErr || !kit?.instagram_access_token || !kit?.instagram_connected) {
      return NextResponse.json({ success: false, connected: false })
    }

    if (kit.instagram_token_expires_at && new Date(kit.instagram_token_expires_at) < new Date()) {
      return NextResponse.json({ success: false, connected: false, expired: true })
    }

    const token  = kit.instagram_access_token
    const fields = 'id,username,followers_count,media_count,profile_picture_url,biography,website'
    const url    = `${IG_BASE}/me?fields=${fields}&access_token=${token}`

    const res = await fetch(url)
    const raw = await res.json()

    if (raw.error) {
      const isExpired = raw.error.code === 190 || (raw.error.message || '').toLowerCase().includes('expired')
      return NextResponse.json(
        { success: false, error: raw.error.message, expired: isExpired, connected: !isExpired },
        { status: isExpired ? 401 : 400 }
      )
    }

    return NextResponse.json({
      success:   true,
      connected: true,
      data: {
        id:                  raw.id,
        username:            raw.username,
        followers_count:     raw.followers_count ?? null,
        media_count:         raw.media_count ?? null,
        profile_picture_url: raw.profile_picture_url ?? null,
        biography:           raw.biography ?? null,
        website:             raw.website ?? null,
      },
    })
  } catch (error: any) {
    console.error('[instagram/profile]', error.message)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
