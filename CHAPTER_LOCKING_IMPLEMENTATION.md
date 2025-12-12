# Chapter Locking Implementation

## Overview

This implementation adds a comprehensive chapter locking system that:
- Restricts chapter access to registered and enrolled students only
- Unlocks chapters progressively (one by one)
- Redirects unregistered users to the apply page
- Tracks chapter completion automatically

## Database Setup

### 1. Run the Migration

Execute the SQL migration file to create the `chapter_progress` table:

```sql
-- File: supabase/add-chapter-progress-table.sql
```

This creates:
- `chapter_progress` table to track student chapter progress
- Automatic trigger to unlock Chapter 1 for new enrolled students
- Indexes for performance

**To apply:**
1. Go to Supabase SQL Editor
2. Copy and paste the contents of `supabase/add-chapter-progress-table.sql`
3. Run the migration

## Features Implemented

### 1. Chapter Access Control

**File:** `src/app/chapters/[slug]/ChapterAccessCheck.tsx`

- Checks if user is authenticated
- Verifies user is a registered student (has profile)
- Verifies user is enrolled (has student record)
- Checks if chapter is unlocked
- Redirects unregistered users to `/apply`
- Redirects locked chapters to `/chapters`

### 2. Chapter Completion Tracking

**File:** `src/app/chapters/[slug]/ChapterCompletionTracker.tsx`

- Automatically marks chapters as completed after 30 seconds of viewing
- Unlocks the next chapter when current chapter is completed
- Tracks completion timestamp

### 3. API Endpoints

#### Check Chapter Access
**Endpoint:** `POST /api/chapters/check-access`

**Request:**
```json
{
  "email": "student@example.com",
  "chapterNumber": 1,
  "chapterSlug": "the-nature-of-money"
}
```

**Response:**
```json
{
  "hasAccess": true,
  "isRegistered": true,
  "isEnrolled": true,
  "isUnlocked": true,
  "isCompleted": false,
  "chapterNumber": 1
}
```

#### Mark Chapter as Completed
**Endpoint:** `POST /api/chapters/mark-completed`

**Request:**
```json
{
  "email": "student@example.com",
  "chapterNumber": 1,
  "chapterSlug": "the-nature-of-money"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Chapter marked as completed",
  "chapterNumber": 1
}
```

#### Get Chapter Unlock Status
**Endpoint:** `POST /api/chapters/unlock-status`

**Request:**
```json
{
  "email": "student@example.com"
}
```

**Response:**
```json
{
  "isRegistered": true,
  "isEnrolled": true,
  "chapters": {
    "1": { "isUnlocked": true, "isCompleted": false },
    "2": { "isUnlocked": true, "isCompleted": true },
    "3": { "isUnlocked": false, "isCompleted": false }
  }
}
```

## How It Works

### Progressive Unlocking

1. **Chapter 1** is automatically unlocked when a student is enrolled (via database trigger)
2. **Chapter N** is unlocked when **Chapter N-1** is completed
3. Completion is tracked automatically after 30 seconds of viewing a chapter

### Access Flow

1. User tries to access a chapter
2. System checks authentication → redirects to `/apply` if not logged in
3. System checks enrollment → redirects to `/apply` if not enrolled
4. System checks chapter unlock status → redirects to `/chapters` if locked
5. If all checks pass, chapter content is displayed

### Chapter Listing Page

The chapters listing page (`/chapters`) now shows:
- 🔒 **Locked** - Chapter not yet unlocked
- 🔓 **Unlocked** - Chapter available but not completed
- ✓ **Completed** - Chapter finished

## Testing

### Test Scenarios

1. **Unregistered User**
   - Try to access any chapter → Should redirect to `/apply`
   - View chapters listing → Should see "Register to Access" buttons

2. **Registered but Not Enrolled**
   - Try to access any chapter → Should redirect to `/apply`
   - View chapters listing → Should see "Register to Access" buttons

3. **Enrolled Student**
   - Chapter 1 should be unlocked automatically
   - Can view Chapter 1
   - After viewing Chapter 1 for 30 seconds, it's marked complete
   - Chapter 2 is automatically unlocked
   - Can view Chapter 2, and so on...

4. **Locked Chapter Access**
   - Try to access Chapter 3 before completing Chapter 2 → Should redirect to `/chapters`
   - Locked chapters show "🔒 Locked" button (disabled)

## Files Modified/Created

### New Files
- `supabase/add-chapter-progress-table.sql` - Database migration
- `src/app/chapters/[slug]/ChapterAccessCheck.tsx` - Access control component
- `src/app/chapters/[slug]/ChapterCompletionTracker.tsx` - Completion tracking
- `src/app/api/chapters/check-access/route.ts` - Access check API
- `src/app/api/chapters/mark-completed/route.ts` - Completion API
- `src/app/api/chapters/unlock-status/route.ts` - Status API

### Modified Files
- `src/app/chapters/[slug]/page.tsx` - Added access check wrapper
- `src/app/chapters/page.tsx` - Added unlock status display

## Next Steps

1. **Run the database migration** in Supabase
2. **Test with a registered student** to verify unlocking works
3. **Adjust completion timing** if needed (currently 30 seconds)
4. **Add manual completion button** (optional) for students who want to mark chapters complete manually

## Notes

- Chapter 1 is always unlocked for enrolled students
- Completion is tracked automatically (no manual action required)
- Next chapter unlocks immediately when previous is completed
- All redirects preserve the intended destination via query params




