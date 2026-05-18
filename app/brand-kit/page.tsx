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

const nichos = [
  { id: 'terapeuta',     label: 'Terapeuta',           icon: '💆', grupo: 'Saúde & Bem-estar'    },
  { id: 'psicologo',     label: 'Psicólogo',           icon: '🧠', grupo: 'Saúde & Bem-estar'    },
  { id: 'medico',        label: 'Médico',              icon: '👨‍⚕️', grupo: 'Saúde & Bem-estar'  },
  { id: 'dentista',      label: 'Dentista',            icon: '🦷', grupo: 'Saúde & Bem-estar'    },
  { id: 'nutricionista', label: 'Nutricionista',       icon: '🥗', grupo: 'Saúde & Bem-estar'    },
  { id: 'personal',      label: 'Personal Trainer',    icon: '💪', grupo: 'Saúde & Bem-estar'    },
  { id: 'estetica',      label: 'Estética',            icon: '💅', grupo: 'Saúde & Bem-estar'    },
  { id: 'fisioterapia',  label: 'Fisioterapeuta',      icon: '🏃', grupo: 'Saúde & Bem-estar'    },
  { id: 'advogado',      label: 'Advogado',            icon: '⚖️', grupo: 'Jurídico & Finanças'  },
  { id: 'contador',      label: 'Contador',            icon: '📊', grupo: 'Jurídico & Finanças'  },
  { id: 'financeiro',    label: 'Consultor Financeiro',icon: '💰', grupo: 'Jurídico & Finanças'  },
  { id: 'corretor',      label: 'Corretor de Seguros', icon: '🛡️', grupo: 'Jurídico & Finanças'  },
  { id: 'coach',         label: 'Coach',               icon: '🎯', grupo: 'Negócios & Marketing'  },
  { id: 'consultoria',   label: 'Consultoria',         icon: '📋', grupo: 'Negócios & Marketing'  },
  { id: 'marketing',     label: 'Marketing Digital',   icon: '📱', grupo: 'Negócios & Marketing'  },
  { id: 'tech',          label: 'Tecnologia',          icon: '💻', grupo: 'Negócios & Marketing'  },
  { id: 'imobiliaria',   label: 'Imobiliária',         icon: '🏠', grupo: 'Imóveis & Construção'  },
  { id: 'arquitetura',   label: 'Arquitetura',         icon: '🏗️', grupo: 'Imóveis & Construção'  },
  { id: 'decoracao',     label: 'Decoração',           icon: '🛋️', grupo: 'Imóveis & Construção'  },
  { id: 'restaurante',   label: 'Restaurante',         icon: '🍕', grupo: 'Alimentação'           },
  { id: 'cafeteria',     label: 'Cafeteria',           icon: '☕', grupo: 'Alimentação'           },
  { id: 'confeitaria',   label: 'Confeitaria',         icon: '🎂', grupo: 'Alimentação'           },
  { id: 'delivery',      label: 'Delivery',            icon: '🛵', grupo: 'Alimentação'           },
  { id: 'moda',          label: 'Moda',                icon: '👗', grupo: 'Moda & Beleza'         },
  { id: 'salao',         label: 'Salão de Beleza',     icon: '✂️', grupo: 'Moda & Beleza'        },
  { id: 'makeup',        label: 'Maquiagem',           icon: '💄', grupo: 'Moda & Beleza'         },
  { id: 'barbearia',     label: 'Barbearia',           icon: '💈', grupo: 'Moda & Beleza'         },
  { id: 'educacao',      label: 'Educação',            icon: '📚', grupo: 'Educação'              },
  { id: 'curso',         label: 'Cursos Online',       icon: '🎓', grupo: 'Educação'              },
  { id: 'idiomas',       label: 'Idiomas',             icon: '🌍', grupo: 'Educação'              },
  { id: 'petshop',       label: 'Pet Shop',            icon: '🐾', grupo: 'Outros'                },
  { id: 'automotivo',    label: 'Automotivo',          icon: '🚗', grupo: 'Outros'                },
  { id: 'turismo',       label: 'Turismo & Viagens',   icon: '✈️', grupo: 'Outros'               },
  { id: 'esporte',       label: 'Esportes',            icon: '⚽', grupo: 'Outros'                },
]

