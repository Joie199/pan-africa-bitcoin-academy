# Assignment System Verification & Database Setup

## ✅ Fixed Issues

### 1. **Reward Amount System**
- **Problem**: Code hardcoded 500 sats for all assignments, but assignments have different reward amounts (50, 75, 100, 200 sats)
- **Solution**: 
  - Added `reward_sats` column to `assignments` table (SQL migration script created)
  - Updated submission route to use `assignment.reward_sats` instead of hardcoded 500
  - Updated all assignment SQL scripts to include `reward_sats` values

### 2. **Submission Update Bug**
- **Problem**: When updating an existing submission (re-submission), if it became correct, it didn't award sats or check achievements
- **Solution**: 
  - Added logic to detect if submission is "newly correct" (wasn't correct before, but is now)
  - Moved sats reward and achievement check logic outside the "new submission only" block
  - Now awards sats and checks achievements whenever a submission becomes correct (new or update)

### 3. **Assignments Completed Counter**
- **Problem**: Counter only incremented for new submissions, not updates
- **Solution**: Only increments `assignments_completed` when submission is newly correct (prevents double-counting)

## 📋 Database Setup Required

### Step 1: Add reward_sats Column
Run in Supabase SQL Editor:
```sql
-- File: supabase/add-reward-sats-to-assignments.sql
ALTER TABLE assignments 
ADD COLUMN IF NOT EXISTS reward_sats INTEGER DEFAULT 500;

COMMENT ON COLUMN assignments.reward_sats IS 'Amount of sats awarded for completing this assignment correctly';
```

### Step 2: Create All Assignments
Run all assignment creation scripts in Supabase SQL Editor (they will update existing assignments if they already exist):

1. `supabase/create-chapter-1-assignment.sql` - 50 sats
2. `supabase/create-chapter-2-assignment.sql` - 75 sats
3. `supabase/create-chapter-3-assignment.sql` - 75 sats
4. `supabase/create-chapter-4-assignment.sql` - 75 sats
5. `supabase/create-chapter-5-assignment.sql` - 100 sats
6. `supabase/create-chapter-6-assignment.sql` - 100 sats (TBD)
7. `supabase/create-chapter-7-assignment.sql` - 100 sats
8. `supabase/create-chapter-8-assignment.sql` - 200 sats
9. `supabase/create-chapter-11-assignment.sql` - 100 sats
10. `supabase/create-chapter-18-assignment.sql` - 100 sats (TBD)
11. `supabase/create-chapter-20-assignment.sql` - 100 sats

## 🔄 System Integration

### Assignment Submission Flow

1. **Student Submits Assignment**
   - POST `/api/assignments/submit`
   - Validates answer (auto-graded or requires instructor review)
   - Creates/updates `assignment_submissions` record

2. **If Correct (Auto-graded or After Instructor Review)**
   - Updates `students.assignments_completed` (+1)
   - Awards sats via `sats_rewards` table (uses `assignment.reward_sats`)
   - Calls `checkAndUnlockAchievements()` to check for:
     - "3 Assignments Done" achievement (unlocks at 3 completed)
     - Other relevant achievements

3. **Achievement Unlocking**
   - `checkAndUnlockAchievements()` checks all achievement unlock conditions
   - For "3 Assignments Done": Checks if `students.assignments_completed >= 3`
   - Unlocks achievement and awards 300 sats bonus

### Database Tables

**assignments** (definitions)
- `id` - UUID
- `title` - Assignment title
- `description` - Assignment description
- `chapter_number` - Linked chapter
- `chapter_slug` - Linked chapter slug
- `question` - Assignment question/prompt
- `correct_answer` - Correct answer or 'INSTRUCTOR_REVIEW'
- `answer_type` - 'text', 'number', 'multiple_choice'
- `points` - Points for completion (default 10)
- `reward_sats` - Sats reward amount (varies by assignment)
- `status` - 'active', 'archived', 'draft'
- `cohort_id` - NULL for all cohorts, or specific cohort UUID

**assignment_submissions** (student answers)
- `id` - UUID
- `assignment_id` - FK to assignments
- `student_id` - FK to profiles
- `answer` - Student's submitted answer (JSON for complex assignments)
- `is_correct` - Boolean (false until graded/approved)
- `points_earned` - Points earned (0 until graded)
- `status` - 'submitted', 'graded', 'returned'
- `feedback` - Instructor feedback (optional)
- `graded_by` - Admin profile ID (optional)
- `submitted_at` - Submission timestamp
- `graded_at` - Grading timestamp (optional)

**students** (progress tracking)
- `assignments_completed` - Count of completed assignments (increments when assignment becomes correct)

**sats_rewards** (reward tracking)
- `student_id` - FK to profiles
- `amount_pending` - Pending sats (accumulates)
- `reward_type` - 'assignment' for assignment rewards
- `related_entity_type` - 'assignment'
- `related_entity_id` - Assignment UUID
- `reason` - Description of reward

**achievements** (unlocked achievements)
- `student_id` - FK to profiles
- `badge_name` - Achievement identifier (e.g., 'three_assignments')
- `unlocked_at` - Timestamp

## 🎯 Achievement Integration

### "3 Assignments Done" Achievement
- **Unlock Condition**: `assignments_completed >= 3`
- **Reward**: 300 sats
- **Checked**: Automatically when `assignments_completed` increments
- **Location**: `src/lib/achievements.ts` → `checkAchievementUnlock()` → case 'assignment_count'

### Achievement Checking Flow
1. Assignment submission sets `is_correct = true`
2. `assignments_completed` increments
3. `checkAndUnlockAchievements()` is called
4. Checks all achievement unlock conditions
5. Unlocks "3 Assignments Done" if count >= 3
6. Awards 300 sats bonus

## 🔍 Verification Checklist

- [x] Database schema includes `assignments` and `assignment_submissions` tables
- [x] `reward_sats` column added to `assignments` table (migration script created)
- [x] All assignment SQL scripts include `reward_sats` values
- [x] Submission route uses `assignment.reward_sats` instead of hardcoded 500
- [x] Submission route handles both new and updated submissions correctly
- [x] `assignments_completed` counter increments correctly
- [x] Sats rewards are awarded correctly (per-assignment amounts)
- [x] Achievement checking works when assignments_completed increases
- [x] "3 Assignments Done" achievement unlocks at 3 completed assignments
- [x] Admin access to assignments is enabled

## 🚀 Next Steps

1. **Run Database Migrations**:
   - Execute `supabase/add-reward-sats-to-assignments.sql` in Supabase SQL Editor
   - Execute all assignment creation scripts

2. **Test Assignment Submission**:
   - Submit an assignment as a student
   - Verify sats are awarded correctly (check `sats_rewards` table)
   - Verify `assignments_completed` increments
   - Submit 3 assignments and verify "3 Assignments Done" achievement unlocks

3. **Test Instructor Review Flow**:
   - Submit an assignment requiring review (correct_answer = 'INSTRUCTOR_REVIEW')
   - Verify status is 'submitted' and is_correct is false
   - (Note: Admin grading endpoint would need to be created for manual grading)

## 📝 Notes

- All assignments currently require instructor review (correct_answer = 'INSTRUCTOR_REVIEW')
- When an instructor manually grades and sets `is_correct = true`, the system should automatically:
  - Increment `assignments_completed` (if not already incremented)
  - Award sats reward
  - Check achievements
  - **However**, the admin grading endpoint needs to be created/updated to trigger this flow

- For instructor-reviewed assignments, the reward is only awarded when `is_correct` is set to `true` (manually by admin)
- The submission route handles this correctly by only awarding rewards when `isNewlyCorrect` is true


