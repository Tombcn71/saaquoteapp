import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { randomUUID } from 'crypto'

export const maxDuration = 60

function getDatabase() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) throw new Error("DATABASE_URL is not defined")
  return neon(connectionString)
}

export async function POST(request: Request) {
  try {
    const sql = getDatabase()
    const body = await request.json()

    const {
      companyId,
      widgetId,
      naam,
      email,
      telefoon,
      materiaal,
      kleur,
      kozijnType,
      glasType,
      aantalRamen,
      vierkanteMeterRamen,
      montage,
      afvoerOudeKozijnen,
      quoteTotal,
      quoteBreakdown,
      photoUrls,
      previewUrls,
      source = 'widget',
      widgetReferrer,
    } = body

    // Validatie
    if (!naam || !email) {
      return NextResponse.json(
        { error: 'Naam en email zijn verplicht' },
        { status: 400 }
      )
    }

    // Als companyId meegegeven, check of company bestaat
    if (companyId) {
      const companies = await sql`
        SELECT * FROM companies WHERE id = ${companyId}
      `
      
      if (companies.length === 0) {
        return NextResponse.json(
          { error: 'Bedrijf niet gevonden' },
          { status: 404 }
        )
      }

      const company = companies[0]

      // Check leads limit
      if (company.leads_used >= company.leads_limit) {
        return NextResponse.json(
          { error: 'Maandelijkse leads limiet bereikt' },
          { status: 429 }
        )
      }
    }

    // Lead opslaan
    const leadId = randomUUID()
    
    await sql`
      INSERT INTO leads (
        id,
        company_id,
        widget_id,
        naam,
        email,
        telefoon,
        materiaal,
        kleur,
        kozijn_type,
        glas_type,
        aantal_ramen,
        vierkante_meter_ramen,
        montage,
        afvoer_oude_kozijnen,
        quote_total,
        quote_breakdown,
        photo_urls,
        preview_urls,
        source,
        widget_referrer,
        status,
        created_at,
        updated_at
      ) VALUES (
        ${leadId},
        ${companyId || null},
        ${widgetId || null},
        ${naam},
        ${email},
        ${telefoon || null},
        ${materiaal || null},
        ${kleur || null},
        ${kozijnType || null},
        ${glasType || null},
        ${aantalRamen || null},
        ${vierkanteMeterRamen || null},
        ${montage ?? true},
        ${afvoerOudeKozijnen ?? false},
        ${quoteTotal ? parseFloat(quoteTotal) : null},
        ${quoteBreakdown ? JSON.stringify(quoteBreakdown) : null},
        ${photoUrls ? JSON.stringify(photoUrls) : '[]'},
        ${previewUrls ? JSON.stringify(previewUrls) : '[]'},
        ${source},
        ${widgetReferrer || null},
        'new',
        NOW(),
        NOW()
      )
    `

    // Update leads counter voor bedrijf
    if (companyId) {
      await sql`
        UPDATE companies 
        SET leads_used = leads_used + 1,
            updated_at = NOW()
        WHERE id = ${companyId}
      `
    }

    // Update widget stats
    if (widgetId) {
      await sql`
        UPDATE widgets 
        SET conversions = conversions + 1,
            updated_at = NOW()
        WHERE id = ${widgetId}
      `
    }

    console.log('✅ Lead opgeslagen:', leadId)

    return NextResponse.json({
      success: true,
      leadId: leadId,
      message: 'Offerte succesvol opgeslagen',
    })

  } catch (error: any) {
    console.error('❌ Lead API error:', error)
    return NextResponse.json(
      { 
        error: 'Server fout',
        details: error.message 
      },
      { status: 500 }
    )
  }
}

// GET endpoint voor ophalen leads (voor dashboard)
export async function GET(request: Request) {
  try {
    const sql = getDatabase()
    const { searchParams } = new URL(request.url)
    
    const companyId = searchParams.get('companyId')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')

    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is verplicht' },
        { status: 400 }
      )
    }

    let query = `
      SELECT * FROM leads 
      WHERE company_id = $1
      ${status ? 'AND status = $2' : ''}
      ORDER BY created_at DESC
      LIMIT ${limit}
    `

    const leads = status 
      ? await sql(query, [companyId, status])
      : await sql(query, [companyId])

    return NextResponse.json({
      success: true,
      leads: leads || [],
      count: leads?.length || 0,
    })

  } catch (error: any) {
    console.error('❌ GET Leads error:', error)
    return NextResponse.json(
      { error: 'Server fout', details: error.message },
      { status: 500 }
    )
  }
}
