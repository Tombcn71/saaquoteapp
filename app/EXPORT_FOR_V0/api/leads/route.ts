import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const maxDuration = 60

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const {
      companyId, // Widget zal company_id meesturen
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
      utmSource,
      utmMedium,
      utmCampaign,
    } = body

    // Validatie
    if (!naam || !email || !materiaal || !kleur || !kozijnType || !glasType || !aantalRamen || !quoteTotal) {
      return NextResponse.json(
        { error: 'Ontbrekende verplichte velden' },
        { status: 400 }
      )
    }

    // Check of company bestaat en actief is
    if (companyId) {
      const { data: company } = await supabase
        .from('companies')
        .select('id, is_active, monthly_quote_limit, monthly_quotes_used')
        .eq('id', companyId)
        .single()

      if (!company) {
        return NextResponse.json(
          { error: 'Bedrijf niet gevonden' },
          { status: 404 }
        )
      }

      if (!company.is_active) {
        return NextResponse.json(
          { error: 'Bedrijf is niet actief' },
          { status: 403 }
        )
      }

      // Check quote limit
      if (company.monthly_quotes_used >= company.monthly_quote_limit) {
        return NextResponse.json(
          { error: 'Maandelijkse quote limiet bereikt' },
          { status: 429 }
        )
      }
    }

    // Lead opslaan
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert({
        company_id: companyId,
        naam,
        email,
        telefoon,
        materiaal,
        kleur,
        kozijn_type: kozijnType,
        glas_type: glasType,
        aantal_ramen: parseInt(aantalRamen),
        vierkante_meter_ramen: vierkanteMeterRamen,
        montage: montage ?? true,
        afvoer_oude_kozijnen: afvoerOudeKozijnen ?? true,
        quote_total: parseFloat(quoteTotal),
        quote_breakdown: quoteBreakdown,
        photo_urls: photoUrls || [],
        preview_urls: previewUrls || [],
        source,
        widget_referrer: widgetReferrer,
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
        status: 'new',
      })
      .select()
      .single()

    if (leadError) {
      console.error('❌ Lead opslaan mislukt:', leadError)
      return NextResponse.json(
        { error: 'Lead opslaan mislukt', details: leadError.message },
        { status: 500 }
      )
    }

    // Update quote counter voor bedrijf
    if (companyId) {
      const { error: updateError } = await supabase.rpc('increment_quote_usage', {
        company_uuid: companyId
      })

      // Als RPC functie niet bestaat, doe manual update
      if (updateError) {
        const { data: company } = await supabase
          .from('companies')
          .select('monthly_quotes_used')
          .eq('id', companyId)
          .single()

        if (company) {
          await supabase
            .from('companies')
            .update({ monthly_quotes_used: company.monthly_quotes_used + 1 })
            .eq('id', companyId)
        }
      }
    }

    // Activity log
    if (companyId) {
      await supabase
        .from('activity_log')
        .insert({
          company_id: companyId,
          action: 'lead_created',
          entity_type: 'lead',
          entity_id: lead.id,
          details: {
            email: email,
            materiaal: materiaal,
            quote_total: quoteTotal,
            source: source,
          },
        })
    }

    console.log('✅ Lead opgeslagen:', lead.id)

    return NextResponse.json({
      success: true,
      leadId: lead.id,
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
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    
    const companyId = searchParams.get('companyId')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')

    // Check auth
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Niet ingelogd' },
        { status: 401 }
      )
    }

    // Query builder
    let query = supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (companyId) {
      query = query.eq('company_id', companyId)
    }

    if (status) {
      query = query.eq('status', status)
    }

    const { data: leads, error } = await query

    if (error) {
      console.error('❌ Leads ophalen mislukt:', error)
      return NextResponse.json(
        { error: 'Leads ophalen mislukt', details: error.message },
        { status: 500 }
      )
    }

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

