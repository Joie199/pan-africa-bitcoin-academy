-- Create Chapter 1 Assignment: "What Is Money to Me?"
-- This assignment requires instructor review (text submission)

-- Insert the assignment
-- Using a deterministic UUID based on chapter 1 assignment
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
  '11111111-1111-4111-8111-111111111111', -- Deterministic UUID for Chapter 1 assignment
  'Assignment: "What Is Money to Me?"',
  'Reflect on how money functions in your daily life and community. Write 5-7 sentences answering what problem money solves in your community.',
  1,
  'the-nature-of-money',
  'Write 5-7 sentences answering: What problem does money solve in my community?',
  NULL,
  'INSTRUCTOR_REVIEW', -- Special value indicating this requires manual review
  'text',
  10,
  50, -- 50 sats reward
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
-- 4. Award 50 sats reward via the sats rewards system
-- 5. Add feedback in assignment_submissions.feedback field

