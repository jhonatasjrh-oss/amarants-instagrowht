import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@supabase/supabase-js'

const getOpenAI = () => new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const getSupabase = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

function normalizeTipo(formato: string): string {
  const f = (formato || '').toLowerCase().trim()
  if (f.includes('reel'))    return 'reel'
  if (f.includes('carros'))  return 'carrossel'
  if (f.includes('stor'))    return 'story'
  if (f.includes('banner'))  return 'banner'
  return 'post'
}

export async function POST(request: NextRequest) {
  try {
    const formData      = await request.formData()
    const descricao     = formData.get('descricao') as string
    const objetivo      = formData.get('objetivo') as string
    const tom           = formData.get('tom') as string
    const nicho         = formData.get('nicho') as string
    const userId        = formData.get('userId') as string
    const imagens       = formData.getAll('imagens') as File[]
    const pdfFile       = formData.get('pdf') as File | null

    // ── Processa imagens ──────────────────────────────
    const imagensBase64: { base64: string; type: string }[] = []
    for (const img of imagens) {
      if (!img || img.size === 0) continue
      const bytes  = await img.arrayBuffer()
      const buffer = Buffer.from(bytes)
      imagensBase64.push({ base64: buffer.toString('base64'), type: img.type })
    }

    // ── Processa PDF ──────────────────────────────────
    let textoPDF = ''
    if (pdfFile && pdfFile.size > 0) {
      const bytes  = await pdfFile.arrayBuffer()
      const buffer = Buffer.from(bytes)
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const pdfParse = require('pdf-parse') as (b: Buffer) => Promise<{ text: string }>
      const parsed = await pdfParse(buffer)
      textoPDF = parsed.text?.slice(0, 3000) || ''
    }

    // ── Monta conteúdo da mensagem ────────────────────
    const contentParts: any[] = []

    // Adiciona imagens
    for (const img of imagensBase64) {
      contentParts.push({
        type: 'image_url',
        image_url: { url: `data:${img.type};base64,${img.base64}` },
      })
    }

    // Monta o prompt
    const prompt = `
Você é um especialista em marketing digital para Instagram.

${imagensBase64.length > 0 ? `Analise as ${imagensBase64.length} imagem(ns) enviadas e` : 'Com base nas informações abaixo,'} crie um conteúdo completo e personalizado para Instagram.

INFORMAÇÕES DO CLIENTE:
- Descrição/intenção: ${descricao}
- Nicho: ${nicho || 'negócios'}
- Objetivo: ${objetivo || 'engajamento'}
- Tom de voz: ${tom || 'profissional'}

${textoPDF ? `CONTEÚDO DO DOCUMENTO (use como base para o conteúdo):
${textoPDF}` : ''}

INSTRUÇÕES:
- Use as imagens como referência visual do negócio
- Se houver documento, extraia informações relevantes para criar conteúdo mais rico
- Crie conteúdo autêntico e personalizado para o negócio
- Siga as melhores práticas do algoritmo do Instagram 2026

RETORNE APENAS um JSON válido:
{
  "titulo": "título criativo do conteúdo",
  "descricao_analise": "o que você identificou nas imagens e/ou documento",
  "sugestao_formato": "Post, Carrossel ou Reel",
  "legenda": "legenda completa otimizada com emojis e quebras de linha",
  "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3", "#hashtag4", "#hashtag5", "#hashtag6"],
  "cta": "chamada para ação clara e persuasiva",
  "horario": "melhor horário para postar",
  "sugestao_slides": ["slide 1", "slide 2", "slide 3"],
  "dicas": ["dica 1 para melhorar o conteúdo", "dica 2", "dica 3"]
}
`

    contentParts.push({ type: 'text', text: prompt })

    const response = await getOpenAI().chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: contentParts }],
      response_format: { type: 'json_object' },
      max_tokens: 2500,
    })

    const content = response.choices[0].message.content
    const data    = JSON.parse(content || '{}')

    // ── Salva no banco ────────────────────────────────
    if (userId) {
      await getSupabase().from('content_items').insert({
        user_id:  userId,
        tipo:     normalizeTipo(data.sugestao_formato || ''),
        titulo:   data.titulo,
        legenda:  data.legenda,
        hashtags: data.hashtags,
        cta:      data.cta,
        horario:  data.horario,
        tema:     descricao,
        nicho:    nicho || 'manual',
        status:   'draft',
      })
    }

    return NextResponse.json({ success: true, data })

  } catch (error: any) {
    console.error('Erro generate-manual:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}