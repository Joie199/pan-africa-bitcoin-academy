# User Password Setup Guide

## How Users Set Up Their Password

### Complete Flow

```
1. User Submits Application
   ↓
2. Admin Approves Application
   ↓
3. Admin Sends Password Setup Link to User
   ↓
4. User Clicks Link → Goes to Password Setup Page
   ↓
5. User Sets Password
   ↓
6. User Can Now Sign In
```

---

## Step-by-Step Process

### Step 1: User Applies
- User fills out application form at `/apply`
- Application is saved with status: `Pending`

### Step 2: Admin Approves
- Admin approves via `/admin/applications` or API
- System automatically:
  - ✅ Creates profile (status: `Pending Password Setup`)
  - ✅ Creates student record
  - ✅ Enrolls in cohort
  - ✅ Unlocks Chapter 1

### Step 3: Admin Sends Link to User
After approval, admin should send the user this link:

**Local Development:**
```
http://localhost:3000/setup-password?email=user@example.com
```

**Production:**
```
https://yourdomain.com/setup-password?email=user@example.com
```

**Example Email Template:**
```
Subject: Your Application Has Been Approved! 🎉

Hi [Name],

Great news! Your application to Pan-Africa Bitcoin Academy has been approved!

To activate your account, please set your password by clicking the link below:

[Password Setup Link]

After setting your password, you can sign in and start learning!

Best regards,
Pan-Africa Bitcoin Academy Team
```

### Step 4: User Sets Password
1. User clicks the link
2. User lands on `/setup-password` page
3. User sees:
   - Their email (pre-filled)
   - Password field
   - Confirm password field
   - Password requirements
4. User enters password (must meet requirements)
5. User clicks "Set Password"

### Step 5: Password is Set
- Password is hashed and saved
- Profile status changes to `Active`
- User is redirected to sign in page
- User can now sign in with their email and password

---

## Password Setup Page Features

**URL:** `/setup-password?email=user@example.com`

**What Users See:**
- ✅ Email address (pre-filled, read-only)
- ✅ Password input field (with show/hide toggle)
- ✅ Confirm password field (with show/hide toggle)
- ✅ Password requirements list
- ✅ Real-time validation
- ✅ Success message after completion

**Password Requirements:**
- At least 8 characters long
- Contains uppercase and lowercase letters
- Contains at least one number
- Contains at least one special character (!@#$%^&*)

---

## What Happens Behind the Scenes

### When User Sets Password:

1. **API Call:** `POST /api/applications/setup-password`
   ```json
   {
     "email": "user@example.com",
     "password": "SecurePassword123!",
     "applicationId": "optional-uuid"
   }
   ```

2. **Validation:**
   - ✅ Checks if profile exists
   - ✅ Validates password strength
   - ✅ Checks if password already set (prevents reset)

3. **Password Hashing:**
   - Uses `bcryptjs` with 10 salt rounds
   - Stores hash in `profiles.password_hash`

4. **Profile Update:**
   - Sets `password_hash`
   - Changes `status` from `Pending Password Setup` → `Active`
   - Updates `updated_at` timestamp

5. **Response:**
   ```json
   {
     "success": true,
     "message": "Password set successfully. You can now sign in."
   }
   ```

---

## User Experience Flow

### Scenario 1: First Time Setup
```
User receives email
  → Clicks link
  → Sees password setup page
  → Enters password
  → Clicks "Set Password"
  → Sees success message
  → Redirected to sign in
  → Signs in with email + password
  → Access granted! ✅
```

### Scenario 2: Password Already Set
```
User tries to set password again
  → API checks: password_hash exists
  → Returns error: "Password already set"
  → User redirected to sign in page
  → Can use "Forgot Password" if needed
```

### Scenario 3: Application Not Approved
```
User tries to set password
  → API checks: profile status
  → If not approved: Error message
  → User must wait for approval
```

---

## Admin Responsibilities

### After Approving an Application:

1. **Copy the Password Setup Link**
   - From admin page: `/admin/applications`
   - Link is shown after approval
   - Format: `/setup-password?email=user@example.com`

2. **Send to User**
   - Via email (recommended)
   - Via SMS/WhatsApp
   - Via any communication channel

3. **Link Format:**
   ```
   https://yourdomain.com/setup-password?email=user@example.com
   ```

4. **Optional: Include Application ID**
   ```
   https://yourdomain.com/setup-password?email=user@example.com&applicationId=uuid
   ```
   (This helps track which application the password setup is for)

---

## Troubleshooting

### User Can't Access Password Setup Page

**Problem:** Link doesn't work
- ✅ Check email is correct in URL
- ✅ Check URL encoding (spaces should be `%20` or `+`)
- ✅ Verify application was approved
- ✅ Check profile exists in database

**Solution:**
```javascript
// Correct format
/setup-password?email=user@example.com

// Wrong format (spaces not encoded)
/setup-password?email=user name@example.com
```

### Password Requirements Not Met

**Problem:** User gets validation error
- ✅ Show password requirements clearly
- ✅ Provide real-time feedback
- ✅ Give examples of valid passwords

**Example Valid Passwords:**
- `MySecure123!`
- `Bitcoin2024@`
- `Academy#2024`

### User Forgot They Set Password

**Problem:** User tries to set password again
- ✅ API prevents duplicate password setup
- ✅ Shows message: "Password already set. Please sign in."
- ✅ Redirects to sign in page
- ✅ Provides "Forgot Password" option

---

## Security Features

✅ **Password Hashing:** Uses bcrypt with 10 salt rounds  
✅ **Email Verification:** Must match approved application email  
✅ **One-Time Setup:** Password can only be set once  
✅ **Strong Validation:** Enforces complex password requirements  
✅ **Secure Storage:** Password hash stored, never plain text  

---

## Quick Reference

**Password Setup URL:**
```
/setup-password?email=USER_EMAIL
```

**After Setup:**
- User can sign in at `/` (home page)
- Uses email + password they just set
- Profile status: `Active`
- Can access chapters, dashboard, etc.

**If User Forgets Password:**
- Use "Forgot Password" feature (if implemented)
- Or admin can reset via database

---

## Example User Journey

1. **John applies** → Application status: `Pending`
2. **Admin approves** → Profile created, status: `Pending Password Setup`
3. **Admin emails John:**
   ```
   "Your application is approved! Set your password:
   https://academy.com/setup-password?email=john@example.com"
   ```
4. **John clicks link** → Opens password setup page
5. **John sets password:** `MySecure123!`
6. **System updates:** Profile status → `Active`
7. **John signs in** → Access granted! ✅

---

**That's the complete password setup flow!** 🔐




