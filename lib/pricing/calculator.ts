interface FurnitureItem {
  item: string
  quantity: number
  size: 'small' | 'medium' | 'large'
}

interface PropertyInfo {
  type: 'appartement' | 'tussenwoning' | 'hoekwoning' | 'vrijstaand'
  verdieping: string
  postcode: string
}

interface AnalysisData {
  room_type: string
  furniture: FurnitureItem[]
  boxes_estimate: number
  volume_level: 'empty' | 'sparse' | 'half' | 'full' | 'very_full'
  floor_visible_percentage: number
  special_items: string[]
  estimated_hours: number
}

interface PriceBreakdown {
  items: {
    description: string
    quantity: number
    unitPrice: number
    total: number
  }[]
  labor: {
    hours: number
    hourlyRate: number
    total: number
  }
  transport: {
    baseFee: number
    distanceFee: number
    total: number
  }
  extras: {
    description: string
    price: number
  }[]
  subtotal: number
  discount: number
  total: number
}

// Pricing rules
const PRICING = {
  furniture: {
    small: 15,   // stoelen, tafeltjes, etc
    medium: 45,  // tafels, kasten, dressoirs
    large: 85,   // banken, bedden, grote kasten
  },
  boxes: 5,      // per doos/tas
  labor: {
    hourlyRate: 75,  // per persoon per uur
    persons: 2,      // standaard 2 personen
  },
  transport: {
    base: 150,       // vaste transportkosten
    perKm: 1.50,     // per km vanaf basis
  },
  verdieping: {
    'begane-grond': 0,
    '1e-verdieping': 50,
    '2e-verdieping': 100,
    '3e-verdieping': 150,
  },
  volumeMultiplier: {
    empty: 0.5,
    sparse: 0.7,
    half: 1.0,
    full: 1.3,
    very_full: 1.6,
  },
  specialItems: {
    piano: 150,
    'grote kast': 75,
    'gym apparatuur': 50,
    kluisje: 100,
  }
}

export function calculatePrice(
  analyses: AnalysisData[],
  propertyInfo: PropertyInfo
): PriceBreakdown {
  const items: PriceBreakdown['items'] = []
  let totalHours = 0
  let totalBoxes = 0

  // Analyze all photos
  analyses.forEach((analysis, index) => {
    // Count furniture
    analysis.furniture.forEach(f => {
      const unitPrice = PRICING.furniture[f.size]
      const existing = items.find(i => i.description === f.item)
      
      if (existing) {
        existing.quantity += f.quantity
        existing.total += unitPrice * f.quantity
      } else {
        items.push({
          description: f.item,
          quantity: f.quantity,
          unitPrice,
          total: unitPrice * f.quantity
        })
      }
    })

    // Count boxes
    totalBoxes += analysis.boxes_estimate

    // Sum hours
    totalHours += analysis.estimated_hours
  })

  // Add boxes as item
  if (totalBoxes > 0) {
    items.push({
      description: 'Dozen/tassen/losse items',
      quantity: totalBoxes,
      unitPrice: PRICING.boxes,
      total: totalBoxes * PRICING.boxes
    })
  }

  // Calculate average volume level
  const avgVolumeLevel = analyses.reduce((acc, a) => {
    return acc + PRICING.volumeMultiplier[a.volume_level]
  }, 0) / analyses.length

  // Items subtotal with volume multiplier
  const itemsSubtotal = items.reduce((sum, item) => sum + item.total, 0) * avgVolumeLevel

  // Labor costs
  const labor = {
    hours: Math.max(2, Math.ceil(totalHours / PRICING.labor.persons)), // minimum 2 uur
    hourlyRate: PRICING.labor.hourlyRate * PRICING.labor.persons,
    total: 0
  }
  labor.total = labor.hours * labor.hourlyRate

  // Transport costs
  const distanceKm = calculateDistance(propertyInfo.postcode)
  const transport = {
    baseFee: PRICING.transport.base,
    distanceFee: Math.max(0, distanceKm - 20) * PRICING.transport.perKm, // eerste 20km gratis
    total: 0
  }
  transport.total = transport.baseFee + transport.distanceFee

  // Extras (verdieping)
  const extras: PriceBreakdown['extras'] = []
  const verdieObject = propertyInfo.verdieping as keyof typeof PRICING.verdieping
  const verdielingCost = PRICING.verdieping[verdieObject] || 0
  
  if (verdielingCost > 0) {
    extras.push({
      description: `${propertyInfo.verdieping} toeslag`,
      price: verdielingCost
    })
  }

  // Special items
  analyses.forEach(analysis => {
    analysis.special_items.forEach(item => {
      const itemLower = item.toLowerCase()
      const specialPrice = Object.entries(PRICING.specialItems).find(([key]) => 
        itemLower.includes(key.toLowerCase())
      )?.[1]
      
      if (specialPrice) {
        extras.push({
          description: `Speciale behandeling: ${item}`,
          price: specialPrice
        })
      }
    })
  })

  const extrasTotal = extras.reduce((sum, e) => sum + e.price, 0)

  // Calculate totals
  const subtotal = itemsSubtotal + labor.total + transport.total + extrasTotal
  const discount = 0 // kan later toegevoegd worden
  const total = Math.round(subtotal - discount)

  return {
    items: items.map(i => ({
      ...i,
      total: Math.round(i.total * avgVolumeLevel)
    })),
    labor,
    transport,
    extras,
    subtotal: Math.round(subtotal),
    discount,
    total
  }
}

function calculateDistance(postcode: string): number {
  // Simpele afstandsberekening op basis van postcode
  // Voor Rotterdam centrum (3000) = basis
  const postcodeNum = parseInt(postcode.substring(0, 4))
  
  // Zeer ruwe schatting, later vervangen door echte afstand API
  const distances: Record<number, number> = {
    2400: 15,  // Den Haag
    2500: 15,
    2600: 10,  // Delft
    2700: 20,  // Zoetermeer
    3000: 0,   // Rotterdam centrum
    3100: 5,   // Schiedam
    3130: 8,   // Vlaardingen
    3200: 12,  // Spijkenisse
  }

  const range = Math.floor(postcodeNum / 100) * 100
  return distances[range] || 25 // default 25km
}


