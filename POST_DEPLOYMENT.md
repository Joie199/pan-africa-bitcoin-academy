# Post-Deployment Verification Guide

## ✅ Database Migrations Complete
- [x] Password hash column added
- [x] Password reset columns added

## 🚀 Deployment Status

### Step 1: Verify Vercel Deployment
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Check your project: `pan-africa-bitcoin-academy`
3. Look for the latest deployment (should be triggered by your push)
4. Wait for deployment to complete (usually 2-3 minutes)

### Step 2: Check Environment Variables
Verify these are set in Vercel → Settings → Environment Variables:

✅ `NEXT_PUBLIC_SITE_URL` = `https://panafricanbitcoin.com`
✅ `NEXT_PUBLIC_SUPABASE_URL` = Your Supabase project URL
✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your Supabase anon key
✅ `SUPABASE_SERVICE_ROLE_KEY` = Your Supabase service role key

### Step 3: Set Up Supabase Storage (If Not Done)
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to **Storage**
3. Click **New bucket**
4. Name: `profile_img`
5. Set to **Public**
6. Click **Create bucket**

### Step 4: Test Production Site

Visit your production URL and test:

#### Authentication Tests:
- [ ] **Registration**: Create a new account
- [ ] **Login**: Sign in with credentials
- [ ] **Logout**: Verify logout works
- [ ] **Session**: Refresh page, should stay logged in

#### Profile Tests:
- [ ] **View Profile**: Open profile modal
- [ ] **Edit Profile**: Update name, phone, country, city
- [ ] **Save Changes**: Verify updates persist
- [ ] **Upload Image**: Upload a profile picture
- [ ] **Image Display**: Verify image shows in navbar

#### Password Tests:
- [ ] **Change Password**: Update password (requires old password)
- [ ] **Forgot Password**: Click "Forgot password?" link
- [ ] **Reset Link**: Check console for reset link (dev mode)
- [ ] **Reset Password**: Use reset link to set new password

#### Protected Routes:
- [ ] **Dashboard**: Access `/dashboard` (should work when logged in)
- [ ] **Unauthorized Access**: Try accessing `/dashboard` when logged out (should redirect)

### Step 5: Check Browser Console
1. Open browser DevTools (F12)
2. Check **Console** tab for errors
3. Check **Network** tab for failed requests
4. Verify no authentication errors

### Step 6: Check Vercel Logs
1. Go to Vercel Dashboard → Your Project
2. Click **Functions** tab
3. Check for any errors in API routes
4. Look for `/api/profile/*` routes

## 🔍 Common Issues & Solutions

### Issue: "Missing Supabase environment variables"
**Solution**: 
- Go to Vercel → Settings → Environment Variables
- Verify all variables are set
- Redeploy if needed

### Issue: "Image upload fails"
**Solution**:
- Verify `profile_img` bucket exists in Supabase Storage
- Check bucket is set to public
- Verify SUPABASE_SERVICE_ROLE_KEY is set

### Issue: "Password reset doesn't send email"
**Solution**:
- This is expected (email service not integrated yet)
- Check Vercel function logs for reset link (dev mode)
- For production, integrate email service (Resend recommended)

### Issue: "Build fails"
**Solution**:
- Check Vercel deployment logs
- Verify all dependencies are in package.json
- Check for TypeScript errors

## 📧 Email Service Integration (Optional)

To enable email sending for password reset:

1. **Sign up for Resend** (https://resend.com)
2. **Get API Key** from Resend dashboard
3. **Add to Vercel**: `RESEND_API_KEY` = your API key
4. **Update code**: Modify `/api/profile/forgot-password/route.ts` to send emails

Or use another service:
- SendGrid
- AWS SES
- Mailgun

## ✅ Success Criteria

Your deployment is successful when:
- ✅ Site loads without errors
- ✅ Users can register and login
- ✅ Profile updates work
- ✅ Image uploads work
- ✅ Password reset generates tokens (emails optional)
- ✅ No console errors
- ✅ All protected routes work

## 🎉 Deployment Complete!

Once all tests pass, your application is live and ready for users!

## 📊 Monitoring

After deployment, monitor:
- Vercel Analytics (if enabled)
- Supabase usage and limits
- Error logs in Vercel Functions
- User feedback

---

**Next Steps**: 
1. Monitor first few days for any issues
2. Set up email service for password reset
3. Consider adding rate limiting
4. Set up error tracking (Sentry, etc.)

**Status**: Ready for production! 🚀

