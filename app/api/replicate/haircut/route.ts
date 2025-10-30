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

    console.log("Creating Replicate prediction...")

    // Create prediction (returns immediately)
    const prediction = await replicate.predictions.create({
      model: "flux-kontext-apps/change-haircut",
      input: {
        input_image: image,
        haircut: prompt || "modern professional cut",
        hair_color: "No change",
        gender: "none",
        aspect_ratio: "match_input_image",
        output_format: "png",
        safety_tolerance: 2
      },
      // Optional: add webhook URL when deployed
      // webhook: `${process.env.NEXTAUTH_URL}/api/replicate/webhook`,
      // webhook_events_filter: ["completed"]
    })

    console.log("Prediction created:", prediction.id, "status:", prediction.status)

    // Return prediction ID immediately
    return NextResponse.json({ 
      success: true, 
      predictionId: prediction.id,
      status: prediction.status
    })

  } catch (error: any) {
    console.error("Replicate API Error:", error)
    return NextResponse.json(
      { 
        error: "Failed to start haircut change", 
        details: error.message 
      },
      { status: 500 }
    )
  }
}
