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

export default function ConnectInstagram() {
  const [handle,  setHandle]  = useState('')
  const [userId,  setUserId]  = useState('')
  const [loading, setLoading] = useState(false)
  const [erro,    setErro]    = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return
      setUserId(data.user.id)
      const { data: kit } = await supabase
        .from('brand_kit')
        .select('instagram_handle')
        .eq('user_id', data.user.id)
        .single()
      if (kit?.instagram_handle) setHandle(kit.instagram_handle)
    })
  }, [])

  async function handleAnalisar(e: React.FormEvent) {
    e.preventDefault()
    if (!handle.trim()) { setErro('Digite seu @ do Instagram.'); return }
    setErro('')
    setLoading(true)
    try {
      const cleanHandle = handle.replace('@', '').trim()
      await supabase.from('brand_kit').upsert({
        user_id:          userId,
        instagram_handle: cleanHandle,
        updated_at:       new Date().toISOString(),
      }, { onConflict: 'user_id' })
      window.location.href = `/analyze?handle=${encodeURIComponent(cleanHandle)}`
    } catch (e: any) {
      setErro(e.message)
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        @keyframes spin   { to { transform: rotate(360deg); } }
        @keyframes pulse  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(0.95)} }
        @keyframes float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        .inp-handle {
          width: 100%; padding: 16px 18px 16px 52px;
          background: #f8f9fb; border: 2px solid rgba(0,0,0,0.10);
          border-radius: 12px; color: #1a1a2e; font-size: 18px; font-weight: 600;
          outline: none; font-family: Inter, sans-serif; transition: border-color 0.2s;
          letter-spacing: 0.3px;
        }
        .inp-handle:focus { border-color: #3db860; background: #fff; }
        .btn-analisar {
          width: 100%; padding: 16px; background: #3db860;
          color: #fff; border: none; border-radius: 12px;
          font-size: 16px; font-weight: 800; cursor: pointer;
          transition: all 0.2s; box-shadow: 0 4px 20px rgba(61,184,96,0.35);
          display: flex; align-items: center; justify-content: center;
          gap: 10px; font-family: Inter, sans-serif; letter-spacing: 0.3px;
        }
        .btn-analisar:hover  { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(61,184,96,0.45); }
        .btn-analisar:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }
      `}</style>

      <div style={{ minHeight: '100vh', background: S.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', padding: '32px 20px' }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
          <Image src="/logo.png" alt="Logo" width={40} height={40} style={{ borderRadius: '10px' }} />
          <div>
            <div style={{ color: S.side, fontWeight: 900, fontSize: '14px', letterSpacing: '3px' }}>AMARANTS</div>
            <div style={{ color: S.verde, fontSize: '9px', letterSpacing: '2.5px', textTransform: 'uppercase', marginTop: '2px' }}>Instagrowht</div>
          </div>
        </div>

        {/* Etapas */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '48px' }}>
          {['Cadastro', 'Instagram', 'Análise', 'Plano'].map((step, i) => {
            const ativo = i === 1
            const feito = i === 0
            return (
              <div key={step} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: feito ? S.verde : ativo ? S.side : S.borda, border: `2px solid ${feito ? S.verde : ativo ? S.side : 'rgba(0,0,0,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: feito || ativo ? '#fff' : S.muted, fontWeight: 700 }}>
                    {feito ? '✓' : i + 1}
                  </div>
                  <span style={{ fontSize: '10px', color: ativo ? S.side : S.muted, fontWeight: ativo ? 700 : 400 }}>{step}</span>
                </div>
                {i < 3 && <div style={{ width: '40px', height: '2px', background: feito ? S.verde : 'rgba(0,0,0,0.1)', marginBottom: '16px' }} />}
              </div>
            )
          })}
        </div>

        {/* Card principal */}
        <div style={{ background: S.card, border: `1px solid ${S.borda}`, borderRadius: '24px', padding: '48px 40px', maxWidth: '480px', width: '100%', boxShadow: '0 12px 40px rgba(0,0,0,0.08)', textAlign: 'center' }}>

          {/* Ícone animado */}
          <div style={{ animation: 'float 3s ease-in-out infinite', fontSize: '56px', marginBottom: '24px' }}>📱</div>

          <h1 style={{ color: S.texto, fontWeight: 900, fontSize: '26px', margin: '0 0 12px', letterSpacing: '-0.5px' }}>
            Conecte seu Instagram
          </h1>
          <p style={{ color: S.muted, fontSize: '15px', lineHeight: 1.7, margin: '0 0 36px' }}>
            Digite o seu @ e nossa IA vai analisar seu perfil<br />
            e criar um plano de crescimento personalizado.
          </p>

          <form onSubmit={handleAnalisar}>
            <div style={{ position: 'relative', marginBottom: '16px' }}>
              <span style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: S.verde, fontSize: '20px', fontWeight: 900, lineHeight: 1 }}>@</span>
              <input
                className="inp-handle"
                type="text"
                placeholder="seuinstagram"
                value={handle}
                onChange={e => setHandle(e.target.value.replace('@', ''))}
                disabled={loading}
                autoFocus
              />
            </div>

            {erro && (
              <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontSize: '12px', padding: '10px 14px', borderRadius: '8px', marginBottom: '14px', textAlign: 'left' }}>
                ⚠️ {erro}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-analisar">
              {loading ? (
                <>
                  <span style={{ display: 'inline-block', animation: 'spin 0.8s linear infinite', fontSize: '18px' }}>⟳</span>
                  Salvando...
                </>
              ) : (
                <>🔍 Analisar meu perfil</>
              )}
            </button>
          </form>

          <p style={{ color: S.muted, fontSize: '12px', marginTop: '20px', lineHeight: 1.6 }}>
            🔒 Não precisamos da sua senha. Análise 100% baseada em dados públicos.
          </p>
        </div>

        {/* Pular */}
        <button onClick={() => { window.location.href = '/analyze?handle=&skip=1' }} style={{ marginTop: '24px', background: 'none', border: 'none', color: S.muted, fontSize: '13px', cursor: 'pointer', textDecoration: 'underline' }}>
          Pular esta etapa por enquanto
        </button>
      </div>
    </>
  )
}
