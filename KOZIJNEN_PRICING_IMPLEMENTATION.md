# Kozijnen Pricing Calculator - Implementatie Instructies voor Cursor Claude

## INSTRUCTIES VOOR CURSOR CLAUDE

Implementeer de onderstaande kozijnen pricing calculator logica in het bestaande formulier. De gebruiker heeft al een werkend formulier met foto upload. Voeg alleen de pricing calculatie toe.

### WAT TE DOEN:
1. Voeg de TypeScript types, constanten en functies toe
2. Integreer de form velden voor woningtype, aantal kozijnen, glasoppervlakte en glastype
3. Bereken en toon de prijs range op basis van de gekozen opties
4. Gebruik de bestaande styling en componenten van het formulier

### ⚠️ BELANGRIJK - NIET AANPASSEN:
- **LAAT DE GEMINI AI PREVIEW FUNCTIONALITEIT VOLLEDIG INTACT**
- **RAAK DE FOTO UPLOAD LOGICA NIET AAN**
- **VERANDER NIETS AAN DE AI IMAGE GENERATION CODE**
- Voeg alleen de pricing calculator logica TOE aan het bestaande formulier
- De foto upload en AI preview werken al perfect - laat dit exact zoals het is!

### PRICING REGELS:
- Prijs = glasoppervlakte (m²) × €1.000 tot €1.400
- HR+++ glas = +10% op totaalprijs
- Toon prijs pas als glasoppervlakte gekozen is
- Gebruik Nederlandse formatting (€20.000 niet €20,000)

---

## 1. TYPESCRIPT TYPES & INTERFACES

```typescript
// Types
interface WoningtypeData {
  label: string
  kozijnenRange: {
    min: number
    max: number
  }
  glasRange: {
    min: number
    max: number
  }
}

interface PriceRange {
  min: number
  max: number
}

type WoningtypeKey = 'appartement' | 'tussenwoning' | 'hoekwoning' | 'twee_onder_een_kap' | 'vrijstaand'
type GlasType = 'hr++' | 'hr+++'

interface KozijnenFormData {
  woningtype: WoningtypeKey | ''
  aantalKozijnen: string
  glasoppervlakte: string
  glasType: GlasType
}
```

---

## 2. CONSTANTEN & DATA

```typescript
// Woningtype data (uit marktonderzoek)
const WONINGTYPE_DATA: Record<WoningtypeKey, WoningtypeData> = {
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

// Prijs per vierkante meter (inclusief montage en HR++ glas)
const PRICE_PER_M2 = {
  min: 1000, // Basis kunststof kozijnen
  max: 1400  // Premium kunststof kozijnen
} as const
```

---

## 3. CALCULATIE FUNCTIES

```typescript
/**
 * Bereken prijs range op basis van glasoppervlakte en glastype
 * @param glasoppervlakte - Totale glasoppervlakte in m²
 * @param glasType - Type glas (hr++ of hr+++)
 * @returns PriceRange met min en max prijs, of null als geen glasoppervlakte
 */
function calculatePriceRange(
  glasoppervlakte: string | number,
  glasType: GlasType
): PriceRange | null {
  if (!glasoppervlakte) return null
  
  const m2 = typeof glasoppervlakte === 'string' 
    ? parseInt(glasoppervlakte, 10) 
    : glasoppervlakte
  
  // Basis berekening
  let minPrice = m2 * PRICE_PER_M2.min  // Gekozen m² × €1.000
  let maxPrice = m2 * PRICE_PER_M2.max  // Gekozen m² × €1.400
  
  // Als HR+++ gekozen, +10% op beide prijzen
  if (glasType === 'hr+++') {
    minPrice = Math.round(minPrice * 1.10)
    maxPrice = Math.round(maxPrice * 1.10)
  }
  
  return { min: minPrice, max: maxPrice }
}

/**
 * Genereer array met aantal kozijnen opties op basis van woningtype
 */
function getKozijnenOptions(woningtype: WoningtypeKey): number[] {
  const data = WONINGTYPE_DATA[woningtype]
  if (!data) return []
  
  const options: number[] = []
  for (let i = data.kozijnenRange.min; i <= data.kozijnenRange.max; i++) {
    options.push(i)
  }
  return options
}

/**
 * Genereer array met glasoppervlakte opties (in m²) op basis van woningtype
 */
function getGlasoppervlakteOptions(woningtype: WoningtypeKey): number[] {
  const data = WONINGTYPE_DATA[woningtype]
  if (!data) return []
  
  const options: number[] = []
  for (let i = data.glasRange.min; i <= data.glasRange.max; i++) {
    options.push(i)
  }
  return options
}

/**
 * Format prijs naar Nederlands formaat (€20.000)
 */
function formatPrice(price: number): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price)
}
```

