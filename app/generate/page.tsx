"use client"

import { useState, useRef } from 'react'
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

const tipos = [
  { id: 'post',      label: 'Post',      icon: '📸', desc: 'Imagem única com legenda', cor: '#2d9e50', bg: 'rgba(61,184,96,0.08)'   },
  { id: 'carrossel', label: 'Carrossel', icon: '🎠', desc: 'Sequência de slides',      cor: '#1d4ed8', bg: 'rgba(37,99,235,0.08)'   },
  { id: 'reel',      label: 'Reel',      icon: '🎬', desc: 'Roteiro para vídeo curto', cor: '#7c3aed', bg: 'rgba(139,92,246,0.08)'  },
  { id: 'story',     label: 'Story',     icon: '📖', desc: 'Story interativo',         cor: '#d97706', bg: 'rgba(245,158,11,0.08)'  },
  { id: 'banner',    label: 'Banner',    icon: '🖼️', desc: 'Banner promocional',      cor: '#dc2626', bg: 'rgba(239,68,68,0.08)'   },
]

const nichos = [
  // Saúde & Bem-estar
  { id: 'terapeuta',    label: 'Terapeuta',        icon: '💆', grupo: 'Saúde & Bem-estar'   },
  { id: 'psicologo',    label: 'Psicólogo',        icon: '🧠', grupo: 'Saúde & Bem-estar'   },
  { id: 'medico',       label: 'Médico',           icon: '👨‍⚕️', grupo: 'Saúde & Bem-estar' },
  { id: 'dentista',     label: 'Dentista',         icon: '🦷', grupo: 'Saúde & Bem-estar'   },
  { id: 'nutricionista',label: 'Nutricionista',    icon: '🥗', grupo: 'Saúde & Bem-estar'   },
  { id: 'personal',     label: 'Personal Trainer', icon: '💪', grupo: 'Saúde & Bem-estar'   },
  { id: 'estetica',     label: 'Estética',         icon: '💅', grupo: 'Saúde & Bem-estar'   },
  { id: 'fisioterapia', label: 'Fisioterapeuta',   icon: '🏃', grupo: 'Saúde & Bem-estar'   },
  // Jurídico & Finanças
  { id: 'advogado',     label: 'Advogado',         icon: '⚖️', grupo: 'Jurídico & Finanças' },
  { id: 'contador',     label: 'Contador',         icon: '📊', grupo: 'Jurídico & Finanças' },
  { id: 'financeiro',   label: 'Consultor Financeiro', icon: '💰', grupo: 'Jurídico & Finanças' },
  { id: 'corretor',     label: 'Corretor de Seguros', icon: '🛡️', grupo: 'Jurídico & Finanças' },
  // Negócios & Marketing
  { id: 'coach',        label: 'Coach',            icon: '🎯', grupo: 'Negócios & Marketing' },
  { id: 'consultoria',  label: 'Consultoria',      icon: '📋', grupo: 'Negócios & Marketing' },
  { id: 'marketing',    label: 'Marketing Digital',icon: '📱', grupo: 'Negócios & Marketing' },
  { id: 'tech',         label: 'Tecnologia',       icon: '💻', grupo: 'Negócios & Marketing' },
  // Imóveis & Construção
  { id: 'imobiliaria',  label: 'Imobiliária',      icon: '🏠', grupo: 'Imóveis & Construção' },
  { id: 'arquitetura',  label: 'Arquitetura',      icon: '🏗️', grupo: 'Imóveis & Construção' },
  { id: 'decoracao',    label: 'Decoração',        icon: '🛋️', grupo: 'Imóveis & Construção' },
  // Alimentação
  { id: 'restaurante',  label: 'Restaurante',      icon: '🍕', grupo: 'Alimentação'          },
  { id: 'cafeteria',    label: 'Cafeteria',        icon: '☕', grupo: 'Alimentação'          },
  { id: 'confeitaria',  label: 'Confeitaria',      icon: '🎂', grupo: 'Alimentação'          },
  { id: 'delivery',     label: 'Delivery',         icon: '🛵', grupo: 'Alimentação'          },
  // Moda & Beleza
  { id: 'moda',         label: 'Moda',             icon: '👗', grupo: 'Moda & Beleza'        },
  { id: 'salao',        label: 'Salão de Beleza',  icon: '✂️', grupo: 'Moda & Beleza'       },
  { id: 'makeup',       label: 'Maquiagem',        icon: '💄', grupo: 'Moda & Beleza'        },
  { id: 'barbearia',    label: 'Barbearia',        icon: '💈', grupo: 'Moda & Beleza'        },
  // Educação
  { id: 'educacao',     label: 'Educação',         icon: '📚', grupo: 'Educação'             },
  { id: 'curso',        label: 'Cursos Online',    icon: '🎓', grupo: 'Educação'             },
  { id: 'idiomas',      label: 'Idiomas',          icon: '🌍', grupo: 'Educação'             },
  // Outros
  { id: 'petshop',      label: 'Pet Shop',         icon: '🐾', grupo: 'Outros'               },
  { id: 'automotivo',   label: 'Automotivo',       icon: '🚗', grupo: 'Outros'               },
  { id: 'turismo',      label: 'Turismo & Viagens',icon: '✈️', grupo: 'Outros'              },
  { id: 'esporte',      label: 'Esportes',         icon: '⚽', grupo: 'Outros'               },
]

