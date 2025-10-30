import Replicate from "replicate"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  console.log("=== Haircut API route called ===")
  
  try {
    const { image, prompt } = await req.json()

    console.log("Request received:", {
      hasImage: !!image,
      imageLength: image?.length || 0,
      prompt: prompt,
      timestamp: new Date().toISOString()
    })

    if (!image) {
      console.log("Request rejected: No image provided")
      return NextResponse.json(
        { error: "Image is required" },
        { status: 400 }
      )
    }

    // Check if API token exists
    console.log("REPLICATE_API_TOKEN present:", !!process.env.REPLICATE_API_TOKEN)

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN!,
    })

    console.log("Creating Replicate prediction with input:", {
      model: "flux-kontext-apps/change-haircut",
      haircut: prompt || "Pixie Cut",
      hair_color: "No change",
      gender: "none"
    })

    // Run prediction and WAIT for result
    console.log("Starting prediction and waiting for result...")
    
    const output = await replicate.run(
      "flux-kontext-apps/change-haircut",
      {
        input: {
          input_image: image,
          haircut: prompt || "Pixie Cut",
          hair_color: "No change",
          gender: "none",
          aspect_ratio: "match_input_image",
          output_format: "png",
          safety_tolerance: 2
        }
      }
    )

    console.log("=== REPLICATE OUTPUT ===")
    console.log("Type:", typeof output)
    console.log("Is Array:", Array.isArray(output))
    console.log("Full output:", JSON.stringify(output, null, 2))
    console.log("=== END ===")

    // Extract image URL
    let imageUrl: string | null = null
    
    if (Array.isArray(output) && output.length > 0) {
      imageUrl = output[0]
    } else if (typeof output === 'string') {
      imageUrl = output
    }

    if (!imageUrl) {
      console.error("ERROR: No image URL in output")
      return NextResponse.json({ 
        error: "No image generated",
        details: "Replicate completed but returned no image URL",
        fullOutput: output
      }, { status: 500 })
    }

    console.log("=== SUCCESS - Returning image URL ===")
    return NextResponse.json({ 
      success: true, 
      imageUrl: imageUrl
    })

  } catch (error: any) {
    console.error("=== Replicate API Error ===")
    console.error("Error message:", error.message)
    console.error("Error details:", JSON.stringify(error, null, 2))
    
    return NextResponse.json(
      { 
        error: "Failed to start haircut transformation", 
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
