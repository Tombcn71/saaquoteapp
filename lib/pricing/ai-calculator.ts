// Pricing calculator for window frames (kozijnen)

interface FormData {
  postcode: string
  materiaal: string // kunststof, hout, aluminium
  kleur: string
  kozijnType: string
  vierkanteMeterRamen: string
  aantalRamen: string
  glasType: string
  montage: boolean
  afvoerOudeKozijnen: boolean
}

interface AIAnalysis {
  window_count: number
  window_type: string
  estimated_size: number
  condition: string
  notes: string
}

// Basis tarieven voor kozijnen
const BASE_RATES = {
  // Prijs per m² kozijn (materiaal)
  materiaal: {
    'kunststof': 280,        // €280 per m²
    'hout': 450,             // €450 per m²
    'aluminium': 550,        // €550 per m²
    'hout-aluminium': 650,   // €650 per m²
  },
  // Prijs per m² glas
  glasType: {
    'dubbel': 80,            // €80 per m²
    'hr++': 120,             // €120 per m²
    'triple': 180,           // €180 per m²
    'geluidswerend': 220,    // €220 per m²
  },
  // Type kozijn correctie
  kozijnType: {
    'draaikiepraam': 1.0,
    'draadraam': 0.9,
    'kiepraam': 0.95,
    'schuifraam': 1.2,
    'vaste-beglazing': 0.7,
  },
  // Kleur toeslag (percentage)
  kleur: {
    'wit': 0,
    'creme': 0,
    'grijs': 50,             // +€50 per raam
    'antraciet': 50,
    'zwart': 75,             // +€75 per raam
    'donkergroen': 50,
    'houtkleur': 100,        // +€100 per raam
  },
  montage: 75,               // €75 per raam
  afvoer: 200,               // €200 forfait
  minPrice: 1500,
}

export function calculatePriceFromAI(
  formData: FormData,
  analysisResults: Array<{ analysis: AIAnalysis }>
): { total: number; breakdown: { kozijnen: number; glas: number; montage: number; afvoer: number } } {
  
  // 1. Parse vierkante meters
  const sqmRange = formData.vierkanteMeterRamen.split('-')
  const avgSqm = sqmRange.length === 2 
    ? (parseInt(sqmRange[0]) + parseInt(sqmRange[1])) / 2
    : parseInt(sqmRange[0].replace('+', ''))

  const aantalRamen = parseInt(formData.aantalRamen) || 1

  // 2. Bereken kozijn kosten (materiaal)
  const materiaalPrijsPerM2 = BASE_RATES.materiaal[formData.materiaal as keyof typeof BASE_RATES.materiaal] || 280
  const kozijnTypeMultiplier = BASE_RATES.kozijnType[formData.kozijnType as keyof typeof BASE_RATES.kozijnType] || 1.0
  const kleurToeslag = BASE_RATES.kleur[formData.kleur as keyof typeof BASE_RATES.kleur] || 0
  
  let kozijnenCost = avgSqm * materiaalPrijsPerM2 * kozijnTypeMultiplier
  kozijnenCost += aantalRamen * kleurToeslag

  // 3. Bereken glas kosten
  const glasPrijsPerM2 = BASE_RATES.glasType[formData.glasType as keyof typeof BASE_RATES.glasType] || 80
  const glasCost = avgSqm * glasPrijsPerM2

  // 4. Montage kosten
  const montageCost = formData.montage ? aantalRamen * BASE_RATES.montage : 0

  // 5. Afvoer kosten
  const afvoerCost = formData.afvoerOudeKozijnen ? BASE_RATES.afvoer : 0

  // Totaal berekenen
  const subtotal = kozijnenCost + glasCost + montageCost + afvoerCost
  const total = Math.max(subtotal, BASE_RATES.minPrice)

  return {
    total: Math.round(total),
    breakdown: {
      kozijnen: Math.round(kozijnenCost),
      glas: Math.round(glasCost),
      montage: Math.round(montageCost),
      afvoer: Math.round(afvoerCost),
    },
  }
}