const objetivos = [
  { id: 'seguidores',  label: 'Ganhar Seguidores',    icon: '📈', desc: 'Crescer minha base'         },
  { id: 'vendas',      label: 'Vender mais',          icon: '💰', desc: 'Converter em clientes'       },
  { id: 'autoridade',  label: 'Construir Autoridade', icon: '🏆', desc: 'Ser referência no nicho'     },
  { id: 'comunidade',  label: 'Criar Comunidade',     icon: '👥', desc: 'Engajar e fidelizar público' },
]

interface PlanoItem {
  dia: string; formato: string; tema: string; horario: string
  objetivo: string; legenda: string; hashtags: string[]; gancho: string
}
interface Plano { resumo: string; projecao: string; itens: PlanoItem[] }
interface ResultadoManual {
  titulo: string; descricao_analise: string; sugestao_formato: string
  legenda: string; hashtags: string[]; cta: string; horario: string
  sugestao_slides: string[]; dicas: string[]
}

const FORMATO_CORES: Record<string, { bg: string; cor: string }> = {
  reel:      { bg: 'rgba(139,92,246,0.1)', cor: '#7c3aed' },
  carrossel: { bg: 'rgba(37,99,235,0.1)',  cor: '#1d4ed8' },
  post:      { bg: 'rgba(61,184,96,0.1)',  cor: '#2d9e50' },
  story:     { bg: 'rgba(245,158,11,0.1)', cor: '#d97706' },
  banner:    { bg: 'rgba(239,68,68,0.1)',  cor: '#dc2626' },
}

