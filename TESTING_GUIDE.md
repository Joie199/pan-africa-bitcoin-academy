# Testing Guide - Application & Registration System

## Quick Test Flow

### Test 1: Submit New Application

1. Go to `/apply`
2. Fill out the form completely
3. Click "Register"
4. **Expected:** Success message "Application submitted successfully!"

**Verify in Supabase:**
- Go to `applications` table
- Find your application
- Status should be `Pending`
- All fields should be filled

---

### Test 2: Approve Application

**Get Application ID:**
- From Supabase `applications` table
- Copy the `id` (UUID)

**Approve via API:**
```bash
curl -X POST http://localhost:3000/api/applications/approve \
  -H "Content-Type: application/json" \
  -d '{
    "applicationId": "YOUR-APPLICATION-UUID"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Application approved successfully",
  "profileId": "profile-uuid",
  "isExistingProfile": false,
  "needsPasswordSetup": true
}
```

**Verify in Supabase:**
- `applications.status` → `Approved`
- `applications.profile_id` → Should have UUID
- `profiles` table → New profile created (status: `Pending Password Setup`)
- `students` table → New student record created
- `cohort_enrollment` → Enrollment record created (if cohort selected)
- `chapter_progress` → Chapter 1 unlocked (if table exists)

---

### Test 3: Set Password

1. Go to: `/setup-password?email=YOUR-EMAIL@example.com`
2. Enter password (min 8 chars, uppercase, lowercase, number, special char)
3. Confirm password
4. Click "Set Password"

**Expected:** Success message, redirects to sign in

**Verify in Supabase:**
- `profiles.status` → `Active`
- `profiles.password_hash` → Should have bcrypt hash

---

### Test 4: Sign In

1. Go to homepage
2. Click "Sign In"
3. Enter email and password
4. Click "Sign In"

**Expected:** Redirects to `/dashboard`

---

### Test 5: Access Chapter

1. While signed in, go to `/chapters`
2. Click "View Chapter" on Chapter 1

**Expected:** Chapter opens successfully

---

### Test 6: Duplicate Application (Existing Profile)

1. Try to submit application with email that already has a profile
2. **Expected:** Error message "An account with this email already exists. Please sign in."

---

### Test 7: Sign In Before Password Setup

1. Approve an application (creates profile without password)
2. Try to sign in with that email
3. **Expected:** Redirects to `/setup-password?email=...`

---

## Common Issues & Solutions

### Issue: "Application not found" when approving
- **Solution:** Check application ID is correct
- Verify application exists in `applications` table

### Issue: Profile not created on approval
- **Solution:** Check Supabase logs for errors
- Verify email is valid
- Check if profile already exists

### Issue: Chapter 1 not unlocked
- **Solution:** Run `add-chapter-progress-table.sql` migration first
- Or it will unlock automatically when table exists

### Issue: Can't sign in after password setup
- **Solution:** Check `profiles.status` is `Active`
- Verify `password_hash` is set
- Check browser console for errors

---

## Verification Checklist

After approving an application, verify:

- [ ] Application status = `Approved`
- [ ] Profile created in `profiles` table
- [ ] Student record created in `students` table
- [ ] Enrollment created in `cohort_enrollment` (if cohort selected)
- [ ] Chapter 1 unlocked in `chapter_progress` (if table exists)
- [ ] User can set password
- [ ] User can sign in after password setup
- [ ] User can access Chapter 1

---

**Ready to test!** Start with Test 1 and work through each step.

