# 📧 Email Service Configuration Guide

This guide will help you set up the email service for sending approval and rejection emails to students.

## 🎯 Quick Setup (5 minutes)

### Step 1: Sign up for Resend

1. Go to [https://resend.com](https://resend.com)
2. Click "Sign Up" and create a free account
3. Verify your email address

### Step 2: Get Your API Key

1. After logging in, go to [https://resend.com/api-keys](https://resend.com/api-keys)
2. Click "Create API Key"
3. Give it a name (e.g., "Pan-Africa Bitcoin Academy")
4. Copy the API key (it starts with `re_` - **save it immediately**, you won't see it again!)

### Step 3: Configure Environment Variables

1. **Open or create `.env.local` file** in your project root (same folder as `package.json`)

2. **Add these lines:**

```env
# Resend Email Configuration
RESEND_API_KEY=re_your_actual_api_key_here
RESEND_FROM_EMAIL=PanAfrican Bitcoin Academy <onboarding@resend.dev>
```

**Important:**
- Replace `re_your_actual_api_key_here` with your actual API key from Resend
- The `RESEND_FROM_EMAIL` can use the default `onboarding@resend.dev` for testing (no setup needed)
- For production, you can use your own domain after verifying it in Resend

### Step 4: Restart Your Development Server

**⚠️ CRITICAL:** Environment variables are only loaded when the server starts!

1. **Stop your server** (press `Ctrl+C` in the terminal)
2. **Start it again:**
   ```bash
   npm run dev
   ```

### Step 5: Test the Configuration

1. Go to your admin dashboard
2. Click the **"🧪 Test Email"** button
3. Enter a test email address
4. You should see: **"✅ Test email sent successfully!"**

## 📋 Complete `.env.local` Example

Here's what your complete `.env.local` file should look like:

```env
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://panafricanbitcoin.com

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Admin Session Secret
ADMIN_SESSION_SECRET=your_random_secret_here

# Resend Email Configuration
RESEND_API_KEY=re_1234567890abcdefghijklmnopqrstuvwxyz
RESEND_FROM_EMAIL=PanAfrican Bitcoin Academy <onboarding@resend.dev>
```

## 🔍 Troubleshooting

### Error: "Email service not configured"

**Problem:** `RESEND_API_KEY` is not set or not loaded.

**Solutions:**
1. ✅ Check that `.env.local` exists in the project root
2. ✅ Verify `RESEND_API_KEY` is set (no quotes, no spaces)
3. ✅ Make sure you **restarted the server** after adding the variable
4. ✅ Check the server console for error messages

### Error: "Invalid sender email configuration"

**Problem:** `RESEND_FROM_EMAIL` is invalid or empty.

**Solutions:**
1. ✅ Use the default: `PanAfrican Bitcoin Academy <onboarding@resend.dev>`
2. ✅ Or remove `RESEND_FROM_EMAIL` from `.env.local` (it will use default)
3. ✅ Make sure the format is: `"Name <email@domain.com>"`

### Test Email Button Shows Diagnostics

If you click "Test Email" and see diagnostics:
- **API Key Present: No** → `RESEND_API_KEY` is not set
- **API Key Length: 0** → `RESEND_API_KEY` is empty
- **Environment Keys Found: None** → No RESEND variables found

**Fix:** Add `RESEND_API_KEY` to `.env.local` and restart the server.

## 🚀 Production Setup

For production (Vercel, etc.):

1. **Add environment variables in your hosting platform:**
   - Go to your project settings
   - Find "Environment Variables"
   - Add:
     - `RESEND_API_KEY` = your API key
     - `RESEND_FROM_EMAIL` = your verified domain email (optional)

2. **Verify your domain (optional but recommended):**
   - In Resend dashboard, go to "Domains"
   - Add your domain (e.g., `panafricanbitcoin.com`)
   - Add the DNS records Resend provides
   - Once verified, update `RESEND_FROM_EMAIL` to use your domain

## 📚 Additional Resources

- [Resend Documentation](https://resend.com/docs)
- [Resend API Keys](https://resend.com/api-keys)
- [Resend Domains](https://resend.com/domains)

## ✅ Verification Checklist

- [ ] Resend account created
- [ ] API key generated and copied
- [ ] `.env.local` file created/updated
- [ ] `RESEND_API_KEY` added to `.env.local`
- [ ] `RESEND_FROM_EMAIL` set (or using default)
- [ ] Development server restarted
- [ ] Test email sent successfully

---

**Need Help?** Check the server console logs for detailed error messages. The email service will log diagnostic information when there are issues.
