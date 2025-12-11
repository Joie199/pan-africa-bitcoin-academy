-- Quick Verification: Check if all key migrations are applied
-- Run this in Supabase SQL Editor to verify

-- 1. Check password_hash column
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'password_hash')
    THEN '✅ password_hash column exists'
    ELSE '❌ password_hash column MISSING'
  END as check_1;

-- 2. Check reset_token columns
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'reset_token')
      AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'reset_token_expiry')
    THEN '✅ Password reset columns exist'
    ELSE '❌ Password reset columns MISSING'
  END as check_2;

-- 3. Check cohort_id in events (IMPORTANT - fixes 500 error)
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'cohort_id')
    THEN '✅ cohort_id column exists in events table'
    ELSE '❌ cohort_id column MISSING in events table'
  END as check_3;

-- 4. Check unique constraint on students.profile_id
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
      WHERE tc.table_name = 'students' AND kcu.column_name = 'profile_id' AND tc.constraint_type = 'UNIQUE'
    )
    THEN '✅ Unique constraint on students.profile_id exists'
    ELSE '❌ Unique constraint MISSING'
  END as check_4;

-- Summary
SELECT '--- All checks complete ---' as summary;

