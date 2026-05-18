import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const getStripe = () => new Stripe(process.env.STRIPE_SECRET_KEY!)
const getSupabase = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const PRICES: Record<string, string> = {
  starter:  process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID!,
  pro:      process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID!,
  business: process.env.NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID!,
}

export async function POST(request: NextRequest) {
  try {
    console.log('[stripe/checkout] ENV CHECK', {
      secret_key_prefix: process.env.STRIPE_SECRET_KEY?.slice(0, 20),
      starter_price:     process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID,
      pro_price:         process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
      business_price:    process.env.NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID,
    })

    const { userId, planId } = await request.json()

    if (!userId || !planId) {
      return NextResponse.json({ error: 'userId e planId são obrigatórios' }, { status: 400 })
    }

    const priceId = PRICES[planId]
    if (!priceId) {
      return NextResponse.json({ error: 'Plano inválido' }, { status: 400 })
    }

    // Busca ou cria o Stripe Customer vinculado ao usuário
    const sb = getSupabase()
    const st = getStripe()

    const { data: kit } = await sb
      .from('brand_kit')
      .select('stripe_customer_id, nome_dono, nome_marca')
      .eq('user_id', userId)
      .single()

    let customerId = kit?.stripe_customer_id

    if (!customerId) {
      const { data: userData } = await sb.auth.admin.getUserById(userId)
      const email = userData?.user?.email || ''

      const customer = await st.customers.create({
        email,
        name:     kit?.nome_dono  || kit?.nome_marca || email,
        metadata: { userId },
      })
      customerId = customer.id

      await sb
        .from('brand_kit')
        .update({ stripe_customer_id: customerId })
        .eq('user_id', userId)
    }

    const baseUrl = process.env.NEXT_PUBLIC_URL || request.headers.get('origin') || 'http://localhost:3000'

    const session = await st.checkout.sessions.create({
      customer:             customerId,
      payment_method_types: ['card'],
      mode:                 'subscription',
      line_items:           [{ price: priceId, quantity: 1 }],
      success_url:          `${baseUrl}/dashboard?payment=success&plan=${planId}`,
      cancel_url:           `${baseUrl}/pricing`,
      metadata:             { userId, planId },
      subscription_data:    { metadata: { userId, planId } },
      locale:               'pt-BR',
    })

    return NextResponse.json({ url: session.url })

  } catch (error: any) {
    console.error('[stripe/checkout]', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
