import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { hash } from "bcryptjs"
import { randomUUID } from "crypto"

function getDatabase() {
  const connectionString = process.env.NEON_NEON_DATABASE_URL
  if (!connectionString) {
    throw new Error("NEON_DATABASE_URL is not defined")
  }
  return neon(connectionString)
}

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const sql = getDatabase()

    // Check if user already exists
    const existingUsers = await sql`
      SELECT * FROM users WHERE email = ${email}
    `

    if (existingUsers.length > 0) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Create user
    const userId = randomUUID()
    await sql`
      INSERT INTO users (id, email, password, name, created_at, updated_at)
      VALUES (${userId}, ${email}, ${hashedPassword}, ${name || null}, NOW(), NOW())
    `

    return NextResponse.json({ message: "User created successfully" }, { status: 201 })
  } catch (error) {
    console.error("[v0] Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
