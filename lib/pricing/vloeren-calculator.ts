// Vloeren pricing calculator
// Berekent prijzen op basis van company pricing settings

export interface VloerenPricingConfig {
  price_per_m2: {
    hout: number
    pvc: number
  }
  installation_cost_per_m2: number
  minimum_order: number
}

export interface VloerenFormData {
  type: 'hout' | 'pvc'
  surfaceArea: number
  style?: string
}

export interface VloerenPriceBreakdown {
  materialCost: number
  installationCost: number
  subtotal: number
  minimumOrderSurcharge: number
  total: number
  pricePerM2: number
}

export function calculateVloerenPrice(
  formData: VloerenFormData,
  pricingConfig: VloerenPricingConfig
): VloerenPriceBreakdown {
  const { type, surfaceArea } = formData
  const { price_per_m2, installation_cost_per_m2, minimum_order } = pricingConfig

  // Calculate material cost
  const materialPricePerM2 = price_per_m2[type] || price_per_m2.pvc
  const materialCost = materialPricePerM2 * surfaceArea

  // Calculate installation cost
  const installationCost = installation_cost_per_m2 * surfaceArea

  // Subtotal
  const subtotal = materialCost + installationCost

  // Check minimum order
  let minimumOrderSurcharge = 0
  if (subtotal < minimum_order) {
    minimumOrderSurcharge = minimum_order - subtotal
  }

  // Total
  const total = subtotal + minimumOrderSurcharge

  return {
    materialCost: Math.round(materialCost),
    installationCost: Math.round(installationCost),
    subtotal: Math.round(subtotal),
    minimumOrderSurcharge: Math.round(minimumOrderSurcharge),
    total: Math.round(total),
    pricePerM2: Math.round((materialCost + installationCost) / surfaceArea)
  }
}

export function formatVloerenPrice(price: number): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price)
}

