import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Requer auth + onboarding_completo = true
const PROTECTED = ['/dashboard', '/generate', '/calendar', '/brand-kit', '/library']

// Requer auth + onboarding_completo = false (etapas do fluxo de onboarding)
const ONBOARDING_STEPS = ['/connect-instagram', '/analyze']

// Requer auth apenas (acessível independente do onboarding_completo)
const AUTH_ONLY = ['/action-plan']

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname

  const isProtected  = PROTECTED.some(r => path.startsWith(r))
  const isOnboarding = ONBOARDING_STEPS.some(r => path.startsWith(r))
  const isAuthOnly   = AUTH_ONLY.some(r => path.startsWith(r))
  const isLogin      = path === '/login'
  const isRegister   = path === '/register'

  // Não autenticado → login
  if (!user && (isProtected || isOnboarding || isAuthOnly)) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Autenticado em página de auth → redireciona conforme onboarding
  if (user && (isLogin || isRegister)) {
    const { data: kit } = await supabase
      .from('brand_kit')
      .select('onboarding_completo')
      .eq('user_id', user.id)
      .single()
    const completo = kit?.onboarding_completo ?? false
    return NextResponse.redirect(
      new URL(completo ? '/dashboard' : '/connect-instagram', request.url)
    )
  }

  // Autenticado em rota protegida ou etapa de onboarding → checar brand_kit
  if (user && (isProtected || isOnboarding)) {
    const { data: kit } = await supabase
      .from('brand_kit')
      .select('onboarding_completo')
      .eq('user_id', user.id)
      .single()
    const completo = kit?.onboarding_completo ?? false

    // Rota protegida sem onboarding → manda para connect-instagram
    if (isProtected && !completo) {
      return NextResponse.redirect(new URL('/connect-instagram', request.url))
    }
    // Etapa de onboarding já concluída → manda para dashboard
    if (isOnboarding && completo) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // AUTH_ONLY: autenticado = OK, sem checar onboarding
  return supabaseResponse
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/generate/:path*',
    '/calendar/:path*',
    '/brand-kit/:path*',
    '/library/:path*',
    '/connect-instagram/:path*',
    '/analyze/:path*',
    '/action-plan/:path*',
    '/login',
    '/register',
  ],
}
