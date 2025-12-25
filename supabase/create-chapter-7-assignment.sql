-- Create Chapter 7 Assignment: "Understanding a Block"
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
  '77777777-7777-4777-8777-777777777777', -- Deterministic UUID for Chapter 7 assignment
  'Assignment: Understanding a Block',
  'Explain the consequences of attempting to alter a transaction in a previous block on the blockchain. What would happen if someone tried to change a transaction in an old block?',
  7,
  'blockchain-basics',
  'What would happen if someone tried to change a transaction in an old block?',
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

