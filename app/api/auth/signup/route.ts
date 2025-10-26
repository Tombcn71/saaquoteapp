import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { hash } from "bcryptjs"
import { randomUUID } from "crypto"

function getDatabase() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error("DATABASE_URL is not defined")
  }
  return neon(connectionString)
}

export async function POST(request: Request) {
  try {
    const { email, password, name, companyName } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
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

    // Generate IDs
    const companyId = randomUUID()
    const userId = randomUUID()
    const widgetId = randomUUID()

    // 1. Create company
    await sql`
      INSERT INTO companies (id, name, email, created_at, updated_at)
      VALUES (${companyId}, ${companyName || name || 'Mijn Bedrijf'}, ${email}, NOW(), NOW())
    `

    // 2. Create user linked to company
    await sql`
      INSERT INTO users (id, email, password, name, company_id, role, created_at, updated_at)
      VALUES (${userId}, ${email}, ${hashedPassword}, ${name || null}, ${companyId}, 'owner', NOW(), NOW())
    `

    // 3. Create default widget for the company
    await sql`
      INSERT INTO widgets (id, company_id, name, is_active, created_at, updated_at)
      VALUES (${widgetId}, ${companyId}, 'Mijn Widget', true, NOW(), NOW())
    `

    return NextResponse.json({ 
      message: "Account created successfully",
      companyId,
      userId,
      widgetId
    }, { status: 201 })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
