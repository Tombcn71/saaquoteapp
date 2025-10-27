// Schilderwerk pricing calculator
// Berekent prijzen op basis van company pricing settings

export interface SchilderwerkPricingConfig {
  price_per_m2: {
    binnen: number
    buiten: number
  }
  labor_cost_per_m2: number
  minimum_order: number
}

export interface SchilderwerkFormData {
  type: 'binnen' | 'buiten'
  surfaceArea: number
  color?: string
}

export interface SchilderwerkPriceBreakdown {
  materialCost: number
  laborCost: number
  subtotal: number
  minimumOrderSurcharge: number
  total: number
  pricePerM2: number
}

export function calculateSchilderwerkPrice(
  formData: SchilderwerkFormData,
  pricingConfig: SchilderwerkPricingConfig
): SchilderwerkPriceBreakdown {
  const { type, surfaceArea } = formData
  const { price_per_m2, labor_cost_per_m2, minimum_order } = pricingConfig

  // Calculate material cost
  const materialPricePerM2 = price_per_m2[type] || price_per_m2.binnen
  const materialCost = materialPricePerM2 * surfaceArea

  // Calculate labor cost
  const laborCost = labor_cost_per_m2 * surfaceArea

  // Subtotal
  const subtotal = materialCost + laborCost

  // Check minimum order
  let minimumOrderSurcharge = 0
  if (subtotal < minimum_order) {
    minimumOrderSurcharge = minimum_order - subtotal
  }

  // Total
  const total = subtotal + minimumOrderSurcharge

  return {
    materialCost: Math.round(materialCost),
    laborCost: Math.round(laborCost),
    subtotal: Math.round(subtotal),
    minimumOrderSurcharge: Math.round(minimumOrderSurcharge),
    total: Math.round(total),
    pricePerM2: Math.round((materialCost + laborCost) / surfaceArea)
  }
}

export function formatSchilderwerkPrice(price: number): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price)
}

