"use client"

import Image from 'next/image'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '../lib/supabase'

const S = {
  bg:    '#f4f5f7',
  card:  '#ffffff',
  borda: 'rgba(0,0,0,0.08)',
  verde: '#3db860',
  verde2:'#2d9e50',
  texto: '#1a1a2e',
  muted: '#6b7280',
  side:  '#0d1f3c',
}

interface IgProfile {
  username?:            string
  followers_count?:     number
  media_count?:         number
  profile_picture_url?: string
  biography?:           string
  website?:             string
}

interface AnalysisData {
  score:               number
  pontos_fortes:       string[]
  pontos_fracos:       string[]
  risco_shadowban:     string
  frequencia_atual:    string
  engajamento_estimado:string
  plano_acao:          Record<string, unknown>
  ig_profile?:         IgProfile | null
}

function ScoreCircle({ score }: { score: number }) {
  const r   = 54
  const c   = 2 * Math.PI * r
  const pct = score / 100
  const cor = score >= 70 ? S.verde : score >= 50 ? '#f59e0b' : '#ef4444'
  return (
    <div style={{ position: 'relative', width: '140px', height: '140px' }}>
      <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="12" />
        <circle
          cx="70" cy="70" r={r} fill="none"
          stroke={cor} strokeWidth="12"
          strokeDasharray={`${pct * c} ${c}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 1.2s ease' }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: '32px', fontWeight: 900, color: cor, lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: '11px', color: S.muted, fontWeight: 600 }}>/ 100</span>
      </div>
    </div>
  )
}

function AnalyzePage() {
  const searchParams   = useSearchParams()
  const handle         = searchParams.get('handle') || ''
  const skip           = searchParams.get('skip') === '1'

  const [fase,    setFase]    = useState<'loading' | 'resultado'>('loading')
  const [data,    setData]    = useState<AnalysisData | null>(null)
  const [userId,  setUserId]  = useState('')
  const [nicho,   setNicho]   = useState('')
  const [loadMsg, setLoadMsg] = useState('Conectando ao Instagram...')
  const [erro,    setErro]    = useState('')

  const MSGS = [
    'Conectando ao Instagram...',
    'Analisando seu perfil...',
    'Calculando score de crescimento...',
    'Identificando oportunidades...',
    'Gerando diagnóstico completo...',
    'Finalizando análise...',
  ]

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: authData }) => {
      if (!authData.user) { window.location.href = '/amarantsinstagrouth/login'; return }
      setUserId(authData.user.id)

      const { data: kit } = await supabase
        .from('brand_kit')
        .select('nicho, instagram_handle')
        .eq('user_id', authData.user.id)
        .single()
      setNicho(kit?.nicho || '')

      const instagramHandle = handle || kit?.instagram_handle || 'perfil'

      if (skip) {
        runFakeAnalysis(authData.user.id, instagramHandle, kit?.nicho || '')
      } else {
        runAnalysis(authData.user.id, instagramHandle, kit?.nicho || '')
      }
    })
  }, [])

  function animateMsgs() {
    let i = 0
    const interval = setInterval(() => {
      i++
      if (i < MSGS.length) setLoadMsg(MSGS[i])
      else clearInterval(interval)
    }, 1800)
    return interval
  }

  async function runAnalysis(uid: string, igHandle: string, nic: string) {
    const timer = animateMsgs()
    try {
      const res  = await fetch('/amarantsinstagrouth/api/analyze-instagram', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ userId: uid, instagram_handle: igHandle, nicho: nic }),
      })
      const json = await res.json()
      clearInterval(timer)
      if (!json.success) throw new Error(json.error)
      setData(json.data)
      setFase('resultado')
    } catch (e: any) {
      clearInterval(timer)
      setErro(e.message)
      setFase('resultado')
    }
  }

  async function runFakeAnalysis(uid: string, igHandle: string, nic: string) {
    const timer = animateMsgs()
    await new Promise(r => setTimeout(r, 4000))
    clearInterval(timer)
    await runAnalysis(uid, igHandle || 'perfil', nic)
  }

  const shadowbanCor: Record<string, string> = {
    baixo: S.verde,
    médio: '#f59e0b',
    alto:  '#ef4444',
  }

  if (fase === 'loading') {
    return (
      <>
        <style>{`
          @keyframes spin  { to { transform: rotate(360deg); } }
          @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
          @keyframes bar   { 0%{width:0} 100%{width:100%} }
        `}</style>
        <div style={{ minHeight: '100vh', background: S.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', padding: '32px 20px' }}>
          <Image src="/logo-dark.png" alt="Logo" width={40} height={40} style={{ borderRadius: '10px', marginBottom: '40px' }} />

          {/* Spinner grande */}
          <div style={{ width: '96px', height: '96px', borderRadius: '50%', border: '4px solid rgba(61,184,96,0.15)', borderTop: `4px solid ${S.verde}`, animation: 'spin 1s linear infinite', marginBottom: '32px' }} />

          <h2 style={{ color: S.texto, fontWeight: 900, fontSize: '22px', margin: '0 0 10px', textAlign: 'center' }}>
            IA analisando seu perfil
          </h2>
          <p style={{ color: S.muted, fontSize: '14px', margin: '0 0 8px' }}>
            @{handle || 'seu perfil'}
          </p>
          <p style={{ color: S.verde, fontSize: '14px', fontWeight: 600, animation: 'pulse 1.5s ease-in-out infinite', margin: '0 0 32px' }}>
            {loadMsg}
          </p>

          {/* Barra de progresso */}
          <div style={{ width: '280px', height: '4px', background: 'rgba(0,0,0,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ height: '100%', background: `linear-gradient(90deg, ${S.verde}, #22c55e)`, borderRadius: '2px', animation: 'bar 10s linear forwards' }} />
          </div>

          <p style={{ color: S.muted, fontSize: '12px', marginTop: '32px', textAlign: 'center' }}>
            Isso leva aproximadamente 10-15 segundos.
          </p>
        </div>
      </>
    )
  }

  if (erro) {
    return (
      <div style={{ minHeight: '100vh', background: S.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ background: S.card, border: `1px solid ${S.borda}`, borderRadius: '20px', padding: '48px', maxWidth: '420px', width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
          <h2 style={{ color: S.texto, fontWeight: 900, fontSize: '20px', margin: '0 0 12px' }}>Erro na análise</h2>
          <p style={{ color: S.muted, fontSize: '14px', marginBottom: '24px' }}>{erro}</p>
          <button onClick={() => window.location.reload()} style={{ padding: '12px 28px', background: S.verde, color: '#fff', border: 'none', borderRadius: '9px', fontWeight: 700, cursor: 'pointer', fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
            Tentar novamente
          </button>
        </div>
      </div>
    )
  }

  if (!data) return null

  const sbCor  = shadowbanCor[data.risco_shadowban?.toLowerCase()] || S.muted
  const ig     = data.ig_profile
  const igName = ig?.username || handle || 'seu perfil'

  function fmtNum(n?: number | null) {
    if (n == null) return '—'
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace('.0', '') + 'M'
    if (n >= 1_000)     return (n / 1_000).toFixed(1).replace('.0', '') + 'k'
    return String(n)
  }

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
        .fade-up { animation: fadeUp 0.5s ease both; }
      `}</style>

      <div style={{ minHeight: '100vh', background: S.bg, fontFamily: 'Inter, sans-serif', padding: '40px 20px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>

          {/* Header */}
          <div className="fade-up" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '36px' }}>
            <Image src="/logo-dark.png" alt="Logo" width={36} height={36} style={{ borderRadius: '9px' }} />
            <div>
              <div style={{ color: S.side, fontWeight: 900, fontSize: '13px', letterSpacing: '3px' }}>AMARANTS</div>
              <div style={{ color: S.verde, fontSize: '8px', letterSpacing: '2.5px', textTransform: 'uppercase' }}>Instagrowht</div>
            </div>
          </div>

          {/* Título */}
          <div className="fade-up" style={{ animationDelay: '0.1s', marginBottom: '20px' }}>
            <h1 style={{ color: S.texto, fontWeight: 900, fontSize: '28px', margin: '0 0 8px', letterSpacing: '-0.5px' }}>
              Diagnóstico do perfil <span style={{ color: S.verde }}>@{igName}</span>
            </h1>
            <p style={{ color: S.muted, fontSize: '15px', margin: 0 }}>
              Análise gerada por IA — resultados personalizados para o seu nicho
            </p>
          </div>

          {/* Perfil do Instagram */}
          {ig && (
            <div className="fade-up" style={{ animationDelay: '0.13s', background: S.card, border: `1px solid ${S.borda}`, borderRadius: '20px', padding: '20px 28px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
              {ig.profile_picture_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={ig.profile_picture_url}
                  alt={`@${igName}`}
                  width={68}
                  height={68}
                  style={{ borderRadius: '50%', objectFit: 'cover', border: `3px solid ${S.verde}`, flexShrink: 0 }}
                />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
                  <span style={{ color: S.texto, fontWeight: 900, fontSize: '17px' }}>@{igName}</span>
                  <span style={{ background: 'rgba(61,184,96,0.12)', border: '1px solid rgba(61,184,96,0.3)', color: S.verde, fontSize: '10px', fontWeight: 800, padding: '3px 10px', borderRadius: '20px', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                    ✓ Dados verificados pelo Instagram
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '28px' }}>
                  <div>
                    <div style={{ color: S.texto, fontWeight: 900, fontSize: '20px', lineHeight: 1 }}>{fmtNum(ig.followers_count)}</div>
                    <div style={{ color: S.muted, fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '3px' }}>Seguidores</div>
                  </div>
                  <div>
                    <div style={{ color: S.texto, fontWeight: 900, fontSize: '20px', lineHeight: 1 }}>{ig.media_count ?? '—'}</div>
                    <div style={{ color: S.muted, fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '3px' }}>Posts</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Score + métricas */}
          <div className="fade-up" style={{ animationDelay: '0.15s', background: S.card, border: `1px solid ${S.borda}`, borderRadius: '20px', padding: '32px', marginBottom: '20px', display: 'flex', gap: '40px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <ScoreCircle score={data.score} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: S.texto, fontWeight: 800, fontSize: '15px' }}>Score do Perfil</div>
                <div style={{ color: S.muted, fontSize: '12px' }}>
                  {data.score >= 70 ? 'Perfil forte' : data.score >= 50 ? 'Potencial a desenvolver' : 'Precisa de atenção'}
                </div>
              </div>
            </div>
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', minWidth: '240px' }}>
              {[
                { label: 'Risco Shadowban',   valor: data.risco_shadowban,      cor: sbCor              },
                { label: 'Engajamento est.',  valor: data.engajamento_estimado, cor: S.texto            },
                { label: 'Frequência atual',  valor: data.frequencia_atual,     cor: S.texto            },
                { label: 'Nível de crescimento', valor: data.score >= 70 ? 'Avançado' : data.score >= 50 ? 'Intermediário' : 'Iniciante', cor: S.verde },
              ].map(m => (
                <div key={m.label} style={{ background: '#f8f9fb', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ color: S.muted, fontSize: '11px', fontWeight: 600, letterSpacing: '0.5px', marginBottom: '6px', textTransform: 'uppercase' }}>{m.label}</div>
                  <div style={{ color: m.cor, fontWeight: 800, fontSize: '16px', textTransform: 'capitalize' }}>{m.valor}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Pontos fortes / fracos */}
          <div className="fade-up" style={{ animationDelay: '0.2s', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            {/* Fortes */}
            <div style={{ background: S.card, border: `1px solid ${S.borda}`, borderRadius: '20px', padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: 'rgba(61,184,96,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>💪</div>
                <div style={{ color: S.texto, fontWeight: 800, fontSize: '15px' }}>Pontos Fortes</div>
              </div>
              {(data.pontos_fortes || []).map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '12px' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(61,184,96,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', flexShrink: 0, marginTop: '1px' }}>✓</div>
                  <span style={{ color: S.texto, fontSize: '13px', lineHeight: 1.5 }}>{p}</span>
                </div>
              ))}
            </div>

            {/* Fracos */}
            <div style={{ background: S.card, border: `1px solid ${S.borda}`, borderRadius: '20px', padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🎯</div>
                <div style={{ color: S.texto, fontWeight: 800, fontSize: '15px' }}>Oportunidades</div>
              </div>
              {(data.pontos_fracos || []).map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '12px' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(239,68,68,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#ef4444', flexShrink: 0, marginTop: '1px' }}>!</div>
                  <span style={{ color: S.texto, fontSize: '13px', lineHeight: 1.5 }}>{p}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="fade-up" style={{ animationDelay: '0.25s', background: `linear-gradient(135deg, ${S.side} 0%, #1a3a6e 100%)`, borderRadius: '20px', padding: '36px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
            <div>
              <div style={{ color: '#fff', fontWeight: 900, fontSize: '20px', marginBottom: '8px' }}>
                Pronto para ver seu plano de ação? 🚀
              </div>
              <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '14px' }}>
                Metas de 30, 60 e 90 dias + plano detalhado dos primeiros 7 dias
              </div>
            </div>
            <button
              onClick={() => { window.location.href = '/amarantsinstagrouth/action-plan' }}
              style={{ padding: '16px 36px', background: S.verde, color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 800, fontSize: '16px', cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: '0 4px 16px rgba(61,184,96,0.4)', fontFamily: 'Inter, sans-serif', letterSpacing: '0.3px' }}
            >
              Ver meu plano de ação →
            </button>
          </div>

        </div>
      </div>
    </>
  )
}

export default function AnalyzePageWrapper() {
  return (
    <Suspense>
      <AnalyzePage />
    </Suspense>
  )
}
