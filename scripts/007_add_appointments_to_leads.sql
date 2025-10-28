-- Migration: Add appointment fields to leads table
-- Run this in your Neon SQL Editor

-- Add appointment columns to leads table
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS appointment_datetime TIMESTAMP,
ADD COLUMN IF NOT EXISTS appointment_status VARCHAR(50) DEFAULT NULL;

-- Create index for faster appointment queries
CREATE INDEX IF NOT EXISTS idx_leads_appointment_datetime 
ON leads(appointment_datetime) 
WHERE appointment_datetime IS NOT NULL;

-- Create index for appointment status
CREATE INDEX IF NOT EXISTS idx_leads_appointment_status 
ON leads(appointment_status) 
WHERE appointment_status IS NOT NULL;

-- Add check constraint for appointment_status
ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_appointment_status_check;
ALTER TABLE leads 
ADD CONSTRAINT leads_appointment_status_check 
CHECK (appointment_status IS NULL OR appointment_status IN ('scheduled', 'completed', 'cancelled', 'no_show'));

-- Comment on columns for documentation
COMMENT ON COLUMN leads.appointment_datetime IS 'Scheduled appointment date and time for follow-up call';
COMMENT ON COLUMN leads.appointment_status IS 'Status of the appointment: scheduled, completed, cancelled, no_show';

