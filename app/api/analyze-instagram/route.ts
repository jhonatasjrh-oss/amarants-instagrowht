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

    const handle = (instagram_handle || '').replace('@', '').trim() || 'perfil'

    const prompt = `
Você é um especialista em análise de perfis do Instagram com 10 anos de experiência em crescimento orgânico.

Analise o perfil do Instagram: @${handle}
Nicho declarado: ${nicho || 'negócios/empreendedorismo'}

Com base no handle e nicho, gere uma análise diagnóstica realista e personalizada do perfil.
Seja específico e use termos técnicos do marketing digital.

RETORNE APENAS um JSON válido com esta estrutura exata:
{
  "score": <número entre 40 e 85>,
  "pontos_fortes": [
    "<ponto forte específico 1>",
    "<ponto forte específico 2>",
    "<ponto forte específico 3>"
  ],
  "pontos_fracos": [
    "<ponto fraco específico 1>",
    "<ponto fraco específico 2>",
    "<ponto fraco específico 3>"
  ],
  "risco_shadowban": "<baixo | médio | alto>",
  "frequencia_atual": "<estimativa como '2-3x por semana' ou 'irregular'>",
  "engajamento_estimado": "<estimativa como '1.8%' ou '3.2%'>",
  "plano_acao": {
    "meta_30_dias": "<meta realista de crescimento em seguidores>",
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
      { "dia": "Segunda-feira",  "tipo": "Reel",      "tema": "<tema específico para o nicho>", "horario": "<horário>", "gancho": "<frase de abertura>" },
      { "dia": "Terça-feira",    "tipo": "Carrossel",  "tema": "<tema específico>",             "horario": "<horário>", "gancho": "<frase de abertura>" },
      { "dia": "Quarta-feira",   "tipo": "Story",      "tema": "<tema específico>",             "horario": "<horário>", "gancho": "<frase de abertura>" },
      { "dia": "Quinta-feira",   "tipo": "Carrossel",  "tema": "<tema específico>",             "horario": "<horário>", "gancho": "<frase de abertura>" },
      { "dia": "Sexta-feira",    "tipo": "Reel",       "tema": "<tema específico>",             "horario": "<horário>", "gancho": "<frase de abertura>" },
      { "dia": "Sábado",         "tipo": "Post",       "tema": "<tema específico>",             "horario": "<horário>", "gancho": "<frase de abertura>" },
      { "dia": "Domingo",        "tipo": "Reel",       "tema": "<tema específico>",             "horario": "<horário>", "gancho": "<frase de abertura>" }
    ],
    "dicas_extras": [
      "<dica estratégica 1>",
      "<dica estratégica 2>",
      "<dica estratégica 3>"
    ]
  }
}

Gere uma análise específica e realista para o nicho ${nicho || 'empreendedorismo'}.
Os temas dos primeiros 7 dias devem ser completamente específicos e práticos para esse nicho.
`

    const response = await getOpenAI().chat.completions.create({
      model:           'gpt-4o',
      messages:        [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      max_tokens:      2500,
    })

    const content = response.choices[0].message.content
    const data    = JSON.parse(content || '{}')

    const sb = getSupabase()

    // Salva a análise no banco
    const { data: saved, error } = await sb
      .from('instagram_analysis')
      .insert({
        user_id:             userId,
        instagram_handle:    handle,
        score:               data.score,
        pontos_fortes:       data.pontos_fortes,
        pontos_fracos:       data.pontos_fracos,
        risco_shadowban:     data.risco_shadowban,
        frequencia_atual:    data.frequencia_atual,
        engajamento_estimado:data.engajamento_estimado,
        plano_acao:          data.plano_acao,
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
