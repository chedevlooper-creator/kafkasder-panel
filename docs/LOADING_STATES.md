# Loading States Documentation

Bu dokümantasyon, projedeki tüm loading state bileşenlerinin kullanımını, best practice'leri ve örneklerini içerir.

## İçindekiler

1. [Loading State Bileşenleri](#loading-state-bileşenleri)
2. [Skeleton Bileşenleri](#skeleton-bileşenleri)
3. [Empty State Bileşenleri](#empty-state-bileşenleri)
4. [Button Loading State](#button-loading-state)
5. [Best Practices](#best-practices)
6. [Accessibility](#accessibility)
7. [Performance Notları](#performance-notları)

---

## Loading State Bileşenleri

### LoadingState

Genel amaçlı loading state bileşeni. Spinner ve isteğe bağlı progress bar gösterir.

```tsx
import { LoadingState } from '@/components/shared/loading-state'

// Basit kullanım
<LoadingState />

// Mesaj ile
<LoadingState message="Veriler yükleniyor..." />

// Tam sayfa
<LoadingState fullPage message="Lütfen bekleyin..." />

// Progress bar ile
<LoadingState 
  showProgress={true} 
  progress={75} 
  message="Yükleniyor: 75%" 
/>

// Boyutlandırma
<LoadingState size="sm" />  // size-4
<LoadingState size="md" />  // size-8 (default)
<LoadingState size="lg" />  // size-12
```

**Props:**
- `message?: string` - Yükleme mesajı (default: "Yükleniyor...")
- `fullPage?: boolean` - Tam sayfa yükleme mi (default: false)
- `size?: 'sm' | 'md' | 'lg'` - Spinner boyutu (default: 'md')
- `showProgress?: boolean` - Progress bar göster (default: false)
- `progress?: number` - Progress değeri 0-100 (optional)

---

### PageLoadingSkeleton

Sayfa yüklenirken gösterilecek genel iskelet.

```tsx
import { PageLoadingSkeleton } from '@/components/shared/loading-state'

// Tüm bileşenleri göster
<PageLoadingSkeleton />

// Sadece header
<PageLoadingSkeleton showHeader={true} showStats={false} showTable={false} />

// Özel stat kart sayısı
<PageLoadingSkeleton statCount={6} />
```

**Props:**
- `showHeader?: boolean` - Header skeleton'ı göster (default: true)
- `showStats?: boolean` - Stat kartları göster (default: true)
- `showTable?: boolean` - Tablo skeleton'ı göster (default: true)
- `statCount?: number` - Stat kart sayısı (default: 4)

---

### TableLoadingSkeleton

Tablo yapısını taklit eden skeleton.

```tsx
import { TableLoadingSkeleton } from '@/components/shared/loading-state'

// Default
<TableLoadingSkeleton />

// Özel satır ve kolon sayısı
<TableLoadingSkeleton rows={10} columns={6} />

// Header olmadan
<TableLoadingSkeleton showHeader={false} />
```

**Props:**
- `rows?: number` - Satır sayısı (default: 5)
- `columns?: number` - Kolon sayısı (default: 4)
- `showHeader?: boolean` - Header göster (default: true)

---

### FormLoadingSkeleton

Form alanlarını taklit eden skeleton.

```tsx
import { FormLoadingSkeleton } from '@/components/shared/loading-state'

// Default
<FormLoadingSkeleton />

// Özel alan sayısı
<FormLoadingSkeleton fields={6} />

// Submit butonu olmadan
<FormLoadingSkeleton hasSubmitButton={false} />
```

**Props:**
- `fields?: number` - Form alan sayısı (default: 4)
- `hasSubmitButton?: boolean` - Submit butonu göster (default: true)

---

### ChartLoadingSkeleton

Grafik container'ı için skeleton.

```tsx
import { ChartLoadingSkeleton } from '@/components/shared/loading-state'

// Default
<ChartLoadingSkeleton />

// Özel yükseklik
<ChartLoadingSkeleton height={400} />

// Legend olmadan
<ChartLoadingSkeleton showLegend={false} />
```

**Props:**
- `height?: number` - Grafik yüksekliği px (default: 300)
- `showLegend?: boolean` - Legend göster (default: true)

---

### ListLoadingSkeleton

Liste item'ları için skeleton.

```tsx
import { ListLoadingSkeleton } from '@/components/shared/loading-state'

// Default
<ListLoadingSkeleton />

// Avatar ve badge ile
<ListLoadingSkeleton showAvatar={true} showBadge={true} />

// Özel item sayısı
<ListLoadingSkeleton items={10} />
```

**Props:**
- `items?: number` - Liste item sayısı (default: 5)
- `showAvatar?: boolean` - Avatar göster (default: false)
- `showBadge?: boolean` - Badge göster (default: false)

---

### StatCardSkeleton

İstatistik kartları için özel skeleton.

```tsx
import { StatCardSkeleton } from '@/components/shared/loading-state'

// Default
<StatCardSkeleton />

// Trend ile
<StatCardSkeleton showTrend={true} />

// Icon olmadan
<StatCardSkeleton showIcon={false} />
```

**Props:**
- `showIcon?: boolean` - Icon göster (default: true)
- `showTrend?: boolean` - Trend göster (default: false)

---

### CardLoadingSkeleton

Kart yüklenirken gösterilecek iskelet.

```tsx
import { CardLoadingSkeleton } from '@/components/shared/loading-state'

// Default
<CardLoadingSkeleton />

// Özel sayı
<CardLoadingSkeleton count={6} />

// Header ve footer olmadan
<CardLoadingSkeleton 
  showHeader={false} 
  showContent={true} 
  showFooter={false} 
/>
```

**Props:**
- `count?: number` - Kart sayısı (default: 1)
- `showHeader?: boolean` - Header göster (default: true)
- `showContent?: boolean` - Content göster (default: true)
- `showFooter?: boolean` - Footer göster (default: false)

---

## Skeleton Bileşenleri

### Skeleton

Temel skeleton bileşeni, variant ve size desteği ile.

```tsx
import { Skeleton } from '@/components/ui/skeleton'

// Default
<Skeleton />

// Variantlar
<Skeleton variant="default" />    // rounded-md
<Skeleton variant="text" />       // rounded-sm
<Skeleton variant="circular" />   // rounded-full
<Skeleton variant="rectangular" /> // rounded-none

// Boyutlar
<Skeleton size="sm" />  // h-4
<Skeleton size="md" />  // h-6
<Skeleton size="lg" />  // h-8
<Skeleton size="xl" />  // h-12

// Hız
<Skeleton speed="slow" />    // 3s
<Skeleton speed="normal" />  // 2s (default)
<Skeleton speed="fast" />    // 1.5s

// Kombinasyon
<Skeleton 
  variant="circular" 
  size="lg" 
  speed="slow" 
  className="w-16" 
/>
```

**Props:**
- `variant?: 'default' | 'text' | 'circular' | 'rectangular'` - Şekil (default: 'default')
- `size?: 'sm' | 'md' | 'lg' | 'xl'` - Yükseklik (optional)
- `speed?: 'slow' | 'normal' | 'fast'` - Animasyon hızı (default: 'normal')

---

## Empty State Bileşenleri

### EmptyState

Boş durum gösterimi için bileşen.

```tsx
import { EmptyState } from '@/components/shared/empty-state'

// Default
<EmptyState />

// Variantlar
<EmptyState variant="default" />
<EmptyState variant="search" />
<EmptyState variant="error" />
<EmptyState variant="no-data" />
<EmptyState variant="loading-error" />
<EmptyState variant="permission-denied" />
<EmptyState variant="maintenance" />

// Özel mesaj
<EmptyState 
  variant="search"
  title="Sonuç bulunamadı"
  description="Farklı arama kriterleri deneyin."
/>

// Action button ile
<EmptyState 
  variant="error"
  action={
    <Button onClick={handleRetry}>
      Tekrar Dene
    </Button>
  }
/>

// Custom illustration
<EmptyState 
  illustration={<CustomIllustration />}
  title="Özel İllüstrasyon"
/>
```

**Props:**
- `variant?: EmptyStateVariant` - Variant tipi (default: 'default')
- `title?: string` - Özel başlık
- `description?: string` - Özel açıklama
- `action?: ReactNode` - Action bileşeni
- `illustration?: ReactNode` - Custom illüstrasyon

**Variant'lar:**
- `default` - Genel boş durum
- `search` - Arama sonucu yok
- `error` - Genel hata
- `no-data` - Kayıt yok
- `loading-error` - Yükleme hatası
- `permission-denied` - Yetki yok
- `maintenance` - Bakım modu

---

## Button Loading State

Button bileşeni loading state desteği ile birlikte gelir.

```tsx
import { Button } from '@/components/ui/button'

// Basic loading
<Button loading>Kaydet</Button>

// Loading text ile
<Button 
  loading 
  loadingText="Kaydediliyor..."
>
  Kaydet
</Button>

// Variant'lar
<Button loading variant="primary">Primary</Button>
<Button loading variant="destructive">Delete</Button>
<Button loading variant="outline">Outline</Button>
```

**Props:**
- `loading?: boolean` - Loading state (default: false)
- `loadingText?: string` - Loading sırasında gösterilecek metin (optional)

**Özellikler:**
- Loading sırasında spinner gösterilir (size-5)
- Text opacity düşer (0.7)
- Subtle pulse animasyonu
- `aria-busy="true"` attribute
- `cursor-not-allowed` class

---

## Best Practices

### Ne Zaman Hangi Loading State Kullanılmalı?

```
┌─────────────────────────────────────────────────────────────┐
│                     Loading State Decision Tree              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Sayfa yükleniyor mu?                                   │
│     └─ Evet → PageLoadingSkeleton                          │
│                                                             │
│  2. Tablo yükleniyor mu?                                   │
│     └─ Evet → TableLoadingSkeleton                         │
│                                                             │
│  3. Form yükleniyor mu?                                    │
│     └─ Evet → FormLoadingSkeleton                          │
│                                                             │
│  4. Grafik yükleniyor mu?                                  │
│     └─ Evet → ChartLoadingSkeleton                         │
│                                                             │
│  5. Liste yükleniyor mu?                                   │
│     └─ Evet → ListLoadingSkeleton                          │
│                                                             │
│  6. Stat kart yükleniyor mu?                               │
│     └─ Evet → StatCardSkeleton                             │
│                                                             │
│  7. Genel loading state mi?                                │
│     └─ Evet → LoadingState (spinner + optional progress)   │
│                                                             │
│  8. Basit placeholder mı?                                  │
│     └─ Evet → Skeleton (variant/size/speed)               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Skeleton vs LoadingState

**Skeleton kullan:**
- Gerçek layout'ı biliyorsanız
- İçeriğin şeklini göstermek istiyorsanız
- Sayfa/section yüklenirken

**LoadingState kullan:**
- Genel loading durumu
- Progress göstermek istiyorsanız
- Kullanıcıya mesaj göstermek istiyorsanız

### Stagger Animasyonları

Dashboard ve listelerde stagger animasyonları kullanın:

```tsx
{items.map((item, index) => (
  <div 
    key={item.id} 
    className="stagger-item"
    style={{ animationDelay: `${index * 0.1}s` }}
  >
    {item.content}
  </div>
))}
```

---

## Accessibility

### ARIA Attributes

```tsx
// Button loading
<Button loading aria-busy="true">
  Yükleniyor
</Button>

// Loading state
<div role="status" aria-live="polite">
  <LoadingState message="Veriler yükleniyor..." />
</div>

// Empty state
<EmptyState 
  variant="error"
  role="alert"
  aria-live="assertive"
/>
```

### Keyboard Navigation

Loading state'ler keyboard navigasyonunu engellememelidir:

```tsx
// Loading sırasında interactive elementleri devre dışı bırak
{isLoading ? (
  <LoadingState />
) : (
  <InteractiveContent />
)}
```

---

## Performance Notları

### GPU Acceleration

Skeleton bileşenlerinde GPU acceleration kullanılır:

```css
.will-change-transform {
  will-change: transform;
}

.contain-layout-style-paint {
  contain: layout style paint;
}
```

### Prefers-Reduced-Motion

Tüm animasyonlar `prefers-reduced-motion` desteği içerir:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Lazy Loading

Büyük listelerde lazy loading kullanın:

```tsx
import { Suspense, lazy } from 'react'

const HeavyComponent = lazy(() => import('./HeavyComponent'))

<Suspense fallback={<LoadingState />}>
  <HeavyComponent />
</Suspense>
```

---

## Animasyonlar

### Mevcut Animasyonlar

| Animasyon | Süre | Kullanım |
|-----------|------|----------|
| `skeleton-shimmer` | 2s | Skeleton gradient efekti |
| `skeleton-pulse` | 2s | Button loading |
| `skeleton-wave` | - | Alternatif shimmer |
| `fadeInUp` | 0.3s | Empty state fade-in |
| `bounceSubtle` | 2s | Icon bounce |
| `pageFadeIn` | 0.15s | Sayfa fade-in |

### Custom Animasyon

```tsx
// Tailwind arbitrary values ile
<div className="animate-[customName_1s_ease-in-out_infinite]" />

// CSS'de tanımla
@keyframes customName {
  0% { /* start */ }
  100% { /* end */ }
}
```

---

## Örnekler

### Dashboard Loading

```tsx
function DashboardPage() {
  const { data, isLoading } = useDashboardStats()

  if (isLoading) {
    return (
      <div className="spacing-section animate-in">
        <PageLoadingSkeleton statCount={3} />
      </div>
    )
  }

  return <DashboardContent data={data} />
}
```

### DataTable Loading

```tsx
function UserTable() {
  const { data, isLoading } = useUsers()

  return (
    <DataTable
      data={data || []}
      columns={columns}
      isLoading={isLoading}
    />
  )
}
```

### Form Loading

```tsx
function UserForm() {
  const { mutate, isPending } = useCreateUser()

  return (
    <form onSubmit={handleSubmit}>
      <FormLoadingSkeleton fields={4} hasSubmitButton={true} />
      
      <Button type="submit" loading={isPending} loadingText="Kaydediliyor...">
        Kaydet
      </Button>
    </form>
  )
}
```

---

## Troubleshooting

### Skeleton'lar görünmüyor

**Sorun:** Skeleton'lar render olmuyor

**Çözüm:**
- `bg-accent` class'ının tanımlı olduğundan emin olun
- Parent container'ın yüksekliği olduğundan emin olun

### Animasyonlar çok hızlı/yavaş

**Sorun:** Animasyon hızı uygun değil

**Çözüm:**
```tsx
// Skeleton hızını ayarla
<Skeleton speed="slow" />    // 3s
<Skeleton speed="normal" />  // 2s
<Skeleton speed="fast" />    // 1.5s
```

### Loading state kaybolmuyor

**Sorun:** Loading state sonsuza kadar kalıyor

**Çözüm:**
- `isLoading` state'i doğru güncellendiğinden emin olun
- Error handling ekleyin

---

## Kaynaklar

- [Tailwind CSS Animations](https://tailwindcss.com/docs/animation)
- [Radix UI Loading States](https://www.radix-ui.com/docs/primitives/components/dialog)
- [WCAG Loading States](https://www.w3.org/WAI/ARIA/apg/patterns/alert/)
