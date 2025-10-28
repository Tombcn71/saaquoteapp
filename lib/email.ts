import { Resend } from 'resend'

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('⚠️ RESEND_API_KEY not configured - emails will not be sent')
    return null
  }
  return new Resend(apiKey)
}

interface SendAppointmentConfirmationParams {
  to: string
  customerName: string
  companyName: string
  companyEmail: string
  companyPhone: string
  projectType: string
  estimatedPrice: string
  appointmentDate: string
  appointmentTime: string
  previewUrl?: string
}

interface SendBusinessNotificationParams {
  to: string
  businessName: string
  leadName: string
  leadEmail: string
  leadPhone: string
  projectType: string
  estimatedPrice: string
  appointmentDate: string
  appointmentTime: string
  dashboardUrl: string
}

export async function sendAppointmentConfirmation(params: SendAppointmentConfirmationParams) {
  const {
    to,
    customerName,
    companyName,
    companyEmail,
    companyPhone,
    projectType,
    estimatedPrice,
    appointmentDate,
    appointmentTime,
    previewUrl
  } = params

  const icsContent = generateICS({
    summary: `Adviesgesprek - ${projectType}`,
    description: `Gratis adviesgesprek met ${companyName} over je ${projectType} project (${estimatedPrice})`,
    location: 'Telefonisch',
    startDate: appointmentDate,
    startTime: appointmentTime,
    duration: 30,
    organizerEmail: companyEmail,
    organizerName: companyName,
    attendeeEmail: to,
    attendeeName: customerName
  })

  try {
    const resend = getResendClient()
    if (!resend) {
      console.log('📧 Skipping customer confirmation email - Resend not configured')
      return { success: true, skipped: true }
    }

    const { data, error } = await resend.emails.send({
      from: 'QuoteForm <noreply@yourdomain.com>', // Update this with your verified domain
      to: [to],
      subject: `✅ Afspraak bevestigd - ${projectType}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
              .header { background: linear-gradient(135deg, #4285f4 0%, #3367d6 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9f9f9; padding: 30px; }
              .card { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4285f4; }
              .button { display: inline-block; background: #4285f4; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 10px 0; }
              .footer { background: #f0f0f0; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; }
              .highlight { background: #e8f0fe; padding: 15px; border-radius: 6px; margin: 15px 0; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1 style="margin: 0;">✅ Afspraak Bevestigd!</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Bedankt voor je aanvraag, ${customerName}</p>
            </div>
            
            <div class="content">
              <h2 style="color: #4285f4;">Je Prijsindicatie</h2>
              <div class="card">
                <p style="margin: 0;"><strong>Project:</strong> ${projectType}</p>
                <p style="margin: 10px 0 0 0;"><strong>Geschatte prijs:</strong> ${estimatedPrice}</p>
              </div>

              ${previewUrl ? `
              <a href="${previewUrl}" class="button">🎨 Bekijk je AI Preview</a>
              ` : ''}

              <h2 style="color: #4285f4; margin-top: 30px;">📅 Jouw Gratis Adviesgesprek</h2>
              <div class="highlight">
                <p style="margin: 0; font-size: 18px;"><strong>📅 ${appointmentDate}</strong></p>
                <p style="margin: 10px 0 0 0; font-size: 18px;"><strong>🕐 ${appointmentTime} uur</strong></p>
              </div>
              <p style="margin-top: 15px;">We bellen je op dit moment om de details te bespreken en al je vragen te beantwoorden!</p>

              <a href="data:text/calendar;charset=utf8,${encodeURIComponent(icsContent)}" download="afspraak.ics" class="button">
                📥 Voeg toe aan kalender
              </a>

              <h3 style="color: #333; margin-top: 30px;">Contact met ${companyName}</h3>
              <div class="card">
                <p style="margin: 0;">📧 <strong>Email:</strong> ${companyEmail}</p>
                <p style="margin: 10px 0 0 0;">📞 <strong>Telefoon:</strong> ${companyPhone}</p>
              </div>

              <p style="font-size: 14px; color: #666; margin-top: 30px;">
                <strong>Afspraak wijzigen?</strong><br>
                Neem contact op met ${companyName} via bovenstaande gegevens.
              </p>
            </div>

            <div class="footer">
              <p style="margin: 0;">Powered by <strong>QuoteForm</strong></p>
              <p style="margin: 5px 0 0 0;">AI-powered quotes voor jouw project</p>
            </div>
          </body>
        </html>
      `,
      attachments: [
        {
          filename: 'afspraak.ics',
          content: Buffer.from(icsContent).toString('base64'),
        }
      ]
    })

    if (error) {
      console.error('❌ Email send error:', error)
      return { success: false, error }
    }

    console.log('✅ Confirmation email sent:', data)
    return { success: true, data }
  } catch (error) {
    console.error('❌ Email send exception:', error)
    return { success: false, error }
  }
}

