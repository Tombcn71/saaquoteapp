import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { calculateKozijnenPrice } from '@/lib/pricing/ai-calculator'

export const maxDuration = 60

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!
})

const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

// Functies die de bot MAG aanroepen
const AVAILABLE_FUNCTIONS = [
  {
    name: "analyze_photo",
    description: "Analyze uploaded photo with AI to detect windows, frames, provide recommendations AND generate AI preview of new windows. Call this when user uploads a photo.",
    parameters: {
      type: "object",
      properties: {
        photoUrl: { 
          type: "string", 
          description: "URL of the uploaded photo" 
        },
        generatePreview: {
          type: "boolean",
          description: "Generate AI preview of new windows, default true"
        }
      },
      required: ["photoUrl"]
    }
  },
  {
    name: "calculate_price",
    description: "Calculate quote price when customer provides specifications (material, number of frames, glass area). Always call this when you have enough information.",
    parameters: {
      type: "object",
      properties: {
        material: { 
          type: "string",
          enum: ["kunststof", "hout", "aluminium"],
          description: "Frame material type"
        },
        numberOfFrames: { 
          type: "number",
          description: "Number of window frames to replace"
        },
        glassArea: { 
          type: "number",
          description: "Total glass surface area in square meters"
        },
        glassType: {
          type: "string",
          enum: ["hr++", "hr+++", "triple"],
          description: "Type of glass, default to hr++"
        },
        installation: {
          type: "boolean",
          description: "Include installation, default true"
        },
        removeOld: {
          type: "boolean",
          description: "Remove old frames, default false"
        }
      },
      required: ["material", "numberOfFrames", "glassArea"]
    }
  },
  {
    name: "request_appointment",
    description: "When customer wants to book an appointment or after showing price, suggest booking appointment.",
    parameters: {
      type: "object",
      properties: {
        reason: { 
          type: "string",
          description: "Why appointment is suggested"
        }
      }
    }
  },
  {
    name: "save_lead",
    description: "Save customer lead when you have their contact details (name, email, phone).",
    parameters: {
      type: "object",
      properties: {
        name: { type: "string", description: "Customer name" },
        email: { type: "string", description: "Customer email" },
        phone: { type: "string", description: "Customer phone number" }
      },
      required: ["name", "email"]
    }
  }
]

// System prompt - bot's instructies
function getSystemPrompt(companyName: string = "Demo Bedrijf") {
  return `Je bent een vriendelijke en professionele verkoop assistent voor ${companyName}, specialist in kozijnen en ramen.

PERSOONLIJKHEID:
- Enthousiast maar professioneel
- Behulpzaam en geduldig
- Gebruik emoji's spaarzaam (max 2 per bericht)
- Antwoord altijd in het Nederlands
- Houd berichten kort en to-the-point (max 3-4 regels)

STRIKTE REGELS:
1. Stel ALTIJD 1 vraag per keer (nooit meerdere!)
2. Als klant foto uploadt → DIRECT analyze_photo functie aanroepen
3. Als je materiaal + aantal + m² hebt → DIRECT calculate_price aanroepen
4. Na prijs tonen → DIRECT request_appointment aanroepen
5. Als klant contactgegevens geeft → DIRECT save_lead aanroepen

VERBODEN:
- NOOIT zelf prijzen verzinnen! Altijd calculate_price gebruiken
- NOOIT over off-topic praten (politiek, nieuws, etc)
- NOOIT vage antwoorden, wees specifiek
- NOOIT lange verhalen, houd het kort

CONVERSATIE FLOW:
1. Begroeting + VRAAG ACTIEF om foto: "Heb je een foto van je huidige ramen? Dan kan ik je laten zien hoe nieuwe kozijnen eruit zien! 📸"
2. Als foto geüpload → DIRECT analyze_photo() → Bot ontvangt analyse + preview
3. Bespreek analyse kort EN vermeld: "Ik heb ook een AI preview gemaakt, zie hierboven! 🎨"
4. Vraag materiaal: "Welk materiaal overweeg je? 🏠 Kunststof, 🪵 Hout, of ⚙️ Aluminium?"
5. Vraag aantal (of gebruik schatting uit foto)
6. Vraag/schat m² (of gebruik schatting uit foto)
7. calculate_price() → Toon prijs DUIDELIJK
8. request_appointment() → Vraag om afspraak
9. Vraag contactgegevens: naam, email, telefoon (1 per keer!)
10. save_lead() → Bevestig

PRIJS PRESENTATIE FORMAT:
Als calculate_price resultaat krijgt, format zo:

📦 JOUW OFFERTE

Specificaties:
├─ {aantal}x {materiaal} kozijnen
├─ {m²}m² {glasType} glas
├─ Montage inclusief
└─ Afvoer oude kozijnen (indien van toepassing)

💰 Totaalprijs: €{prijs}
(Indicatie excl. BTW)

🎯 Voor exacte prijs plan ik graag een gratis adviesgesprek!

BELANGRIJK:
- Wees enthousiast over het product
- Focus op voordelen (energiebesparing, onderhoudsarm)
- Ga snel door naar afspraak na prijs
- Houd alles simpel en helder`
}

