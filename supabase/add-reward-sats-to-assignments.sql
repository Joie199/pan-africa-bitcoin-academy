-- Add reward_sats column to assignments table
-- This stores the sats reward amount for each assignment (varies by assignment)

ALTER TABLE assignments 
ADD COLUMN IF NOT EXISTS reward_sats INTEGER DEFAULT 200;

COMMENT ON COLUMN assignments.reward_sats IS 'Amount of sats awarded for completing this assignment correctly';

