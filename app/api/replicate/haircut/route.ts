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
    const prediction = await replicate.predictions.create({
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

    console.log("Prediction created successfully:", {
      id: prediction.id,
      status: prediction.status,
      fullResponse: JSON.stringify(prediction, null, 2)
    })

    if (!prediction.id) {
      console.error("ERROR: No prediction ID in response")
      return NextResponse.json({ 
        error: "No prediction ID received from Replicate",
        details: "Replicate returned a response but without an ID",
        fullResponse: prediction
      }, { status: 500 })
    }

    console.log("=== Returning success response ===")
    return NextResponse.json({ 
      success: true, 
      predictionId: prediction.id,
      status: prediction.status
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
