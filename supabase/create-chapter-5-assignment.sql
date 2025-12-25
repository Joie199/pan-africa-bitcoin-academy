-- Create Chapter 5 Assignment: "Whitepaper Sentence Decode"
-- This assignment requires instructor review (text submission)

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
  '55555555-5555-4555-8555-555555555555', -- Deterministic UUID for Chapter 5 assignment
  'Assignment: Whitepaper Sentence Decode',
  'Practice translating technical language into everyday terms. Rewrite this sentence in plain language: "A purely peer-to-peer version of electronic cash…"',
  5,
  'the-birth-of-bitcoin',
  'Rewrite this sentence in plain language: "A purely peer-to-peer version of electronic cash…"',
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

