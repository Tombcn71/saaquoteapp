'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSession } from 'next-auth/react'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

export default function SettingsPage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Pricing state
  const [kozijnenPricing, setKozijnenPricing] = useState({
    base_price_per_window: 500,
    material_multipliers: {
      kunststof: 1.0,
      hout: 1.3,
      aluminium: 1.5
    },
    glass_multipliers: {
      enkel: 1.0,
      dubbel: 1.2,
      'hr++': 1.4,
      triple: 1.6
    }
  })

  const [vloerenPricing, setVloerenPricing] = useState({
    price_per_m2: {
      hout: 75,
      pvc: 45
    },
    installation_cost_per_m2: 15,
    minimum_order: 100
  })

  const [schilderwerkPricing, setSchilderwerkPricing] = useState({
    price_per_m2: {
      binnen: 12,
      buiten: 18
    },
    labor_cost_per_m2: 8,
    minimum_order: 150
  })

  // Fetch current pricing on mount
  useEffect(() => {
    fetchPricing()
  }, [])

  const fetchPricing = async () => {
    try {
      const res = await fetch('/api/settings/pricing')
      const data = await res.json()

      if (data.success) {
        if (data.pricing.kozijnen) {
          setKozijnenPricing(data.pricing.kozijnen)
        }
        if (data.pricing.vloeren) {
          setVloerenPricing(data.pricing.vloeren)
        }
        if (data.pricing.schilderwerk) {
          setSchilderwerkPricing(data.pricing.schilderwerk)
        }
      }
    } catch (error) {
      console.error('Error fetching pricing:', error)
      showMessage('error', 'Kon prijzen niet laden')
    } finally {
      setLoading(false)
    }
  }

  const savePricing = async (formType: string, pricingData: any) => {
    setSaving(formType)
    setMessage(null)

    try {
      const res = await fetch('/api/settings/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formType, pricingData })
      })

      const data = await res.json()

      if (data.success) {
        showMessage('success', `${formType} prijzen opgeslagen!`)
      } else {
        showMessage('error', data.error || 'Kon niet opslaan')
      }
    } catch (error) {
      console.error('Error saving pricing:', error)
      showMessage('error', 'Er ging iets mis bij opslaan')
    } finally {
      setSaving(null)
    }
  }

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 4000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#4285f4]" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Instellingen</h1>
        <p className="text-gray-600 mt-2">
          Pas je prijzen aan per formulier type. Deze prijzen worden gebruikt voor automatische offertes.
        </p>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div className={`flex items-center gap-2 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <Tabs defaultValue="kozijnen" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="kozijnen">Kozijnen</TabsTrigger>
          <TabsTrigger value="vloeren">Vloeren</TabsTrigger>
          <TabsTrigger value="schilderwerk">Schilderwerk</TabsTrigger>
        </TabsList>

        {/* Kozijnen Pricing */}
        <TabsContent value="kozijnen">
          <Card>
            <CardHeader>
              <CardTitle>Kozijnen Prijzen</CardTitle>
              <CardDescription>
                Stel basisprijs en multipliers in voor verschillende materialen en glas types
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="kozijnen-base">Basisprijs per kozijn (€)</Label>
                <Input
                  id="kozijnen-base"
                  type="number"
                  value={kozijnenPricing.base_price_per_window}
                  onChange={(e) => setKozijnenPricing({
                    ...kozijnenPricing,
                    base_price_per_window: parseFloat(e.target.value)
                  })}
                />
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3">Materiaal Multipliers</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Kunststof</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={kozijnenPricing.material_multipliers.kunststof}
                      onChange={(e) => setKozijnenPricing({
                        ...kozijnenPricing,
                        material_multipliers: {
                          ...kozijnenPricing.material_multipliers,
                          kunststof: parseFloat(e.target.value)
                        }
                      })}
                    />
                  </div>
                  <div>
                    <Label>Hout</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={kozijnenPricing.material_multipliers.hout}
                      onChange={(e) => setKozijnenPricing({
                        ...kozijnenPricing,
                        material_multipliers: {
                          ...kozijnenPricing.material_multipliers,
                          hout: parseFloat(e.target.value)
                        }
                      })}
                    />
                  </div>
                  <div>
                    <Label>Aluminium</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={kozijnenPricing.material_multipliers.aluminium}
                      onChange={(e) => setKozijnenPricing({
                        ...kozijnenPricing,
                        material_multipliers: {
                          ...kozijnenPricing.material_multipliers,
                          aluminium: parseFloat(e.target.value)
                        }
                      })}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3">Glas Type Multipliers</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <Label>Enkel</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={kozijnenPricing.glass_multipliers.enkel}
                      onChange={(e) => setKozijnenPricing({
                        ...kozijnenPricing,
                        glass_multipliers: {
                          ...kozijnenPricing.glass_multipliers,
                          enkel: parseFloat(e.target.value)
                        }
                      })}
                    />
                  </div>
                  <div>
                    <Label>Dubbel</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={kozijnenPricing.glass_multipliers.dubbel}
                      onChange={(e) => setKozijnenPricing({
                        ...kozijnenPricing,
                        glass_multipliers: {
                          ...kozijnenPricing.glass_multipliers,
                          dubbel: parseFloat(e.target.value)
                        }
                      })}
                    />
                  </div>
                  <div>
                    <Label>HR++</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={kozijnenPricing.glass_multipliers['hr++']}
                      onChange={(e) => setKozijnenPricing({
                        ...kozijnenPricing,
                        glass_multipliers: {
                          ...kozijnenPricing.glass_multipliers,
                          'hr++': parseFloat(e.target.value)
                        }
                      })}
                    />
                  </div>
                  <div>
                    <Label>Triple</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={kozijnenPricing.glass_multipliers.triple}
                      onChange={(e) => setKozijnenPricing({
                        ...kozijnenPricing,
                        glass_multipliers: {
                          ...kozijnenPricing.glass_multipliers,
                          triple: parseFloat(e.target.value)
                        }
                      })}
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={() => savePricing('kozijnen', kozijnenPricing)}
                disabled={saving === 'kozijnen'}
                className="w-full bg-[#4285f4] hover:bg-[#3367d6] text-white"
              >
                {saving === 'kozijnen' ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Opslaan...
                  </>
                ) : (
                  'Opslaan'
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vloeren Pricing */}
        <TabsContent value="vloeren">
          <Card>
            <CardHeader>
              <CardTitle>Vloeren Prijzen</CardTitle>
              <CardDescription>
                Stel prijzen per m² in voor verschillende vloer types
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold mb-3">Prijs per m² (materiaal)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Houten vloer (€/m²)</Label>
                    <Input
                      type="number"
                      value={vloerenPricing.price_per_m2.hout}
                      onChange={(e) => setVloerenPricing({
                        ...vloerenPricing,
                        price_per_m2: {
                          ...vloerenPricing.price_per_m2,
                          hout: parseFloat(e.target.value)
                        }
                      })}
                    />
                  </div>
                  <div>
                    <Label>PVC vloer (€/m²)</Label>
                    <Input
                      type="number"
                      value={vloerenPricing.price_per_m2.pvc}
                      onChange={(e) => setVloerenPricing({
                        ...vloerenPricing,
                        price_per_m2: {
                          ...vloerenPricing.price_per_m2,
                          pvc: parseFloat(e.target.value)
                        }
                      })}
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="vloeren-installation">Legkosten per m² (€)</Label>
                <Input
                  id="vloeren-installation"
                  type="number"
                  value={vloerenPricing.installation_cost_per_m2}
                  onChange={(e) => setVloerenPricing({
                    ...vloerenPricing,
                    installation_cost_per_m2: parseFloat(e.target.value)
                  })}
                />
              </div>

              <div>
                <Label htmlFor="vloeren-minimum">Minimale orderwaarde (€)</Label>
                <Input
                  id="vloeren-minimum"
                  type="number"
                  value={vloerenPricing.minimum_order}
                  onChange={(e) => setVloerenPricing({
                    ...vloerenPricing,
                    minimum_order: parseFloat(e.target.value)
                  })}
                />
              </div>

              <Button
                onClick={() => savePricing('vloeren', vloerenPricing)}
                disabled={saving === 'vloeren'}
                className="w-full bg-[#4285f4] hover:bg-[#3367d6] text-white"
              >
                {saving === 'vloeren' ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Opslaan...
                  </>
                ) : (
                  'Opslaan'
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schilderwerk Pricing */}
        <TabsContent value="schilderwerk">
          <Card>
            <CardHeader>
              <CardTitle>Schilderwerk Prijzen</CardTitle>
              <CardDescription>
                Stel prijzen per m² in voor binnen- en buitenschilderwerk
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold mb-3">Materiaalkosten per m²</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Binnen (€/m²)</Label>
                    <Input
                      type="number"
                      value={schilderwerkPricing.price_per_m2.binnen}
                      onChange={(e) => setSchilderwerkPricing({
                        ...schilderwerkPricing,
                        price_per_m2: {
                          ...schilderwerkPricing.price_per_m2,
                          binnen: parseFloat(e.target.value)
                        }
                      })}
                    />
                  </div>
                  <div>
                    <Label>Buiten (€/m²)</Label>
                    <Input
                      type="number"
                      value={schilderwerkPricing.price_per_m2.buiten}
                      onChange={(e) => setSchilderwerkPricing({
                        ...schilderwerkPricing,
                        price_per_m2: {
                          ...schilderwerkPricing.price_per_m2,
                          buiten: parseFloat(e.target.value)
                        }
                      })}
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="schilder-labor">Arbeidskosten per m² (€)</Label>
                <Input
                  id="schilder-labor"
                  type="number"
                  value={schilderwerkPricing.labor_cost_per_m2}
                  onChange={(e) => setSchilderwerkPricing({
                    ...schilderwerkPricing,
                    labor_cost_per_m2: parseFloat(e.target.value)
                  })}
                />
              </div>

              <div>
                <Label htmlFor="schilder-minimum">Minimale orderwaarde (€)</Label>
                <Input
                  id="schilder-minimum"
                  type="number"
                  value={schilderwerkPricing.minimum_order}
                  onChange={(e) => setSchilderwerkPricing({
                    ...schilderwerkPricing,
                    minimum_order: parseFloat(e.target.value)
                  })}
                />
              </div>

              <Button
                onClick={() => savePricing('schilderwerk', schilderwerkPricing)}
                disabled={saving === 'schilderwerk'}
                className="w-full bg-[#4285f4] hover:bg-[#3367d6] text-white"
              >
                {saving === 'schilderwerk' ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Opslaan...
                  </>
                ) : (
                  'Opslaan'
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

