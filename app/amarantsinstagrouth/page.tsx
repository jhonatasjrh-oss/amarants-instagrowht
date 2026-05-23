"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '../lib/supabase'

const S = {
  bg:      '#080e1a',
  card:    '#0d1f3c',
  borda:   'rgba(255,255,255,0.08)',
  verde:   '#6ee04a',
  verde2:  '#4caf30',
  azul:    '#00d4ff',
  texto:   '#ffffff',
  muted:   'rgba(255,255,255,0.5)',
  muted2:  'rgba(255,255,255,0.3)',
}

const PLANOS = [
  {
    id:       'starter',
    nome:     'Starter',
    preco:    'R$ 99',
    periodo:  '/mês',
    desc:     'Para quem está começando a crescer no Instagram',
    popular:  false,
    cor:      '#60a5fa',
    btnBg:    '#1d4ed8',
    features: [
      { ok: true,  texto: '50 posts gerados por mês' },
      { ok: true,  texto: 'Calendário editorial'      },
      { ok: true,  texto: 'Brand Kit completo'        },
      { ok: true,  texto: 'Geração manual (fotos)'    },
      { ok: true,  texto: 'Suporte por e-mail'        },
      { ok: false, texto: 'Geração de imagens DALL-E' },
      { ok: false, texto: 'Múltiplas marcas'          },
      { ok: false, texto: 'Suporte prioritário'       },
    ],
  },
  {
    id:       'pro',
    nome:     'Pro',
    preco:    'R$ 197',
    periodo:  '/mês',
    desc:     'Para criadores e negócios que levam o Instagram a sério',
    popular:  true,
    cor:      S.verde,
    btnBg:    S.verde2,
    features: [
      { ok: true,  texto: '200 posts gerados por mês' },
      { ok: true,  texto: 'Calendário editorial'      },
      { ok: true,  texto: 'Brand Kit completo'        },
      { ok: true,  texto: 'Geração manual (fotos)'    },
      { ok: true,  texto: 'Geração de imagens DALL-E' },
      { ok: true,  texto: 'Suporte prioritário'       },
      { ok: false, texto: 'Múltiplas marcas'          },
      { ok: false, texto: 'Gerente de conta dedicado' },
    ],
  },
  {
    id:       'business',
    nome:     'Business',
    preco:    'R$ 397',
    periodo:  '/mês',
    desc:     'Para agências e negócios com múltiplos perfis',
    popular:  false,
    cor:      '#a78bfa',
    btnBg:    '#7c3aed',
    features: [
      { ok: true, texto: 'Posts ilimitados'            },
      { ok: true, texto: 'Calendário editorial'        },
      { ok: true, texto: 'Brand Kit completo'          },
      { ok: true, texto: 'Geração manual (fotos)'      },
      { ok: true, texto: 'Geração de imagens DALL-E'   },
      { ok: true, texto: 'Múltiplas marcas'            },
      { ok: true, texto: 'Suporte prioritário'         },
      { ok: true, texto: 'Gerente de conta dedicado'   },
    ],
  },
]

