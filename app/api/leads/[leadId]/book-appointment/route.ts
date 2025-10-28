import { NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import { sendAppointmentConfirmation, sendBusinessNotification } from '@/lib/email'

function getDatabase() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) throw new Error("DATABASE_URL is not defined")
  return neon(connectionString)
}

export async function POST(
  request: Request,
  { params }: { params: { leadId: string } }
) {
  try {
    const { appointmentDatetime } = await request.json()

    if (!appointmentDatetime) {
      return NextResponse.json(
        { success: false, error: 'Appointment datetime is required' },
        { status: 400 }
      )
    }

    const sql = getDatabase()

    // Update lead with appointment
    await sql`
      UPDATE leads
      SET 
        appointment_datetime = ${appointmentDatetime},
        appointment_status = 'scheduled',
        updated_at = NOW()
      WHERE id = ${params.leadId}
    `

    // Fetch updated lead with company info
    const leads = await sql`
      SELECT l.*, c.name as company_name, c.owner_email as company_email
      FROM leads l
      LEFT JOIN companies c ON l.company_id = c.id
      WHERE l.id = ${params.leadId}
      LIMIT 1
    `

    if (leads.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Lead not found' },
        { status: 404 }
      )
    }

    const lead = leads[0]

    // Send confirmation emails
    try {
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

      const projectTypeMap: { [key: string]: string } = {
        'kozijnen': 'Kozijnen',
        'vloeren': 'Vloeren',
        'schilderwerk': 'Schilderwerk'
      }
      const projectType = projectTypeMap[lead.form_type] || lead.form_type

      const formattedPrice = lead.quote_total 
        ? `€${parseFloat(lead.quote_total.toString()).toLocaleString('nl-NL')}`
        : 'Op aanvraag'

      // Send to customer
      if (lead.company_email) {
        await sendAppointmentConfirmation({
          to: lead.email,
          customerName: lead.naam,
          companyName: lead.company_name || 'QuoteForm',
          companyEmail: lead.company_email,
          companyPhone: lead.company_email,
          projectType,
          estimatedPrice: formattedPrice,
          appointmentDate: formattedDate,
          appointmentTime: formattedTime,
          previewUrl: lead.preview_urls?.[0]
        })

        // Send to business
        const baseUrl = process.env.NEXTAUTH_URL || 'https://saaquoteapp.vercel.app'
        await sendBusinessNotification({
          to: lead.company_email,
          businessName: lead.company_name,
          leadName: lead.naam,
          leadEmail: lead.email,
          leadPhone: lead.telefoon || 'Niet opgegeven',
          projectType,
          estimatedPrice: formattedPrice,
          appointmentDate: formattedDate,
          appointmentTime: formattedTime,
          dashboardUrl: `${baseUrl}/dashboard/leads`
        })
      }

      console.log('✅ Appointment confirmation emails sent')
    } catch (emailError) {
      console.error('❌ Email error:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Appointment booked successfully'
    })

  } catch (error: any) {
    console.error('Error booking appointment:', error)
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    )
  }
}