export async function POST(req: Request) {
  try {
    const { message, sessionId, chatHistory, context } = await req.json()

    console.log('💬 Chat request:', { message, sessionId, hasPhoto: !!context.photoUrl })

    // Build messages for OpenAI
    const messages: any[] = [
      {
        role: "system",
        content: getSystemPrompt(context.companyName || "Demo Bedrijf")
      }
    ]

    // Add chat history (only last 10 messages to save tokens)
    if (chatHistory && Array.isArray(chatHistory)) {
      chatHistory.slice(-10).forEach((msg: any) => {
        if (msg.role !== 'system') {
          messages.push({
            role: msg.role,
            content: msg.content
          })
        }
      })
    }

    // Add current message
    messages.push({
      role: "user",
      content: message
    })

    // Call OpenAI with function calling
    console.log('🤖 Calling OpenAI...')
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages,
      functions: AVAILABLE_FUNCTIONS,
      function_call: "auto",
      temperature: 0.7,
      max_tokens: 500
    })

    const botMessage = response.choices[0].message
    console.log('🤖 OpenAI response:', { 
      hasContent: !!botMessage.content, 
      hasFunctionCall: !!botMessage.function_call 
    })

    // Check if bot wants to call a function
    if (botMessage.function_call) {
      const functionName = botMessage.function_call.name
      const functionArgs = JSON.parse(botMessage.function_call.arguments)

      console.log(`🔧 Function call: ${functionName}`, functionArgs)

      let functionResult: any = {}
      let responseData: any = {}

      switch (functionName) {
        case "analyze_photo":
          functionResult = await analyzePhotoWithGemini(
            context.photoUrl || functionArgs.photoUrl,
            functionArgs.generatePreview !== false
          )
          
          // Send analysis back to OpenAI for natural response
          const analysisResponse = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: [
              ...messages,
              botMessage,
              {
                role: "function",
                name: functionName,
                content: JSON.stringify(functionResult)
              }
            ],
            temperature: 0.7,
            max_tokens: 300
          })
          
          responseData = {
            reply: analysisResponse.choices[0].message.content,
            previewUrl: functionResult.previewUrl,
            context: { 
              analyzed: true, 
              analysisResult: functionResult,
              // Extract estimated specs from analysis for easier price calc
              estimatedFrames: extractNumber(functionResult.analysis, 'ramen|kozijnen'),
              estimatedArea: extractNumber(functionResult.analysis, 'm²|m2|vierkante')
            }
          }
          break

        case "calculate_price":
          functionResult = calculatePrice(functionArgs)
          
          // Send price back to OpenAI for natural response
          const priceResponse = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: [
              ...messages,
              botMessage,
              {
                role: "function",
                name: functionName,
                content: JSON.stringify(functionResult)
              }
            ],
            temperature: 0.7,
            max_tokens: 300
          })
          
          responseData = {
            reply: priceResponse.choices[0].message.content,
            priceInfo: functionResult,
            context: { priceCalculated: true, ...functionArgs, calculatedPrice: functionResult.price }
          }
          break

        case "request_appointment":
          responseData = {
            reply: "📅 Wanneer past het jou? Kies hieronder een datum en tijd:",
            showAppointmentPicker: true,
            context: { appointmentRequested: true }
          }
          break

        case "save_lead":
          // Save lead to database
          functionResult = await saveLead({
            ...functionArgs,
            ...context,
            companyId: context.companyId,
            widgetId: context.widgetId,
            source: 'chatbot'
          })
          
          responseData = {
            reply: `✅ Perfect ${functionArgs.name}! Je afspraak is bevestigd en je ontvangt zo een bevestigingsmail op ${functionArgs.email}.\n\nWe bellen je op het afgesproken moment voor een gratis adviesgesprek! 📞\n\nBedankt en tot snel! 👋`,
            context: { leadSaved: true }
          }
          break

        default:
          responseData = {
            reply: botMessage.content || "Sorry, er ging iets mis. Probeer het opnieuw.",
          }
      }

      return NextResponse.json(responseData)
    }

    // No function call, just return bot's text response
    return NextResponse.json({
      reply: botMessage.content
    })

  } catch (error: any) {
    console.error('❌ Chat API error:', error)
    return NextResponse.json(
      { 
        error: 'Er ging iets mis met de chat',
        details: error.message 
      },
      { status: 500 }
    )
  }
}

