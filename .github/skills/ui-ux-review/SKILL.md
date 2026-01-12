---
name: ui-ux-review
description: Detect and fix UI/UX issues including responsive web design, accessibility (WCAG compliance, keyboard navigation, screen readers), visual consistency, loading/empty/error states, and cross-device compatibility. Use after creating new pages/components, before production deploys, or during quality audits.
---

# UI/UX Review Skill

## ⚠️ CRITICAL: Web-Only Application
**Bu proje bir WEB uygulamasıdır. Mobil uygulama (native mobile app) YOKTUR.**
- Responsive tasarım = farklı ekran boyutlarında çalışan tek bir web uygulaması
- "Mobil" = küçük ekran genişliğinde web tarayıcısı (mobile web)
- Tüm kullanıcılar aynı Next.js web uygulamasına erişir

## Purpose
Automatically detect and fix UI/UX issues including responsive web design, accessibility, usability, and visual consistency problems for a web application that works across all screen sizes.

## When to Use
- After creating new pages or components
- Before deploying to production
- When user reports UI issues
- During regular quality audits

## UI/UX Audit Checklist

### 1. Responsive Web Design

**Breakpoints** (Tailwind: sm:640px, md:768px, lg:1024px, xl:1280px, 2xl:1536px)
- [ ] Small screens (< 640px): Content readable, optimized for smaller viewports
- [ ] Medium screens (640-1024px): Layout adapts, no horizontal scroll
- [ ] Large screens (> 1024px): Optimal use of space, proper content width
- [ ] Flex/grid layouts use responsive classes (sm:, md:, lg:, xl:, 2xl:)
- [ ] Images/media have responsive sizing
- [ ] Navigation adapts to screen size (hamburger menu on small screens)
- [ ] Modals/dialogs work on all screen sizes

**Common Responsive Issues**:
- Fixed widths without responsive variants
- Horizontal scrolling on smaller screens
- Text too small on compact viewports (min 16px for body)
- Interactive elements too small for touch (min 44x44px)
- Overlapping elements on narrow screens

### 2. Accessibility (a11y)

**Semantic HTML**
- [ ] Proper heading hierarchy (h1 → h2 → h3)
- [ ] Buttons use `<button>`, links use `<a>`
- [ ] Forms have proper `<label>` associations
- [ ] Lists use `<ul>/<ol>/<li>`
- [ ] Main content in `<main>`, nav in `<nav>`

**ARIA & Screen Readers**
- [ ] Images have alt text (decorative: alt="")
- [ ] Icons have aria-label or sr-only text
- [ ] Form inputs have labels or aria-label
- [ ] Error messages linked with aria-describedby
- [ ] Loading states announced with aria-live
- [ ] Dialogs have aria-labelledby and aria-describedby
- [ ] Focus management in modals/dropdowns

**Keyboard Navigation**
- [ ] All interactive elements keyboard accessible
- [ ] Visible focus indicators (focus-visible:ring)
- [ ] Tab order logical
- [ ] Modals trap focus
- [ ] Escape closes dialogs
- [ ] No keyboard traps

**Color & Contrast**
- [ ] Text contrast ≥ 4.5:1 (normal), ≥ 3:1 (large)
- [ ] Don't rely on color alone for information
- [ ] Links distinguishable from text
- [ ] Form validation not color-only

### 3. Visual Consistency

**Spacing** (Tailwind spacing scale)
- [ ] Consistent use of spacing utilities (p-4, gap-6, etc.)
- [ ] Vertical rhythm maintained
- [ ] Proper use of spacing-inline/spacing-tight classes
- [ ] No arbitrary values ([16px]) unless necessary

**Typography**
- [ ] Consistent heading sizes (text-heading-1, text-heading-2)
- [ ] Body text: text-base (16px)
- [ ] Proper font weights (font-medium, font-semibold, font-bold)
- [ ] Line heights appropriate for text length
- [ ] Text color hierarchy (foreground, muted-foreground)

**Colors**
- [ ] Use of design tokens (primary, secondary, destructive, etc.)
- [ ] No hardcoded colors
- [ ] Dark mode support
- [ ] Proper use of opacity variants (/10, /20, /50, /90)

**Components**
- [ ] Consistent button sizes/variants
- [ ] Card padding consistent (p-6 typical)
- [ ] Border radius consistent (rounded-md, rounded-lg)
- [ ] Shadow usage consistent (shadow-sm, shadow-md)

### 4. User Experience (UX)

**Loading States**
- [ ] Async operations show loading indicators
- [ ] Skeleton loaders for content
- [ ] Spinner for actions (buttons with loading prop)
- [ ] No "flash of empty content"
- [ ] Optimistic updates where appropriate

**Empty States**
- [ ] Lists show EmptyState component when no data
- [ ] Clear message + helpful action
- [ ] Icon that represents the empty state
- [ ] Not just blank space

**Error Handling**
- [ ] User-friendly error messages (Turkish)
- [ ] Retry functionality for failed requests
- [ ] Form validation messages clear and specific
- [ ] Error boundaries catch component errors
- [ ] No raw error objects shown to users

**Feedback & Confirmation**
- [ ] Success toast after mutations
- [ ] Confirmation dialogs for destructive actions
- [ ] Loading states during submissions
- [ ] Disabled state during processing
- [ ] Clear success/error indicators

**Navigation**
- [ ] Breadcrumbs on deep pages
- [ ] Active nav item highlighted
- [ ] Back buttons where expected
- [ ] Clear page titles (PageHeader)
- [ ] Logical information architecture

**Forms**
- [ ] Clear labels for all inputs
- [ ] Placeholder text helpful but not replacing labels
- [ ] Validation on blur or submit (not on every keystroke)
- [ ] Error messages appear near the field
- [ ] Required fields marked clearly
- [ ] Submit button disabled during submission

