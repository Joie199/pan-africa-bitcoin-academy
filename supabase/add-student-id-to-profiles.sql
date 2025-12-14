-- Add student_id column to profiles table
-- This column stores a formatted student ID like "1/1/2025" (cohort/roll/year)

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS student_id TEXT;

-- Add unique constraint on student_id (each student ID should be unique)
-- PostgreSQL allows multiple NULL values in a UNIQUE constraint, so this is safe
DO $$
BEGIN
  -- Only add unique constraint if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'profiles_student_id_key'
  ) THEN
    ALTER TABLE profiles
    ADD CONSTRAINT profiles_student_id_key UNIQUE (student_id);
  END IF;
EXCEPTION
  WHEN duplicate_object THEN
    -- Constraint already exists, that's fine
    RAISE NOTICE 'Unique constraint on student_id already exists';
  WHEN others THEN
    -- Other error, log it but continue
    RAISE NOTICE 'Error adding unique constraint: %', SQLERRM;
END $$;

-- Create index for faster lookups (only on non-null values)
CREATE INDEX IF NOT EXISTS idx_profiles_student_id ON profiles(student_id) WHERE student_id IS NOT NULL;

COMMENT ON COLUMN profiles.student_id IS 'Formatted student ID: cohort/roll/year (e.g., "1/1/2025")';
