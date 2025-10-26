import OpenAI from 'openai'
import { NextResponse } from 'next/server'

// Use Node.js runtime for better compatibility
export const maxDuration = 60

// Initialize OpenAI client lazily to avoid build-time errors
function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured')
  }
  
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
}

interface AnalysisResult {
  room_type: string
  furniture: Array<{
    item: string
    quantity: number
    size: 'small' | 'medium' | 'large'
  }>
  boxes_estimate: number
  volume_level: 'empty' | 'sparse' | 'half' | 'full' | 'very_full'
  floor_visible_percentage: number
  special_items: string[]
  access_notes: string
  estimated_hours: number
}

export async function POST(request: Request) {
  try {
    const { imageUrl } = await request.json()
    
    console.log('🔍 AI Analyse gestart voor foto')

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Geen foto URL opgegeven' },
        { status: 400 }
      )
    }
    
    console.log('🔑 OpenAI API Key aanwezig:', !!process.env.OPENAI_API_KEY)
    console.log('🔑 API Key preview:', process.env.OPENAI_API_KEY?.substring(0, 10) + '...')

    const openai = getOpenAIClient()
    console.log('📡 OpenAI request verzenden...')
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `Je bent een expert in het inschatten van verhuizingen en woningontruimingen. 
Analyseer de foto en geef een gedetailleerde inventaris van alle items, meubels en de staat van de ruimte.

Geef je antwoord ALLEEN als valid JSON in dit formaat:
{
  "room_type": "woonkamer/slaapkamer/keuken/etc",
  "furniture": [
    {"item": "bank", "quantity": 1, "size": "large"},
    {"item": "salontafel", "quantity": 1, "size": "medium"}
  ],
  "boxes_estimate": 10,
  "volume_level": "half",
  "floor_visible_percentage": 60,
  "special_items": ["piano", "grote kast"],
  "access_notes": "Smalle gang, trap aanwezig",
  "estimated_hours": 3
}

Let op:
- Tel ALLE zichtbare meubels en items
- Schat dozen/tassen/rommel realistisch in
- volume_level: empty (0-10%), sparse (10-30%), half (30-60%), full (60-85%), very_full (85-100%)
- floor_visible_percentage: hoeveel % vloer is zichtbaar/vrij
- special_items: zware/fragiele items die extra aandacht vragen
- estimated_hours: geschatte uren voor 2 personen om te ontruimen`
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analyseer deze ruimte en geef een gedetailleerde inventaris voor een woningontruiming.'
            },
            {
              type: 'image_url',
              image_url: {
                url: imageUrl,
                detail: 'high'
              }
            }
          ]
        }
      ],
      response_format: { type: 'json_object' },
      max_tokens: 1000,
    })

    const content = response.choices[0]?.message?.content

    if (!content) {
      throw new Error('Geen response van AI')
    }

    const analysis: AnalysisResult = JSON.parse(content)
    
    console.log('✅ AI Analyse succesvol!')
    console.log('📊 Tokens gebruikt:', response.usage?.total_tokens || 0)
    console.log('🪑 Meubels gevonden:', analysis.furniture.length)

    return NextResponse.json({
      success: true,
      analysis,
      usage: {
        prompt_tokens: response.usage?.prompt_tokens || 0,
        completion_tokens: response.usage?.completion_tokens || 0,
        total_tokens: response.usage?.total_tokens || 0,
      }
    })

  } catch (error: any) {
    console.error('❌ Analysis error:', error)
    console.error('Error details:', {
      message: error.message,
      status: error.status,
      code: error.code,
      type: error.type,
    })
    
    // Specifieke error voor quota issues
    if (error.status === 429 || error.code === 'insufficient_quota') {
      return NextResponse.json(
        { 
          error: 'OpenAI quota overschreden',
          details: 'Voeg credits toe op platform.openai.com/account/billing',
          code: 'QUOTA_EXCEEDED'
        },
        { status: 429 }
      )
    }
    
    return NextResponse.json(
      { 
        error: 'Analyse mislukt',
        details: error.message || 'Onbekende fout',
        code: error.code || 'UNKNOWN'
      },
      { status: 500 }
    )
  }
}

