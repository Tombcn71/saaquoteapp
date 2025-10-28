'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AppointmentPicker } from '@/components/appointment-picker'
import { Loader2, Check, Calendar } from 'lucide-react'

export default function BookAppointmentPage() {
  const params = useParams()
  const leadId = params.leadId as string
  
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [appointmentDatetime, setAppointmentDatetime] = useState<string>('')
  const [leadData, setLeadData] = useState<any>(null)

  useEffect(() => {
    // Fetch lead data to show project details
    async function fetchLead() {
      try {
        const response = await fetch(`/api/leads/${leadId}`)
        if (response.ok) {
          const data = await response.json()
          setLeadData(data)
        }
      } catch (error) {
        console.error('Error fetching lead:', error)
      }
    }
    fetchLead()
  }, [leadId])

  const handleSubmit = async () => {
    if (!appointmentDatetime) {
      setError('Selecteer eerst een datum en tijd')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/leads/${leadId}/book-appointment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointmentDatetime })
      })

      const result = await response.json()

      if (result.success) {
        setSuccess(true)
      } else {
        setError(result.error || 'Er ging iets mis')
      }
    } catch (error) {
      setError('Er ging iets mis. Probeer het opnieuw.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8">
        {success ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              ✅ Afspraak Bevestigd!
            </h1>
            <p className="text-gray-600 mb-4">
              Je ontvangt een bevestigingsmail met alle details en een kalenderinvite.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
              <p className="text-sm text-blue-900">
                We bellen je op de afgesproken tijd. Zorg dat je bereikbaar bent!
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-[#4285f4]" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Plan een Gratis Adviesgesprek
              </h1>
              <p className="text-gray-600">
                Kies een datum en tijd die jou het beste uitkomt
              </p>
            </div>

            {leadData && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h2 className="font-semibold text-gray-900 mb-2">Je Project:</h2>
                <p className="text-sm text-gray-600">
                  <strong>Type:</strong> {leadData.form_type || 'Project'}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Geschatte prijs:</strong> €{leadData.quote_total || 'Op aanvraag'}
                </p>
              </div>
            )}

            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-900 mb-3">
                📅 Kies een datum en tijd
              </p>
              <p className="text-xs text-gray-600 mb-4">
                15 minuten telefonisch advies over je project
              </p>
              <AppointmentPicker 
                onAppointmentSelected={setAppointmentDatetime}
                customerName={leadData?.naam || 'Klant'}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <Button
              onClick={handleSubmit}
              disabled={!appointmentDatetime || loading}
              className="w-full bg-[#4285f4] hover:bg-[#3367d6] text-white h-12"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Bevestigen...
                </>
              ) : (
                'Bevestig Afspraak'
              )}
            </Button>

            <p className="text-xs text-center text-gray-500 mt-4">
              Geen verplichtingen · Vrijblijvend advies · Direct antwoord op je vragen
            </p>
          </>
        )}
      </Card>
    </div>
  )
}

