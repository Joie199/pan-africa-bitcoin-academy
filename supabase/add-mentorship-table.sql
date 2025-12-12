-- Mentorship applications table
CREATE TABLE IF NOT EXISTS mentorship_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  country TEXT,
  whatsapp TEXT,
  role TEXT,
  experience TEXT,
  teaching_experience TEXT,
  motivation TEXT,
  hours TEXT,
  comments TEXT,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mentorship_email ON mentorship_applications(email);
CREATE INDEX IF NOT EXISTS idx_mentorship_status ON mentorship_applications(status);

-- Enable Row Level Security
ALTER TABLE mentorship_applications ENABLE ROW LEVEL SECURITY;

-- Allow public INSERT (for application submissions) but block SELECT/UPDATE/DELETE
CREATE POLICY "Allow public to submit applications" ON mentorship_applications
  FOR INSERT WITH CHECK (true);

-- Block all other direct client access - only service role (supabaseAdmin) can read/update
CREATE POLICY "API only - no direct client read/update" ON mentorship_applications
  FOR SELECT USING (false);
CREATE POLICY "API only - no direct client update" ON mentorship_applications
  FOR UPDATE USING (false) WITH CHECK (false);
CREATE POLICY "API only - no direct client delete" ON mentorship_applications
  FOR DELETE USING (false);

COMMENT ON TABLE mentorship_applications IS 'Mentorship/volunteer applications';

