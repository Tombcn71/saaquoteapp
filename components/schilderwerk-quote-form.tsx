'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload } from 'lucide-react'

export function SchilderwerkQuoteForm() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    type: '',
    color: '',
    area: '',
    ceiling: '',
    email: '',
    phone: '',
    name: ''
  })

  const handleNext = () => {
    setStep(step + 1)
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  const handleSubmit = async () => {
    // Hier komt later de API call
    alert('Schilderwerk offerte verstuurd! (Demo)')
  }

  return (
    <Card className="w-full bg-white">
      <CardHeader className="bg-[#4285f4] text-white -mx-6 -mt-6 px-6 py-4 rounded-t-lg">
        <h3 className="text-xl font-bold">Direct een prijsindicatie en AI preview van uw geschilderde ruimte</h3>
        <p className="text-sm opacity-90">Vul uw voorkeuren in voor het schilderwerk</p>
      </CardHeader>

      <CardContent className="pt-6">
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

        {/* Step 1: Type Verf & Kleur */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold mb-3 block">Type verf</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'latex', label: 'Latex (muurverf)' },
                  { value: 'acryl', label: 'Acrylaat (buiten)' },
                  { value: 'primer', label: 'Primer + Latex' },
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
              <Label className="text-base font-semibold mb-3 block">Kleur</Label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'wit', label: 'Wit' },
                  { value: 'gebroken-wit', label: 'Gebroken wit' },
                  { value: 'grijs', label: 'Grijs' },
                  { value: 'blauw', label: 'Blauw' },
                  { value: 'groen', label: 'Groen' },
                  { value: 'custom', label: 'Custom (RAL)' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFormData({ ...formData, color: option.value })}
                    className={`p-3 border-2 rounded-lg text-sm font-medium transition-all ${
                      formData.color === option.value
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
              <Label htmlFor="area">Oppervlakte muren (m²)</Label>
              <Input
                id="area"
                type="number"
                placeholder="Bijv. 40"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                className="mt-2"
              />
            </div>

            <Button
              onClick={handleNext}
              disabled={!formData.type || !formData.color || !formData.area}
              className="w-full bg-[#4285f4] hover:bg-[#3367d6]"
            >
              Volgende: Upload foto's
            </Button>
          </div>
        )}

        {/* Step 2: Upload Foto's */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold mb-3 block">Upload foto's van de te schilderen ruimte</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#4285f4] transition-colors cursor-pointer">
                <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p className="text-sm text-gray-600 mb-2">Klik om foto's te uploaden</p>
                <p className="text-xs text-gray-400">Of sleep foto's hierheen</p>
              </div>
            </div>

            <div>
              <Label className="text-base font-semibold mb-3 block">Ook plafond schilderen?</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'yes', label: 'Ja' },
                  { value: 'no', label: 'Nee' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFormData({ ...formData, ceiling: option.value })}
                    className={`p-4 border-2 rounded-lg text-sm font-medium transition-all ${
                      formData.ceiling === option.value
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
                onClick={handleNext}
                className="flex-1 bg-[#4285f4] hover:bg-[#3367d6]"
              >
                Volgende: Contactgegevens
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Contact Info */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <Label htmlFor="name">Naam</Label>
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
              <Label htmlFor="email">E-mailadres</Label>
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
              <Label htmlFor="phone">Telefoonnummer</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="06-12345678"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mt-2"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-blue-900 mb-2">📊 Geschatte prijs</p>
              <p className="text-2xl font-bold text-[#4285f4]">
                €{formData.area ? (parseInt(formData.area) * 12).toLocaleString('nl-NL') : '0'},-
              </p>
              <p className="text-xs text-gray-600 mt-1">Inclusief materiaal en arbeid, exclusief BTW</p>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleBack} variant="outline" className="flex-1">
                Vorige
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!formData.email || !formData.name}
                className="flex-1 bg-[#4285f4] hover:bg-[#3367d6]"
              >
                Offerte aanvragen
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

