# 🚀 Kozijn SaaS - Complete Setup Guide

Een multi-tenant SaaS platform waarbij kozijnbedrijven een AI-powered quote widget op hun website kunnen plaatsen.

## 📋 Wat heb je gebouwd?

### Voor Kozijnbedrijven (Jouw klanten):
1. **Account aanmaken** → Krijgen een bedrijfsdashboard
2. **Widget code ophalen** → Copy-paste JavaScript snippet  
3. **Plaatsen op website** → Widget wordt zichtbaar voor hun bezoekers
4. **Leads ontvangen** → Alle offerteaanvragen komen binnen in hun dashboard

### Voor Eindklanten (Klanten van jouw klanten):
1. Bezoeken website van kozijnbedrijf
2. Zien de widget en vullen het formulier in
3. Uploaden foto's van hun huidige kozijnen
4. AI genereert preview van nieuwe kozijnen + prijsindicatie
5. Vullen contactgegevens in → Lead komt binnen bij het bedrijf

---

## 🗄️ Database Setup

### Stap 1: Voer SQL scripts uit in je Neon database

Ga naar [Neon Console](https://console.neon.tech) → SQL Editor

```sql
-- 1. Eerst de auth tables (als die er nog niet zijn)
-- Voer uit: scripts/001_create_auth_tables.sql

-- 2. Voeg password column toe
-- Voer uit: scripts/002_add_password_to_users.sql

-- 3. Maak de SaaS tables aan
-- Voer uit: scripts/003_create_saas_tables.sql
```

**Let op:** De scripts gebruiken `gen_random_uuid()::text` voor UUID's. Als dit een error geeft, vervang dan door:
```sql
DEFAULT replace(uuid_generate_v4()::text, '-', '')
```

---

## 🔐 Environment Variables

### Maak `.env.local` aan in de root:

```bash
# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/kozijnsaas?sslmode=require

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=genereer-een-secret-met-openssl-rand-base64-32

# AI Functionality (Google Gemini)
GOOGLE_GENERATIVE_AI_API_KEY=AIzaSy...

# File Upload (Vercel Blob)
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
```

### Environment Variables ophalen:

#### 1. DATABASE_URL (Neon)
```bash
# Ga naar: https://console.neon.tech
# Selecteer je project
# Kopieer de connection string
# Format: postgresql://user:password@host/database?sslmode=require
```

#### 2. NEXTAUTH_SECRET
```bash
# Genereer een random secret:
openssl rand -base64 32
```

#### 3. GOOGLE_GENERATIVE_AI_API_KEY
```bash
# Ga naar: https://aistudio.google.com/app/apikey
# Klik "Create API Key"
# Kopieer de key (begint met AIza...)
```

#### 4. BLOB_READ_WRITE_TOKEN
```bash
# Ga naar: https://vercel.com/dashboard
# Ga naar je project → Storage → Blob
# Klik "Create Token"
# Geef Read & Write permissions
# Kopieer de token (begint met vercel_blob_rw_...)
```

---

## 📦 Installatie & Start

```bash
# 1. Installeer dependencies (als nog niet gedaan)
pnpm install

# 2. Voeg react-dropzone toe
pnpm install react-dropzone

# 3. Start development server
pnpm dev

# 4. Open browser
open http://localhost:3000
```

---

## 🧪 Test het Systeem

### 1. Maak een testaccount aan

```bash
# Ga naar: http://localhost:3000/auth/signup

Bedrijfsnaam: Kozijnen Pro BV
Naam: Test User
Email: test@example.com
Password: Test123456
```

→ Dit maakt automatisch:
- ✅ Een company in de database
- ✅ Een user gekoppeld aan die company
- ✅ Een default widget voor die company

### 2. Login

```bash
# Ga naar: http://localhost:3000/auth/signin
Email: test@example.com
Password: Test123456
```

### 3. Bekijk Dashboard

```bash
# Je zou moeten zien:
- Welkom bericht met bedrijfsnaam
- Stats (alles nog op 0)
- Quick Start Guide
```

### 4. Haal Widget Code Op

```bash
# Ga naar: http://localhost:3000/dashboard/widgets

Je ziet:
- Widget ID
- Stats (views, conversions)
- **Embed Code** (JavaScript snippet)
- **iFrame Code** (alternatief)
- Live Preview link
```

### 5. Test de Widget

```bash
# Klik op "Open Widget Preview"
# Of ga direct naar: http://localhost:3000/widget/[widget-id]

Test het formulier:
1. Vul specificaties in (materiaal, kleur, type, etc.)
2. Upload een foto
3. Klik "Bereken Prijs & Preview"
4. AI analyseert en toont preview (duurt 30-60 sec)
5. Vul contactgegevens in
6. Klik "Bevestig Offerte"
```

### 6. Check Leads Dashboard

```bash
# Ga naar: http://localhost:3000/dashboard/leads

Je zou moeten zien:
- De nieuwe lead met alle details
- Foto's
- Prijsopbouw
- Contact informatie
```

---

## 🌐 Widget Embedden (Voor Klanten)

Je klanten kunnen de widget op 2 manieren embedden:

### Optie 1: JavaScript Embed (Aanbevolen)

```html
<!-- Plak dit waar de widget moet verschijnen -->
<div id="kozijn-widget"></div>
<script src="http://localhost:3000/widget.js" 
        data-widget-id="[WIDGET_ID]" 
        async>
</script>
```

### Optie 2: iFrame Embed

```html
<iframe 
  src="http://localhost:3000/widget/[WIDGET_ID]" 
  width="100%" 
  height="800" 
  frameborder="0"
  style="border: none; border-radius: 8px;"
></iframe>
```

---

## 📁 Project Structuur

```
saaquoteapp/
├── app/
│   ├── api/
│   │   ├── auth/              # NextAuth endpoints
│   │   ├── leads/             # Lead management API
│   │   ├── upload/            # Vercel Blob uploads
│   │   ├── analyze/           # Google Gemini AI
│   │   └── generate-kozijn-preview/  # AI preview generation
│   ├── auth/
│   │   ├── signin/            # Login pagina
│   │   └── signup/            # Registratie (+ company + widget)
│   ├── dashboard/
│   │   ├── page.tsx           # Dashboard met stats
│   │   ├── leads/             # Leads overzicht
│   │   └── widgets/           # Widget beheer & embed code
│   └── widget/
│       └── [widgetId]/        # Embeddable widget pagina
├── components/
│   ├── ai-quote-form.tsx      # Het AI formulier
│   ├── photo-upload.tsx       # Foto upload component
│   └── ui/                    # shadcn/ui components
├── lib/
│   ├── auth.ts                # NextAuth config
│   └── pricing/
│       ├── ai-calculator.ts   # Prijsberekening
│       └── calculator.ts      # Pricing engine
└── scripts/
    ├── 001_create_auth_tables.sql
    ├── 002_add_password_to_users.sql
    └── 003_create_saas_tables.sql
```

---

## 🔥 Database Schema

```sql
companies          # Kozijnbedrijven
  ├── id
  ├── name
  ├── email
  ├── plan (free/starter/professional)
  ├── leads_limit
  └── leads_used

users              # Gebruikers van bedrijven
  ├── id
  ├── email
  ├── password
  ├── company_id  → companies
  └── role (owner/admin/member)

widgets            # Embed widgets per bedrijf
  ├── id
  ├── company_id  → companies
  ├── name
  ├── is_active
  ├── views
  └── conversions

leads              # Quote aanvragen
  ├── id
  ├── company_id  → companies
  ├── widget_id   → widgets
  ├── naam, email, telefoon
  ├── materiaal, kleur, kozijn_type
  ├── quote_total
  ├── photo_urls[]
  ├── preview_urls[]
  └── status (new/contacted/quoted/won/lost)
```

---

## 🚀 Deployment (Vercel)

### 1. Push naar GitHub

```bash
git add .
git commit -m "Kozijn SaaS platform klaar"
git push origin main
```

### 2. Deploy naar Vercel

```bash
# Ga naar: https://vercel.com
# Klik "New Project"
# Import je GitHub repo
# Voeg environment variables toe:
  - DATABASE_URL
  - NEXTAUTH_URL (https://jouw-domein.vercel.app)
  - NEXTAUTH_SECRET
  - GOOGLE_GENERATIVE_AI_API_KEY
  - BLOB_READ_WRITE_TOKEN
```

### 3. Update Neon Database

```bash
# In je Neon dashboard:
# Whitelist Vercel IP's (of schakel "Allow all" in voor development)
```

---

## 🎯 Features Checklist

- [x] Multi-tenant architectuur
- [x] Email/password authenticatie
- [x] Automatic company + widget creation bij signup
- [x] AI-powered foto analyse met Google Gemini
- [x] AI preview generatie van nieuwe kozijnen
- [x] Automatische prijsberekening
- [x] Widget embed code (JavaScript & iFrame)
- [x] Leads dashboard met filters
- [x] Real-time stats tracking
- [x] Photo upload met Vercel Blob
- [x] Responsive design

---

## 🐛 Troubleshooting

### Database Errors

```bash
# Error: "DATABASE_URL is not defined"
→ Check of .env.local bestaat en DATABASE_URL is ingevuld

# Error: "relation does not exist"
→ Voer de SQL scripts uit in de juiste volgorde
```

### Auth Issues

```bash
# Error: "NEXTAUTH_SECRET is missing"
→ Genereer een secret: openssl rand -base64 32

# Can't login after signup
→ Check of password goed is gehashed
→ Check console voor errors
```

### AI Preview Niet Werkend

```bash
# Error: "API key not valid"
→ Check GOOGLE_GENERATIVE_AI_API_KEY
→ Haal een nieuwe key op van Google AI Studio

# Preview duurt te lang
→ Normaal: 30-60 seconden per foto
→ Check Network tab voor errors
```

---

## 📞 Support

Heb je vragen? Check:
1. Console logs (`pnpm dev` terminal)
2. Browser DevTools → Console
3. Network tab voor API errors
4. Neon database logs

---

## 🎉 Volgende Stappen

Nu je SaaS platform werkt, kun je:

1. **Email notificaties** toevoegen (Resend/SendGrid)
2. **Payment integratie** (Stripe) voor subscription plans
3. **Analytics** tracking per widget
4. **Custom branding** per company (logo, kleuren)
5. **Lead management** (status updates, notes, follow-ups)
6. **Export functionaliteit** (CSV export van leads)
7. **Team management** (meerdere users per company)
8. **API keys** voor externe integraties

Veel succes met je Kozijn SaaS! 🚀

