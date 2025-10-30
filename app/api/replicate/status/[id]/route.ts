import Replicate from "replicate"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN!,
    })

    const prediction = await replicate.predictions.get(params.id)
    
    console.log(`Status check for ${params.id}: ${prediction.status}`)

    // Extract image URL if succeeded
    let imageUrl: string | null = null
    
    if (prediction.status === "succeeded" && prediction.output) {
      if (Array.isArray(prediction.output) && prediction.output.length > 0) {
        imageUrl = prediction.output[0]
      } else if (typeof prediction.output === 'string') {
        imageUrl = prediction.output
      }
    }

    return NextResponse.json({
      status: prediction.status,
      output: imageUrl,
      error: prediction.error
    })

  } catch (error: any) {
    console.error("Error checking prediction status:", error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