interface SendQuoteOnlyParams {
  to: string
  customerName: string
  companyName: string
  companyEmail: string
  companyPhone: string
  projectType: string
  estimatedPrice: string
  previewUrl?: string
  bookingUrl: string
  leadId: string
}

export async function sendQuoteOnly(params: SendQuoteOnlyParams) {
  const {
    to,
    customerName,
    companyName,
    companyEmail,
    companyPhone,
    projectType,
    estimatedPrice,
    previewUrl,
    bookingUrl
  } = params

  try {
    const resend = getResendClient()
    if (!resend) {
      console.log('📧 Skipping quote email - Resend not configured')
      return { success: true, skipped: true }
    }

    const { data, error } = await resend.emails.send({
      from: 'QuoteForm <noreply@yourdomain.com>',
      to: [to],
      subject: `📋 Je Offerte - ${projectType}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
              .header { background: linear-gradient(135deg, #4285f4 0%, #3367d6 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9f9f9; padding: 30px; }
              .card { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4285f4; }
              .button { display: inline-block; background: #4285f4; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 10px 0; }
              .button-secondary { display: inline-block; background: #34a853; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 10px 0; }
              .footer { background: #f0f0f0; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; }
              .highlight { background: #e8f0fe; padding: 15px; border-radius: 6px; margin: 15px 0; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1 style="margin: 0;">📋 Je Offerte is Klaar!</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Bedankt voor je aanvraag, ${customerName}</p>
            </div>
            
            <div class="content">
              <h2 style="color: #4285f4;">Je Prijsindicatie</h2>
              <div class="card">
                <p style="margin: 0;"><strong>Project:</strong> ${projectType}</p>
                <p style="margin: 10px 0 0 0;"><strong>Geschatte prijs:</strong> ${estimatedPrice}</p>
              </div>

              ${previewUrl ? `
              <a href="${previewUrl}" class="button">🎨 Bekijk je AI Preview</a>
              ` : ''}

              <div class="highlight">
                <h3 style="color: #34a853; margin: 0 0 10px 0;">📞 Wil je een gratis adviesgesprek?</h3>
                <p style="margin: 0;">Plan een 15-minuten telefonisch advies om je project te bespreken. Geen verplichtingen!</p>
                <a href="${bookingUrl}" class="button-secondary" style="display: inline-block; margin-top: 15px;">
                  📅 Plan Gratis Adviesgesprek
                </a>
              </div>

              <h3 style="color: #333; margin-top: 30px;">Contact met ${companyName}</h3>
              <div class="card">
                <p style="margin: 0;">📧 <strong>Email:</strong> ${companyEmail}</p>
                <p style="margin: 10px 0 0 0;">📞 <strong>Telefoon:</strong> ${companyPhone}</p>
              </div>

              <p style="font-size: 14px; color: #666; margin-top: 30px;">
                <strong>Vragen?</strong><br>
                Neem contact op met ${companyName} via bovenstaande gegevens.
              </p>
            </div>

            <div class="footer">
              <p style="margin: 0;">Powered by <strong>QuoteForm</strong></p>
              <p style="margin: 5px 0 0 0;">AI-powered quotes voor jouw project</p>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('❌ Email send error:', error)
      return { success: false, error }
    }

    console.log('✅ Quote email sent:', data)
    return { success: true, data }
  } catch (error) {
    console.error('❌ Email send exception:', error)
    return { success: false, error }
  }
}

export async function sendBusinessNotification(params: SendBusinessNotificationParams) {
  const {
    to,
    businessName,
    leadName,
    leadEmail,
    leadPhone,
    projectType,
    estimatedPrice,
    appointmentDate,
    appointmentTime,
    dashboardUrl
  } = params

  try {
    const resend = getResendClient()
    if (!resend) {
      console.log('📧 Skipping business notification email - Resend not configured')
      return { success: true, skipped: true }
    }

    const { data, error } = await resend.emails.send({
      from: 'QuoteForm <noreply@yourdomain.com>', // Update this with your verified domain
      to: [to],
      subject: `🔔 Nieuwe Lead met Afspraak - ${leadName}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
              .header { background: linear-gradient(135deg, #34a853 0%, #0f9d58 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9f9f9; padding: 30px; }
              .card { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #34a853; }
              .button { display: inline-block; background: #4285f4; color: white; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 10px 0; }
              .urgent { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 6px; margin: 15px 0; }
              .footer { background: #f0f0f0; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1 style="margin: 0;">🔔 Nieuwe Lead!</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Met geplande afspraak</p>
            </div>
            
            <div class="content">
              <div class="urgent">
                <p style="margin: 0; font-size: 16px;"><strong>⚠️ Afspraak:</strong> ${appointmentDate} om ${appointmentTime}</p>
                <p style="margin: 5px 0 0 0; font-size: 14px;">Zorg dat je beschikbaar bent om te bellen!</p>
              </div>

              <h2 style="color: #34a853;">Lead Details</h2>
              <div class="card">
                <p style="margin: 0;"><strong>📝 Naam:</strong> ${leadName}</p>
                <p style="margin: 10px 0 0 0;"><strong>📧 Email:</strong> ${leadEmail}</p>
                <p style="margin: 10px 0 0 0;"><strong>📞 Telefoon:</strong> <a href="tel:${leadPhone}" style="color: #4285f4; font-size: 18px; font-weight: bold;">${leadPhone}</a></p>
              </div>

              <h2 style="color: #34a853;">Project Info</h2>
              <div class="card">
                <p style="margin: 0;"><strong>Type:</strong> ${projectType}</p>
                <p style="margin: 10px 0 0 0;"><strong>Geschatte prijs:</strong> ${estimatedPrice}</p>
              </div>

              <a href="${dashboardUrl}" class="button">
                📊 Bekijk in Dashboard
              </a>

              <p style="font-size: 14px; color: #666; margin-top: 30px;">
                💡 <strong>Tip:</strong> Leads die snel worden beantwoord converteren 9x beter!<br>
                Bel ${leadName} op de afgesproken tijd en sluit deze deal! 💪
              </p>
            </div>

            <div class="footer">
              <p style="margin: 0;">QuoteForm - Meer leads met slimme AI quotes</p>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('❌ Business notification error:', error)
      return { success: false, error }
    }

    console.log('✅ Business notification sent:', data)
    return { success: true, data }
  } catch (error) {
    console.error('❌ Business notification exception:', error)
    return { success: false, error }
  }
}

// ICS Calendar file generator
interface GenerateICSParams {
  summary: string
  description: string
  location: string
  startDate: string // YYYY-MM-DD
  startTime: string // HH:MM
  duration: number // minutes
  organizerEmail: string
  organizerName: string
  attendeeEmail: string
  attendeeName: string
}

function generateICS(params: GenerateICSParams): string {
  const {
    summary,
    description,
    location,
    startDate,
    startTime,
    duration,
    organizerEmail,
    organizerName,
    attendeeEmail,
    attendeeName
  } = params

  // Parse date and time
  const [year, month, day] = startDate.split('-')
  const [hours, minutes] = startTime.split(':')
  
  // Create start datetime
  const start = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes))
  
  // Create end datetime
  const end = new Date(start.getTime() + duration * 60000)

  // Format to ICS datetime (YYYYMMDDTHHMMSS)
  const formatICSDate = (date: Date) => {
    const pad = (n: number) => n.toString().padStart(2, '0')
    return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(date.getHours())}${pad(date.getMinutes())}00`
  }

  const dtStart = formatICSDate(start)
  const dtEnd = formatICSDate(end)
  const dtStamp = formatICSDate(new Date())

  // Generate unique ID
  const uid = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}@quoteform.app`

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//QuoteForm//Appointment//EN
CALSCALE:GREGORIAN
METHOD:REQUEST
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${dtStamp}
DTSTART:${dtStart}
DTEND:${dtEnd}
SUMMARY:${summary}
DESCRIPTION:${description}
LOCATION:${location}
ORGANIZER;CN=${organizerName}:mailto:${organizerEmail}
ATTENDEE;CN=${attendeeName};RSVP=TRUE:mailto:${attendeeEmail}
STATUS:CONFIRMED
SEQUENCE:0
BEGIN:VALARM
TRIGGER:-PT15M
ACTION:DISPLAY
DESCRIPTION:Reminder: ${summary} in 15 minutes
END:VALARM
END:VEVENT
END:VCALENDAR`
}

