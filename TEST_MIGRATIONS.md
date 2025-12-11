# ✅ Test Migrations Are Applied

## Quick Test Steps

### 1. Verify in Supabase SQL Editor

Run this quick check:
```sql
-- Check if cohort_id exists in events table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'events' AND column_name = 'cohort_id';
```

**Expected Result:**
```
column_name | data_type
------------|----------
cohort_id  | uuid
```

If you see this → ✅ Migration is applied!

### 2. Test the Events API

1. **Open your app** (or check browser console)
2. **Go to Dashboard** (where calendar is displayed)
3. **Check browser console** for errors

**Expected:**
- ✅ No "Failed to fetch events: 500" error
- ✅ Calendar displays events (or shows "No events" if database is empty)
- ✅ No fallback events warning

### 3. Test Event Creation (Optional)

If you want to test creating an event:

```bash
# Using curl or Postman
POST /api/events/create
{
  "name": "Test Event",
  "type": "community",
  "start_time": "2024-12-20T10:00:00Z",
  "for_all": true
}
```

**Expected:** Event created successfully with `cohort_id: null`

### 4. Full Verification Script

Run `supabase/quick-verify-migrations.sql` in Supabase SQL Editor to check all migrations at once.

---

## ✅ Success Indicators

- [ ] `cohort_id` column exists in `events` table
- [ ] Events API returns 200 (not 500)
- [ ] Calendar loads without errors
- [ ] No "fallback events" warning in console
- [ ] Can create events with `for_all: true` or specific `cohort_id`

---

## 🎉 If All Checks Pass

Your migrations are successfully applied! The events system should now work correctly with cohort filtering.

