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
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-gray-400 mt-2">
          Adjust your pricing per form type. These prices are used for automatic quotes.
        </p>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div className={`flex items-center gap-2 p-4 rounded-lg border ${
          message.type === 'success' 
            ? 'bg-green-500/10 text-green-400 border-green-500/20' 
            : 'bg-red-500/10 text-red-400 border-red-500/20'
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
        <TabsList className="grid w-full grid-cols-3 bg-slate-900/50 border border-purple-500/20">
          <TabsTrigger 
            value="kozijnen"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white text-gray-400"
          >
            Windows
          </TabsTrigger>
          <TabsTrigger 
            value="vloeren"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white text-gray-400"
          >
            Floors
          </TabsTrigger>
          <TabsTrigger 
            value="schilderwerk"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white text-gray-400"
          >
            Painting
          </TabsTrigger>
        </TabsList>

        {/* Kozijnen Pricing */}
        <TabsContent value="kozijnen">
          <Card className="bg-slate-900/50 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white">Window Pricing</CardTitle>
              <CardDescription className="text-gray-400">
                Set base price and multipliers for different materials and glass types
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="kozijnen-base" className="text-gray-300">Base price per window (€)</Label>
                <Input
                  id="kozijnen-base"
                  type="number"
                  value={kozijnenPricing.base_price_per_window}
                  onChange={(e) => setKozijnenPricing({
                    ...kozijnenPricing,
                    base_price_per_window: parseFloat(e.target.value)
                  })}
                  className="bg-slate-950/50 border-purple-500/20 text-white"
                />
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3 text-gray-300">Material Multipliers</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-gray-300">Plastic</Label>
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
                      className="bg-slate-950/50 border-purple-500/20 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Wood</Label>
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
                      className="bg-slate-950/50 border-purple-500/20 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Aluminum</Label>
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
                      className="bg-slate-950/50 border-purple-500/20 text-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3 text-gray-300">Glass Type Multipliers</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <Label className="text-gray-300">Single</Label>
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
                      className="bg-slate-950/50 border-purple-500/20 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Double</Label>
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
                      className="bg-slate-950/50 border-purple-500/20 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">HR++</Label>
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
                      className="bg-slate-950/50 border-purple-500/20 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Triple</Label>
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
                      className="bg-slate-950/50 border-purple-500/20 text-white"
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={() => savePricing('kozijnen', kozijnenPricing)}
                disabled={saving === 'kozijnen'}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                {saving === 'kozijnen' ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Settings'
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vloeren Pricing */}
        <TabsContent value="vloeren">
          <Card className="bg-slate-900/50 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white">Floor Pricing</CardTitle>
              <CardDescription className="text-gray-400">
                Set prices per m² for different floor types
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold mb-3 text-gray-300">Price per m² (material)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Wood floor (€/m²)</Label>
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
                      className="bg-slate-950/50 border-purple-500/20 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">PVC floor (€/m²)</Label>
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
                      className="bg-slate-950/50 border-purple-500/20 text-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="vloeren-installation" className="text-gray-300">Installation cost per m² (€)</Label>
                <Input
                  id="vloeren-installation"
                  type="number"
                  value={vloerenPricing.installation_cost_per_m2}
                  onChange={(e) => setVloerenPricing({
                    ...vloerenPricing,
                    installation_cost_per_m2: parseFloat(e.target.value)
                  })}
                  className="bg-slate-950/50 border-purple-500/20 text-white"
                />
              </div>

              <div>
                <Label htmlFor="vloeren-minimum" className="text-gray-300">Minimum order value (€)</Label>
                <Input
                  id="vloeren-minimum"
                  type="number"
                  value={vloerenPricing.minimum_order}
                  onChange={(e) => setVloerenPricing({
                    ...vloerenPricing,
                    minimum_order: parseFloat(e.target.value)
                  })}
                  className="bg-slate-950/50 border-purple-500/20 text-white"
                />
              </div>

              <Button
                onClick={() => savePricing('vloeren', vloerenPricing)}
                disabled={saving === 'vloeren'}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                {saving === 'vloeren' ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Settings'
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schilderwerk Pricing */}
        <TabsContent value="schilderwerk">
          <Card className="bg-slate-900/50 border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white">Painting Pricing</CardTitle>
              <CardDescription className="text-gray-400">
                Set prices per m² for interior and exterior painting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold mb-3 text-gray-300">Material cost per m²</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">Interior (€/m²)</Label>
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
                      className="bg-slate-950/50 border-purple-500/20 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">Exterior (€/m²)</Label>
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
                      className="bg-slate-950/50 border-purple-500/20 text-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="schilder-labor" className="text-gray-300">Labor cost per m² (€)</Label>
                <Input
                  id="schilder-labor"
                  type="number"
                  value={schilderwerkPricing.labor_cost_per_m2}
                  onChange={(e) => setSchilderwerkPricing({
                    ...schilderwerkPricing,
                    labor_cost_per_m2: parseFloat(e.target.value)
                  })}
                  className="bg-slate-950/50 border-purple-500/20 text-white"
                />
              </div>

              <div>
                <Label htmlFor="schilder-minimum" className="text-gray-300">Minimum order value (€)</Label>
                <Input
                  id="schilder-minimum"
                  type="number"
                  value={schilderwerkPricing.minimum_order}
                  onChange={(e) => setSchilderwerkPricing({
                    ...schilderwerkPricing,
                    minimum_order: parseFloat(e.target.value)
                  })}
                  className="bg-slate-950/50 border-purple-500/20 text-white"
                />
              </div>

              <Button
                onClick={() => savePricing('schilderwerk', schilderwerkPricing)}
                disabled={saving === 'schilderwerk'}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                {saving === 'schilderwerk' ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Settings'
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

