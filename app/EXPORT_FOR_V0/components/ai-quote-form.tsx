"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, Loader2, Check, Sparkles, X, ZoomIn, Share2 } from "lucide-react"
import { PhotoUpload } from "@/components/photo-upload"
import { calculatePriceFromAI } from "@/lib/pricing/ai-calculator"

interface AIQuoteFormProps {
  className?: string
}

export function AIQuoteForm({ className = "", companyId }: AIQuoteFormProps & { companyId?: string }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [photos, setPhotos] = useState<File[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<any[]>([])
  const [priceResult, setPriceResult] = useState<any>(null)
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null)
  const [isSavingLead, setIsSavingLead] = useState(false)
  const [leadSaved, setLeadSaved] = useState(false)

  const [formData, setFormData] = useState({
    materiaal: "", // kunststof, hout, aluminium
    kleur: "", // wit, grijs, zwart, houtkleur, etc
    kozijnType: "", // draaikiepraam, schuifraam, vaste beglazing, etc
    vierkanteMeterRamen: "",
    aantalRamen: "",
    glasType: "", // dubbel glas, HR++, triple glas
    montage: true,
    afvoerOudeKozijnen: true,
    naam: "",
    email: "",
    telefoon: "",
  })

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [currentStep])

  const handleSubmitLead = async () => {
    if (!formData.naam || !formData.email) {
      alert('Vul alstublieft uw naam en e-mail in')
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
          companyId: companyId || null,
          naam: formData.naam,
          email: formData.email,
          telefoon: formData.telefoon,
          materiaal: formData.materiaal,
          kleur: formData.kleur,
          kozijnType: formData.kozijnType,
          glasType: formData.glasType,
          aantalRamen: formData.aantalRamen,
          vierkanteMeterRamen: formData.vierkanteMeterRamen,
          montage: formData.montage,
          afvoerOudeKozijnen: formData.afvoerOudeKozijnen,
          quoteTotal: priceResult?.total || 0,
          quoteBreakdown: priceResult?.breakdown || {},
          photoUrls: photoUrls,
          previewUrls: previewUrls,
          source: companyId ? 'widget' : 'direct',
          widgetReferrer: typeof window !== 'undefined' ? window.location.href : null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Kon offerte niet verzenden')
      }

      setLeadSaved(true)
      console.log('✅ Lead verzonden:', data.leadId)

      // Toon succes bericht
      setTimeout(() => {
        alert('✅ Offerte verzonden! We nemen zo spoedig mogelijk contact met u op.')
      }, 500)

    } catch (error: any) {
      console.error('❌ Lead verzenden mislukt:', error)
      alert('Er ging iets mis bij het verzenden. Probeer het opnieuw of neem contact op.')
    } finally {
      setIsSavingLead(false)
    }
  }

  const handleShare = async (imageUrl: string, title: string) => {
    try {
      // Check if Web Share API is supported
      if (navigator.share) {
        // Fetch the image and convert to blob
        const response = await fetch(imageUrl)
        const blob = await response.blob()
        const file = new File([blob], 'kozijnen.jpg', { type: 'image/jpeg' })
        
        await navigator.share({
          title: title,
          text: `Bekijk mijn nieuwe ${formData.materiaal} kozijnen in ${formData.kleur}!`,
          files: [file]
        })
      } else {
        // Fallback: copy link to clipboard
        await navigator.clipboard.writeText(imageUrl)
        alert('Link gekopieerd naar clipboard!')
      }
    } catch (error) {
      console.log('Share cancelled or failed:', error)
    }
  }

  const handleNext = async () => {
    if (currentStep === 1) {
      setCurrentStep(2)
    } else if (currentStep === 2) {
      await analyzePhotos()
      setCurrentStep(3)
    }
  }

  const analyzePhotos = async () => {
    if (photos.length === 0) return

    setIsAnalyzing(true)
    const results = []

    try {
      // Build kozijn specifications to send to Gemini
      const kozijnSpecs = {
        materiaal: formData.materiaal,
        kleur: formData.kleur,
        kozijnType: formData.kozijnType,
        glasType: formData.glasType,
      }

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
              specs: kozijnSpecs 
            }),
          })
          
          if (!generateRes.ok) {
            const errorData = await generateRes.json()
            console.warn('⚠️ Gemini preview generatie mislukt:', errorData)
            console.warn('⚠️ Gebruik originele foto als fallback')
            
            // Fallback: use original photo
            results.push({ 
              url, 
              previewUrl: url, 
              analysis: { 
                window_count: parseInt(formData.aantalRamen) || 1,
                window_type: formData.kozijnType,
                estimated_size: 0,
                condition: 'good',
                notes: 'Preview niet beschikbaar (Gemini API key vereist)'
              } 
            })
          } else {
            const responseData = await generateRes.json()
            console.log('✅ Gemini preview succesvol gegenereerd!')
            results.push({ 
              url, 
              previewUrl: responseData.previewImage, 
              analysis: {
                window_count: parseInt(formData.aantalRamen) || 1,
                window_type: formData.kozijnType,
                estimated_size: 0,
                condition: 'good',
                notes: 'AI preview gegenereerd met Gemini'
              }
            })
          }
        } catch (error) {
          console.error('❌ Gemini preview error:', error)
          console.warn('⚠️ Gebruik originele foto als fallback')
          
          // Fallback: use original photo
          results.push({ 
            url, 
            previewUrl: url, 
            analysis: {
              window_count: parseInt(formData.aantalRamen) || 1,
              window_type: formData.kozijnType,
              estimated_size: 0,
              condition: 'good',
              notes: 'Preview fout - originele foto getoond'
            }
          })
        }
      }

      setAnalysisResults(results)
      
      console.log('📊 Alle Gemini previews gegenereerd:', results)
      console.log('📋 Form data voor berekening:', formData)

      // Bereken prijs op basis van kozijn specs
      const priceCalculation = calculatePriceFromAI(formData, results)
      
      console.log('💰 Berekende prijs:', priceCalculation)
      console.log('💰 Totaal:', priceCalculation.total)
      console.log('💰 Breakdown:', priceCalculation.breakdown)
      
      setPriceResult({
        total: priceCalculation.total,
        breakdown: {
          kozijnen: priceCalculation.breakdown.kozijnen,
          glas: priceCalculation.breakdown.glas,
          montage: priceCalculation.breakdown.montage,
          afvoer: priceCalculation.breakdown.afvoer,
        }
      })
      
      console.log('✅ Prijs en previews gereed!')
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

  const progressPercentage = (currentStep / 3) * 100

  return (
    <Card className={`p-4 sm:p-6 lg:p-8 bg-white shadow-2xl border-0 ${className}`}>
      {currentStep < 3 ? (
        <>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-6 h-6 lg:w-7 lg:h-7 text-primary" />
              <h2 className="font-bold text-base sm:text-lg lg:text-xl text-foreground">
                Direct een prijsindicatie en AI preview van uw nieuwe kozijnen.
              </h2>
            </div>
          <p className="text-xs sm:text-sm italic text-muted-foreground mb-3">
            {currentStep === 1 && "Vul uw voorkeuren in voor de nieuwe kozijnen"}
            {currentStep === 2 && "Upload minimaal 1 foto van uw ramen"}
          </p>

          <div className="mb-4">
            <div className="flex justify-between text-xs text-foreground mb-2">
              <span className={currentStep >= 1 ? "font-bold" : ""}>Gegevens</span>
              <span className={currentStep >= 2 ? "font-bold" : ""}>Foto's</span>
              <span className={currentStep >= 3 ? "font-bold" : ""}>Resultaat</span>
            </div>
            <Progress 
              value={progressPercentage} 
              className="h-2 bg-muted" 
              aria-label={`Stap ${currentStep} van 3`}
              aria-valuenow={progressPercentage}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>

          <form className="space-y-4">
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <Label className="text-foreground text-sm mb-2 block">Materiaal Kozijnen *</Label>
                  <Select
                    value={formData.materiaal}
                    onValueChange={(value) => setFormData({ ...formData, materiaal: value })}
                  >
                    <SelectTrigger className="bg-background border-0 h-11">
                      <SelectValue placeholder="Kies materiaal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kunststof">Kunststof (PVC)</SelectItem>
                      <SelectItem value="hout">Hout</SelectItem>
                      <SelectItem value="aluminium">Aluminium</SelectItem>
                      <SelectItem value="hout-aluminium">Hout/Aluminium combinatie</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-foreground text-sm mb-2 block">Kleur *</Label>
                  <Select
                    value={formData.kleur}
                    onValueChange={(value) => setFormData({ ...formData, kleur: value })}
                  >
                    <SelectTrigger className="bg-background border-0 h-11">
                      <SelectValue placeholder="Kies kleur" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wit">Wit</SelectItem>
                      <SelectItem value="creme">Crème</SelectItem>
                      <SelectItem value="grijs">Grijs (RAL 7016)</SelectItem>
                      <SelectItem value="antraciet">Antraciet (RAL 7021)</SelectItem>
                      <SelectItem value="zwart">Zwart</SelectItem>
                      <SelectItem value="donkergroen">Donkergroen (RAL 6009)</SelectItem>
                      <SelectItem value="houtkleur">Houtkleur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-foreground text-sm mb-2 block">Type Kozijn *</Label>
                  <Select
                    value={formData.kozijnType}
                    onValueChange={(value) => setFormData({ ...formData, kozijnType: value })}
                  >
                    <SelectTrigger className="bg-background border-0 h-11">
                      <SelectValue placeholder="Selecteer type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draaikiepraam">Draaikiepraam</SelectItem>
                      <SelectItem value="draadraam">Draadraam</SelectItem>
                      <SelectItem value="kiepraam">Kiepraam</SelectItem>
                      <SelectItem value="schuifraam">Schuifraam</SelectItem>
                      <SelectItem value="vaste-beglazing">Vaste beglazing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-foreground text-sm mb-2 block">Type Glas *</Label>
                  <Select
                    value={formData.glasType}
                    onValueChange={(value) => setFormData({ ...formData, glasType: value })}
                  >
                    <SelectTrigger className="bg-background border-0 h-11">
                      <SelectValue placeholder="Kies glastype" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dubbel">Dubbel glas</SelectItem>
                      <SelectItem value="hr++">HR++ glas</SelectItem>
                      <SelectItem value="triple">Triple glas</SelectItem>
                      <SelectItem value="geluidswerend">Geluidswerend glas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-foreground text-sm mb-2 block">Aantal Ramen *</Label>
                  <Input
                    type="number"
                    placeholder="Bijv. 8"
                    value={formData.aantalRamen}
                    onChange={(e) => setFormData({ ...formData, aantalRamen: e.target.value })}
                    className="bg-background border-0 h-11"
                    required
                    min="1"
                  />
                </div>

                <div>
                  <Label className="text-foreground text-sm mb-2 block">Totaal m² Glas (schatting) *</Label>
                  <Select
                    value={formData.vierkanteMeterRamen}
                    onValueChange={(value) => setFormData({ ...formData, vierkanteMeterRamen: value })}
                  >
                    <SelectTrigger className="bg-background border-0 h-11">
                      <SelectValue placeholder="Selecteer oppervlakte" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5-10">5-10 m²</SelectItem>
                      <SelectItem value="10-15">10-15 m²</SelectItem>
                      <SelectItem value="15-20">15-20 m²</SelectItem>
                      <SelectItem value="20-30">20-30 m²</SelectItem>
                      <SelectItem value="30-40">30-40 m²</SelectItem>
                      <SelectItem value="40+">40+ m²</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="text-foreground text-sm block">Extra Services</Label>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="montage"
                      checked={formData.montage}
                      onCheckedChange={(checked) => setFormData({ ...formData, montage: checked as boolean })}
                      className="border-input data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                    />
                    <label htmlFor="montage" className="text-sm text-foreground cursor-pointer">
                      Montage (aangeraden)
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="afvoer"
                      checked={formData.afvoerOudeKozijnen}
                      onCheckedChange={(checked) => setFormData({ ...formData, afvoerOudeKozijnen: checked as boolean })}
                      className="border-input data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                    />
                    <label htmlFor="afvoer" className="text-sm text-foreground cursor-pointer">
                      Afvoer oude kozijnen
                    </label>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-2">
                <div>
                  <Label className="text-foreground text-xs sm:text-sm font-medium mb-1 block">Upload foto's *</Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Minimaal 1 foto (binnen of buiten)
                  </p>
                  <PhotoUpload 
                    onPhotosChange={setPhotos}
                    maxPhotos={5}
                    minPhotos={1}
                  />
                </div>
                
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
              </div>
            )}

            <div className="flex gap-2 pt-2 sm:pt-3">
              {currentStep > 1 && !isAnalyzing && (
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
              <Button
                type="button"
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && (!formData.materiaal || !formData.kleur || !formData.kozijnType || !formData.glasType || !formData.aantalRamen || !formData.vierkanteMeterRamen)) ||
                  (currentStep === 2 && photos.length < 1) ||
                  isAnalyzing
                }
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-10 text-sm disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    <span className="hidden sm:inline">Analyseren & Genereren...</span>
                    <span className="sm:hidden">Bezig...</span>
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">{currentStep === 2 ? "Bereken Prijs & Preview" : "Volgende"}</span>
                    <span className="sm:hidden">{currentStep === 2 ? "Bereken" : "Volgende"}</span>
                    {currentStep < 2 && <ChevronRight className="w-4 h-4 ml-1" />}
                  </>
                )}
              </Button>
            </div>
          </form>
        </>
      ) : (
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full mb-2">
              <Check className="w-4 h-4" />
              <span className="text-sm font-semibold">AI Analyse & Preview Klaar</span>
            </div>

            <h2 className="font-bold text-2xl text-foreground">Uw Instant Offerte:</h2>

          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-6 border-2 border-primary/20">
            <p className="text-4xl font-bold text-primary mb-2">
              €{priceResult?.total || '4.500'}
            </p>
            <p className="text-sm text-muted-foreground">
              Totale offerte voor {formData.aantalRamen} {formData.materiaal} raamkozijnen
            </p>
          </div>

          <div className="bg-background rounded-lg p-4 space-y-2 text-left">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Kozijnen ({formData.materiaal})</span>
              <span className="font-medium">€{priceResult?.breakdown.kozijnen || 2800}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Glas ({formData.glasType})</span>
              <span className="font-medium">€{priceResult?.breakdown.glas || 900}</span>
            </div>
            {formData.montage && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Montage</span>
                <span className="font-medium">€{priceResult?.breakdown.montage || 600}</span>
              </div>
            )}
            {formData.afvoerOudeKozijnen && (
            <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Afvoer oude kozijnen</span>
                <span className="font-medium">€{priceResult?.breakdown.afvoer || 200}</span>
            </div>
            )}
          </div>

          {/* Voor & Na Vergelijking */}
          {analysisResults.length > 0 && (
            <div className="bg-background rounded-lg p-4 text-left border-2 border-primary/20">
              <h3 className="font-semibold text-base text-foreground mb-3">🎨 Voor & Na: Uw nieuwe {formData.materiaal} kozijnen</h3>
              <div className="space-y-6">
                {analysisResults.map((result, idx) => (
                  <div key={idx} className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Originele foto */}
                      <div className="space-y-2">
                        <div 
                          className="relative rounded-lg overflow-hidden border-2 border-border group"
                        >
                          <img
                            src={result.url}
                            alt={`Huidige kozijnen ${idx + 1}`}
                            className="w-full h-auto object-contain max-h-64 cursor-pointer"
                            onClick={() => setEnlargedImage(result.url)}
                          />
                          <div className="absolute top-2 right-2 flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleShare(result.url, 'Huidige kozijnen')
                              }}
                              className="bg-black/60 p-1.5 rounded-full hover:bg-black/80 transition-colors"
                              aria-label="Deel huidige kozijn foto"
                              title="Deel foto"
                            >
                              <Share2 className="w-4 h-4 text-white" />
                            </button>
                            <button
                              onClick={() => setEnlargedImage(result.url)}
                              className="bg-black/60 p-1.5 rounded-full hover:bg-black/80 transition-colors"
                              aria-label="Vergroot huidige kozijn foto"
                              title="Vergroot foto"
                            >
                              <ZoomIn className="w-4 h-4 text-white" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-center text-muted-foreground font-medium">
                          📸 Huidige kozijnen
                        </p>
                      </div>

                      {/* AI Preview */}
                      <div className="space-y-2">
                        <div 
                          className="relative rounded-lg overflow-hidden border-2 border-border group"
                        >
                          <img
                            src={result.previewUrl || result.url}
                            alt={`Nieuwe kozijnen ${idx + 1}`}
                            className="w-full h-auto object-contain max-h-64 cursor-pointer"
                            onClick={() => setEnlargedImage(result.previewUrl || result.url)}
                          />
                          <div className="absolute top-2 right-2 flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleShare(result.previewUrl || result.url, 'Nieuwe kozijnen')
                              }}
                              className="bg-black/60 p-1.5 rounded-full hover:bg-black/80 transition-colors"
                              aria-label="Deel nieuwe kozijn preview"
                              title="Deel preview"
                            >
                              <Share2 className="w-4 h-4 text-white" />
                            </button>
                            <button
                              onClick={() => setEnlargedImage(result.previewUrl || result.url)}
                              className="bg-black/60 p-1.5 rounded-full hover:bg-black/80 transition-colors"
                              aria-label="Vergroot nieuwe kozijn preview"
                              title="Vergroot preview"
                            >
                              <ZoomIn className="w-4 h-4 text-white" />
                            </button>
                          </div>
                </div>
                        <p className="text-sm text-center text-primary font-medium">
                          ✨ Nieuwe kozijnen
                        </p>
                </div>
                </div>
                </div>
                ))}
                </div>
              <div className="mt-4 p-3 bg-primary/5 rounded-lg">
                <p className="text-xs text-foreground text-center">
                  ✨ <strong>Powered by Google Gemini "Nano Banana"</strong> - Deze previews zijn gegenereerd door AI op basis van uw gekozen specificaties: {formData.materiaal} kozijnen in {formData.kleur} met {formData.glasType}.
                </p>
              </div>
            </div>
          )}

          {/* Specificaties overzicht */}
          <div className="bg-muted/30 rounded-lg p-4 text-left">
            <h3 className="font-bold text-base text-foreground mb-3">📋 Uw Specificaties:</h3>
                
                <div className="bg-background rounded-md p-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                <span className="text-muted-foreground">Aantal ramen:</span>
                <span className="font-medium text-foreground">{formData.aantalRamen}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Totaal m² glas:</span>
                <span className="font-medium text-foreground">{formData.vierkanteMeterRamen}</span>
                  </div>
                  <div className="flex justify-between">
                <span className="text-muted-foreground">Materiaal:</span>
                <span className="font-medium text-foreground">{formData.materiaal}</span>
                  </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Kleur:</span>
                <span className="font-medium text-foreground">{formData.kleur}</span>
                    </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type:</span>
                <span className="font-medium text-foreground">{formData.kozijnType}</span>
                </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Glastype:</span>
                <span className="font-medium text-foreground">{formData.glasType}</span>
              </div>
            </div>
          </div>

          <div className="bg-primary/10 rounded-lg p-4">
            <p className="text-foreground font-bold text-lg mb-2">💰 Laagste Prijs Garantie</p>
            <p className="text-foreground text-sm">
              Vindt u dezelfde kozijnen elders goedkoper? Dan betalen wij het verschil terug!
            </p>
          </div>

          <div className="space-y-3 text-left pt-4">
            <Label className="text-foreground text-sm">Uw gegevens voor bevestiging:</Label>
            <Input
              placeholder="Naam"
              value={formData.naam}
              onChange={(e) => setFormData({ ...formData, naam: e.target.value })}
              className="bg-background border-0 h-11"
            />
            <Input
              type="email"
              placeholder="E-mail"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-background border-0 h-11"
            />
            <Input
              type="tel"
              placeholder="Telefoon"
              value={formData.telefoon}
              onChange={(e) => setFormData({ ...formData, telefoon: e.target.value })}
              className="bg-background border-0 h-11"
            />
          </div>

          <Button 
            type="button"
            onClick={handleSubmitLead}
            disabled={!formData.naam || !formData.email || isSavingLead || leadSaved}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 text-base disabled:opacity-50"
          >
            {isSavingLead ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Verzenden...
              </>
            ) : leadSaved ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Verzonden! We nemen contact op
              </>
            ) : (
              'Bevestig Offerte & Plan Opname'
            )}
          </Button>

          <Button
            variant="ghost"
            onClick={() => {
              setCurrentStep(1)
              setPhotos([])
              setAnalysisResults([])
              setPriceResult(null)
              setLeadSaved(false)
              setIsSavingLead(false)
              setFormData({
                materiaal: "",
                kleur: "",
                kozijnType: "",
                vierkanteMeterRamen: "",
                aantalRamen: "",
                glasType: "",
                montage: true,
                afvoerOudeKozijnen: true,
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

          {/* Lightbox Modal voor vergrote foto's */}
          {enlargedImage && (
            <div 
              className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
              onClick={() => setEnlargedImage(null)}
            >
              <div className="relative max-w-7xl max-h-full">
                <div className="absolute -top-12 right-0 flex items-center gap-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleShare(enlargedImage, 'Mijn nieuwe kozijnen')
                    }}
                    className="text-white hover:text-gray-300 flex items-center gap-2 text-lg"
                  >
                    <Share2 className="w-5 h-5" />
                    Delen
                  </button>
                  <button
                    onClick={() => setEnlargedImage(null)}
                    className="text-white hover:text-gray-300 flex items-center gap-2 text-lg"
                  >
                    <X className="w-6 h-6" />
                    Sluiten
                  </button>
                </div>
                <img
                  src={enlargedImage}
                  alt="Vergrote weergave"
                  className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                />
                <p className="text-white text-center mt-4 text-sm">
                  Klik buiten de foto om te sluiten
                </p>
              </div>
        </div>
      )}
    </Card>
  )
}



