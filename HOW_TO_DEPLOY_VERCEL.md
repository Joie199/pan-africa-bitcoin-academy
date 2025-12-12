# How to Deploy to Vercel

## Method 1: Automatic Deployment (Recommended)

Vercel automatically deploys when you push to GitHub:

1. ✅ **Code is already pushed** to GitHub (commit `9f6505e`)
2. ✅ Vercel should detect the push automatically
3. ⏳ Wait 1-2 minutes for deployment to start

**Check Status:**
- Go to: https://vercel.com/dashboard
- Find your project: `pan-africa-bitcoin-academy`
- Check if deployment is running

---

## Method 2: Manual Deployment via Vercel Dashboard

If automatic deployment didn't trigger:

### Step 1: Go to Vercel Dashboard
1. Visit: https://vercel.com/dashboard
2. Log in with your GitHub account

### Step 2: Find Your Project
1. Look for: `pan-africa-bitcoin-academy`
2. Click on the project

### Step 3: Trigger Deployment
**Option A: Redeploy Latest**
1. Go to **Deployments** tab
2. Find the latest deployment
3. Click the **"..."** (three dots) menu
4. Click **"Redeploy"**
5. Confirm deployment

**Option B: Create New Deployment**
1. Click **"Create Deployment"** button (top right)
2. Select branch: `main`
3. Click **"Deploy"**

---

## Method 3: Manual Deployment via Vercel CLI

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login
```bash
vercel login
```
Follow the prompts to authenticate.

### Step 3: Deploy
```bash
# Navigate to your project
cd "C:\Users\Administrator\Documents\projects\Pan-Africa BItcoin Acadamy"

# Deploy to production
vercel --prod
```

---

## Method 4: Force Redeploy (Quick Fix)

Make a small change and push:

```bash
# Add a comment to trigger deployment
echo "" >> README.md
git add README.md
git commit -m "Trigger Vercel deployment"
git push origin main
```

This will trigger Vercel's automatic deployment.

---

## Check Deployment Status

### In Vercel Dashboard:
1. Go to: https://vercel.com/dashboard
2. Click on your project
3. Check **Deployments** tab
4. Look for:
   - ✅ **Green checkmark** = Success
   - ⏳ **Yellow circle** = In progress
   - ❌ **Red X** = Failed (check logs)

### Check Build Logs:
1. Click on the deployment
2. Go to **Build Logs** tab
3. Look for errors or warnings

---

## Troubleshooting

### If Deployment Fails:

1. **Check Build Logs**
   - Look for specific error messages
   - Common issues: TypeScript errors, missing dependencies

2. **Check Environment Variables**
   - Vercel Dashboard → Settings → Environment Variables
   - Verify all Supabase keys are set

3. **Check GitHub Connection**
   - Vercel Dashboard → Settings → Git
   - Verify repository is connected
   - Check webhook is active

4. **Try Manual Redeploy**
   - Use Method 2 or 3 above

---

## Quick Checklist

- [ ] Code pushed to GitHub ✅ (Done - commit `9f6505e`)
- [ ] Check Vercel Dashboard for deployment
- [ ] If no deployment, trigger manually (Method 2)
- [ ] Wait for build to complete
- [ ] Verify site is live

---

## Current Status

**Latest Commit:** `9f6505e`  
**Repository:** https://github.com/Joie199/pan-africa-bitcoin-academy  
**Branch:** `main`

**Next Step:** Check Vercel Dashboard → Deployments tab

---

**Vercel should auto-deploy. If not, use Method 2 (Dashboard) to trigger manually!** 🚀




