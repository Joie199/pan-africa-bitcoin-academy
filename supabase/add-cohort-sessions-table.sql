-- Cohort Sessions Table
-- Automatically generated sessions for each cohort based on start/end dates
-- Sessions occur 3 days per week, excluding Sundays

CREATE TABLE IF NOT EXISTS cohort_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cohort_id UUID NOT NULL REFERENCES cohorts(id) ON DELETE CASCADE,
  session_date DATE NOT NULL,
  session_number INTEGER NOT NULL,
  topic TEXT,
  instructor TEXT,
  duration_minutes INTEGER DEFAULT 90,
  link TEXT,
  recording_url TEXT,
  status TEXT DEFAULT 'scheduled', -- scheduled, completed, cancelled, rescheduled
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(cohort_id, session_date),
  UNIQUE(cohort_id, session_number)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_cohort_sessions_cohort_id ON cohort_sessions(cohort_id);
CREATE INDEX IF NOT EXISTS idx_cohort_sessions_session_date ON cohort_sessions(session_date);
CREATE INDEX IF NOT EXISTS idx_cohort_sessions_cohort_date ON cohort_sessions(cohort_id, session_date);

-- Add trigger to update updated_at timestamp
DROP TRIGGER IF EXISTS update_cohort_sessions_updated_at ON cohort_sessions;
CREATE TRIGGER update_cohort_sessions_updated_at 
  BEFORE UPDATE ON cohort_sessions
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE cohort_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Allow public read access (students can see sessions for their cohorts)
CREATE POLICY "Allow public read access" ON cohort_sessions FOR SELECT USING (true);

-- Allow admins to manage sessions (insert, update, delete)
-- Note: Admin operations will use supabaseAdmin client which bypasses RLS
