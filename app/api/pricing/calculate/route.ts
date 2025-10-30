import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { calculateVloerenPrice } from '@/lib/pricing/vloeren-calculator'
import { calculateSchilderwerkPrice } from '@/lib/pricing/schilderwerk-calculator'

function getDatabase() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) throw new Error("DATABASE_URL is not defined")
  return neon(connectionString)
}

export async function POST(req: NextRequest) {
  try {
    const sql = getDatabase()
    const { formType, formData, companyId } = await req.json()

    if (!formType || !formData) {
      return NextResponse.json({ error: 'Missing formType or formData' }, { status: 400 })
    }

    // Fetch pricing config for the company (or use default)
    let pricingConfig
    if (companyId) {
      const configs = await sql`
        SELECT pricing_data 
        FROM pricing_configs 
        WHERE company_id = ${companyId} AND form_type = ${formType}
        LIMIT 1
      `
      if (configs.length > 0) {
        pricingConfig = configs[0].pricing_data
      }
    }

    // Use defaults if no company-specific config
    if (!pricingConfig) {
      if (formType === 'vloeren') {
        pricingConfig = {
          price_per_m2: { hout: 75, pvc: 45 },
          installation_cost_per_m2: 15,
          minimum_order: 100
        }
      } else if (formType === 'schilderwerk') {
        pricingConfig = {
          price_per_m2: { binnen: 12, buiten: 18 },
          labor_cost_per_m2: 8,
          minimum_order: 150
        }
      } else {
        return NextResponse.json({ error: 'Invalid form type' }, { status: 400 })
      }
    }

    // Calculate price based on form type
    let priceBreakdown
    if (formType === 'vloeren') {
      priceBreakdown = calculateVloerenPrice(formData, pricingConfig)
    } else if (formType === 'schilderwerk') {
      priceBreakdown = calculateSchilderwerkPrice(formData, pricingConfig)
    } else {
      return NextResponse.json({ error: 'Unsupported form type' }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      ...priceBreakdown
    })

  } catch (error) {
    console.error('Error calculating price:', error)
    return NextResponse.json(
      { error: 'Failed to calculate price' },
      { status: 500 }
    )
  }
}

