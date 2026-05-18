"use client"

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
  muted2: '#9ca3af',
}

const metricas = [
  { label: 'Seguidores',      valor: '24.8K', variacao: '+12.4%', sub: 'vs mês anterior', up: true  },
  { label: 'Engajamento',     valor: '6.2%',  variacao: '+1.8%',  sub: 'acima da média',  up: true  },
  { label: 'Posts Gerados',   valor: '34',    variacao: '+8',     sub: 'acima da meta',   up: true  },
  { label: 'Alcance Orgânico',valor: '182K',  variacao: '-2.1%',  sub: 'esta semana',     up: false },
]

const posts = [
  { tipo: '🎠', titulo: '5 estratégias de marketing para 2026',   sub: 'Carrossel · 14 mai, 09:00', status: 'Agendado',  cor: '#3db860', bg: 'rgba(61,184,96,0.1)'   },
  { tipo: '🎬', titulo: 'Como dobrei meu engajamento em 30 dias', sub: 'Reel · 15 mai, 18:00',      status: 'Agendado',  cor: '#3db860', bg: 'rgba(61,184,96,0.1)'   },
  { tipo: '📖', titulo: 'Enquete: Qual conteúdo você prefere?',   sub: 'Story · Rascunho',           status: 'Rascunho',  cor: '#9ca3af', bg: 'rgba(156,163,175,0.1)' },
  { tipo: '🎠', titulo: '10 erros que destroem seu perfil',       sub: 'Carrossel · 12 mai',         status: 'Publicado', cor: '#2563eb', bg: 'rgba(37,99,235,0.1)'   },
]

const atividades = [
  { icon: '✦', bg: 'rgba(61,184,96,0.15)',  cor: '#3db860', texto: 'IA gerou carrossel "5 estratégias"', tempo: 'há 2 horas' },
  { icon: '✓', bg: 'rgba(61,184,96,0.12)',  cor: '#2d9e50', texto: 'Post publicado com sucesso',          tempo: 'hoje, 09:00' },
  { icon: '⏰', bg: 'rgba(245,158,11,0.12)', cor: '#f59e0b', texto: 'Reel agendado para amanhã 18h',      tempo: 'há 5 horas'  },
  { icon: '📊', bg: 'rgba(37,99,235,0.12)',  cor: '#2563eb', texto: 'Analytics sincronizado',             tempo: 'há 1 dia'    },
]

const stats = [
  { label: 'Esta semana', valor: '8',    icon: '📝', sub: 'posts criados'  },
  { label: 'Agendados',   valor: '12',   icon: '📅', sub: 'próx. 7 dias'   },
  { label: 'Taxa Salvos', valor: '4.8%', icon: '🔖', sub: 'acima da média' },
  { label: 'Melhor hora', valor: '19h',  icon: '⚡', sub: 'maior alcance'  },
]

async function handleLogout() {
  await supabase.auth.signOut()
  window.location.href = '/login'
}

