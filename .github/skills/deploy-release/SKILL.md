---
name: deploy-release
description: Automated deployment workflow - runs tests, builds, commits changes, pushes to GitHub, and deploys to Vercel production. Handles version bumping, changelog generation, and deployment verification. Use when ready to deploy changes to production.
---

# Deploy & Release Skill

## Purpose

Fully automated deployment pipeline that handles testing, building, committing, pushing, and deploying to production with proper version management.

## When to Use

- When user says "deploy", "release", "ship it", "go live"
- After completing a feature or bug fix
- When explicitly requested
- Before creating a production release

## Deployment Workflow

### Phase 1: Pre-Deploy Checks ✅

**Run Quality Checks**

```bash
npm run type-check    # TypeScript errors
npm run lint          # ESLint errors
npm test              # Unit tests
npm run build         # Production build
```

**Checklist:**

- [ ] TypeScript: No errors
- [ ] ESLint: No errors
- [ ] Tests: All passing
- [ ] Build: Successful

**If any check fails:**

- ❌ STOP deployment
- 🔧 Fix errors first
- 📊 Show which check failed
- ❓ Ask user if they want to fix or force deploy (not recommended)

### Phase 2: Git Operations 📦

**Check Git Status**

```bash
git status --short
git diff --stat
```

**Show Changes to User:**

- Modified files count
- Added files count
- Deleted files count
- Total lines changed

**Create Commit**

```bash
# Stage all changes
git add -A

# Generate commit message based on changes
# Format: type(scope): description
# Examples:
#   feat(ui): add new dashboard widgets
#   fix(auth): resolve login redirect issue
#   chore: update dependencies

git commit -m "..."
```

**Commit Message Guidelines:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Push to GitHub**

```bash
git push origin main
```

### Phase 3: Vercel Deployment 🚀

**Deploy to Production**

```bash
vercel --prod --yes
```

**Monitor Deployment:**

- Show build progress
- Display deployment URL when ready
- Verify deployment status
- Check for build errors

**Deployment Info to Display:**

```
🚀 Deployment Started
📦 Build Time: X minutes
✅ Status: Ready
🌐 Production URL: https://...
📊 Preview URL: https://...
```

### Phase 4: Post-Deploy Verification ✅

**Verify Deployment**

- [ ] Deployment status: Ready
- [ ] Build completed without errors
- [ ] Production URL accessible
- [ ] No runtime errors in logs

**Health Checks:**

```bash
# Check if site is up
curl -I <production-url>

# Check API endpoints if applicable
curl <production-url>/api/health
```

**Optional: Open in Browser**

```bash
start <production-url>  # Windows
open <production-url>   # Mac
xdg-open <production-url> # Linux
```

### Phase 5: Rollback Plan 🔄

**If deployment fails:**

1. Show error logs
2. Offer rollback options:
   - Revert last commit
   - Redeploy previous version
   - Fix and redeploy

**Rollback Command:**

```bash
# Revert last commit
git revert HEAD --no-edit
git push origin main

# Or reset to previous commit
git reset --hard HEAD~1
git push --force origin main
```

## Version Management 📌

**Semantic Versioning:**

- MAJOR.MINOR.PATCH (e.g., 1.2.3)
- MAJOR: Breaking changes
- MINOR: New features (backward compatible)
- PATCH: Bug fixes

**Update package.json version:**

```bash
npm version patch  # 1.0.0 → 1.0.1
npm version minor  # 1.0.0 → 1.1.0
npm version major  # 1.0.0 → 2.0.0
```

## Deployment Checklist

### Pre-Deployment

- [ ] All tests passing
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] Build successful
- [ ] Changes committed
- [ ] Branch up to date with main

### During Deployment

- [ ] Git push successful
- [ ] Vercel build started
- [ ] No build errors
- [ ] Deployment completed

### Post-Deployment

- [ ] Production URL accessible
- [ ] No console errors
- [ ] Critical features working
- [ ] Performance acceptable

## Environment Variables Check 🔐

**Before deploying, verify:**

```bash
# Check if .env.local exists
test -f .env.local && echo "✅ .env.local found" || echo "⚠️ .env.local missing"

# Verify required env vars in Vercel dashboard:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
```

**Warning if missing:**

```
⚠️ Environment variables not configured!
Please set them in Vercel Dashboard:
→ Settings → Environment Variables
```

## Deployment Scenarios

