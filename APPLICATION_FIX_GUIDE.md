# Application Submission Fix Guide

## Issues Found and Fixed

### 1. Missing `birth_date` Column
**Problem:** The API was trying to insert `birth_date` but the column doesn't exist in the database.

**Fix:** Created migration file `supabase/add-birth-date-to-applications.sql`

### 2. Using Wrong Supabase Client
**Problem:** API was using `supabase` (anon key) which can be blocked by RLS policies.

**Fix:** Changed all database operations to use `supabaseAdmin` (service role) for reliable access.

## Steps to Fix

### Step 1: Add birth_date Column to Database

1. Go to **Supabase SQL Editor**
2. Copy and paste this SQL:

```sql
ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS birth_date DATE;

COMMENT ON COLUMN applications.birth_date IS 'Date of birth of the applicant';
```

3. Click **Run**

Or copy the entire contents of `supabase/add-birth-date-to-applications.sql` and run it.

### Step 2: Verify the Fix

After running the migration:
1. Try submitting an application again
2. Check browser console (F12) for any errors
3. Check server logs for detailed error messages

## What Was Changed

### Files Modified:
- `src/app/api/submit-application/route.ts`
  - Changed all `supabase` calls to `supabaseAdmin`
  - This ensures reliable database access bypassing RLS

### Files Created:
- `supabase/add-birth-date-to-applications.sql`
  - Migration to add missing `birth_date` column

## Testing

After running the migration:
1. Fill out the application form
2. Select a cohort
3. Enter all required fields including birth date
4. Click "Register"
5. Should see success message

## If Still Failing

Check the browser console (F12) and look for:
- Network tab → `/api/submit-application` → Response
- Console tab → Error messages

The improved error logging will show exactly what's failing.

---

**Run the SQL migration first, then test the application submission!**




