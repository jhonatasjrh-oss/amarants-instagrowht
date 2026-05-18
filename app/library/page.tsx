"use client"

import { useState, useEffect, useCallback } from 'react'
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

const FORMATOS: Record<string, { icon: string; bg: string; cor: string; label: string }> = {
  reel:      { icon: '🎬', bg: 'rgba(139,92,246,0.1)',  cor: '#7c3aed', label: 'Reel'      },
  carrossel: { icon: '🎠', bg: 'rgba(37,99,235,0.1)',   cor: '#1d4ed8', label: 'Carrossel' },
  post:      { icon: '📸', bg: 'rgba(61,184,96,0.1)',   cor: '#2d9e50', label: 'Post'      },
  story:     { icon: '📖', bg: 'rgba(245,158,11,0.1)',  cor: '#d97706', label: 'Story'     },
  banner:    { icon: '🖼️', bg: 'rgba(239,68,68,0.1)',  cor: '#dc2626', label: 'Banner'    },
}

const STATUS: Record<string, { bg: string; cor: string; label: string }> = {
  draft:     { bg: 'rgba(156,163,175,0.15)', cor: '#6b7280', label: 'Rascunho'  },
  scheduled: { bg: 'rgba(61,184,96,0.12)',   cor: '#3db860', label: 'Agendado'  },
  published: { bg: 'rgba(37,99,235,0.12)',   cor: '#1d4ed8', label: 'Publicado' },
}

const TIPOS_FILTRO = [
  { id: 'todos',     label: 'Todos'     },
  { id: 'reel',      label: 'Reels'     },
  { id: 'carrossel', label: 'Carrosséis'},
  { id: 'post',      label: 'Posts'     },
  { id: 'story',     label: 'Stories'   },
  { id: 'banner',    label: 'Banners'   },
]

const STATUS_FILTRO = [
  { id: 'todos',     label: 'Todos'    },
  { id: 'draft',     label: 'Rascunho' },
  { id: 'scheduled', label: 'Agendado' },
  { id: 'published', label: 'Publicado'},
]

interface Post {
  id: string
  tipo: string
  titulo: string
  legenda: string
  hashtags: string[]
  cta: string
  horario: string
  tema: string
  nicho: string
  status: string
  scheduled_date: string | null
  created_at: string
}

