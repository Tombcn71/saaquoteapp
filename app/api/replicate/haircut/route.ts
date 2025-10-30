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

    // Create prediction
    console.log("Creating prediction...")
    
    let prediction = await replicate.predictions.create({
      model: "flux-kontext-apps/change-haircut",
      input: {
        input_image: image,
        haircut: prompt || "Pixie Cut",
        hair_color: "No change",
        gender: "none",
        aspect_ratio: "match_input_image",
        output_format: "png",
        safety_tolerance: 2
      }
    })

    console.log("Prediction created:", prediction.id, "Status:", prediction.status)

    // Poll until complete (backend waits, not frontend!)
    let attempts = 0
    const maxAttempts = 60 // 60 * 3 seconds = 3 minutes max

    while (prediction.status !== "succeeded" && prediction.status !== "failed" && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 3000)) // Wait 3 seconds
      
      prediction = await replicate.predictions.get(prediction.id)
      attempts++
      
      console.log(`Poll attempt ${attempts}: Status = ${prediction.status}`)
    }

    console.log("=== FINAL PREDICTION STATUS ===")
    console.log("Status:", prediction.status)
    console.log("=== ALLE VELDEN IN PREDICTION ===")
    console.log(JSON.stringify(prediction, null, 2))
    console.log("=== END ===")

    if (prediction.status === "failed") {
      console.error("Prediction failed:", prediction.error)
      return NextResponse.json({ 
        error: "Generation failed",
        details: prediction.error
      }, { status: 500 })
    }

    if (prediction.status !== "succeeded") {
      console.error("Timeout waiting for prediction")
      return NextResponse.json({ 
        error: "Timeout - generation took too long"
      }, { status: 500 })
    }

    // Try ALL possible output fields
    let imageUrl: string | null = null
    
    // Check output field
    if (Array.isArray(prediction.output) && prediction.output.length > 0) {
      imageUrl = prediction.output[0]
    } else if (typeof prediction.output === 'string') {
      imageUrl = prediction.output
    }
    
    // Check img_url field (user's suggestion!)
    if (!imageUrl && (prediction as any).img_url) {
      imageUrl = (prediction as any).img_url
    }
    
    // Check image_url field
    if (!imageUrl && (prediction as any).image_url) {
      imageUrl = (prediction as any).image_url
    }
    
    // Check urls field
    if (!imageUrl && (prediction as any).urls?.get) {
      imageUrl = (prediction as any).urls.get
    }

    if (!imageUrl) {
      console.error("No image URL found in prediction")
      return NextResponse.json({ 
        error: "No image in output",
        allFields: Object.keys(prediction)
      }, { status: 500 })
    }

    console.log("✅ SUCCESS - Image URL:", imageUrl)
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
