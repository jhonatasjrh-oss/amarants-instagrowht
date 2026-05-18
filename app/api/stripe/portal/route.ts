import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const getStripe = () => new Stripe(process.env.STRIPE_SECRET_KEY!)
const getSupabase = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'userId obrigatório' }, { status: 400 })
    }

    const sb = getSupabase()
    const st = getStripe()

    const { data: kit } = await sb
      .from('brand_kit')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single()

    if (!kit?.stripe_customer_id) {
      return NextResponse.json({ error: 'Nenhuma assinatura encontrada' }, { status: 404 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_URL || request.headers.get('origin') || 'http://localhost:3000'

    const session = await st.billingPortal.sessions.create({
      customer:   kit.stripe_customer_id,
      return_url: `${baseUrl}/dashboard`,
    })

    return NextResponse.json({ url: session.url })

  } catch (error: any) {
    console.error('[stripe/portal]', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
