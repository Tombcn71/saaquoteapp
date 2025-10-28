import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

function getDatabase() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) throw new Error("DATABASE_URL is not defined")
  return neon(connectionString)
}

export async function GET(
  request: Request,
  { params }: { params: { leadId: string } }
) {
  try {
    const sql = getDatabase()
    
    const leads = await sql`
      SELECT id, naam, email, telefoon, form_type, quote_total, created_at
      FROM leads
      WHERE id = ${params.leadId}
      LIMIT 1
    `

    if (leads.length === 0) {
      return NextResponse.json(
        { error: 'Lead niet gevonden' },
        { status: 404 }
      )
    }

    return NextResponse.json(leads[0])
  } catch (error: any) {
    console.error('Error fetching lead:', error)
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}

