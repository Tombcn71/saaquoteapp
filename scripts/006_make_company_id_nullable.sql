-- Make company_id nullable in leads table
-- This allows leads from homepage demo forms (without company context)

ALTER TABLE leads 
ALTER COLUMN company_id DROP NOT NULL;

-- Also make widget_id nullable (for consistency)
ALTER TABLE leads 
ALTER COLUMN widget_id DROP NOT NULL;

COMMENT ON COLUMN leads.company_id IS 'Company that owns this lead (NULL for demo/homepage submissions)';
COMMENT ON COLUMN leads.widget_id IS 'Widget that generated this lead (NULL for direct homepage submissions)';

