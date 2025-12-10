# Quick Supabase Database Setup

## ✅ Step 1: Access Supabase SQL Editor

1. Go to: https://supabase.com/dashboard
2. Select your project (the one connected to Vercel)
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**

## ✅ Step 2: Run the Schema

1. Open `supabase/schema.sql` from this repository
2. **Copy ALL the SQL code** (from line 1 to the end)
3. **Paste** into the Supabase SQL Editor
4. Click **Run** (or press Ctrl+Enter / Cmd+Enter)
5. Wait for "Success" message

**This creates:**
- ✅ 10 database tables
- ✅ Indexes for performance
- ✅ Auto-update triggers
- ✅ Row Level Security (RLS) policies

## ✅ Step 3: Verify Tables Created

1. Go to **Table Editor** in Supabase dashboard
2. You should see these tables:
   - `cohorts`
   - `profiles`
   - `cohort_enrollment`
   - `students`
   - `events`
   - `sats_rewards`
   - `achievements`
   - `developer_resources`
   - `developer_events`
   - `applications`

## ✅ Step 4: Add Sample Data (Optional)

1. Go back to **SQL Editor**
2. Open `supabase/sample-data.sql`
3. Copy and paste into SQL Editor
4. Click **Run**
5. This adds 3 sample cohorts and 5 sample events

## ✅ Step 5: Test Your Application

1. Start your dev server: `npm run dev`
2. Visit http://localhost:3000
3. Try signing up - this will create a profile
4. Check Supabase Table Editor to see the data

## 🎯 What Each Table Does

| Table | Purpose |
|-------|---------|
| `profiles` | User profiles and authentication |
| `cohorts` | Course cohorts (Beginner/Intermediate/Advanced) |
| `cohort_enrollment` | Links students to cohorts |
| `students` | Academic progress data |
| `events` | Calendar events (classes, deadlines, etc.) |
| `sats_rewards` | Bitcoin rewards for students |
| `achievements` | Badges and achievements |
| `applications` | Student applications |
| `developer_resources` | Developer hub resources |
| `developer_events` | Developer events and meetups |

## 🔒 Security Notes

- RLS (Row Level Security) is enabled on all tables
- Public read access is allowed (you can restrict later)
- Public insert/update allowed for profiles and applications
- Adjust policies in Supabase dashboard if needed

## ❓ Troubleshooting

**Error: "relation already exists"**
- Tables already exist - this is fine, the script uses `IF NOT EXISTS`

**Error: "permission denied"**
- Check that you're logged into the correct Supabase project
- Verify you have admin access

**No data showing in app**
- Make sure RLS policies allow SELECT
- Check that environment variables are set in Vercel
- Verify tables were created successfully

## 📝 Next Steps

After running the schema:
1. ✅ Test sign up - creates a profile
2. ✅ Test dashboard - should load (may be empty until data exists)
3. ✅ Test calendar - should show events if you added sample data
4. ✅ Test apply page - should show cohorts

---

**Need help?** Check `STEP_BY_STEP_GUIDE.md` for detailed instructions.

