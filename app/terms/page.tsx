"use client"

import Image from 'next/image'

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

const DATA_ATUALIZACAO = '22 de maio de 2025'
const EMPRESA          = 'Amarants Expansão Digital'
const APP              = 'Amarants Instagrowht'
const EMAIL            = 'amarantsexpansaodigital@gmail.com'
const WHATSAPP         = '(62) 99327-7239'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '36px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
        <div style={{ width: '4px', height: '22px', background: S.verde, borderRadius: '2px', flexShrink: 0 }} />
        <h2 style={{ color: S.texto, fontWeight: 800, fontSize: '17px', margin: 0 }}>{title}</h2>
      </div>
      <div style={{ paddingLeft: '16px' }}>
        {children}
      </div>
    </div>
  )
}

function P({ children }: { children: React.ReactNode }) {
  return <p style={{ color: S.texto, fontSize: '14px', lineHeight: 1.75, margin: '0 0 12px' }}>{children}</p>
}

function Li({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '8px' }}>
      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: S.verde, flexShrink: 0, marginTop: '7px' }} />
      <span style={{ color: S.texto, fontSize: '14px', lineHeight: 1.7 }}>{children}</span>
    </div>
  )
}

function PlanBox({ nome, preco, desc, features }: { nome: string; preco: string; desc: string; features: string[] }) {
  return (
    <div style={{ background: '#f8f9fb', border: `1px solid ${S.borda}`, borderRadius: '12px', padding: '16px 20px', marginBottom: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ color: S.texto, fontWeight: 800, fontSize: '15px' }}>{nome}</span>
        <span style={{ color: S.verde, fontWeight: 900, fontSize: '15px' }}>{preco}<span style={{ color: S.muted, fontWeight: 400, fontSize: '12px' }}>/mês</span></span>
      </div>
      <p style={{ color: S.muted, fontSize: '12px', margin: '0 0 10px', lineHeight: 1.5 }}>{desc}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {features.map((f, i) => (
          <span key={i} style={{ background: 'rgba(61,184,96,0.08)', color: S.verde2, fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '20px' }}>{f}</span>
        ))}
      </div>
    </div>
  )
}