const TONS = [
  { id: 'profissional', label: 'Profissional', icon: '👔' },
  { id: 'descontraido', label: 'Descontraído', icon: '😊' },
  { id: 'inspirador',   label: 'Inspirador',   icon: '✨' },
  { id: 'educativo',    label: 'Educativo',    icon: '📚' },
  { id: 'humoristico',  label: 'Humorístico',  icon: '😂' },
]

const OBJETIVOS = [
  { id: 'seguidores',  label: 'Ganhar Seguidores'    },
  { id: 'vendas',      label: 'Gerar Vendas'         },
  { id: 'autoridade',  label: 'Construir Autoridade' },
  { id: 'comunidade',  label: 'Criar Comunidade'     },
]

const FREQUENCIAS = [
  { id: '3x',    label: '3x por semana' },
  { id: '5x',    label: '5x por semana' },
  { id: 'diario',label: 'Todos os dias' },
  { id: '7x',    label: '7x por semana (+ stories)' },
]

const labelStyle: React.CSSProperties = {
  color: S.muted, fontSize: '11px', fontWeight: 700,
  display: 'block', marginBottom: '7px', letterSpacing: '1px',
}

const inputStyle = (filled: boolean): React.CSSProperties => ({
  width: '100%', padding: '12px 14px', background: S.card2,
  border: `1.5px solid ${filled ? S.verde : S.borda2}`, borderRadius: '9px',
  color: S.texto, fontSize: '13px', outline: 'none',
  fontFamily: 'Inter, sans-serif', boxSizing: 'border-box', transition: 'border-color 0.2s',
})

const sectionCard: React.CSSProperties = {
  background: S.card, border: `1px solid ${S.borda}`, borderRadius: '16px',
  padding: '28px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
}

