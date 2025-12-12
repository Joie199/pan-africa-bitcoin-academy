# Sign Up Form & Profile Database Analysis

## Current State Analysis

### 1. Sign Up Form (`AuthModal.tsx`)

**Location:** `src/components/AuthModal.tsx`

**Current Fields:**
- ✅ Full Name (split into firstName/lastName)
- ✅ Email
- ✅ Password (with validation)
- ✅ Confirm Password

**Current Flow:**
1. User fills form
2. Submits to `/api/profile/register`
3. Creates profile in `profiles` table
4. Status: `'New'`
5. No student record created
6. User can sign in immediately

---

### 2. Profile Database Schema

**Table:** `profiles`

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY,                    -- Main identifier (used everywhere)
  student_id TEXT UNIQUE,                 -- Format: "1/1/2025" (cohort/roll/year) - OPTIONAL
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,                             -- Optional
  country TEXT,                           -- Optional
  city TEXT,                              -- Optional
  photo_url TEXT,                         -- Optional
  status TEXT DEFAULT 'New',              -- New, Active, Pending Password Setup, Graduated
  password_hash TEXT,                     -- Bcrypt hashed
  reset_token TEXT,                       -- For password reset
  reset_token_expiry TIMESTAMP,
  cohort_id UUID REFERENCES cohorts(id),  -- Links to enrolled cohort
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

**Key Points:**
- `id` (UUID) is the primary identifier used everywhere
- `student_id` (TEXT) is optional - format like "1/1/2025"
- `status` can be: `'New'`, `'Active'`, `'Pending Password Setup'`, `'Graduated'`

---

### 3. Database Relationships

**Tables that reference `profiles.id`:**

1. **`students`** → `profile_id UUID REFERENCES profiles(id)`
   - Academic tracking (progress, assignments, etc.)
   - Created when user applies and gets approved

2. **`cohort_enrollment`** → `student_id UUID REFERENCES profiles(id)`
   - Many-to-many: which students in which cohorts
   - Created when user applies and gets approved

3. **`sats_rewards`** → `student_id UUID REFERENCES profiles(id)`
   - Rewards tracking

4. **`achievements`** → `student_id UUID REFERENCES profiles(id)`
   - Achievements/badges

5. **`chapter_progress`** → `student_id UUID REFERENCES profiles(id)`
   - Chapter completion tracking

6. **`applications`** → `profile_id UUID REFERENCES profiles(id)`
   - Links approved application to profile

**Important:** All use `profiles.id` (UUID), NOT `profiles.student_id` (TEXT)

---

### 4. Current Registration Flow

```
User Signs Up
  ↓
POST /api/profile/register
  ↓
Creates profile:
  - name: "John Doe"
  - email: "john@example.com"
  - password_hash: "bcrypt_hash"
  - status: "New"
  ↓
No student record created
No cohort enrollment
No chapter access
  ↓
User can sign in
User can view profile
User sees "Apply Now" button
```

---

### 5. Application Flow (After Sign Up)

```
User Applies (via /apply page)
  ↓
POST /api/submit-application
  ↓
Creates application:
  - first_name, last_name, email, phone, etc.
  - status: "Pending"
  ↓
Admin Approves
  ↓
POST /api/applications/approve
  ↓
Creates/Updates:
  - Profile (if new) or links to existing
  - Student record
  - Cohort enrollment
  - Chapter 1 unlock
  - Status: "Pending Password Setup"
  ↓
User Sets Password
  ↓
Status → "Active"
User can access chapters
```

---

## Current Issues & Questions

### Issue 1: Two Registration Paths

**Path A: Direct Sign Up** (`/api/profile/register`)
- Creates profile immediately
- Status: `'New'`
- User can sign in
- Must apply separately

**Path B: Application → Approval** (`/api/submit-application` → `/api/applications/approve`)
- Creates profile on approval
- Status: `'Pending Password Setup'`
- User must set password
- Student record created automatically

**Question:** Should we keep both paths, or consolidate to one?

---

### Issue 2: `student_id` Field

**Current:** `profiles.student_id` is TEXT, optional, format "1/1/2025"

**Usage:** 
- Not used in any foreign key relationships
- All relationships use `profiles.id` (UUID)
- Index exists but may not be needed

**Question:** 
- Do you need the `student_id` field?
- If yes, when should it be generated? (On approval? On enrollment?)
- What format should it be? (cohort/roll/year?)

---

### Issue 3: Sign Up Form Fields

**Current Fields:**
- Name
- Email
- Password

**Missing (but in application form):**
- Phone
- Country
- City
- Birth Date
- Experience Level

**Question:** 
- Should sign up collect more info?
- Or keep it minimal and collect rest during application?

---

### Issue 4: Profile Status Values

**Current Statuses:**
- `'New'` - Just signed up, not applied
- `'Active'` - Approved and password set
- `'Pending Password Setup'` - Approved, needs password
- `'Graduated'` - Completed program

**Question:** 
- Are these all the statuses you need?
- Should we add more? (e.g., `'Suspended'`, `'Inactive'`)

---

### Issue 5: Registration vs Application

**Current:** 
- Sign up creates profile
- Application is separate step
- Approval creates student record

**Alternative:**
- Remove direct sign up
- Only allow application → approval flow
- Everyone must apply first

**Question:** 
- Should users be able to sign up without applying?
- Or should application be the only entry point?

---

## Recommendations

### Option A: Keep Both Paths (Current)
- ✅ Users can sign up to explore
- ✅ Must apply to become student
- ✅ Clear separation

### Option B: Application Only
- ✅ Single entry point
- ✅ All users go through approval
- ✅ More controlled

### Option C: Enhanced Sign Up
- ✅ Collect more info at sign up
- ✅ Auto-create application
- ✅ Still requires approval

---

## What We Need to Decide

1. **Registration Flow:**
   - [ ] Keep both sign up + application
   - [ ] Application only
   - [ ] Enhanced sign up

2. **Sign Up Form Fields:**
   - [ ] Keep minimal (name, email, password)
   - [ ] Add phone, country, city
   - [ ] Add birth date, experience level

3. **`student_id` Field:**
   - [ ] Keep it (when to generate?)
   - [ ] Remove it (use UUID only)

4. **Profile Status:**
   - [ ] Keep current statuses
   - [ ] Add more statuses
   - [ ] Simplify statuses

5. **Database Relations:**
   - [ ] Keep current structure
   - [ ] Need any changes?

---

**Please review and let me know what you want to change or improve!** 🚀




