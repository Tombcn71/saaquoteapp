# Hoe SQL Migraties Runnen in Neon

## Methode 1: Via Neon SQL Editor (Aanbevolen)

### Stap 1: Open Neon Console
1. Ga naar: **https://console.neon.tech**
2. Log in met je account
3. Selecteer je project: **saaquoteapp** (of hoe je het genoemd hebt)

### Stap 2: Open SQL Editor
1. Klik in de linker sidebar op **"SQL Editor"** (icoon met database + code)
2. Je ziet nu een groot tekstvak waar je SQL kan typen

### Stap 3: Run Eerste Script (Pricing Configs)
1. Open in Cursor/VSCode het bestand: `scripts/004_create_pricing_configs.sql`
2. Selecteer **ALLES** (CMD+A of CTRL+A)
3. Kopieer (CMD+C of CTRL+C)
4. Ga terug naar Neon SQL Editor
5. Plak de code in het tekstvak (CMD+V of CTRL+V)
6. Klik op de groene **"Run"** knop (of druk CMD+Enter / CTRL+Enter)
7. Wacht tot je ziet: **"Success"** of **"Query completed"**

### Stap 4: Run Tweede Script (Form Type)
1. **Verwijder** de oude code uit het SQL Editor tekstvak
2. Open in Cursor/VSCode het bestand: `scripts/005_add_form_type_to_leads.sql`
3. Selecteer **ALLES** (CMD+A)
4. Kopieer (CMD+C)
5. Ga terug naar Neon SQL Editor
6. Plak de code (CMD+V)
7. Klik op **"Run"**
8. Wacht op **"Success"**

### Stap 5: Verifieer
Run deze query om te checken of alles werkt:

```sql
-- Check of pricing_configs table bestaat
SELECT * FROM pricing_configs LIMIT 5;

-- Check of form_type kolom bestaat in leads
SELECT form_type FROM leads LIMIT 1;
```

Als je geen errors ziet, is alles geslaagd! ✅

---

## Methode 2: Via Terminal met psql (Alternatief)

Als je `psql` geïnstalleerd hebt:

### Stap 1: Zorg dat je DATABASE_URL hebt
```bash
echo $DATABASE_URL
```

Als deze leeg is, kopieer dan je connection string uit Neon Console > Connection Details

### Stap 2: Run de scripts
```bash
# Navigeer naar je project
cd /Users/tom/saaquoteapp

# Run script 1
psql "$DATABASE_URL" -f scripts/004_create_pricing_configs.sql

# Run script 2
psql "$DATABASE_URL" -f scripts/005_add_form_type_to_leads.sql
```

---

## Troubleshooting

### Error: "relation does not exist"
**Oplossing:** Je hebt waarschijnlijk de eerdere scripts (001, 002, 003) nog niet gerund.
Run eerst die scripts in deze volgorde:
1. `scripts/001_create_auth_tables.sql`
2. `scripts/002_add_password_to_users.sql`
3. `scripts/003_create_saas_tables.sql`
4. Dan pas 004 en 005

### Error: "column already exists"
**Oplossing:** Script is al eerder gerund. Dat is OK, negeer de error.

### Error: "permission denied"
**Oplossing:** Je database user heeft geen rechten. Check in Neon of je de juiste connection string gebruikt (moet eindigen op `?sslmode=require`).

### Error: "auth.uid() does not exist"
**Oplossing:** Neon gebruikt geen Supabase auth. Je kunt de RLS policies negeren of verwijderen. De applicatie gebruikt session-based auth via NextAuth.

---

## Verificatie na Migratie

Test of alles werkt:

### 1. Test Settings Pagina
- Log in op je dashboard
- Ga naar "Instellingen"
- Verander een prijs (bijv. PVC vloer naar €50/m²)
- Klik "Opslaan"
- Refresh de pagina - prijs moet behouden blijven

### 2. Test Vloeren Form
- Ga naar homepage
- Klik op "Vloeren" tab
- Vul form in (PVC, 30m²)
- Je zou een prijs moeten zien van ongeveer €1800 (50 + 15 = 65/m² × 30)
- Verstuur form
- Check in Dashboard > Leads - je zou een nieuwe "vloeren" lead moeten zien

### 3. Test Schilderwerk Form
- Ga naar homepage
- Klik op "Schilderwerk" tab
- Vul form in (Binnen, 40m²)
- Je zou een prijs moeten zien van ongeveer €800 (12 + 8 = 20/m² × 40)
- Verstuur form
- Check in Dashboard > Leads

Als alles werkt: **Fase 2 Compleet!** 🎉

