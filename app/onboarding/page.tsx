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

const grupos = [...new Set(nichos.map(n => n.grupo))]

const TONS = [
  { id: 'profissional', label: 'Profissional', icon: '👔', desc: 'Sério, formal e confiável'   },
  { id: 'descontraido', label: 'Descontraído', icon: '😊', desc: 'Leve, amigável e próximo'    },
  { id: 'inspirador',   label: 'Inspirador',   icon: '✨', desc: 'Motivacional e emocional'    },
  { id: 'educativo',    label: 'Educativo',    icon: '📚', desc: 'Informativo e didático'      },
  { id: 'humoristico',  label: 'Humorístico',  icon: '😂', desc: 'Divertido e bem-humorado'   },
]

const PASSOS = ['Boas-vindas', 'Sua marca', 'Nicho e público', 'Tom de voz', 'Instagram']

const inputStyle = (filled: boolean): React.CSSProperties => ({
  width: '100%',
  padding: '13px 16px',
  background: S.card2,
  border: `1.5px solid ${filled ? S.verde : S.borda2}`,
  borderRadius: '10px',
  color: S.texto,
  fontSize: '14px',
  outline: 'none',
  fontFamily: 'Inter, sans-serif',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
})

const labelStyle: React.CSSProperties = {
  color: S.muted,
  fontSize: '11px',
  fontWeight: 700,
  display: 'block',
  marginBottom: '7px',
  letterSpacing: '1px',
}

const btnBack: React.CSSProperties = {
  padding: '13px 20px',
  background: S.card2,
  color: S.muted,
  border: `1px solid ${S.borda2}`,
  borderRadius: '10px',
  fontSize: '13px',
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'Inter, sans-serif',
}

