---
name: performance
description: |
  Next.js/React performans analizi ve optimizasyonu. Bundle size analizi, 
  lazy loading, memoization, re-render önleme, Core Web Vitals iyileştirme,
  API response caching ve database query optimizasyonu.
  Activate: "Performans analizi yap" veya "Optimize performance"
---

# Performance Analysis & Optimization

Bu skill, Next.js/React uygulamalarında performans sorunlarını tespit eder ve optimize eder.

## Activation Triggers

- "Performans analizi yap"
- "Sayfa yavaş"
- "Optimize et"
- "Bundle size küçült"
- "Re-render problemi"
- "Core Web Vitals"

## Analysis Checklist

### 1. Bundle Size Analysis

```bash
# Bundle analyzer
npm run build
npx @next/bundle-analyzer

# Veya package.json'a ekle:
# "analyze": "ANALYZE=true next build"
```

**Kontrol noktaları:**

- [ ] Büyük kütüphaneler (lodash, moment.js) → alternatifler kullan
- [ ] Kullanılmayan exports → tree-shaking kontrol
- [ ] Dynamic imports kullanılıyor mu?
- [ ] `optimizePackageImports` listesi güncel mi?

### 2. Component Performance

**Re-render Detection:**

```tsx
// React DevTools Profiler kullan veya:
import { useEffect, useRef } from "react";

function useRenderCount(componentName: string) {
  const renderCount = useRef(0);
  useEffect(() => {
    renderCount.current++;
    console.log(`[${componentName}] render #${renderCount.current}`);
  });
}
```

**Memoization Checklist:**

- [ ] `React.memo()` - Props değişmediğinde re-render önle
- [ ] `useMemo()` - Expensive hesaplamalar için
- [ ] `useCallback()` - Event handler'lar için
- [ ] Stable references - Object/array props inline olmasın

**Anti-patterns:**

```tsx
// ❌ YANLIŞ - Her render'da yeni object
<Component style={{ color: "red" }} />
<Component data={items.filter(x => x.active)} />
<Component onClick={() => handleClick(id)} />

// ✅ DOĞRU - Memoized
const style = useMemo(() => ({ color: "red" }), [])
const activeItems = useMemo(() => items.filter(x => x.active), [items])
const handleItemClick = useCallback(() => handleClick(id), [id])
```

### 3. Data Fetching Optimization

**TanStack Query Best Practices:**

```tsx
// ✅ Stale time ayarla - gereksiz refetch önle
const { data } = useQuery({
  queryKey: ["members"],
  queryFn: fetchMembers,
  staleTime: 5 * 60 * 1000, // 5 dakika
  gcTime: 30 * 60 * 1000, // 30 dakika cache
});

// ✅ Prefetch - sayfa geçişlerinde
const prefetchMembers = () => {
  queryClient.prefetchQuery({
    queryKey: ["members"],
    queryFn: fetchMembers,
  });
};

// ✅ Placeholder data - instant UI
const { data } = useQuery({
  queryKey: ["member", id],
  queryFn: () => fetchMember(id),
  placeholderData: () => {
    return queryClient.getQueryData(["members"])?.find((m) => m.id === id);
  },
});
```

### 4. Image Optimization

```tsx
// ✅ Next.js Image component
import Image from "next/image";

<Image
  src="/photo.jpg"
  alt="Description"
  width={800}
  height={600}
  loading="lazy" // Viewport dışındakiler lazy
  priority={isAboveFold} // LCP için priority
  placeholder="blur" // Blur placeholder
  sizes="(max-width: 768px) 100vw, 50vw"
/>;
```

### 5. Code Splitting & Lazy Loading

```tsx
// ✅ Dynamic import - büyük componentler için
import dynamic from "next/dynamic";

const HeavyChart = dynamic(
  () => import("@/components/features/charts/heavy-chart"),
  {
    loading: () => <Skeleton className="h-64" />,
    ssr: false, // Client-only component
  },
);

// ✅ Route-based splitting (Next.js otomatik yapar)
// Her page.tsx ayrı chunk olur

// ✅ Conditional loading
const AdminPanel = dynamic(() => import("./admin-panel"), {
  loading: () => null,
});

