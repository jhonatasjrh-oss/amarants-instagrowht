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

interface DiaDia {
  dia:           string
  tipo:          string
  tema:          string
  horario:       string
  gancho:        string
  roteiro:       string
  legenda:       string
  hashtags:      string[]
  dica_execucao: string
}

interface MetaSemanal {
  semana: string
  meta:   string
  foco:   string
}

interface PlanoAcao {
  diagnostico?:         { posicionamento: string; publico_ideal: string; tom_de_voz: string; principal_oportunidade: string }
  meta_30_dias:         string
  meta_60_dias:         string
  meta_90_dias:         string
  frequencia_ideal:     string
  melhores_horarios:    string[]
  mix_conteudo:         Record<string, number>
  primeiros_7_dias:     DiaDia[]
  dicas_extras:         string[]
  guia_execucao?:       Record<string, string>
  estrategia_hashtags?: { grandes: string[]; medias: string[]; nicho: string[] }
  plano_engajamento?:   string[]
  metas_semanais?:      MetaSemanal[]
}

interface Analysis {
  id:                   string
  instagram_handle:     string
  score:                number
  pontos_fortes:        string[]
  pontos_fracos:        string[]
  risco_shadowban:      string
  frequencia_atual:     string
  engajamento_estimado: string
  plano_acao:           PlanoAcao
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

function stripEmoji(str: string): string {
  return (str || '').replace(/[\u{1F000}-\u{1FFFF}]|[\u{2600}-\u{27BF}]|[\u{1F300}-\u{1F9FF}]|[✂-➰]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\uD83E[\uDD10-\uDDFF]/gu, '').trim()
}

function AccordionSection({ icon, title, open, onToggle, children }: {
  icon: string
  title: string
  open: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div style={{ background: S.card, border: `1px solid ${S.borda}`, borderRadius: '16px', marginBottom: '16px', overflow: 'hidden' }}>
      <button
        type="button"
        onClick={onToggle}
        style={{ width: '100%', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif', textAlign: 'left' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: 'rgba(61,184,96,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px', flexShrink: 0 }}>{icon}</div>
          <span style={{ color: S.texto, fontWeight: 800, fontSize: '16px' }}>{title}</span>
        </div>
        <span style={{ color: S.muted, fontSize: '20px', display: 'inline-block', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s', flexShrink: 0 }}>▾</span>
      </button>
      {open && (
        <div style={{ padding: '0 24px 24px', borderTop: `1px solid ${S.borda}` }}>
          {children}
        </div>
      )}
    </div>
  )
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
  const [expandedDay,  setExpandedDay]  = useState<number | null>(null)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    diagnostico:    true,
    dias:           true,
    guia:           false,
    hashtags:       false,
    engajamento:    false,
    metas_semanais: false,
  })

  function toggleSection(key: string) {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }))
  }

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: authData }) => {
      if (!authData.user) { window.location.href = '/amarantsinstagrouth/login'; return }
      const uid = authData.user.id
      setUserId(uid)
      const res  = await fetch(`/amarantsinstagrouth/api/analyze-instagram?userId=${uid}`)
      const json = await res.json()
      if (json.success && json.data) {
        setAnalysis(json.data)
        setLoading(false)
      } else {
        window.location.href = '/amarantsinstagrouth/analyze'
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
      window.location.href = '/amarantsinstagrouth/dashboard'
    } catch (e: any) {
      setErro(e.message)
      setSalvando(false)
    }
  }

  async function handleSalvarPlano() {
    if (!analysis) return
    setSalvandoPlan(true)
    try {
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
    const a = analysis
    setBaixando(true)
    try {
      const { jsPDF } = await import('jspdf')
      const doc   = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const W     = doc.internal.pageSize.getWidth()
      const H     = doc.internal.pageSize.getHeight()
      const ML    = 16
      const MR    = 16
      const CW    = W - ML - MR
      const FOOT  = 18
      const plano = a.plano_acao || {} as PlanoAcao

      let y = 0

      function clean(s: string | undefined | null): string {
        return stripEmoji((s || '').replace(/\n+/g, ' ')).trim()
      }

      function addSubHeader() {
        doc.setFillColor('#0d1f3c')
        doc.rect(0, 0, W, 9, 'F')
        doc.setTextColor('#3db860')
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(5.5)
        doc.text('AMARANTS INSTAGROWHT', ML, 6)
        doc.setTextColor(160, 180, 200)
        doc.setFont('helvetica', 'normal')
        doc.text(`@${a.instagram_handle}  |  Score ${a.score}/100`, W - MR, 6, { align: 'right' })
        y = 16
      }

      function checkPage(need: number) {
        if (y + need > H - FOOT) {
          doc.addPage()
          addSubHeader()
        }
      }

      function sectionTitle(title: string) {
        checkPage(16)
        y += 4
        doc.setDrawColor('#3db860')
        doc.setLineWidth(0.35)
        doc.line(ML, y, ML + CW, y)
        y += 5
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(9.5)
        doc.setTextColor('#0d1f3c')
        doc.text(title.toUpperCase(), ML, y)
        y += 7
      }

      function fieldBlock(label: string, text: string, textSize = 8.5) {
        const lh    = textSize * 0.38
        const lines = doc.splitTextToSize(clean(text), CW - 4)
        checkPage(lines.length * lh + 12)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(6.5)
        doc.setTextColor('#3db860')
        doc.text(label.toUpperCase(), ML, y)
        y += 4.5
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(textSize)
        doc.setTextColor('#1a1a2e')
        doc.text(lines, ML, y)
        y += lines.length * lh + 5
      }

      function bullet(text: string, size = 8) {
        const lh    = size * 0.38
        const lines = doc.splitTextToSize(clean(text), CW - 9)
        checkPage(lines.length * lh + 5)
        doc.setFillColor('#3db860')
        doc.circle(ML + 2.5, y + 1.8, 1.3, 'F')
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(size)
        doc.setTextColor('#1a1a2e')
        doc.text(lines, ML + 7, y + 3)
        y += lines.length * lh + 4
      }

      function numbered(text: string, idx: number, size = 8) {
        const lh    = size * 0.38
        const lines = doc.splitTextToSize(clean(text), CW - 10)
        checkPage(lines.length * lh + 6)
        doc.setFillColor('#0d1f3c')
        doc.circle(ML + 3, y + 2.2, 2.6, 'F')
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(6)
        doc.setTextColor('#ffffff')
        doc.text(String(idx + 1), ML + 3, y + 3.8, { align: 'center' })
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(size)
        doc.setTextColor('#1a1a2e')
        doc.text(lines, ML + 9, y + 3)
        y += lines.length * lh + 5
      }

      function miniLabel(text: string) {
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(6.5)
        doc.setTextColor('#6b7280')
        doc.text(text.toUpperCase(), ML, y)
        y += 4.5
      }

      // ══════════════════════════════════════════════════════════════════
      // CAPA
      // ══════════════════════════════════════════════════════════════════
      doc.setFillColor('#0d1f3c')
      doc.rect(0, 0, W, 58, 'F')
      doc.setFillColor('#3db860')
      doc.rect(0, 58, W, 2.5, 'F')

      doc.setTextColor('#ffffff')
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(22)
      doc.text('AMARANTS', ML, 20)

      doc.setTextColor('#3db860')
      doc.setFontSize(8.5)
      doc.text('INSTAGROWHT', ML, 27.5)

      doc.setTextColor('#ffffff')
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7.5)
      doc.text('Plano Estrategico Personalizado com Inteligencia Artificial', ML, 35)

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(14)
      doc.setTextColor('#ffffff')
      doc.text(`@${a.instagram_handle}`, W - MR, 20, { align: 'right' })

      doc.setFontSize(8.5)
      doc.setTextColor('#3db860')
      doc.text(`Score do perfil: ${a.score}/100`, W - MR, 28, { align: 'right' })

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7)
      doc.setTextColor(180, 190, 210)
      doc.text(new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }), W - MR, 35, { align: 'right' })

      y = 68

      // ══════════════════════════════════════════════════════════════════
      // 1. VISÃO GERAL
      // ══════════════════════════════════════════════════════════════════
      sectionTitle('Visao Geral do Perfil')

      const ovW = (CW - 9) / 4
      const ovItems = [
        { label: 'Score',           valor: `${a.score}/100`,              cor: '#3db860' },
        { label: 'Risco Shadowban', valor: a.risco_shadowban || '—',      cor: a.risco_shadowban === 'alto' ? '#ef4444' : a.risco_shadowban === 'médio' ? '#f59e0b' : '#3db860' },
        { label: 'Engajamento',     valor: a.engajamento_estimado || '—', cor: '#1d4ed8' },
        { label: 'Frequencia',      valor: a.frequencia_atual || '—',     cor: '#7c3aed' },
      ]
      checkPage(22)
      ovItems.forEach((ov, i) => {
        const ox = ML + i * (ovW + 3)
        doc.setFillColor(245, 246, 248)
        doc.roundedRect(ox, y, ovW, 18, 2, 2, 'F')
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(5.5)
        doc.setTextColor('#6b7280')
        doc.text(ov.label.toUpperCase(), ox + 3, y + 6)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(9)
        doc.setTextColor(ov.cor)
        const vLines = doc.splitTextToSize(clean(ov.valor), ovW - 6)
        doc.text(vLines[0] || '', ox + 3, y + 14)
      })
      y += 24

      // ══════════════════════════════════════════════════════════════════
      // 2. PONTOS FORTES
      // ══════════════════════════════════════════════════════════════════
      if ((a.pontos_fortes || []).length > 0) {
        sectionTitle('Pontos Fortes')
        ;(a.pontos_fortes || []).forEach(p => bullet(p))
        y += 2
      }

      // ══════════════════════════════════════════════════════════════════
      // 3. PONTOS FRACOS
      // ══════════════════════════════════════════════════════════════════
      if ((a.pontos_fracos || []).length > 0) {
        sectionTitle('Pontos a Melhorar')
        ;(a.pontos_fracos || []).forEach(p => {
          const lines = doc.splitTextToSize(clean(p), CW - 9)
          checkPage(lines.length * 3.5 + 5)
          doc.setFillColor('#ef4444')
          doc.circle(ML + 2.5, y + 1.8, 1.3, 'F')
          doc.setFont('helvetica', 'normal')
          doc.setFontSize(8)
          doc.setTextColor('#1a1a2e')
          doc.text(lines, ML + 7, y + 3)
          y += lines.length * 3.5 + 4
        })
        y += 2
      }

      // ══════════════════════════════════════════════════════════════════
      // 4. DIAGNÓSTICO
      // ══════════════════════════════════════════════════════════════════
      const diag = plano.diagnostico
      if (diag) {
        sectionTitle('Diagnostico do Perfil')
        fieldBlock('Posicionamento',        diag.posicionamento)
        fieldBlock('Publico Ideal',          diag.publico_ideal)
        fieldBlock('Tom de Voz',             diag.tom_de_voz)
        fieldBlock('Principal Oportunidade', diag.principal_oportunidade)
      }

      // ══════════════════════════════════════════════════════════════════
      // 5. METAS DE CRESCIMENTO
      // ══════════════════════════════════════════════════════════════════
      sectionTitle('Metas de Crescimento')

      const metaCards = [
        { label: '30 DIAS', valor: plano.meta_30_dias || '', cor: '#3db860' as string },
        { label: '60 DIAS', valor: plano.meta_60_dias || '', cor: '#f59e0b' as string },
        { label: '90 DIAS', valor: plano.meta_90_dias || '', cor: '#7c3aed' as string },
      ]
      const mcW = (CW - 8) / 3
      checkPage(30)
      metaCards.forEach((m, i) => {
        const cx = ML + i * (mcW + 4)
        doc.setFillColor(245, 246, 248)
        doc.roundedRect(cx, y, mcW, 24, 2, 2, 'F')
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(6.5)
        doc.setTextColor(m.cor)
        doc.text(`EM ${m.label}`, cx + 4, y + 7)
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8)
        doc.setTextColor('#1a1a2e')
        const ml = doc.splitTextToSize(clean(m.valor), mcW - 8)
        doc.text(ml.slice(0, 3), cx + 4, y + 14)
      })
      y += 30

      // ── Frequência e Horários ─────────────────────────────────────────
      checkPage(26)
      const hw = CW / 2 - 3
      doc.setFillColor(245, 246, 248)
      doc.roundedRect(ML, y, hw, 20, 2, 2, 'F')
      miniLabel('Frequencia Ideal')
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.setTextColor('#3db860')
      doc.text(clean(plano.frequencia_ideal), ML + 3, y - 4 + 15)

      const hx2 = ML + hw + 6
      doc.setFillColor(245, 246, 248)
      doc.roundedRect(hx2, y - 9, hw, 20, 2, 2, 'F')
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(6.5)
      doc.setTextColor('#6b7280')
      doc.text('MELHORES HORARIOS', hx2 + 3, y - 3)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8.5)
      doc.setTextColor('#0d1f3c')
      doc.text((plano.melhores_horarios || []).join('  |  '), hx2 + 3, y + 5)
      y += 18

      // ── Mix de Conteúdo ───────────────────────────────────────────────
      sectionTitle('Mix de Conteudo Ideal')
      const mix     = Object.entries(plano.mix_conteudo || {})
      const mixCols = Math.min(mix.length, 4)
      const mixW    = mixCols > 0 ? (CW - (mixCols - 1) * 4) / mixCols : CW
      checkPage(26)
      mix.forEach(([tipo, pct], i) => {
        const mx = ML + i * (mixW + 4)
        doc.setFillColor(245, 246, 248)
        doc.roundedRect(mx, y, mixW, 22, 2, 2, 'F')
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(7)
        doc.setTextColor('#1a1a2e')
        doc.text(tipo, mx + 3, y + 8)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(10)
        doc.setTextColor('#3db860')
        doc.text(`${pct}%`, mx + mixW - 3, y + 8, { align: 'right' })
        const bw = mixW - 6
        doc.setFillColor(218, 220, 224)
        doc.roundedRect(mx + 3, y + 14, bw, 2.5, 1, 1, 'F')
        doc.setFillColor('#3db860')
        doc.roundedRect(mx + 3, y + 14, Math.max(bw * (pct / 100), 0.5), 2.5, 1, 1, 'F')
      })
      y += 28

      // ══════════════════════════════════════════════════════════════════
      // 6. PLANO DOS 7 DIAS (COMPLETO)
      // ══════════════════════════════════════════════════════════════════
      sectionTitle('Plano dos Primeiros 7 Dias')

      ;(plano.primeiros_7_dias || []).forEach((item, i) => {
        // Estimate total height for this day card
        const roteiroLines = doc.splitTextToSize(clean(item.roteiro), CW - 4)
        const legendaLines = doc.splitTextToSize(clean(item.legenda), CW - 4)
        const hashStr      = (item.hashtags || []).join('  ').slice(0, 200)
        const hashLines    = doc.splitTextToSize(hashStr, CW - 4)
        const dicaLines    = doc.splitTextToSize(clean(item.dica_execucao), CW - 4)
        const dayHeight    = 18 + roteiroLines.length * 3.5 + legendaLines.length * 3.5 + hashLines.length * 3.5 + dicaLines.length * 3.5 + 40

        // Always start each day on enough space; force new page if less than 60mm
        if (y + Math.min(dayHeight, 60) > H - FOOT) {
          doc.addPage()
          addSubHeader()
        }

        // Day header bar
        doc.setFillColor('#0d1f3c')
        doc.roundedRect(ML, y, CW, 10, 2, 2, 'F')
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(8)
        doc.setTextColor('#ffffff')
        doc.text(`${i + 1}. ${(item.dia || '').toUpperCase()}`, ML + 4, y + 7)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(7.5)
        doc.setTextColor('#3db860')
        doc.text(`${item.tipo || ''}  •  ${item.horario || ''}`, W - MR, y + 7, { align: 'right' })
        y += 13

        // Tema + gancho
        const temaL = doc.splitTextToSize(clean(item.tema), CW)
        checkPage(temaL.length * 4 + 12)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(9)
        doc.setTextColor('#1a1a2e')
        doc.text(temaL, ML, y)
        y += temaL.length * 4 + 2

        if (item.gancho) {
          const gLines = doc.splitTextToSize(`"${clean(item.gancho)}"`, CW)
          checkPage(gLines.length * 3.5 + 5)
          doc.setFont('helvetica', 'italic')
          doc.setFontSize(8)
          doc.setTextColor('#6b7280')
          doc.text(gLines, ML, y)
          y += gLines.length * 3.5 + 5
        }

        // Roteiro
        if (item.roteiro) {
          checkPage(8)
          doc.setFont('helvetica', 'bold')
          doc.setFontSize(6.5)
          doc.setTextColor('#3db860')
          doc.text('ROTEIRO', ML, y)
          y += 4.5
          doc.setFont('helvetica', 'normal')
          doc.setFontSize(8)
          doc.setTextColor('#1a1a2e')
          const rl = doc.splitTextToSize(clean(item.roteiro), CW)
          rl.forEach((line: string) => {
            checkPage(4)
            doc.text(line, ML, y)
            y += 4
          })
          y += 3
        }

        // Legenda
        if (item.legenda) {
          checkPage(8)
          doc.setFont('helvetica', 'bold')
          doc.setFontSize(6.5)
          doc.setTextColor('#3db860')
          doc.text('LEGENDA', ML, y)
          y += 4.5
          doc.setFillColor(248, 249, 251)
          const legL  = doc.splitTextToSize(clean(item.legenda), CW - 6)
          const legH  = legL.length * 4 + 6
          checkPage(legH + 4)
          doc.rect(ML, y - 2, CW, legH, 'F')
          doc.setFont('helvetica', 'normal')
          doc.setFontSize(8)
          doc.setTextColor('#1a1a2e')
          legL.forEach((line: string) => {
            checkPage(4)
            doc.text(line, ML + 3, y)
            y += 4
          })
          y += 5
        }

        // Hashtags
        if ((item.hashtags || []).length > 0) {
          checkPage(8)
          doc.setFont('helvetica', 'bold')
          doc.setFontSize(6.5)
          doc.setTextColor('#3db860')
          doc.text('HASHTAGS', ML, y)
          y += 4.5
          const hashText = (item.hashtags || []).join('  ')
          const hll      = doc.splitTextToSize(hashText, CW)
          checkPage(hll.length * 4 + 4)
          doc.setFont('helvetica', 'normal')
          doc.setFontSize(7.5)
          doc.setTextColor('#1d4ed8')
          doc.text(hll, ML, y)
          y += hll.length * 4 + 3
        }

        // Dica de execução
        if (item.dica_execucao) {
          const dicaL = doc.splitTextToSize(clean(item.dica_execucao), CW - 6)
          checkPage(dicaL.length * 3.8 + 12)
          doc.setFillColor(245, 251, 247)
          doc.roundedRect(ML, y, CW, dicaL.length * 3.8 + 8, 2, 2, 'F')
          doc.setFont('helvetica', 'bold')
          doc.setFontSize(6.5)
          doc.setTextColor('#2d9e50')
          doc.text('DICA DE EXECUCAO', ML + 3, y + 5)
          y += 8
          doc.setFont('helvetica', 'normal')
          doc.setFontSize(7.5)
          doc.setTextColor('#1a1a2e')
          dicaL.forEach((line: string) => {
            doc.text(line, ML + 3, y)
            y += 3.8
          })
          y += 4
        }

        // Separator line between days
        checkPage(8)
        doc.setDrawColor(230, 232, 236)
        doc.setLineWidth(0.3)
        doc.line(ML, y + 2, ML + CW, y + 2)
        y += 8
      })

      // ══════════════════════════════════════════════════════════════════
      // 7. GUIA DE EXECUÇÃO POR FORMATO
      // ══════════════════════════════════════════════════════════════════
      if (plano.guia_execucao && Object.keys(plano.guia_execucao).length > 0) {
        sectionTitle('Guia de Execucao por Formato')
        Object.entries(plano.guia_execucao).forEach(([formato, guia]) => {
          checkPage(12)
          doc.setFont('helvetica', 'bold')
          doc.setFontSize(8.5)
          doc.setTextColor('#0d1f3c')
          doc.text(formato.toUpperCase(), ML, y)
          y += 5
          const gl = doc.splitTextToSize(clean(guia), CW - 4)
          checkPage(gl.length * 3.8 + 4)
          doc.setFont('helvetica', 'normal')
          doc.setFontSize(8)
          doc.setTextColor('#1a1a2e')
          gl.forEach((line: string) => {
            checkPage(4)
            doc.text(line, ML + 4, y)
            y += 3.8
          })
          y += 6
        })
      }

      // ══════════════════════════════════════════════════════════════════
      // 8. ESTRATÉGIA DE HASHTAGS
      // ══════════════════════════════════════════════════════════════════
      const ht = plano.estrategia_hashtags
      if (ht) {
        sectionTitle('Estrategia de Hashtags')

        const htCols = [
          { label: 'Grandes (1M+ posts)',      items: ht.grandes || [], cor: '#7c3aed' as string },
          { label: 'Medias (100k-1M posts)',   items: ht.medias  || [], cor: '#1d4ed8' as string },
          { label: 'Nicho (<100k posts)',       items: ht.nicho   || [], cor: '#2d9e50' as string },
        ]
        const htColW = (CW - 8) / 3
        const maxRows = Math.max(...htCols.map(c => c.items.length))
        const htH    = maxRows * 8 + 16
        checkPage(htH + 4)

        htCols.forEach((col, ci) => {
          const cx = ML + ci * (htColW + 4)
          doc.setFillColor(248, 249, 251)
          doc.roundedRect(cx, y, htColW, htH, 2, 2, 'F')
          doc.setFont('helvetica', 'bold')
          doc.setFontSize(6.5)
          doc.setTextColor(col.cor)
          const labelL = doc.splitTextToSize(col.label, htColW - 6)
          doc.text(labelL, cx + 3, y + 6)
          let ry = y + 6 + labelL.length * 4
          col.items.forEach(tag => {
            doc.setFont('helvetica', 'normal')
            doc.setFontSize(7.5)
            doc.setTextColor('#1a1a2e')
            doc.text(tag, cx + 3, ry)
            ry += 6
          })
        })
        y += htH + 6
      }

      // ══════════════════════════════════════════════════════════════════
      // 9. PLANO DE ENGAJAMENTO
      // ══════════════════════════════════════════════════════════════════
      if ((plano.plano_engajamento || []).length > 0) {
        sectionTitle('Plano de Engajamento')
        ;(plano.plano_engajamento || []).forEach((acao, i) => numbered(acao, i))
        y += 4
      }

      // ══════════════════════════════════════════════════════════════════
      // 10. METAS SEMANAIS
      // ══════════════════════════════════════════════════════════════════
      if ((plano.metas_semanais || []).length > 0) {
        sectionTitle('Metas Semanais (4 Semanas)')
        ;(plano.metas_semanais || []).forEach(s => {
          const metaL = doc.splitTextToSize(clean(s.meta), CW - 28)
          const focoL = doc.splitTextToSize(clean(s.foco), CW - 28)
          const rowH  = Math.max(metaL.length, focoL.length) * 3.8 + 14
          checkPage(rowH + 4)

          doc.setFillColor(245, 246, 248)
          doc.roundedRect(ML, y, CW, rowH, 2, 2, 'F')
          doc.setFillColor('#3db860')
          doc.roundedRect(ML, y, 3, rowH, 1, 1, 'F')

          doc.setFont('helvetica', 'bold')
          doc.setFontSize(8)
          doc.setTextColor('#3db860')
          doc.text(s.semana, ML + 6, y + 7)

          doc.setFont('helvetica', 'normal')
          doc.setFontSize(7.5)
          doc.setTextColor('#1a1a2e')
          doc.text(metaL, ML + 6, y + 12)

          doc.setFont('helvetica', 'italic')
          doc.setFontSize(7)
          doc.setTextColor('#6b7280')
          doc.text(`Foco: ${clean(s.foco)}`, ML + 6, y + 12 + metaL.length * 3.8 + 2)

          y += rowH + 5
        })
      }

      // ══════════════════════════════════════════════════════════════════
      // 11. DICAS ESTRATÉGICAS
      // ══════════════════════════════════════════════════════════════════
      if ((plano.dicas_extras || []).length > 0) {
        sectionTitle('Dicas Estrategicas')
        ;(plano.dicas_extras || []).forEach(d => bullet(d))
      }

      // ══════════════════════════════════════════════════════════════════
      // RODAPÉ EM TODAS AS PÁGINAS
      // ══════════════════════════════════════════════════════════════════
      const total = (doc as any).internal.getNumberOfPages()
      for (let p = 1; p <= total; p++) {
        doc.setPage(p)
        doc.setFillColor('#0d1f3c')
        doc.rect(0, H - FOOT + 2, W, FOOT, 'F')
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(6.5)
        doc.setTextColor('#3db860')
        doc.text('AMARANTS INSTAGROWHT', ML, H - 9)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(160, 180, 200)
        doc.text('amarants.com.br', W / 2, H - 9, { align: 'center' })
        doc.setTextColor(120, 140, 170)
        doc.text(`${p} / ${total}`, W - MR, H - 9, { align: 'right' })
      }

      doc.save(`plano-acao-@${a.instagram_handle}.pdf`)
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

  if (erro || !analysis) {
    return (
      <div style={{ minHeight: '100vh', background: S.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ background: S.card, borderRadius: '20px', padding: '48px', textAlign: 'center', maxWidth: '420px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
          <p style={{ color: S.muted, fontSize: '14px', marginBottom: '24px' }}>{erro || 'Plano não encontrado.'}</p>
          <button type="button" onClick={() => { window.location.href = '/amarantsinstagrouth/connect-instagram' }} style={{ padding: '12px 28px', background: S.verde, color: '#fff', border: 'none', borderRadius: '9px', fontWeight: 700, cursor: 'pointer', fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
            Voltar ao início
          </button>
        </div>
      </div>
    )
  }

  const plano = analysis.plano_acao || {} as PlanoAcao

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        @keyframes spin   { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:none} }
        .fade-up  { animation: fadeUp 0.5s ease both; }
        .day-card { transition: all 0.2s; cursor: pointer; }
        .day-card:hover { box-shadow: 0 6px 20px rgba(0,0,0,0.09); }
        .btn-sec  { transition: all 0.18s; }
        .btn-sec:hover:not(:disabled) { transform: translateY(-1px); }
        .hashtag-chip { display: inline-block; background: rgba(13,31,60,0.06); border: 1px solid rgba(13,31,60,0.1); border-radius: 6px; padding: 3px 9px; font-size: 12px; color: #0d1f3c; font-weight: 600; margin: 3px 4px 3px 0; }
        .copy-btn { cursor: pointer; background: none; border: 1px solid rgba(0,0,0,0.12); border-radius: 6px; padding: 4px 10px; font-size: 11px; color: #6b7280; font-family: Inter, sans-serif; transition: all 0.15s; }
        .copy-btn:hover { background: rgba(61,184,96,0.08); border-color: #3db860; color: #3db860; }
      `}</style>

      <div style={{ minHeight: '100vh', background: S.bg, fontFamily: 'Inter, sans-serif', paddingBottom: '60px' }}>

        {/* Toast */}
        {planSalvo && (
          <div style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 9999, background: S.verde, color: '#fff', padding: '12px 28px', borderRadius: '12px', fontWeight: 700, fontSize: '14px', boxShadow: '0 4px 20px rgba(61,184,96,0.4)', display: 'flex', alignItems: 'center', gap: '10px', animation: 'fadeIn 0.3s ease', fontFamily: 'Inter, sans-serif' }}>
            ✓ Plano salvo com sucesso!
          </div>
        )}

        {/* Header */}
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
                  <div style={{ color: S.texto, fontWeight: 900, fontSize: '16px', lineHeight: 1.3 }}>{m.valor}</div>
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

          {/* Accordion: Diagnóstico */}
          {plano.diagnostico && (
            <div className="fade-up" style={{ animationDelay: '0.17s' }}>
              <AccordionSection icon="🔍" title="Diagnóstico do Perfil" open={openSections.diagnostico} onToggle={() => toggleSection('diagnostico')}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', paddingTop: '20px' }}>
                  {[
                    { label: 'Posicionamento',        valor: plano.diagnostico.posicionamento,           icon: '🏆' },
                    { label: 'Público Ideal',          valor: plano.diagnostico.publico_ideal,            icon: '👥' },
                    { label: 'Tom de Voz',             valor: plano.diagnostico.tom_de_voz,               icon: '🎙️' },
                    { label: 'Principal Oportunidade', valor: plano.diagnostico.principal_oportunidade,   icon: '🚀' },
                  ].map(d => (
                    <div key={d.label} style={{ background: '#f8f9fb', borderRadius: '12px', padding: '18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                        <span>{d.icon}</span>
                        <span style={{ color: S.muted, fontSize: '11px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase' }}>{d.label}</span>
                      </div>
                      <p style={{ color: S.texto, fontSize: '14px', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>{d.valor}</p>
                    </div>
                  ))}
                </div>
              </AccordionSection>
            </div>
          )}

          {/* Accordion: Plano 7 dias */}
          <div className="fade-up" style={{ animationDelay: '0.2s' }}>
            <AccordionSection icon="📋" title="Plano dos Primeiros 7 Dias" open={openSections.dias} onToggle={() => toggleSection('dias')}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '20px' }}>
                {(plano.primeiros_7_dias || []).map((item, i) => {
                  const tc        = TIPO_COR[item.tipo] || { bg: 'rgba(0,0,0,0.06)', cor: S.muted }
                  const isExpanded = expandedDay === i
                  return (
                    <div key={i} className="day-card" style={{ background: S.card, border: `1px solid ${isExpanded ? S.verde : S.borda}`, borderRadius: '14px', overflow: 'hidden', transition: 'border-color 0.2s' }} onClick={() => setExpandedDay(isExpanded ? null : i)}>
                      {/* Cabeçalho do dia */}
                      <div style={{ padding: '18px 22px', display: 'flex', alignItems: 'flex-start', gap: '18px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(13,31,60,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: S.side, fontWeight: 900, fontSize: '15px', flexShrink: 0 }}>
                          {i + 1}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '7px', flexWrap: 'wrap' }}>
                            <span style={{ color: S.muted, fontSize: '12px', fontWeight: 700 }}>{item.dia}</span>
                            <div style={{ background: tc.bg, color: tc.cor, fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: '20px' }}>
                              {TIPO_ICON[item.tipo] || '📄'} {item.tipo}
                            </div>
                            <div style={{ background: 'rgba(13,31,60,0.06)', color: S.side, fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px' }}>
                              ⏰ {item.horario}
                            </div>
                          </div>
                          <div style={{ color: S.texto, fontWeight: 800, fontSize: '15px', marginBottom: '5px' }}>{item.tema}</div>
                          <div style={{ color: S.muted, fontSize: '13px', fontStyle: 'italic' }}>"{item.gancho}"</div>
                        </div>
                        <div style={{ color: S.muted, fontSize: '18px', display: 'inline-block', transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>▾</div>
                      </div>

                      {/* Detalhes expandidos */}
                      {isExpanded && (
                        <div style={{ borderTop: `1px solid ${S.borda}`, padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '18px' }} onClick={e => e.stopPropagation()}>
                          {item.roteiro && (
                            <div>
                              <div style={{ color: S.texto, fontSize: '12px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>📝 Roteiro</div>
                              <p style={{ color: S.texto, fontSize: '14px', lineHeight: 1.65, margin: 0, background: '#f8f9fb', padding: '14px', borderRadius: '10px' }}>{item.roteiro}</p>
                            </div>
                          )}
                          {item.legenda && (
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <div style={{ color: S.texto, fontSize: '12px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase' }}>✍️ Legenda</div>
                                <button className="copy-btn" onClick={() => navigator.clipboard.writeText(item.legenda)}>Copiar</button>
                              </div>
                              <p style={{ color: S.texto, fontSize: '13px', lineHeight: 1.7, margin: 0, background: '#f8f9fb', padding: '14px', borderRadius: '10px', whiteSpace: 'pre-wrap' }}>{item.legenda}</p>
                            </div>
                          )}
                          {(item.hashtags || []).length > 0 && (
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <div style={{ color: S.texto, fontSize: '12px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase' }}>#️⃣ Hashtags</div>
                                <button className="copy-btn" onClick={() => navigator.clipboard.writeText((item.hashtags || []).join(' '))}>Copiar</button>
                              </div>
                              <div>{(item.hashtags || []).map((h, j) => <span key={j} className="hashtag-chip">{h}</span>)}</div>
                            </div>
                          )}
                          {item.dica_execucao && (
                            <div style={{ background: 'rgba(61,184,96,0.06)', border: '1px solid rgba(61,184,96,0.18)', borderRadius: '10px', padding: '14px' }}>
                              <div style={{ color: S.verde2, fontSize: '12px', fontWeight: 800, marginBottom: '6px' }}>💡 Dica de execução</div>
                              <p style={{ color: S.texto, fontSize: '13px', lineHeight: 1.6, margin: 0 }}>{item.dica_execucao}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </AccordionSection>
          </div>

          {/* Accordion: Guia de Execução */}
          {plano.guia_execucao && Object.keys(plano.guia_execucao).length > 0 && (
            <div className="fade-up" style={{ animationDelay: '0.22s' }}>
              <AccordionSection icon="🎓" title="Guia de Execução por Formato" open={openSections.guia} onToggle={() => toggleSection('guia')}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingTop: '20px' }}>
                  {Object.entries(plano.guia_execucao).map(([formato, guia]) => {
                    const tc = TIPO_COR[formato] || { bg: 'rgba(0,0,0,0.06)', cor: S.muted }
                    return (
                      <div key={formato} style={{ background: '#f8f9fb', borderRadius: '12px', padding: '18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                          <div style={{ background: tc.bg, color: tc.cor, fontSize: '12px', fontWeight: 800, padding: '4px 12px', borderRadius: '20px' }}>
                            {TIPO_ICON[formato] || '📄'} {formato}
                          </div>
                        </div>
                        <p style={{ color: S.texto, fontSize: '14px', lineHeight: 1.65, margin: 0 }}>{guia}</p>
                      </div>
                    )
                  })}
                </div>
              </AccordionSection>
            </div>
          )}

          {/* Accordion: Estratégia de Hashtags */}
          {plano.estrategia_hashtags && (
            <div className="fade-up" style={{ animationDelay: '0.24s' }}>
              <AccordionSection icon="#️⃣" title="Estratégia de Hashtags" open={openSections.hashtags} onToggle={() => toggleSection('hashtags')}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', paddingTop: '20px' }}>
                  {[
                    { label: 'Grandes',    sublabel: '1M+ posts',     items: plano.estrategia_hashtags.grandes, cor: '#7c3aed', bg: 'rgba(139,92,246,0.08)' },
                    { label: 'Médias',     sublabel: '100k–1M posts', items: plano.estrategia_hashtags.medias,  cor: '#1d4ed8', bg: 'rgba(37,99,235,0.08)'  },
                    { label: 'Nicho',      sublabel: '<100k posts',   items: plano.estrategia_hashtags.nicho,   cor: S.verde2,  bg: 'rgba(61,184,96,0.08)'  },
                  ].map(col => (
                    <div key={col.label} style={{ background: col.bg, border: `1px solid ${col.cor}22`, borderRadius: '12px', padding: '18px' }}>
                      <div style={{ color: col.cor, fontWeight: 800, fontSize: '14px', marginBottom: '4px' }}>{col.label}</div>
                      <div style={{ color: S.muted, fontSize: '11px', marginBottom: '12px' }}>{col.sublabel}</div>
                      {(col.items || []).map((h, i) => (
                        <div key={i} style={{ background: '#fff', borderRadius: '6px', padding: '5px 10px', marginBottom: '6px', fontSize: '12px', fontWeight: 600, color: col.cor, border: `1px solid ${col.cor}22` }}>{h}</div>
                      ))}
                    </div>
                  ))}
                </div>
              </AccordionSection>
            </div>
          )}

          {/* Accordion: Plano de Engajamento */}
          {(plano.plano_engajamento || []).length > 0 && (
            <div className="fade-up" style={{ animationDelay: '0.26s' }}>
              <AccordionSection icon="💬" title="Plano de Engajamento" open={openSections.engajamento} onToggle={() => toggleSection('engajamento')}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '20px' }}>
                  {(plano.plano_engajamento || []).map((acao, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', background: '#f8f9fb', borderRadius: '10px', padding: '14px 16px' }}>
                      <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'rgba(61,184,96,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: S.verde2, fontWeight: 900, fontSize: '12px', flexShrink: 0 }}>{i + 1}</div>
                      <p style={{ color: S.texto, fontSize: '14px', lineHeight: 1.6, margin: 0 }}>{acao}</p>
                    </div>
                  ))}
                </div>
              </AccordionSection>
            </div>
          )}

          {/* Accordion: Metas Semanais */}
          {(plano.metas_semanais || []).length > 0 && (
            <div className="fade-up" style={{ animationDelay: '0.28s' }}>
              <AccordionSection icon="📊" title="Metas Semanais (4 semanas)" open={openSections.metas_semanais} onToggle={() => toggleSection('metas_semanais')}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', paddingTop: '20px' }}>
                  {(plano.metas_semanais || []).map((s, i) => (
                    <div key={i} style={{ background: '#f8f9fb', borderRadius: '12px', padding: '18px', borderLeft: `3px solid ${S.verde}` }}>
                      <div style={{ color: S.verde, fontWeight: 800, fontSize: '13px', marginBottom: '6px' }}>{s.semana}</div>
                      <div style={{ color: S.texto, fontWeight: 700, fontSize: '14px', marginBottom: '8px' }}>{s.meta}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ color: S.muted, fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }}>Foco:</span>
                        <span style={{ color: S.muted, fontSize: '12px' }}>{s.foco}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionSection>
            </div>
          )}

          {/* Dicas extras */}
          {(plano.dicas_extras || []).length > 0 && (
            <div className="fade-up" style={{ animationDelay: '0.3s', background: 'rgba(61,184,96,0.06)', border: '1px solid rgba(61,184,96,0.2)', borderRadius: '16px', padding: '24px 28px', marginBottom: '32px' }}>
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
          <div className="fade-up" style={{ animationDelay: '0.32s', background: `linear-gradient(135deg, ${S.side} 0%, #1a3a6e 100%)`, borderRadius: '20px', padding: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>🚀</div>
            <h2 style={{ color: '#fff', fontWeight: 900, fontSize: '24px', margin: '0 0 12px', letterSpacing: '-0.5px' }}>
              Pronto para transformar seu Instagram?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '15px', marginBottom: '28px', lineHeight: 1.6 }}>
              Seu plano está pronto. Acesse o painel e comece a gerar<br />conteúdo com IA agora mesmo.
            </p>

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
