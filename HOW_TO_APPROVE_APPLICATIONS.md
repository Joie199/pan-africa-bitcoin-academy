# How to Approve Applications - Simple Guide

## Quick Steps

### Step 1: View Pending Applications

**Option A: In Supabase Dashboard**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to **Table Editor** → `applications` table
4. Filter by `status = 'Pending'` to see pending applications
5. Copy the `id` (UUID) of the application you want to approve

**Option B: Query via SQL**
```sql
SELECT id, email, first_name, last_name, preferred_cohort_id, created_at 
FROM applications 
WHERE status = 'Pending'
ORDER BY created_at DESC;
```

---

### Step 2: Approve the Application

**Method 1: Using Browser Console (Easiest)**

1. Open your website (e.g., `http://localhost:3000`)
2. Press `F12` to open Developer Tools
3. Go to **Console** tab
4. Paste and run this code (replace `APPLICATION_ID` with the actual UUID):

```javascript
fetch('/api/applications/approve', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    applicationId: 'APPLICATION_ID_HERE', // Replace with actual UUID
    approvedBy: null // Optional: your admin profile UUID
  })
})
.then(res => res.json())
.then(data => {
  console.log('Result:', data);
  if (data.success) {
    alert('Application approved! User can now set password at /setup-password?email=' + data.email);
  } else {
    alert('Error: ' + data.error);
  }
})
.catch(err => console.error('Error:', err));
```

**Method 2: Using curl (Terminal)**

```bash
curl -X POST http://localhost:3000/api/applications/approve \
  -H "Content-Type: application/json" \
  -d '{
    "applicationId": "APPLICATION_ID_HERE",
    "approvedBy": null
  }'
```

**Method 3: Using Postman or Similar Tool**

- **URL:** `POST http://localhost:3000/api/applications/approve`
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "applicationId": "APPLICATION_ID_HERE",
  "approvedBy": null
}
```

---

### Step 3: Notify the User

After approval, the user needs to set their password. Send them this link:

```
http://localhost:3000/setup-password?email=USER_EMAIL_HERE
```

Or in production:
```
https://yourdomain.com/setup-password?email=USER_EMAIL_HERE
```

---

## What Happens When You Approve?

✅ **Profile Created** - New profile in `profiles` table (status: 'Pending Password Setup')  
✅ **Student Record Created** - New record in `students` table  
✅ **Cohort Enrollment** - Student enrolled in their preferred cohort  
✅ **Chapter 1 Unlocked** - Student can access Chapter 1  
✅ **Application Updated** - Status changed to 'Approved'  
✅ **Linked** - Application linked to the created profile  

---

## Example: Complete Approval Process

### 1. Find Application ID
```sql
-- In Supabase SQL Editor
SELECT id, email, first_name, last_name, status 
FROM applications 
WHERE status = 'Pending'
LIMIT 5;
```

Result:
```
id: 123e4567-e89b-12d3-a456-426614174000
email: john@example.com
first_name: John
last_name: Doe
status: Pending
```

### 2. Approve It
```javascript
// In browser console
fetch('/api/applications/approve', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    applicationId: '123e4567-e89b-12d3-a456-426614174000'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

### 3. Send Password Setup Link
Send email to `john@example.com`:
```
Subject: Your Application Has Been Approved!

Hi John,

Your application to Pan-Africa Bitcoin Academy has been approved!

Please set your password to activate your account:
https://yourdomain.com/setup-password?email=john@example.com

After setting your password, you can sign in and start learning!

Best regards,
Pan-Africa Bitcoin Academy Team
```

---

## Rejecting Applications

To reject an application:

```javascript
fetch('/api/applications/reject', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    applicationId: 'APPLICATION_ID_HERE',
    rejectedReason: 'Reason for rejection (e.g., Cohort is full)'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

---

## Batch Approval (Multiple Applications)

To approve multiple applications at once:

```javascript
// List of application IDs
const applicationIds = [
  'id-1-here',
  'id-2-here',
  'id-3-here'
];

// Approve each one
applicationIds.forEach(async (id) => {
  const res = await fetch('/api/applications/approve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ applicationId: id })
  });
  const data = await res.json();
  console.log(`Application ${id}:`, data);
});
```

---

## Troubleshooting

**Error: "Application not found"**
- Check the application ID is correct
- Verify application exists in database

**Error: "Application already approved"**
- Application was already approved
- Check `applications.status` field

**Profile not created:**
- Check application email
- Verify no duplicate email exists
- Check server logs for errors

**User can't set password:**
- Verify profile was created
- Check profile status is 'Pending Password Setup'
- Verify email matches exactly

---

## Quick Reference

**Approve:** `POST /api/applications/approve`  
**Reject:** `POST /api/applications/reject`  
**View Pending:** Supabase → Table Editor → `applications` → Filter `status = 'Pending'`  
**Password Setup:** `/setup-password?email=USER_EMAIL`

---

**That's it! You're ready to approve applications!** 🎉

