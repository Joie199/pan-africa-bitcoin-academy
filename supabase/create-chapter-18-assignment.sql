-- Create Chapter 18 Assignment: "Script Recognition"
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
  'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', -- Deterministic UUID for Chapter 18 assignment
  'Assignment: Script Recognition',
  'Identify the script type for each address: Address A (bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kygt080) → P2WPKH, Address B (3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy) → P2SH, Address C (bc1p5cyxnuxmeuwuvkwfem96llyxf3s2h0c6h7) → Taproot (P2TR)',
  18,
  'intro-to-bitcoin-script-optional-track',
  'Identify the script type for three addresses: Address A, Address B, Address C',
  NULL,
  'INSTRUCTOR_REVIEW', -- Special value indicating this requires manual review
  'text',
  10,
  100, -- 100 sats reward (TBD - instructor review)
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

