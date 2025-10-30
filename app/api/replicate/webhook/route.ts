import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    console.log("Replicate webhook received:", rawBody)

    let body
    try {
      body = JSON.parse(rawBody)
      console.log("Parsed webhook body:", body)
    } catch (e) {
      console.error("Failed to parse webhook body:", e)
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
    }

    const { id, status, output, error } = body

    console.log("Webhook details:", {
      id,
      status,
      output: Array.isArray(output) ? output[0] : output,
      error,
    })

    // We'll store results in memory/database here if needed
    // For now just log it
    if (status === "succeeded" && output) {
      let resultUrl = null
      
      if (Array.isArray(output) && output.length > 0) {
        resultUrl = output[0]
      } else if (typeof output === "string") {
        resultUrl = output
      }

      console.log(`Prediction ${id} succeeded with URL: ${resultUrl}`)
    } else if (status === "failed") {
      console.error(`Prediction ${id} failed: ${error || "Unknown error"}`)
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error("Error processing Replicate webhook:", error)
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    )
  }
}

