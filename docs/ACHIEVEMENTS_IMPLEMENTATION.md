# Achievements System Implementation

## Current State

### Database Schema
The `achievements` table exists in the database with the following structure:
```sql
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  badge_name TEXT,
  points INTEGER DEFAULT 0,
  description TEXT,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Current Implementation
- Achievements are **hardcoded** in `StudentDashboard.tsx` as `defaultAchievements`
- They are **not fetched from the database**
- All achievements show as `unlocked: false` by default
- No automatic unlocking logic exists

### Defined Achievements
1. **🎖 Completed First Wallet** (`wallet_created`)
   - Unlock when: Student completes chapter about wallet creation (likely Chapter 8: Exchange & Software Wallet)
   
2. **🏆 Sent First Sats** (`first_transaction`)
   - Unlock when: Student completes assignment or chapter that involves sending sats
   
3. **🎯 3 Assignments Done** (`three_assignments`)
   - Unlock when: `assignments_completed >= 3` in students table
   
4. **⚡ Lightning User** (`lightning_user`)
   - Unlock when: Student completes Lightning-related chapter (Chapter 12: Lightning Basics)
   
5. **🔐 Recovery Master** (`recovery_master`)
   - Unlock when: Student completes chapter about recovery/backup (likely Chapter 10 or 11)

## Implementation Plan

### 1. Achievement Definitions
Create a constants file with achievement definitions:
- `achievement_id`: Unique identifier
- `badge_name`: Display name
- `icon`: Emoji icon
- `description`: What the achievement is for
- `unlock_condition`: How to unlock it

### 2. Achievement Unlock Logic
Create functions to check and unlock achievements:
- Check on chapter completion
- Check on assignment completion
- Check on specific actions (wallet creation, transaction, etc.)

### 3. API Endpoints
- `GET /api/achievements?email=...` - Fetch student achievements
- `POST /api/achievements/unlock` - Manually unlock achievement (admin)
- Auto-unlock logic in existing endpoints (chapter completion, assignment submission)

### 4. Database Integration
- Fetch achievements from database in `user-data` API
- Store achievements in database when unlocked
- Prevent duplicate achievements

## Achievement Unlock Conditions

### 🎖 Completed First Wallet
- **Trigger**: Complete Chapter 8 (Exchange & Software Wallet) OR complete assignment about wallet creation
- **Check**: `chapter_progress.chapter_number = 8 AND is_completed = true`

### 🏆 Sent First Sats
- **Trigger**: Complete assignment that involves sending sats OR complete Chapter 9 (UTXOs, Fees & Coin Control)
- **Check**: Assignment submission with specific assignment_id OR chapter 9 completion

### 🎯 3 Assignments Done
- **Trigger**: When `students.assignments_completed >= 3`
- **Check**: After assignment submission, check count

### ⚡ Lightning User
- **Trigger**: Complete Chapter 12 (Lightning Basics)
- **Check**: `chapter_progress.chapter_number = 12 AND is_completed = true`

### 🔐 Recovery Master
- **Trigger**: Complete Chapter 10 (Backup & Recovery) OR Chapter 11 (Hardware Signers)
- **Check**: `chapter_progress.chapter_number IN (10, 11) AND is_completed = true`

## Files to Create/Modify

1. **`src/lib/achievements.ts`** - Achievement definitions and unlock logic
2. **`src/app/api/achievements/route.ts`** - GET achievements endpoint
3. **`src/app/api/achievements/unlock/route.ts`** - Unlock achievement endpoint
4. **`src/app/api/chapters/mark-completed/route.ts`** - Add achievement check
5. **`src/app/api/assignments/submit/route.ts`** - Add achievement check
6. **`src/app/api/profile/user-data/route.ts`** - Include achievements in response
7. **`src/components/StudentDashboard.tsx`** - Use achievements from API instead of hardcoded