{
  isAdmin && <AdminPanel />;
}
```

### 6. Core Web Vitals

| Metrik                             | Hedef   | Nasıl Ölçülür                       |
| ---------------------------------- | ------- | ----------------------------------- |
| **LCP** (Largest Contentful Paint) | < 2.5s  | Ana içerik ne kadar hızlı görünüyor |
| **FID** (First Input Delay)        | < 100ms | İlk etkileşime yanıt süresi         |
| **CLS** (Cumulative Layout Shift)  | < 0.1   | Görsel stabilite                    |
| **TTFB** (Time to First Byte)      | < 800ms | Server response süresi              |
| **FCP** (First Contentful Paint)   | < 1.8s  | İlk içerik görünme süresi           |

**Ölçüm:**

```tsx
// src/app/web-vitals.tsx zaten mevcut
// Console'da [Web Vital] loglarını kontrol et
```

### 7. Database & API Optimization

**Supabase Query Optimization:**

```typescript
// ❌ N+1 Query problemi
const members = await supabase.from("members").select("*");
for (const member of members) {
  const donations = await supabase
    .from("donations")
    .select("*")
    .eq("member_id", member.id);
}

// ✅ Join ile tek query
const { data } = await supabase.from("members").select(`
    *,
    donations (*)
  `);

// ✅ Sadece gerekli alanları seç
const { data } = await supabase
  .from("members")
  .select("id, name, email")
  .limit(20);

// ✅ Pagination
const { data } = await supabase.from("members").select("*").range(0, 19); // İlk 20 kayıt
```

### 8. Rendering Strategy

| Strateji              | Ne Zaman               | Örnek                        |
| --------------------- | ---------------------- | ---------------------------- |
| **SSG** (Static)      | Değişmeyen içerik      | `/giris`, `/hakkinda`        |
| **ISR** (Incremental) | Seyrek değişen         | Blog, ürün listesi           |
| **SSR** (Server)      | Her istekte farklı     | Kişiselleştirilmiş dashboard |
| **CSR** (Client)      | Etkileşimli, real-time | Chat, canlı veri             |

```tsx
// ISR - Her 60 saniyede revalidate
export const revalidate = 60;

// Force dynamic
export const dynamic = "force-dynamic";

// Force static
export const dynamic = "force-static";
```

## Quick Fixes

### Yavaş Sayfa Geçişleri

```tsx
// 1. Link prefetch
import Link from "next/link"
<Link href="/page" prefetch={true}>Go</Link>

// 2. Router prefetch
const router = useRouter()
router.prefetch("/page")

// 3. Suspense boundary
<Suspense fallback={<Loading />}>
  <SlowComponent />
</Suspense>
```

### Yavaş İlk Yükleme

```tsx
// 1. Critical CSS inline
// 2. Font optimization
import { Inter } from "next/font/google"
const inter = Inter({
  subsets: ["latin"],
  display: "swap", // FOUT yerine FOIT önle
})

// 3. Script defer
<Script src="analytics.js" strategy="lazyOnload" />
```

### Memory Leak

```tsx
// ✅ Cleanup subscriptions
useEffect(() => {
  const subscription = subscribe();
  return () => subscription.unsubscribe();
}, []);

// ✅ AbortController for fetch
useEffect(() => {
  const controller = new AbortController();
  fetch(url, { signal: controller.signal });
  return () => controller.abort();
}, [url]);
```

## Performance Monitoring

### Development

```bash
# React DevTools Profiler
# - Components tab > Profiler
# - Record interactions
# - Analyze flame graph

# Next.js build analysis
npm run build
# Check route sizes in output
```

### Production

```typescript
// Sentry performance monitoring (zaten kurulu)
import * as Sentry from "@sentry/nextjs";

Sentry.startSpan({ name: "expensive-operation" }, () => {
  // tracked code
});
```

## Optimization Priority

1. **High Impact, Low Effort**
   - `staleTime` ekle query'lere
   - Unused imports temizle
   - Image component kullan

2. **High Impact, Medium Effort**
   - Dynamic imports
   - React.memo critical components
   - Virtualization for long lists

3. **Medium Impact**
   - useMemo/useCallback
   - Prefetching
   - Service worker

## Project-Specific Notes

- **Bundle**: `lucide-react` tree-shaking için `optimizePackageImports`'ta
- **Charts**: `recharts` lazy load edilmeli (`lazy-chart.tsx` mevcut)
- **Tables**: TanStack Table virtualizer eklenebilir
- **Mock Data**: Dev'de network delay simülasyonu kapatılabilir
