'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, Sparkles, X, Loader2, CheckCircle, Check } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { AppointmentPicker } from '@/components/appointment-picker'

interface VloerenQuoteFormProps {
  companyId?: string
  widgetId?: string
  className?: string
}

export function VloerenQuoteForm({ companyId, widgetId, className = '' }: VloerenQuoteFormProps) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null)
  const [appointmentDatetime, setAppointmentDatetime] = useState<string>('')
  
  const [formData, setFormData] = useState({
    type: '',
    surfaceArea: '',
    style: '',
    underfloorHeating: '',
    companyName: '',
    name: '',
    email: '',
    phone: '',
  })

  const [photos, setPhotos] = useState<File[]>([])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setPhotos(prev => [...prev, ...acceptedFiles].slice(0, 5))
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    maxFiles: 5
  })

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index))
  }

  const handleNext = () => {
    setStep(step + 1)
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  const handleSubmit = async () => {
    setLoading(true)

    try {
      // Upload photos first
      const uploadedPhotoUrls = await Promise.all(
        photos.map(async (file) => {
          const formData = new FormData()
          formData.append('file', file)
          const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData
          })
          const data = await res.json()
          return data.url
        })
      )

      // Submit lead
      const leadData = {
        formType: 'vloeren',
        formData: {
          type: formData.type,
          surfaceArea: parseFloat(formData.surfaceArea),
          style: formData.style,
          underfloorHeating: formData.underfloorHeating === 'yes'
        },
        customerInfo: {
          companyName: formData.companyName,
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        },
        photos: uploadedPhotoUrls,
        companyId,
        widgetId,
        estimatedPrice,
        appointmentDatetime: appointmentDatetime || null
      }

      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData)
      })

      const result = await response.json()

      if (result.success) {
        setSubmitted(true)
      } else {
        alert('Er ging iets mis. Probeer het opnieuw.')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Er ging iets mis. Probeer het opnieuw.')
    } finally {
      setLoading(false)
    }
  }

  // Calculate price when moving to step 3
  const calculatePrice = async () => {
    if (!formData.surfaceArea || !formData.type) return

    try {
      const res = await fetch('/api/pricing/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formType: 'vloeren',
          formData: {
            type: formData.type.startsWith('hout') ? 'hout' : 'pvc',
            surfaceArea: parseFloat(formData.surfaceArea)
          },
          companyId
        })
      })

      const data = await res.json()
      if (data.success) {
        setEstimatedPrice(data.total)
      }
    } catch (error) {
      console.error('Error calculating price:', error)
      // Fallback to simple calculation
      const basePrice = formData.type.startsWith('hout') ? 75 : 45
      const area = parseFloat(formData.surfaceArea)
      setEstimatedPrice(Math.round((basePrice + 15) * area))
    }
  }

  if (submitted) {
    return (
      <Card className={`overflow-hidden bg-white shadow-2xl border-0 p-0 ${className}`}>
        <div className="bg-[#4285f4] px-4 sm:px-6 lg:px-8 py-6 rounded-t-xl">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
            <h2 className="font-bold text-base sm:text-lg lg:text-xl text-white">
              Bedankt voor uw aanvraag!
            </h2>
          </div>
        </div>
        <div className="px-4 sm:px-6 lg:px-8 py-12 text-center space-y-4">
          <p className="text-lg text-gray-900">
            We hebben uw offerte aanvraag ontvangen en nemen binnen 24 uur contact met u op.
          </p>
          {estimatedPrice && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 inline-block">
              <p className="text-sm text-gray-600 mb-1">Geschatte prijs</p>
              <p className="text-3xl font-bold text-[#4285f4]">
                {new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(estimatedPrice)}
              </p>
            </div>
          )}
        </div>
      </Card>
    )
  }

  return (
    <Card className={`overflow-hidden bg-white shadow-2xl border-0 p-0 ${className}`}>
      <div className="bg-[#4285f4] px-4 sm:px-6 lg:px-8 py-6 rounded-t-xl">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
          <h2 className="font-bold text-base sm:text-lg lg:text-xl text-white">
            Direct een prijsindicatie van uw nieuwe vloer.
          </h2>
        </div>
        <p className="text-xs sm:text-sm italic text-blue-100">
          Vul uw voorkeuren in voor de nieuwe vloer
        </p>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between mb-2 text-sm text-gray-600">
            <span>Stap {step} van 3</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-[#4285f4] h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Vloer details */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold mb-3 block">Wat voor type vloer?</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'hout', label: 'Houten vloer' },
                  { value: 'pvc', label: 'PVC vloer' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFormData({ ...formData, type: option.value })}
                    className={`p-4 border-2 rounded-lg text-sm font-medium transition-all ${
                      formData.type === option.value
                        ? 'border-[#4285f4] bg-blue-50 text-[#4285f4]'
                        : 'border-gray-200 hover:border-[#4285f4]'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="surfaceArea">Oppervlakte (m²)</Label>
              <Input
                id="surfaceArea"
                type="number"
                placeholder="Bijv. 30"
                value={formData.surfaceArea}
                onChange={(e) => setFormData({ ...formData, surfaceArea: e.target.value })}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="style">Gewenste kleur/stijl (optioneel)</Label>
              <Input
                id="style"
                type="text"
                placeholder="Bijv. Licht eiken visgraat"
                value={formData.style}
                onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                className="mt-2"
              />
            </div>

            <Button
              onClick={handleNext}
              disabled={!formData.type || !formData.surfaceArea}
              className="w-full bg-[#4285f4] hover:bg-[#3367d6] text-white"
            >
              Volgende: Upload foto's
            </Button>
          </div>
        )}

        {/* Step 2: Photos */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold mb-3 block">Upload foto's van de ruimte (optioneel)</Label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                  isDragActive ? 'border-[#4285f4] bg-blue-50' : 'border-gray-300 hover:border-[#4285f4]'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p className="text-sm text-gray-600 mb-2">
                  {isDragActive ? 'Sleep hier...' : 'Klik om foto\'s te uploaden'}
                </p>
                <p className="text-xs text-gray-400">Of sleep foto's hierheen (max 5)</p>
              </div>

              {photos.length > 0 && (
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {photos.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removePhoto(index)}
                        className="absolute top-2 right-2 bg-[#4285f4]/80 hover:bg-[#4285f4] text-white rounded-full p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label className="text-base font-semibold mb-3 block">Vloerverwarming aanwezig?</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'yes', label: 'Ja' },
                  { value: 'no', label: 'Nee' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFormData({ ...formData, underfloorHeating: option.value })}
                    className={`p-4 border-2 rounded-lg text-sm font-medium transition-all ${
                      formData.underfloorHeating === option.value
                        ? 'border-[#4285f4] bg-blue-50 text-[#4285f4]'
                        : 'border-gray-200 hover:border-[#4285f4]'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleBack} variant="outline" className="flex-1">
                Vorige
              </Button>
              <Button
                onClick={() => {
                  calculatePrice()
                  handleNext()
                }}
                className="flex-1 bg-[#4285f4] hover:bg-[#3367d6] text-white"
              >
                Volgende: Contactgegevens
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Contact & Submit */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <Label htmlFor="companyName">Bedrijfsnaam (optioneel)</Label>
              <Input
                id="companyName"
                type="text"
                placeholder="Uw bedrijf"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="name">Naam *</Label>
              <Input
                id="name"
                type="text"
                placeholder="Uw naam"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="email">E-mailadres *</Label>
              <Input
                id="email"
                type="email"
                placeholder="uw@email.nl"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="phone">Telefoonnummer (optioneel)</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="06-12345678"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mt-2"
              />
            </div>

            {estimatedPrice !== null && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm font-semibold text-blue-900 mb-2">📊 Geschatte prijs</p>
                <p className="text-2xl font-bold text-[#4285f4]">
                  {new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(estimatedPrice)}
                </p>
                <p className="text-xs text-gray-600 mt-1">Inclusief leggen, exclusief BTW</p>
              </div>
            )}

            {!submitted && formData.name && formData.email && (
              <div className="mb-4">
                <div className="mb-3">
                  <p className="text-sm font-semibold text-foreground mb-2">📅 Plan gratis adviesgesprek voor precieze offerte</p>
                  <p className="text-xs text-muted-foreground mb-3">
                    In 15 minuten bepalen we samen de exacte prijs. Deze valt meestal lager uit! 💰
                  </p>
                </div>
                <AppointmentPicker 
                  onAppointmentSelected={setAppointmentDatetime}
                  customerName={formData.name}
                />
              </div>
            )}

            <div className="flex gap-3">
              <Button onClick={handleBack} variant="outline" className="flex-1">
                Vorige
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!formData.email || !formData.name || !appointmentDatetime || loading || submitted}
                className="flex-1 bg-[#4285f4] hover:bg-[#3367d6] text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verzenden...
                  </>
                ) : submitted ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Verzonden! Check je email voor bevestiging
                  </>
                ) : (
                  'Bevestig Afspraak & Verzenden'
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
