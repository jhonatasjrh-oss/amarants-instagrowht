"use client"

import Image from 'next/image'
import { useState } from 'react'
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

export default function Login() {
  const [tab,      setTab]      = useState<'login' | 'cadastro'>('login')
  const [email,    setEmail]    = useState('')
  const [senha,    setSenha]    = useState('')
  const [nome,     setNome]     = useState('')
  const [loading,  setLoading]  = useState(false)
  const [verSenha, setVerSenha] = useState(false)
  const [erro,     setErro]     = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErro('')
    try {
      if (tab === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signUp({
          email, password: senha,
          options: { data: { full_name: nome } }
        })
        if (error) throw error
      }
      window.location.href = '/dashboard'
    } catch (error: any) {
      setErro(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        input::placeholder { color: #9ca3af !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .login-wrapper {
          min-height: 100vh;
          display: flex;
          font-family: Inter, sans-serif;
        }
        .login-left {
          flex: 1;
          background: #0d1f3c;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 64px 72px;
          position: relative;
          overflow: hidden;
        }
        .login-left::before {
          content: '';
          position: absolute;
          top: -200px; left: -200px;
          width: 600px; height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(61,184,96,0.08) 0%, transparent 65%);
        }
        .login-left::after {
          content: '';
          position: absolute;
          bottom: -200px; right: -200px;
          width: 600px; height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(26,58,110,0.6) 0%, transparent 65%);
        }
        .login-right {
          width: 520px;
          flex-shrink: 0;
          background: #f4f5f7;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 52px;
        }
        .login-card {
          width: 100%;
          max-width: 400px;
          background: #ffffff;
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 20px;
          padding: 36px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.08);
        }
        .input-field {
          width: 100%;
          padding: 12px 14px;
          background: #f8f9fb;
          border: 1px solid rgba(0,0,0,0.12);
          border-radius: 9px;
          color: #1a1a2e;
          font-size: 14px;
          outline: none;
          font-family: Inter, sans-serif;
          transition: border-color 0.2s;
        }
        .input-field:focus { border-color: #3db860; }
        .btn-primary {
          width: 100%;
          padding: 14px;
          background: #3db860;
          color: #ffffff;
          border: none;
          border-radius: 9px;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 16px rgba(61,184,96,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-family: Inter, sans-serif;
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(61,184,96,0.4); }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .btn-google {
          width: 100%;
          padding: 12px;
          background: #ffffff;
          border: 1px solid rgba(0,0,0,0.12);
          border-radius: 9px;
          color: #1a1a2e;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.2s;
          font-family: Inter, sans-serif;
        }
        .btn-google:hover { border-color: rgba(0,0,0,0.25); box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
        .feature-item {
          display: flex;
          align-items: center;
          gap: 12px;
          color: rgba(255,255,255,0.75);
          font-size: 14px;
          margin-bottom: 14px;
        }
        .feature-icon {
          width: 32px; height: 32px;
          border-radius: 8px;
          background: rgba(61,184,96,0.15);
          border: 1px solid rgba(61,184,96,0.25);
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; flex-shrink: 0;
        }
        @media (max-width: 768px) {
          .login-left { display: none; }
          .login-right { width: 100%; padding: 24px 20px; }
        }
      `}</style>

      <div className="login-wrapper">

        {/* ESQUERDO — Escuro */}
        <div className="login-left">
          <div style={{ position: 'relative', zIndex: 1 }}>

            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '56px' }}>
              <Image src="/logo.png" alt="Logo" width={44} height={44} style={{ borderRadius: '12px' }} />
              <div>
                <div style={{ color: '#fff', fontWeight: 900, fontSize: '15px', letterSpacing: '3px' }}>AMARANTS</div>
                <div style={{ color: S.verde, fontSize: '9px', letterSpacing: '2.5px', textTransform: 'uppercase', marginTop: '3px' }}>Instagrowht</div>
              </div>
            </div>

            {/* Badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center',
              background: 'rgba(61,184,96,0.12)',
              border: '1px solid rgba(61,184,96,0.25)',
              color: S.verde, fontSize: '10px', fontWeight: 800,
              padding: '6px 14px', borderRadius: '20px',
              letterSpacing: '2px', textTransform: 'uppercase',
              marginBottom: '24px',
            }}>
              ✦ Plataforma SaaS Premium
            </div>

            {/* Título */}
            <h1 style={{
              color: '#fff', fontWeight: 900,
              fontSize: '44px', lineHeight: 1.1,
              letterSpacing: '-1.5px', marginBottom: '16px',
            }}>
              Cresça no Instagram<br />
              com{' '}
              <span style={{ color: S.verde }}>Inteligência<br />Artificial</span>
            </h1>

            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', lineHeight: 1.75, marginBottom: '40px' }}>
              Gere posts, carrosséis, reels e banners automaticamente.<br />
              Agende e publique com um clique.
            </p>

            {/* Features */}
            {[
              { icon: '✦', texto: 'Plano estratégico gerado por IA' },
              { icon: '📅', texto: 'Calendário editorial automático' },
              { icon: '📊', texto: 'Analytics em tempo real' },
              { icon: '🤖', texto: 'Automações com ManyChat' },
            ].map((f) => (
              <div key={f.texto} className="feature-item">
                <div className="feature-icon">{f.icon}</div>
                {f.texto}
              </div>
            ))}

            {/* Rodapé */}
            <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '11px', marginTop: '40px' }}>
              © 2026 Amarants Expansão Digital · Estruturas digitais para seus negócios!
            </p>
          </div>
        </div>

        {/* DIREITO — Claro */}
        <div className="login-right">
          <div style={{ width: '100%', maxWidth: '400px' }}>
            <div className="login-card">

              {/* Header */}
              <div style={{ marginBottom: '28px', textAlign: 'center' }}>
                <h2 style={{ color: S.azul, fontWeight: 900, fontSize: '22px', margin: '0 0 8px' }}>
                  {tab === 'login' ? 'Entrar na plataforma' : 'Criar sua conta'}
                </h2>
                <p style={{ color: S.muted, fontSize: '13px', margin: 0 }}>
                  {tab === 'login' ? 'Bem-vindo de volta!' : 'Comece grátis. 14 dias sem cartão.'}
                </p>
              </div>

              {/* Tabs */}
              <div style={{
                display: 'flex', gap: '4px',
                background: S.card2, padding: '4px',
                borderRadius: '10px', marginBottom: '24px',
                border: `1px solid ${S.borda}`,
              }}>
                {(['login', 'cadastro'] as const).map((t) => (
                  <button key={t} onClick={() => setTab(t)} style={{
                    flex: 1, padding: '9px', borderRadius: '7px',
                    border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
                    background: tab === t ? S.card : 'transparent',
                    color: tab === t ? S.azul : S.muted,
                    transition: 'all 0.2s', fontFamily: 'Inter, sans-serif',
                    boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                  }}>
                    {t === 'login' ? '🔑 Entrar' : '✨ Cadastrar'}
                  </button>
                ))}
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                {tab === 'cadastro' && (
                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ color: S.muted, fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '7px', letterSpacing: '1px' }}>NOME COMPLETO</label>
                    <input type="text" placeholder="Seu nome completo" value={nome} onChange={e => setNome(e.target.value)} className="input-field" />
                  </div>
                )}

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ color: S.muted, fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '7px', letterSpacing: '1px' }}>E-MAIL</label>
                  <input type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} required className="input-field" />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '7px' }}>
                    <label style={{ color: S.muted, fontSize: '11px', fontWeight: 700, letterSpacing: '1px' }}>SENHA</label>
                    {tab === 'login' && <span style={{ color: S.verde2, fontSize: '12px', cursor: 'pointer' }}>Esqueci a senha</span>}
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={verSenha ? 'text' : 'password'}
                      placeholder="••••••••" value={senha}
                      onChange={e => setSenha(e.target.value)} required
                      className="input-field" style={{ paddingRight: '44px' }}
                    />
                    <button type="button" onClick={() => setVerSenha(!verSenha)} style={{
                      position: 'absolute', right: '12px', top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none', border: 'none', color: S.muted,
                      cursor: 'pointer', fontSize: '16px', padding: 0,
                    }}>
                      {verSenha ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                {erro && (
                  <div style={{
                    background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                    color: '#ef4444', fontSize: '12px', padding: '10px 14px',
                    borderRadius: '8px', marginBottom: '16px',
                  }}>
                    ⚠️ {erro}
                  </div>
                )}

                <button type="submit" disabled={loading} className="btn-primary">
                  {loading
                    ? <><span style={{ display: 'inline-block', animation: 'spin 0.8s linear infinite' }}>⟳</span> {tab === 'login' ? 'Entrando...' : 'Criando conta...'}</>
                    : tab === 'login' ? '🔑 Entrar no painel' : '✨ Criar minha conta grátis'
                  }
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
                  <div style={{ flex: 1, height: '1px', background: S.borda }} />
                  <span style={{ color: S.muted, fontSize: '11px' }}>ou continue com</span>
                  <div style={{ flex: 1, height: '1px', background: S.borda }} />
                </div>

                <button type="button" className="btn-google">
                  <span style={{ fontWeight: 900, fontSize: '16px', color: '#4285f4' }}>G</span>
                  Continuar com Google
                </button>
              </form>

              <p style={{ color: S.muted, fontSize: '11px', textAlign: 'center', marginTop: '20px', lineHeight: 1.6 }}>
                Ao continuar você concorda com os{' '}
                <span style={{ color: S.verde2, cursor: 'pointer' }}>Termos de Uso</span>
                {' '}e{' '}
                <span style={{ color: S.verde2, cursor: 'pointer' }}>Política de Privacidade</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}