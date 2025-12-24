-- Create Chapter 8 Assignment: "First Wallet Proof"
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
  status,
  cohort_id,
  created_at,
  updated_at
) VALUES (
  '88888888-8888-8888-8888-888888888888', -- Deterministic UUID for Chapter 8 assignment
  'Assignment: First Wallet Proof',
  'Hands-on practice with wallet creation, backup, and recovery. Create a wallet, back up seed securely, restore it (dry run). Reflection: What went wrong or surprised you?',
  8,
  'exchange-software-wallet',
  'Create a wallet, back up seed securely, restore it (dry run). Reflection: What went wrong or surprised you?',
  NULL,
  'INSTRUCTOR_REVIEW', -- Special value indicating this requires manual review
  'text',
  10,
  'active',
  NULL, -- Available to all cohorts
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  question = EXCLUDED.question,
  updated_at = NOW();

-- Note: When an instructor grades this assignment:
-- 1. Update assignment_submissions.status to 'graded'
-- 2. Set assignment_submissions.is_correct to true if approved
-- 3. Set assignment_submissions.points_earned to 10 (assignment.points)
-- 4. Award 200 sats reward via the sats rewards system
-- 5. Add feedback in assignment_submissions.feedback field

