"use client"

import Image from 'next/image'
import { useState, useEffect } from 'react'
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

interface PrimeiroDia {
  dia:     string
  tipo:    string
  tema:    string
  horario: string
  gancho:  string
}

interface PlanoAcao {
  meta_30_dias:      string
  meta_60_dias:      string
  meta_90_dias:      string
  frequencia_ideal:  string
  melhores_horarios: string[]
  mix_conteudo:      Record<string, number>
  primeiros_7_dias:  PrimeiroDia[]
  dicas_extras:      string[]
}

interface Analysis {
  id:                  string
  instagram_handle:    string
  score:               number
  plano_acao:          PlanoAcao
  engajamento_estimado:string
}

const TIPO_ICON: Record<string, string> = {
  Reel:      '🎬',
  Carrossel: '🎠',
  Post:      '📸',
  Story:     '📖',
  Banner:    '🖼️',
}

const TIPO_COR: Record<string, { bg: string; cor: string }> = {
  Reel:      { bg: 'rgba(139,92,246,0.1)',  cor: '#7c3aed' },
  Carrossel: { bg: 'rgba(37,99,235,0.1)',   cor: '#1d4ed8' },
  Post:      { bg: 'rgba(61,184,96,0.1)',   cor: '#2d9e50' },
  Story:     { bg: 'rgba(245,158,11,0.1)',  cor: '#d97706' },
  Banner:    { bg: 'rgba(239,68,68,0.1)',   cor: '#dc2626' },
}

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return [r, g, b]
}

function stripEmoji(str: string): string {
  return (str || '').replace(/[\u{1F000}-\u{1FFFF}]|[\u{2600}-\u{27BF}]|[\u{1F300}-\u{1F9FF}]|[✂-➰]|[-]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[‑-⛿]|\uD83E[\uDD10-\uDDFF]/gu, '').trim()
}

