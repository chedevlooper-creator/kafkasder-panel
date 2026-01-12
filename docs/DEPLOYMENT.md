# Vercel Deployment Guide

This guide explains how to deploy **Kafkasder Yönetim Paneli** to Vercel.

## Prerequisites

- A [Vercel account](https://vercel.com/signup)
- A [Supabase project](https://supabase.com) (for backend database)
- Git repository pushed to GitHub, GitLab, or Bitbucket

## Deployment Options

### Option 1: Deploy via GitHub Integration (Recommended)

This is the easiest method and enables automatic deployments on every push.

1. **Push your code to GitHub:**
   ```bash
   git push origin claude/setup-vercel-deployment-91Z8p
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Project"
   - Select your Git provider (GitHub/GitLab/Bitbucket)
   - Select this repository: `chedevlooper-creator/Panel-1`
   - Select branch: `claude/setup-vercel-deployment-91Z8p` (or `main` after merging)

3. **Configure Project:**
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./` (default)
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)

4. **Add Environment Variables:**

   Click "Environment Variables" and add the following:

   **Required:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_APP_URL=https://your-vercel-app.vercel.app
   ```

   **Optional (if using Sentry):**
   ```
   NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
   SENTRY_AUTH_TOKEN=your_sentry_auth_token
   ```

5. **Deploy:**
   - Click "Deploy"
   - Vercel will build and deploy your application
   - You'll get a production URL like: `https://panel-1.vercel.app`

### Option 2: Deploy via Vercel CLI

If you have network access to vercel.com:

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```
   Follow the authentication flow in your browser.

3. **Deploy:**
   ```bash
   # Deploy to preview
   vercel

   # Deploy to production
   vercel --prod
   ```

4. **Add Environment Variables:**
   You can add them via the Vercel dashboard or CLI:
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   vercel env add NEXT_PUBLIC_APP_URL
   ```

### Option 3: Deploy from Local Machine

If your development environment has network restrictions:

1. **On your local machine** (not the restricted environment):
   ```bash
   # Clone the repository
   git clone https://github.com/chedevlooper-creator/Panel-1.git
   cd Panel-1

   # Checkout the deployment branch
   git checkout claude/setup-vercel-deployment-91Z8p

   # Install dependencies
   npm install

   # Install Vercel CLI
   npm install -g vercel

   # Login to Vercel
   vercel login

   # Deploy
   vercel --prod
   ```

## Environment Variables Setup

### Getting Supabase Credentials

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** > **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon/Public Key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Setting Environment Variables in Vercel

**Via Dashboard:**
1. Go to your project in [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Settings** > **Environment Variables**
3. Add each variable with appropriate values
4. Select environments: Production, Preview, Development
5. Click **Save**

**Via CLI:**
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# Paste your value when prompted

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# Paste your value when prompted

vercel env add NEXT_PUBLIC_APP_URL production
# Enter: https://your-app-name.vercel.app
```

## Post-Deployment Steps

1. **Update App URL:**
   After deployment, update the `NEXT_PUBLIC_APP_URL` environment variable with your actual Vercel URL.

2. **Configure Supabase Authentication:**
   In Supabase Dashboard > Authentication > URL Configuration, add your Vercel URL:
   - Site URL: `https://your-app.vercel.app`
   - Redirect URLs: `https://your-app.vercel.app/**`

3. **Test the Deployment:**
   - Visit your Vercel URL
   - Test login functionality
   - Verify database connections
   - Check all features work correctly

4. **Set up Custom Domain (Optional):**
   - In Vercel Dashboard > Settings > Domains
   - Add your custom domain
   - Update DNS records as instructed
   - Update `NEXT_PUBLIC_APP_URL` environment variable

## Automatic Deployments

Once connected via GitHub:
- **Production:** Push to `main` branch
- **Preview:** Push to any other branch (including `claude/setup-vercel-deployment-91Z8p`)
- Every commit triggers a new deployment
- Preview deployments get unique URLs

## Troubleshooting

### Build Failures

**Issue:** Build fails with module errors
```bash
# Solution: Clear cache and rebuild
vercel --force
```

**Issue:** Environment variables not found
- Ensure all required variables are set in Vercel Dashboard
- Redeploy after adding variables

### Runtime Errors

**Issue:** Supabase connection fails
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Check Supabase project is active
- Verify environment variables are set for correct environment

**Issue:** Authentication redirects fail
- Update Supabase redirect URLs with your Vercel domain
- Verify `NEXT_PUBLIC_APP_URL` matches your deployment URL

### Performance Issues

**Issue:** Slow page loads
- Enable Edge Functions in `next.config.ts`
- Review and optimize large components
- Use Vercel Analytics to identify bottlenecks

## Vercel Configuration

The project includes `vercel.json`:
```json
{
  "version": 2,
  "framework": "nextjs"
}
```

This ensures Vercel correctly identifies and builds the Next.js project.

## CI/CD Integration

Vercel provides automatic CI/CD:
- Builds are triggered on every commit
- Preview deployments for pull requests
- Production deployments for main branch
- Build logs available in dashboard
- Deployment status checks in GitHub

## Monitoring & Analytics

After deployment, enable:

1. **Vercel Analytics:**
   - Dashboard > Analytics
   - Real-time performance metrics
   - Web vitals tracking

2. **Vercel Logs:**
   - Dashboard > Logs
   - Function execution logs
   - Error tracking

3. **Sentry (Optional):**
   - Already integrated in the project
   - Add Sentry DSN to environment variables
   - Automatic error reporting and tracking

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Vercel Support](https://vercel.com/support)

## Quick Reference

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View deployment logs
vercel logs [deployment-url]

# List deployments
vercel list

# View environment variables
vercel env ls

# Pull environment variables locally
vercel env pull
```