function Sidebar() {
  return (
    <aside style={{ width: '248px', flexShrink: 0, background: S.side, borderRight: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh' }}>
      <div style={{ padding: '24px 22px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Image src="/logo.png" alt="Logo" width={40} height={40} style={{ borderRadius: '10px' }} />
          <div>
            <div style={{ color: '#fff', fontWeight: 900, fontSize: '14px', letterSpacing: '2px' }}>AMARANTS</div>
            <div style={{ color: S.verde, fontSize: '9px', letterSpacing: '2px', marginTop: '2px', textTransform: 'uppercase' }}>Instagrowht</div>
          </div>
        </div>
      </div>
      <nav style={{ flex: 1, padding: '16px 10px', overflowY: 'auto' }}>
        {[
          { grupo: 'Principal', items: [
            { icon: '⊞', label: 'Dashboard',      href: '/dashboard', ativo: false },
            { icon: '✦', label: 'Gerar Conteúdo', href: '/generate',  ativo: false },
            { icon: '📅', label: 'Calendário',    href: '/calendar',  ativo: false },
          ]},
          { grupo: 'Instagram', items: [
            { icon: '📊', label: 'Analytics',   href: '#', ativo: false },
            { icon: '🤖', label: 'Automações',  href: '#', ativo: false },
            { icon: '🕐', label: 'Agendamento', href: '#', ativo: false },
          ]},
          { grupo: 'Conta', items: [
            { icon: '🎨', label: 'Brand Kit',      href: '/brand-kit', ativo: true  },
            { icon: '⚙️', label: 'Configurações', href: '#',          ativo: false },
            { icon: '💎', label: 'Planos',         href: '#',          ativo: false },
          ]},
        ].map(g => (
          <div key={g.grupo} style={{ marginBottom: '6px' }}>
            <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '9px', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', padding: '8px 12px 6px' }}>{g.grupo}</div>
            {g.items.map(item => (
              <a key={item.label} href={item.href}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '9px', marginBottom: '1px', cursor: 'pointer', textDecoration: 'none', background: item.ativo ? 'rgba(61,184,96,0.15)' : 'transparent', borderLeft: item.ativo ? `2px solid ${S.verde}` : '2px solid transparent', color: item.ativo ? S.verde : 'rgba(255,255,255,0.5)', fontSize: '13px', fontWeight: item.ativo ? 600 : 400 }}>
                <span style={{ fontSize: '14px', width: '18px', textAlign: 'center' }}>{item.icon}</span>
                {item.label}
              </a>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  )
}

export default function BrandKit() {
  const router = useRouter()

  const [userId,  setUserId]  = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [salvando,setSalvando]= useState(false)
  const [sucesso, setSucesso] = useState(false)
  const [erro,    setErro]    = useState('')

  // Seção 1 — Identidade
  const [nomeMarca,       setNomeMarca]       = useState('')
  const [nomeDono,        setNomeDono]        = useState('')
  const [cidade,          setCidade]          = useState('')
  const [instagramHandle, setInstagramHandle] = useState('')
  const [tipoPerfil,      setTipoPerfil]      = useState('')

  // Seção 2 — Posicionamento
  const [nicho,           setNicho]           = useState('')
  const [publicoAlvo,     setPublicoAlvo]     = useState('')
  const [produtoServico,  setProdutoServico]  = useState('')

  // Seção 3 — Tom de voz
  const [tomVoz,            setTomVoz]            = useState('')
  const [palavrasPositivas, setPalavrasPositivas] = useState('')
  const [palavrasNegativas, setPalavrasNegativas] = useState('')

  // Seção 4 — Objetivos
  const [objetivoInstagram, setObjetivoInstagram] = useState('')
  const [metaSeguidores,    setMetaSeguidores]    = useState('')
  const [frequenciaPosts,   setFrequenciaPosts]   = useState('')

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUserId(user.id)
      const { data } = await supabase.from('brand_kit').select('*').eq('user_id', user.id).single()
      if (data) {
        setNomeMarca(data.nome_marca || '')
        setNomeDono(data.nome_dono || '')
        setCidade(data.cidade || '')
        setInstagramHandle(data.instagram_handle || '')
        setTipoPerfil(data.tipo_perfil || '')
        setNicho(data.nicho || '')
        setPublicoAlvo(data.publico_alvo || '')
        setProdutoServico(data.produto_servico || '')
        setTomVoz(data.tom_de_voz || '')
        setPalavrasPositivas(data.palavras_positivas || '')
        setPalavrasNegativas(data.palavras_negativas || '')
        setObjetivoInstagram(data.objetivo_instagram || '')
        setMetaSeguidores(data.meta_seguidores || '')
        setFrequenciaPosts(data.frequencia_posts || '')
      }
      setLoading(false)
    }
    load()
  }, [router])

  async function handleSalvar() {
    if (!userId) return
    setSalvando(true)
    setErro('')
    setSucesso(false)
    try {
      const { error } = await supabase.from('brand_kit').upsert({
        user_id:            userId,
        nome_marca:         nomeMarca,
        nome_dono:          nomeDono,
        cidade,
        instagram_handle:   instagramHandle,
        tipo_perfil:        tipoPerfil,
        nicho,
        publico_alvo:       publicoAlvo,
        produto_servico:    produtoServico,
        tom_de_voz:         tomVoz,
        palavras_positivas: palavrasPositivas,
        palavras_negativas: palavrasNegativas,
        objetivo_instagram: objetivoInstagram,
        meta_seguidores:    metaSeguidores,
        frequencia_posts:   frequenciaPosts,
        updated_at:         new Date().toISOString(),
      }, { onConflict: 'user_id' })
      if (error) throw error
      setSucesso(true)
      setTimeout(() => setSucesso(false), 3000)
    } catch (e: any) {
      setErro(e.message)
    } finally {
      setSalvando(false)
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: S.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ color: S.muted, fontSize: '13px' }}>Carregando Brand Kit...</div>
      </div>
    )
  }

  const nichoSel = nichos.find(n => n.id === nicho)

  return (
    <div style={{ background: S.bg, minHeight: '100vh', display: 'flex', fontFamily: 'Inter, sans-serif' }}>
      <Sidebar />

      <main style={{ flex: 1, padding: '36px 40px', overflowY: 'auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
              <h1 style={{ color: S.azul, fontWeight: 900, fontSize: '26px', letterSpacing: '-0.5px', margin: 0 }}>Brand Kit</h1>
              <span style={{ background: 'rgba(61,184,96,0.1)', color: S.verde2, fontSize: '9px', fontWeight: 800, padding: '4px 10px', borderRadius: '20px', border: '1px solid rgba(61,184,96,0.2)', letterSpacing: '1.5px' }}>✦ MARCA</span>
            </div>
            <p style={{ color: S.muted, fontSize: '13px', margin: 0 }}>Informações que a IA usa para criar conteúdo consistente com sua marca</p>
          </div>
          <button onClick={handleSalvar} disabled={salvando}
            style={{ padding: '12px 28px', background: sucesso ? S.verde2 : salvando ? 'rgba(61,184,96,0.5)' : S.verde, color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 800, cursor: salvando ? 'not-allowed' : 'pointer', boxShadow: salvando ? 'none' : '0 4px 16px rgba(61,184,96,0.3)', fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}>
            {salvando
              ? <><span style={{ display: 'inline-block', animation: 'spin 0.8s linear infinite' }}>⟳</span> Salvando...</>
              : sucesso ? '✓ Salvo com sucesso!'
              : '💾 Salvar alterações'}
          </button>
        </div>

        {erro && (
          <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontSize: '12px', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px' }}>
            ⚠️ {erro}
          </div>
        )}

        {/* ── SEÇÃO 1: Identidade ── */}
        <div style={sectionCard}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(13,31,60,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🏷️</div>
            <div>
              <div style={{ color: S.azul, fontWeight: 800, fontSize: '15px' }}>Identidade</div>
              <div style={{ color: S.muted, fontSize: '12px' }}>Informações básicas da sua marca</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>NOME DA MARCA / NEGÓCIO</label>
              <input type="text" value={nomeMarca} onChange={e => setNomeMarca(e.target.value)} placeholder="Ex: Studio Beleza Silva" style={inputStyle(!!nomeMarca)} />
            </div>
            <div>
              <label style={labelStyle}>SEU NOME</label>
              <input type="text" value={nomeDono} onChange={e => setNomeDono(e.target.value)} placeholder="Ex: Maria Silva" style={inputStyle(!!nomeDono)} />
            </div>
            <div>
              <label style={labelStyle}>CIDADE / ESTADO</label>
              <input type="text" value={cidade} onChange={e => setCidade(e.target.value)} placeholder="Ex: São Paulo, SP" style={inputStyle(!!cidade)} />
            </div>
            <div>
              <label style={labelStyle}>@ DO INSTAGRAM</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: S.muted, fontWeight: 700, fontSize: '14px', pointerEvents: 'none' }}>@</div>
                <input type="text" value={instagramHandle} onChange={e => setInstagramHandle(e.target.value.replace('@', ''))} placeholder="seuperfil"
                  style={{ width: '100%', padding: '12px 14px 12px 28px', background: S.card2, border: `1.5px solid ${instagramHandle ? S.verde : S.borda2}`, borderRadius: '9px', color: S.texto, fontSize: '13px', outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>TIPO DE PERFIL</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[
                  { id: 'pessoal',  label: 'Pessoal',  icon: '👤' },
                  { id: 'negocios', label: 'Negócios', icon: '🏢' },
                  { id: 'criador',  label: 'Criador',  icon: '🎨' },
                ].map(t => (
                  <div key={t.id} onClick={() => setTipoPerfil(t.id)}
                    style={{ flex: 1, padding: '10px 8px', borderRadius: '9px', cursor: 'pointer', textAlign: 'center', background: tipoPerfil === t.id ? 'rgba(61,184,96,0.08)' : S.card2, border: tipoPerfil === t.id ? `2px solid ${S.verde}` : `1px solid ${S.borda}`, transition: 'all 0.15s' }}>
                    <div style={{ fontSize: '18px', marginBottom: '4px' }}>{t.icon}</div>
                    <div style={{ color: tipoPerfil === t.id ? S.verde2 : S.texto, fontSize: '11px', fontWeight: 600 }}>{t.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── SEÇÃO 2: Posicionamento ── */}
        <div style={sectionCard}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(61,184,96,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🎯</div>
            <div>
              <div style={{ color: S.azul, fontWeight: 800, fontSize: '15px' }}>Posicionamento</div>
              <div style={{ color: S.muted, fontSize: '12px' }}>Nicho, público-alvo e oferta principal</div>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>NICHO PRINCIPAL</label>
            {nichoSel && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: 'rgba(61,184,96,0.06)', border: `1px solid rgba(61,184,96,0.2)`, borderRadius: '9px', marginBottom: '10px', width: 'fit-content' }}>
                <span style={{ fontSize: '20px' }}>{nichoSel.icon}</span>
                <span style={{ color: S.verde2, fontWeight: 700, fontSize: '13px' }}>{nichoSel.label}</span>
                <button onClick={() => setNicho('')} style={{ background: 'none', border: 'none', color: S.muted, cursor: 'pointer', fontSize: '12px', marginLeft: '4px', fontFamily: 'Inter, sans-serif' }}>✕ alterar</button>
              </div>
            )}
            {!nichoSel && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', maxHeight: '200px', overflowY: 'auto', padding: '2px' }}>
                {nichos.map(n => (
                  <div key={n.id} onClick={() => setNicho(n.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', borderRadius: '9px', cursor: 'pointer', transition: 'all 0.15s', background: S.card2, border: `1px solid ${S.borda}` }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = S.verde; e.currentTarget.style.background = 'rgba(61,184,96,0.04)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = S.borda; e.currentTarget.style.background = S.card2 }}>
                    <span style={{ fontSize: '16px' }}>{n.icon}</span>
                    <span style={{ color: S.texto, fontSize: '11px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={labelStyle}>PÚBLICO-ALVO</label>
              <input type="text" value={publicoAlvo} onChange={e => setPublicoAlvo(e.target.value)} placeholder="Ex: Mulheres de 25-40 anos que buscam bem-estar" style={inputStyle(!!publicoAlvo)} />
            </div>
            <div>
              <label style={labelStyle}>PRINCIPAL PRODUTO / SERVIÇO</label>
              <input type="text" value={produtoServico} onChange={e => setProdutoServico(e.target.value)} placeholder="Ex: Consultas de nutrição e acompanhamento mensal" style={inputStyle(!!produtoServico)} />
            </div>
          </div>
        </div>

        {/* ── SEÇÃO 3: Tom de voz ── */}
        <div style={sectionCard}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(124,58,237,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🗣️</div>
            <div>
              <div style={{ color: S.azul, fontWeight: 800, fontSize: '15px' }}>Tom de Voz</div>
              <div style={{ color: S.muted, fontSize: '12px' }}>Como sua marca se comunica</div>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>TOM SELECIONADO</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
              {TONS.map(t => (
                <div key={t.id} onClick={() => setTomVoz(t.id)}
                  style={{ padding: '14px 8px', borderRadius: '12px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s', background: tomVoz === t.id ? 'rgba(61,184,96,0.08)' : S.card2, border: tomVoz === t.id ? `2px solid ${S.verde}` : `1px solid ${S.borda}` }}>
                  <div style={{ fontSize: '24px', marginBottom: '6px' }}>{t.icon}</div>
                  <div style={{ color: tomVoz === t.id ? S.verde2 : S.azul, fontSize: '12px', fontWeight: 700 }}>{t.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={labelStyle}>PALAVRAS QUE COMBINAM</label>
              <input type="text" value={palavrasPositivas} onChange={e => setPalavrasPositivas(e.target.value)} placeholder="Ex: moderno, confiável, inovador" style={inputStyle(!!palavrasPositivas)} />
            </div>
            <div>
              <label style={labelStyle}>PALAVRAS QUE NÃO COMBINAM</label>
              <input type="text" value={palavrasNegativas} onChange={e => setPalavrasNegativas(e.target.value)} placeholder="Ex: agressivo, barato, complicado" style={inputStyle(!!palavrasNegativas)} />
            </div>
          </div>
        </div>

        {/* ── SEÇÃO 4: Objetivos ── */}
        <div style={sectionCard}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(245,158,11,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>📈</div>
            <div>
              <div style={{ color: S.azul, fontWeight: 800, fontSize: '15px' }}>Objetivos</div>
              <div style={{ color: S.muted, fontSize: '12px' }}>O que você quer alcançar no Instagram</div>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>OBJETIVO PRINCIPAL NO INSTAGRAM</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              {OBJETIVOS.map(o => (
                <div key={o.id} onClick={() => setObjetivoInstagram(o.id)}
                  style={{ padding: '14px 10px', borderRadius: '10px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s', background: objetivoInstagram === o.id ? 'rgba(61,184,96,0.08)' : S.card2, border: objetivoInstagram === o.id ? `2px solid ${S.verde}` : `1px solid ${S.borda}` }}>
                  <div style={{ color: objetivoInstagram === o.id ? S.verde2 : S.texto, fontSize: '12px', fontWeight: 700, lineHeight: 1.4 }}>{o.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={labelStyle}>META DE SEGUIDORES</label>
              <input type="text" value={metaSeguidores} onChange={e => setMetaSeguidores(e.target.value)} placeholder="Ex: 10.000 seguidores em 6 meses" style={inputStyle(!!metaSeguidores)} />
            </div>
            <div>
              <label style={labelStyle}>FREQUÊNCIA DE POSTS POR SEMANA</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {FREQUENCIAS.map(f => (
                  <div key={f.id} onClick={() => setFrequenciaPosts(f.id)}
                    style={{ padding: '10px', borderRadius: '9px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s', background: frequenciaPosts === f.id ? 'rgba(61,184,96,0.08)' : S.card2, border: frequenciaPosts === f.id ? `2px solid ${S.verde}` : `1px solid ${S.borda}` }}>
                    <div style={{ color: frequenciaPosts === f.id ? S.verde2 : S.texto, fontSize: '11px', fontWeight: 600 }}>{f.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Botão salvar (rodapé) */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: '20px' }}>
          <button onClick={handleSalvar} disabled={salvando}
            style={{ padding: '14px 36px', background: sucesso ? S.verde2 : salvando ? 'rgba(61,184,96,0.5)' : S.verde, color: '#fff', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 800, cursor: salvando ? 'not-allowed' : 'pointer', boxShadow: salvando ? 'none' : '0 4px 20px rgba(61,184,96,0.3)', fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}>
            {salvando
              ? <><span style={{ display: 'inline-block', animation: 'spin 0.8s linear infinite' }}>⟳</span> Salvando...</>
              : sucesso ? '✓ Salvo com sucesso!'
              : '💾 Salvar alterações'}
          </button>
        </div>

      </main>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
