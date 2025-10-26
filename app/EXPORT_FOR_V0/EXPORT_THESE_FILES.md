# FILES OM TE BEWAREN VOOR IMPORT NA V0

## 1. CORE AI FUNCTIONALITEIT (MOET JE HEBBEN)

### Components
- `components/ai-quote-form.tsx` - Het complete AI formulier
- `components/photo-upload.tsx` - Foto upload component

### API Routes  
- `app/api/analyze/route.ts` - Google Gemini AI analyse
- `app/api/generate-kozijn-preview/route.ts` - AI preview generatie
- `app/api/upload/route.ts` - Vercel Blob upload handler
- `app/api/leads/route.ts` - Lead opslaan (pas aan voor jouw nieuwe DB)

### Pricing Logic
- `lib/pricing/ai-calculator.ts` - Prijs berekening logica
- `lib/pricing/calculator.ts` - Pricing engine

### UI Components (shadcn - waarschijnlijk heeft v0 deze al)
- `components/ui/button.tsx`
- `components/ui/card.tsx`
- `components/ui/input.tsx`
- `components/ui/label.tsx`
- `components/ui/select.tsx`
- `components/ui/checkbox.tsx`
- `components/ui/progress.tsx`

## 2. ENVIRONMENT VARIABLES

Zet deze in je nieuwe v0 project:

```env
GOOGLE_GENERATIVE_AI_API_KEY=jouw_google_ai_key
BLOB_READ_WRITE_TOKEN=jouw_vercel_blob_token
```

## 3. DEPENDENCIES

Voeg deze toe aan package.json:

```json
{
  "@google/genai": "1.27.0",
  "@vercel/blob": "2.0.0",
  "lucide-react": "latest"
}
```

## 4. WAT V0 MOET MAKEN

Geef v0 deze prompt:

"Maak een SaaS platform voor kozijn bedrijven met:
- User authentication (email/password)
- Postgres database met tables voor: companies, users, leads, widgets
- Dashboard pagina met company stats
- Settings pagina voor widget configuratie
- Leads overzicht pagina
- Moderne UI met shadcn/ui
- RLS/Row Level Security voor multi-tenancy"

## 5. NA V0 EXPORT

1. Kopieer deze files naar je nieuwe v0 project
2. Update imports als paths anders zijn
3. Pas `app/api/leads/route.ts` aan voor je nieuwe DB schema
4. Maak een `/demo` pagina met AIQuoteForm
5. Maak een widget embed pagina

## 6. WIDGET EMBED FILE (bewaar deze)

- `public/widget.js` - JavaScript embed code voor klanten
- `app/widget/embed/page.tsx` - Widget iframe pagina

