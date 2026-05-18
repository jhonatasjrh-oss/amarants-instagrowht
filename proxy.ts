import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PROTECTED = ['/dashboard', '/generate', '/calendar', '/brand-kit', '/library']

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const path       = request.nextUrl.pathname
  const isProtected = PROTECTED.some(r => path.startsWith(r))
  const isOnboarding = path === '/onboarding'
  const isLogin      = path === '/login'

  // Não autenticado → login
  if (!user && (isProtected || isOnboarding)) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Autenticado → sai do login
  if (user && isLogin) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Autenticado em rota protegida ou /onboarding → checar brand_kit
  if (user && (isProtected || isOnboarding)) {
    const { data: kit } = await supabase
      .from('brand_kit')
      .select('onboarding_completo')
      .eq('user_id', user.id)
      .single()

    const completo = kit?.onboarding_completo ?? false

    if (isProtected && !completo) {
      return NextResponse.redirect(new URL('/onboarding', request.url))
    }

    if (isOnboarding && completo) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/generate/:path*',
    '/calendar/:path*',
    '/brand-kit/:path*',
    '/library/:path*',
    '/onboarding',
    '/login',
  ],
}