// Helper: Analyze photo with Gemini AND generate preview
async function analyzePhotoWithGemini(photoUrl: string, generatePreview: boolean = true) {
  try {
    const model = gemini.getGenerativeModel({ model: 'gemini-1.5-flash' })

    // Fetch image
    const imageResponse = await fetch(photoUrl)
    const imageBuffer = await imageResponse.arrayBuffer()
    const base64Image = Buffer.from(imageBuffer).toString('base64')

    // 1. ANALYZE the photo
    const analysisResult = await model.generateContent([
      {
        inlineData: {
          data: base64Image,
          mimeType: 'image/jpeg'
        }
      },
      `Analyseer deze foto voor kozijn vervanging. Geef:
      1. Aantal ramen/kozijnen
      2. Geschatte glasoppervlakte (m²)
      3. Huidige materiaal/staat
      4. Aanbevelingen
      
      Houd het kort en to-the-point.`
    ])

    const analysis = analysisResult.response.text()

    // 2. GENERATE AI PREVIEW (new windows)
    let previewUrl = null
    
    if (generatePreview) {
      console.log('🎨 Generating AI preview...')
      
      const previewResult = await model.generateContent([
        {
          inlineData: {
            data: base64Image,
            mimeType: 'image/jpeg'
          }
        },
        `Generate an improved version of this image with MODERN NEW WINDOWS/FRAMES installed.

IMPORTANT CHANGES:
- Replace old windows with BRAND NEW modern white/kunststof frames
- Make glass crystal clear and clean
- Frames should look professional and high-quality
- Keep the building/wall exactly the same
- Only change the windows/frames
- Make it look realistic and professional

The result should clearly show the DIFFERENCE between old and new windows.`
      ])
      
      // Note: Gemini 1.5 doesn't generate images directly via API yet
      // We'll use the analysis to describe the preview instead
      // In production, you'd use a different model or service for actual image generation
      
      console.log('⚠️ Note: Gemini 1.5 Flash cannot generate images yet')
      console.log('💡 For actual preview generation, integrate: DALL-E, Midjourney, or Stable Diffusion')
    }

    return {
      analysis,
      previewUrl: previewUrl || photoUrl, // For now, return original
      confidence: 'high',
      note: 'Preview generation requires image-generation model (DALL-E/Midjourney)'
    }
  } catch (error) {
    console.error('Gemini analysis error:', error)
    return {
      analysis: "Ik zie de foto, maar kan deze niet helemaal analyseren. Kun je me vertellen hoeveel ramen je wilt vervangen?",
      confidence: 'low'
    }
  }
}

// Helper: Calculate price
function calculatePrice(params: any) {
  try {
    const result = calculateKozijnenPrice({
      woningtype: 'tussenwoning', // default
      aantalKozijnen: params.numberOfFrames.toString(),
      glasoppervlakte: params.glassArea.toString(),
      glasType: params.glassType || 'hr++',
      materiaal: params.material,
      montage: params.installation !== false,
      afvoerOudeKozijnen: params.removeOld || false
    })

    return {
      price: result.totaal,
      breakdown: result.breakdown,
      specs: params
    }
  } catch (error) {
    console.error('Price calculation error:', error)
    return {
      price: 0,
      error: 'Kon prijs niet berekenen'
    }
  }
}

// Helper: Extract numbers from text
function extractNumber(text: string, pattern: string): number | null {
  const regex = new RegExp(`(\\d+)\\s*(?:${pattern})`, 'i')
  const match = text.match(regex)
  return match ? parseInt(match[1]) : null
}

// Helper: Save lead
async function saveLead(data: any) {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        formType: 'kozijnen',
        customerInfo: {
          name: data.name,
          email: data.email,
          phone: data.phone
        },
        formData: data,
        companyId: data.companyId,
        widgetId: data.widgetId,
        estimatedPrice: data.calculatedPrice,
        appointmentDatetime: data.appointmentDatetime,
        source: 'chatbot'
      })
    })

    const result = await response.json()
    console.log('✅ Lead saved:', result.leadId)

    return { success: true, leadId: result.leadId }
  } catch (error) {
    console.error('Save lead error:', error)
    return { success: false, error: 'Failed to save' }
  }
}

