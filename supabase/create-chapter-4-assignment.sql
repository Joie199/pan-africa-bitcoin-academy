-- Create Chapter 4 Assignment: "What Broke?"
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
  '44444444-4444-4444-8444-444444444444', -- Deterministic UUID for Chapter 4 assignment
  'Assignment: "What Broke?"',
  'Reflect on the failures of the traditional financial system. Explain in your own words one reason the old system failed (inflation, debt, bailouts, control).',
  4,
  'from-crisis-to-innovation',
  'Explain in your own words one reason the old system failed (inflation, debt, bailouts, control).',
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
-- 4. Award 75 sats reward via the sats rewards system
-- 5. Add feedback in assignment_submissions.feedback field

