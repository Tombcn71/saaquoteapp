"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, Loader2, Check, Sparkles, X, ZoomIn, Share2, Upload } from "lucide-react"
import { PhotoUpload } from "@/components/photo-upload"
import { AppointmentPicker } from "@/components/appointment-picker"

interface AIQuoteFormProps {
  className?: string
  companyId?: string
  widgetId?: string
}

// Woningtype data (uit marktonderzoek)
const WONINGTYPE_DATA = {
  appartement: {
    label: 'Appartement',
    kozijnenRange: { min: 6, max: 8 },
    glasRange: { min: 10, max: 18 }
  },
  tussenwoning: {
    label: 'Tussenwoning',
    kozijnenRange: { min: 8, max: 10 },
    glasRange: { min: 18, max: 22 }
  },
  hoekwoning: {
    label: 'Hoekwoning',
    kozijnenRange: { min: 10, max: 12 },
    glasRange: { min: 20, max: 25 }
  },
  twee_onder_een_kap: {
    label: 'Twee-onder-een-kap',
    kozijnenRange: { min: 12, max: 15 },
    glasRange: { min: 25, max: 30 }
  },
  vrijstaand: {
    label: 'Vrijstaande woning',
    kozijnenRange: { min: 15, max: 20 },
    glasRange: { min: 30, max: 40 }
  }
}

const PRICE_PER_M2 = {
  min: 1000, // Basis kunststof
  max: 1400  // Premium kunststof
}