export default function Onboarding() {
  const router = useRouter()
  const [passo,   setPasso]   = useState(1)
  const [userId,  setUserId]  = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [erro,    setErro]    = useState('')

  const [nomeMarca,       setNomeMarca]       = useState('')
  const [nomeDono,        setNomeDono]        = useState('')
  const [cidade,          setCidade]          = useState('')

  const [nicho,           setNicho]           = useState('')
  const [grupoAtivo,      setGrupoAtivo]      = useState('Todos')
  const [busca,           setBusca]           = useState('')
  const [publicoAlvo,     setPublicoAlvo]     = useState('')
  const [produtoServico,  setProdutoServico]  = useState('')

  const [tomVoz,            setTomVoz]            = useState('')
  const [palavrasPositivas, setPalavrasPositivas] = useState('')
  const [palavrasNegativas, setPalavrasNegativas] = useState('')

  const [instagramHandle, setInstagramHandle] = useState('')
  const [tipoPerfil,      setTipoPerfil]      = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/login'); return }
      setUserId(data.user.id)
    })
  }, [router])

  const nichosFiltrados = nichos.filter(n =>
    (grupoAtivo === 'Todos' || n.grupo === grupoAtivo) &&
    n.label.toLowerCase().includes(busca.toLowerCase())
  )

  async function handleConcluir() {
    if (!userId) return
    setLoading(true)
    setErro('')
    try {
      const { error } = await supabase.from('brand_kit').upsert({
        user_id:             userId,
        nome_marca:          nomeMarca,
        nome_dono:           nomeDono,
        cidade,
        nicho,
        publico_alvo:        publicoAlvo,
        produto_servico:     produtoServico,
        tom_de_voz:          tomVoz,
        palavras_positivas:  palavrasPositivas,
        palavras_negativas:  palavrasNegativas,
        instagram_handle:    instagramHandle.replace('@', ''),
        tipo_perfil:         tipoPerfil,
        onboarding_completo: true,
        updated_at:          new Date().toISOString(),
      }, { onConflict: 'user_id' })
      if (error) throw error
      router.push('/dashboard')
    } catch (e: any) {
      setErro(e.message)
    } finally {
      setLoading(false)
    }
  }

  const progresso = (passo - 1) / 4 * 100

  return (
    <div style={{ minHeight: '100vh', background: S.bg, fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 20px' }}>

      {/* Logo */}
      <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Image src="/logo-dark.png" alt="Logo" width={36} height={36} style={{ borderRadius: '9px' }} />
        <div>
          <div style={{ color: S.azul, fontWeight: 900, fontSize: '13px', letterSpacing: '2px' }}>AMARANTS</div>
          <div style={{ color: S.verde, fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase' }}>Instagrowht</div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ width: '100%', maxWidth: '620px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          {PASSOS.map((p, i) => {
            const num  = i + 1
            const done = passo > num
            const active = passo === num
            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: 800, marginBottom: '5px', flexShrink: 0,
                  background: done ? S.verde : active ? S.azul : S.card,
                  color: done || active ? '#fff' : S.muted,
                  border: done || active ? 'none' : `1.5px solid ${S.borda2}`,
                  transition: 'all 0.3s',
                }}>
                  {done ? '✓' : num}
                </div>
                <div style={{ color: active ? S.azul : S.muted, fontSize: '10px', fontWeight: active ? 700 : 400, textAlign: 'center', lineHeight: 1.3 }}>{p}</div>
              </div>
            )
          })}
        </div>
        <div style={{ height: '4px', background: S.borda2, borderRadius: '99px', overflow: 'hidden' }}>
          <div style={{ height: '100%', background: `linear-gradient(90deg, ${S.verde}, ${S.verde2})`, borderRadius: '99px', width: `${progresso}%`, transition: 'width 0.4s ease' }} />
        </div>
      </div>

      {/* Card */}
      <div style={{ width: '100%', maxWidth: '620px', background: S.card, borderRadius: '20px', padding: '40px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: `1px solid ${S.borda}` }}>

        {/* ── PASSO 1: Boas-vindas ── */}
        {passo === 1 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>👋</div>
            <h1 style={{ color: S.azul, fontWeight: 900, fontSize: '24px', margin: '0 0 10px', letterSpacing: '-0.5px' }}>Bem-vindo ao Amarants Instagrowht</h1>
            <p style={{ color: S.muted, fontSize: '14px', lineHeight: 1.8, margin: '0 0 28px' }}>
              Configure seu sistema em menos de 3 minutos. A IA vai usar essas informações para criar conteúdo 100% alinhado com a sua marca.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px', textAlign: 'left' }}>
              {[
                { icon: '🎯', title: 'Plano estratégico personalizado', desc: 'Conteúdo criado especificamente para o seu nicho e objetivos' },
                { icon: '🗣️', title: 'Tom de voz consistente',          desc: 'A IA escreve sempre com a identidade da sua marca'          },
                { icon: '📅', title: 'Calendário editorial inteligente', desc: 'Organize e agende seus posts com facilidade'                 },
              ].map((f, i) => (
                <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', background: S.card2, borderRadius: '12px', padding: '14px 16px', border: `1px solid ${S.borda}` }}>
                  <span style={{ fontSize: '20px', flexShrink: 0 }}>{f.icon}</span>
                  <div>
                    <div style={{ color: S.azul, fontWeight: 700, fontSize: '13px', marginBottom: '2px' }}>{f.title}</div>
                    <div style={{ color: S.muted, fontSize: '12px' }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setPasso(2)} style={{ width: '100%', padding: '16px', background: S.verde, color: '#fff', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 20px rgba(61,184,96,0.3)', fontFamily: 'Inter, sans-serif' }}>
              Começar configuração →
            </button>
          </div>
        )}

        {/* ── PASSO 2: Nome da marca ── */}
        {passo === 2 && (
          <div>
            <h2 style={{ color: S.azul, fontWeight: 900, fontSize: '20px', margin: '0 0 6px' }}>Sobre a sua marca</h2>
            <p style={{ color: S.muted, fontSize: '13px', margin: '0 0 24px' }}>Essas informações aparecem em todo o conteúdo gerado</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={labelStyle}>NOME DA MARCA / NEGÓCIO *</label>
                <input type="text" value={nomeMarca} onChange={e => setNomeMarca(e.target.value)} placeholder="Ex: Studio Beleza Silva" style={inputStyle(!!nomeMarca)} />
              </div>
              <div>
                <label style={labelStyle}>SEU NOME *</label>
                <input type="text" value={nomeDono} onChange={e => setNomeDono(e.target.value)} placeholder="Ex: Maria Silva" style={inputStyle(!!nomeDono)} />
              </div>
              <div>
                <label style={labelStyle}>CIDADE / ESTADO</label>
                <input type="text" value={cidade} onChange={e => setCidade(e.target.value)} placeholder="Ex: São Paulo, SP" style={inputStyle(!!cidade)} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
              <button onClick={() => setPasso(1)} style={btnBack}>← Voltar</button>
              <button onClick={() => setPasso(3)} disabled={!nomeMarca || !nomeDono}
                style={{ flex: 1, padding: '13px', background: !nomeMarca || !nomeDono ? S.card2 : S.verde, color: !nomeMarca || !nomeDono ? S.muted : '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 800, cursor: !nomeMarca || !nomeDono ? 'not-allowed' : 'pointer', boxShadow: !nomeMarca || !nomeDono ? 'none' : '0 4px 16px rgba(61,184,96,0.3)', fontFamily: 'Inter, sans-serif' }}>
                Próximo → Nicho e Público
              </button>
            </div>
          </div>
        )}

        {/* ── PASSO 3: Nicho e público ── */}
        {passo === 3 && (
          <div>
            <h2 style={{ color: S.azul, fontWeight: 900, fontSize: '20px', margin: '0 0 6px' }}>Nicho e público</h2>
            <p style={{ color: S.muted, fontSize: '13px', margin: '0 0 20px' }}>A IA cria estratégias específicas para o seu mercado</p>

            <div style={{ background: S.card2, border: `1px solid ${S.borda}`, borderRadius: '14px', padding: '20px', marginBottom: '16px' }}>
              <label style={labelStyle}>SELECIONE SEU NICHO *</label>
              <input type="text" placeholder="🔍 Buscar nicho..." value={busca} onChange={e => setBusca(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', background: S.card, border: `1px solid ${S.borda2}`, borderRadius: '9px', color: S.texto, fontSize: '13px', outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box', marginBottom: '12px' }} />
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                {['Todos', ...grupos].map(g => (
                  <button key={g} onClick={() => setGrupoAtivo(g)}
                    style={{ padding: '4px 12px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: 600, fontFamily: 'Inter, sans-serif', background: grupoAtivo === g ? S.azul : S.card, color: grupoAtivo === g ? '#fff' : S.muted }}>
                    {g}
                  </button>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', maxHeight: '220px', overflowY: 'auto' }}>
                {nichosFiltrados.map(n => (
                  <div key={n.id} onClick={() => setNicho(n.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', borderRadius: '9px', cursor: 'pointer', transition: 'all 0.15s', background: nicho === n.id ? 'rgba(61,184,96,0.08)' : S.card, border: nicho === n.id ? `2px solid ${S.verde}` : `1px solid ${S.borda}` }}>
                    <span style={{ fontSize: '18px', flexShrink: 0 }}>{n.icon}</span>
                    <div style={{ color: nicho === n.id ? S.verde2 : S.texto, fontSize: '12px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.label}</div>
                  </div>
                ))}
              </div>
              {nichosFiltrados.length === 0 && (
                <div style={{ textAlign: 'center', padding: '20px', color: S.muted, fontSize: '13px' }}>Nenhum nicho encontrado para "{busca}"</div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
              <div>
                <label style={labelStyle}>DESCREVA SEU PÚBLICO-ALVO</label>
                <input type="text" value={publicoAlvo} onChange={e => setPublicoAlvo(e.target.value)} placeholder="Ex: Mulheres de 25-40 anos que buscam bem-estar" style={inputStyle(!!publicoAlvo)} />
              </div>
              <div>
                <label style={labelStyle}>PRINCIPAL PRODUTO / SERVIÇO</label>
                <input type="text" value={produtoServico} onChange={e => setProdutoServico(e.target.value)} placeholder="Ex: Consultas de nutrição e acompanhamento mensal" style={inputStyle(!!produtoServico)} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setPasso(2)} style={btnBack}>← Voltar</button>
              <button onClick={() => setPasso(4)} disabled={!nicho}
                style={{ flex: 1, padding: '13px', background: !nicho ? S.card2 : S.verde, color: !nicho ? S.muted : '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 800, cursor: !nicho ? 'not-allowed' : 'pointer', boxShadow: !nicho ? 'none' : '0 4px 16px rgba(61,184,96,0.3)', fontFamily: 'Inter, sans-serif' }}>
                Próximo → Tom de Voz
              </button>
            </div>
          </div>
        )}

        {/* ── PASSO 4: Tom de voz ── */}
        {passo === 4 && (
          <div>
            <h2 style={{ color: S.azul, fontWeight: 900, fontSize: '20px', margin: '0 0 6px' }}>Tom de voz</h2>
            <p style={{ color: S.muted, fontSize: '13px', margin: '0 0 20px' }}>Como a sua marca se comunica com o público</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', marginBottom: '20px' }}>
              {TONS.map(t => (
                <div key={t.id} onClick={() => setTomVoz(t.id)}
                  style={{ padding: '16px 8px', borderRadius: '12px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s', background: tomVoz === t.id ? 'rgba(61,184,96,0.08)' : S.card2, border: tomVoz === t.id ? `2px solid ${S.verde}` : `1px solid ${S.borda}`, boxShadow: tomVoz === t.id ? '0 4px 14px rgba(61,184,96,0.15)' : 'none' }}>
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>{t.icon}</div>
                  <div style={{ color: tomVoz === t.id ? S.verde2 : S.azul, fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>{t.label}</div>
                  <div style={{ color: S.muted, fontSize: '10px', lineHeight: 1.3 }}>{t.desc}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
              <div>
                <label style={labelStyle}>PALAVRAS QUE DEFINEM SUA MARCA</label>
                <input type="text" value={palavrasPositivas} onChange={e => setPalavrasPositivas(e.target.value)} placeholder="Ex: moderno, confiável, inovador, acolhedor" style={inputStyle(!!palavrasPositivas)} />
              </div>
              <div>
                <label style={labelStyle}>PALAVRAS QUE NÃO COMBINAM COM SUA MARCA</label>
                <input type="text" value={palavrasNegativas} onChange={e => setPalavrasNegativas(e.target.value)} placeholder="Ex: agressivo, informal, barato, complicado" style={inputStyle(!!palavrasNegativas)} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setPasso(3)} style={btnBack}>← Voltar</button>
              <button onClick={() => setPasso(5)} disabled={!tomVoz}
                style={{ flex: 1, padding: '13px', background: !tomVoz ? S.card2 : S.verde, color: !tomVoz ? S.muted : '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 800, cursor: !tomVoz ? 'not-allowed' : 'pointer', boxShadow: !tomVoz ? 'none' : '0 4px 16px rgba(61,184,96,0.3)', fontFamily: 'Inter, sans-serif' }}>
                Próximo → Instagram
              </button>
            </div>
          </div>
        )}

        {/* ── PASSO 5: Instagram ── */}
        {passo === 5 && (
          <div>
            <h2 style={{ color: S.azul, fontWeight: 900, fontSize: '20px', margin: '0 0 6px' }}>Conectar Instagram</h2>
            <p style={{ color: S.muted, fontSize: '13px', margin: '0 0 24px' }}>Informe seu perfil para personalizar as estratégias</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={labelStyle}>@ DO INSTAGRAM</label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: S.muted, fontWeight: 700, fontSize: '15px', pointerEvents: 'none' }}>@</div>
                  <input type="text" value={instagramHandle} onChange={e => setInstagramHandle(e.target.value.replace('@', ''))} placeholder="seuperfil"
                    style={{ width: '100%', padding: '13px 16px 13px 30px', background: S.card2, border: `1.5px solid ${instagramHandle ? S.verde : S.borda2}`, borderRadius: '10px', color: S.texto, fontSize: '14px', outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>TIPO DE PERFIL</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  {[
                    { id: 'pessoal',  label: 'Pessoal',  icon: '👤' },
                    { id: 'negocios', label: 'Negócios', icon: '🏢' },
                    { id: 'criador',  label: 'Criador',  icon: '🎨' },
                  ].map(t => (
                    <div key={t.id} onClick={() => setTipoPerfil(t.id)}
                      style={{ padding: '16px', borderRadius: '12px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s', background: tipoPerfil === t.id ? 'rgba(61,184,96,0.08)' : S.card2, border: tipoPerfil === t.id ? `2px solid ${S.verde}` : `1px solid ${S.borda}` }}>
                      <div style={{ fontSize: '26px', marginBottom: '6px' }}>{t.icon}</div>
                      <div style={{ color: tipoPerfil === t.id ? S.verde2 : S.texto, fontSize: '13px', fontWeight: 700 }}>{t.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {erro && (
              <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontSize: '12px', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px' }}>
                ⚠️ {erro}
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setPasso(4)} style={btnBack}>← Voltar</button>
              <button onClick={handleConcluir} disabled={loading}
                style={{ flex: 1, padding: '13px', background: loading ? 'rgba(61,184,96,0.5)' : S.verde, color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : '0 4px 20px rgba(61,184,96,0.3)', fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                {loading
                  ? <><span style={{ display: 'inline-block', animation: 'spin 0.8s linear infinite' }}>⟳</span> Salvando...</>
                  : '✦ Concluir e ir para o painel'}
              </button>
            </div>
          </div>
        )}

      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
