# Supabase Database Setup Guide

## Step 1: Run the SQL Schema

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to **SQL Editor**
3. Open the file `supabase/schema.sql` from this repository
4. Copy and paste the entire SQL script into the SQL Editor
5. Click **Run** to execute the script

This will create all necessary tables:
- `profiles` - User profiles and authentication
- `cohorts` - Course cohorts
- `cohort_enrollment` - Many-to-many relationship between cohorts and students
- `students` - Student academic data
- `events` - Calendar events
- `sats_rewards` - Sats rewards for students
- `achievements` - Student achievements/badges
- `developer_resources` - Developer hub resources
- `developer_events` - Developer events
- `applications` - Student applications

## Step 2: Verify Tables

1. Go to **Table Editor** in Supabase dashboard
2. Verify all tables are created
3. Check that Row Level Security (RLS) is enabled

## Step 3: Environment Variables

The Supabase integration via Vercel should have automatically added:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

If not, add them manually in Vercel project settings.

## Step 4: Test the Application

1. Start the dev server: `npm run dev`
2. Test the following:
   - Sign up/Sign in (Profile creation)
   - View dashboard (Student data)
   - View calendar (Events)
   - Apply page (Cohorts listing)
   - Submit application

## Step 5: Add Sample Data (Optional)

You can add sample data through the Supabase dashboard or via SQL:

```sql
-- Example: Add a cohort
INSERT INTO cohorts (name, start_date, end_date, status, sessions, level, seats_total)
VALUES ('Cohort 1', '2025-01-15', '2025-04-15', 'Upcoming', 12, 'Beginner', 30);

-- Example: Add an event
INSERT INTO events (name, type, start_time, description)
VALUES ('Introduction to Bitcoin', 'live-class', '2025-01-15 10:00:00+00', 'First class of the cohort');
```

## Troubleshooting

- **RLS Errors**: If you get permission errors, check Row Level Security policies in Supabase
- **Missing Data**: Ensure tables are created and RLS policies allow read access
- **Connection Errors**: Verify environment variables are set correctly in Vercel

