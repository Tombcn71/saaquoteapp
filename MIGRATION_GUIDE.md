# Database Migratie: Pricing Configs

## Stap 1: Run SQL Script in Neon

1. Ga naar je **Neon Console**: https://console.neon.tech
2. Selecteer je project: **saaquoteapp**
3. Klik op **SQL Editor** in de linker sidebar
4. Open het bestand: `scripts/004_create_pricing_configs.sql`
5. Kopieer de hele inhoud
6. Plak in de SQL Editor
7. Klik op **Run** (of druk op CMD+Enter)

## Stap 2: Verifieer Migratie

Controleer of de tabel is aangemaakt door deze query te runnen:

```sql
SELECT * FROM pricing_configs LIMIT 5;
```

Je zou nu default pricing configs moeten zien voor je bedrijf.

## Stap 3: Test Settings Pagina

1. Log in op je dashboard
2. Ga naar **Instellingen** (Settings)
3. Je zou nu je prijzen moeten kunnen aanpassen per form type

## Troubleshooting

Als je errors krijgt:
- Controleer of je alle eerdere migratie scripts hebt gerund (001, 002, 003)
- Zorg dat de `companies` tabel bestaat
- Check of je admin rechten hebt in de database

