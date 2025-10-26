-- =====================================================
-- KOZIJN SAAS - Multi-Tenant Database Schema
-- =====================================================

-- COMPANIES TABLE (Het kozijnbedrijf)
CREATE TABLE IF NOT EXISTS companies (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  website TEXT,
  logo_url TEXT,
  
  -- Widget configuratie
  widget_enabled BOOLEAN DEFAULT true,
  widget_primary_color TEXT DEFAULT '#3b82f6',
  widget_logo_url TEXT,
  
  -- Plan & Billing
  plan TEXT DEFAULT 'free', -- free, starter, professional, enterprise
  leads_limit INTEGER DEFAULT 10, -- maandelijkse leads limiet
  leads_used INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Update USERS table to link to company
ALTER TABLE users ADD COLUMN IF NOT EXISTS company_id TEXT REFERENCES companies(id) ON DELETE CASCADE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'owner'; -- owner, admin, member

-- WIDGETS TABLE (Widget configuratie per bedrijf)
CREATE TABLE IF NOT EXISTS widgets (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  
  -- Embed configuratie
  allowed_domains TEXT[], -- ['example.com', 'www.example.com']
  
  -- Styling
  primary_color TEXT DEFAULT '#3b82f6',
  button_text TEXT DEFAULT 'Bereken Prijs & Preview',
  
  -- Custom fields (JSON)
  custom_config JSONB DEFAULT '{}',
  
  -- Stats
  views INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(company_id, name)
);

-- LEADS TABLE (Quote aanvragen van klanten)
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  widget_id TEXT REFERENCES widgets(id) ON DELETE SET NULL,
  
  -- Klant informatie
  naam TEXT NOT NULL,
  email TEXT NOT NULL,
  telefoon TEXT,
  
  -- Kozijn specificaties
  materiaal TEXT, -- kunststof, hout, aluminium
  kleur TEXT,
  kozijn_type TEXT,
  glas_type TEXT,
  aantal_ramen TEXT,
  vierkante_meter_ramen TEXT,
  
  -- Extra opties
  montage BOOLEAN DEFAULT true,
  afvoer_oude_kozijnen BOOLEAN DEFAULT false,
  
  -- Offerte
  quote_total DECIMAL(10, 2),
  quote_breakdown JSONB, -- { kozijnen: 2800, glas: 900, montage: 600, afvoer: 200 }
  
  -- Foto's
  photo_urls TEXT[], -- originele fotos
  preview_urls TEXT[], -- AI gegenereerde previews
  
  -- Meta
  source TEXT DEFAULT 'widget', -- widget, direct, api
  widget_referrer TEXT, -- URL waar widget stond
  user_agent TEXT,
  ip_address TEXT,
  
  -- Status
  status TEXT DEFAULT 'new', -- new, contacted, quoted, won, lost
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES voor betere performance
CREATE INDEX IF NOT EXISTS idx_companies_created_at ON companies(created_at);
CREATE INDEX IF NOT EXISTS idx_users_company_id ON users(company_id);
CREATE INDEX IF NOT EXISTS idx_widgets_company_id ON widgets(company_id);
CREATE INDEX IF NOT EXISTS idx_widgets_active ON widgets(is_active);
CREATE INDEX IF NOT EXISTS idx_leads_company_id ON leads(company_id);
CREATE INDEX IF NOT EXISTS idx_leads_widget_id ON leads(widget_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);

-- ROW LEVEL SECURITY (belangrijk voor multi-tenancy!)
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE widgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Policies: Users kunnen alleen data van hun eigen company zien
-- (Deze policies werken met Supabase of Neon met auth setup)

COMMENT ON TABLE companies IS 'Kozijnbedrijven die de SaaS gebruiken';
COMMENT ON TABLE widgets IS 'Embed widgets per bedrijf met configuratie';
COMMENT ON TABLE leads IS 'Quote aanvragen van eindklanten via widgets';