const grupos = [...new Set(nichos.map(n => n.grupo))]

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
      <nav style={{ flex: 1, padding: '16px 10px' }}>
        {[
          { grupo: 'Principal', items: [
            { icon: '⊞', label: 'Dashboard',      href: '/dashboard', ativo: false },
            { icon: '✦', label: 'Gerar Conteúdo', href: '/generate',  ativo: true  },
            { icon: '📅', label: 'Calendário',    href: '/calendar',  ativo: false },
            { icon: '📋', label: 'Templates',     href: '#',          ativo: false },
          ]},
          { grupo: 'Instagram', items: [
            { icon: '📊', label: 'Analytics',   href: '#', ativo: false },
            { icon: '🤖', label: 'Automações',  href: '#', ativo: false },
            { icon: '🕐', label: 'Agendamento', href: '#', ativo: false },
          ]},
        ].map(g => (
          <div key={g.grupo} style={{ marginBottom: '6px' }}>
            <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '9px', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', padding: '8px 12px 6px' }}>{g.grupo}</div>
            {g.items.map(item => (
              <a key={item.label} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '9px', marginBottom: '1px', cursor: 'pointer', textDecoration: 'none', background: item.ativo ? 'rgba(61,184,96,0.15)' : 'transparent', borderLeft: item.ativo ? `2px solid ${S.verde}` : '2px solid transparent', color: item.ativo ? S.verde : 'rgba(255,255,255,0.5)', fontSize: '13px', fontWeight: item.ativo ? 600 : 400 }}>
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

export default function Generate() {
  const [modo, setModo] = useState<'selecao' | 'automatico' | 'manual'>('selecao')

  // Automático
  const [passo,    setPasso]    = useState(1)
  const [tipo,     setTipo]     = useState('')
  const [nicho,    setNicho]    = useState('')
  const [objetivo, setObjetivo] = useState('')
  const [grupoAtivo, setGrupoAtivo] = useState('Todos')
  const [busca,    setBusca]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [plano,    setPlano]    = useState<Plano | null>(null)
  const [erro,     setErro]     = useState('')

  // Manual
  const [imagens,        setImagens]        = useState<File[]>([])
  const [imagensPreview, setImagensPreview] = useState<string[]>([])
  const [pdfFile,        setPdfFile]        = useState<File | null>(null)
  const [descricao,      setDescricao]      = useState('')
  const [nichoManual,    setNichoManual]    = useState('')
  const [tomManual,      setTomManual]      = useState('')
  const [objetivoManual, setObjetivoManual] = useState('')
  const [loadingManual,  setLoadingManual]  = useState(false)
  const [resultadoManual,setResultadoManual]= useState<ResultadoManual | null>(null)
  const [erroManual,     setErroManual]     = useState('')
  const [copiado,        setCopiado]        = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const pdfInputRef  = useRef<HTMLInputElement>(null)

  const nichoSel   = nichos.find(n => n.id === nicho)
  const tipoSel    = tipos.find(t => t.id === tipo)
  const nichosFiltrados = nichos.filter(n => {
    const matchGrupo = grupoAtivo === 'Todos' || n.grupo === grupoAtivo
    const matchBusca = n.label.toLowerCase().includes(busca.toLowerCase())
    return matchGrupo && matchBusca
  })

  async function handleGerar() {
    setLoading(true); setErro(''); setPlano(null)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const res  = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo, nicho, objetivo, userId: user?.id }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      setPlano(json.data); setPasso(4)
    } catch (e: any) { setErro('Erro: ' + e.message) }
    finally { setLoading(false) }
  }

  function handleImagensChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    const novas = files.slice(0, 5 - imagens.length)
    setImagens(prev => [...prev, ...novas].slice(0, 5))
    novas.forEach(file => {
      const reader = new FileReader()
      reader.onload = () => setImagensPreview(prev => [...prev, reader.result as string].slice(0, 5))
      reader.readAsDataURL(file)
    })
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function removerImagem(index: number) {
    setImagens(prev => prev.filter((_, i) => i !== index))
    setImagensPreview(prev => prev.filter((_, i) => i !== index))
  }

  async function handleGerarManual() {
    if (!descricao.trim()) { setErroManual('Descreva o que você quer gerar!'); return }
    setLoadingManual(true); setErroManual(''); setResultadoManual(null)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const formData = new FormData()
      formData.append('descricao', descricao)
      formData.append('objetivo',  objetivoManual)
      formData.append('tom',       tomManual)
      formData.append('nicho',     nichoManual)
      formData.append('userId',    user?.id || '')
      imagens.forEach(img => formData.append('imagens', img))
      if (pdfFile) formData.append('pdf', pdfFile)
      const res  = await fetch('/api/generate/generate-manual', { method: 'POST', body: formData })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      setResultadoManual(json.data)
    } catch (e: any) { setErroManual('Erro: ' + e.message) }
    finally { setLoadingManual(false) }
  }

  async function handleCopiar() {
    if (!resultadoManual) return
    await navigator.clipboard.writeText(`${resultadoManual.legenda}\n\n${resultadoManual.hashtags.join(' ')}`)
    setCopiado(true); setTimeout(() => setCopiado(false), 2000)
  }

  function resetTudo() {
    setPasso(1); setTipo(''); setNicho(''); setObjetivo(''); setPlano(null); setErro('')
    setImagens([]); setImagensPreview([]); setPdfFile(null); setDescricao('')
    setNichoManual(''); setTomManual(''); setObjetivoManual(''); setResultadoManual(null)
  }

  // ── Botão próximo step ──
  function BtnProximo({ label, onClick, disabled }: { label: string; onClick: () => void; disabled: boolean }) {
    return (
      <button onClick={onClick} disabled={disabled} style={{ padding: '13px 32px', background: disabled ? S.card2 : S.verde, color: disabled ? S.muted : '#fff', border: 'none', borderRadius: '9px', fontSize: '14px', fontWeight: 800, cursor: disabled ? 'not-allowed' : 'pointer', boxShadow: disabled ? 'none' : '0 4px 16px rgba(61,184,96,0.3)', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s' }}>
        {label}
      </button>
    )
  }

  return (
    <div style={{ background: S.bg, minHeight: '100vh', display: 'flex', fontFamily: 'Inter, sans-serif' }}>
      <Sidebar />

      <main style={{ flex: 1, padding: '36px 40px', overflowY: 'auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
            <h1 style={{ color: S.azul, fontWeight: 900, fontSize: '26px', letterSpacing: '-0.5px', margin: 0 }}>Gerar Conteúdo</h1>
            <span style={{ background: 'rgba(61,184,96,0.1)', color: S.verde2, fontSize: '9px', fontWeight: 800, padding: '4px 10px', borderRadius: '20px', border: '1px solid rgba(61,184,96,0.2)', letterSpacing: '1.5px' }}>✦ IA</span>
          </div>
          <p style={{ color: S.muted, fontSize: '13px', margin: 0 }}>Escolha como quer gerar seu conteúdo</p>
        </div>

        {/* ══ SELEÇÃO DE MODO ══ */}
        {modo === 'selecao' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', maxWidth: '800px' }}>
            {[
              { id: 'automatico', icon: '🤖', titulo: 'Automático', desc: 'A IA cria um plano estratégico completo baseado no tipo de conteúdo, nicho e objetivo.', items: ['✅ Plano completo', '✅ Calendário estratégico', '✅ Mix de formatos ideal'], btnLabel: 'Gerar Plano Automático →', btnBg: S.verde },
              { id: 'manual', icon: '✏️', titulo: 'Manual + IA', desc: 'Envie suas fotos e documentos. A IA analisa tudo e cria conteúdo personalizado.', items: ['📸 Múltiplas fotos (até 5)', '📄 Upload de PDF/documento', '✅ Conteúdo 100% personalizado'], btnLabel: 'Criar com Minhas Fotos →', btnBg: S.azul },
            ].map(card => (
              <div key={card.id} onClick={() => setModo(card.id as any)} style={{ background: S.card, border: `2px solid ${S.borda}`, borderRadius: '20px', padding: '32px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = card.id === 'automatico' ? S.verde : S.azul; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${card.id === 'automatico' ? 'rgba(61,184,96,0.15)' : 'rgba(13,31,60,0.12)'}` }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = S.borda; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: card.id === 'automatico' ? 'rgba(61,184,96,0.1)' : 'rgba(13,31,60,0.08)', border: `1px solid ${card.id === 'automatico' ? 'rgba(61,184,96,0.2)' : 'rgba(13,31,60,0.15)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', marginBottom: '20px' }}>{card.icon}</div>
                <h2 style={{ color: S.azul, fontWeight: 800, fontSize: '18px', margin: '0 0 10px' }}>{card.titulo}</h2>
                <p style={{ color: S.muted, fontSize: '13px', lineHeight: 1.7, margin: '0 0 20px' }}>{card.desc}</p>
                {card.items.map(f => <div key={f} style={{ color: card.id === 'automatico' ? S.verde2 : S.azul, fontSize: '12px', fontWeight: 500, marginBottom: '6px', opacity: card.id === 'manual' ? 0.7 : 1 }}>{f}</div>)}
                <div style={{ marginTop: '24px', background: card.btnBg, color: '#fff', borderRadius: '9px', padding: '11px', textAlign: 'center', fontWeight: 700, fontSize: '13px' }}>{card.btnLabel}</div>
              </div>
            ))}
          </div>
        )}

        {/* ══ AUTOMÁTICO ══ */}
        {modo === 'automatico' && (
          <div>
            <button onClick={() => { setModo('selecao'); resetTudo() }} style={{ background: 'none', border: 'none', color: S.muted, cursor: 'pointer', fontSize: '13px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'Inter, sans-serif' }}>← Voltar</button>

            {/* Steps */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px', flexWrap: 'wrap' }}>
              {[
                { num: 1, label: 'Tipo de Conteúdo' },
                { num: 2, label: 'Nicho'             },
                { num: 3, label: 'Objetivo'          },
                { num: 4, label: 'Plano Gerado'      },
              ].map((s, i) => (
                <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, background: passo >= s.num ? S.verde : S.card2, color: passo >= s.num ? '#fff' : S.muted, border: passo >= s.num ? 'none' : `1px solid ${S.borda2}`, flexShrink: 0 }}>
                      {passo > s.num ? '✓' : s.num}
                    </div>
                    <span style={{ color: passo >= s.num ? S.azul : S.muted, fontSize: '13px', fontWeight: passo >= s.num ? 600 : 400, whiteSpace: 'nowrap' }}>{s.label}</span>
                  </div>
                  {i < 3 && <div style={{ width: '32px', height: '1px', background: S.borda2 }} />}
                </div>
              ))}
            </div>

            {/* ── PASSO 1: Tipo ── */}
            {passo === 1 && (
              <div>
                <div style={{ background: S.card, border: `1px solid ${S.borda}`, borderRadius: '16px', padding: '28px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <h2 style={{ color: S.azul, fontWeight: 700, fontSize: '16px', margin: '0 0 6px' }}>Que tipo de conteúdo quer gerar?</h2>
                  <p style={{ color: S.muted, fontSize: '13px', margin: '0 0 24px' }}>Escolha o formato ideal para o seu objetivo</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
                    {tipos.map(t => (
                      <div key={t.id} onClick={() => setTipo(t.id)} style={{ padding: '20px 12px', borderRadius: '14px', cursor: 'pointer', transition: 'all 0.15s', textAlign: 'center', background: tipo === t.id ? t.bg : S.card2, border: tipo === t.id ? `2px solid ${t.cor}` : `1px solid ${S.borda}`, boxShadow: tipo === t.id ? `0 4px 16px ${t.cor}25` : 'none' }}>
                        <div style={{ fontSize: '32px', marginBottom: '10px' }}>{t.icon}</div>
                        <div style={{ color: tipo === t.id ? t.cor : S.azul, fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>{t.label}</div>
                        <div style={{ color: S.muted, fontSize: '10px', lineHeight: 1.4 }}>{t.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <BtnProximo label="Próximo → Escolher Nicho" onClick={() => setPasso(2)} disabled={!tipo} />
              </div>
            )}

            {/* ── PASSO 2: Nicho ── */}
            {passo === 2 && (
              <div>
                {/* Tipo selecionado */}
                {tipoSel && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', padding: '12px 16px', background: tipoSel.bg, borderRadius: '10px', border: `1px solid ${tipoSel.cor}33`, width: 'fit-content' }}>
                    <span style={{ fontSize: '20px' }}>{tipoSel.icon}</span>
                    <div>
                      <div style={{ color: tipoSel.cor, fontSize: '10px', fontWeight: 700, letterSpacing: '1px' }}>TIPO SELECIONADO</div>
                      <div style={{ color: S.azul, fontWeight: 700, fontSize: '14px' }}>{tipoSel.label}</div>
                    </div>
                  </div>
                )}

                <div style={{ background: S.card, border: `1px solid ${S.borda}`, borderRadius: '16px', padding: '28px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <h2 style={{ color: S.azul, fontWeight: 700, fontSize: '16px', margin: '0 0 6px' }}>Qual é o nicho do negócio?</h2>
                  <p style={{ color: S.muted, fontSize: '13px', margin: '0 0 20px' }}>A IA cria conteúdo estratégico específico para esse mercado</p>

                  {/* Busca */}
                  <div style={{ position: 'relative', marginBottom: '16px' }}>
                    <input type="text" placeholder="🔍 Buscar nicho..." value={busca} onChange={e => setBusca(e.target.value)}
                      style={{ width: '100%', padding: '11px 14px', background: S.card2, border: `1px solid ${S.borda2}`, borderRadius: '9px', color: S.texto, fontSize: '13px', outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }} />
                  </div>

                  {/* Filtros por grupo */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                    {['Todos', ...grupos].map(g => (
                      <button key={g} onClick={() => setGrupoAtivo(g)} style={{ padding: '5px 14px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600, fontFamily: 'Inter, sans-serif', transition: 'all 0.15s', background: grupoAtivo === g ? S.azul : S.card2, color: grupoAtivo === g ? '#fff' : S.muted }}>
                        {g}
                      </button>
                    ))}
                  </div>

                  {/* Grid de nichos */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', maxHeight: '400px', overflowY: 'auto' }}>
                    {nichosFiltrados.map(n => (
                      <div key={n.id} onClick={() => setNicho(n.id)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.15s', background: nicho === n.id ? 'rgba(61,184,96,0.08)' : S.card2, border: nicho === n.id ? `2px solid ${S.verde}` : `1px solid ${S.borda}`, boxShadow: nicho === n.id ? '0 2px 8px rgba(61,184,96,0.15)' : 'none' }}>
                        <span style={{ fontSize: '20px', flexShrink: 0 }}>{n.icon}</span>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ color: nicho === n.id ? S.verde2 : S.texto, fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.label}</div>
                          <div style={{ color: S.muted, fontSize: '10px' }}>{n.grupo}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {nichosFiltrados.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '24px', color: S.muted, fontSize: '13px' }}>Nenhum nicho encontrado para "{busca}"</div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => setPasso(1)} style={{ padding: '13px 24px', background: S.card, color: S.muted, border: `1px solid ${S.borda2}`, borderRadius: '9px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>← Voltar</button>
                  <BtnProximo label="Próximo → Definir Objetivo" onClick={() => setPasso(3)} disabled={!nicho} />
                </div>
              </div>
            )}

            {/* ── PASSO 3: Objetivo ── */}
            {passo === 3 && (
              <div>
                {/* Resumo das seleções */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
                  {tipoSel && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', background: tipoSel.bg, borderRadius: '8px', border: `1px solid ${tipoSel.cor}33` }}>
                      <span>{tipoSel.icon}</span>
                      <span style={{ color: tipoSel.cor, fontSize: '12px', fontWeight: 600 }}>{tipoSel.label}</span>
                    </div>
                  )}
                  {nichoSel && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', background: 'rgba(61,184,96,0.08)', borderRadius: '8px', border: '1px solid rgba(61,184,96,0.2)' }}>
                      <span>{nichoSel.icon}</span>
                      <span style={{ color: S.verde2, fontSize: '12px', fontWeight: 600 }}>{nichoSel.label}</span>
                    </div>
                  )}
                </div>

                <div style={{ background: S.card, border: `1px solid ${S.borda}`, borderRadius: '16px', padding: '28px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <h2 style={{ color: S.azul, fontWeight: 700, fontSize: '16px', margin: '0 0 6px' }}>Qual é o principal objetivo?</h2>
                  <p style={{ color: S.muted, fontSize: '13px', margin: '0 0 24px' }}>A IA cria estratégia focada nesse objetivo</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                    {objetivos.map(o => (
                      <div key={o.id} onClick={() => setObjetivo(o.id)} style={{ padding: '20px', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.15s', background: objetivo === o.id ? 'rgba(61,184,96,0.06)' : S.card2, border: objetivo === o.id ? `2px solid ${S.verde}` : `1px solid ${S.borda}`, boxShadow: objetivo === o.id ? '0 4px 16px rgba(61,184,96,0.15)' : 'none' }}>
                        <div style={{ fontSize: '32px', marginBottom: '10px' }}>{o.icon}</div>
                        <div style={{ color: objetivo === o.id ? S.verde2 : S.texto, fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>{o.label}</div>
                        <div style={{ color: S.muted, fontSize: '12px' }}>{o.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => setPasso(2)} style={{ padding: '13px 24px', background: S.card, color: S.muted, border: `1px solid ${S.borda2}`, borderRadius: '9px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>← Voltar</button>
                  <button onClick={() => objetivo && handleGerar()} disabled={!objetivo || loading} style={{ padding: '13px 32px', background: objetivo && !loading ? S.verde : S.card2, color: objetivo && !loading ? '#fff' : S.muted, border: 'none', borderRadius: '9px', fontSize: '14px', fontWeight: 800, cursor: objetivo && !loading ? 'pointer' : 'not-allowed', boxShadow: objetivo && !loading ? '0 4px 16px rgba(61,184,96,0.3)' : 'none', fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {loading ? <><span style={{ display: 'inline-block', animation: 'spin 0.8s linear infinite' }}>⟳</span> IA gerando seu plano...</> : '✦ Gerar Plano de Crescimento'}
                  </button>
                </div>
                {erro && <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontSize: '12px', padding: '10px 14px', borderRadius: '8px', marginTop: '12px' }}>⚠️ {erro}</div>}
              </div>
            )}

            {/* ── PASSO 4: Resultado ── */}
            {passo === 4 && plano && (
              <div>
                <div style={{ background: 'linear-gradient(135deg, #0d1f3c, #1a3a6e)', borderRadius: '16px', padding: '24px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ color: S.verde, fontSize: '11px', fontWeight: 800, letterSpacing: '1px', marginBottom: '6px' }}>✦ PLANO GERADO — {tipoSel?.icon} {tipoSel?.label} · {nichoSel?.icon} {nichoSel?.label}</div>
                    <div style={{ color: '#fff', fontWeight: 700, fontSize: '16px', marginBottom: '6px' }}>{plano.resumo}</div>
                    <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13px' }}>{plano.projecao}</div>
                  </div>
                  <button onClick={() => { setPasso(1); resetTudo() }} style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '9px', padding: '10px 16px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>↺ Novo plano</button>
                </div>
                <div style={{ background: S.card, border: `1px solid ${S.borda}`, borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <h2 style={{ color: S.azul, fontWeight: 700, fontSize: '15px', margin: '0 0 20px' }}>📅 Calendário — 7 dias</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {plano.itens?.map((item, i) => {
                      const fmt = FORMATO_CORES[item.formato?.toLowerCase()] || FORMATO_CORES.post
                      return (
                        <div key={i} style={{ background: S.card2, border: `1px solid ${S.borda}`, borderRadius: '12px', padding: '18px', borderLeft: `3px solid ${fmt.cor}` }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
                            <div style={{ background: 'rgba(13,31,60,0.08)', color: S.azul, borderRadius: '8px', padding: '5px 12px', fontSize: '12px', fontWeight: 700 }}>{item.dia}</div>
                            <div style={{ background: fmt.bg, color: fmt.cor, borderRadius: '8px', padding: '5px 12px', fontSize: '12px', fontWeight: 600 }}>{item.formato}</div>
                            <div style={{ color: S.muted, fontSize: '12px' }}>⏰ {item.horario}</div>
                          </div>
                          <div style={{ color: S.azul, fontWeight: 700, fontSize: '14px', marginBottom: '8px' }}>{item.tema}</div>
                          <div style={{ background: 'rgba(61,184,96,0.06)', border: '1px solid rgba(61,184,96,0.15)', borderRadius: '8px', padding: '10px 12px', marginBottom: '10px' }}>
                            <div style={{ color: S.muted, fontSize: '10px', fontWeight: 700, letterSpacing: '1px', marginBottom: '4px' }}>GANCHO</div>
                            <div style={{ color: S.verde2, fontSize: '12px', fontStyle: 'italic' }}>"{item.gancho}"</div>
                          </div>
                          <div style={{ color: S.muted, fontSize: '12px', lineHeight: 1.6, marginBottom: '10px' }}>{item.legenda}</div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {item.hashtags?.map((h, j) => (
                              <span key={j} style={{ background: 'rgba(13,31,60,0.06)', color: S.azul, border: '1px solid rgba(13,31,60,0.12)', padding: '3px 8px', borderRadius: '20px', fontSize: '10px' }}>{h}</span>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══ MANUAL ══ */}
        {modo === 'manual' && (
          <div>
            <button onClick={() => { setModo('selecao'); resetTudo() }} style={{ background: 'none', border: 'none', color: S.muted, cursor: 'pointer', fontSize: '13px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'Inter, sans-serif' }}>← Voltar</button>

            <div style={{ display: 'grid', gridTemplateColumns: resultadoManual ? '1fr 1fr' : '640px', gap: '24px', alignItems: 'start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                {/* Imagens */}
                <div style={{ background: S.card, border: `1px solid ${S.borda}`, borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <h2 style={{ color: S.azul, fontWeight: 700, fontSize: '15px', margin: '0 0 6px' }}>📸 Suas imagens</h2>
                  <p style={{ color: S.muted, fontSize: '13px', margin: '0 0 16px' }}>Envie até 5 fotos — a IA vai analisar todas</p>
                  <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImagensChange} style={{ display: 'none' }} />
                  {imagensPreview.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', marginBottom: '12px' }}>
                      {imagensPreview.map((prev, i) => (
                        <div key={i} style={{ position: 'relative' }}>
                          <img src={prev} alt={`img-${i}`} style={{ width: '100%', height: '70px', objectFit: 'cover', borderRadius: '8px', border: `1px solid ${S.borda}` }} />
                          <button onClick={() => removerImagem(i)} style={{ position: 'absolute', top: '3px', right: '3px', background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div onClick={() => imagensPreview.length < 5 && fileInputRef.current?.click()} style={{ border: `2px dashed ${imagensPreview.length >= 5 ? S.borda : S.borda2}`, borderRadius: '12px', padding: '18px', textAlign: 'center', cursor: imagensPreview.length >= 5 ? 'not-allowed' : 'pointer', background: S.card2, opacity: imagensPreview.length >= 5 ? 0.5 : 1, transition: 'all 0.2s' }}
                    onMouseEnter={e => { if (imagensPreview.length < 5) { e.currentTarget.style.borderColor = S.verde; e.currentTarget.style.background = 'rgba(61,184,96,0.03)' } }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = S.borda2; e.currentTarget.style.background = S.card2 }}>
                    <div style={{ fontSize: '22px', marginBottom: '4px' }}>📸</div>
                    <div style={{ color: S.azul, fontWeight: 600, fontSize: '13px' }}>{imagensPreview.length === 0 ? 'Clique para adicionar fotos' : `Adicionar mais (${imagensPreview.length}/5)`}</div>
                    <div style={{ color: S.muted, fontSize: '11px', marginTop: '2px' }}>JPG, PNG, WEBP</div>
                  </div>
                </div>

                {/* PDF */}
                <div style={{ background: S.card, border: `1px solid ${S.borda}`, borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <h2 style={{ color: S.azul, fontWeight: 700, fontSize: '15px', margin: '0 0 4px' }}>📄 Documento <span style={{ color: S.muted, fontWeight: 400, fontSize: '12px' }}>(opcional)</span></h2>
                  <p style={{ color: S.muted, fontSize: '13px', margin: '0 0 16px' }}>Cardápio, catálogo, artigo, proposta... A IA usa para criar conteúdo mais rico.</p>
                  <input ref={pdfInputRef} type="file" accept=".pdf" onChange={e => { const f = e.target.files?.[0]; if (f) setPdfFile(f) }} style={{ display: 'none' }} />
                  {pdfFile ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: S.card2, borderRadius: '10px', padding: '12px 14px', border: `1px solid ${S.borda}` }}>
                      <span style={{ fontSize: '24px' }}>📄</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ color: S.azul, fontWeight: 600, fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pdfFile.name}</div>
                        <div style={{ color: S.muted, fontSize: '11px' }}>{(pdfFile.size / 1024 / 1024).toFixed(2)} MB</div>
                      </div>
                      <button onClick={() => setPdfFile(null)} style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '5px 10px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Remover</button>
                    </div>
                  ) : (
                    <div onClick={() => pdfInputRef.current?.click()} style={{ border: `2px dashed ${S.borda2}`, borderRadius: '12px', padding: '18px', textAlign: 'center', cursor: 'pointer', background: S.card2, transition: 'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = S.azul; e.currentTarget.style.background = 'rgba(13,31,60,0.02)' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = S.borda2; e.currentTarget.style.background = S.card2 }}>
                      <div style={{ fontSize: '22px', marginBottom: '4px' }}>📄</div>
                      <div style={{ color: S.azul, fontWeight: 600, fontSize: '13px' }}>Clique para enviar PDF</div>
                      <div style={{ color: S.muted, fontSize: '11px', marginTop: '2px' }}>Cardápio, catálogo, artigo...</div>
                    </div>
                  )}
                </div>

                {/* Detalhes */}
                <div style={{ background: S.card, border: `1px solid ${S.borda}`, borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <h2 style={{ color: S.azul, fontWeight: 700, fontSize: '15px', margin: '0 0 20px' }}>✏️ Detalhes</h2>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ color: S.muted, fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '7px', letterSpacing: '1px' }}>O QUE VOCÊ QUER MOSTRAR? *</label>
                    <textarea placeholder="Ex: Quero mostrar esse prato especial, destacar os ingredientes frescos e convidar as pessoas para jantar..." value={descricao} onChange={e => setDescricao(e.target.value)} rows={4}
                      style={{ width: '100%', padding: '12px 14px', background: S.card2, border: `1px solid ${S.borda2}`, borderRadius: '9px', color: S.texto, fontSize: '14px', outline: 'none', fontFamily: 'Inter, sans-serif', resize: 'vertical', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                    <div>
                      <label style={{ color: S.muted, fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '7px', letterSpacing: '1px' }}>NICHO</label>
                      <input type="text" placeholder="Ex: Restaurante" value={nichoManual} onChange={e => setNichoManual(e.target.value)} style={{ width: '100%', padding: '11px 14px', background: S.card2, border: `1px solid ${S.borda2}`, borderRadius: '9px', color: S.texto, fontSize: '13px', outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ color: S.muted, fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '7px', letterSpacing: '1px' }}>TOM DE VOZ</label>
                      <input type="text" placeholder="Ex: Descontraído" value={tomManual} onChange={e => setTomManual(e.target.value)} style={{ width: '100%', padding: '11px 14px', background: S.card2, border: `1px solid ${S.borda2}`, borderRadius: '9px', color: S.texto, fontSize: '13px', outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }} />
                    </div>
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ color: S.muted, fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '7px', letterSpacing: '1px' }}>OBJETIVO DO POST</label>
                    <input type="text" placeholder="Ex: Divulgar promoção, atrair clientes..." value={objetivoManual} onChange={e => setObjetivoManual(e.target.value)} style={{ width: '100%', padding: '11px 14px', background: S.card2, border: `1px solid ${S.borda2}`, borderRadius: '9px', color: S.texto, fontSize: '13px', outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }} />
                  </div>
                  {erroManual && <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontSize: '12px', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px' }}>⚠️ {erroManual}</div>}
                  <button onClick={handleGerarManual} disabled={loadingManual} style={{ width: '100%', padding: '14px', background: loadingManual ? 'rgba(13,31,60,0.5)' : S.azul, color: '#fff', border: 'none', borderRadius: '9px', fontSize: '14px', fontWeight: 800, cursor: loadingManual ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontFamily: 'Inter, sans-serif', boxShadow: loadingManual ? 'none' : '0 4px 16px rgba(13,31,60,0.25)' }}>
                    {loadingManual ? <><span style={{ display: 'inline-block', animation: 'spin 0.8s linear infinite' }}>⟳</span> IA analisando...</> : `🤖 Gerar conteúdo${imagensPreview.length > 0 ? ` (${imagensPreview.length} foto${imagensPreview.length > 1 ? 's' : ''})` : ''}${pdfFile ? ' + PDF' : ''}`}
                  </button>
                </div>
              </div>

              {/* Resultado Manual */}
              {resultadoManual && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ background: 'linear-gradient(135deg, #0d1f3c, #1a3a6e)', borderRadius: '16px', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ color: S.verde, fontSize: '11px', fontWeight: 800, letterSpacing: '1px', marginBottom: '4px' }}>✦ CONTEÚDO GERADO</div>
                      <div style={{ color: '#fff', fontWeight: 700, fontSize: '15px' }}>{resultadoManual.titulo}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={handleCopiar} style={{ background: copiado ? 'rgba(61,184,96,0.3)' : 'rgba(255,255,255,0.1)', color: copiado ? S.verde : 'rgba(255,255,255,0.7)', border: `1px solid ${copiado ? 'rgba(61,184,96,0.4)' : 'rgba(255,255,255,0.15)'}`, borderRadius: '8px', padding: '8px 14px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>{copiado ? '✓ Copiado!' : '📋 Copiar'}</button>
                      <button onClick={() => setResultadoManual(null)} style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 14px', fontSize: '12px', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>↺ Novo</button>
                    </div>
                  </div>
                  <div style={{ background: S.card, border: `1px solid ${S.borda}`, borderRadius: '12px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ background: 'rgba(61,184,96,0.1)', border: '1px solid rgba(61,184,96,0.2)', borderRadius: '8px', padding: '5px 12px', color: S.verde2, fontWeight: 700, fontSize: '12px', flexShrink: 0 }}>{resultadoManual.sugestao_formato}</div>
                    <div style={{ color: S.muted, fontSize: '12px', lineHeight: 1.5 }}><strong style={{ color: S.azul }}>Análise: </strong>{resultadoManual.descricao_analise}</div>
                  </div>
                  <div style={{ background: S.card, border: `1px solid ${S.borda}`, borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div style={{ color: S.muted, fontSize: '10px', fontWeight: 700, letterSpacing: '1px', marginBottom: '10px' }}>LEGENDA</div>
                    <p style={{ color: S.texto, fontSize: '13px', lineHeight: 1.8, whiteSpace: 'pre-wrap', margin: 0 }}>{resultadoManual.legenda}</p>
                  </div>
                  <div style={{ background: S.card, border: `1px solid ${S.borda}`, borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div style={{ color: S.muted, fontSize: '10px', fontWeight: 700, letterSpacing: '1px', marginBottom: '10px' }}>HASHTAGS</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {resultadoManual.hashtags?.map((h, i) => (
                        <span key={i} style={{ background: 'rgba(13,31,60,0.06)', color: S.azul, border: '1px solid rgba(13,31,60,0.12)', padding: '4px 10px', borderRadius: '20px', fontSize: '11px' }}>{h}</span>
                      ))}
                    </div>
                  </div>
                  {resultadoManual.sugestao_slides?.length > 0 && (
                    <div style={{ background: S.card, border: `1px solid ${S.borda}`, borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                      <div style={{ color: S.muted, fontSize: '10px', fontWeight: 700, letterSpacing: '1px', marginBottom: '12px' }}>SLIDES SUGERIDOS</div>
                      {resultadoManual.sugestao_slides.map((s, i) => (
                        <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '8px', alignItems: 'flex-start' }}>
                          <div style={{ background: S.azul, color: '#fff', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 800, flexShrink: 0 }}>{i+1}</div>
                          <div style={{ color: S.texto, fontSize: '12px', lineHeight: 1.5 }}>{s}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ background: S.card, border: `1px solid ${S.borda}`, borderRadius: '12px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                      <div style={{ color: S.muted, fontSize: '10px', fontWeight: 700, letterSpacing: '1px', marginBottom: '8px' }}>CTA</div>
                      <div style={{ color: S.texto, fontSize: '13px' }}>{resultadoManual.cta}</div>
                    </div>
                    <div style={{ background: S.card, border: `1px solid ${S.borda}`, borderRadius: '12px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                      <div style={{ color: S.muted, fontSize: '10px', fontWeight: 700, letterSpacing: '1px', marginBottom: '8px' }}>MELHOR HORÁRIO</div>
                      <div style={{ color: S.verde2, fontWeight: 900, fontSize: '20px' }}>⏰ {resultadoManual.horario}</div>
                    </div>
                  </div>
                  {resultadoManual.dicas?.length > 0 && (
                    <div style={{ background: 'rgba(61,184,96,0.04)', border: '1px solid rgba(61,184,96,0.15)', borderRadius: '16px', padding: '20px' }}>
                      <div style={{ color: S.verde2, fontSize: '12px', fontWeight: 700, letterSpacing: '1px', marginBottom: '12px' }}>💡 DICAS DA IA</div>
                      {resultadoManual.dicas.map((d, i) => (
                        <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px', fontSize: '12px', color: S.texto }}>
                          <span style={{ color: S.verde, flexShrink: 0 }}>→</span>{d}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

      </main>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}