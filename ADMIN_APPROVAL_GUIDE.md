# Admin Approval Guide - Quick Reference

## How to Approve Applications

### Method 1: Using API (Recommended)

**Endpoint:** `POST /api/applications/approve`

**Example using curl:**
```bash
curl -X POST http://localhost:3000/api/applications/approve \
  -H "Content-Type: application/json" \
  -d '{
    "applicationId": "application-uuid-here",
    "approvedBy": "your-admin-profile-uuid" // Optional
  }'
```

**Example using JavaScript:**
```javascript
const response = await fetch('/api/applications/approve', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    applicationId: 'application-uuid-here',
    approvedBy: 'admin-uuid' // Optional
  })
});

const result = await response.json();
console.log(result);
```

### Method 2: Direct Database Update (Advanced)

1. Get the application ID from `applications` table
2. Create profile manually (if needed)
3. Update application:
```sql
UPDATE applications 
SET 
  status = 'Approved',
  approved_at = NOW(),
  profile_id = 'profile-uuid'
WHERE id = 'application-uuid';
```

---

## How to Reject Applications

**Endpoint:** `POST /api/applications/reject`

```bash
curl -X POST http://localhost:3000/api/applications/reject \
  -H "Content-Type: application/json" \
  -d '{
    "applicationId": "application-uuid-here",
    "rejectedReason": "Reason for rejection",
    "rejectedBy": "admin-uuid" // Optional
  }'
```

---

## What Happens When You Approve

1. ✅ Profile created (if doesn't exist)
2. ✅ Student record created
3. ✅ Enrolled in selected cohort
4. ✅ Chapter 1 unlocked
5. ✅ Application status → 'Approved'
6. ✅ Application linked to profile

**User needs to:** Set password at `/setup-password?email=user@example.com`

---

## Viewing Applications

**In Supabase:**
- Go to Table Editor → `applications` table
- Filter by `status = 'Pending'` to see pending applications
- Click on an application to see details

**Fields to check:**
- `email` - User's email
- `preferred_cohort_id` - Which cohort they want
- `status` - Current status
- `created_at` - When they applied

---

## Quick Approval Checklist

- [ ] Application exists and status is 'Pending'
- [ ] Cohort has available seats (if applicable)
- [ ] Email doesn't already have an active profile (check `profiles` table)
- [ ] Call approve API
- [ ] Verify profile was created
- [ ] Verify student record was created
- [ ] Verify enrollment was created
- [ ] Send user link to set password: `/setup-password?email=user@example.com`

---

## Troubleshooting

**Error: "Application not found"**
- Check application ID is correct
- Verify application exists in database

**Error: "Application already approved"**
- Application was already approved
- Check `applications.status` field

**Profile not created:**
- Check application email
- Verify no duplicate email exists
- Check Supabase logs for errors

**Student record not created:**
- This is okay - it can be created later
- Check `students` table manually if needed

---

**Need help?** Check `APPLICATION_APPROVAL_SYSTEM.md` for detailed documentation.

