"use client"

import Image from 'next/image'
import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '../lib/supabase'

const S = {
  bg:     '#f4f5f7',
  side:   '#0d1f3c',
  card:   '#ffffff',
  card2:  '#f8f9fb',
  borda:  'rgba(0,0,0,0.08)',
  verde:  '#3db860',
  verde2: '#2d9e50',
  texto:  '#1a1a2e',
  muted:  '#6b7280',
}

const PLANO_LABELS: Record<string, { nome: string; preco: string; cor: string }> = {
  starter:  { nome: 'Starter',  preco: 'R$ 99/mês',  cor: S.side  },
  pro:      { nome: 'Pro',      preco: 'R$ 197/mês', cor: S.verde },
  business: { nome: 'Business', preco: 'R$ 397/mês', cor: '#7c3aed' },
}

function RegisterForm() {
  const searchParams  = useSearchParams()
  const plano         = searchParams.get('plano') || 'starter'
  const planoInfo     = PLANO_LABELS[plano] || PLANO_LABELS.starter

  const [nomeCompleto, setNomeCompleto] = useState('')
  const [instagram,    setInstagram]    = useState('')
  const [telefone,     setTelefone]     = useState('')
  const [email,        setEmail]        = useState('')
  const [senha,        setSenha]        = useState('')
  const [confirma,     setConfirma]     = useState('')
  const [verSenha,     setVerSenha]     = useState(false)
  const [loading,      setLoading]      = useState(false)
  const [erro,         setErro]         = useState('')
  const [emailEnviado, setEmailEnviado] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro('')
    if (senha !== confirma) { setErro('As senhas não coincidem.'); return }
    if (senha.length < 6)   { setErro('A senha deve ter no mínimo 6 caracteres.'); return }

    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: senha,
        options:  { data: { full_name: nomeCompleto } },
      })
      if (error) throw error

      const userId = data.user?.id
      if (userId) {
        await supabase.from('brand_kit').upsert({
          user_id:             userId,
          nome_completo:       nomeCompleto,
          nome_dono:           nomeCompleto,
          instagram_handle:    instagram.replace('@', ''),
          telefone,
          plano_escolhido:     plano,
          plano:               'free',
          onboarding_completo: false,
          updated_at:          new Date().toISOString(),
        }, { onConflict: 'user_id' })
      }

      if (data.session) {
        window.location.href = '/connect-instagram'
      } else {
        setEmailEnviado(true)
      }
    } catch (e: any) {
      setErro(e.message)
    } finally {
      setLoading(false)
    }
  }

  if (emailEnviado) {
    return (
      <div style={{ minHeight: '100vh', background: S.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ background: S.card, border: `1px solid ${S.borda}`, borderRadius: '20px', padding: '48px 40px', maxWidth: '420px', width: '100%', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>📧</div>
          <h2 style={{ color: S.texto, fontWeight: 900, fontSize: '22px', margin: '0 0 12px' }}>Confirme seu e-mail</h2>
          <p style={{ color: S.muted, fontSize: '14px', lineHeight: 1.7, margin: '0 0 24px' }}>
            Enviamos um link de confirmação para <strong style={{ color: S.texto }}>{email}</strong>.<br />
            Clique no link para ativar sua conta e continuar.
          </p>
          <a href="/login" style={{ display: 'inline-block', padding: '12px 32px', background: S.verde, color: '#fff', borderRadius: '9px', fontWeight: 700, fontSize: '14px', textDecoration: 'none' }}>
            Ir para o login
          </a>
        </div>
      </div>
    )
  }

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        input::placeholder { color: #9ca3af !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .reg-left {
          flex: 1; background: #0d1f3c;
          display: flex; flex-direction: column; justify-content: center;
          padding: 64px 72px; position: relative; overflow: hidden;
        }
        .reg-left::before {
          content: ''; position: absolute; top: -200px; left: -200px;
          width: 600px; height: 600px; border-radius: 50%;
          background: radial-gradient(circle, rgba(61,184,96,0.08) 0%, transparent 65%);
        }
        .reg-right {
          width: 560px; flex-shrink: 0; background: #f4f5f7;
          display: flex; align-items: center; justify-content: center;
          padding: 48px 52px; overflow-y: auto;
        }
        .inp {
          width: 100%; padding: 12px 14px;
          background: #f8f9fb; border: 1px solid rgba(0,0,0,0.12);
          border-radius: 9px; color: #1a1a2e; font-size: 14px;
          outline: none; font-family: Inter, sans-serif; transition: border-color 0.2s;
        }
        .inp:focus { border-color: #3db860; }
        .inp-prefix {
          display: flex; align-items: center;
          background: #f8f9fb; border: 1px solid rgba(0,0,0,0.12);
          border-radius: 9px; overflow: hidden;
        }
        .inp-prefix span {
          padding: 12px 12px 12px 14px; color: #6b7280;
          font-size: 14px; font-family: Inter, sans-serif;
          border-right: 1px solid rgba(0,0,0,0.08);
        }
        .inp-prefix input {
          flex: 1; padding: 12px 14px; background: transparent;
          border: none; color: #1a1a2e; font-size: 14px;
          outline: none; font-family: Inter, sans-serif;
        }
        .btn-submit {
          width: 100%; padding: 14px; background: #3db860;
          color: #fff; border: none; border-radius: 9px;
          font-size: 14px; font-weight: 800; cursor: pointer;
          transition: all 0.2s; box-shadow: 0 4px 16px rgba(61,184,96,0.3);
          display: flex; align-items: center; justify-content: center;
          gap: 8px; font-family: Inter, sans-serif;
        }
        .btn-submit:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(61,184,96,0.4); }
        .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        @media (max-width: 900px) {
          .reg-left { display: none; }
          .reg-right { width: 100%; padding: 24px 20px; }
        }
      `}</style>

      <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'Inter, sans-serif' }}>

        {/* ESQUERDO */}
        <div className="reg-left">
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
              <Image src="/logo.png" alt="Logo" width={44} height={44} style={{ borderRadius: '12px' }} />
              <div>
                <div style={{ color: '#fff', fontWeight: 900, fontSize: '15px', letterSpacing: '3px' }}>AMARANTS</div>
                <div style={{ color: S.verde, fontSize: '9px', letterSpacing: '2.5px', textTransform: 'uppercase', marginTop: '3px' }}>Instagrowht</div>
              </div>
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(61,184,96,0.12)', border: '1px solid rgba(61,184,96,0.25)', color: S.verde, fontSize: '10px', fontWeight: 800, padding: '6px 14px', borderRadius: '20px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '24px' }}>
              ✦ Plano {planoInfo.nome} selecionado
            </div>

            <h1 style={{ color: '#fff', fontWeight: 900, fontSize: '40px', lineHeight: 1.1, letterSpacing: '-1.5px', marginBottom: '16px' }}>
              Sua conta está<br />
              a <span style={{ color: S.verde }}>2 minutos</span><br />
              de distância
            </h1>

            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', lineHeight: 1.75, marginBottom: '36px' }}>
              Preencha o formulário ao lado e comece<br />
              a crescer no Instagram com IA.
            </p>

            {[
              { icon: '🤖', texto: 'IA analisa seu perfil automaticamente'  },
              { icon: '📅', texto: 'Plano de ação personalizado em minutos' },
              { icon: '✦',  texto: 'Conteúdo gerado para o seu nicho'       },
              { icon: '📊', texto: 'Metas de crescimento realistas'          },
            ].map((f) => (
              <div key={f.texto} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'rgba(255,255,255,0.75)', fontSize: '14px', marginBottom: '14px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(61,184,96,0.15)', border: '1px solid rgba(61,184,96,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>
                  {f.icon}
                </div>
                {f.texto}
              </div>
            ))}

            <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '11px', marginTop: '40px' }}>
              © 2026 Amarants Expansão Digital
            </p>
          </div>
        </div>

        {/* DIREITO */}
        <div className="reg-right">
          <div style={{ width: '100%', maxWidth: '440px' }}>

            {/* Badge do plano */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <div style={{ color: S.texto, fontWeight: 900, fontSize: '22px' }}>Criar sua conta</div>
                <div style={{ color: S.muted, fontSize: '13px', marginTop: '4px' }}>Preencha os dados abaixo para começar</div>
              </div>
              <div style={{ background: `${planoInfo.cor}18`, border: `1px solid ${planoInfo.cor}40`, color: planoInfo.cor, fontSize: '11px', fontWeight: 800, padding: '5px 12px', borderRadius: '20px', letterSpacing: '1px', whiteSpace: 'nowrap' }}>
                {planoInfo.nome} · {planoInfo.preco}
              </div>
            </div>

            <div style={{ background: S.card, border: `1px solid ${S.borda}`, borderRadius: '20px', padding: '32px', boxShadow: '0 8px 32px rgba(0,0,0,0.07)' }}>
              <form onSubmit={handleSubmit}>

                {/* Nome */}
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ color: S.muted, fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '7px', letterSpacing: '1px' }}>NOME COMPLETO</label>
                  <input className="inp" type="text" placeholder="Seu nome completo" value={nomeCompleto} onChange={e => setNomeCompleto(e.target.value)} required />
                </div>

                {/* Instagram */}
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ color: S.muted, fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '7px', letterSpacing: '1px' }}>SEU @ DO INSTAGRAM</label>
                  <div className="inp-prefix">
                    <span>@</span>
                    <input type="text" placeholder="seuhandle" value={instagram} onChange={e => setInstagram(e.target.value.replace('@', ''))} required />
                  </div>
                </div>

                {/* Telefone */}
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ color: S.muted, fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '7px', letterSpacing: '1px' }}>WHATSAPP</label>
                  <input className="inp" type="tel" placeholder="(11) 99999-9999" value={telefone} onChange={e => setTelefone(e.target.value)} />
                </div>

                {/* Email */}
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ color: S.muted, fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '7px', letterSpacing: '1px' }}>E-MAIL</label>
                  <input className="inp" type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>

                {/* Senha */}
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ color: S.muted, fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '7px', letterSpacing: '1px' }}>SENHA</label>
                  <div style={{ position: 'relative' }}>
                    <input className="inp" type={verSenha ? 'text' : 'password'} placeholder="Mínimo 6 caracteres" value={senha} onChange={e => setSenha(e.target.value)} required style={{ paddingRight: '44px' }} />
                    <button type="button" onClick={() => setVerSenha(!verSenha)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: S.muted, cursor: 'pointer', fontSize: '16px', padding: 0 }}>
                      {verSenha ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                {/* Confirmar senha */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ color: S.muted, fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '7px', letterSpacing: '1px' }}>CONFIRMAR SENHA</label>
                  <input className="inp" type={verSenha ? 'text' : 'password'} placeholder="Repita a senha" value={confirma} onChange={e => setConfirma(e.target.value)} required />
                </div>

                {erro && (
                  <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontSize: '12px', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px' }}>
                    ⚠️ {erro}
                  </div>
                )}

                <button type="submit" disabled={loading} className="btn-submit">
                  {loading
                    ? <><span style={{ display: 'inline-block', animation: 'spin 0.8s linear infinite' }}>⟳</span> Criando conta...</>
                    : '🚀 Criar minha conta e continuar'
                  }
                </button>
              </form>

              <p style={{ color: S.muted, fontSize: '11px', textAlign: 'center', marginTop: '20px', lineHeight: 1.6 }}>
                Ao continuar você concorda com os{' '}
                <span style={{ color: S.verde2, cursor: 'pointer' }}>Termos de Uso</span>
                {' '}e{' '}
                <span style={{ color: S.verde2, cursor: 'pointer' }}>Política de Privacidade</span>
              </p>
            </div>

            <p style={{ color: S.muted, fontSize: '13px', textAlign: 'center', marginTop: '20px' }}>
              Já tem uma conta?{' '}
              <a href="/login" style={{ color: S.verde2, fontWeight: 700, textDecoration: 'none' }}>Entrar</a>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  )
}
