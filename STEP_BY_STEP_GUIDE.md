# Step-by-Step Implementation Guide

## ✅ Phase 1: Database Setup (DO THIS FIRST)

### Step 1.1: Access Supabase SQL Editor
1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**

### Step 1.2: Run the Schema
1. Open `supabase/schema.sql` from this repository
2. Copy **ALL** the SQL code (from `-- Enable UUID extension` to the end)
3. Paste into the SQL Editor
4. Click **Run** (or press Ctrl+Enter)
5. Wait for "Success. No rows returned" message

### Step 1.3: Verify Tables Created
1. Go to **Table Editor** in Supabase dashboard
2. You should see these tables:
   - ✅ cohorts
   - ✅ profiles
   - ✅ cohort_enrollment
   - ✅ students
   - ✅ events
   - ✅ sats_rewards
   - ✅ achievements
   - ✅ developer_resources
   - ✅ developer_events
   - ✅ applications

### Step 1.4: Add Sample Data (Optional but Recommended)
1. Go back to **SQL Editor**
2. Open `supabase/sample-data.sql`
3. Copy and paste into SQL Editor
4. Click **Run**
5. This adds sample cohorts and events for testing

---

## ✅ Phase 2: Verify Environment Variables

### Step 2.1: Check Vercel Environment Variables
1. Go to Vercel dashboard
2. Navigate to your project: `pan-africa-bitcoin-academy`
3. Go to **Settings** → **Environment Variables**
4. Verify these exist:
   - ✅ `NEXT_PUBLIC_SUPABASE_URL`
   - ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - ✅ `SUPABASE_SERVICE_ROLE_KEY` (optional)

### Step 2.2: Pull Environment Variables Locally
```bash
cd "C:\Users\Administrator\Documents\projects\Pan-Africa BItcoin Acadamy"
vercel env pull .env.local
```

---

## ✅ Phase 3: Test Locally

### Step 3.1: Start Development Server
```bash
npm run dev
```

### Step 3.2: Check for Errors
- Open http://localhost:3000
- Check browser console for errors
- Check terminal for API errors

---

## ✅ Phase 4: Test Each Feature

### Test 4.1: Authentication (Sign Up)
1. Click "Sign In" button
2. Switch to "Sign Up" tab
3. Fill in:
   - Name: "Test User"
   - Email: "test@example.com"
   - Password: "test123"
   - Confirm Password: "test123"
4. Click "Sign Up"
5. **Expected**: Modal closes, redirects to dashboard
6. **Verify in Supabase**: Check `profiles` table for new entry

### Test 4.2: Authentication (Sign In)
1. Click "Sign In" button
2. Enter email: "test@example.com"
3. Click "Sign In"
4. **Expected**: Redirects to dashboard

### Test 4.3: Dashboard - Student Data
1. After signing in, you should see dashboard
2. **Expected**: Student information displays (may be empty if no data)
3. Check browser console for errors

### Test 4.4: Dashboard - Sats Wallet
1. Look for "Sats Wallet" section
2. **Expected**: Shows "Total Earned: 0" and "Pending Rewards: 0"
3. If errors, check `/api/sats` route

### Test 4.5: Dashboard - Leaderboard
1. Scroll to "Leaderboard" section
2. **Expected**: Shows leaderboard (may be empty)
3. If errors, check `/api/leaderboard` route

### Test 4.6: Calendar
1. Navigate to a page with calendar (or check dashboard)
2. **Expected**: Shows events from database
3. If you added sample data, you should see events
4. If errors, check `/api/events` route

### Test 4.7: Apply Page - Cohorts
1. Navigate to `/apply` page
2. Scroll to "Upcoming Cohorts" section
3. **Expected**: Shows cohorts from database
4. If you added sample data, you should see 3 cohorts
5. If errors, check `/api/cohorts` route

### Test 4.8: Apply Page - Form Submission
1. Fill out the application form
2. Select a cohort from the list
3. Click "Submit Application"
4. **Expected**: Success message, form resets
5. **Verify in Supabase**: Check `applications` table for new entry

### Test 4.9: Profile Modal
1. On dashboard, click profile/settings icon
2. Click "Profile"
3. **Expected**: Profile modal opens
4. Try editing and saving
5. **Expected**: Profile updates successfully
6. **Verify in Supabase**: Check `profiles` table for updates

---

## ✅ Phase 5: Add More Test Data

### Step 5.1: Add Sats Rewards (via SQL)
```sql
-- First, get a profile ID from the profiles table
-- Then run:
INSERT INTO sats_rewards (student_id, amount_paid, amount_pending, reason)
VALUES 
  ('<profile-id-here>', 1000, 500, 'Completed Assignment 1'),
  ('<profile-id-here>', 500, 0, 'Attended Live Session');
```

### Step 5.2: Add Achievements (via SQL)
```sql
INSERT INTO achievements (student_id, badge_name, points, description)
VALUES 
  ('<profile-id-here>', 'First Assignment', 100, 'Completed your first assignment'),
  ('<profile-id-here>', 'Active Learner', 250, 'Attended 5 live sessions');
```

---

## ✅ Phase 6: Fix Issues

### Common Issues and Fixes

**Issue**: "Failed to fetch" errors
- **Fix**: Check Supabase RLS policies allow public read access
- **Fix**: Verify environment variables are set correctly

**Issue**: "Profile not found" on sign in
- **Fix**: Make sure you signed up first (creates profile)
- **Fix**: Check `profiles` table has your email

**Issue**: Empty data on dashboard
- **Fix**: This is normal if no data exists yet
- **Fix**: Add sample data using SQL scripts

**Issue**: RLS permission errors
- **Fix**: Check Row Level Security policies in Supabase
- **Fix**: Ensure policies allow SELECT, INSERT, UPDATE as needed

---

## ✅ Phase 7: Production Deployment

### Step 7.1: Verify Deployment
1. Check Vercel dashboard for latest deployment
2. Visit production URL
3. Test all features in production

### Step 7.2: Monitor Logs
1. Check Vercel function logs for errors
2. Check Supabase logs for query issues

---

## Next Steps After Testing

1. ✅ Document any issues found
2. ✅ Fix bugs discovered
3. ✅ Add more sample data as needed
4. ✅ Optimize queries if performance issues
5. ✅ Set up proper authentication (Supabase Auth) if needed

---

## Quick Reference

- **Supabase Dashboard**: https://supabase.com/dashboard
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Local Dev Server**: http://localhost:3000
- **API Routes**: Check `src/app/api/` folder
- **Database Schema**: `supabase/schema.sql`
- **Sample Data**: `supabase/sample-data.sql`

