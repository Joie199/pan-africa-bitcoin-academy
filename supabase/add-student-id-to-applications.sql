-- Add student_id column to applications table
-- This will store the generated student ID when application is submitted

ALTER TABLE applications
ADD COLUMN IF NOT EXISTS student_id TEXT;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_applications_student_id ON applications(student_id) WHERE student_id IS NOT NULL;

COMMENT ON COLUMN applications.student_id IS 'Generated student ID at application time (format: cohort/roll/year, e.g., "1/1/2025")';
