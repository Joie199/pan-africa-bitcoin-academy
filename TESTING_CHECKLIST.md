# Testing Checklist - Step by Step

## Phase 1: Database Setup ✅

- [ ] **Step 1.1**: Go to Supabase Dashboard → SQL Editor
- [ ] **Step 1.2**: Open `supabase/schema.sql` file
- [ ] **Step 1.3**: Copy entire SQL script
- [ ] **Step 1.4**: Paste into SQL Editor
- [ ] **Step 1.5**: Click "Run" to execute
- [ ] **Step 1.6**: Verify all tables created (check Table Editor)
- [ ] **Step 1.7**: Verify RLS policies are enabled

## Phase 2: Environment Verification ✅

- [ ] **Step 2.1**: Verify Supabase env vars in Vercel
- [ ] **Step 2.2**: Check `NEXT_PUBLIC_SUPABASE_URL` is set
- [ ] **Step 2.3**: Check `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set
- [ ] **Step 2.4**: Pull env vars locally: `vercel env pull .env.local`

## Phase 3: Local Testing ✅

- [ ] **Step 3.1**: Start dev server: `npm run dev`
- [ ] **Step 3.2**: Check for build errors
- [ ] **Step 3.3**: Verify Supabase client initializes correctly

## Phase 4: API Route Testing ✅

### Authentication Routes
- [ ] **Step 4.1**: Test `/api/profile/register` (POST)
- [ ] **Step 4.2**: Test `/api/profile/login` (POST)
- [ ] **Step 4.3**: Test `/api/profile/update` (POST)

### Data Routes
- [ ] **Step 4.4**: Test `/api/students` (GET)
- [ ] **Step 4.5**: Test `/api/events` (GET)
- [ ] **Step 4.6**: Test `/api/cohorts` (GET)
- [ ] **Step 4.7**: Test `/api/sats` (GET)
- [ ] **Step 4.8**: Test `/api/leaderboard` (GET)
- [ ] **Step 4.9**: Test `/api/submit-application` (POST)

## Phase 5: Component Testing ✅

### Authentication
- [ ] **Step 5.1**: Test Sign Up flow
- [ ] **Step 5.2**: Test Sign In flow
- [ ] **Step 5.3**: Verify profile creation in database
- [ ] **Step 5.4**: Verify localStorage stores email

### Dashboard
- [ ] **Step 5.5**: Test student data loading
- [ ] **Step 5.6**: Test sats wallet display
- [ ] **Step 5.7**: Test leaderboard display
- [ ] **Step 5.8**: Test profile modal (view/edit)
- [ ] **Step 5.9**: Test profile update functionality

### Calendar
- [ ] **Step 5.10**: Test events loading
- [ ] **Step 5.11**: Test upcoming events list
- [ ] **Step 5.12**: Verify event dates display correctly

### Apply Page
- [ ] **Step 5.13**: Test cohorts loading
- [ ] **Step 5.14**: Test cohort selection
- [ ] **Step 5.15**: Test application form submission
- [ ] **Step 5.16**: Verify application saved to database

## Phase 6: Sample Data Creation ✅

- [ ] **Step 6.1**: Create at least 1 cohort
- [ ] **Step 6.2**: Create at least 2-3 events
- [ ] **Step 6.3**: Create sample student profile
- [ ] **Step 6.4**: Add sats rewards for testing
- [ ] **Step 6.5**: Add achievements for leaderboard

## Phase 7: Error Handling ✅

- [ ] **Step 7.1**: Test with empty database
- [ ] **Step 7.2**: Test with invalid email
- [ ] **Step 7.3**: Test with missing required fields
- [ ] **Step 7.4**: Verify error messages display correctly

## Phase 8: Production Deployment ✅

- [ ] **Step 8.1**: Verify Vercel deployment succeeded
- [ ] **Step 8.2**: Test production URL
- [ ] **Step 8.3**: Verify environment variables in production
- [ ] **Step 8.4**: Test all functionality in production

## Notes

- Keep this checklist updated as you test
- Document any issues found
- Fix issues before moving to next phase

