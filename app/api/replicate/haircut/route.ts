import Replicate from "replicate"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { image, prompt } = await req.json()

    if (!image) {
      return NextResponse.json(
        { error: "Image is required" },
        { status: 400 }
      )
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN!,
    })

    console.log("Starting Replicate haircut transformation...")

    const output = await replicate.run(
      "flux-kontext-apps/change-haircut",
      {
        input: {
          input_image: image,
          prompt: prompt || "Change the hairstyle to a modern professional cut",
        }
      }
    )

    console.log("Replicate output:", output)
    console.log("Output type:", typeof output)
    console.log("Is array:", Array.isArray(output))
    
    // Handle different output formats
    let imageUrl: string | null = null
    
    if (Array.isArray(output)) {
      // If it's an array, take the first item
      imageUrl = output[0]
    } else if (typeof output === 'string') {
      // If it's a string, use it directly
      imageUrl = output
    } else if (output && typeof output === 'object') {
      // If it's an object, look for common image properties
      imageUrl = (output as any).url || (output as any).image || (output as any).output || null
    }
    
    console.log("Extracted image URL:", imageUrl)
    
    if (!imageUrl) {
      console.error("Could not extract image URL from output:", JSON.stringify(output))
      return NextResponse.json(
        { error: "No image URL in response", rawOutput: output },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      output: imageUrl
    })

  } catch (error: any) {
    console.error("Replicate API Error:", error)
    return NextResponse.json(
      { 
        error: "Failed to process haircut change", 
        details: error.message 
      },
      { status: 500 }
    )
  }
}


