# Resend Email Setup Guide

This guide will help you set up Resend for automatic email sending when student applications are approved.

## Step 1: Sign Up for Resend

1. Go to **https://resend.com**
2. Click **"Sign Up"** or **"Get Started"**
3. Create an account (you can use GitHub, Google, or email)

## Step 2: Get Your API Key

1. After signing up, you'll be taken to the Resend dashboard
2. Click on **"API Keys"** in the left sidebar (or go to: https://resend.com/api-keys)
3. Click **"Create API Key"**
4. Give it a name (e.g., "PanAfrican Bitcoin Academy Production")
5. Select permissions:
   - **Sending access** - Required
   - **Read access** - Optional (for viewing email logs)
6. Click **"Add"**
7. **IMPORTANT**: Copy the API key immediately - it starts with `re_` and looks like: `re_123456789abcdefghijklmnopqrstuvwxyz`
   - ⚠️ You won't be able to see it again after closing the dialog!

## Step 3: Add API Key to Your Project

### For Local Development:

1. Create or edit `.env.local` file in your project root
2. Add these lines:
   ```env
   RESEND_API_KEY=re_your_api_key_here
   RESEND_FROM_EMAIL=PanAfrican Bitcoin Academy <onboarding@resend.dev>
   ```
3. Replace `re_your_api_key_here` with your actual API key from Step 2

### For Production (Vercel):

1. Go to your Vercel Dashboard: https://vercel.com/dashboard
2. Select your project: **pan-africa-bitcoin-academy**
3. Go to **Settings** → **Environment Variables**
4. Click **"Add New"**
5. Add these variables:

   **Variable 1:**
   - **Key**: `RESEND_API_KEY`
   - **Value**: `re_your_api_key_here` (paste your actual API key)
   - **Environment**: Select all (Production, Preview, Development)
   - Click **"Save"**

   **Variable 2:**
   - **Key**: `RESEND_FROM_EMAIL`
   - **Value**: `PanAfrican Bitcoin Academy <onboarding@resend.dev>` (or your verified domain email)
   - **Environment**: Select all (Production, Preview, Development)
   - Click **"Save"**

6. **Redeploy** your application for the changes to take effect:
   - Go to **Deployments** tab
   - Click **"..."** on the latest deployment
   - Click **"Redeploy"**

## Step 4: Verify Your Domain (For Production)

### Option A: Use Resend's Test Domain (Quick Start)
- You can use `onboarding@resend.dev` for testing
- This works immediately, no verification needed
- **Limit**: 100 emails/day

### Option B: Verify Your Own Domain (Recommended for Production)

1. In Resend Dashboard, go to **"Domains"** (https://resend.com/domains)
2. Click **"Add Domain"**
3. Enter your domain: `panafricanbitcoin.com` (or your domain)
4. Resend will provide DNS records to add:
   - **SPF Record**: `v=spf1 include:resend.com ~all`
   - **DKIM Record**: (provided by Resend)
   - **DMARC Record**: (optional but recommended)

5. Add these DNS records to your domain provider:
   - Go to your domain registrar (e.g., Namecheap, GoDaddy, Cloudflare)
   - Find DNS settings
   - Add the records Resend provides
   - Wait for DNS propagation (usually 5-30 minutes)

6. Once verified, update `RESEND_FROM_EMAIL`:
   ```env
   RESEND_FROM_EMAIL=PanAfrican Bitcoin Academy <noreply@panafricanbitcoin.com>
   ```

## Step 5: Test Email Sending

1. **Test locally:**
   - Make sure `.env.local` has `RESEND_API_KEY` set
   - Start your dev server: `npm run dev`
   - Approve a test application in admin dashboard
   - Check the console logs for email status
   - Check the student's email inbox

2. **Test in production:**
   - After adding environment variables in Vercel
   - Redeploy your application
   - Approve a test application
   - Check email delivery in Resend Dashboard → **"Emails"** tab

## Troubleshooting

### Issue: "Missing API key" error
**Solution:**
- Verify `RESEND_API_KEY` is set in `.env.local` (local) or Vercel (production)
- Make sure there are no extra spaces or quotes around the key
- Restart your dev server after adding the key

### Issue: "Unauthorized" error
**Solution:**
- Check that your API key is correct (starts with `re_`)
- Make sure you copied the full key
- Verify the key hasn't been revoked in Resend dashboard

### Issue: Emails not being received
**Solution:**
- Check Resend Dashboard → **"Emails"** tab for delivery status
- Check spam/junk folder
- Verify the email address is correct
- If using test domain, check Resend's daily limit (100 emails/day)

### Issue: Build fails with "Missing API key"
**Solution:**
- This is normal if the key isn't set during build
- The code handles this gracefully - emails just won't be sent
- Add the key to Vercel environment variables and redeploy

## Email Limits

- **Free Tier**: 100 emails/day, 3,000 emails/month
- **Pro Tier**: Starts at $20/month for higher limits
- Check your current plan: https://resend.com/pricing

## Security Best Practices

1. ✅ **Never commit** `.env.local` to git (it's already in `.gitignore`)
2. ✅ **Never share** your API key publicly
3. ✅ **Rotate keys** periodically (create new key, update env vars, delete old key)
4. ✅ **Use different keys** for development and production
5. ✅ **Monitor usage** in Resend dashboard for suspicious activity

## Next Steps

Once set up:
- ✅ Emails will automatically send when applications are approved
- ✅ Check Resend Dashboard for email analytics and logs
- ✅ Monitor email delivery rates
- ✅ Consider upgrading plan if you exceed free tier limits

---

**Need Help?**
- Resend Documentation: https://resend.com/docs
- Resend Support: support@resend.com
- Check Resend Dashboard: https://resend.com/emails (for email logs)
