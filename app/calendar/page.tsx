"use client"

import { useState, useEffect } from 'react'
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

const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

const FORMATO_CORES: Record<string, { bg: string; cor: string }> = {
  reel:      { bg: 'rgba(139,92,246,0.12)', cor: '#7c3aed' },
  carrossel: { bg: 'rgba(37,99,235,0.12)',  cor: '#1d4ed8' },
  post:      { bg: 'rgba(61,184,96,0.12)',  cor: '#2d9e50' },
  story:     { bg: 'rgba(245,158,11,0.12)', cor: '#d97706' },
  banner:    { bg: 'rgba(239,68,68,0.12)',  cor: '#dc2626' },
}

interface ContentItem {
  id: string; tipo: string; titulo: string; legenda: string
  hashtags: string[]; horario: string; status: string
  scheduled_date: string; nicho: string; cta: string
}

export default function Calendar() {
  const hoje    = new Date()
  const [mes,   setMes]   = useState(hoje.getMonth())
  const [ano,   setAno]   = useState(hoje.getFullYear())
  const [posts, setPosts] = useState<ContentItem[]>([])
  const [selecionado, setSelecionado] = useState<ContentItem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { carregarPosts() }, [])

  async function carregarPosts() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }
    const response = await fetch(`/api/posts?userId=${user.id}`)
    const json = await response.json()
    setPosts(json.data || [])
    setLoading(false)
  }

  function getDias() {
    const primeiroDia = new Date(ano, mes, 1).getDay()
    const totalDias   = new Date(ano, mes + 1, 0).getDate()
    const dias = []
    for (let i = 0; i < primeiroDia; i++) dias.push(null)
    for (let d = 1; d <= totalDias; d++) dias.push(d)
    return dias
  }

  function getPostsDoDia(dia: number) {
    return posts.filter(p => {
      if (!p.scheduled_date) return false
      const partes = p.scheduled_date.split('-')
      return parseInt(partes[2]) === dia &&
             parseInt(partes[1]) - 1 === mes &&
             parseInt(partes[0]) === ano
    })
  }

  const dias = getDias()
  const postsMes = posts.filter(p => {
    if (!p.scheduled_date) return false
    const partes = p.scheduled_date.split('-')
    return parseInt(partes[1]) - 1 === mes && parseInt(partes[0]) === ano
  })

  return (
    <div style={{ background: S.bg, minHeight: '100vh', display: 'flex', fontFamily: 'Inter, sans-serif' }}>

      {/* SIDEBAR */}
      <aside style={{
        width: '248px', flexShrink: 0, background: S.side,
        borderRight: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', flexDirection: 'column',
        position: 'sticky', top: 0, height: '100vh',
      }}>
        <div style={{ padding: '24px 22px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Image src="/logo.png" alt="Logo" width={40} height={40} style={{ borderRadius: '10px' }} />
            <div>
              <div style={{ color: '#fff', fontWeight: 900, fontSize: '14px', letterSpacing: '2px' }}>AMARANTS</div>
              <div style={{ color: S.verde, fontSize: '9px', letterSpacing: '2px', marginTop: '2px', textTransform: 'uppercase' }}>Instagrowht</div>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '16px 10px' }}>
          {[
            { grupo: 'Principal', items: [
              { icon: '⊞',  label: 'Dashboard',      ativo: false, href: '/dashboard' },
              { icon: '✦',  label: 'Gerar Conteúdo', ativo: false, href: '/generate'  },
              { icon: '📅', label: 'Calendário',     ativo: true,  href: '/calendar'  },
              { icon: '📋', label: 'Templates',      ativo: false, href: '#'          },
            ]},
            { grupo: 'Instagram', items: [
              { icon: '📊', label: 'Analytics',   ativo: false, href: '#' },
              { icon: '🤖', label: 'Automações',  ativo: false, href: '#' },
              { icon: '🕐', label: 'Agendamento', ativo: false, href: '#' },
            ]},
          ].map((grupo) => (
            <div key={grupo.grupo} style={{ marginBottom: '6px' }}>
              <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '9px', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', padding: '8px 12px 6px' }}>
                {grupo.grupo}
              </div>
              {grupo.items.map((item) => (
                <a key={item.label} href={item.href} style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '9px 12px', borderRadius: '9px', marginBottom: '1px',
                  cursor: 'pointer', textDecoration: 'none',
                  background: item.ativo ? 'rgba(61,184,96,0.15)' : 'transparent',
                  borderLeft: item.ativo ? `2px solid ${S.verde}` : '2px solid transparent',
                  color: item.ativo ? S.verde : 'rgba(255,255,255,0.5)',
                  fontSize: '13px', fontWeight: item.ativo ? 600 : 400,
                }}>
                  <span style={{ fontSize: '14px', width: '18px', textAlign: 'center' }}>{item.icon}</span>
                  {item.label}
                </a>
              ))}
            </div>
          ))}
        </nav>

        {/* Legenda */}
        <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '9px', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>FORMATOS</div>
          {Object.entries(FORMATO_CORES).map(([fmt, { cor }]) => (
            <div key={fmt} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: cor, flexShrink: 0 }} />
              <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '11px', textTransform: 'capitalize' }}>{fmt}</span>
            </div>
          ))}
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, padding: '36px 40px', overflowY: 'auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
              <h1 style={{ color: S.azul, fontWeight: 900, fontSize: '26px', letterSpacing: '-0.5px', margin: 0 }}>
                Calendário Editorial
              </h1>
              <span style={{
                background: 'rgba(61,184,96,0.1)', color: S.verde2,
                fontSize: '9px', fontWeight: 800, padding: '4px 10px',
                borderRadius: '20px', border: '1px solid rgba(61,184,96,0.2)', letterSpacing: '1.5px',
              }}>📅 {posts.length} posts</span>
            </div>
            <p style={{ color: S.muted, fontSize: '13px', margin: 0 }}>
              Visualize e gerencie todo seu conteúdo
            </p>
          </div>
          <a href="/generate" style={{
            background: S.verde, color: '#fff',
            borderRadius: '9px', padding: '10px 20px',
            fontWeight: 800, fontSize: '13px', cursor: 'pointer',
            textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px',
            boxShadow: '0 4px 16px rgba(61,184,96,0.3)',
          }}>
            ✦ Gerar mais conteúdo
          </a>
        </div>

        {/* Navegação do mês */}
        <div style={{
          background: S.card, border: `1px solid ${S.borda}`,
          borderRadius: '16px', padding: '18px 24px', marginBottom: '16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}>
          <button onClick={() => { if (mes === 0) { setMes(11); setAno(ano-1) } else setMes(mes-1) }} style={{
            background: S.card2, border: `1px solid ${S.borda2}`, color: S.azul,
            borderRadius: '8px', padding: '8px 16px', cursor: 'pointer',
            fontSize: '16px', fontFamily: 'Inter, sans-serif',
          }}>←</button>

          <div style={{ textAlign: 'center' }}>
            <div style={{ color: S.azul, fontWeight: 900, fontSize: '20px' }}>
              {MESES[mes]} {ano}
            </div>
            <div style={{ color: S.muted, fontSize: '12px', marginTop: '2px' }}>
              {postsMes.length} posts neste mês
            </div>
          </div>

          <button onClick={() => { if (mes === 11) { setMes(0); setAno(ano+1) } else setMes(mes+1) }} style={{
            background: S.card2, border: `1px solid ${S.borda2}`, color: S.azul,
            borderRadius: '8px', padding: '8px 16px', cursor: 'pointer',
            fontSize: '16px', fontFamily: 'Inter, sans-serif',
          }}>→</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: selecionado ? '1fr 340px' : '1fr', gap: '16px', alignItems: 'start' }}>

          {/* Grade calendário */}
          <div style={{ background: S.card, border: `1px solid ${S.borda}`, borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', background: S.card2, borderBottom: `1px solid ${S.borda}` }}>
              {DIAS_SEMANA.map(d => (
                <div key={d} style={{ padding: '12px', textAlign: 'center', color: S.muted, fontSize: '11px', fontWeight: 700, letterSpacing: '1px' }}>
                  {d}
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
              {dias.map((dia, i) => {
                const isHoje = dia === hoje.getDate() && mes === hoje.getMonth() && ano === hoje.getFullYear()
                const postsHoje = dia ? getPostsDoDia(dia) : []

                return (
                  <div key={i} style={{
                    minHeight: '90px', padding: '8px',
                    borderRight: `1px solid ${S.borda}`,
                    borderBottom: `1px solid ${S.borda}`,
                    background: isHoje ? 'rgba(61,184,96,0.03)' : 'transparent',
                  }}>
                    {dia && (
                      <>
                        <div style={{
                          width: '26px', height: '26px', borderRadius: '50%',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: isHoje ? S.verde : 'transparent',
                          color: isHoje ? '#fff' : S.muted,
                          fontSize: '11px', fontWeight: isHoje ? 800 : 400,
                          marginBottom: '4px',
                        }}>
                          {dia}
                        </div>
                        {postsHoje.map((post, j) => {
                          const fmt = FORMATO_CORES[post.tipo] || FORMATO_CORES.post
                          return (
                            <div key={j} onClick={() => setSelecionado(post === selecionado ? null : post)} style={{
                              background: fmt.bg, color: fmt.cor,
                              borderRadius: '4px', padding: '3px 6px',
                              fontSize: '9px', fontWeight: 600,
                              marginBottom: '3px', cursor: 'pointer',
                              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                              border: `1px solid ${fmt.cor}33`,
                            }}>
                              {post.tipo.toUpperCase()} · {post.titulo?.slice(0, 12)}...
                            </div>
                          )
                        })}
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Detalhe */}
          {selecionado && (
            <div style={{
              background: S.card, border: `1px solid ${S.borda}`,
              borderRadius: '16px', padding: '24px',
              position: 'sticky', top: '20px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{
                  background: FORMATO_CORES[selecionado.tipo]?.bg || S.card2,
                  color: FORMATO_CORES[selecionado.tipo]?.cor || S.texto,
                  padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 700,
                }}>
                  {selecionado.tipo.toUpperCase()}
                </div>
                <button onClick={() => setSelecionado(null)} style={{
                  background: 'none', border: 'none', color: S.muted,
                  cursor: 'pointer', fontSize: '18px',
                }}>✕</button>
              </div>

              <h3 style={{ color: S.azul, fontWeight: 700, fontSize: '15px', marginBottom: '12px', lineHeight: 1.4 }}>
                {selecionado.titulo}
              </h3>

              {selecionado.cta && (
                <div style={{
                  background: 'rgba(61,184,96,0.06)', border: '1px solid rgba(61,184,96,0.15)',
                  borderRadius: '8px', padding: '10px 12px', marginBottom: '14px',
                }}>
                  <div style={{ color: S.muted, fontSize: '10px', fontWeight: 700, letterSpacing: '1px', marginBottom: '4px' }}>GANCHO</div>
                  <div style={{ color: S.verde2, fontSize: '12px', fontStyle: 'italic' }}>"{selecionado.cta}"</div>
                </div>
              )}

              <div style={{ marginBottom: '14px' }}>
                <div style={{ color: S.muted, fontSize: '10px', fontWeight: 700, letterSpacing: '1px', marginBottom: '6px' }}>LEGENDA</div>
                <p style={{ color: S.texto, fontSize: '12px', lineHeight: 1.7, margin: 0, maxHeight: '120px', overflowY: 'auto' }}>
                  {selecionado.legenda}
                </p>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <div style={{ color: S.muted, fontSize: '10px', fontWeight: 700, letterSpacing: '1px', marginBottom: '6px' }}>HASHTAGS</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {selecionado.hashtags?.map((h, i) => (
                    <span key={i} style={{
                      background: 'rgba(13,31,60,0.06)', color: S.azul,
                      border: `1px solid rgba(13,31,60,0.12)`,
                      padding: '3px 8px', borderRadius: '20px', fontSize: '10px',
                    }}>{h}</span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
                <div style={{ background: S.card2, borderRadius: '8px', padding: '10px', border: `1px solid ${S.borda}` }}>
                  <div style={{ color: S.muted, fontSize: '10px', marginBottom: '4px' }}>HORÁRIO</div>
                  <div style={{ color: S.verde2, fontWeight: 800 }}>⏰ {selecionado.horario}</div>
                </div>
                <div style={{ background: S.card2, borderRadius: '8px', padding: '10px', border: `1px solid ${S.borda}` }}>
                  <div style={{ color: S.muted, fontSize: '10px', marginBottom: '4px' }}>DATA</div>
                  <div style={{ color: S.azul, fontWeight: 700, fontSize: '12px' }}>
                    {selecionado.scheduled_date
                      ? new Date(selecionado.scheduled_date + 'T12:00:00').toLocaleDateString('pt-BR')
                      : '-'}
                  </div>
                </div>
              </div>

              <button style={{
                width: '100%', background: S.verde, color: '#fff',
                border: 'none', borderRadius: '9px', padding: '12px',
                fontSize: '13px', fontWeight: 800, cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                boxShadow: '0 4px 12px rgba(61,184,96,0.3)',
                marginBottom: '8px',
              }}>
                📅 Agendar este post
              </button>

              <button onClick={async () => {
                const texto = `${selecionado.legenda}\n\n${selecionado.hashtags?.join(' ')}`
                await navigator.clipboard.writeText(texto)
              }} style={{
                width: '100%', background: 'transparent', color: S.muted,
                border: `1px solid ${S.borda2}`, borderRadius: '9px', padding: '10px',
                fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
              }}>
                📋 Copiar legenda
              </button>
            </div>
          )}
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '48px', color: S.muted }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>⟳</div>
            Carregando calendário...
          </div>
        )}
      </main>
    </div>
  )
}