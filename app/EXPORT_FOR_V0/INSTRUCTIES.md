# STAPPEN OM AI FUNCTIONALITEIT IN V0 PROJECT TE IMPORTEREN

## STAP 1: MAAK V0 PROJECT

Ga naar: https://v0.dev

Gebruik deze prompt:

```
Maak een SaaS platform voor window/kozijn installatie bedrijven.

Features:
- User authentication (email/password signup & login)
- PostgreSQL database
- Multi-tenant: companies table, users table (linked to company), leads table, widgets table
- Dashboard homepage met stats (total leads, revenue, avg quote)
- /leads pagina met lead overzicht voor het bedrijf
- /settings pagina voor company profile
- /widgets pagina voor embed code generatie
- Moderne UI met Tailwind en shadcn/ui
- Navigation sidebar
- User kan uitloggen
```

Export het v0 project naar je computer.

## STAP 2: KOPIEER AI FILES

Kopieer deze folders/files naar je nieuwe v0 project:

```
EXPORT_FOR_V0/components/ai-quote-form.tsx     → [v0-project]/components/
EXPORT_FOR_V0/components/photo-upload.tsx      → [v0-project]/components/
EXPORT_FOR_V0/api/*                            → [v0-project]/app/api/
EXPORT_FOR_V0/lib/pricing/*                    → [v0-project]/lib/pricing/
EXPORT_FOR_V0/public/widget.js                 → [v0-project]/public/
```

## STAP 3: INSTALLEER DEPENDENCIES

```bash
cd [je-v0-project]
pnpm install @google/genai @vercel/blob
```

## STAP 4: ENVIRONMENT VARIABLES

Voeg toe aan je v0 project (Vercel of .env.local):

```
GOOGLE_GENERATIVE_AI_API_KEY=AIza...
BLOB_READ_WRITE_TOKEN=vercel_blob_...
```

## STAP 5: MAAK DEMO PAGINA

Maak: `app/demo/page.tsx`

```tsx
'use client'

import { AIQuoteForm } from '@/components/ai-quote-form'

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">AI Kozijn Quote Demo</h1>
        <AIQuoteForm />
      </div>
    </div>
  )
}
```

## STAP 6: UPDATE LEADS API

In `app/api/leads/route.ts`, update de database calls naar jouw v0 database client.

Als v0 Prisma gebruikte:
```typescript
await prisma.lead.create({
  data: { ... }
})
```

Als v0 Drizzle gebruikte:
```typescript
await db.insert(leads).values({ ... })
```

## STAP 7: TEST

```bash
pnpm dev
```

Test:
- `/demo` - AI form moet werken
- Upload foto's, krijg offerte
- Lead moet in database komen

## STAP 8: WIDGET EMBED

Maak `app/widget/[companyId]/page.tsx`:

```tsx
import { AIQuoteForm } from '@/components/ai-quote-form'

export default function WidgetEmbed({ params }: { params: { companyId: string } }) {
  return <AIQuoteForm companyId={params.companyId} />
}
```

## KLAAR!

Nu heb je:
✅ Werkende auth (van v0)
✅ Database setup (van v0)
✅ AI functionaliteit (van jou)
✅ Dashboard (van v0)

Stuur me de v0 project en ik help met de integratie!

