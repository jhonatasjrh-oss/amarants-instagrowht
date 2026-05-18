import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Stripe requer o body RAW (não parseado) para verificar a assinatura
export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig  = request.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Sem stripe-signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    console.error('[webhook] Assinatura inválida:', err.message)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  try {
    switch (event.type) {

      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId  = session.metadata?.userId
        const planId  = session.metadata?.planId

        if (!userId || !planId) break

        await supabase.from('brand_kit').update({
          plano:                   planId,
          subscription_status:     'active',
          stripe_customer_id:      session.customer as string,
          stripe_subscription_id:  session.subscription as string,
          updated_at:              new Date().toISOString(),
        }).eq('user_id', userId)

        break
      }

      case 'customer.subscription.updated': {
        const sub    = event.data.object as Stripe.Subscription
        const userId = sub.metadata?.userId

        if (!userId) break

        const status  = sub.status === 'active' ? 'active' : 'past_due'
        const endDate = new Date(((sub as any).current_period_end as number) * 1000).toISOString()

        await supabase.from('brand_kit').update({
          subscription_status:    status,
          subscription_end_date:  endDate,
          updated_at:             new Date().toISOString(),
        }).eq('user_id', userId)

        break
      }

      case 'customer.subscription.deleted': {
        const sub    = event.data.object as Stripe.Subscription
        const userId = sub.metadata?.userId

        if (!userId) break

        await supabase.from('brand_kit').update({
          plano:                  'free',
          subscription_status:    'inactive',
          stripe_subscription_id: null,
          subscription_end_date:  null,
          updated_at:             new Date().toISOString(),
        }).eq('user_id', userId)

        break
      }

      case 'invoice.payment_failed': {
        const invoice    = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        await supabase.from('brand_kit').update({
          subscription_status: 'past_due',
          updated_at:          new Date().toISOString(),
        }).eq('stripe_customer_id', customerId)

        break
      }
    }
  } catch (err: any) {
    console.error('[webhook] Erro ao processar evento:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
