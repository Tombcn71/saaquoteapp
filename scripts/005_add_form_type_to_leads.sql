-- Add form_type column to leads table
-- This allows us to track which form type generated each lead

ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS form_type TEXT DEFAULT 'kozijnen';

-- Add check constraint to ensure valid form types
ALTER TABLE leads 
DROP CONSTRAINT IF EXISTS leads_form_type_check;

ALTER TABLE leads 
ADD CONSTRAINT leads_form_type_check 
CHECK (form_type IN ('kozijnen', 'vloeren', 'schilderwerk'));

-- Create index for faster filtering by form_type
CREATE INDEX IF NOT EXISTS idx_leads_form_type ON leads(form_type);

-- Update existing leads to have 'kozijnen' as default
UPDATE leads SET form_type = 'kozijnen' WHERE form_type IS NULL;

COMMENT ON COLUMN leads.form_type IS 'Type of form that generated this lead: kozijnen, vloeren, or schilderwerk';