interface EditState {
  titulo:         string
  legenda:        string
  hashtagsTexto:  string
  cta:            string
  horario:        string
  status:         string
  scheduled_date: string
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
            { icon: '⊞',  label: 'Dashboard',      href: '/dashboard', ativo: false },
            { icon: '✦',  label: 'Gerar Conteúdo', href: '/generate',  ativo: false },
            { icon: '📚', label: 'Biblioteca',      href: '/library',   ativo: true  },
            { icon: '📅', label: 'Calendário',      href: '/calendar',  ativo: false },
          ]},
          { grupo: 'Instagram', items: [
            { icon: '📊', label: 'Analytics',   href: '#', ativo: false },
            { icon: '🤖', label: 'Automações',  href: '#', ativo: false },
            { icon: '🕐', label: 'Agendamento', href: '#', ativo: false },
          ]},
          { grupo: 'Conta', items: [
            { icon: '🎨', label: 'Brand Kit',      href: '/brand-kit', ativo: false },
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

export default function Library() {
  const router = useRouter()

  const [posts,      setPosts]      = useState<Post[]>([])
  const [userId,     setUserId]     = useState<string | null>(null)
  const [loading,    setLoading]    = useState(true)
  const [busca,      setBusca]      = useState('')
  const [filtroTipo, setFiltroTipo] = useState('todos')
  const [filtroSt,   setFiltroSt]   = useState('todos')
  const [ordenar,    setOrdenar]    = useState<'novo' | 'antigo'>('novo')

  const [postEdit,     setPostEdit]     = useState<Post | null>(null)
  const [campos,       setCampos]       = useState<EditState | null>(null)
  const [salvando,     setSalvando]     = useState(false)
  const [deletando,    setDeletando]    = useState(false)
  const [confirmDel,   setConfirmDel]   = useState(false)
  const [erroEdit,     setErroEdit]     = useState('')
  const [copiado,      setCopiado]      = useState<string | null>(null)

  const carregarPosts = useCallback(async (uid: string) => {
    const res  = await fetch(`/api/posts?userId=${uid}`)
    const json = await res.json()
    if (json.data) setPosts(json.data)
    setLoading(false)
  }, [])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push('/login'); return }
      setUserId(data.user.id)
      carregarPosts(data.user.id)
    })
  }, [router, carregarPosts])

  function abrirEditor(post: Post) {
    setPostEdit(post)
    setErroEdit('')
    setConfirmDel(false)
    setCampos({
      titulo:         post.titulo || '',
      legenda:        post.legenda || '',
      hashtagsTexto:  Array.isArray(post.hashtags) ? post.hashtags.join(', ') : (post.hashtags || ''),
      cta:            post.cta || '',
      horario:        post.horario || '',
      status:         post.status || 'draft',
      scheduled_date: post.scheduled_date || '',
    })
  }

  function fecharEditor() {
    setPostEdit(null)
    setCampos(null)
    setConfirmDel(false)
    setErroEdit('')
  }

  async function handleSalvar() {
    if (!postEdit || !campos) return
    setSalvando(true)
    setErroEdit('')
    try {
      const hashtags = campos.hashtagsTexto
        .split(',')
        .map(h => h.trim())
        .filter(Boolean)

      const res  = await fetch(`/api/posts/${postEdit.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo:         campos.titulo,
          legenda:        campos.legenda,
          hashtags,
          cta:            campos.cta,
          horario:        campos.horario,
          status:         campos.status,
          scheduled_date: campos.scheduled_date || null,
        }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)

      setPosts(prev => prev.map(p =>
        p.id === postEdit.id ? { ...p, ...campos, hashtags } : p
      ))
      fecharEditor()
    } catch (e: any) {
      setErroEdit(e.message)
    } finally {
      setSalvando(false)
    }
  }

  async function handleDeletar() {
    if (!postEdit) return
    setDeletando(true)
    try {
      const res  = await fetch(`/api/posts/${postEdit.id}`, { method: 'DELETE' })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      setPosts(prev => prev.filter(p => p.id !== postEdit.id))
      fecharEditor()
    } catch (e: any) {
      setErroEdit(e.message)
    } finally {
      setDeletando(false)
    }
  }

  async function copiarLegenda(post: Post, e: React.MouseEvent) {
    e.stopPropagation()
    const tags = Array.isArray(post.hashtags) ? post.hashtags.join(' ') : ''
    await navigator.clipboard.writeText(`${post.legenda}\n\n${tags}`)
    setCopiado(post.id)
    setTimeout(() => setCopiado(null), 2000)
  }

  const postsFiltrados = posts
    .filter(p => filtroTipo === 'todos' || p.tipo === filtroTipo)
    .filter(p => filtroSt   === 'todos' || p.status === filtroSt)
    .filter(p => {
      if (!busca) return true
      const q = busca.toLowerCase()
      return (p.titulo || '').toLowerCase().includes(q) ||
             (p.legenda || '').toLowerCase().includes(q) ||
             (p.nicho   || '').toLowerCase().includes(q)
    })
    .sort((a, b) => {
      const da = new Date(a.created_at).getTime()
      const db = new Date(b.created_at).getTime()
      return ordenar === 'novo' ? db - da : da - db
    })

  const total      = posts.length
  const rascunhos  = posts.filter(p => p.status === 'draft').length
  const agendados  = posts.filter(p => p.status === 'scheduled').length
  const publicados = posts.filter(p => p.status === 'published').length

  const labelStyle: React.CSSProperties = {
    color: S.muted, fontSize: '11px', fontWeight: 700,
    display: 'block', marginBottom: '6px', letterSpacing: '1px',
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px', background: S.card2,
    border: `1px solid ${S.borda2}`, borderRadius: '8px',
    color: S.texto, fontSize: '13px', outline: 'none',
    fontFamily: 'Inter, sans-serif', boxSizing: 'border-box',
  }

  return (
    <div style={{ background: S.bg, minHeight: '100vh', display: 'flex', fontFamily: 'Inter, sans-serif' }}>
      <Sidebar />

      <main style={{ flex: 1, padding: '36px 40px', overflowY: 'auto', position: 'relative' }}>

        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
            <h1 style={{ color: S.azul, fontWeight: 900, fontSize: '26px', letterSpacing: '-0.5px', margin: 0 }}>Biblioteca de Conteúdo</h1>
            <span style={{ background: 'rgba(61,184,96,0.1)', color: S.verde2, fontSize: '9px', fontWeight: 800, padding: '4px 10px', borderRadius: '20px', border: '1px solid rgba(61,184,96,0.2)', letterSpacing: '1.5px' }}>✦ {total} posts</span>
          </div>
          <p style={{ color: S.muted, fontSize: '13px', margin: 0 }}>Todos os conteúdos gerados pela IA — edite, copie e gerencie</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '28px' }}>
          {[
            { label: 'Total gerados', valor: total,      icon: '📝', cor: S.azul,           bg: 'rgba(13,31,60,0.06)'   },
            { label: 'Rascunhos',     valor: rascunhos,  icon: '✏️', cor: '#6b7280',        bg: 'rgba(107,114,128,0.08)'},
            { label: 'Agendados',     valor: agendados,  icon: '📅', cor: S.verde,           bg: 'rgba(61,184,96,0.08)'  },
            { label: 'Publicados',    valor: publicados, icon: '✓',  cor: '#1d4ed8',        bg: 'rgba(37,99,235,0.08)'  },
          ].map((s, i) => (
            <div key={i} style={{ background: S.card, border: `1px solid ${S.borda}`, borderRadius: '14px', padding: '18px 20px', boxShadow: '0 2px 6px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>{s.icon}</div>
              <div>
                <div style={{ color: s.cor, fontWeight: 900, fontSize: '22px', lineHeight: 1 }}>{s.valor}</div>
                <div style={{ color: S.muted, fontSize: '11px', marginTop: '3px' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div style={{ background: S.card, border: `1px solid ${S.borda}`, borderRadius: '14px', padding: '16px 20px', marginBottom: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>

            {/* Tipo */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {TIPOS_FILTRO.map(t => {
                const fmt = t.id !== 'todos' ? FORMATOS[t.id] : null
                const ativo = filtroTipo === t.id
                return (
                  <button key={t.id} onClick={() => setFiltroTipo(t.id)}
                    style={{ padding: '6px 14px', borderRadius: '20px', border: ativo ? `2px solid ${fmt?.cor || S.azul}` : `1px solid ${S.borda2}`, cursor: 'pointer', fontSize: '12px', fontWeight: 600, fontFamily: 'Inter, sans-serif', background: ativo ? (fmt?.bg || 'rgba(13,31,60,0.08)') : S.card2, color: ativo ? (fmt?.cor || S.azul) : S.muted, transition: 'all 0.15s' }}>
                    {fmt && <span style={{ marginRight: '4px' }}>{fmt.icon}</span>}{t.label}
                  </button>
                )
              })}
            </div>

            <div style={{ width: '1px', height: '24px', background: S.borda2, flexShrink: 0 }} />

            {/* Status */}
            <div style={{ display: 'flex', gap: '6px' }}>
              {STATUS_FILTRO.map(s => {
                const st = s.id !== 'todos' ? STATUS[s.id] : null
                const ativo = filtroSt === s.id
                return (
                  <button key={s.id} onClick={() => setFiltroSt(s.id)}
                    style={{ padding: '6px 14px', borderRadius: '20px', border: ativo ? `2px solid ${st?.cor || S.azul}` : `1px solid ${S.borda2}`, cursor: 'pointer', fontSize: '12px', fontWeight: 600, fontFamily: 'Inter, sans-serif', background: ativo ? (st?.bg || 'rgba(13,31,60,0.08)') : S.card2, color: ativo ? (st?.cor || S.azul) : S.muted, transition: 'all 0.15s' }}>
                    {s.label}
                  </button>
                )
              })}
            </div>

            <div style={{ flex: 1 }} />

            {/* Busca */}
            <input type="text" placeholder="🔍 Buscar posts..." value={busca} onChange={e => setBusca(e.target.value)}
              style={{ padding: '8px 14px', background: S.card2, border: `1px solid ${S.borda2}`, borderRadius: '9px', color: S.texto, fontSize: '13px', outline: 'none', fontFamily: 'Inter, sans-serif', width: '200px' }} />

            {/* Ordenar */}
            <select value={ordenar} onChange={e => setOrdenar(e.target.value as any)}
              style={{ padding: '8px 12px', background: S.card2, border: `1px solid ${S.borda2}`, borderRadius: '9px', color: S.texto, fontSize: '12px', outline: 'none', fontFamily: 'Inter, sans-serif', cursor: 'pointer' }}>
              <option value="novo">Mais recente</option>
              <option value="antigo">Mais antigo</option>
            </select>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: S.muted }}>
            <div style={{ fontSize: '32px', marginBottom: '12px', display: 'inline-block', animation: 'spin 0.8s linear infinite' }}>⟳</div>
            <div style={{ fontSize: '13px' }}>Carregando biblioteca...</div>
          </div>
        )}

        {/* Empty state */}
        {!loading && postsFiltrados.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>📭</div>
            <div style={{ color: S.azul, fontWeight: 700, fontSize: '18px', marginBottom: '8px' }}>
              {busca || filtroTipo !== 'todos' || filtroSt !== 'todos'
                ? 'Nenhum resultado encontrado'
                : 'Biblioteca vazia'}
            </div>
            <div style={{ color: S.muted, fontSize: '13px', marginBottom: '24px' }}>
              {busca || filtroTipo !== 'todos' || filtroSt !== 'todos'
                ? 'Tente ajustar os filtros ou a busca'
                : 'Use o gerador de conteúdo para criar seus primeiros posts'}
            </div>
            {(!busca && filtroTipo === 'todos' && filtroSt === 'todos') && (
              <a href="/generate" style={{ display: 'inline-block', padding: '13px 28px', background: S.verde, color: '#fff', borderRadius: '10px', fontWeight: 800, fontSize: '14px', textDecoration: 'none', boxShadow: '0 4px 16px rgba(61,184,96,0.3)' }}>
                ✦ Gerar Conteúdo
              </a>
            )}
          </div>
        )}

        {/* Grid de posts */}
        {!loading && postsFiltrados.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', paddingBottom: '40px' }}>
            {postsFiltrados.map(post => {
              const fmt = FORMATOS[post.tipo] || FORMATOS.post
              const st  = STATUS[post.status] || STATUS.draft
              const tags = Array.isArray(post.hashtags) ? post.hashtags : []

              return (
                <div key={post.id} onClick={() => abrirEditor(post)}
                  style={{ background: S.card, border: `1px solid ${S.borda}`, borderRadius: '14px', padding: '20px', cursor: 'pointer', transition: 'all 0.2s', borderLeft: `3px solid ${fmt.cor}`, boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 6px 20px rgba(0,0,0,0.1)`; e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)' }}>

                  {/* Badges row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <span style={{ background: fmt.bg, color: fmt.cor, fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {fmt.icon} {fmt.label}
                    </span>
                    <span style={{ background: st.bg, color: st.cor, fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px' }}>
                      {st.label}
                    </span>
                    <div style={{ flex: 1 }} />
                    {post.horario && (
                      <span style={{ color: S.muted, fontSize: '11px' }}>⏰ {post.horario}</span>
                    )}
                  </div>

                  {/* Título */}
                  <div style={{ color: S.azul, fontWeight: 700, fontSize: '14px', marginBottom: '8px', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {post.titulo || '(sem título)'}
                  </div>

                  {/* Legenda preview */}
                  <div style={{ color: S.muted, fontSize: '12px', lineHeight: 1.6, marginBottom: '14px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {post.legenda || 'Sem legenda'}
                  </div>

                  {/* Footer */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderTop: `1px solid ${S.borda}`, paddingTop: '12px' }}>
                    {tags.length > 0 && (
                      <span style={{ color: S.muted, fontSize: '11px', background: S.card2, border: `1px solid ${S.borda}`, borderRadius: '20px', padding: '2px 10px' }}>
                        {tags.length} hashtags
                      </span>
                    )}
                    {post.nicho && (
                      <span style={{ color: S.muted, fontSize: '11px', background: S.card2, border: `1px solid ${S.borda}`, borderRadius: '20px', padding: '2px 10px' }}>
                        {post.nicho}
                      </span>
                    )}
                    <div style={{ flex: 1 }} />
                    <button
                      onClick={e => copiarLegenda(post, e)}
                      style={{ padding: '5px 12px', background: copiado === post.id ? 'rgba(61,184,96,0.1)' : S.card2, color: copiado === post.id ? S.verde2 : S.muted, border: `1px solid ${copiado === post.id ? 'rgba(61,184,96,0.3)' : S.borda}`, borderRadius: '8px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s' }}>
                      {copiado === post.id ? '✓ Copiado' : '📋 Copiar'}
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); abrirEditor(post) }}
                      style={{ padding: '5px 12px', background: 'rgba(13,31,60,0.06)', color: S.azul, border: `1px solid rgba(13,31,60,0.12)`, borderRadius: '8px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                      ✏️ Editar
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* ── EDIT DRAWER ── */}
      {postEdit && campos && (
        <>
          {/* Overlay */}
          <div onClick={fecharEditor}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 40, backdropFilter: 'blur(2px)' }} />

          {/* Drawer */}
          <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '500px', background: S.card, zIndex: 50, boxShadow: '-8px 0 40px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>

            {/* Drawer header */}
            <div style={{ padding: '20px 24px', borderBottom: `1px solid ${S.borda}`, display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
              {(() => {
                const fmt = FORMATOS[postEdit.tipo] || FORMATOS.post
                return (
                  <div style={{ width: '36px', height: '36px', borderRadius: '9px', background: fmt.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                    {fmt.icon}
                  </div>
                )
              })()}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: S.azul, fontWeight: 800, fontSize: '15px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Editar post</div>
                <div style={{ color: S.muted, fontSize: '11px' }}>{FORMATOS[postEdit.tipo]?.label || 'Post'} · {new Date(postEdit.created_at).toLocaleDateString('pt-BR')}</div>
              </div>
              <button onClick={fecharEditor}
                style={{ background: S.card2, border: `1px solid ${S.borda2}`, borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', fontSize: '16px', color: S.muted, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                ✕
              </button>
            </div>

            {/* Drawer body */}
            <div style={{ flex: 1, padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Status */}
              <div>
                <label style={labelStyle}>STATUS</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {Object.entries(STATUS).map(([key, val]) => (
                    <div key={key} onClick={() => setCampos(c => c ? { ...c, status: key } : c)}
                      style={{ flex: 1, padding: '10px', borderRadius: '9px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s', background: campos.status === key ? val.bg : S.card2, border: campos.status === key ? `2px solid ${val.cor}` : `1px solid ${S.borda}` }}>
                      <div style={{ color: campos.status === key ? val.cor : S.muted, fontSize: '12px', fontWeight: 700 }}>{val.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Título */}
              <div>
                <label style={labelStyle}>TÍTULO</label>
                <input type="text" value={campos.titulo} onChange={e => setCampos(c => c ? { ...c, titulo: e.target.value } : c)}
                  placeholder="Título do conteúdo" style={inputStyle} />
              </div>

              {/* Legenda */}
              <div>
                <label style={labelStyle}>LEGENDA</label>
                <textarea value={campos.legenda} onChange={e => setCampos(c => c ? { ...c, legenda: e.target.value } : c)}
                  rows={8} placeholder="Legenda completa..."
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} />
              </div>

              {/* Hashtags */}
              <div>
                <label style={labelStyle}>HASHTAGS (separadas por vírgula)</label>
                <input type="text" value={campos.hashtagsTexto} onChange={e => setCampos(c => c ? { ...c, hashtagsTexto: e.target.value } : c)}
                  placeholder="#marketing, #instagram, #conteudo" style={inputStyle} />
                {campos.hashtagsTexto && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '8px' }}>
                    {campos.hashtagsTexto.split(',').filter(h => h.trim()).map((h, i) => (
                      <span key={i} style={{ background: 'rgba(13,31,60,0.06)', color: S.azul, border: '1px solid rgba(13,31,60,0.12)', padding: '2px 8px', borderRadius: '20px', fontSize: '10px' }}>{h.trim()}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* CTA */}
              <div>
                <label style={labelStyle}>CTA / GANCHO</label>
                <input type="text" value={campos.cta} onChange={e => setCampos(c => c ? { ...c, cta: e.target.value } : c)}
                  placeholder="Call to action ou frase de abertura" style={inputStyle} />
              </div>

              {/* Horário e data */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>MELHOR HORÁRIO</label>
                  <input type="text" value={campos.horario} onChange={e => setCampos(c => c ? { ...c, horario: e.target.value } : c)}
                    placeholder="Ex: 19h" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>DATA DE AGENDAMENTO</label>
                  <input type="date" value={campos.scheduled_date} onChange={e => setCampos(c => c ? { ...c, scheduled_date: e.target.value } : c)}
                    style={inputStyle} />
                </div>
              </div>

              {erroEdit && (
                <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontSize: '12px', padding: '10px 14px', borderRadius: '8px' }}>
                  ⚠️ {erroEdit}
                </div>
              )}
            </div>

            {/* Drawer footer */}
            <div style={{ padding: '16px 24px', borderTop: `1px solid ${S.borda}`, display: 'flex', gap: '10px', flexShrink: 0 }}>
              {/* Deletar */}
              {!confirmDel ? (
                <button onClick={() => setConfirmDel(true)}
                  style={{ padding: '11px 16px', background: 'rgba(239,68,68,0.06)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '9px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                  🗑️ Excluir
                </button>
              ) : (
                <button onClick={handleDeletar} disabled={deletando}
                  style={{ padding: '11px 16px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '9px', fontSize: '13px', fontWeight: 700, cursor: deletando ? 'not-allowed' : 'pointer', fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {deletando ? <><span style={{ display: 'inline-block', animation: 'spin 0.8s linear infinite' }}>⟳</span> Excluindo...</> : '⚠️ Confirmar exclusão'}
                </button>
              )}

              <div style={{ flex: 1 }} />

              <button onClick={fecharEditor}
                style={{ padding: '11px 16px', background: S.card2, color: S.muted, border: `1px solid ${S.borda2}`, borderRadius: '9px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                Cancelar
              </button>

              <button onClick={handleSalvar} disabled={salvando}
                style={{ padding: '11px 24px', background: salvando ? 'rgba(61,184,96,0.5)' : S.verde, color: '#fff', border: 'none', borderRadius: '9px', fontSize: '13px', fontWeight: 800, cursor: salvando ? 'not-allowed' : 'pointer', boxShadow: salvando ? 'none' : '0 4px 14px rgba(61,184,96,0.3)', fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {salvando ? <><span style={{ display: 'inline-block', animation: 'spin 0.8s linear infinite' }}>⟳</span> Salvando...</> : '💾 Salvar'}
              </button>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { -webkit-box-orient: vertical; }
      `}</style>
    </div>
  )
}