export default function TermsPage() {
  return (
    <>
      <style>{`* { box-sizing: border-box; } body { margin: 0; }`}</style>

      <div style={{ minHeight: '100vh', background: S.bg, fontFamily: 'Inter, sans-serif' }}>

        {/* Header */}
        <div style={{ background: S.side, padding: '24px 20px 32px' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', textDecoration: 'none', marginBottom: '28px' }}>
              <Image src="/logo.png" alt="Logo" width={32} height={32} style={{ borderRadius: '8px' }} />
              <div>
                <div style={{ color: '#fff', fontWeight: 900, fontSize: '12px', letterSpacing: '3px' }}>AMARANTS</div>
                <div style={{ color: S.verde, fontSize: '8px', letterSpacing: '2.5px', textTransform: 'uppercase' }}>Instagrowht</div>
              </div>
            </a>
            <div style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(61,184,96,0.12)', border: '1px solid rgba(61,184,96,0.25)', color: S.verde, fontSize: '10px', fontWeight: 800, padding: '4px 12px', borderRadius: '20px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>
              Legal
            </div>
            <h1 style={{ color: '#fff', fontWeight: 900, fontSize: '26px', margin: '0 0 8px', letterSpacing: '-0.5px' }}>Termos de Uso</h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', margin: 0 }}>Última atualização: {DATA_ATUALIZACAO}</p>
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px 60px' }}>

          {/* Intro card */}
          <div style={{ background: S.card, border: `1px solid ${S.borda}`, borderRadius: '16px', padding: '28px 32px', marginBottom: '32px' }}>
            <p style={{ color: S.texto, fontSize: '14px', lineHeight: 1.75, margin: 0 }}>
              Estes Termos de Uso regulam o acesso e uso do aplicativo <strong>{APP}</strong>, operado pela
              <strong> {EMPRESA}</strong>. Ao criar uma conta ou utilizar o serviço, você declara ter lido,
              compreendido e concordado com todos os termos abaixo. Caso não concorde, interrompa o uso imediatamente.
            </p>
          </div>

          <div style={{ background: S.card, border: `1px solid ${S.borda}`, borderRadius: '16px', padding: '32px' }}>

            <Section title="1. Descrição do Serviço">
              <P>
                O <strong>{APP}</strong> é uma plataforma de inteligência artificial voltada ao crescimento orgânico
                no Instagram. O serviço inclui:
              </P>
              <Li>Análise automatizada de perfis públicos do Instagram com geração de score e diagnóstico.</Li>
              <Li>Criação de planos estratégicos de conteúdo personalizados por nicho e perfil.</Li>
              <Li>Geração de posts, reels, carrosséis, stories, legendas e hashtags com IA.</Li>
              <Li>Calendário editorial automatizado com agendamento de publicações.</Li>
              <Li>Brand Kit para armazenar identidade visual, tom de voz e diretrizes de marca.</Li>
              <P>
                O serviço utiliza a API da OpenAI (GPT-4o) para análise e geração de conteúdo. Os resultados
                são sugestões baseadas em IA e não constituem garantia de resultados de crescimento.
              </P>
            </Section>

            <Section title="2. Cadastro e Responsabilidades do Usuário">
              <P>Para utilizar o {APP}, você deve:</P>
              <Li>Ter no mínimo 18 anos de idade.</Li>
              <Li>Fornecer informações verdadeiras, precisas e atualizadas no cadastro.</Li>
              <Li>Manter a confidencialidade da sua senha e não compartilhá-la com terceiros.</Li>
              <Li>Notificar imediatamente a {EMPRESA} em caso de uso não autorizado da sua conta.</Li>
              <Li>Ser o legítimo proprietário ou ter autorização para usar o perfil do Instagram informado.</Li>
              <P>
                Você é integralmente responsável por todas as atividades realizadas com sua conta. A {EMPRESA}
                não se responsabiliza por acessos não autorizados decorrentes de negligência do usuário na guarda de suas credenciais.
              </P>
            </Section>

            <Section title="3. Planos e Pagamentos">
              <P>O {APP} oferece os seguintes planos de assinatura mensais:</P>

              <PlanBox
                nome="Starter"
                preco="R$ 99"
                desc="Para quem está começando a crescer no Instagram"
                features={['50 posts/mês', 'Calendário editorial', 'Brand Kit', 'Geração manual']}
              />
              <PlanBox
                nome="Pro"
                preco="R$ 197"
                desc="Para criadores e negócios que levam o Instagram a sério"
                features={['200 posts/mês', 'Geração de imagens', 'Brand Kit', 'Suporte prioritário']}
              />
              <PlanBox
                nome="Business"
                preco="R$ 397"
                desc="Para agências e profissionais que gerenciam múltiplas contas"
                features={['Ilimitado', 'Múltiplas marcas', 'API access', 'Suporte dedicado']}
              />

              <P>Também está disponível um <strong>Plano Grátis</strong> com acesso limitado (5 posts/mês) sem necessidade de cartão de crédito.</P>
              <P>Os pagamentos são processados mensalmente via cartão de crédito pelo Stripe. A cobrança ocorre no dia do cadastro e se repete mensalmente na mesma data. Preços podem ser reajustados com aviso prévio de 30 dias por e-mail.</P>
            </Section>

            <Section title="4. Cancelamento e Política de Reembolso">
              <P><strong>Garantia de 7 dias:</strong> caso não esteja satisfeito com o serviço, você pode solicitar reembolso integral dentro de 7 (sete) dias corridos após a primeira contratação de qualquer plano pago. Após esse prazo, não haverá reembolso.</P>
              <Li>Para solicitar reembolso dentro do prazo, envie e-mail para <a href={`mailto:${EMAIL}`} style={{ color: S.verde2, textDecoration: 'none', fontWeight: 600 }}>{EMAIL}</a> com o título "REEMBOLSO".</Li>
              <Li>O cancelamento pode ser feito a qualquer momento pelo painel da conta ou pelo e-mail acima.</Li>
              <Li>Ao cancelar, o acesso ao plano pago permanece ativo até o fim do período já pago.</Li>
              <Li>Não há cobrança de multa ou taxa de cancelamento.</Li>
              <Li>O reembolso é processado em até 10 dias úteis pelo Stripe, podendo aparecer na fatura do cartão em até 2 ciclos de cobrança, a depender do banco emissor.</Li>
            </Section>

            <Section title="5. Propriedade Intelectual">
              <P>
                Todo o conteúdo da plataforma — interface, código-fonte, marca, logotipo, textos institucionais e metodologia —
                é de propriedade exclusiva da {EMPRESA} e protegido pelas leis de propriedade intelectual brasileiras.
              </P>
              <P>
                O conteúdo gerado pela IA (posts, roteiros, legendas, hashtags) para o seu perfil é de sua propriedade
                após ser gerado. Você pode utilizá-lo livremente em suas redes sociais sem necessidade de atribuição.
              </P>
              <P>
                É proibido copiar, redistribuir, vender ou criar obras derivadas da plataforma sem autorização expressa e por escrito da {EMPRESA}.
              </P>
            </Section>

            <Section title="6. Limitação de Responsabilidade">
              <P>A {EMPRESA} não se responsabiliza por:</P>
              <Li>Resultados de crescimento específicos no Instagram, uma vez que o algoritmo da plataforma é controlado pela Meta e está sujeito a mudanças.</Li>
              <Li>Perdas de seguidores, alcance ou engajamento decorrentes de mudanças no algoritmo do Instagram.</Li>
              <Li>Suspensão ou banimento de conta do Instagram por violação dos termos da Meta, ainda que o conteúdo tenha sido gerado pelo {APP}.</Li>
              <Li>Interrupções temporárias do serviço por manutenção, falhas técnicas ou indisponibilidade de serviços terceiros (OpenAI, Supabase, Stripe).</Li>
              <Li>Danos indiretos, especiais ou consequenciais decorrentes do uso ou impossibilidade de uso do serviço.</Li>
              <P>
                A responsabilidade máxima da {EMPRESA} em qualquer circunstância é limitada ao valor pago pelo usuário
                nos últimos 3 meses de assinatura.
              </P>
            </Section>

            <Section title="7. Uso Aceitável da Plataforma">
              <P>Ao utilizar o {APP}, você concorda em NÃO:</P>
              <Li>Usar o serviço para criar ou disseminar conteúdo falso, enganoso, difamatório, discriminatório ou que viole direitos de terceiros.</Li>
              <Li>Tentar acessar contas de outros usuários ou sistemas internos da plataforma.</Li>
              <Li>Usar ferramentas automatizadas para scraping, sobrecarga ou abuso da plataforma.</Li>
              <Li>Revender, sublicenciar ou comercializar o acesso ao {APP} sem autorização prévia.</Li>
              <Li>Usar o serviço para atividades ilegais conforme a legislação brasileira.</Li>
              <Li>Compartilhar conteúdo que infrinja direitos autorais, marcas registradas ou outros direitos de propriedade intelectual.</Li>
              <P>
                A {EMPRESA} reserva-se o direito de suspender ou encerrar contas que violem estas regras, sem aviso
                prévio e sem direito a reembolso.
              </P>
            </Section>

            <Section title="8. Rescisão de Conta">
              <P>A conta pode ser encerrada:</P>
              <Li><strong>Pelo usuário:</strong> a qualquer momento, via painel de configurações ou por e-mail, sem necessidade de justificativa.</Li>
              <Li><strong>Pela {EMPRESA}:</strong> em caso de violação destes Termos, atividade fraudulenta, uso abusivo da plataforma ou inadimplência após aviso de 5 dias úteis.</Li>
              <P>Após a rescisão, todos os dados da conta serão excluídos conforme nossa Política de Privacidade. Dados de transações financeiras são mantidos pelo prazo legal de 5 anos.</P>
            </Section>

            <Section title="9. Alterações nos Termos">
              <P>
                Podemos modificar estes Termos de Uso a qualquer momento. Alterações significativas serão comunicadas por
                e-mail com antecedência mínima de 15 dias. O uso continuado do serviço após a vigência das alterações
                constitui aceite dos novos termos.
              </P>
            </Section>

            <Section title="10. Lei Aplicável e Foro">
              <P>
                Estes Termos são regidos pelas leis da República Federativa do Brasil, em especial pelo Código de Defesa
                do Consumidor (Lei 8.078/90), a Lei Geral de Proteção de Dados (Lei 13.709/18 — LGPD) e o Marco Civil
                da Internet (Lei 12.965/14).
              </P>
              <P>
                Fica eleito o foro da comarca de Goiânia/GO para dirimir quaisquer controvérsias decorrentes destes Termos,
                com renúncia a qualquer outro, por mais privilegiado que seja.
              </P>
            </Section>

            <Section title="11. Contato">
              <P>Dúvidas, solicitações ou reclamações relacionadas a estes Termos:</P>
              <div style={{ background: '#f8f9fb', borderRadius: '12px', padding: '20px 24px', marginTop: '4px' }}>
                <div style={{ fontWeight: 800, color: S.texto, marginBottom: '10px', fontSize: '14px' }}>{EMPRESA}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <a href={`mailto:${EMAIL}`} style={{ color: S.verde2, fontSize: '14px', textDecoration: 'none', fontWeight: 600 }}>✉️ {EMAIL}</a>
                  <a href="https://wa.me/5562993277239" target="_blank" rel="noreferrer" style={{ color: S.verde2, fontSize: '14px', textDecoration: 'none', fontWeight: 600 }}>💬 WhatsApp: {WHATSAPP}</a>
                </div>
              </div>
            </Section>

          </div>

          {/* Footer links */}
          <div style={{ textAlign: 'center', marginTop: '40px', paddingTop: '24px', borderTop: `1px solid ${S.borda}`, color: S.muted, fontSize: '12px' }}>
            <div style={{ marginBottom: '10px' }}>{EMPRESA} · {APP}</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
              <a href="/privacy" style={{ color: S.muted,  textDecoration: 'none' }}>Política de Privacidade</a>
              <a href="/terms"   style={{ color: S.verde2, textDecoration: 'none', fontWeight: 600 }}>Termos de Uso</a>
              <a href="/pricing" style={{ color: S.muted,  textDecoration: 'none' }}>Planos</a>
              <a href="https://wa.me/5562993277239" target="_blank" rel="noreferrer" style={{ color: S.muted, textDecoration: 'none' }}>WhatsApp</a>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
