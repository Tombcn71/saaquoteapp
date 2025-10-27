-- Pricing configurations table
-- Hierin kunnen bedrijven per form type hun eigen prijzen instellen

CREATE TABLE IF NOT EXISTS pricing_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  form_type TEXT NOT NULL, -- 'kozijnen', 'vloeren', 'schilderwerk'
  
  -- Pricing parameters (JSON voor flexibiliteit)
  pricing_data JSONB NOT NULL DEFAULT '{}',
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Ensure one config per company per form type
  UNIQUE(company_id, form_type)
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_pricing_configs_company_form 
  ON pricing_configs(company_id, form_type);

-- Row Level Security
ALTER TABLE pricing_configs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own company's pricing
CREATE POLICY pricing_configs_select_policy ON pricing_configs
  FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

-- Policy: Users can insert pricing for their own company
CREATE POLICY pricing_configs_insert_policy ON pricing_configs
  FOR INSERT
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

-- Policy: Users can update their own company's pricing
CREATE POLICY pricing_configs_update_policy ON pricing_configs
  FOR UPDATE
  USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

-- Insert default pricing for existing companies
INSERT INTO pricing_configs (company_id, form_type, pricing_data)
SELECT 
  c.id,
  form_type,
  CASE 
    WHEN form_type = 'kozijnen' THEN jsonb_build_object(
      'base_price_per_window', 500,
      'material_multipliers', jsonb_build_object(
        'kunststof', 1.0,
        'hout', 1.3,
        'aluminium', 1.5
      ),
      'glass_multipliers', jsonb_build_object(
        'enkel', 1.0,
        'dubbel', 1.2,
        'hr++', 1.4,
        'triple', 1.6
      )
    )
    WHEN form_type = 'vloeren' THEN jsonb_build_object(
      'price_per_m2', jsonb_build_object(
        'hout', 75,
        'pvc', 45
      ),
      'installation_cost_per_m2', 15,
      'minimum_order', 100
    )
    WHEN form_type = 'schilderwerk' THEN jsonb_build_object(
      'price_per_m2', jsonb_build_object(
        'binnen', 12,
        'buiten', 18
      ),
      'labor_cost_per_m2', 8,
      'minimum_order', 150
    )
  END
FROM companies c
CROSS JOIN (VALUES ('kozijnen'), ('vloeren'), ('schilderwerk')) AS t(form_type)
ON CONFLICT (company_id, form_type) DO NOTHING;

-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_pricing_configs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER pricing_configs_updated_at_trigger
  BEFORE UPDATE ON pricing_configs
  FOR EACH ROW
  EXECUTE FUNCTION update_pricing_configs_updated_at();