### 5. Performance & Perceived Performance

**Images & Media**
- [ ] Proper next/image usage with width/height
- [ ] Lazy loading for below-fold images
- [ ] Optimized image formats (WebP)
- [ ] Placeholder or blur-up effect

**Code Splitting**
- [ ] Heavy components dynamically imported
- [ ] Route-based code splitting (Next.js automatic)
- [ ] Third-party scripts loaded async

**Animations**
- [ ] Smooth transitions (transition-all, duration-300)
- [ ] No janky animations
- [ ] Respect prefers-reduced-motion
- [ ] Loading indicators appear immediately

### 6. Small Screen / Touch Device Considerations (Web)

**Not: Bu bir responsive WEB uygulamasıdır, mobil app değil**
- [ ] Viewport meta tag present (`<meta name="viewport" content="width=device-width, initial-scale=1">`)
- [ ] Interactive elements tıklanabilir (hover-only interactions'dan kaçın)
- [ ] Touch targets ≥ 44x44px (küçük ekranlarda parmakla tıklama için)
- [ ] Font boyutu okunabilir (min 16px body text)
- [ ] Forms iOS'ta zoom yapmaz (input font-size ≥ 16px)
- [ ] Horizontal scroll yok
- [ ] Responsive navigation (hamburger menu küçük ekranlarda)
- [ ] Modals/dialogs küçük ekranlarda çalışır

### 7. Common UI Anti-Patterns

**Avoid**:
- [ ] ❌ "Click here" links (use descriptive text)
- [ ] ❌ Disabled buttons without explanation
- [ ] ❌ Modals on page load
- [ ] ❌ Auto-playing videos/audio
- [ ] ❌ Infinite scroll without pagination fallback
- [ ] ❌ Carousels (users often miss content)
- [ ] ❌ Tooltips for critical information
- [ ] ❌ CAPTCHAs (use honeypots/rate limiting)

### 8. Project-Specific UI Rules

**Component Usage**
- [ ] PageHeader for all page titles (with action prop, not actions)
- [ ] StatCard for dashboard metrics
- [ ] DataTable for lists with pagination/filtering
- [ ] EmptyState for no-data scenarios
- [ ] QueryError for API errors
- [ ] LoadingState or Skeleton for loading
- [ ] ErrorBoundary for error containment

**Turkish Language**
- [ ] All UI text in Turkish
- [ ] Error messages in Turkish
- [ ] Date/time formatted in Turkish locale
- [ ] Currency formatted as Turkish Lira (₺)

**Design System**
- [ ] Use shadcn/ui components from @/components/ui
- [ ] CVA for component variants
- [ ] No custom CSS files (Tailwind only)
- [ ] Consistent icon library (lucide-react)

## Automated Checks

Run these tools:
```bash
# Accessibility scan (if available)
npm run test:a11y

# Lighthouse audit
npx lighthouse http://localhost:3000 --view

# Check responsive design
npm run dev
# Then test at: mobile (375px), tablet (768px), desktop (1440px)
```

## Manual Testing Checklist

1. **Keyboard Navigation**
   - Tab through entire page
   - Verify focus visible
   - Test with screen reader (NVDA/JAWS/VoiceOver)
Web Testing**
   - Chrome DevTools device emulation (farklı ekran boyutları)
   - Gerçek cihazlarda web tarayıcıda test et (mobile web)
   - Landscape/portrait orientations test et
   - Tarayıcı zoom seviyelerini test et (90%, 110%, 125%)ible
   - Rotate to landscape/portrait

3. **Usability Testing**
   - Can a new user accomplish main tasks?
   - Is information hierarchy clear?
   - Are CTAs obvious?

## Review Output Format

```markdown
## UI/UX Audit Results

### 🔴 Critical Issues (Fix Immediately)
1. [Component/Page] - Description
   - Impact: [UX/Accessibility/Mobile]
   - Fix: [Specific solution]

### 🟡 Warnings (Should Fix)
1. [Component/Page] - Description
   - Suggestion: [Improvement]

### ✅ Good Practices Found
- [What's working well]

### 📊 Summary
- Critical: X issues
- Responsive (all screen sizes)ues
- Accessibility score: X/100
- Mobile-friendly: Yes/No
```

## Common Fixes

**Responsive**:
```tsx
// ❌ Bad: Fixed width
<div className="w-96">

// ✅ Good: Responsive width
<div className="w-full md:w-96">
```

**Accessibility**:
```tsx
// ❌ Bad: No label
<button><Icon /></button>

// ✅ Good: aria-label
<button aria-label="Kaydet"><Icon /></button>
```

**Loading State**:
```tsx
// ❌ Bad: No loading indicator
const { data } = useQuery()
return <div>{data.map(...)}</div>

// ✅ Good: Loading state
const { data, isLoading } = useQuery()
if (isLoading) return <Skeleton />
return <div>{data.map(...)}</div>
```

**Empty State**:
```tsx
// ❌ Bad: Blank screen
{items.length === 0 ? null : items.map(...)}

// ✅ Good: Empty state
{items.length === 0 ? (
  <EmptyState 
    icon={Inbox}
    title="Henüz kayıt yok"
    description="Yeni kayıt eklemek için butona tıklayın"
    action={<Button>Yeni Ekle</Button>}
  />
) : items.map(...)}
```

## Exit Criteria

UI/UResponsive on all screen sizes (test: 375px, 768px, 1440px, 1920px)
- ✅ Loading/empty/error states present
- ✅ Keyboard navigation works
- ✅ Visual consistency maintained
- ✅ User testing shows task completion
- ✅ Works in all major web browsers (Chrome, Firefox, Safari, Edge)
- ✅ Visual consistency maintained
- ✅ User testing shows task completion
