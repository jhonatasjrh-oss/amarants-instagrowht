"use client"

import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
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
  const [userId,     setUserId]     = useState('')
  const [connected,  setConnected]  = useState(false)
  const [handle,     setHandle]     = useState('')
  const [loading,    setLoading]    = useState(true)
  const [connecting, setConnecting] = useState(false)
  const [erro,       setErro]       = useState('')

  const popupRef   = useRef<Window | null>(null)
  const pollRef    = useRef<ReturnType<typeof setInterval> | null>(null)

  // Limpa o interval ao desmontar
  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [])

  useEffect(() => {
    const params         = new URLSearchParams(window.location.search)
    const errParam       = params.get('error')
    const connectedParam = params.get('connected')
    if (errParam) setErro(decodeURIComponent(errParam))

    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { setLoading(false); return }
      setUserId(data.user.id)

      const { data: kit } = await supabase
        .from('brand_kit')
        .select('instagram_handle,instagram_connected')
        .eq('user_id', data.user.id)
        .single()

      if (kit?.instagram_connected && kit?.instagram_handle) {
        setConnected(true)
        setHandle(kit.instagram_handle)
      } else if (connectedParam === 'true') {
        // Fallback: popup não tinha opener, veio via redirect
        const { data: freshKit } = await supabase
          .from('brand_kit')
          .select('instagram_handle,instagram_connected')
          .eq('user_id', data.user.id)
          .single()
        if (freshKit?.instagram_connected && freshKit?.instagram_handle) {
          setConnected(true)
          setHandle(freshKit.instagram_handle)
        }
      }

      setLoading(false)
    })
  }, [])

  function startPolling() {
    if (pollRef.current) clearInterval(pollRef.current)

    pollRef.current = setInterval(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: kit } = await supabase
        .from('brand_kit')
        .select('instagram_handle,instagram_connected')
        .eq('user_id', user.id)
        .single()

      if (kit?.instagram_connected && kit?.instagram_handle) {
        clearInterval(pollRef.current!)
        pollRef.current = null
        popupRef.current?.close()
        setConnecting(false)
        setConnected(true)
        setHandle(kit.instagram_handle)
      }
    }, 2000)
  }

  function handleConectar() {
    setErro('')
    setConnecting(true)

    const popup = window.open(
      '/api/auth/instagram',
      'instagram_oauth',
      'width=600,height=700,scrollbars=yes,resizable=yes'
    )
    popupRef.current = popup

    // Inicia polling para detectar conexão no Supabase
    startPolling()

    // Detecta popup fechado manualmente sem completar o OAuth
    const closeTimer = setInterval(() => {
      if (popup?.closed) {
        clearInterval(closeTimer)
        if (pollRef.current) {
          clearInterval(pollRef.current)
          pollRef.current = null
        }
        setConnecting(false)
      }
    }, 500)
  }

  function handleContinuar() {
    window.location.href = '/amarantsinstagrouth/analyze'
  }

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        .btn-conectar {
          width: 100%; padding: 16px; background: #3db860;
          color: #fff; border: none; border-radius: 12px;
          font-size: 16px; font-weight: 800; cursor: pointer;
          transition: all 0.2s; box-shadow: 0 4px 20px rgba(61,184,96,0.35);
          display: flex; align-items: center; justify-content: center;
          gap: 10px; font-family: Inter, sans-serif; letter-spacing: 0.3px;
        }
        .btn-conectar:hover    { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(61,184,96,0.45); }
        .btn-conectar:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }
        .btn-continuar {
          width: 100%; padding: 16px; background: #0d1f3c;
          color: #fff; border: none; border-radius: 12px;
          font-size: 16px; font-weight: 800; cursor: pointer;
          transition: all 0.2s; box-shadow: 0 4px 20px rgba(13,31,60,0.25);
          display: flex; align-items: center; justify-content: center;
          gap: 10px; font-family: Inter, sans-serif; letter-spacing: 0.3px;
        }
        .btn-continuar:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(13,31,60,0.35); }
      `}</style>

      <div style={{ minHeight: '100vh', background: S.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', padding: '32px 20px' }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
          <Image src="/logo-dark.png" alt="Logo" width={40} height={40} style={{ borderRadius: '10px' }} />
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
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: feito ? S.verde : ativo ? S.side : S.borda,
                    border: `2px solid ${feito ? S.verde : ativo ? S.side : 'rgba(0,0,0,0.1)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', color: feito || ativo ? '#fff' : S.muted, fontWeight: 700,
                  }}>
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

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '24px 0' }}>
              <span style={{ display: 'inline-block', animation: 'spin 0.8s linear infinite', fontSize: '32px' }}>⟳</span>
              <p style={{ color: S.muted, fontSize: '15px', margin: 0 }}>Carregando...</p>
            </div>
          ) : connected ? (
            <>
              <div style={{ animation: 'float 3s ease-in-out infinite', fontSize: '56px', marginBottom: '24px' }}>✅</div>

              <h1 style={{ color: S.texto, fontWeight: 900, fontSize: '26px', margin: '0 0 12px', letterSpacing: '-0.5px' }}>
                Instagram conectado!
              </h1>
              <p style={{ color: S.muted, fontSize: '15px', lineHeight: 1.7, margin: '0 0 24px' }}>
                Sua conta <strong style={{ color: S.texto }}>@{handle}</strong> foi conectada com sucesso.<br />
                Agora podemos analisar seus dados reais.
              </p>

              <div style={{ background: 'rgba(61,184,96,0.08)', border: '1px solid rgba(61,184,96,0.2)', borderRadius: '12px', padding: '14px 18px', marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '20px' }}>📊</span>
                <span style={{ color: S.verde2, fontSize: '13px', fontWeight: 600, textAlign: 'left' }}>
                  Acesso autorizado à API do Instagram. Seus dados são analisados com segurança.
                </span>
              </div>

              <button type="button" className="btn-continuar" onClick={handleContinuar}>
                Ir para análise →
              </button>

              <p style={{ color: S.muted, fontSize: '12px', marginTop: '16px', lineHeight: 1.6 }}>
                Quer conectar outra conta?{' '}
                <span
                  onClick={handleConectar}
                  style={{ color: S.verde, cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }}
                >
                  Reconectar
                </span>
              </p>
            </>
          ) : (
            <>
              <div style={{ animation: 'float 3s ease-in-out infinite', fontSize: '56px', marginBottom: '24px' }}>📱</div>

              <h1 style={{ color: S.texto, fontWeight: 900, fontSize: '26px', margin: '0 0 12px', letterSpacing: '-0.5px' }}>
                Conecte seu Instagram
              </h1>
              <p style={{ color: S.muted, fontSize: '15px', lineHeight: 1.7, margin: '0 0 32px' }}>
                Autorize o acesso à sua conta e nossa IA vai analisar<br />
                seus dados reais e criar um plano personalizado.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px', textAlign: 'left' }}>
                {[
                  ['📊', 'Análise com dados reais de seguidores e engajamento'],
                  ['🎯', 'Plano de crescimento calibrado para o seu perfil'],
                  ['🔒', 'Acesso somente leitura — não publicamos nada'],
                ].map(([icon, text]) => (
                  <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f8f9fb', borderRadius: '10px', padding: '12px 14px' }}>
                    <span style={{ fontSize: '20px' }}>{icon}</span>
                    <span style={{ color: S.texto, fontSize: '13px', fontWeight: 500 }}>{text}</span>
                  </div>
                ))}
              </div>

              {erro && (
                <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontSize: '13px', padding: '11px 14px', borderRadius: '9px', marginBottom: '16px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>⚠️</span> {erro}
                </div>
              )}

              {connecting ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '8px 0' }}>
                  <span style={{ display: 'inline-block', animation: 'spin 0.8s linear infinite', fontSize: '28px' }}>⟳</span>
                  <p style={{ color: S.muted, fontSize: '14px', margin: 0 }}>
                    Aguardando autorização no popup...
                  </p>
                </div>
              ) : (
                <button type="button" className="btn-conectar" onClick={handleConectar}>
                  <span style={{ fontSize: '20px' }}>📸</span>
                  Conectar com Instagram
                </button>
              )}

              <p style={{ color: S.muted, fontSize: '12px', marginTop: '16px', lineHeight: 1.6 }}>
                Um popup será aberto para você autorizar o acesso.
              </p>
            </>
          )}
        </div>
      </div>
    </>
  )
}