### Scenario 1: Quick Deploy (Default)

```
User: "deploy"

Actions:
1. Run all checks
2. If all pass → commit → push → deploy
3. Show deployment URL
4. Verify site is live
```

### Scenario 2: Deploy with Version Bump

```
User: "deploy and bump version"

Actions:
1. Run all checks
2. Bump package.json version
3. Commit version change
4. Tag release (git tag v1.2.3)
5. Push with tags
6. Deploy to Vercel
```

### Scenario 3: Force Deploy (Skip Tests)

```
User: "force deploy" or "deploy --force"

Actions:
1. ⚠️ Warn user about skipping tests
2. Ask for confirmation
3. Commit → push → deploy
4. Monitor closely for errors
```

### Scenario 4: Deploy Specific Branch

```
User: "deploy feature/new-ui branch"

Actions:
1. Checkout branch
2. Run checks
3. Deploy to Vercel preview
4. Show preview URL
5. Ask if should merge to main
```

## Output Format

**Success Output:**

```markdown
## ✅ Deployment Successful!

### Build Info

- Build Time: 2m 15s
- Status: Ready
- Commit: abc1234

### URLs

- 🌐 Production: https://your-app.vercel.app
- 📊 Dashboard: https://vercel.com/your-team/your-app/...

### Changes Deployed

- 5 files changed
- 120 insertions(+), 45 deletions(-)

### Next Steps

- Test critical features
- Monitor error logs
- Check performance metrics
```

**Failure Output:**

```markdown
## ❌ Deployment Failed

### Error

Build failed: TypeScript compilation errors

### Failed Check

npm run type-check

### Errors Found

src/components/Widget.tsx(42,10): error TS2322: Type 'string' is not assignable to type 'number'.

### Recommended Actions

1. Fix TypeScript errors
2. Run `npm run type-check` locally
3. Try deployment again

### Rollback Available

Run `/deploy rollback` to revert to previous version
```

## Advanced Features

### Deployment with Changelog

```bash
# Generate changelog from commits
git log --oneline --since="last deploy" > CHANGELOG.md

# Include in deployment
git add CHANGELOG.md
git commit -m "docs: update changelog"
```

### Deployment Notifications

```bash
# Send notification (if configured)
curl -X POST https://hooks.slack.com/... \
  -d '{"text": "🚀 New deployment live!"}'
```

### Performance Monitoring

```bash
# Run Lighthouse audit after deployment
npm run lighthouse <production-url>
```

## Safety Features

**Prevent Accidental Deploys:**

- Always show what will be deployed
- Require confirmation for force deploys
- Warn about uncommitted changes
- Check for merge conflicts

**Automatic Rollback Triggers:**

- Build fails
- Critical tests fail
- Deployment timeout
- Health check fails

## Usage Examples

### Basic Deploy

```
User: "deploy"
Assistant: Running pre-deploy checks...
          ✅ TypeScript: No errors
          ✅ ESLint: Passed
          ✅ Tests: 45/45 passing
          ✅ Build: Successful

          Committing changes...
          Pushing to GitHub...
          Deploying to Vercel...

          ✅ Deployment complete!
          🌐 https://your-app.vercel.app
```

### Deploy with Custom Message

```
User: "deploy with message 'fix critical login bug'"
Assistant: Using custom commit message...
          Deploying with: "fix: critical login bug"
          [deployment process...]
```

### Check Deployment Status

```
User: "check deployment status"
Assistant: Latest deployment:
          Status: ● Ready
          URL: https://...
          Build: 2m ago
          Commit: abc1234
```

## Exit Criteria

Deployment is complete when:

- ✅ All pre-checks passed
- ✅ Changes committed and pushed
- ✅ Vercel deployment successful
- ✅ Production URL accessible
- ✅ No critical errors in logs
- ✅ User notified of success

## Error Handling

**Common Issues:**

1. **TypeScript Errors**
   - Run `npm run type-check`
   - Fix errors
   - Retry deployment

2. **Build Failures**
   - Check build logs
   - Verify dependencies
   - Check environment variables

3. **Git Conflicts**
   - Pull latest changes
   - Resolve conflicts
   - Retry deployment

4. **Vercel Errors**
   - Check Vercel dashboard
   - Verify project settings
   - Check deployment logs

**Recovery Steps:**

1. Identify error type
2. Show relevant logs
3. Suggest fixes
4. Offer rollback option
5. Retry after fixes