export function AIQuoteForm({ className = "", companyId, widgetId }: AIQuoteFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [photos, setPhotos] = useState<File[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<any[]>([])
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null)
  const [isSavingLead, setIsSavingLead] = useState(false)
  const [leadSaved, setLeadSaved] = useState(false)
  const [appointmentDatetime, setAppointmentDatetime] = useState<string>("")

  const [formData, setFormData] = useState({
    woningtype: "",
    aantalKozijnen: "",
    glasoppervlakte: "",
    glasType: "hr++", // hr++ of hr+++
    bedrijfsnaam: "",
    naam: "",
    email: "",
    telefoon: "",
  })

  // Bereken prijs range op basis van glasoppervlakte en glastype
  const calculatePriceRange = () => {
    if (!formData.glasoppervlakte) return null
    
    const m2 = parseInt(formData.glasoppervlakte)
    const minPrice = m2 * PRICE_PER_M2.min
    const maxPrice = m2 * PRICE_PER_M2.max
    
    // Als HR+++ gekozen, +10%
    if (formData.glasType === "hr+++") {
      return {
        min: Math.round(minPrice * 1.10),
        max: Math.round(maxPrice * 1.10)
      }
    }
    
    return { min: minPrice, max: maxPrice }
  }

  const priceRange = calculatePriceRange()

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [currentStep])

  const handleSubmitLead = async () => {
    if (!formData.naam || !formData.email || !appointmentDatetime) {
      alert('Vul alstublieft uw contactgegevens in en kies een afspraak')
      return
    }

    setIsSavingLead(true)

    try {
      const photoUrls = analysisResults.map(r => r.url)
      const previewUrls = analysisResults.map(r => r.previewUrl || r.url)

      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formType: 'kozijnen',
          formData: {
            woningtype: formData.woningtype,
            aantalKozijnen: formData.aantalKozijnen,
            glasoppervlakte: formData.glasoppervlakte,
            glasType: formData.glasType,
          },
          customerInfo: {
            companyName: formData.bedrijfsnaam,
            name: formData.naam,
            email: formData.email,
            phone: formData.telefoon,
          },
          photos: photoUrls,
          previewUrls: previewUrls,
          companyId: companyId || null,
          widgetId: widgetId || null,
          estimatedPrice: priceRange?.min || 0,
          appointmentDatetime: appointmentDatetime || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Kon offerte niet verzenden')
      }

      setLeadSaved(true)
      console.log('✅ Lead verzonden:', data.leadId)

    } catch (error: any) {
      console.error('❌ Lead verzenden mislukt:', error)
      alert('Er ging iets mis bij het verzenden. Probeer het opnieuw of neem contact op.')
    } finally {
      setIsSavingLead(false)
    }
  }

  const handleShare = async (imageUrl: string, title: string) => {
    try {
      if (navigator.share) {
        const response = await fetch(imageUrl)
        const blob = await response.blob()
        const file = new File([blob], 'kozijnen.jpg', { type: 'image/jpeg' })
        
        await navigator.share({
          title: title,
          text: `Bekijk mijn nieuwe kunststof kozijnen!`,
          files: [file]
        })
      } else {
        await navigator.clipboard.writeText(imageUrl)
        alert('Link gekopieerd naar clipboard!')
      }
    } catch (error) {
      console.log('Share cancelled or failed:', error)
    }
  }

  const handleNext = async () => {
    if (currentStep === 4) {
      // Stap 5: Foto upload (optioneel)
      setCurrentStep(5)
    } else if (currentStep === 5) {
      // Als foto's geupload, analyseer ze
      if (photos.length > 0) {
        await analyzePhotos()
      }
      setCurrentStep(6) // Ga naar resultaat
    } else {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleSkipPhotos = () => {
    // Skip foto upload, ga direct naar resultaat
    setCurrentStep(6)
  }

  const analyzePhotos = async () => {
    if (photos.length === 0) return

    setIsAnalyzing(true)
    const results = []

    try {
      console.log('🎨 Gemini Nano Banana: Genereren van kozijnen previews...')

      for (const photo of photos) {
        const uploadFormData = new FormData()
        uploadFormData.append('file', photo)
        
        // Upload photo first
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        })
        const { url } = await uploadRes.json()

        try {
          // Generate preview with Gemini
          const generateRes = await fetch('/api/generate-kozijn-preview', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              imageUrl: url,
              specs: {
                materiaal: 'kunststof',
                kleur: 'wit',
                kozijnType: 'draaikiepraam',
                glasType: formData.glasType
              }
            }),
          })
          
          if (!generateRes.ok) {
            console.warn('⚠️ Gemini preview generatie mislukt, gebruik origineel')
            results.push({ 
              url, 
              previewUrl: url, 
              analysis: { notes: 'Preview niet beschikbaar' } 
            })
          } else {
            const responseData = await generateRes.json()
            console.log('✅ Gemini preview succesvol gegenereerd!')
            results.push({ 
              url, 
              previewUrl: responseData.previewImage, 
              analysis: { notes: 'AI preview gegenereerd met Gemini' }
            })
          }
        } catch (error) {
          console.error('❌ Gemini preview error:', error)
          results.push({ 
            url, 
            previewUrl: url, 
            analysis: { notes: 'Preview fout - originele foto getoond' }
          })
        }
      }

      setAnalysisResults(results)
      console.log('✅ Alle previews gegenereerd:', results)
    } catch (error) {
      console.error('Analysis error:', error)
      alert('Er ging iets mis bij het genereren van de preview. Probeer opnieuw.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const progressPercentage = (currentStep / 6) * 100

  // Helper: genereer kozijnen dropdown opties op basis van woningtype
  const getKozijnenOptions = () => {
    if (!formData.woningtype) return []
    const data = WONINGTYPE_DATA[formData.woningtype as keyof typeof WONINGTYPE_DATA]
    if (!data) return []
    
    const options = []
    for (let i = data.kozijnenRange.min; i <= data.kozijnenRange.max; i++) {
      options.push(i)
    }
    return options
  }

  // Helper: genereer glasoppervlakte dropdown opties op basis van woningtype
  const getGlasoppervlakteOptions = () => {
    if (!formData.woningtype) return []
    const data = WONINGTYPE_DATA[formData.woningtype as keyof typeof WONINGTYPE_DATA]
    if (!data) return []
    
    const options = []
    for (let i = data.glasRange.min; i <= data.glasRange.max; i++) {
      options.push(i)
    }
    return options
  }

  return (
    <Card className={`overflow-hidden bg-white shadow-2xl border-0 p-0 ${className}`}>
      {currentStep < 6 ? (
        <>
          <div className="bg-[#4285f4] px-4 sm:px-6 lg:px-8 py-6 rounded-t-xl">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
              <h2 className="font-bold text-base sm:text-lg lg:text-xl text-white">
                Direct een prijsindicatie voor uw nieuwe kozijnen.
              </h2>
            </div>
            <p className="text-xs sm:text-sm italic text-blue-100">
              {currentStep === 1 && "Wat voor type woning heeft u?"}
              {currentStep === 2 && "Hoeveel kozijnen wilt u vervangen?"}
              {currentStep === 3 && "Wat is de totale glasoppervlakte?"}
              {currentStep === 4 && "Welk type glas wenst u?"}
              {currentStep === 5 && "Upload foto's voor AI preview (optioneel)"}
            </p>
          </div>

          <div className="px-4 sm:px-6 lg:px-8 py-6">
            <div className="mb-4">
              <div className="flex justify-between text-xs text-foreground mb-2">
                <span className={currentStep >= 1 ? "font-bold" : ""}>Woningtype</span>
                <span className={currentStep >= 2 ? "font-bold" : ""}>Kozijnen</span>
                <span className={currentStep >= 3 ? "font-bold" : ""}>Glas m²</span>
                <span className={currentStep >= 4 ? "font-bold" : ""}>Glastype</span>
                <span className={currentStep >= 5 ? "font-bold" : ""}>Foto's</span>
                <span className={currentStep >= 6 ? "font-bold" : ""}>Offerte</span>
              </div>
              <Progress 
                value={progressPercentage} 
                className="h-2 bg-gray-200 [&>div]:bg-[#4285f4]" 
              />
            </div>

            <form className="space-y-4">
              {/* Stap 1: Woningtype */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <Label className="text-foreground text-base font-semibold mb-3 block">
                    Wat voor type woning heeft u?
                  </Label>
                  <div className="grid grid-cols-1 gap-3">
                    {Object.entries(WONINGTYPE_DATA).map(([key, value]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          setFormData({ 
                            ...formData, 
                            woningtype: key,
                            aantalKozijnen: "", // Reset
                            glasoppervlakte: "" // Reset
                          })
                        }}
                        className={`p-4 border-2 rounded-lg text-left transition-all ${
                          formData.woningtype === key
                            ? 'border-[#4285f4] bg-blue-50'
                            : 'border-gray-200 hover:border-[#4285f4]'
                        }`}
                      >
                        <div className="font-semibold text-gray-900">{value.label}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          {value.kozijnenRange.min}-{value.kozijnenRange.max} kozijnen · {value.glasRange.min}-{value.glasRange.max} m² glas
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stap 2: Aantal Kozijnen */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <Label className="text-foreground text-base font-semibold mb-3 block">
                    Hoeveel kozijnen wilt u vervangen?
                  </Label>
                  <Select
                    value={formData.aantalKozijnen}
                    onValueChange={(value) => setFormData({ ...formData, aantalKozijnen: value })}
                  >
                    <SelectTrigger className="bg-background border-0 h-12 text-base">
                      <SelectValue placeholder="Kies aantal kozijnen" />
                    </SelectTrigger>
                    <SelectContent>
                      {getKozijnenOptions().map(num => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} kozijnen
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Stap 3: Glasoppervlakte */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <Label className="text-foreground text-base font-semibold mb-3 block">
                    Totale glasoppervlakte (alle ramen samen)
                  </Label>
                  <Select
                    value={formData.glasoppervlakte}
                    onValueChange={(value) => setFormData({ ...formData, glasoppervlakte: value })}
                  >
                    <SelectTrigger className="bg-background border-0 h-12 text-base">
                      <SelectValue placeholder="Kies glasoppervlakte" />
                    </SelectTrigger>
                    <SelectContent>
                      {getGlasoppervlakteOptions().map(num => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} m²
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-2">
                    💡 Niet zeker? Kies een schatting - we bespreken de exacte maten in het adviesgesprek
                  </p>
                </div>
              )}

              {/* Stap 4: Glastype */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <Label className="text-foreground text-base font-semibold mb-3 block">
                    Welk type glas wenst u?
                  </Label>
                  <div className="grid grid-cols-1 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, glasType: 'hr++' })}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        formData.glasType === 'hr++'
                          ? 'border-[#4285f4] bg-blue-50'
                          : 'border-gray-200 hover:border-[#4285f4]'
                      }`}
                    >
                      <div className="font-semibold text-gray-900">HR++ glas</div>
                      <div className="text-sm text-gray-600 mt-1">
                        Standaard isolatie - inbegrepen in prijs
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, glasType: 'hr+++' })}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        formData.glasType === 'hr+++'
                          ? 'border-[#4285f4] bg-blue-50'
                          : 'border-gray-200 hover:border-[#4285f4]'
                      }`}
                    >
                      <div className="font-semibold text-gray-900">HR+++ glas</div>
                      <div className="text-sm text-gray-600 mt-1">
                        Beste isolatie - +10% op totaalprijs
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Stap 5: Foto Upload (optioneel) */}
              {currentStep === 5 && (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                      📸 Upload foto's voor AI preview (optioneel maar aanbevolen!)
                    </p>
                    <p className="text-xs text-gray-600">
                      Zie hoe je nieuwe kozijnen eruitzien met AI technologie ✨
                    </p>
                  </div>

                  <PhotoUpload 
                    onPhotosChange={setPhotos}
                    maxPhotos={5}
                    minPhotos={0}
                  />
                  
                  {isAnalyzing && (
                    <Card className="p-4 bg-primary/5 border-primary/20">
                      <div className="flex items-center gap-3">
                        <Loader2 className="w-5 h-5 text-primary animate-spin" />
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            AI analyseert uw foto's en genereert preview...
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Dit kan 30-60 seconden duren
                          </p>
                        </div>
                      </div>
                    </Card>
                  )}

                  <Button
                    type="button"
                    onClick={handleSkipPhotos}
                    variant="outline"
                    className="w-full"
                  >
                    Overslaan - ga naar prijsindicatie →
                  </Button>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-2 pt-2 sm:pt-3">
                {currentStep > 1 && currentStep < 6 && !isAnalyzing && (
                  <Button
                    type="button"
                    onClick={handlePrevious}
                    variant="outline"
                    className="flex-1 bg-muted hover:bg-muted/90 text-foreground border-0 h-10 text-sm"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Vorige
                  </Button>
                )}
                {currentStep < 5 && (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={
                      (currentStep === 1 && !formData.woningtype) ||
                      (currentStep === 2 && !formData.aantalKozijnen) ||
                      (currentStep === 3 && !formData.glasoppervlakte) ||
                      (currentStep === 4 && !formData.glasType)
                    }
                    className="flex-1 bg-[#4285f4] hover:bg-[#3367d6] text-white font-bold h-10 text-sm"
                  >
                    Volgende
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                )}
                {currentStep === 5 && photos.length > 0 && (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={isAnalyzing}
                    className="flex-1 bg-[#4285f4] hover:bg-[#3367d6] text-white font-bold h-10 text-sm"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Genereren...
                      </>
                    ) : (
                      <>
                        AI Preview Genereren
                        <Sparkles className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </div>
        </>
      ) : (
        // Stap 6: Resultaat
        <div className="p-6 space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full mb-4">
              <Check className="w-4 h-4" />
              <span className="text-sm font-semibold">Berekening Klaar!</span>
            </div>

            {/* Prijs Indicatie */}
            {priceRange && (
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  💰 Uw Prijsindicatie
                </h3>
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Vanaf</p>
                    <p className="text-3xl font-bold text-[#4285f4]">
                      €{priceRange.min.toLocaleString('nl-NL')}
                    </p>
                  </div>
                  <div className="text-2xl text-gray-400">-</div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Tot</p>
                    <p className="text-3xl font-bold text-[#4285f4]">
                      €{priceRange.max.toLocaleString('nl-NL')}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-gray-700 space-y-1">
                  <p>✓ Vanaf-prijs: basis kunststof kozijnen</p>
                  <p>✓ Tot-prijs: premium opties & afwerking</p>
                  <p className="font-semibold mt-3">📞 Exacte prijs bepalen we in gratis adviesgesprek (15 min)</p>
                </div>
              </div>
            )}

            {/* AI Preview (als foto's geüpload) */}
            {analysisResults.length > 0 && (
              <div className="bg-background rounded-lg p-4 text-left border-2 border-primary/20 mb-6">
                <h3 className="font-semibold text-base text-foreground mb-3">🎨 AI Preview: Uw nieuwe kozijnen</h3>
                <div className="space-y-4">
                  {analysisResults.map((result, idx) => (
                    <div key={idx} className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <div className="relative rounded-lg overflow-hidden border-2 border-border">
                          <img
                            src={result.url}
                            alt={`Huidig ${idx + 1}`}
                            className="w-full h-32 object-cover cursor-pointer"
                            onClick={() => setEnlargedImage(result.url)}
                          />
                        </div>
                        <p className="text-xs text-center text-muted-foreground">📸 Huidig</p>
                      </div>
                      <div className="space-y-2">
                        <div className="relative rounded-lg overflow-hidden border-2 border-primary">
                          <img
                            src={result.previewUrl || result.url}
                            alt={`Nieuw ${idx + 1}`}
                            className="w-full h-32 object-cover cursor-pointer"
                            onClick={() => setEnlargedImage(result.previewUrl || result.url)}
                          />
                        </div>
                        <p className="text-xs text-center text-primary font-medium">✨ Nieuw</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-600 mt-3 text-center">
                  Powered by Google Gemini AI
                </p>
              </div>
            )}
          </div>

          {/* Contact & Belafspraak */}
          {!leadSaved && (
            <div className="space-y-4">
              <div className="bg-background rounded-lg p-4 space-y-3 text-left border-2 border-primary/20">
                <h3 className="font-semibold text-base text-foreground mb-2">📋 Uw Contactgegevens</h3>
                
                <div>
                  <Label className="text-foreground text-sm mb-1 block">Bedrijfsnaam (optioneel)</Label>
                  <Input
                    type="text"
                    placeholder="Uw bedrijf"
                    value={formData.bedrijfsnaam}
                    onChange={(e) => setFormData({ ...formData, bedrijfsnaam: e.target.value })}
                    className="bg-white border-input h-10"
                  />
                </div>

                <div>
                  <Label className="text-foreground text-sm mb-1 block">Naam *</Label>
                  <Input
                    type="text"
                    placeholder="Volledige naam"
                    value={formData.naam}
                    onChange={(e) => setFormData({ ...formData, naam: e.target.value })}
                    className="bg-white border-input h-10"
                    required
                  />
                </div>

                <div>
                  <Label className="text-foreground text-sm mb-1 block">E-mail *</Label>
                  <Input
                    type="email"
                    placeholder="uw@email.nl"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-white border-input h-10"
                    required
                  />
                </div>

                <div>
                  <Label className="text-foreground text-sm mb-1 block">Telefoon *</Label>
                  <Input
                    type="tel"
                    placeholder="06 12345678"
                    value={formData.telefoon}
                    onChange={(e) => setFormData({ ...formData, telefoon: e.target.value })}
                    className="bg-white border-input h-10"
                    required
                  />
                </div>
              </div>

              {/* Belafspraak */}
              <div className="bg-primary/5 rounded-lg p-4 border-2 border-primary/20">
                <div className="mb-3">
                  <p className="text-sm font-semibold text-foreground mb-2">📞 Plan gratis belafspraak</p>
                  <p className="text-xs text-muted-foreground mb-3">
                    We bellen je op gekozen moment (15 min) om exacte prijs te bespreken. Meestal valt deze lager uit! 💰
                  </p>
                </div>
                <AppointmentPicker 
                  onAppointmentSelected={setAppointmentDatetime}
                  customerName={formData.naam || 'Klant'}
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button 
            type="button"
            onClick={handleSubmitLead}
            disabled={!formData.naam || !formData.email || !formData.telefoon || !appointmentDatetime || isSavingLead || leadSaved}
            className="w-full bg-[#4285f4] hover:bg-[#3367d6] text-white font-bold h-12 text-base"
          >
            {isSavingLead ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Verzenden...
              </>
            ) : leadSaved ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Verzonden! Check je email voor bevestiging
              </>
            ) : (
              'Bevestig Belafspraak & Ontvang Offerte'
            )}
          </Button>

          {/* Reset */}
          <Button
            variant="ghost"
            onClick={() => {
              setCurrentStep(1)
              setPhotos([])
              setAnalysisResults([])
              setLeadSaved(false)
              setIsSavingLead(false)
              setAppointmentDatetime("")
              setFormData({
                woningtype: "",
                aantalKozijnen: "",
                glasoppervlakte: "",
                glasType: "hr++",
                bedrijfsnaam: "",
                naam: "",
                email: "",
                telefoon: "",
              })
            }}
            className="text-foreground hover:text-foreground/80 hover:bg-transparent"
          >
            Nieuwe berekening starten
          </Button>
        </div>
      )}

      {/* Lightbox voor vergrote foto's */}
      {enlargedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setEnlargedImage(null)}
        >
          <div className="relative max-w-7xl max-h-full">
            <button
              onClick={() => setEnlargedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 flex items-center gap-2"
            >
              <X className="w-6 h-6" />
              Sluiten
            </button>
            <img
              src={enlargedImage}
              alt="Vergroot"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </Card>
  )
}
