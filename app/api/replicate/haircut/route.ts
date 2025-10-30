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

    return NextResponse.json({ 
      success: true, 
      output: output 
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