export default function AmarantsInstagrouthPage() {
  const router = useRouter()
  const [userId,     setUserId]     = useState<string | null>(null)
  const [planoAtual, setPlanoAtual] = useState<string>('free')
  const [loading,    setLoading]    = useState<string | null>(null)
  const [erro,       setErro]       = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return
      setUserId(data.user.id)
      const { data: kit } = await supabase
        .from('brand_kit')
        .select('plano, subscription_status')
        .eq('user_id', data.user.id)
        .single()
      if (kit?.plano) setPlanoAtual(kit.plano)
    })
  }, [])

  async function handleCheckout(planId: string) {
    if (!userId) {
      router.push(`/register?plano=${planId}`)
      return
    }
    if (planoAtual === planId) return
    setLoading(planId)
    setErro('')
    try {
      const res  = await fetch('/api/stripe/checkout', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ userId, planId }),
      })
      const json = await res.json()
      if (json.error) throw new Error(json.error)
      window.location.href = json.url
    } catch (e: any) {
      setErro(e.message)
      setLoading(null)
    }
  }

  async function handlePortal() {
    if (!userId) return
    setLoading('portal')
    try {
      const res  = await fetch('/api/stripe/portal', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ userId }),
      })
      const json = await res.json()
      if (json.error) throw new Error(json.error)
      window.location.href = json.url
    } catch (e: any) {
      setErro(e.message)
      setLoading(null)
    }
  }

  function scrollToPlanos() {
    document.getElementById('planos')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div style={{ minHeight: '100vh', background: S.bg, fontFamily: 'Inter, sans-serif', color: S.texto }}>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; }
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes fadeUp  { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
        .fade-up   { animation: fadeUp 0.7s ease both; }
        .fade-up-2 { animation: fadeUp 0.7s ease 0.15s both; }
        .fade-up-3 { animation: fadeUp 0.7s ease 0.3s both; }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(8,14,26,0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        padding: '0 40px', height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Image src="/logo-dark.png" alt="Logo" width={36} height={36} style={{ borderRadius: '9px' }} />
          <div>
            <div style={{ color: '#fff', fontWeight: 900, fontSize: '13px', letterSpacing: '2.5px' }}>AMARANTS</div>
            <div style={{ color: S.verde, fontSize: '8px', letterSpacing: '2px', textTransform: 'uppercase', marginTop: '1px' }}>Instagrowht</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={scrollToPlanos} style={{ background: 'none', border: 'none', color: S.muted, fontSize: '13px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', padding: '8px 12px' }}>
            Planos
          </button>
          {userId ? (
            <>
              {planoAtual !== 'free' && (
                <button onClick={handlePortal} disabled={loading === 'portal'}
                  style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.07)', color: S.muted, border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                  {loading === 'portal' ? '⟳ Carregando...' : '⚙️ Minha assinatura'}
                </button>
              )}
              <a href="/dashboard" style={{ padding: '9px 22px', background: S.verde, color: '#0a1628', borderRadius: '8px', fontSize: '13px', fontWeight: 800, textDecoration: 'none', boxShadow: '0 0 16px rgba(110,224,74,0.3)' }}>
                Dashboard →
              </a>
            </>
          ) : (
            <>
              <a href="/login" style={{ padding: '8px 18px', background: 'rgba(255,255,255,0.07)', color: '#fff', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
                Entrar
              </a>
              <a href="/register" style={{ padding: '9px 22px', background: S.verde, color: '#0a1628', borderRadius: '8px', fontSize: '13px', fontWeight: 800, textDecoration: 'none', boxShadow: '0 0 16px rgba(110,224,74,0.3)' }}>
                Criar conta →
              </a>
            </>
          )}
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        position: 'relative',
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, #0d1f3c 0%, #080e1a 70%)',
        padding: '100px 24px 80px',
        textAlign: 'center',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '60px', left: '50%', transform: 'translateX(-50%)', width: '700px', height: '320px', background: 'radial-gradient(ellipse, rgba(110,224,74,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="fade-up" style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(110,224,74,0.08)', border: '1px solid rgba(110,224,74,0.2)', borderRadius: '20px', padding: '7px 18px', marginBottom: '32px' }}>
            <span style={{ color: S.verde, fontSize: '10px', fontWeight: 900, letterSpacing: '1.5px' }}>✦ INTELIGÊNCIA ARTIFICIAL PARA O INSTAGRAM</span>
          </div>

          {/* H1 */}
          <h1 style={{ fontSize: '56px', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-2px', marginBottom: '24px', color: '#fff' }}>
            Transforme seu Instagram em uma{' '}
            <span style={{ color: S.verde }}>máquina de crescimento</span>
          </h1>

          {/* Subtítulo */}
          <p className="fade-up-2" style={{ fontSize: '18px', lineHeight: 1.7, color: S.muted, maxWidth: '600px', margin: '0 auto 44px' }}>
            IA que cria conteúdo, analisa métricas e executa sua estratégia — enquanto você foca no que importa.
          </p>

          {/* CTAs */}
          <div className="fade-up-3" style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '60px' }}>
            <button onClick={scrollToPlanos} style={{
              padding: '16px 40px', background: S.verde, color: '#0a1628',
              border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 900,
              cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              boxShadow: '0 0 32px rgba(110,224,74,0.35)',
              letterSpacing: '0.3px',
            }}>
              Começar agora →
            </button>
            <a href="/login" style={{
              padding: '16px 36px', background: 'transparent', color: '#fff',
              border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px',
              fontSize: '15px', fontWeight: 600, textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center',
            }}>
              Ver como funciona
            </a>
          </div>

          {/* Mini stats */}
          <div style={{ display: 'inline-flex', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden', background: 'rgba(255,255,255,0.03)' }}>
            {[
              { valor: '10x',  label: 'mais engajamento' },
              { valor: '2h',   label: 'economizadas/dia' },
              { valor: '5min', label: 'setup inicial'     },
            ].map((stat, i) => (
              <div key={stat.label} style={{
                padding: '18px 36px',
                borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                textAlign: 'center',
              }}>
                <div style={{ color: S.verde, fontWeight: 900, fontSize: '26px', letterSpacing: '-1px', lineHeight: 1 }}>{stat.valor}</div>
                <div style={{ color: S.muted, fontSize: '11px', marginTop: '4px', fontWeight: 500 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLANOS ── */}
      <section id="planos" style={{ padding: '80px 24px', maxWidth: '1100px', margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(110,224,74,0.08)', border: '1px solid rgba(110,224,74,0.15)', borderRadius: '20px', padding: '6px 16px', marginBottom: '20px' }}>
            <span style={{ color: S.verde, fontSize: '10px', fontWeight: 900, letterSpacing: '1.5px' }}>✦ PLANOS E PREÇOS</span>
          </div>
          <h2 style={{ fontSize: '38px', fontWeight: 900, letterSpacing: '-1px', color: '#fff', marginBottom: '14px' }}>
            Escolha o plano ideal para você
          </h2>
          <p style={{ color: S.muted, fontSize: '15px' }}>
            Cancele quando quiser · Dúvidas?{' '}
            <a href="https://wa.me/5562993277239" target="_blank" rel="noreferrer" style={{ color: S.verde, fontWeight: 700, textDecoration: 'none' }}>
              Fale no WhatsApp
            </a>
          </p>
        </div>

        {erro && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', fontSize: '13px', padding: '12px 16px', borderRadius: '10px', marginBottom: '24px', textAlign: 'center' }}>
            ⚠️ {erro}
          </div>
        )}

        {planoAtual !== 'free' && (
          <div style={{ background: 'rgba(110,224,74,0.06)', border: '1px solid rgba(110,224,74,0.2)', borderRadius: '12px', padding: '14px 20px', marginBottom: '28px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <span style={{ color: S.verde, fontSize: '16px' }}>✓</span>
            <span style={{ color: S.verde, fontWeight: 700, fontSize: '14px' }}>
              Você está no plano {PLANOS.find(p => p.id === planoAtual)?.nome || planoAtual}
            </span>
            <button onClick={handlePortal} style={{ background: 'none', border: 'none', color: S.muted, fontSize: '12px', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'Inter, sans-serif' }}>
              Gerenciar
            </button>
          </div>
        )}

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', alignItems: 'start' }}>
          {PLANOS.map(plano => {
            const isAtual   = planoAtual === plano.id
            const isLoading = loading === plano.id

            return (
              <div key={plano.id} style={{
                background: S.card,
                border: plano.popular ? `1px solid ${S.verde}` : `1px solid ${S.borda}`,
                borderRadius: '20px', overflow: 'hidden',
                boxShadow: plano.popular ? '0 0 40px rgba(110,224,74,0.15)' : '0 4px 24px rgba(0,0,0,0.3)',
                position: 'relative',
                transform: plano.popular ? 'scale(1.03)' : 'scale(1)',
              }}>

                {plano.popular && (
                  <div style={{ background: S.verde, color: '#0a1628', textAlign: 'center', padding: '8px', fontSize: '11px', fontWeight: 900, letterSpacing: '1.5px' }}>
                    ✦ MAIS POPULAR
                  </div>
                )}

                <div style={{ padding: '28px' }}>
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ color: plano.cor, fontSize: '11px', fontWeight: 900, letterSpacing: '1.5px', marginBottom: '8px', textTransform: 'uppercase' }}>{plano.nome}</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '8px' }}>
                      <span style={{ color: '#fff', fontWeight: 900, fontSize: '38px', letterSpacing: '-1.5px', lineHeight: 1 }}>{plano.preco}</span>
                      <span style={{ color: S.muted, fontSize: '13px' }}>{plano.periodo}</span>
                    </div>
                    <p style={{ color: S.muted, fontSize: '12px', lineHeight: 1.6 }}>{plano.desc}</p>
                  </div>

                  {isAtual ? (
                    <div style={{ width: '100%', padding: '13px', background: 'rgba(110,224,74,0.1)', color: S.verde, border: '1px solid rgba(110,224,74,0.3)', borderRadius: '10px', textAlign: 'center', fontSize: '14px', fontWeight: 700, marginBottom: '20px', boxSizing: 'border-box' }}>
                      ✓ Plano atual
                    </div>
                  ) : (
                    <button onClick={() => handleCheckout(plano.id)} disabled={isLoading} style={{
                      width: '100%', padding: '13px',
                      background: isLoading ? `${plano.btnBg}88` : plano.btnBg,
                      color: plano.popular ? '#0a1628' : '#fff',
                      border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 800,
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      fontFamily: 'Inter, sans-serif', marginBottom: '20px',
                      boxShadow: isLoading ? 'none' : `0 4px 20px ${plano.btnBg}55`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      transition: 'all 0.2s', boxSizing: 'border-box',
                    }}>
                      {isLoading
                        ? <><span style={{ display: 'inline-block', animation: 'spin 0.8s linear infinite' }}>⟳</span> Processando...</>
                        : `Assinar ${plano.nome} →`}
                    </button>
                  )}

                  <div style={{ height: '1px', background: 'rgba(255,255,255,0.07)', marginBottom: '20px' }} />

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {plano.features.map((f, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0,
                          background: f.ok ? 'rgba(110,224,74,0.15)' : 'rgba(255,255,255,0.05)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '10px', color: f.ok ? S.verde : S.muted2,
                        }}>
                          {f.ok ? '✓' : '–'}
                        </div>
                        <span style={{ color: f.ok ? 'rgba(255,255,255,0.85)' : S.muted2, fontSize: '13px', opacity: f.ok ? 1 : 0.6 }}>
                          {f.texto}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Free tier */}
        <div style={{ textAlign: 'center', marginTop: '32px', padding: '22px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px' }}>
          <div style={{ color: S.muted, fontSize: '13px', marginBottom: '6px' }}>Quer testar antes de assinar?</div>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: '14px', marginBottom: '14px' }}>
            Plano Grátis — 5 posts/mês, Brand Kit e acesso ao gerador de conteúdo
          </div>
          <a href="/register" style={{ display: 'inline-block', padding: '10px 28px', background: 'rgba(255,255,255,0.07)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>
            Criar conta grátis →
          </a>
        </div>
      </section>

      {/* ── GARANTIA ── */}
      <section style={{ padding: '0 24px 80px' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { icon: '🛡️', titulo: 'Garantia de 7 dias',    sub: 'Não gostou? Devolvemos 100% do valor' },
              { icon: '💳', titulo: 'Cancele quando quiser', sub: 'Sem fidelidade, sem burocracia'        },
              { icon: '🔒', titulo: 'Pagamento seguro',      sub: 'Processado pelo Stripe com PCI DSS'   },
            ].map(g => (
              <div key={g.titulo} style={{ flex: '1 1 200px', background: S.card, border: `1px solid ${S.borda}`, borderRadius: '14px', padding: '22px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '8px' }}>
                <span style={{ fontSize: '28px' }}>{g.icon}</span>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: '13px' }}>{g.titulo}</div>
                <div style={{ color: S.muted, fontSize: '12px', lineHeight: 1.5 }}>{g.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '28px 24px', textAlign: 'center' }}>
        <div style={{ color: S.muted, fontSize: '12px', marginBottom: '12px' }}>
          Amarants Expansão Digital · Estruturas digitais para seus negócios!
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
          {[
            { label: 'Site',        href: 'https://produtosamarante.com/', external: true  },
            { label: 'WhatsApp',    href: 'https://wa.me/5562993277239',   external: true  },
            { label: 'Termos',      href: '/terms',                        external: false },
            { label: 'Privacidade', href: '/privacy',                      external: false },
          ].map(l => (
            <a key={l.label} href={l.href}
              target={l.external ? '_blank' : undefined}
              rel={l.external ? 'noreferrer' : undefined}
              style={{ color: S.muted, fontSize: '12px', textDecoration: 'none' }}>
              {l.label}
            </a>
          ))}
        </div>
      </footer>
    </div>
  )
}
