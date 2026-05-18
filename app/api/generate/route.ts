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
    const { nicho, objetivo, userId } = await request.json()

    // Busca brand_kit do usuário para personalizar o prompt
    let brandKit: Record<string, string> | null = null
    if (userId) {
      const { data } = await getSupabase().from('brand_kit')
        .select('*')
        .eq('user_id', userId)
        .single()
      brandKit = data
    }

    const nichoFinal = brandKit?.nicho || nicho

    const brandContext = brandKit ? `
IDENTIDADE DA MARCA (use sempre para personalizar o conteúdo):
- Nome da marca: ${brandKit.nome_marca || 'não informado'}
- Tom de voz: ${brandKit.tom_de_voz || 'profissional'}
- Público-alvo: ${brandKit.publico_alvo || 'público geral do nicho'}
- Principal produto/serviço: ${brandKit.produto_servico || 'não informado'}
- Palavras que combinam com a marca: ${brandKit.palavras_positivas || 'não definidas'}
- Palavras que NÃO combinam com a marca: ${brandKit.palavras_negativas || 'nenhuma'}
- Instagram: @${brandKit.instagram_handle || 'não informado'}
- Cidade/localização: ${brandKit.cidade || 'não informada'}
- Tipo de perfil: ${brandKit.tipo_perfil || 'negócios'}
` : ''

    const prompt = `
Você é um estrategista de crescimento para Instagram, especialista no algoritmo do Instagram em 2026.
${brandContext}
Crie um plano estratégico de 7 dias para um profissional do nicho: ${nichoFinal}
Objetivo principal: ${objetivo}

REGRAS DO ALGORITMO DO INSTAGRAM 2026:
- Reels têm prioridade máxima (gancho nos primeiros 3 segundos)
- Carrosséis geram mais salvamentos e compartilhamentos
- Consistência de horário treina o algoritmo
- CTAs que pedem comentários geram mais alcance
- Hashtags: mix de nicho + volume médio + localização
- Frequência ideal: 5x por semana

${brandKit ? `IMPORTANTE: Todo o conteúdo deve refletir o tom "${brandKit.tom_de_voz}" e usar palavras como: ${brandKit.palavras_positivas}. Evitar: ${brandKit.palavras_negativas}. O conteúdo deve ressoar com o público: ${brandKit.publico_alvo}.` : ''}

RETORNE APENAS um JSON válido com essa estrutura:
{
  "resumo": "resumo estratégico do plano em 1 frase",
  "projecao": "projeção de crescimento em 30 dias",
  "itens": [
    {
      "dia": "Segunda-feira",
      "formato": "Reel",
      "tema": "título do conteúdo",
      "horario": "19h",
      "objetivo": "engajamento",
      "gancho": "frase de abertura para parar o scroll",
      "legenda": "legenda completa otimizada para o algoritmo com emojis e CTA",
      "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3", "#hashtag4", "#hashtag5"]
    }
  ]
}

Crie 7 itens, um para cada dia da semana.
Use o mix ideal: 3 Reels, 2 Carrosséis, 1 Post, 1 Story.
Cada conteúdo deve ser específico para o nicho ${nichoFinal} e objetivo ${objetivo}.
`

    const response = await getOpenAI().chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      max_tokens: 3000,
    })

    const content = response.choices[0].message.content
    const data = JSON.parse(content || '{}')

    if (userId && data.itens) {
      for (const item of data.itens) {
        await getSupabase().from('content_items').insert({
          user_id:  userId,
          tipo:     normalizeTipo(item.formato),
          titulo:   item.tema,
          legenda:  item.legenda,
          hashtags: item.hashtags,
          cta:      item.gancho,
          horario:  item.horario,
          tema:     item.tema,
          nicho:    nichoFinal,
          status:   'draft',
        })
      }
    }

    return NextResponse.json({ success: true, data })

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
