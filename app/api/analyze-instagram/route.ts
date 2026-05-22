import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@supabase/supabase-js'

const getOpenAI   = () => new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const getSupabase = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { userId, instagram_handle, nicho } = await request.json()

    if (!userId) {
      return NextResponse.json({ success: false, error: 'userId obrigatório' }, { status: 400 })
    }

    const handle   = (instagram_handle || '').replace('@', '').trim() || 'perfil'
    const nichoStr = nicho || 'negócios/empreendedorismo'

    const prompt = `
Você é um especialista sênior em crescimento orgânico no Instagram com 10 anos de experiência, tendo ajudado mais de 500 perfis a crescerem de forma consistente e sustentável.

Analise o perfil do Instagram: @${handle}
Nicho declarado: ${nichoStr}

Gere uma análise PROFUNDA, DETALHADA e PERSONALIZADA. Seja extremamente específico — use exemplos reais de conteúdo, hashtags reais do nicho, horários baseados em dados reais do público brasileiro no Instagram.

RETORNE APENAS um JSON válido com esta estrutura exata (sem comentários, sem markdown):
{
  "score": <número entre 40 e 85>,
  "pontos_fortes": [
    "<ponto forte específico e técnico 1>",
    "<ponto forte específico e técnico 2>",
    "<ponto forte específico e técnico 3>"
  ],
  "pontos_fracos": [
    "<ponto fraco específico e técnico 1>",
    "<ponto fraco específico e técnico 2>",
    "<ponto fraco específico e técnico 3>"
  ],
  "risco_shadowban": "<baixo | médio | alto>",
  "frequencia_atual": "<estimativa como '2-3x por semana' ou 'irregular'>",
  "engajamento_estimado": "<estimativa como '1.8%' ou '3.2%'>",
  "plano_acao": {
    "diagnostico": {
      "posicionamento": "<como o perfil se posiciona no mercado — seja específico sobre autoridade, diferencial e proposta de valor>",
      "publico_ideal": "<descrição detalhada do público-alvo ideal: faixa etária, interesses, dores e desejos para o nicho ${nichoStr}>",
      "tom_de_voz": "<tom e estilo de comunicação recomendado — ex: educativo e inspirador, direto e irreverente, etc.>",
      "principal_oportunidade": "<a maior oportunidade de crescimento não aproveitada — específica e acionável>"
    },
    "meta_30_dias": "<meta realista — ex: +500 seguidores orgânicos e taxa de engajamento acima de 3%>",
    "meta_60_dias": "<meta cumulativa realista>",
    "meta_90_dias": "<meta cumulativa realista>",
    "frequencia_ideal": "<ex: 5x por semana>",
    "melhores_horarios": ["<horário 1>", "<horário 2>", "<horário 3>"],
    "mix_conteudo": {
      "Reels": <porcentagem inteira>,
      "Carrosséis": <porcentagem inteira>,
      "Posts": <porcentagem inteira>,
      "Stories": <porcentagem inteira>
    },
    "primeiros_7_dias": [
      {
        "dia": "Segunda-feira",
        "tipo": "Reel",
        "tema": "<tema específico e criativo para o nicho ${nichoStr}>",
        "horario": "<horário baseado em dados reais do público brasileiro>",
        "gancho": "<frase de abertura impactante que para o scroll — máximo 10 palavras>",
        "roteiro": "<roteiro completo: intro (0-3s), desenvolvimento (3-20s), CTA (20-30s) — o que dizer e mostrar em cada parte>",
        "legenda": "<legenda completa com emojis, quebras de linha e CTA — pronta para copiar e colar>",
        "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3", "#hashtag4", "#hashtag5", "#hashtag6", "#hashtag7", "#hashtag8", "#hashtag9", "#hashtag10"],
        "dica_execucao": "<dica prática e específica de como produzir este conteúdo com qualidade>"
      },
      {
        "dia": "Terça-feira",
        "tipo": "Carrossel",
        "tema": "<tema específico para ${nichoStr}>",
        "horario": "<horário>",
        "gancho": "<frase de abertura para o slide 1>",
        "roteiro": "<roteiro slide por slide — Slide 1: ..., Slide 2: ..., Slide 3: ..., Slide final (CTA): ...>",
        "legenda": "<legenda completa com CTA>",
        "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3", "#hashtag4", "#hashtag5", "#hashtag6", "#hashtag7", "#hashtag8", "#hashtag9", "#hashtag10"],
        "dica_execucao": "<dica prática de design e execução para o carrossel>"
      },
      {
        "dia": "Quarta-feira",
        "tipo": "Story",
        "tema": "<tema específico>",
        "horario": "<horário>",
        "gancho": "<primeira frase do story>",
        "roteiro": "<roteiro dos stories — Story 1: ..., Story 2: ..., Story 3: ... (com stickers, enquetes, CTAs recomendados)>",
        "legenda": "<texto de acompanhamento se houver>",
        "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3", "#hashtag4", "#hashtag5"],
        "dica_execucao": "<dica de como usar stickers e recursos interativos>"
      },
      {
        "dia": "Quinta-feira",
        "tipo": "Carrossel",
        "tema": "<tema específico>",
        "horario": "<horário>",
        "gancho": "<frase de abertura>",
        "roteiro": "<roteiro slide por slide>",
        "legenda": "<legenda completa>",
        "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3", "#hashtag4", "#hashtag5", "#hashtag6", "#hashtag7", "#hashtag8", "#hashtag9", "#hashtag10"],
        "dica_execucao": "<dica prática>"
      },
      {
        "dia": "Sexta-feira",
        "tipo": "Reel",
        "tema": "<tema específico>",
        "horario": "<horário>",
        "gancho": "<frase de abertura>",
        "roteiro": "<roteiro completo>",
        "legenda": "<legenda completa>",
        "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3", "#hashtag4", "#hashtag5", "#hashtag6", "#hashtag7", "#hashtag8", "#hashtag9", "#hashtag10"],
        "dica_execucao": "<dica prática>"
      },
      {
        "dia": "Sábado",
        "tipo": "Post",
        "tema": "<tema específico>",
        "horario": "<horário>",
        "gancho": "<frase de abertura>",
        "roteiro": "<descrição da imagem/composição e o que comunicar visualmente>",
        "legenda": "<legenda completa>",
        "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3", "#hashtag4", "#hashtag5", "#hashtag6", "#hashtag7", "#hashtag8", "#hashtag9", "#hashtag10"],
        "dica_execucao": "<dica de fotografia ou design>"
      },
      {
        "dia": "Domingo",
        "tipo": "Reel",
        "tema": "<tema específico>",
        "horario": "<horário>",
        "gancho": "<frase de abertura>",
        "roteiro": "<roteiro completo>",
        "legenda": "<legenda completa>",
        "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3", "#hashtag4", "#hashtag5", "#hashtag6", "#hashtag7", "#hashtag8", "#hashtag9", "#hashtag10"],
        "dica_execucao": "<dica prática>"
      }
    ],
    "dicas_extras": [
      "<dica estratégica avançada 1 — específica para ${nichoStr}>",
      "<dica estratégica avançada 2>",
      "<dica estratégica avançada 3>",
      "<dica estratégica avançada 4>",
      "<dica estratégica avançada 5>"
    ],
    "guia_execucao": {
      "Reel": "<guia completo: duração ideal (15-30s), estrutura (gancho/desenvolvimento/CTA), dicas de edição, trilha sonora, como filmar — tudo específico para ${nichoStr}>",
      "Carrossel": "<guia completo: número de slides (7-10), design do slide 1 para salvar, copywriting de cada slide, como terminar com CTA forte — específico para ${nichoStr}>",
      "Post": "<guia completo: composição visual, paleta de cores, copywriting da legenda, uso de CTAs — específico para ${nichoStr}>",
      "Story": "<guia completo: sequência de 3-5 stories, uso de enquetes e caixas de perguntas, como criar proximidade, como vender sem parecer invasivo>"
    },
    "estrategia_hashtags": {
      "grandes": ["<hashtag grande com 1M+ posts 1>", "<hashtag grande 2>", "<hashtag grande 3>", "<hashtag grande 4>", "<hashtag grande 5>"],
      "medias": ["<hashtag média 100k-1M posts 1>", "<hashtag média 2>", "<hashtag média 3>", "<hashtag média 4>", "<hashtag média 5>"],
      "nicho": ["<hashtag de nicho <100k posts 1>", "<hashtag de nicho 2>", "<hashtag de nicho 3>", "<hashtag de nicho 4>", "<hashtag de nicho 5>"]
    },
    "plano_engajamento": [
      "<ação concreta de engajamento 1 — ex: comentar em 10 perfis do nicho por dia durante 30 min>",
      "<ação de engajamento 2>",
      "<ação de engajamento 3>",
      "<ação de engajamento 4>",
      "<ação de engajamento 5>"
    ],
    "metas_semanais": [
      { "semana": "Semana 1", "meta": "<meta quantitativa específica — ex: +150 seguidores, 3 posts publicados>", "foco": "<foco principal da semana — ex: Estabelecer consistência e base de conteúdo>" },
      { "semana": "Semana 2", "meta": "<meta quantitativa>", "foco": "<foco — ex: Aumentar alcance com Reels virais>" },
      { "semana": "Semana 3", "meta": "<meta quantitativa>", "foco": "<foco — ex: Engajar comunidade e gerar relacionamento>" },
      { "semana": "Semana 4", "meta": "<meta quantitativa>", "foco": "<foco — ex: Converter engajamento em seguidores e leads>" }
    ]
  }
}

IMPORTANTE:
- Seja EXTREMAMENTE específico para o nicho "${nichoStr}" — cada tema, roteiro e legenda deve ser único
- Hashtags devem ser reais e relevantes para o nicho no Brasil
- Horários baseados nos melhores momentos para o público brasileiro no Instagram (pico: 12h, 19h-21h)
- Preencha TODOS os campos completamente — sem campos vazios ou genéricos
`

    const response = await getOpenAI().chat.completions.create({
      model:           'gpt-4o',
      messages:        [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      max_tokens:      4000,
      temperature:     0.7,
    })

    const content = response.choices[0].message.content
    const data    = JSON.parse(content || '{}')

    const sb = getSupabase()

    const { data: saved, error } = await sb
      .from('instagram_analysis')
      .insert({
        user_id:              userId,
        instagram_handle:     handle,
        score:                data.score,
        pontos_fortes:        data.pontos_fortes,
        pontos_fracos:        data.pontos_fracos,
        risco_shadowban:      data.risco_shadowban,
        frequencia_atual:     data.frequencia_atual,
        engajamento_estimado: data.engajamento_estimado,
        plano_acao:           data.plano_acao,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data: { ...data, id: saved.id } })

  } catch (error: any) {
    console.error('[analyze-instagram]', error.message)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ success: false, error: 'userId obrigatório' }, { status: 400 })
    }

    const { data, error } = await getSupabase()
      .from('instagram_analysis')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data })

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
