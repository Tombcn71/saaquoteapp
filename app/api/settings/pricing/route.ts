import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

// GET: Fetch pricing configs for the logged-in company
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const companyId = session.user.companyId

    // Fetch all pricing configs for this company
    const configs = await sql`
      SELECT 
        id,
        form_type,
        pricing_data,
        updated_at
      FROM pricing_configs
      WHERE company_id = ${companyId}
      ORDER BY form_type
    `

    // Transform to easier format
    const pricingByFormType = configs.reduce((acc: any, config: any) => {
      acc[config.form_type] = {
        id: config.id,
        ...config.pricing_data,
        updatedAt: config.updated_at
      }
      return acc
    }, {})

    return NextResponse.json({ 
      success: true, 
      pricing: pricingByFormType 
    })

  } catch (error) {
    console.error('Error fetching pricing configs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pricing configs' },
      { status: 500 }
    )
  }
}

// POST: Update pricing configs for the logged-in company
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const companyId = session.user.companyId
    const body = await req.json()
    const { formType, pricingData } = body

    if (!formType || !pricingData) {
      return NextResponse.json(
        { error: 'Missing formType or pricingData' },
        { status: 400 }
      )
    }

    // Valid form types
    const validFormTypes = ['kozijnen', 'vloeren', 'schilderwerk']
    if (!validFormTypes.includes(formType)) {
      return NextResponse.json(
        { error: 'Invalid form type' },
        { status: 400 }
      )
    }

    // Upsert pricing config
    const result = await sql`
      INSERT INTO pricing_configs (company_id, form_type, pricing_data)
      VALUES (${companyId}, ${formType}, ${JSON.stringify(pricingData)})
      ON CONFLICT (company_id, form_type) 
      DO UPDATE SET 
        pricing_data = ${JSON.stringify(pricingData)},
        updated_at = CURRENT_TIMESTAMP
      RETURNING id, form_type, pricing_data, updated_at
    `

    return NextResponse.json({ 
      success: true, 
      config: result[0]
    })

  } catch (error) {
    console.error('Error updating pricing config:', error)
    return NextResponse.json(
      { error: 'Failed to update pricing config' },
      { status: 500 }
    )
  }
}

