import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { randomUUID } from 'crypto'
import { sendAppointmentConfirmation, sendBusinessNotification } from '@/lib/email'

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
      formType = 'kozijnen', // Default to kozijnen for backwards compatibility
      formData,
      customerInfo,
      photos = [],
      estimatedPrice,
      appointmentDatetime,
      // Legacy kozijnen fields (for backwards compatibility)
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

    // Extract customer info (new format or legacy)
    const customerName = customerInfo?.name || naam
    const customerEmail = customerInfo?.email || email
    const customerPhone = customerInfo?.phone || telefoon

    // Validatie
    if (!customerName || !customerEmail) {
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
    
    // Determine final values (new format or legacy)
    const finalPhotoUrls = photos.length > 0 ? photos : (photoUrls || [])
    const finalQuoteTotal = estimatedPrice || quoteTotal
    
    // Convert arrays to PostgreSQL format
    const photoUrlsArray = Array.isArray(finalPhotoUrls) ? finalPhotoUrls : []
    const previewUrlsArray = Array.isArray(previewUrls) ? previewUrls : []
    
    await sql`
      INSERT INTO leads (
        id,
        company_id,
        widget_id,
        form_type,
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
        appointment_datetime,
        appointment_status,
        created_at,
        updated_at
      ) VALUES (
        ${leadId},
        ${companyId || null},
        ${widgetId || null},
        ${formType},
        ${customerName},
        ${customerEmail},
        ${customerPhone || null},
        ${formData?.material || materiaal || null},
        ${formData?.color || formData?.style || kleur || null},
        ${formData?.type || kozijnType || null},
        ${formData?.glassType || glasType || null},
        ${formData?.windowCount || aantalRamen || null},
        ${formData?.surfaceArea || vierkanteMeterRamen || null},
        ${formData?.installation ?? montage ?? true},
        ${formData?.removeOld ?? afvoerOudeKozijnen ?? false},
        ${finalQuoteTotal ? parseFloat(finalQuoteTotal.toString()) : null},
        ${formData ? JSON.stringify(formData) : (quoteBreakdown ? JSON.stringify(quoteBreakdown) : null)},
        ${photoUrlsArray},
        ${previewUrlsArray},
        ${source},
        ${widgetReferrer || null},
        'new',
        ${appointmentDatetime || null},
        ${appointmentDatetime ? 'scheduled' : null},
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

    // Send email notifications if appointment is scheduled
    if (appointmentDatetime && companyId) {
      try {
        // Get company details for email
        const companies = await sql`
          SELECT * FROM companies WHERE id = ${companyId}
        `
        
        if (companies.length > 0) {
          const company = companies[0]
          
          // Format project type for display
          const projectTypeMap: { [key: string]: string } = {
            'kozijnen': 'Kozijnen',
            'vloeren': 'Vloeren',
            'schilderwerk': 'Schilderwerk'
          }
          const projectType = projectTypeMap[formType] || formType
          
          // Format price
          const formattedPrice = finalQuoteTotal 
            ? `€${parseFloat(finalQuoteTotal.toString()).toLocaleString('nl-NL')}`
            : 'Op aanvraag'

          const baseUrl = process.env.NEXTAUTH_URL || 'https://saaquoteapp.vercel.app'

          // Appointment is now required, so appointmentDatetime should always exist
          if (appointmentDatetime) {
            const appointmentDate = new Date(appointmentDatetime)
            const formatDate = (date: Date) => {
              const days = ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag']
              const months = ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec']
              return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
            }
            const formatTime = (date: Date) => {
              return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
            }

            const formattedDate = formatDate(appointmentDate)
            const formattedTime = formatTime(appointmentDate)

            // Send confirmation to customer
            await sendAppointmentConfirmation({
              to: customerEmail,
              customerName,
              companyName: company.name,
              companyEmail: company.owner_email,
              companyPhone: company.owner_email, // TODO: Add phone field to companies table
              projectType,
              estimatedPrice: formattedPrice,
              appointmentDate: formattedDate,
              appointmentTime: formattedTime,
              previewUrl: previewUrlsArray.length > 0 ? previewUrlsArray[0] : undefined
            })

            // Send notification to business
            await sendBusinessNotification({
              to: company.owner_email,
              businessName: company.name,
              leadName: customerName,
              leadEmail: customerEmail,
              leadPhone: customerPhone || 'Niet opgegeven',
              projectType,
              estimatedPrice: formattedPrice,
              appointmentDate: formattedDate,
              appointmentTime: formattedTime,
              dashboardUrl: `${baseUrl}/dashboard/leads`
            })
          }

          console.log('✅ Email notificaties verstuurd')
        }
      } catch (emailError) {
        console.error('❌ Email error (lead still saved):', emailError)
        // Don't fail the request if email fails
      }
    }

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
