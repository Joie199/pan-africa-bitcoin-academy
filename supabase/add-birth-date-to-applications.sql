-- Add birth_date column to applications table
-- Run this in Supabase SQL Editor

ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS birth_date DATE;

-- Add comment for clarity
COMMENT ON COLUMN applications.birth_date IS 'Date of birth of the applicant';