export default function Dashboard() {
  return (
    <div style={{ background: S.bg, minHeight: '100vh', display: 'flex', fontFamily: 'Inter, sans-serif' }}>

      {/* SIDEBAR ESCURA */}
      <aside style={{
        width: '248px', flexShrink: 0,
        background: S.side,
        borderRight: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', flexDirection: 'column',
        position: 'sticky', top: 0, height: '100vh',
      }}>

        {/* Logo */}
        <div style={{ padding: '24px 22px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Image src="/logo.png" alt="Logo" width={40} height={40} style={{ borderRadius: '10px' }} />
            <div>
              <div style={{ color: '#ffffff', fontWeight: 900, fontSize: '14px', letterSpacing: '2px' }}>AMARANTS</div>
              <div style={{ color: S.verde, fontSize: '9px', letterSpacing: '2px', marginTop: '2px', textTransform: 'uppercase' }}>Instagrowht</div>
            </div>
          </div>
        </div>

        {/* Conta */}
        <div style={{ padding: '14px 22px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '34px', height: '34px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #1a3a6e, #3db860)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 800, fontSize: '13px', flexShrink: 0,
          }}>J</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: '#ffffff', fontSize: '12px', fontWeight: 600 }}>Jhonatas</div>
            <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '10px', marginTop: '2px' }}>@suamarca.co</div>
          </div>
          <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: S.verde, boxShadow: '0 0 6px rgba(61,184,96,0.8)' }} />
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 10px', overflowY: 'auto' }}>
          {[
            { grupo: 'Principal', items: [
              { icon: '⊞',  label: 'Dashboard',      ativo: true,  badge: '',   href: '/dashboard' },
              { icon: '✦',  label: 'Gerar Conteúdo', ativo: false, badge: 'IA', href: '/generate'  },
              { icon: '📅', label: 'Calendário',     ativo: false, badge: '',   href: '/calendar'  },
              { icon: '📋', label: 'Templates',      ativo: false, badge: '',   href: '#'          },
            ]},
            { grupo: 'Instagram', items: [
              { icon: '📊', label: 'Analytics',   ativo: false, badge: '', href: '#' },
              { icon: '🤖', label: 'Automações',  ativo: false, badge: '', href: '#' },
              { icon: '🕐', label: 'Agendamento', ativo: false, badge: '', href: '#' },
            ]},
            { grupo: 'Conta', items: [
              { icon: '⚙️', label: 'Configurações', ativo: false, badge: '', href: '#' },
              { icon: '💳', label: 'Planos',        ativo: false, badge: '', href: '#' },
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
                  transition: 'all 0.15s',
                }}>
                  <span style={{ fontSize: '14px', width: '18px', textAlign: 'center' }}>{item.icon}</span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.badge && (
                    <span style={{ background: S.verde, color: '#fff', fontSize: '8px', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>
                      {item.badge}
                    </span>
                  )}
                </a>
              ))}
            </div>
          ))}
        </nav>

        {/* Plano */}
        <div style={{ padding: '14px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{
            background: 'rgba(61,184,96,0.1)',
            border: '1px solid rgba(61,184,96,0.2)',
            borderRadius: '12px', padding: '16px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div>
                <div style={{ color: S.verde, fontSize: '10px', fontWeight: 800, letterSpacing: '1.5px' }}>✦ PLANO PRO</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', marginTop: '3px' }}>87 de 200 posts</div>
              </div>
              <div style={{ color: S.verde, fontWeight: 800, fontSize: '14px' }}>43%</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '4px', height: '5px', marginBottom: '14px' }}>
              <div style={{ background: `linear-gradient(90deg, ${S.verde}, ${S.verde2})`, height: '5px', borderRadius: '4px', width: '43%', boxShadow: '0 0 8px rgba(61,184,96,0.4)' }} />
            </div>
            <button style={{
              width: '100%', background: S.verde, color: '#fff',
              border: 'none', borderRadius: '8px', padding: '9px',
              fontSize: '11px', fontWeight: 800, cursor: 'pointer',
              letterSpacing: '0.5px', fontFamily: 'Inter, sans-serif',
              boxShadow: '0 4px 12px rgba(61,184,96,0.3)',
            }}>
              UPGRADE → BUSINESS
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTEÚDO CLARO */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '36px 40px' }}>

        {/* Topbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
              <h1 style={{ color: S.azul, fontWeight: 900, fontSize: '26px', letterSpacing: '-0.5px', margin: 0 }}>Visão Geral</h1>
              <span style={{
                background: 'rgba(61,184,96,0.1)', color: S.verde2,
                fontSize: '9px', fontWeight: 800, padding: '4px 10px',
                borderRadius: '20px', border: '1px solid rgba(61,184,96,0.25)', letterSpacing: '1.5px',
              }}>● AO VIVO</span>
            </div>
            <p style={{ color: S.muted, fontSize: '13px', margin: 0 }}>Maio 2026 · @suamarca.co · Atualizado agora</p>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button style={{
              background: S.card, color: S.muted,
              border: `1px solid ${S.borda2}`, borderRadius: '9px',
              padding: '10px 18px', fontSize: '12px', cursor: 'pointer',
              fontFamily: 'Inter, sans-serif', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            }}>
              Últimos 30 dias ▾
            </button>
            <button style={{
              background: S.verde, color: '#fff', border: 'none',
              borderRadius: '9px', padding: '10px 22px',
              fontWeight: 800, fontSize: '13px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '8px',
              boxShadow: '0 4px 16px rgba(61,184,96,0.35)',
              fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
            }}>
              ✦ Gerar com IA
            </button>
            <button onClick={handleLogout} style={{
              background: 'rgba(239,68,68,0.08)', color: '#ef4444',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: '9px', padding: '10px 16px',
              fontSize: '12px', fontWeight: 600, cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
            }}>
              Sair
            </button>
          </div>
        </div>

        {/* Métricas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }}>
          {metricas.map((m) => (
            <div key={m.label} style={{
              background: S.card, border: `1px solid ${S.borda}`,
              borderRadius: '16px', padding: '22px',
              position: 'relative', overflow: 'hidden', cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              transition: 'all 0.2s',
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                background: m.up
                  ? `linear-gradient(90deg, ${S.verde}, rgba(61,184,96,0.2), transparent)`
                  : 'linear-gradient(90deg, #ef4444, rgba(239,68,68,0.2), transparent)',
              }} />
              <div style={{ color: S.muted2, fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '14px' }}>
                {m.label}
              </div>
              <div style={{ color: S.azul, fontWeight: 900, fontSize: '30px', letterSpacing: '-1.5px', marginBottom: '10px', lineHeight: 1 }}>
                {m.valor}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <span style={{
                  background: m.up ? 'rgba(61,184,96,0.1)' : 'rgba(239,68,68,0.1)',
                  color: m.up ? S.verde2 : '#ef4444',
                  fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px',
                  border: m.up ? '1px solid rgba(61,184,96,0.2)' : '1px solid rgba(239,68,68,0.2)',
                }}>
                  {m.up ? '↑' : '↓'} {m.variacao}
                </span>
                <span style={{ color: S.muted, fontSize: '11px' }}>{m.sub}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Banner IA */}
        <div style={{
          background: 'linear-gradient(135deg, #0d1f3c, #1a3a6e)',
          borderRadius: '16px', padding: '20px 24px', marginBottom: '24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
              background: 'rgba(61,184,96,0.2)', border: '1px solid rgba(61,184,96,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
            }}>✦</div>
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: '14px', marginBottom: '3px' }}>Motor de IA pronto para gerar</div>
              <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '12px' }}>GPT-4o + Claude · Posts, carrosséis, reels, stories e banners</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexShrink: 0, flexWrap: 'wrap' }}>
            {['📸 Post', '🎠 Carrossel', '🎬 Reel', '📖 Story', '🖼️ Banner'].map((chip, i) => (
              <div key={chip} style={{
                padding: '6px 13px', borderRadius: '20px', fontSize: '11px', cursor: 'pointer',
                background: i === 0 ? 'rgba(61,184,96,0.25)' : 'rgba(255,255,255,0.08)',
                color: i === 0 ? '#6ee04a' : 'rgba(255,255,255,0.6)',
                border: i === 0 ? '1px solid rgba(61,184,96,0.4)' : '1px solid rgba(255,255,255,0.1)',
                fontWeight: i === 0 ? 600 : 400,
              }}>
                {chip}
              </div>
            ))}
          </div>
        </div>

        {/* Grid inferior */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '14px' }}>

          {/* Posts */}
          <div style={{ background: S.card, border: `1px solid ${S.borda}`, borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <h2 style={{ color: S.azul, fontWeight: 700, fontSize: '15px', margin: 0 }}>Conteúdo Recente</h2>
              <span style={{ color: S.verde2, fontSize: '12px', cursor: 'pointer', fontWeight: 500 }}>Ver todos →</span>
            </div>
            <p style={{ color: S.muted, fontSize: '12px', marginBottom: '18px' }}>Gerados e agendados pela IA</p>

            <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', background: S.card2, padding: '4px', borderRadius: '9px', width: 'fit-content', border: `1px solid ${S.borda}` }}>
              {['Todos', 'Agendados', 'Rascunhos', 'Publicados'].map((tab, i) => (
                <div key={tab} style={{
                  padding: '5px 14px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer',
                  background: i === 0 ? S.card : 'transparent',
                  color: i === 0 ? S.azul : S.muted,
                  fontWeight: i === 0 ? 600 : 400,
                  border: i === 0 ? `1px solid ${S.borda2}` : 'none',
                  boxShadow: i === 0 ? '0 1px 4px rgba(0,0,0,0.06)' : 'none',
                }}>
                  {tab}
                </div>
              ))}
            </div>

            {posts.map((post, i) => (
              <div key={i}
                style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '11px 12px', borderRadius: '10px', marginBottom: '3px', cursor: 'pointer', transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.background = S.card2)}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <div style={{
                  width: '44px', height: '44px', background: S.card2,
                  border: `1px solid ${S.borda}`, borderRadius: '10px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '20px', flexShrink: 0,
                }}>
                  {post.tipo}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: S.texto, fontSize: '13px', fontWeight: 500, marginBottom: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{post.titulo}</div>
                  <div style={{ color: S.muted, fontSize: '11px' }}>{post.sub}</div>
                </div>
                <div style={{
                  padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, flexShrink: 0,
                  background: post.bg, color: post.cor, border: `1px solid ${post.cor}33`,
                }}>
                  {post.status}
                </div>
              </div>
            ))}
          </div>

          {/* Coluna direita */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

            <div style={{ background: S.card, border: `1px solid ${S.borda}`, borderRadius: '16px', padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              {stats.map((s) => (
                <div key={s.label} style={{ background: S.card2, borderRadius: '10px', padding: '14px', border: `1px solid ${S.borda}` }}>
                  <div style={{ fontSize: '16px', marginBottom: '8px' }}>{s.icon}</div>
                  <div style={{ color: S.azul, fontWeight: 800, fontSize: '18px', marginBottom: '2px' }}>{s.valor}</div>
                  <div style={{ color: S.muted, fontSize: '10px' }}>{s.sub}</div>
                </div>
              ))}
            </div>

            <div style={{ background: S.card, border: `1px solid ${S.borda}`, borderRadius: '16px', padding: '20px', flex: 1, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ color: S.azul, fontWeight: 700, fontSize: '14px', margin: 0 }}>Atividade</h3>
                <span style={{ color: S.muted, fontSize: '10px' }}>Hoje</span>
              </div>
              {atividades.map((a, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px 0',
                  borderBottom: i < atividades.length - 1 ? `1px solid ${S.borda}` : 'none',
                }}>
                  <div style={{
                    width: '30px', height: '30px', borderRadius: '8px',
                    background: a.bg, color: a.cor, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '13px', fontWeight: 700,
                  }}>
                    {a.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: S.texto, fontSize: '12px', marginBottom: '2px', lineHeight: 1.4 }}>{a.texto}</div>
                    <div style={{ color: S.muted, fontSize: '10px' }}>{a.tempo}</div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}