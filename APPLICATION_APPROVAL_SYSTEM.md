# Application Approval System - Complete Guide

## Overview

This system handles the complete flow from application submission to student enrollment:

1. **Application Submission** → `applications` table (status: 'Pending')
2. **Admin Approval** → Creates profile + student records + enrollment
3. **Password Setup** → User sets password to activate account
4. **Sign In** → User can access their account

---

## Database Schema Updates

### Run This Migration First

**File:** `supabase/add-application-approval-fields.sql`

This adds:
- `approved_by` (UUID) - Admin who approved
- `approved_at` (Timestamp) - When approved
- `rejected_reason` (Text) - Reason for rejection
- `rejected_at` (Timestamp) - When rejected
- `profile_id` (UUID) - Links to created profile

**To apply:**
1. Go to Supabase SQL Editor
2. Copy and paste the SQL from the file
3. Run it

---

## Flow Diagram

```
User Submits Application
         ↓
   applications table
   (status: 'Pending')
         ↓
   Admin Approves
   (via API endpoint)
         ↓
   ┌─────────────────────┐
   │ Creates Profile      │ (if doesn't exist)
   │ Creates Student      │ (academic tracking)
   │ Enrolls in Cohort    │ (cohort_enrollment)
   │ Unlocks Chapter 1    │ (chapter_progress)
   │ Sets status:         │
   │ 'Pending Password'   │
   └─────────────────────┘
         ↓
   User Sets Password
   (via /setup-password)
         ↓
   Profile status → 'Active'
         ↓
   User Can Sign In
```

---

## API Endpoints

### 1. Submit Application
**Endpoint:** `POST /api/submit-application`

**Request:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+234 1234567890",
  "country": "Nigeria",
  "city": "Lagos",
  "birthDate": "1990-01-01",
  "experienceLevel": "beginner",
  "preferredCohort": "cohort-uuid"
}
```

**Response (Success):**
```json
{
  "success": true,
  "applicationId": "uuid"
}
```

**Response (Error - Already Registered):**
```json
{
  "error": "An account with this email already exists. Please sign in...",
  "hasProfile": true,
  "needsSignIn": true
}
```

---

### 2. Approve Application
**Endpoint:** `POST /api/applications/approve`

**Request:**
```json
{
  "applicationId": "application-uuid",
  "approvedBy": "admin-profile-uuid" // Optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Application approved successfully",
  "profileId": "profile-uuid",
  "isExistingProfile": false,
  "needsPasswordSetup": true
}
```

**What it does:**
1. Checks if profile exists (by email)
2. Creates profile if doesn't exist (status: 'Pending Password Setup')
3. Creates student record
4. Enrolls in cohort (if preferred_cohort_id exists)
5. Unlocks Chapter 1
6. Updates application status to 'Approved'
7. Links application to profile

---

### 3. Reject Application
**Endpoint:** `POST /api/applications/reject`

**Request:**
```json
{
  "applicationId": "application-uuid",
  "rejectedReason": "Reason for rejection",
  "rejectedBy": "admin-profile-uuid" // Optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Application rejected successfully"
}
```

---

### 4. Setup Password (After Approval)
**Endpoint:** `POST /api/applications/setup-password`

**Request:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123!",
  "applicationId": "application-uuid" // Optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password set successfully. You can now sign in."
}
```

**What it does:**
1. Validates password strength
2. Hashes password
3. Updates profile with password_hash
4. Sets profile status to 'Active'

---

## User Flows

### Flow 1: New User Application

1. User fills application form → Submits
2. Application saved to `applications` table (status: 'Pending')
3. Admin approves via API
4. System creates:
   - Profile (status: 'Pending Password Setup')
   - Student record
   - Cohort enrollment
   - Chapter 1 unlock
5. User receives email/link to set password
6. User visits `/setup-password?email=user@example.com`
7. User sets password
8. Profile status → 'Active'
9. User can sign in

### Flow 2: Existing User Applies Again

1. User with existing profile submits application
2. System detects existing profile
3. Returns error: "Account already exists. Please sign in."
4. User signs in (or uses forgot password)

### Flow 3: Application Already Approved

1. User submits application
2. System checks for existing approved application
3. Returns: "Application already approved. Set up password."
4. User goes to `/setup-password`

---

## Admin Interface (To Be Created)

For now, admins can approve applications via API or directly in Supabase:

### Option A: Via API (Recommended)

```bash
curl -X POST http://localhost:3000/api/applications/approve \
  -H "Content-Type: application/json" \
  -d '{
    "applicationId": "application-uuid",
    "approvedBy": "admin-uuid"
  }'
```

### Option B: Direct Database Update

```sql
-- Update application status
UPDATE applications 
SET 
  status = 'Approved',
  approved_at = NOW(),
  profile_id = 'profile-uuid' -- After creating profile
WHERE id = 'application-uuid';
```

---

## Password Setup Page

**URL:** `/setup-password?email=user@example.com&applicationId=uuid`

**Features:**
- Password strength validation
- Show/hide password toggle
- Confirm password field
- Redirects to sign in after success

---

## Database Relationships

```
applications
  ├── profile_id → profiles.id (after approval)
  └── preferred_cohort_id → cohorts.id

profiles
  ├── id (used as student_id everywhere)
  ├── cohort_id → cohorts.id
  └── status ('New', 'Pending Password Setup', 'Active', 'Graduated')

students
  └── profile_id → profiles.id (UNIQUE)

cohort_enrollment
  ├── cohort_id → cohorts.id
  └── student_id → profiles.id

chapter_progress
  └── student_id → profiles.id

sats_rewards
  └── student_id → profiles.id

achievements
  └── student_id → profiles.id
```

**Key Point:** `profiles.id` is used as the student identifier everywhere (achievements, sats, leaderboard, etc.)

---

## Status Values

### Applications
- `Pending` - Awaiting review
- `Approved` - Approved, profile created
- `Rejected` - Rejected with reason

### Profiles
- `New` - Just created, no cohort
- `Pending Password Setup` - Approved but password not set
- `Active` - Password set, can sign in
- `Graduated` - Completed program

---

## Testing Checklist

- [ ] Submit new application → Should save to applications table
- [ ] Submit with existing email → Should show "sign in" message
- [ ] Approve application → Should create profile + student + enrollment
- [ ] Approve application → Should unlock Chapter 1
- [ ] Setup password → Should activate profile
- [ ] Sign in after password setup → Should work
- [ ] Reject application → Should update status

---

## Next Steps

1. **Run database migration** (`add-application-approval-fields.sql`)
2. **Test application submission**
3. **Test approval flow** (via API)
4. **Test password setup**
5. **Create admin dashboard** (optional - for easier approval)

---

## Files Created/Modified

### New Files
- `supabase/add-application-approval-fields.sql` - Database migration
- `src/app/api/applications/approve/route.ts` - Approval endpoint
- `src/app/api/applications/reject/route.ts` - Rejection endpoint
- `src/app/api/applications/setup-password/route.ts` - Password setup
- `src/app/setup-password/page.tsx` - Password setup UI
- `APPLICATION_APPROVAL_SYSTEM.md` - This documentation

### Modified Files
- `src/app/api/submit-application/route.ts` - Better duplicate handling
- `src/app/apply/page.tsx` - Removed profile registration, better errors

---

## Security Notes

- Passwords are hashed with bcrypt (10 salt rounds)
- Password validation enforces strong passwords
- Admin endpoints should be protected (add auth middleware)
- Email verification can be added later

---

**System is ready!** Follow the testing checklist to verify everything works.

