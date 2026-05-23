"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { supabase } from '../lib/supabase'

const BASE = '/amarantsinstagrouth'

const PRICE_IDS = {
  essencial: {
    mensal: process.env.NEXT_PUBLIC_STRIPE_ESSENCIAL_MENSAL_PRICE_ID || '',
    anual:  process.env.NEXT_PUBLIC_STRIPE_ESSENCIAL_ANUAL_PRICE_ID  || '',
  },
  automatico: {
    mensal: process.env.NEXT_PUBLIC_STRIPE_AUTOMATICO_MENSAL_PRICE_ID || '',
    anual:  process.env.NEXT_PUBLIC_STRIPE_AUTOMATICO_ANUAL_PRICE_ID  || '',
  },
}

export default function LandingPage() {
  const [periodo, setPeriodo]       = useState<'mensal' | 'anual'>('mensal')
  const [faqAberto, setFaqAberto]   = useState<number | null>(null)
  const [userId, setUserId]         = useState<string | null>(null)
  const [navSolid, setNavSolid]     = useState(false)
  const [isMobile, setIsMobile]     = useState(false)
  const [isTablet, setIsTablet]     = useState(false)
  const [menuAberto, setMenuAberto] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null))

    const handleScroll = () => setNavSolid(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)

    const handleResize = () => {
      const w = window.innerWidth
      setIsMobile(w <= 768)
      setIsTablet(w > 768 && w <= 1024)
    }
    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  async function handleCheckout(planId: 'essencial' | 'automatico') {
    if (!userId) {
      window.location.href = `${BASE}/register?plano=${planId}&periodo=${periodo}`
      return
    }
    const priceId = PRICE_IDS[planId][periodo]
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, planId, periodo, priceId }),
    })
    const data = await res.json()
    if (data.url) window.location.href = data.url
  }

  function scrollTo(id: string) {
    setMenuAberto(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const faqs = [
    {
      q: 'Preciso ter conta Business no Instagram?',
      a: 'Sim. Para conectar o Instagram e usar os recursos de postagem automática, sua conta precisa estar como Conta Profissional (Business ou Criador de Conteúdo). A conversão é gratuita e leva menos de 2 minutos.',
    },
    {
      q: 'Como a IA cria os carrosséis com minha identidade visual?',
      a: 'Você faz upload da sua logo e informa as cores da sua marca. A IA usa esses elementos para gerar todos os slides com sua identidade visual. O resultado parece feito por um designer profissional.',
    },
    {
      q: 'Posso cancelar quando quiser?',
      a: 'Sim. Você pode solicitar o cancelamento a qualquer momento. O acesso continua ativo até o fim do período pago. Não há reembolso após a adesão.',
    },
    {
      q: 'Em quanto tempo vejo resultado?',
      a: 'Os primeiros resultados aparecem entre 2 e 4 semanas com consistência. A IA analisa seu perfil e otimiza continuamente a estratégia. Perfis que seguem o plano por 30 dias crescem em média 15-20% em engajamento.',
    },
    {
      q: 'O que é a produção de Reels por R$49?',
      a: 'É um serviço adicional onde nossa equipe produz roteiros completos de Reels (hook, desenvolvimento, CTA e legenda) personalizados para o seu nicho. Você filma, nós roteirizamos.',
    },
    {
      q: 'Qual a diferença entre plano mensal e anual?',
      a: 'No plano anual você paga 12 meses de uma vez com 15% de desconto. O acesso é imediato e válido por 12 meses. É a melhor opção para quem quer resultados consistentes ao longo do tempo.',
    },
  ]

  const mockupW = isMobile ? '280px' : isTablet ? '340px' : '450px'
  const mockupH = isMobile ? '370px' : isTablet ? '450px' : '600px'

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #0a0a0f; font-family: Inter, sans-serif; color: #fff; overflow-x: hidden; }
        ::selection { background: rgba(233,30,140,0.35); }
        a { text-decoration: none; color: inherit; }

        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes floatNotif1 { 0%,100% { transform: translateY(0) rotate(-1deg); } 50% { transform: translateY(-8px) rotate(1deg); } }
        @keyframes floatNotif2 { 0%,100% { transform: translateY(0) rotate(1deg); } 50% { transform: translateY(-12px) rotate(-1deg); } }
        @keyframes floatNotif3 { 0%,100% { transform: translateY(0) rotate(-0.5deg); } 50% { transform: translateY(-9px) rotate(0.5deg); } }
        @keyframes floatNotif4 { 0%,100% { transform: translateY(0) rotate(1.5deg); } 50% { transform: translateY(-7px) rotate(-1.5deg); } }
        @keyframes fadeInUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse-glow { 0%,100% { box-shadow: 0 0 20px rgba(233,30,140,0.4); } 50% { box-shadow: 0 0 40px rgba(233,30,140,0.8); } }
        @keyframes badge-in { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes scroll-x {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes slideDown {
          from { opacity:0; transform:translateY(-10px); }
          to   { opacity:1; transform:translateY(0); }
        }

        .btn-primary {
          background: linear-gradient(135deg, #e91e8c, #f97316);
          color: #fff; border: none; border-radius: 14px;
          font-weight: 800; cursor: pointer; font-family: Inter, sans-serif;
          transition: all 0.25s; display: inline-flex; align-items: center; gap: 8px;
        }
        .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(233,30,140,0.45); filter: brightness(1.1); }
        .btn-ghost {
          background: transparent; color: rgba(255,255,255,0.75);
          border: 1.5px solid rgba(255,255,255,0.18); border-radius: 14px;
          font-weight: 600; cursor: pointer; font-family: Inter, sans-serif;
          transition: all 0.25s; display: inline-flex; align-items: center; gap: 8px;
        }
        .btn-ghost:hover { background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.35); transform: translateY(-2px); }
        .btn-outline-purple {
          background: transparent; color: #e91e8c;
          border: 1.5px solid #e91e8c; border-radius: 10px;
          font-weight: 600; cursor: pointer; font-family: Inter, sans-serif;
          transition: all 0.22s;
        }
        .btn-outline-purple:hover { background: rgba(233,30,140,0.12); }

        .card-hover { transition: transform 0.25s, box-shadow 0.25s; }
        .card-hover:hover { transform: translateY(-6px); box-shadow: 0 24px 60px rgba(0,0,0,0.5); }

        .niche-track {
          display: flex; gap: 32px; animation: scroll-x 22s linear infinite;
          white-space: nowrap;
        }
        .niche-track:hover { animation-play-state: paused; }

        .mobile-menu {
          display: flex;
          flex-direction: column;
          gap: 4px;
          animation: slideDown 0.22s ease both;
        }
        .mobile-menu-item {
          background: none; border: none;
          color: rgba(255,255,255,0.8); font-size: 15px;
          font-weight: 600; cursor: pointer;
          font-family: Inter, sans-serif;
          padding: 14px 20px; text-align: left;
          border-radius: 10px; transition: background 0.18s, color 0.18s;
          width: 100%;
        }
        .mobile-menu-item:hover { background: rgba(233,30,140,0.1); color: #fff; }
      `}</style>

      {/* ─── NAV ─── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: navSolid ? 'rgba(10,10,15,0.97)' : 'rgba(10,10,15,0.7)',
        backdropFilter: 'blur(20px)',
        borderBottom: navSolid ? '1px solid rgba(233,30,140,0.2)' : '1px solid transparent',
        transition: 'all 0.3s',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0 16px' : '0 24px', height: 84, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Image src="/Logo_amarantsGroth.png" alt="Amarants" width={0} height={0} sizes="100vw" style={{ width: 'auto', height: isMobile ? '64px' : '88px', objectFit: 'contain' }} />
            <span style={{
              fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
              fontWeight: 800,
              fontSize: isMobile ? '15px' : '19px',
              background: 'linear-gradient(135deg, #e91e8c 0%, #f97316 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: 1.2,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}>
              <span>Amarants</span>
              <span>Instagrowht</span>
            </span>
          </div>

          {/* Desktop links */}
          {!isMobile && (
            <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
              {[['Como funciona', 'como-funciona'], ['Planos', 'planos'], ['Depoimentos', 'depoimentos']].map(([label, id]) => (
                <button key={id} onClick={() => scrollTo(id)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.65)', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}>
                  {label}
                </button>
              ))}
            </div>
          )}

          {/* Desktop WhatsApp CTA / Mobile hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {!isMobile && (
              <a
                href="https://wa.me/5562993277239?text=Ol%C3%A1%2C%20quero%20saber%20mais%20sobre%20o%20Amarants%20Instagrowht!"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'linear-gradient(135deg, #e91e8c, #f97316)',
                  color: '#fff', borderRadius: 10,
                  padding: '9px 18px', fontSize: 13, fontWeight: 700,
                  fontFamily: 'Inter, sans-serif',
                  textDecoration: 'none',
                  transition: 'all 0.22s',
                  boxShadow: '0 4px 16px rgba(233,30,140,0.3)',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 8px 24px rgba(233,30,140,0.45)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 16px rgba(233,30,140,0.3)' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>
            )}

            {/* Hamburger */}
            {isMobile && (
              <button
                onClick={() => setMenuAberto(!menuAberto)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, display: 'flex', flexDirection: 'column', gap: 5 }}
                aria-label="Menu"
              >
                <span style={{ display: 'block', width: 22, height: 2, background: menuAberto ? '#e91e8c' : '#fff', borderRadius: 2, transition: 'all 0.22s', transform: menuAberto ? 'translateY(7px) rotate(45deg)' : 'none' }} />
                <span style={{ display: 'block', width: 22, height: 2, background: menuAberto ? 'transparent' : '#fff', borderRadius: 2, transition: 'all 0.22s' }} />
                <span style={{ display: 'block', width: 22, height: 2, background: menuAberto ? '#e91e8c' : '#fff', borderRadius: 2, transition: 'all 0.22s', transform: menuAberto ? 'translateY(-7px) rotate(-45deg)' : 'none' }} />
              </button>
            )}
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {isMobile && menuAberto && (
          <div className="mobile-menu" style={{
            background: 'rgba(10,10,15,0.98)',
            borderTop: '1px solid rgba(233,30,140,0.15)',
            padding: '12px 16px 20px',
          }}>
            {[['Como funciona', 'como-funciona'], ['Planos', 'planos'], ['Depoimentos', 'depoimentos']].map(([label, id]) => (
              <button key={id} className="mobile-menu-item" onClick={() => scrollTo(id)}>{label}</button>
            ))}
            <a
              href="https://wa.me/5562993277239?text=Ol%C3%A1%2C%20quero%20saber%20mais%20sobre%20o%20Amarants%20Instagrowht!"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuAberto(false)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                background: 'linear-gradient(135deg, #e91e8c, #f97316)',
                color: '#fff', borderRadius: 12,
                padding: '14px 20px', fontSize: 14, fontWeight: 700,
                fontFamily: 'Inter, sans-serif', marginTop: 8,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Falar no WhatsApp
            </a>
          </div>
        )}
      </nav>

      {/* ─── HERO ─── */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        background: 'linear-gradient(135deg, #1a0533 0%, #0a0a0f 50%, #001a33 100%)',
        position: 'relative', overflow: 'hidden', paddingTop: 84,
      }}>
        <div style={{ position: 'absolute', top: -200, left: -200, width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(233,30,140,0.12) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -200, right: -200, width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 65%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '60px 20px 40px' : isTablet ? '70px 32px 60px' : '80px 24px', width: '100%' }}>
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'center' : 'center',
            gap: isMobile ? 40 : isTablet ? 40 : 64,
            textAlign: isMobile ? 'center' : 'left',
          }}>

            {/* Text side */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(233,30,140,0.12)', border: '1px solid rgba(233,30,140,0.3)',
                color: '#f48fb1', fontSize: isMobile ? 12 : 13, fontWeight: 700,
                padding: '7px 16px', borderRadius: 999, marginBottom: 24,
                animation: 'badge-in 0.6s ease both',
              }}>
                <span style={{ animation: 'float 2s ease-in-out infinite', display: 'inline-block' }}>🚀</span>
                +2.300 perfis crescendo com IA
              </div>

              {/* H1 */}
              <h1 style={{ fontSize: isMobile ? 34 : isTablet ? 42 : 52, fontWeight: 900, lineHeight: 1.1, marginBottom: 20, letterSpacing: isMobile ? -0.5 : -1.5 }}>
                Transforme seu Instagram em uma{' '}
                <span style={{
                  background: 'linear-gradient(90deg, #e91e8c, #f97316, #06b6d4)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  máquina de crescimento automático
                </span>
                {' '}com Inteligência Artificial
              </h1>

              <p style={{ fontSize: isMobile ? 15 : 17, color: '#94a3b8', lineHeight: 1.75, marginBottom: 36, maxWidth: isMobile ? '100%' : 520 }}>
                Crie conteúdos profissionais, carrosséis personalizados, stories estratégicos e roteiros de Reels em minutos — enquanto nossa IA analisa, planeja e publica tudo automaticamente para você.
              </p>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 14, justifyContent: isMobile ? 'center' : 'flex-start' }}>
                <button className="btn-primary" style={{ padding: isMobile ? '15px 28px' : '17px 36px', fontSize: isMobile ? 14 : 16, borderRadius: 14, letterSpacing: 1, width: isMobile ? '100%' : 'auto' }}
                  onClick={() => scrollTo('planos')}>
                  COMEÇAR AGORA
                </button>
                <button className="btn-ghost" style={{ padding: isMobile ? '13px 20px' : '17px 28px', fontSize: 15, borderRadius: 14, width: isMobile ? '100%' : 'auto' }}
                  onClick={() => scrollTo('como-funciona')}>
                  Ver como funciona ↓
                </button>
              </div>
              <p style={{ color: '#64748b', fontSize: 13, marginBottom: 24 }}>Teste o futuro do crescimento no Instagram.</p>

              {/* Social proof */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, justifyContent: isMobile ? 'center' : 'flex-start' }}>
                <div style={{ display: 'flex' }}>
                  {['M','R','C','A','L'].map((l, i) => (
                    <div key={i} style={{
                      width: 34, height: 34, borderRadius: '50%', border: '2px solid #0a0a0f',
                      background: `linear-gradient(135deg, ${['#e91e8c','#f97316','#06b6d4','#22c55e','#ec4899'][i]}, ${['#c2185b','#ea580c','#0891b2','#16a34a','#db2777'][i]})`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 800, color: '#fff',
                      marginLeft: i === 0 ? 0 : -10,
                    }}>{l}</div>
                  ))}
                </div>
                <div>
                  <div style={{ display: 'flex', gap: 2, marginBottom: 3 }}>
                    {'★★★★★'.split('').map((s, i) => <span key={i} style={{ color: '#fbbf24', fontSize: 13 }}>{s}</span>)}
                  </div>
                  <span style={{ color: '#94a3b8', fontSize: 13 }}>Junte-se a <strong style={{ color: '#fff' }}>+2.300 criadores</strong></span>
                </div>
              </div>
            </div>

            {/* Mockup */}
            <div style={{ position: 'relative', width: mockupW, height: mockupH, flexShrink: 0 }}>
              <Image
                src="/instagram-mockup.png"
                alt="Instagram Mockup"
                fill
                sizes={mockupW}
                priority
                style={{ objectFit: 'contain', animation: 'float 3s ease-in-out infinite' }}
              />

              {!isMobile && (
                <>
                  <div style={{ position: 'absolute', top: '10%', right: '-20px', background: 'rgba(15,15,25,0.9)', border: '1px solid rgba(233,30,140,0.4)', borderRadius: '12px', padding: '8px 14px', fontSize: '13px', color: '#fff', fontWeight: 600, backdropFilter: 'blur(10px)', animation: 'fadeInUp 0.5s ease forwards', whiteSpace: 'nowrap' }}>
                    ❤️ +234 curtidas
                  </div>
                  <div style={{ position: 'absolute', top: '30%', left: '-30px', background: 'rgba(15,15,25,0.9)', border: '1px solid rgba(249,115,22,0.4)', borderRadius: '12px', padding: '8px 14px', fontSize: '13px', color: '#fff', fontWeight: 600, backdropFilter: 'blur(10px)', animation: 'fadeInUp 0.7s ease forwards', whiteSpace: 'nowrap' }}>
                    👥 +47 seguidores
                  </div>
                  <div style={{ position: 'absolute', bottom: '25%', right: '-20px', background: 'rgba(15,15,25,0.9)', border: '1px solid rgba(6,182,212,0.4)', borderRadius: '12px', padding: '8px 14px', fontSize: '13px', color: '#fff', fontWeight: 600, backdropFilter: 'blur(10px)', animation: 'fadeInUp 0.9s ease forwards', whiteSpace: 'nowrap' }}>
                    📈 +12% engajamento
                  </div>
                  <div style={{ position: 'absolute', bottom: '10%', left: '-20px', background: 'rgba(15,15,25,0.9)', border: '1px solid rgba(34,197,94,0.4)', borderRadius: '12px', padding: '8px 14px', fontSize: '13px', color: '#fff', fontWeight: 600, backdropFilter: 'blur(10px)', animation: 'fadeInUp 1.1s ease forwards', whiteSpace: 'nowrap' }}>
                    ✨ Post publicado pela IA
                  </div>
                </>
              )}

              {isMobile && (
                <div style={{ position: 'absolute', bottom: -10, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8, whiteSpace: 'nowrap' }}>
                  <div style={{ background: 'rgba(15,15,25,0.92)', border: '1px solid rgba(233,30,140,0.4)', borderRadius: 10, padding: '6px 12px', fontSize: 12, color: '#fff', fontWeight: 600 }}>
                    ❤️ +234 curtidas
                  </div>
                  <div style={{ background: 'rgba(15,15,25,0.92)', border: '1px solid rgba(34,197,94,0.4)', borderRadius: 10, padding: '6px 12px', fontSize: 12, color: '#fff', fontWeight: 600 }}>
                    👥 +47 seguidores
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── NICHOS ─── */}
      <section style={{ background: '#0d0d14', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '32px 0', overflow: 'hidden' }}>
        <p style={{ textAlign: 'center', color: '#64748b', fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 24 }}>
          Funciona para todos os nichos
        </p>
        <div style={{ overflow: 'hidden', maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
          <div style={{ display: 'flex' }}>
            <div className="niche-track">
              {[
                ['🏋️', 'Fitness'], ['👗', 'Moda'], ['🍕', 'Gastronomia'], ['💰', 'Finanças'],
                ['🏠', 'Imóveis'], ['💆', 'Beleza'], ['📚', 'Educação'], ['🛒', 'E-commerce'],
                ['🏋️', 'Fitness'], ['👗', 'Moda'], ['🍕', 'Gastronomia'], ['💰', 'Finanças'],
                ['🏠', 'Imóveis'], ['💆', 'Beleza'], ['📚', 'Educação'], ['🛒', 'E-commerce'],
              ].map(([icon, label], i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 28px', background: 'rgba(255,255,255,0.04)', borderRadius: 999, border: '1px solid rgba(255,255,255,0.07)', color: '#94a3b8', fontSize: 14, fontWeight: 600, flexShrink: 0 }}>
                  <span>{icon}</span>{label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── DOR ─── */}
      <section style={{ padding: isMobile ? '64px 20px' : '100px 24px', background: '#0a0a0f' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ fontSize: isMobile ? 28 : isTablet ? 36 : 44, fontWeight: 900, textAlign: 'center', marginBottom: 16, letterSpacing: -1 }}>
            Você posta… mas o Instagram não cresce?
          </h2>
          <p style={{ color: '#94a3b8', textAlign: 'center', fontSize: isMobile ? 15 : 17, lineHeight: 1.7, marginBottom: 48, maxWidth: 640, margin: '0 auto 48px' }}>
            Você passa horas pensando no que publicar. Perde tempo criando artes. Fica sem ideias. E mesmo assim o perfil continua parado.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 36 }}>
            {[
              { icon: '😩', texto: 'Abrindo o Instagram sem saber o que postar', cor: '#ef4444' },
              { icon: '⏰', texto: 'Passando horas criando conteúdo que não engaja', cor: '#f97316' },
              { icon: '📉', texto: 'Vendo concorrentes crescerem enquanto você fica estagnado', cor: '#eab308' },
            ].map((item, i) => (
              <div key={i} className="card-hover" style={{
                display: 'flex', alignItems: 'center', gap: 16,
                background: `rgba(${item.cor === '#ef4444' ? '239,68,68' : item.cor === '#f97316' ? '249,115,22' : '234,179,8'},0.06)`,
                border: `1px solid rgba(${item.cor === '#ef4444' ? '239,68,68' : item.cor === '#f97316' ? '249,115,22' : '234,179,8'},0.2)`,
                borderRadius: 16, padding: isMobile ? '18px 20px' : '22px 28px',
              }}>
                <div style={{ fontSize: isMobile ? 26 : 32, flexShrink: 0 }}>{item.icon}</div>
                <p style={{ fontSize: isMobile ? 14 : 17, fontWeight: 600, color: '#e2e8f0' }}>{item.texto}</p>
                <div style={{ marginLeft: 'auto', color: item.cor, fontSize: 20, flexShrink: 0 }}>✗</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 40, padding: isMobile ? '20px 20px' : '28px 32px', background: 'rgba(255,255,255,0.03)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ color: '#94a3b8', fontSize: isMobile ? 14 : 16 }}>Enquanto isso, <strong style={{ color: '#f97316' }}>concorrentes crescem todos os dias.</strong></p>
            <p style={{ color: '#94a3b8', fontSize: isMobile ? 14 : 16 }}>O problema não é seu conteúdo. O problema é <strong style={{ color: '#e2e8f0' }}>falta de estratégia, consistência e automação.</strong></p>
            <p style={{ color: '#94a3b8', fontSize: isMobile ? 14 : 16 }}>E contratar um social media custa entre <strong style={{ color: '#ef4444' }}>R$1.000 e R$3.000 por mês.</strong></p>
            <p style={{ color: '#f48fb1', fontSize: isMobile ? 14 : 16, fontWeight: 700, marginTop: 4 }}>✦ Foi exatamente por isso que criamos o Amarants Instagrowht.</p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: 'linear-gradient(135deg, rgba(233,30,140,0.15), rgba(249,115,22,0.15))',
              border: '1px solid rgba(233,30,140,0.3)', borderRadius: 16,
              padding: isMobile ? '14px 24px' : '18px 36px', fontSize: isMobile ? 15 : 18, fontWeight: 800,
            }}>
              <span>✨</span> A solução está aqui. <span>↓</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TRANSFORMAÇÃO ─── */}
      <section style={{ padding: isMobile ? '64px 20px' : '100px 24px', background: '#0a0a0f' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: isMobile ? 26 : isTablet ? 34 : 40, fontWeight: 900, letterSpacing: -1, marginBottom: 16 }}>
            Sua marca produz conteúdo todos os dias —{' '}
            <span style={{ background: 'linear-gradient(90deg,#e91e8c,#f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              mesmo enquanto você dorme.
            </span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, margin: '40px auto', maxWidth: 560, textAlign: 'left' }}>
            {[
              'Analisa seu perfil completo',
              'Identifica melhorias na BIO',
              'Cria um plano estratégico semanal',
              'Desenvolve carrosséis com sua identidade visual',
              'Gera stories e roteiros de Reels',
              'Agenda e publica automaticamente',
              'Aprende com os resultados para melhorar cada vez mais',
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: isMobile ? '12px 16px' : '14px 20px', background: 'rgba(233,30,140,0.05)', border: '1px solid rgba(233,30,140,0.12)', borderRadius: 12 }}>
                <span style={{ color: '#22c55e', fontSize: 18, flexShrink: 0 }}>✅</span>
                <span style={{ color: '#e2e8f0', fontSize: isMobile ? 14 : 15, fontWeight: 500 }}>{item}</span>
              </div>
            ))}
          </div>
          <p style={{ color: '#64748b', fontSize: 15, fontStyle: 'italic' }}>
            Tudo isso sem precisar contratar equipe, designer ou social media.
          </p>
        </div>
      </section>

      {/* ─── SOLUÇÃO ─── */}
      <section id="como-funciona" style={{ padding: isMobile ? '64px 20px' : '100px 24px', background: 'linear-gradient(180deg, #0d0d14 0%, #0a0a0f 100%)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: isMobile ? 48 : 72 }}>
            <div style={{ display: 'inline-block', background: 'rgba(233,30,140,0.12)', border: '1px solid rgba(233,30,140,0.25)', color: '#f48fb1', fontSize: 11, fontWeight: 800, padding: '5px 14px', borderRadius: 999, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: 16 }}>
              Como funciona
            </div>
            <h2 style={{ fontSize: isMobile ? 28 : isTablet ? 36 : 44, fontWeight: 900, letterSpacing: -1, marginBottom: 16 }}>
              Crescer no Instagram{' '}
              <span style={{ background: 'linear-gradient(90deg,#e91e8c,#f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                nunca foi tão simples
              </span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : '1fr 1fr', gap: 16 }}>
            {[
              { n: '01', icon: '🔗', titulo: 'Conecte seu Instagram', desc: 'A plataforma analisa seu perfil automaticamente.' },
              { n: '02', icon: '🎨', titulo: 'Personalize sua marca', desc: 'Adicione sua logo e paleta de cores.' },
              { n: '03', icon: '🧠', titulo: 'A IA cria sua estratégia', desc: 'Receba conteúdos personalizados para seu nicho.' },
              { n: '04', icon: '✅', titulo: 'Aprove ou automatize', desc: 'O sistema agenda e publica nos melhores horários.' },
              { n: '05', icon: '📈', titulo: 'Veja seu perfil evoluir', desc: 'Mais consistência, mais autoridade e mais alcance.' },
            ].map((step, i) => (
              <div key={i} className="card-hover" style={{
                background: '#111117', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 20, padding: isMobile ? '22px 20px' : '28px 28px',
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', top: 16, right: 20, fontSize: isMobile ? 32 : 42, fontWeight: 900, color: '#e91e8c', lineHeight: 1 }}>{step.n}</div>
                <div style={{ fontSize: 30, marginBottom: 12 }}>{step.icon}</div>
                <h3 style={{ fontSize: isMobile ? 15 : 16, fontWeight: 800, marginBottom: 8, color: '#f1f5f9', lineHeight: 1.4 }}>{step.titulo}</h3>
                <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.65 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DIFERENCIAIS ─── */}
      <section style={{ padding: isMobile ? '64px 20px' : '100px 24px', background: '#0a0a0f' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: isMobile ? 40 : 64 }}>
            <h2 style={{ fontSize: isMobile ? 26 : isTablet ? 34 : 44, fontWeight: 900, letterSpacing: -1, marginBottom: 14 }}>
              Tudo que você precisa para crescer.{' '}
              <span style={{ background: 'linear-gradient(90deg,#e91e8c,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Em um único lugar.</span>
            </h2>
            <p style={{ color: '#64748b', fontSize: isMobile ? 14 : 16 }}>Sem contratar freelancer. Sem passar horas no Canva. Sem se perguntar o que postar.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : 'repeat(3, 1fr)', gap: 16 }}>
            {[
              { icon: '🎨', titulo: 'Conteúdo com sua identidade visual', desc: 'Carrosséis profissionais usando suas cores, estilo e logo.', grad: 'linear-gradient(135deg,rgba(233,30,140,0.15),rgba(194,24,91,0.05))', borda: 'rgba(233,30,140,0.25)', icoCor: '#e91e8c' },
              { icon: '🧠', titulo: 'Inteligência Artificial Estratégica', desc: 'A IA entende seu nicho e cria conteúdos pensados para gerar engajamento.', grad: 'linear-gradient(135deg,rgba(249,115,22,0.15),rgba(220,38,38,0.05))', borda: 'rgba(249,115,22,0.25)', icoCor: '#f97316' },
              { icon: '⏰', titulo: 'Postagem automática', desc: 'Publique todos os dias sem precisar lembrar.', grad: 'linear-gradient(135deg,rgba(6,182,212,0.15),rgba(37,99,235,0.05))', borda: 'rgba(6,182,212,0.25)', icoCor: '#06b6d4' },
              { icon: '📈', titulo: 'Crescimento inteligente', desc: 'Análises semanais que mostram o que funciona e o que deve melhorar.', grad: 'linear-gradient(135deg,rgba(34,197,94,0.15),rgba(13,148,136,0.05))', borda: 'rgba(34,197,94,0.25)', icoCor: '#22c55e' },
              { icon: '🎬', titulo: 'Reels profissionais sob demanda', desc: 'Roteiros prontos e produção profissional por apenas R$49.', grad: 'linear-gradient(135deg,rgba(236,72,153,0.15),rgba(233,30,140,0.05))', borda: 'rgba(236,72,153,0.25)', icoCor: '#ec4899' },
              { icon: '🎯', titulo: 'BIO Otimizada', desc: 'IA reescreve sua BIO com palavras-chave e CTA para converter mais visitas.', grad: 'linear-gradient(135deg,rgba(59,130,246,0.15),rgba(99,102,241,0.05))', borda: 'rgba(59,130,246,0.25)', icoCor: '#3b82f6' },
            ].map((card, i) => (
              <div key={i} className="card-hover" style={{ background: card.grad, border: `1px solid ${card.borda}`, borderRadius: 20, padding: isMobile ? '22px 18px' : '28px 24px' }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: `rgba(${card.icoCor === '#e91e8c' ? '233,30,140' : card.icoCor === '#f97316' ? '249,115,22' : card.icoCor === '#06b6d4' ? '6,182,212' : card.icoCor === '#22c55e' ? '34,197,94' : card.icoCor === '#ec4899' ? '236,72,153' : '59,130,246'},0.15)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 14 }}>{card.icon}</div>
                <h3 style={{ fontSize: isMobile ? 15 : 16, fontWeight: 800, marginBottom: 8, color: '#f1f5f9' }}>{card.titulo}</h3>
                <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── COMPARATIVO ─── */}
      <section style={{ padding: isMobile ? '64px 20px' : '100px 24px', background: '#0a0a0f' }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <h2 style={{ fontSize: isMobile ? 24 : isTablet ? 30 : 38, fontWeight: 900, textAlign: 'center', letterSpacing: -1, marginBottom: 12 }}>
            Por que pagar milhares por algo que agora{' '}
            <span style={{ background: 'linear-gradient(90deg,#e91e8c,#f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              custa menos de R$4 por dia?
            </span>
          </h2>
          <p style={{ color: '#64748b', textAlign: 'center', fontSize: 15, marginBottom: 40 }}>Você centraliza tudo em uma única plataforma inteligente.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: 'Social Media Freelancer', preco: 'R$1.000 — R$3.000/mês', cor: '#ef4444', bg: 'rgba(239,68,68,0.06)', borda: 'rgba(239,68,68,0.2)' },
              { label: 'Canva + Buffer + ferramentas separadas', preco: 'R$300+/mês', cor: '#f97316', bg: 'rgba(249,115,22,0.06)', borda: 'rgba(249,115,22,0.2)' },
              { label: 'Amarants Instagrowht', preco: 'A partir de R$97/mês', cor: '#22c55e', bg: 'rgba(34,197,94,0.08)', borda: 'rgba(34,197,94,0.3)' },
            ].map((row, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: isMobile ? 'flex-start' : 'center',
                justifyContent: 'space-between',
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? 8 : 0,
                padding: isMobile ? '16px 18px' : '20px 28px',
                background: row.bg, border: `1px solid ${row.borda}`, borderRadius: 14,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 18 }}>{i === 2 ? '✅' : '❌'}</span>
                  <span style={{ fontSize: isMobile ? 14 : 15, fontWeight: 600, color: i === 2 ? '#e2e8f0' : '#94a3b8' }}>{row.label}</span>
                </div>
                <span style={{ fontSize: isMobile ? 14 : 15, fontWeight: 800, color: row.cor, flexShrink: 0, paddingLeft: isMobile ? 30 : 0 }}>{row.preco}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── AUTORIDADE ─── */}
      <section style={{ padding: isMobile ? '64px 20px' : '100px 24px', background: 'linear-gradient(135deg, #120820 0%, #0a0a0f 60%, #001020 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(233,30,140,0.06) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <h2 style={{ fontSize: isMobile ? 30 : isTablet ? 36 : 44, fontWeight: 900, letterSpacing: -1, marginBottom: 14 }}>
            O Instagram mudou.
          </h2>
          <p style={{ fontSize: isMobile ? 16 : 20, fontWeight: 700, color: '#f48fb1', marginBottom: isMobile ? 36 : 56 }}>
            Quem cresce hoje usa estratégia + automação.
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: isMobile ? 36 : 56 }}>
            {[
              { frase: 'Consistência vence talento.', cor: '#e91e8c', bg: 'rgba(233,30,140,0.1)', borda: 'rgba(233,30,140,0.25)' },
              { frase: 'Frequência gera autoridade.', cor: '#f97316', bg: 'rgba(249,115,22,0.1)', borda: 'rgba(249,115,22,0.25)' },
              { frase: 'IA acelera resultados.', cor: '#06b6d4', bg: 'rgba(6,182,212,0.1)', borda: 'rgba(6,182,212,0.25)' },
            ].map((item, i) => (
              <div key={i} style={{ padding: isMobile ? '14px 20px' : '20px 32px', background: item.bg, border: `1px solid ${item.borda}`, borderRadius: 16, flex: '1', minWidth: isMobile ? '100%' : 200 }}>
                <p style={{ fontSize: isMobile ? 15 : 18, fontWeight: 800, color: item.cor, margin: 0 }}>"{item.frase}"</p>
              </div>
            ))}
          </div>

          <p style={{ color: '#94a3b8', fontSize: isMobile ? 14 : 16, lineHeight: 1.8, maxWidth: 620, margin: '0 auto' }}>
            O Amarants Instagrowht foi criado para transformar qualquer perfil em uma presença digital forte —{' '}
            <strong style={{ color: '#e2e8f0' }}>mesmo começando do zero.</strong>
          </p>
        </div>
      </section>

      {/* ─── PLANOS ─── */}
      <section id="planos" style={{ padding: isMobile ? '64px 20px' : '100px 24px', background: 'linear-gradient(180deg, #0d0d14 0%, #0a0a0f 100%)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: isMobile ? 36 : 56 }}>
            <h2 style={{ fontSize: isMobile ? 28 : isTablet ? 36 : 44, fontWeight: 900, letterSpacing: -1, marginBottom: 14 }}>
              Escolha como você quer crescer
            </h2>
            <p style={{ color: '#64748b', fontSize: 16, marginBottom: 28 }}>Sem letras miúdas. Cancele quando quiser.</p>

            {/* Toggle */}
            <div style={{ display: 'inline-flex', alignItems: 'center', background: '#111117', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 4 }}>
              {(['mensal', 'anual'] as const).map((p) => (
                <button key={p} onClick={() => setPeriodo(p)} style={{
                  padding: isMobile ? '9px 18px' : '9px 24px', borderRadius: 9, border: 'none',
                  background: periodo === p ? 'linear-gradient(135deg,#e91e8c,#c2185b)' : 'transparent',
                  color: periodo === p ? '#fff' : '#64748b',
                  fontWeight: 700, fontSize: 14, cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif', transition: 'all 0.22s',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  {p === 'mensal' ? 'Mensal' : (
                    <>Anual <span style={{ background: '#22c55e', color: '#fff', fontSize: 10, fontWeight: 800, padding: '2px 7px', borderRadius: 999 }}>15% OFF</span></>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: 20,
            alignItems: 'stretch',
          }}>

            {/* Essencial */}
            <div className="card-hover" style={{
              flex: 1, background: '#111117',
              border: '1px solid rgba(233,30,140,0.2)',
              borderRadius: 24, padding: isMobile ? '28px 24px' : '36px 32px',
            }}>
              <div style={{ display: 'inline-block', background: 'rgba(233,30,140,0.1)', border: '1px solid rgba(233,30,140,0.25)', color: '#f48fb1', fontSize: 10, fontWeight: 800, padding: '4px 12px', borderRadius: 999, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20 }}>
                Para começar
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 900, marginBottom: 8 }}>Essencial</h3>
              <p style={{ color: '#64748b', fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>Ideal para quem quer criar conteúdo estratégico com IA.</p>

              <div style={{ marginBottom: 8 }}>
                <span style={{ fontSize: 44, fontWeight: 900, color: '#fff' }}>
                  {periodo === 'mensal' ? 'R$97' : 'R$82'}
                </span>
                <span style={{ color: '#64748b', fontSize: 15 }}>/mês</span>
              </div>
              {periodo === 'anual' && (
                <div style={{ marginBottom: 8 }}>
                  <span style={{ color: '#64748b', fontSize: 13 }}>cobrado R$984/ano </span>
                  <span style={{ background: 'rgba(34,197,94,0.12)', color: '#22c55e', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999 }}>🎉 Economize R$180</span>
                </div>
              )}

              <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '20px 0' }} />

              <ul style={{ listStyle: 'none', marginBottom: 28 }}>
                {[
                  [true,  'Análise de perfil com IA'],
                  [true,  'Plano estratégico semanal'],
                  [true,  'Carrosséis gerados por IA (4/mês)'],
                  [true,  'Dashboard de métricas'],
                  [false, 'Postagem automática'],
                  [false, 'Stories automáticos'],
                  [false, 'Roteiros de Reels'],
                  [false, 'Suporte prioritário'],
                ].map(([ok, label], i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 11, color: ok ? '#e2e8f0' : '#374151', fontSize: 14 }}>
                    <span style={{ color: ok ? '#22c55e' : '#374151', fontWeight: 700, flexShrink: 0 }}>{ok ? '✅' : '❌'}</span>
                    {String(label)}
                  </li>
                ))}
              </ul>

              <button className="btn-outline-purple" style={{ width: '100%', padding: '14px', fontSize: 15, borderRadius: 12, fontFamily: 'Inter, sans-serif' }}
                onClick={() => handleCheckout('essencial')}>
                Assinar Essencial →
              </button>
            </div>

            {/* Automático */}
            <div className="card-hover" style={{
              flex: 1, position: 'relative', overflow: 'hidden',
              background: 'linear-gradient(160deg, #1a0a2e 0%, #111117 60%)',
              border: '2px solid transparent',
              borderRadius: 24, padding: isMobile ? '36px 24px 28px' : '36px 32px',
              backgroundClip: 'padding-box',
              boxShadow: '0 0 0 2px rgba(233,30,140,0.5), 0 0 60px rgba(233,30,140,0.1)',
            }}>
              <div style={{ position: 'absolute', top: -1, left: '50%', transform: 'translateX(-50%)' }}>
                <div style={{ background: 'linear-gradient(90deg,#e91e8c,#f97316)', color: '#fff', fontSize: 11, fontWeight: 800, padding: '4px 20px', borderRadius: '0 0 12px 12px', letterSpacing: 1 }}>
                  ✦ MAIS POPULAR
                </div>
              </div>

              <div style={{ display: 'inline-block', background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.3)', color: '#fb923c', fontSize: 10, fontWeight: 800, padding: '4px 12px', borderRadius: 999, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20, marginTop: 12 }}>
                Crescimento total
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 900, marginBottom: 8 }}>Automático</h3>
              <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>O Instagram praticamente roda sozinho.</p>

              <div style={{ marginBottom: 8 }}>
                <span style={{
                  fontSize: 44, fontWeight: 900,
                  background: 'linear-gradient(90deg,#e91e8c,#f97316)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>
                  {periodo === 'mensal' ? 'R$197' : 'R$167'}
                </span>
                <span style={{ color: '#64748b', fontSize: 15 }}>/mês</span>
              </div>
              {periodo === 'anual' && (
                <div style={{ marginBottom: 8 }}>
                  <span style={{ color: '#64748b', fontSize: 13 }}>cobrado R$2.004/ano </span>
                  <span style={{ background: 'rgba(34,197,94,0.12)', color: '#22c55e', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999 }}>🎉 Economize R$360</span>
                </div>
              )}

              <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '20px 0' }} />

              <ul style={{ listStyle: 'none', marginBottom: 28 }}>
                {[
                  'Tudo do Essencial',
                  'Carrosséis ilimitados',
                  'Postagem automática ativa',
                  'Stories automáticos semanais',
                  'Roteiros de Reels completos',
                  'BIO otimizada pela IA',
                  'Análise semanal aprofundada',
                  'Suporte prioritário por WhatsApp',
                ].map((label, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 11, color: '#e2e8f0', fontSize: 14 }}>
                    <span style={{ color: '#22c55e', flexShrink: 0 }}>✅</span>
                    {label}
                  </li>
                ))}
              </ul>

              <button className="btn-primary" style={{ width: '100%', padding: '15px', fontSize: isMobile ? 13 : 13, borderRadius: 12, letterSpacing: 0.5 }}
                onClick={() => handleCheckout('automatico')}>
                QUERO AUTOMATIZAR MEU INSTAGRAM
              </button>
            </div>
          </div>

          <p style={{ textAlign: 'center', color: '#475569', fontSize: 13, marginTop: 24 }}>
            🔒 Pagamento seguro via Stripe&nbsp;&nbsp;|&nbsp;&nbsp;Cancele quando quiser&nbsp;&nbsp;|&nbsp;&nbsp;Acesso imediato
          </p>
        </div>
      </section>

      {/* ─── QUEBRA DE OBJEÇÕES ─── */}
      <section style={{ padding: isMobile ? '64px 20px' : '100px 24px', background: '#0a0a0f' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{ fontSize: isMobile ? 28 : isTablet ? 36 : 44, fontWeight: 900, textAlign: 'center', letterSpacing: -1, marginBottom: 48 }}>
            Ainda tem dúvidas?
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {[
              {
                objecao: 'Mas eu não sei criar conteúdo…',
                resposta: 'Você não precisa. A IA faz o planejamento, cria os conteúdos e ainda sugere melhorias estratégicas para seu perfil.',
                cor: '#e91e8c', bg: 'rgba(233,30,140,0.05)', borda: 'rgba(233,30,140,0.2)',
              },
              {
                objecao: 'Meu nicho é muito específico…',
                resposta: 'Nossa IA adapta a estratégia para qualquer nicho: empreendedores, médicos, advogados, influencers, corretores, estética, negócios locais e muito mais.',
                cor: '#f97316', bg: 'rgba(249,115,22,0.05)', borda: 'rgba(249,115,22,0.2)',
              },
              {
                objecao: 'Não tenho tempo.',
                resposta: 'Perfeito. O Amarants Instagrowht foi criado exatamente para isso.',
                cor: '#06b6d4', bg: 'rgba(6,182,212,0.05)', borda: 'rgba(6,182,212,0.2)',
              },
            ].map((item, i) => (
              <div key={i} style={{ background: item.bg, border: `1px solid ${item.borda}`, borderRadius: 18, padding: isMobile ? '20px 20px' : '28px 32px' }}>
                <p style={{ fontSize: isMobile ? 15 : 16, fontWeight: 800, color: item.cor, marginBottom: 10 }}>"{item.objecao}"</p>
                <p style={{ fontSize: isMobile ? 14 : 15, color: '#94a3b8', lineHeight: 1.7 }}>{item.resposta}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DEPOIMENTOS ─── */}
      <section id="depoimentos" style={{ padding: isMobile ? '64px 20px' : '100px 24px', background: '#0a0a0f' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: isMobile ? 40 : 64 }}>
            <h2 style={{ fontSize: isMobile ? 26 : isTablet ? 34 : 44, fontWeight: 900, letterSpacing: -1, marginBottom: 12 }}>
              Quem já está crescendo com o Amarants
            </h2>
            <p style={{ color: '#64748b', fontSize: isMobile ? 14 : 16 }}>Resultados reais de quem decidiu crescer de forma inteligente.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 18 }}>
            {[
              {
                nome: 'Mariana Costa', handle: '@marianafitness_', nicho: 'Fitness',
                cor: 'linear-gradient(135deg,#e91e8c,#c2185b)', inicial: 'M',
                texto: '"Eu ficava travada sem saber o que postar. Com o Amarants, toda semana tenho um plano pronto e os carrosséis já com minhas cores. Incrível!"',
                resultado: '+847 seguidores no 1º mês',
              },
              {
                nome: 'Ricardo Almeida', handle: '@ricardoalimentacao', nicho: 'Gastronomia',
                cor: 'linear-gradient(135deg,#f97316,#dc2626)', inicial: 'R',
                texto: '"Tentei contratar social media mas era caro demais. O Amarants faz tudo por R$97 e o resultado é profissional. Meu engajamento dobrou!"',
                resultado: '2x mais engajamento em 3 semanas',
              },
              {
                nome: 'Camila Torres', handle: '@camilatorres.moda', nicho: 'Moda',
                cor: 'linear-gradient(135deg,#06b6d4,#2563eb)', inicial: 'C',
                texto: '"Os carrosséis saem com minhas cores e minha logo. Parece que foi um designer que fez. Não largo mais!"',
                resultado: '+1.200 seguidores em 6 semanas',
              },
            ].map((t, i) => (
              <div key={i} className="card-hover" style={{ flex: 1, background: '#111117', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: isMobile ? '22px 20px' : '28px 24px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: 3, marginBottom: 14 }}>
                  {'★★★★★'.split('').map((s, j) => <span key={j} style={{ color: '#fbbf24', fontSize: 16 }}>{s}</span>)}
                </div>
                <p style={{ color: '#cbd5e1', fontSize: isMobile ? 14 : 15, lineHeight: 1.7, flex: 1, marginBottom: 18 }}>{t.texto}</p>
                <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', color: '#22c55e', fontSize: 13, fontWeight: 700, padding: '8px 14px', borderRadius: 10, marginBottom: 18, textAlign: 'center' }}>
                  📈 {t.resultado}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: t.cor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, color: '#fff', flexShrink: 0 }}>{t.inicial}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{t.nome}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{t.handle} · {t.nicho}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section style={{ padding: isMobile ? '64px 20px' : '100px 24px', background: 'linear-gradient(180deg,#0d0d14,#0a0a0f)' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <h2 style={{ fontSize: isMobile ? 28 : isTablet ? 36 : 44, fontWeight: 900, textAlign: 'center', letterSpacing: -1, marginBottom: 12 }}>
            Perguntas frequentes
          </h2>
          <p style={{ color: '#64748b', textAlign: 'center', fontSize: isMobile ? 14 : 16, marginBottom: 40 }}>Tudo que você precisa saber antes de começar.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{
                background: '#111117', border: `1px solid ${faqAberto === i ? 'rgba(233,30,140,0.35)' : 'rgba(255,255,255,0.07)'}`,
                borderRadius: 16, overflow: 'hidden', transition: 'border-color 0.2s',
              }}>
                <button onClick={() => setFaqAberto(faqAberto === i ? null : i)} style={{
                  width: '100%', background: 'none', border: 'none', padding: isMobile ? '16px 18px' : '20px 24px',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                }}>
                  <span style={{ fontSize: isMobile ? 14 : 15, fontWeight: 700, color: '#f1f5f9', textAlign: 'left', lineHeight: 1.4 }}>{faq.q}</span>
                  <span style={{
                    fontSize: 18, color: '#e91e8c', flexShrink: 0, marginLeft: 14,
                    transform: faqAberto === i ? 'rotate(45deg)' : 'rotate(0)', transition: 'transform 0.22s',
                  }}>+</span>
                </button>
                {faqAberto === i && (
                  <div style={{ padding: isMobile ? '0 18px 16px' : '0 24px 20px', color: '#94a3b8', fontSize: 14, lineHeight: 1.75 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FECHAMENTO EMOCIONAL ─── */}
      <section style={{ padding: isMobile ? '64px 20px' : '100px 24px', background: '#0a0a0f' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: isMobile ? 18 : 24, fontWeight: 700, color: '#64748b', marginBottom: 8 }}>
            Seu Instagram pode continuar parado…
          </p>
          <p style={{ fontSize: isMobile ? 22 : 28, fontWeight: 900, color: '#fff', marginBottom: 40, letterSpacing: -0.5 }}>
            Ou começar a{' '}
            <span style={{ background: 'linear-gradient(90deg,#e91e8c,#f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              trabalhar para você todos os dias.
            </span>
          </p>

          <p style={{ color: '#94a3b8', fontSize: isMobile ? 14 : 16, lineHeight: 1.8, marginBottom: 40 }}>
            A diferença entre perfis que crescem e perfis que desaparecem não é sorte.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
            {[
              { frase: 'É consistência.', cor: '#e91e8c' },
              { frase: 'É estratégia.', cor: '#f97316' },
              { frase: 'É automação.', cor: '#06b6d4' },
            ].map((item, i) => (
              <div key={i} style={{ padding: isMobile ? '12px 20px' : '14px 28px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 999 }}>
                <span style={{ fontSize: isMobile ? 15 : 18, fontWeight: 900, color: item.cor }}>{item.frase}</span>
              </div>
            ))}
          </div>

          <p style={{ color: '#e2e8f0', fontSize: isMobile ? 15 : 17, fontWeight: 600, lineHeight: 1.7 }}>
            E agora você pode ter tudo isso com{' '}
            <span style={{ background: 'linear-gradient(90deg,#e91e8c,#f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontWeight: 900 }}>
              Inteligência Artificial.
            </span>
          </p>
        </div>
      </section>

      {/* ─── CTA FINAL ─── */}
      <section style={{
        padding: isMobile ? '80px 20px' : '120px 24px',
        background: 'linear-gradient(135deg, #1a0533 0%, #0d0d14 50%, #001428 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 800, height: 800, borderRadius: '50%', background: 'radial-gradient(circle, rgba(233,30,140,0.08) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(233,30,140,0.1)', border: '1px solid rgba(233,30,140,0.25)',
            color: '#f48fb1', fontSize: 12, fontWeight: 700, padding: '6px 16px', borderRadius: 999, marginBottom: 24,
          }}>
            ✦ Mais de 2.300 perfis já crescendo
          </div>

          <h2 style={{ fontSize: isMobile ? 26 : isTablet ? 34 : 44, fontWeight: 900, lineHeight: 1.15, letterSpacing: -1, marginBottom: 18 }}>
            Comece hoje mesmo e transforme seu Instagram em uma{' '}
            <span style={{ background: 'linear-gradient(90deg,#e91e8c,#f97316,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              máquina de crescimento.
            </span>
          </h2>

          <p style={{ color: '#94a3b8', fontSize: isMobile ? 15 : 18, lineHeight: 1.7, marginBottom: 40 }}>
            Mais de 2.300 perfis já estão crescendo. Qual vai ser o seu?
          </p>

          <button
            className="btn-primary"
            style={{
              padding: isMobile ? '18px 32px' : '20px 56px',
              fontSize: isMobile ? 15 : 18,
              borderRadius: 16, letterSpacing: 1,
              animation: 'pulse-glow 2.5s ease-in-out infinite',
              width: isMobile ? '100%' : 'auto',
              justifyContent: 'center',
            }}
            onClick={() => scrollTo('planos')}>
            ASSINAR AGORA
          </button>

          <div style={{ marginTop: 36, display: 'flex', justifyContent: 'center', gap: isMobile ? 16 : 32, flexWrap: 'wrap', color: '#475569', fontSize: 13 }}>
            <span>📧 amarantsexpansaodigital@gmail.com</span>
            <span>💬 WhatsApp (62) 99327-7239</span>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{ background: '#07070d', borderTop: '1px solid rgba(255,255,255,0.05)', padding: isMobile ? '40px 20px 28px' : '48px 24px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: isMobile ? 'flex-start' : 'space-between',
            alignItems: 'flex-start',
            gap: isMobile ? 28 : 32,
            marginBottom: 36,
          }}>
            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <Image src="/Logo_amarantsGroth.png" alt="Amarants" width={0} height={0} sizes="100vw" style={{ width: 'auto', height: '44px', objectFit: 'contain' }} />
                <span style={{
                  fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
                  fontWeight: 800,
                  fontSize: '19px',
                  background: 'linear-gradient(135deg, #e91e8c 0%, #f97316 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  lineHeight: 1.18,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  height: '44px',
                }}>
                  <span>Amarants</span>
                  <span>Instagrowht</span>
                </span>
              </div>
              <p style={{ color: '#374151', fontSize: 13, maxWidth: 220, lineHeight: 1.6 }}>
                Crescimento inteligente para o seu Instagram com IA.
              </p>
            </div>
            {/* Links */}
            <div style={{ display: 'flex', gap: isMobile ? 32 : 48, flexWrap: 'wrap' }}>
              <div>
                <p style={{ color: '#fff', fontWeight: 700, fontSize: 13, marginBottom: 12 }}>Produto</p>
                {[['Como funciona', 'como-funciona'], ['Planos', 'planos']].map(([l, id]) => (
                  <p key={id} style={{ marginBottom: 10 }}>
                    <button onClick={() => scrollTo(id)} style={{ background: 'none', border: 'none', color: '#374151', fontSize: 13, cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'color 0.2s', padding: 0 }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#94a3b8')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#374151')}>
                      {l}
                    </button>
                  </p>
                ))}
              </div>
              <div>
                <p style={{ color: '#fff', fontWeight: 700, fontSize: 13, marginBottom: 12 }}>Legal</p>
                {[['Termos de Uso', `${BASE}/termos`], ['Política de Privacidade', `${BASE}/privacidade`]].map(([l, href]) => (
                  <p key={href} style={{ marginBottom: 10 }}>
                    <a href={href} style={{ color: '#374151', fontSize: 13, transition: 'color 0.2s' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#94a3b8')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#374151')}>
                      {l}
                    </a>
                  </p>
                ))}
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 20, display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', gap: 10 }}>
            <p style={{ color: '#1f2937', fontSize: 12 }}>© 2025 Amarants Expansão Digital. Todos os direitos reservados.</p>
            <p style={{ color: '#1f2937', fontSize: 12 }}>Estruturas digitais para seus negócios.</p>
          </div>
        </div>
      </footer>
    </>
  )
}