export default function ActionPlan() {
  const [analysis,     setAnalysis]     = useState<Analysis | null>(null)
  const [userId,       setUserId]       = useState('')
  const [loading,      setLoading]      = useState(true)
  const [salvando,     setSalvando]     = useState(false)
  const [salvandoPlan, setSalvandoPlan] = useState(false)
  const [planSalvo,    setPlanSalvo]    = useState(false)
  const [baixando,     setBaixando]     = useState(false)
  const [erro,         setErro]         = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: authData }) => {
      if (!authData.user) { window.location.href = '/login'; return }
      const uid = authData.user.id
      setUserId(uid)
      const res  = await fetch(`/api/analyze-instagram?userId=${uid}`)
      const json = await res.json()
      if (json.success && json.data) {
        setAnalysis(json.data)
        setLoading(false)
      } else {
        // Sem análise salva → volta para /analyze
        window.location.href = '/analyze'
      }
    })
  }, [])

  async function handleComecar() {
    setSalvando(true)
    try {
      await supabase.from('brand_kit').upsert({
        user_id:             userId,
        onboarding_completo: true,
        updated_at:          new Date().toISOString(),
      }, { onConflict: 'user_id' })
      window.location.href = '/dashboard'
    } catch (e: any) {
      setErro(e.message)
      setSalvando(false)
    }
  }

  async function handleSalvarPlano() {
    if (!analysis) return
    setSalvandoPlan(true)
    try {
      // Plano já está salvo na instagram_analysis; confirmamos marcando no brand_kit
      await supabase.from('brand_kit').upsert({
        user_id:    userId,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' })
      setPlanSalvo(true)
      setTimeout(() => setPlanSalvo(false), 4000)
    } catch (e: any) {
      setErro(e.message)
    } finally {
      setSalvandoPlan(false)
    }
  }

  async function handleBaixarPDF() {
    if (!analysis) return
    setBaixando(true)
    try {
      const { jsPDF } = await import('jspdf')
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const W   = doc.internal.pageSize.getWidth()
      const H   = doc.internal.pageSize.getHeight()
      const ML  = 18
      const CW  = W - ML * 2
      const plano = analysis.plano_acao || {} as PlanoAcao

      let y = 0

      function checkPage(need: number) {
        if (y + need > H - 22) {
          doc.addPage()
          // mini-header nas páginas seguintes
          doc.setFillColor(...hexToRgb('#0d1f3c'))
          doc.rect(0, 0, W, 10, 'F')
          doc.setTextColor(255, 255, 255)
          doc.setFont('helvetica', 'bold')
          doc.setFontSize(6)
          doc.text('AMARANTS INSTAGROWHT  —  PLANO DE ACAO', ML, 7)
          y = 18
        }
      }

      function sectionTitle(title: string) {
        checkPage(14)
        doc.setDrawColor(...hexToRgb('#3db860'))
        doc.setLineWidth(0.5)
        doc.line(ML, y, ML + CW, y)
        y += 5
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(10)
        doc.setTextColor(...hexToRgb('#0d1f3c'))
        doc.text(title.toUpperCase(), ML, y)
        y += 8
      }

      // ── HEADER ────────────────────────────────────────────────────────
      doc.setFillColor(...hexToRgb('#0d1f3c'))
      doc.rect(0, 0, W, 52, 'F')

      // Faixa verde decorativa
      doc.setFillColor(...hexToRgb('#3db860'))
      doc.rect(0, 52, W, 2.5, 'F')

      // Logo text
      doc.setTextColor(255, 255, 255)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(20)
      doc.text('AMARANTS', ML, 18)

      doc.setTextColor(...hexToRgb('#3db860'))
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9)
      doc.text('INSTAGROWHT', ML, 25)

      doc.setTextColor(255, 255, 255)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.text('Plano de Acao Personalizado com Inteligencia Artificial', ML, 33)

      // Perfil info (direita)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(14)
      doc.setTextColor(255, 255, 255)
      const handleText = `@${analysis.instagram_handle}`
      doc.text(handleText, W - ML, 18, { align: 'right' })

      doc.setFontSize(9)
      doc.setTextColor(...hexToRgb('#3db860'))
      doc.text(`Score do perfil: ${analysis.score}/100`, W - ML, 26, { align: 'right' })

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(180, 190, 210)
      doc.text(`Gerado em ${new Date().toLocaleDateString('pt-BR')}`, W - ML, 33, { align: 'right' })

      y = 62

      // ── METAS ─────────────────────────────────────────────────────────
      sectionTitle('Metas de Crescimento')

      const metas = [
        { label: '30 dias', valor: plano.meta_30_dias || '', cor: '#3db860' as const  },
        { label: '60 dias', valor: plano.meta_60_dias || '', cor: '#f59e0b' as const  },
        { label: '90 dias', valor: plano.meta_90_dias || '', cor: '#7c3aed' as const  },
      ]
      const cardW = (CW - 8) / 3

      metas.forEach((m, i) => {
        const cx = ML + i * (cardW + 4)
        doc.setFillColor(245, 246, 247)
        doc.roundedRect(cx, y, cardW, 20, 2, 2, 'F')

        doc.setFont('helvetica', 'bold')
        doc.setFontSize(7)
        doc.setTextColor(...hexToRgb(m.cor))
        doc.text(`EM ${m.label.toUpperCase()}`, cx + 4, y + 7)

        doc.setFont('helvetica', 'bold')
        doc.setFontSize(8)
        doc.setTextColor(...hexToRgb('#1a1a2e'))
        const lines = doc.splitTextToSize(stripEmoji(m.valor), cardW - 8)
        doc.text(lines.slice(0, 2), cx + 4, y + 14)
      })
      y += 28

      // ── FREQUÊNCIA E HORÁRIOS ──────────────────────────────────────────
      checkPage(30)
      sectionTitle('Frequencia e Horarios')

      doc.setFillColor(245, 246, 247)
      doc.roundedRect(ML, y, CW / 2 - 4, 20, 2, 2, 'F')
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(7)
      doc.setTextColor(...hexToRgb('#6b7280'))
      doc.text('FREQUENCIA IDEAL', ML + 4, y + 7)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10)
      doc.setTextColor(...hexToRgb('#3db860'))
      doc.text(stripEmoji(plano.frequencia_ideal || ''), ML + 4, y + 15)

      const hx = ML + CW / 2 + 4
      const hw = CW / 2 - 4
      doc.setFillColor(245, 246, 247)
      doc.roundedRect(hx, y, hw, 20, 2, 2, 'F')
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(7)
      doc.setTextColor(...hexToRgb('#6b7280'))
      doc.text('MELHORES HORARIOS', hx + 4, y + 7)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.setTextColor(...hexToRgb('#0d1f3c'))
      doc.text((plano.melhores_horarios || []).join('  |  '), hx + 4, y + 15)
      y += 28

      // ── MIX DE CONTEÚDO ───────────────────────────────────────────────
      checkPage(40)
      sectionTitle('Mix de Conteudo Ideal')

      const mix = Object.entries(plano.mix_conteudo || {})
      const mixCols = Math.min(mix.length, 4)
      const mixW = (CW - (mixCols - 1) * 4) / mixCols

      mix.forEach(([tipo, pct], i) => {
        const mx = ML + i * (mixW + 4)
        doc.setFillColor(245, 246, 247)
        doc.roundedRect(mx, y, mixW, 22, 2, 2, 'F')

        // barra de progresso
        const barW = mixW - 8
        doc.setFillColor(220, 222, 226)
        doc.roundedRect(mx + 4, y + 15, barW, 3, 1, 1, 'F')
        doc.setFillColor(...hexToRgb('#3db860'))
        doc.roundedRect(mx + 4, y + 15, barW * (pct / 100), 3, 1, 1, 'F')

        doc.setFont('helvetica', 'bold')
        doc.setFontSize(7)
        doc.setTextColor(...hexToRgb('#1a1a2e'))
        doc.text(tipo, mx + 4, y + 8)

        doc.setFont('helvetica', 'bold')
        doc.setFontSize(10)
        doc.setTextColor(...hexToRgb('#3db860'))
        doc.text(`${pct}%`, mx + mixW - 4, y + 8, { align: 'right' })
      })
      y += 30

      // ── PLANO 7 DIAS ──────────────────────────────────────────────────
      checkPage(20)
      sectionTitle('Plano dos Primeiros 7 Dias')

      ;(plano.primeiros_7_dias || []).forEach((item, i) => {
        checkPage(26)

        // linha zebrada
        if (i % 2 === 0) {
          doc.setFillColor(248, 249, 251)
          doc.rect(ML, y - 2, CW, 24, 'F')
        }

        // número
        doc.setFillColor(...hexToRgb('#0d1f3c'))
        doc.circle(ML + 5, y + 8, 4, 'F')
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(8)
        doc.setTextColor(255, 255, 255)
        doc.text(String(i + 1), ML + 5, y + 10.5, { align: 'center' })

        // dia + tipo
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(8)
        doc.setTextColor(...hexToRgb('#6b7280'))
        doc.text(item.dia?.toUpperCase() || '', ML + 13, y + 6)

        doc.setFont('helvetica', 'bold')
        doc.setFontSize(7)
        doc.setTextColor(...hexToRgb('#3db860'))
        doc.text(`[${item.tipo || ''}]`, ML + 13, y + 12)

        doc.setFont('helvetica', 'normal')
        doc.setFontSize(7)
        doc.setTextColor(...hexToRgb('#0d1f3c'))
        doc.text(`Horario: ${item.horario || ''}`, ML + 13, y + 18)

        // tema
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(9)
        doc.setTextColor(...hexToRgb('#1a1a2e'))
        const temaLines = doc.splitTextToSize(stripEmoji(item.tema || ''), CW - 55)
        doc.text(temaLines.slice(0, 1), ML + 55, y + 7)

        // gancho
        doc.setFont('helvetica', 'italic')
        doc.setFontSize(7.5)
        doc.setTextColor(...hexToRgb('#6b7280'))
        const ganchoLines = doc.splitTextToSize(`"${stripEmoji(item.gancho || '')}"`, CW - 55)
        doc.text(ganchoLines.slice(0, 2), ML + 55, y + 14)

        y += 24
      })
      y += 6

      // ── DICAS ESTRATÉGICAS ────────────────────────────────────────────
      if ((plano.dicas_extras || []).length > 0) {
        checkPage(20)
        sectionTitle('Dicas Estrategicas')

        ;(plano.dicas_extras || []).forEach((dica) => {
          checkPage(12)
          doc.setFillColor(...hexToRgb('#3db860'))
          doc.circle(ML + 3, y + 2.5, 1.5, 'F')
          doc.setFont('helvetica', 'normal')
          doc.setFontSize(8.5)
          doc.setTextColor(...hexToRgb('#1a1a2e'))
          const lines = doc.splitTextToSize(stripEmoji(dica), CW - 10)
          doc.text(lines, ML + 8, y + 4)
          y += lines.length * 5 + 5
        })
      }

      // ── RODAPÉ ────────────────────────────────────────────────────────
      const totalPages = (doc as any).internal.getNumberOfPages()
      for (let p = 1; p <= totalPages; p++) {
        doc.setPage(p)
        const fy = H - 12
        doc.setFillColor(...hexToRgb('#0d1f3c'))
        doc.rect(0, H - 16, W, 16, 'F')

        doc.setFont('helvetica', 'bold')
        doc.setFontSize(7)
        doc.setTextColor(...hexToRgb('#3db860'))
        doc.text('AMARANTS INSTAGROWHT', ML, fy)

        doc.setFont('helvetica', 'normal')
        doc.setTextColor(180, 190, 210)
        doc.text('amarants.com.br  |  WhatsApp: (11) 99999-9999', W / 2, fy, { align: 'center' })

        doc.setTextColor(120, 140, 170)
        doc.text(`Pag. ${p} / ${totalPages}`, W - ML, fy, { align: 'right' })
      }

      doc.save(`plano-acao-@${analysis.instagram_handle}.pdf`)
    } catch (e: any) {
      setErro('Erro ao gerar PDF: ' + e.message)
    } finally {
      setBaixando(false)
    }
  }

  // ── LOADING ────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: S.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', border: '4px solid rgba(61,184,96,0.15)', borderTop: `4px solid ${S.verde}`, animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: S.muted, fontSize: '14px' }}>Carregando seu plano de ação...</p>
        </div>
      </div>
    )
  }

  // ── ERRO ───────────────────────────────────────────────────────────────
  if (erro || !analysis) {
    return (
      <div style={{ minHeight: '100vh', background: S.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ background: S.card, borderRadius: '20px', padding: '48px', textAlign: 'center', maxWidth: '420px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
          <p style={{ color: S.muted, fontSize: '14px', marginBottom: '24px' }}>{erro || 'Plano não encontrado.'}</p>
          <button type="button" onClick={() => { window.location.href = '/connect-instagram' }} style={{ padding: '12px 28px', background: S.verde, color: '#fff', border: 'none', borderRadius: '9px', fontWeight: 700, cursor: 'pointer', fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
            Voltar ao início
          </button>
        </div>
      </div>
    )
  }

  const plano = analysis.plano_acao || {} as PlanoAcao

  // ── PÁGINA PRINCIPAL ───────────────────────────────────────────────────
  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
        @keyframes fadeIn  { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:none} }
        .fade-up  { animation: fadeUp 0.5s ease both; }
        .day-card { transition: all 0.2s; }
        .day-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
        .btn-sec  { transition: all 0.18s; }
        .btn-sec:hover:not(:disabled) { transform: translateY(-1px); }
      `}</style>

      <div style={{ minHeight: '100vh', background: S.bg, fontFamily: 'Inter, sans-serif', paddingBottom: '60px' }}>

        {/* Toast salvo */}
        {planSalvo && (
          <div style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 9999, background: S.verde, color: '#fff', padding: '12px 28px', borderRadius: '12px', fontWeight: 700, fontSize: '14px', boxShadow: '0 4px 20px rgba(61,184,96,0.4)', display: 'flex', alignItems: 'center', gap: '10px', animation: 'fadeIn 0.3s ease', fontFamily: 'Inter, sans-serif' }}>
            ✓ Plano salvo com sucesso! Acesse pelo dashboard a qualquer momento.
          </div>
        )}

        {/* Header escuro */}
        <div style={{ background: S.side, padding: '28px 20px' }}>
          <div style={{ maxWidth: '860px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <Image src="/logo.png" alt="Logo" width={36} height={36} style={{ borderRadius: '9px' }} />
              <div>
                <div style={{ color: '#fff', fontWeight: 900, fontSize: '13px', letterSpacing: '3px' }}>AMARANTS</div>
                <div style={{ color: S.verde, fontSize: '8px', letterSpacing: '2.5px', textTransform: 'uppercase' }}>Instagrowht</div>
              </div>
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(61,184,96,0.12)', border: '1px solid rgba(61,184,96,0.25)', color: S.verde, fontSize: '10px', fontWeight: 800, padding: '5px 14px', borderRadius: '20px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px' }}>
              ✦ Plano de Ação Personalizado
            </div>

            <h1 style={{ color: '#fff', fontWeight: 900, fontSize: '28px', margin: '0 0 8px', letterSpacing: '-0.5px' }}>
              Seu roteiro para o crescimento no Instagram
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', margin: 0 }}>
              Perfil analisado: <strong style={{ color: '#fff' }}>@{analysis.instagram_handle}</strong> · Score: <strong style={{ color: S.verde }}>{analysis.score}/100</strong>
            </p>
          </div>
        </div>

        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '32px 20px' }}>

          {/* Metas */}
          <div className="fade-up" style={{ animationDelay: '0.05s', marginBottom: '24px' }}>
            <h2 style={{ color: S.texto, fontWeight: 900, fontSize: '18px', margin: '0 0 16px' }}>📈 Metas de crescimento</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {[
                { label: '30 dias', valor: plano.meta_30_dias, cor: S.verde   },
                { label: '60 dias', valor: plano.meta_60_dias, cor: '#f59e0b' },
                { label: '90 dias', valor: plano.meta_90_dias, cor: '#7c3aed' },
              ].map(m => (
                <div key={m.label} style={{ background: S.card, border: `1px solid ${S.borda}`, borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
                  <div style={{ color: m.cor, fontSize: '11px', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '10px' }}>Em {m.label}</div>
                  <div style={{ color: S.texto, fontWeight: 900, fontSize: '17px', lineHeight: 1.3 }}>{m.valor}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Frequência e horários */}
          <div className="fade-up" style={{ animationDelay: '0.1s', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
            <div style={{ background: S.card, border: `1px solid ${S.borda}`, borderRadius: '16px', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: 'rgba(61,184,96,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📅</div>
                <div style={{ color: S.texto, fontWeight: 800, fontSize: '15px' }}>Frequência Ideal</div>
              </div>
              <div style={{ color: S.verde, fontWeight: 900, fontSize: '22px' }}>{plano.frequencia_ideal}</div>
              <div style={{ color: S.muted, fontSize: '12px', marginTop: '6px' }}>Para treinar o algoritmo</div>
            </div>

            <div style={{ background: S.card, border: `1px solid ${S.borda}`, borderRadius: '16px', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: 'rgba(13,31,60,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⏰</div>
                <div style={{ color: S.texto, fontWeight: 800, fontSize: '15px' }}>Melhores Horários</div>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {(plano.melhores_horarios || []).map((h, i) => (
                  <div key={i} style={{ background: 'rgba(13,31,60,0.06)', border: `1px solid ${S.borda}`, borderRadius: '8px', padding: '6px 12px', color: S.side, fontWeight: 800, fontSize: '14px' }}>{h}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Mix de conteúdo */}
          <div className="fade-up" style={{ animationDelay: '0.15s', background: S.card, border: `1px solid ${S.borda}`, borderRadius: '16px', padding: '28px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: 'rgba(61,184,96,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🎯</div>
              <div style={{ color: S.texto, fontWeight: 800, fontSize: '15px' }}>Mix de Conteúdo Ideal</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
              {Object.entries(plano.mix_conteudo || {}).map(([tipo, pct]) => (
                <div key={tipo} style={{ background: '#f8f9fb', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ color: S.texto, fontSize: '13px', fontWeight: 700 }}>{tipo}</span>
                    <span style={{ color: S.verde, fontWeight: 900, fontSize: '16px' }}>{pct}%</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(0,0,0,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, ${S.verde}, #22c55e)`, borderRadius: '3px', transition: 'width 1s ease' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Plano 7 dias */}
          <div className="fade-up" style={{ animationDelay: '0.2s', marginBottom: '24px' }}>
            <h2 style={{ color: S.texto, fontWeight: 900, fontSize: '18px', margin: '0 0 16px' }}>📋 Plano dos primeiros 7 dias</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {(plano.primeiros_7_dias || []).map((item, i) => {
                const tc = TIPO_COR[item.tipo] || { bg: 'rgba(0,0,0,0.06)', cor: S.muted }
                return (
                  <div key={i} className="day-card" style={{ background: S.card, border: `1px solid ${S.borda}`, borderRadius: '14px', padding: '20px 24px', display: 'flex', alignItems: 'flex-start', gap: '20px', cursor: 'default' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(13,31,60,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: S.side, fontWeight: 900, fontSize: '15px', flexShrink: 0 }}>
                      {i + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                        <span style={{ color: S.muted, fontSize: '12px', fontWeight: 700 }}>{item.dia}</span>
                        <div style={{ background: tc.bg, color: tc.cor, fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: '20px' }}>
                          {TIPO_ICON[item.tipo] || '📄'} {item.tipo}
                        </div>
                        <div style={{ background: 'rgba(13,31,60,0.06)', color: S.side, fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px' }}>
                          ⏰ {item.horario}
                        </div>
                      </div>
                      <div style={{ color: S.texto, fontWeight: 800, fontSize: '15px', marginBottom: '6px' }}>{item.tema}</div>
                      <div style={{ color: S.muted, fontSize: '13px', fontStyle: 'italic' }}>"{item.gancho}"</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Dicas extras */}
          {(plano.dicas_extras || []).length > 0 && (
            <div className="fade-up" style={{ animationDelay: '0.25s', background: 'rgba(61,184,96,0.06)', border: '1px solid rgba(61,184,96,0.2)', borderRadius: '16px', padding: '24px 28px', marginBottom: '32px' }}>
              <div style={{ color: S.verde2, fontWeight: 800, fontSize: '15px', marginBottom: '16px' }}>💡 Dicas estratégicas</div>
              {(plano.dicas_extras || []).map((d, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '10px' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(61,184,96,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: S.verde2, flexShrink: 0, marginTop: '1px' }}>✓</div>
                  <span style={{ color: S.texto, fontSize: '14px', lineHeight: 1.5 }}>{d}</span>
                </div>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="fade-up" style={{ animationDelay: '0.3s', background: `linear-gradient(135deg, ${S.side} 0%, #1a3a6e 100%)`, borderRadius: '20px', padding: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>🚀</div>
            <h2 style={{ color: '#fff', fontWeight: 900, fontSize: '24px', margin: '0 0 12px', letterSpacing: '-0.5px' }}>
              Pronto para transformar seu Instagram?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '15px', marginBottom: '28px', lineHeight: 1.6 }}>
              Seu plano está pronto. Clique abaixo para acessar o painel e<br />
              começar a gerar conteúdo com IA agora mesmo.
            </p>

            {/* Botões Salvar e PDF */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn-sec"
                onClick={handleSalvarPlano}
                disabled={salvandoPlan}
                style={{ padding: '13px 28px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '10px', fontWeight: 700, fontSize: '14px', cursor: salvandoPlan ? 'not-allowed' : 'pointer', opacity: salvandoPlan ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Inter, sans-serif' }}
              >
                {salvandoPlan
                  ? <><span style={{ display: 'inline-block', animation: 'spin 0.8s linear infinite' }}>⟳</span> Salvando...</>
                  : <>💾 Salvar plano</>
                }
              </button>

              <button
                type="button"
                className="btn-sec"
                onClick={handleBaixarPDF}
                disabled={baixando}
                style={{ padding: '13px 28px', background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '10px', fontWeight: 700, fontSize: '14px', cursor: baixando ? 'not-allowed' : 'pointer', opacity: baixando ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'Inter, sans-serif' }}
              >
                {baixando
                  ? <><span style={{ display: 'inline-block', animation: 'spin 0.8s linear infinite' }}>⟳</span> Gerando PDF...</>
                  : <>📄 Baixar PDF</>
                }
              </button>
            </div>

            {/* Botão principal */}
            <button
              type="button"
              onClick={handleComecar}
              disabled={salvando}
              style={{ padding: '18px 52px', background: S.verde, color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 800, fontSize: '18px', cursor: salvando ? 'not-allowed' : 'pointer', opacity: salvando ? 0.7 : 1, boxShadow: '0 4px 20px rgba(61,184,96,0.4)', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s', letterSpacing: '0.3px' }}
            >
              {salvando ? '⟳ Abrindo painel...' : '✦ Começar agora →'}
            </button>

            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', marginTop: '16px' }}>
              Sem compromisso. Cancele quando quiser.
            </p>
          </div>

        </div>
      </div>
    </>
  )
}