---

## 4. REACT COMPONENT VOORBEELD (VOLLEDIG)

```typescript
import { useState } from 'react'

function KozijnenPricingForm() {
  const [formData, setFormData] = useState<KozijnenFormData>({
    woningtype: '',
    aantalKozijnen: '',
    glasoppervlakte: '',
    glasType: 'hr++'
  })

  // Bereken prijs automatisch bij wijziging
  const priceRange = formData.glasoppervlakte 
    ? calculatePriceRange(formData.glasoppervlakte, formData.glasType)
    : null

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-6">
      
      {/* STAP 1: Woningtype */}
      <div>
        <label className="text-base font-semibold mb-3 block text-gray-900">
          Wat voor type woning heeft u?
        </label>
        <div className="grid grid-cols-1 gap-3">
          {(Object.entries(WONINGTYPE_DATA) as [WoningtypeKey, WoningtypeData][]).map(([key, value]) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setFormData({ 
                  ...formData, 
                  woningtype: key,
                  aantalKozijnen: '', // Reset dependent fields
                  glasoppervlakte: ''
                })
              }}
              className={`p-4 border-2 rounded-lg text-left transition-all ${
                formData.woningtype === key
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-400'
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

      {/* STAP 2: Details (alleen tonen als woningtype gekozen) */}
      {formData.woningtype && (
        <div className="space-y-6">
          
          {/* Aantal Kozijnen */}
          <div>
            <label htmlFor="aantalKozijnen" className="text-base font-semibold mb-3 block text-gray-900">
              Hoeveel kozijnen wilt u vervangen?
            </label>
            <select
              id="aantalKozijnen"
              value={formData.aantalKozijnen}
              onChange={(e) => setFormData({ ...formData, aantalKozijnen: e.target.value })}
              className="w-full p-3 border-2 border-gray-200 rounded-lg text-base focus:border-blue-500 focus:outline-none"
            >
              <option value="">Kies aantal kozijnen</option>
              {getKozijnenOptions(formData.woningtype).map(num => (
                <option key={num} value={num}>
                  {num} kozijnen
                </option>
              ))}
            </select>
          </div>

          {/* Glasoppervlakte */}
          <div>
            <label htmlFor="glasoppervlakte" className="text-base font-semibold mb-3 block text-gray-900">
              Totale glasoppervlakte (alle ramen samen)
            </label>
            <select
              id="glasoppervlakte"
              value={formData.glasoppervlakte}
              onChange={(e) => setFormData({ ...formData, glasoppervlakte: e.target.value })}
              className="w-full p-3 border-2 border-gray-200 rounded-lg text-base focus:border-blue-500 focus:outline-none"
            >
              <option value="">Kies glasoppervlakte</option>
              {getGlasoppervlakteOptions(formData.woningtype).map(num => (
                <option key={num} value={num}>
                  {num} m²
                </option>
              ))}
            </select>
          </div>

          {/* Glastype */}
          <div>
            <label className="text-base font-semibold mb-3 block text-gray-900">
              Welk type glas wenst u?
            </label>
            <div className="grid grid-cols-1 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, glasType: 'hr++' })}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  formData.glasType === 'hr++'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-400'
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
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-400'
                }`}
              >
                <div className="font-semibold text-gray-900">HR+++ glas</div>
                <div className="text-sm text-gray-600 mt-1">
                  Beste isolatie - +10% op totaalprijs
                </div>
              </button>
            </div>
          </div>

          <p className="text-xs text-gray-500">
            💡 Niet zeker van de maten? Kies een schatting - we bespreken de exacte details later
          </p>
        </div>
      )}

      {/* PRIJS WEERGAVE (alleen tonen als glasoppervlakte gekozen) */}
      {priceRange && (
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            💰 Uw Prijsindicatie
          </h3>
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Vanaf</p>
              <p className="text-3xl font-bold text-blue-600">
                {formatPrice(priceRange.min)}
              </p>
            </div>
            <div className="text-2xl text-gray-400">-</div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Tot</p>
              <p className="text-3xl font-bold text-blue-600">
                {formatPrice(priceRange.max)}
              </p>
            </div>
          </div>
          <div className="text-sm text-gray-700 space-y-1">
            <p>✓ Vanaf-prijs: basis kunststof kozijnen</p>
            <p>✓ Tot-prijs: premium opties & afwerking</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default KozijnenPricingForm
```

---

## 5. GEBRUIK VOORBEELDEN

### Voorbeeld 1: Tussenwoning berekening
```typescript
const woningtype = 'tussenwoning'
const glasoppervlakte = '20'
const glasType = 'hr++'

const priceRange = calculatePriceRange(glasoppervlakte, glasType)
console.log(priceRange)
// Output: { min: 20000, max: 28000 }

console.log(`Vanaf ${formatPrice(priceRange.min)} tot ${formatPrice(priceRange.max)}`)
// Output: "Vanaf €20.000 tot €28.000"
```

### Voorbeeld 2: Met HR+++ glas
```typescript
const priceRangeHRplus = calculatePriceRange('20', 'hr+++')
console.log(priceRangeHRplus)
// Output: { min: 22000, max: 30800 }
```

### Voorbeeld 3: Dropdown opties genereren
```typescript
const kozijnenOpties = getKozijnenOptions('tussenwoning')
console.log(kozijnenOpties)
// Output: [8, 9, 10]

const glasOpties = getGlasoppervlakteOptions('tussenwoning')
console.log(glasOpties)
// Output: [18, 19, 20, 21, 22]
```

---

## 6. IMPLEMENTATIE CHECKLIST

### ✅ TE DOEN:
- [ ] Kopieer alle types en interfaces
- [ ] Voeg constanten toe (WONINGTYPE_DATA, PRICE_PER_M2)
- [ ] Implementeer calculatie functies
- [ ] Voeg form velden toe voor:
  - [ ] Woningtype selectie
  - [ ] Aantal kozijnen dropdown
  - [ ] Glasoppervlakte dropdown
  - [ ] Glastype selectie (HR++ / HR+++)
- [ ] Implementeer prijs weergave sectie
- [ ] Test alle woningtype varianten
- [ ] Test HR++ vs HR+++ prijsverschil
- [ ] Valideer Nederlandse prijs formatting

### ❌ NIET DOEN:
- [ ] ❌ Gemini AI preview code NIET wijzigen
- [ ] ❌ Foto upload functionaliteit NIET aanpassen
- [ ] ❌ AI image generation logic NIET veranderen
- [ ] ❌ Bestaande API calls naar /api/generate-kozijn-preview NIET wijzigen
- [ ] ❌ Photo upload component NIET vervangen

---

## 7. BELANGRIJKE NOTITIES

### ⚠️ KRITISCH - BESTAANDE FUNCTIONALITEIT BEHOUDEN:
Het formulier heeft al werkende foto upload en Gemini AI preview functionaliteit. **RAAK DIT NIET AAN!**

De bestaande code bevat waarschijnlijk:
- `/api/upload` - Vercel Blob upload endpoint
- `/api/generate-kozijn-preview` - Gemini AI image generation
- Photo upload component met drag & drop
- AI preview voor/na afbeeldingen

**→ Voeg alleen de pricing velden en berekening TOE**
**→ Wijzig NIETS aan de bestaande foto/AI functionaliteit**

### Pricing Logica:
- **Basis**: glasoppervlakte (m²) × €1.000 (min) tot €1.400 (max)
- **HR+++**: Voeg 10% toe aan beide min en max prijzen
- **Formaat**: Gebruik Nederlandse locale (€20.000 niet $20,000)

### Form Flow:
1. Kies woningtype → Reset aantal kozijnen en glasoppervlakte
2. Kies aantal kozijnen → Valideer tegen woningtype range
3. Kies glasoppervlakte → Bereken prijs automatisch
4. Kies glastype → Herbereken prijs met +10% voor HR+++
5. **[BESTAAND]** Upload foto's → AI preview genereren (NIET AANPASSEN!)

### UX Tips:
- Toon prijs pas als glasoppervlakte gekozen is
- Reset dependent fields bij woningtype wijziging
- Gebruik visuele feedback (border colors) voor geselecteerde opties
- Toon bereik (8-10 kozijnen) bij woningtype knoppen

---

## 8. VEELGESTELDE VRAGEN

**Q: Waarom is de minimum prijs €15.000 voor een appartement en niet €10.000?**
A: De tabel gebruikt realistische praktijkprijzen. €1.000/m² is de theoretische bodem, maar in de praktijk zijn er vaste kosten (montage, administratie) waardoor kleinere projecten duurder uitvallen per m².

**Q: Hoe bereken ik de prijs voor een specifiek aantal m²?**
A: Gebruik exact de gekozen m²:
```typescript
14 m² × €1.000 = €14.000 (min)
14 m² × €1.400 = €19.600 (max)
```

**Q: Wat is het verschil tussen HR++ en HR+++?**
A: HR+++ glas kost 10% meer maar heeft betere isolatie. De +10% wordt toegepast op zowel de minimum als maximum prijs.

---

## SUCCES MET DE IMPLEMENTATIE! 🚀

Bij vragen of problemen, check de voorbeelden hierboven of vraag om verduidelijking.

