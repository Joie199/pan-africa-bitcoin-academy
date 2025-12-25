-- Create Chapter 10 Assignment: "Protect Your Future Self"
-- This assignment requires instructor review (text submission)

-- Insert the assignment
-- Using a deterministic UUID based on chapter 10 assignment
INSERT INTO assignments (
  id,
  title,
  description,
  chapter_number,
  chapter_slug,
  question,
  search_address,
  correct_answer,
  answer_type,
  points,
  reward_sats,
  status,
  cohort_id,
  created_at,
  updated_at
) VALUES (
  '10101010-1010-4101-8101-010101010101', -- Deterministic UUID for Chapter 10 assignment
  'Assignment: Protect Your Future Self',
  'Reflect on why using a new receive address every time is important for privacy and security.',
  10,
  'good-bitcoin-hygiene',
  'Why should you use a new receive address every time?',
  NULL,
  'INSTRUCTOR_REVIEW', -- Special value indicating this requires manual review
  'text',
  10,
  100, -- 100 sats reward
  'active',
  NULL, -- Available to all cohorts
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  question = EXCLUDED.question,
  reward_sats = EXCLUDED.reward_sats,
  updated_at = NOW();

-- Note: When an instructor grades this assignment:
-- 1. Update assignment_submissions.status to 'graded'
-- 2. Set assignment_submissions.is_correct to true if approved
-- 3. Set assignment_submissions.points_earned to 10 (assignment.points)
-- 4. Award 100 sats reward via the sats rewards system
-- 5. Add feedback in assignment_submissions.feedback field

