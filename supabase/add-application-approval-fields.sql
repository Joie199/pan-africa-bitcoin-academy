-- Add approval fields to applications table
-- Run this in Supabase SQL Editor

-- Add approval tracking fields
ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS approved_by UUID,
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS rejected_reason TEXT,
ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_profile_id ON applications(profile_id);
CREATE INDEX IF NOT EXISTS idx_applications_email ON applications(email);

-- Add comment for clarity
COMMENT ON COLUMN applications.approved_by IS 'UUID of admin who approved the application';
COMMENT ON COLUMN applications.approved_at IS 'Timestamp when application was approved';
COMMENT ON COLUMN applications.rejected_reason IS 'Reason for rejection if application was rejected';
COMMENT ON COLUMN applications.rejected_at IS 'Timestamp when application was rejected';
COMMENT ON COLUMN applications.profile_id IS 'Links approved application to created profile (null until approved)';




