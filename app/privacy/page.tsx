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
const EMPRESA         = 'Amarants Expansão Digital'
const APP             = 'Amarants Instagrowht'
const EMAIL           = 'amarantsexpansaodigital@gmail.com'
const WHATSAPP        = '(62) 99327-7239'

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

export default function PrivacyPage() {
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
            <h1 style={{ color: '#fff', fontWeight: 900, fontSize: '26px', margin: '0 0 8px', letterSpacing: '-0.5px' }}>Política de Privacidade</h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', margin: 0 }}>Última atualização: {DATA_ATUALIZACAO}</p>
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px 60px' }}>

          {/* Intro card */}
          <div style={{ background: S.card, border: `1px solid ${S.borda}`, borderRadius: '16px', padding: '28px 32px', marginBottom: '32px' }}>
            <p style={{ color: S.texto, fontSize: '14px', lineHeight: 1.75, margin: 0 }}>
              Esta Política de Privacidade descreve como a <strong>{EMPRESA}</strong> coleta, usa e protege
              as informações pessoais dos usuários do aplicativo <strong>{APP}</strong>. Ao utilizar nosso serviço,
              você concorda com as práticas descritas neste documento. Leia com atenção.
            </p>
          </div>

          <div style={{ background: S.card, border: `1px solid ${S.borda}`, borderRadius: '16px', padding: '32px' }}>

            <Section title="1. Dados que Coletamos">
              <P>Para fornecer nosso serviço de análise e crescimento no Instagram, coletamos as seguintes informações:</P>
              <Li><strong>Dados de cadastro:</strong> nome completo, endereço de e-mail, número de telefone e senha (armazenada de forma criptografada).</Li>
              <Li><strong>Perfil do Instagram:</strong> seu @ (arroba) do Instagram, fornecido voluntariamente por você para análise do perfil público.</Li>
              <Li><strong>Dados de uso:</strong> informações sobre como você interage com a plataforma, páginas visitadas, funcionalidades utilizadas e timestamps de acesso.</Li>
              <Li><strong>Dados de pagamento:</strong> processados diretamente pelo Stripe. Não armazenamos dados de cartão de crédito — apenas confirmações de transação e status do plano.</Li>
              <Li><strong>Conteúdo gerado:</strong> posts, roteiros, legendas e planos criados pela IA dentro da plataforma.</Li>
              <Li><strong>Dados técnicos:</strong> endereço IP, tipo de navegador, sistema operacional e cookies de sessão.</Li>
            </Section>

            <Section title="2. Como Usamos seus Dados">
              <P>Utilizamos suas informações exclusivamente para:</P>
              <Li>Criar e gerenciar sua conta na plataforma.</Li>
              <Li>Analisar seu perfil público do Instagram e gerar insights personalizados de crescimento.</Li>
              <Li>Gerar conteúdo (posts, reels, carrosséis, stories e legendas) adaptado ao seu nicho e estilo de comunicação.</Li>
              <Li>Processar pagamentos e gerenciar sua assinatura.</Li>
              <Li>Enviar comunicações relacionadas ao serviço, como confirmações de conta, notificações de plano e atualizações importantes.</Li>
              <Li>Melhorar continuamente a qualidade das análises e do conteúdo gerado pela IA.</Li>
              <Li>Cumprir obrigações legais e regulatórias aplicáveis.</Li>
              <P>Não utilizamos seus dados para fins de publicidade de terceiros ou para vender informações a outras empresas.</P>
            </Section>

            <Section title="3. Compartilhamento com Terceiros">
              <P>Para operar o serviço, utilizamos os seguintes provedores de confiança:</P>
              <Li>
                <strong>Supabase:</strong> banco de dados e autenticação. Armazena com segurança seus dados de conta, análises e conteúdo gerado.
                Política de privacidade em <a href="https://supabase.com/privacy" target="_blank" rel="noreferrer" style={{ color: S.verde2, textDecoration: 'none', fontWeight: 600 }}>supabase.com/privacy</a>.
              </Li>
              <Li>
                <strong>OpenAI:</strong> inteligência artificial responsável pela análise de perfil e geração de conteúdo.
                Seus dados de perfil e nicho são enviados à OpenAI apenas para processar suas solicitações.
                Política em <a href="https://openai.com/policies/privacy-policy" target="_blank" rel="noreferrer" style={{ color: S.verde2, textDecoration: 'none', fontWeight: 600 }}>openai.com/policies/privacy-policy</a>.
              </Li>
              <Li>
                <strong>Stripe:</strong> processamento de pagamentos. Gerencia dados de cartão de crédito com total segurança e conformidade com PCI DSS.
                Política em <a href="https://stripe.com/br/privacy" target="_blank" rel="noreferrer" style={{ color: S.verde2, textDecoration: 'none', fontWeight: 600 }}>stripe.com/br/privacy</a>.
              </Li>
              <P>Não compartilhamos suas informações com terceiros além dos descritos acima, exceto quando exigido por lei.</P>
            </Section>

            <Section title="4. Seus Direitos">
              <P>Você tem os seguintes direitos em relação aos seus dados pessoais:</P>
              <Li><strong>Acesso:</strong> solicitar uma cópia de todos os dados que temos sobre você.</Li>
              <Li><strong>Correção:</strong> solicitar a atualização de dados incorretos ou desatualizados.</Li>
              <Li><strong>Exclusão:</strong> solicitar a exclusão permanente da sua conta e de todos os dados associados.</Li>
              <Li><strong>Portabilidade:</strong> solicitar a exportação dos seus dados em formato legível por máquina.</Li>
              <Li><strong>Oposição:</strong> opor-se ao processamento dos seus dados para determinadas finalidades.</Li>
              <Li><strong>Revogação do consentimento:</strong> retirar seu consentimento a qualquer momento, o que não afeta a legalidade do processamento anterior.</Li>
              <P>Para exercer qualquer desses direitos, entre em contato pelo e-mail <a href={`mailto:${EMAIL}`} style={{ color: S.verde2, textDecoration: 'none', fontWeight: 600 }}>{EMAIL}</a>. Responderemos em até 15 dias úteis.</P>
            </Section>

            <Section title="5. Cookies e Rastreamento">
              <P>Utilizamos cookies e tecnologias similares para:</P>
              <Li><strong>Cookies de sessão:</strong> manter você autenticado durante o uso da plataforma. São essenciais para o funcionamento do serviço.</Li>
              <Li><strong>Cookies de preferências:</strong> lembrar suas configurações e personalizar sua experiência.</Li>
              <Li><strong>Cookies analíticos:</strong> entender como a plataforma é utilizada para melhorar continuamente o serviço.</Li>
              <P>Você pode configurar seu navegador para recusar cookies, mas isso pode impedir o funcionamento correto de algumas funcionalidades.</P>
            </Section>

            <Section title="6. Segurança dos Dados">
              <P>Adotamos medidas técnicas e organizacionais para proteger seus dados:</P>
              <Li>Transmissão de dados via HTTPS com certificado SSL/TLS.</Li>
              <Li>Senhas armazenadas com hash criptográfico (bcrypt).</Li>
              <Li>Acesso ao banco de dados restrito por autenticação com chaves de serviço seguras.</Li>
              <Li>Políticas de segurança em nível de linha (Row Level Security) no banco de dados, garantindo que cada usuário acesse apenas seus próprios dados.</Li>
              <Li>Monitoramento contínuo de segurança pelo provedor de infraestrutura Supabase.</Li>
              <P>Em caso de incidente de segurança que afete seus dados, notificaremos você por e-mail dentro do prazo previsto pela legislação aplicável.</P>
            </Section>

            <Section title="7. Retenção de Dados">
              <P>Mantemos seus dados enquanto sua conta estiver ativa. Após a exclusão da conta:</P>
              <Li>Dados de conta (nome, e-mail) são excluídos imediatamente.</Li>
              <Li>Conteúdo gerado e análises são excluídos em até 30 dias.</Li>
              <Li>Registros de transações financeiras são mantidos por 5 anos conforme exigência fiscal brasileira.</Li>
            </Section>

            <Section title="8. Menores de Idade">
              <P>
                O {APP} é destinado exclusivamente a usuários com 18 anos ou mais. Não coletamos intencionalmente dados
                de menores de 18 anos. Se identificarmos que um menor de idade se cadastrou, excluiremos a conta imediatamente.
                Pais ou responsáveis que identifiquem tal situação devem entrar em contato conosco imediatamente.
              </P>
            </Section>

            <Section title="9. Alterações nesta Política">
              <P>
                Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você por e-mail sobre alterações
                significativas. O uso continuado da plataforma após a notificação indica sua concordância com as mudanças.
                A data da última atualização está sempre indicada no topo deste documento.
              </P>
            </Section>

            <Section title="10. Contato">
              <P>Em caso de dúvidas, solicitações ou reclamações relacionadas à privacidade dos seus dados:</P>
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
              <a href="/privacy" style={{ color: S.verde2, textDecoration: 'none', fontWeight: 600 }}>Política de Privacidade</a>
              <a href="/terms"   style={{ color: S.muted,  textDecoration: 'none' }}>Termos de Uso</a>
              <a href="/pricing" style={{ color: S.muted,  textDecoration: 'none' }}>Planos</a>
              <a href="https://wa.me/5562993277239" target="_blank" rel="noreferrer" style={{ color: S.muted, textDecoration: 'none' }}>WhatsApp</a>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
