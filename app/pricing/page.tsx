"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '../lib/supabase'

const S = {
  bg:     '#f4f5f7',
  side:   '#0d1f3c',
  card:   '#ffffff',
  card2:  '#f8f9fb',
  borda:  'rgba(0,0,0,0.08)',
  borda2: 'rgba(0,0,0,0.14)',
  azul:   '#0d1f3c',
  verde:  '#3db860',
  verde2: '#2d9e50',
  texto:  '#1a1a2e',
  muted:  '#6b7280',
}

const PLANOS = [
  {
    id:       'starter',
    nome:     'Starter',
    preco:    'R$ 99',
    periodo:  '/mês',
    desc:     'Para quem está começando a crescer no Instagram',
    popular:  false,
    cor:      S.azul,
    bg:       'rgba(13,31,60,0.04)',
    btnBg:    S.azul,
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
    bg:       'rgba(61,184,96,0.04)',
    btnBg:    S.verde,
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
    cor:      '#7c3aed',
    bg:       'rgba(124,58,237,0.04)',
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

export default function Pricing() {
  const router = useRouter()
  const [userId,    setUserId]    = useState<string | null>(null)
  const [planoAtual,setPlanoAtual]= useState<string>('free')
  const [loading,   setLoading]   = useState<string | null>(null)
  const [erro,      setErro]      = useState('')

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
      router.push(`/login?redirect=/pricing`)
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

  return (
    <div style={{ minHeight: '100vh', background: S.bg, fontFamily: 'Inter, sans-serif' }}>

      {/* Nav */}
      <nav style={{ background: S.card, borderBottom: `1px solid ${S.borda}`, padding: '0 40px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10, boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <Image src="/logo.png" alt="Logo" width={36} height={36} style={{ borderRadius: '9px' }} />
          <div>
            <div style={{ color: S.azul, fontWeight: 900, fontSize: '13px', letterSpacing: '2px' }}>AMARANTS</div>
            <div style={{ color: S.verde, fontSize: '8px', letterSpacing: '2px', textTransform: 'uppercase' }}>Instagrowht</div>
          </div>
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {userId ? (
            <>
              {planoAtual !== 'free' && (
                <button onClick={handlePortal} disabled={loading === 'portal'}
                  style={{ padding: '8px 18px', background: S.card2, color: S.muted, border: `1px solid ${S.borda2}`, borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                  {loading === 'portal' ? '⟳ Carregando...' : '⚙️ Gerenciar assinatura'}
                </button>
              )}
              <a href="/dashboard" style={{ padding: '8px 20px', background: S.verde, color: '#fff', borderRadius: '8px', fontSize: '13px', fontWeight: 700, textDecoration: 'none', boxShadow: '0 2px 10px rgba(61,184,96,0.3)' }}>
                Dashboard →
              </a>
            </>
          ) : (
            <a href="/login" style={{ padding: '8px 20px', background: S.azul, color: '#fff', borderRadius: '8px', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>
              Entrar
            </a>
          )}
        </div>
      </nav>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 24px' }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(61,184,96,0.1)', border: '1px solid rgba(61,184,96,0.2)', borderRadius: '20px', padding: '6px 16px', marginBottom: '20px' }}>
            <span style={{ color: S.verde, fontSize: '11px', fontWeight: 800, letterSpacing: '1px' }}>✦ PLANOS E PREÇOS</span>
          </div>
          <h1 style={{ color: S.azul, fontWeight: 900, fontSize: '42px', letterSpacing: '-1px', margin: '0 0 16px', lineHeight: 1.1 }}>
            Cresça no Instagram<br />com inteligência artificial
          </h1>
          <p style={{ color: S.muted, fontSize: '16px', lineHeight: 1.7, margin: '0 0 8px' }}>
            Planos flexíveis para cada fase do seu negócio. Cancele quando quiser.
          </p>
          <p style={{ color: S.muted, fontSize: '13px' }}>
            Dúvidas? Fale no WhatsApp{' '}
            <a href="https://wa.me/5562993277239" target="_blank" rel="noreferrer"
              style={{ color: S.verde, fontWeight: 700, textDecoration: 'none' }}>
              (62) 99327-7239
            </a>
          </p>
        </div>

        {/* Erro */}
        {erro && (
          <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontSize: '13px', padding: '12px 16px', borderRadius: '10px', marginBottom: '24px', textAlign: 'center' }}>
            ⚠️ {erro}
          </div>
        )}

        {/* Plano atual */}
        {planoAtual !== 'free' && (
          <div style={{ background: 'rgba(61,184,96,0.06)', border: '1px solid rgba(61,184,96,0.2)', borderRadius: '12px', padding: '14px 20px', marginBottom: '28px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <span style={{ color: S.verde, fontSize: '16px' }}>✓</span>
            <span style={{ color: S.verde2, fontWeight: 700, fontSize: '14px' }}>
              Você está no plano {PLANOS.find(p => p.id === planoAtual)?.nome || planoAtual}
            </span>
            <button onClick={handlePortal}
              style={{ background: 'none', border: 'none', color: S.muted, fontSize: '12px', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'Inter, sans-serif' }}>
              Gerenciar
            </button>
          </div>
        )}

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', alignItems: 'start' }}>
          {PLANOS.map(plano => {
            const isAtual  = planoAtual === plano.id
            const isLoading = loading === plano.id

            return (
              <div key={plano.id} style={{ background: S.card, border: `2px solid ${plano.popular ? plano.cor : S.borda}`, borderRadius: '20px', overflow: 'hidden', boxShadow: plano.popular ? `0 8px 32px ${plano.cor}22` : '0 2px 10px rgba(0,0,0,0.06)', position: 'relative', transform: plano.popular ? 'scale(1.03)' : 'scale(1)' }}>

                {/* Popular badge */}
                {plano.popular && (
                  <div style={{ background: plano.cor, color: '#fff', textAlign: 'center', padding: '8px', fontSize: '11px', fontWeight: 800, letterSpacing: '1.5px' }}>
                    ✦ MAIS POPULAR
                  </div>
                )}

                <div style={{ padding: '28px' }}>
                  {/* Plan header */}
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ color: plano.cor, fontSize: '11px', fontWeight: 800, letterSpacing: '1.5px', marginBottom: '6px', textTransform: 'uppercase' }}>{plano.nome}</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '8px' }}>
                      <span style={{ color: S.azul, fontWeight: 900, fontSize: '36px', letterSpacing: '-1px', lineHeight: 1 }}>{plano.preco}</span>
                      <span style={{ color: S.muted, fontSize: '13px' }}>{plano.periodo}</span>
                    </div>
                    <p style={{ color: S.muted, fontSize: '12px', lineHeight: 1.5, margin: 0 }}>{plano.desc}</p>
                  </div>

                  {/* CTA */}
                  {isAtual ? (
                    <div style={{ width: '100%', padding: '13px', background: 'rgba(61,184,96,0.1)', color: S.verde2, border: `1px solid rgba(61,184,96,0.3)`, borderRadius: '10px', textAlign: 'center', fontSize: '14px', fontWeight: 700, marginBottom: '20px', boxSizing: 'border-box' }}>
                      ✓ Plano atual
                    </div>
                  ) : (
                    <button onClick={() => handleCheckout(plano.id)} disabled={isLoading}
                      style={{ width: '100%', padding: '13px', background: isLoading ? `${plano.btnBg}99` : plano.btnBg, color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 800, cursor: isLoading ? 'not-allowed' : 'pointer', fontFamily: 'Inter, sans-serif', marginBottom: '20px', boxShadow: isLoading ? 'none' : `0 4px 16px ${plano.cor}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s', boxSizing: 'border-box' }}>
                      {isLoading
                        ? <><span style={{ display: 'inline-block', animation: 'spin 0.8s linear infinite' }}>⟳</span> Processando...</>
                        : `Assinar ${plano.nome} →`}
                    </button>
                  )}

                  {/* Divisor */}
                  <div style={{ height: '1px', background: S.borda, marginBottom: '20px' }} />

                  {/* Features */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {plano.features.map((f, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: f.ok ? 'rgba(61,184,96,0.12)' : 'rgba(156,163,175,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', flexShrink: 0, color: f.ok ? S.verde2 : S.muted }}>
                          {f.ok ? '✓' : '–'}
                        </div>
                        <span style={{ color: f.ok ? S.texto : S.muted, fontSize: '13px', textDecoration: f.ok ? 'none' : 'none', opacity: f.ok ? 1 : 0.5 }}>{f.texto}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Free tier note */}
        <div style={{ textAlign: 'center', marginTop: '32px', padding: '20px', background: S.card, border: `1px solid ${S.borda}`, borderRadius: '12px' }}>
          <div style={{ color: S.muted, fontSize: '13px', marginBottom: '6px' }}>
            Quer testar antes de assinar?
          </div>
          <div style={{ color: S.texto, fontWeight: 700, fontSize: '14px', marginBottom: '12px' }}>
            Plano Grátis — 5 posts/mês, Brand Kit e acesso ao gerador de conteúdo
          </div>
          <a href="/login" style={{ display: 'inline-block', padding: '10px 24px', background: S.card2, color: S.azul, border: `1px solid ${S.borda2}`, borderRadius: '8px', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>
            Criar conta grátis →
          </a>
        </div>

        {/* Garantia */}
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: S.card, border: `1px solid ${S.borda}`, borderRadius: '12px', padding: '14px 24px' }}>
            <span style={{ fontSize: '24px' }}>🛡️</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ color: S.azul, fontWeight: 700, fontSize: '13px' }}>Garantia de 7 dias</div>
              <div style={{ color: S.muted, fontSize: '12px' }}>Não gostou? Devolvemos 100% do valor</div>
            </div>
            <div style={{ width: '1px', height: '32px', background: S.borda, margin: '0 8px' }} />
            <span style={{ fontSize: '24px' }}>💳</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{ color: S.azul, fontWeight: 700, fontSize: '13px' }}>Cancele quando quiser</div>
              <div style={{ color: S.muted, fontSize: '12px' }}>Sem fidelidade, sem burocracia</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '48px', paddingTop: '24px', borderTop: `1px solid ${S.borda}`, color: S.muted, fontSize: '12px' }}>
          <div style={{ marginBottom: '6px' }}>
            Amarants Expansão Digital · Estruturas digitais para seus negócios!
          </div>
          <div>
            <a href="https://produtosamarante.com/" target="_blank" rel="noreferrer" style={{ color: S.muted, marginRight: '16px' }}>Site</a>
            <a href="https://wa.me/5562993277239" target="_blank" rel="noreferrer" style={{ color: S.muted }}>WhatsApp</a>
          </div>
        </div>

      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
