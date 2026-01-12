---
name: page-creation
description: Next.js App Router ile yeni sayfa oluşturma. Dashboard altına yeni modül sayfası, alt sayfalar, loading/error durumları ve layout yapılandırması dahil. Türkçe UI metinleri, PageHeader, breadcrumbs ve proje yapısına uygun dosya organizasyonu sağlar.
---

# Sayfa Oluşturma Skill'i

## Amaç
Next.js App Router kullanarak proje yapısına uygun yeni sayfalar oluşturmak.

## Ne Zaman Kullanılır
- Yeni bir dashboard modülü eklenirken (ör: yeni bir yönetim sayfası)
- Mevcut modüle alt sayfa eklenirken
- Liste + detay + form sayfası yapısı gerektiğinde

## Sayfa Oluşturma Adımları

### 1. Dosya Yapısını Belirle

```
src/app/(dashboard)/
├── yeni-modul/
│   ├── page.tsx           # Ana liste sayfası
│   ├── loading.tsx        # Yükleniyor durumu
│   ├── error.tsx          # Hata durumu
│   ├── layout.tsx         # (opsiyonel) Özel layout
│   ├── [id]/
│   │   ├── page.tsx       # Detay sayfası
│   │   └── duzenle/
│   │       └── page.tsx   # Düzenleme formu
│   └── yeni/
│       └── page.tsx       # Yeni ekleme formu
```

### 2. Ana Sayfa Şablonu (Liste)

```tsx
// src/app/(dashboard)/yeni-modul/page.tsx
import { Suspense } from "react"
import { Plus } from "lucide-react"
import Link from "next/link"

import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { YeniModulList } from "@/components/features/yeni-modul/yeni-modul-list"
import { LoadingState } from "@/components/shared/loading-state"

export const metadata = {
  title: "Modül Adı | Panel",
  description: "Modül açıklaması",
}

export default function YeniModulPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Modül Başlığı"
        description="Modül açıklaması burada"
        action={
          <Button asChild>
            <Link href="/yeni-modul/yeni">
              <Plus className="mr-2 h-4 w-4" />
              Yeni Ekle
            </Link>
          </Button>
        }
      />

      <Suspense fallback={<LoadingState />}>
        <YeniModulList />
      </Suspense>
    </div>
  )
}
```

### 3. Loading Sayfası

```tsx
// src/app/(dashboard)/yeni-modul/loading.tsx
import { LoadingState } from "@/components/shared/loading-state"

export default function Loading() {
  return <LoadingState />
}
```

### 4. Error Sayfası

```tsx
// src/app/(dashboard)/yeni-modul/error.tsx
"use client"

import { useEffect } from "react"
import { AlertCircle, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[YeniModul Error]", error)
  }, [error])

  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center gap-4 pt-6 text-center">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Bir hata oluştu</h2>
            <p className="text-sm text-muted-foreground">
              Sayfa yüklenirken bir sorun oluştu. Lütfen tekrar deneyin.
            </p>
          </div>
          <Button onClick={reset} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Tekrar Dene
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
```

### 5. Detay Sayfası

```tsx
// src/app/(dashboard)/yeni-modul/[id]/page.tsx
import { notFound } from "next/navigation"
import { ArrowLeft, Edit } from "lucide-react"
import Link from "next/link"

import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { getItem } from "@/lib/mock-service"

interface Props {
  params: Promise<{ id: string }>
}

export default async function DetayPage({ params }: Props) {
  const { id } = await params
  const item = await getItem(id)

  if (!item) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={item.name}
        description="Detay bilgileri"
        action={
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/yeni-modul">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Geri
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/yeni-modul/${id}/duzenle`}>
                <Edit className="mr-2 h-4 w-4" />
                Düzenle
              </Link>
            </Button>
          </div>
        }
      />

      {/* Detay içeriği */}
    </div>
  )
}
```

## Kritik Kurallar

### ✅ MUTLAKA Yapılacaklar

1. **PageHeader kullan** - `action` prop'u (tekil, `actions` DEĞİL)
2. **Metadata ekle** - SEO ve sayfa başlığı için
3. **Loading/Error durumları** - Her modül için ayrı dosyalar
4. **Türkçe metinler** - Tüm UI metinleri Türkçe
5. **Dosya isimleri kebab-case** - `yeni-modul`, `detay-sayfa`
6. **URL'ler Türkçe** - `/uyeler`, `/bagis`, `/sosyal-yardim`

### ❌ YAPILMAYACAKLAR

1. **`actions` prop kullanma** - PageHeader'da `action` kullan
2. **Hardcoded string** - Değişkenleri ve sabitleri kullan
3. **Client component gereksiz** - Server component tercih et
4. **Loading state unutma** - Her async işlem için

## Sidebar'a Ekleme

Yeni sayfa ekledikten sonra sidebar navigation'a ekle:

```tsx
// src/components/layout/sidebar-nav.tsx içinde
const navigationItems = [
  // ... mevcut itemlar
  {
    title: "Yeni Modül",
    href: "/yeni-modul",
    icon: IconName,
  },
]
```

## Kontrol Listesi

- [ ] `page.tsx` oluşturuldu
- [ ] `loading.tsx` oluşturuldu
- [ ] `error.tsx` oluşturuldu
- [ ] PageHeader `action` prop'u doğru
- [ ] Metadata tanımlandı
- [ ] Türkçe metinler kullanıldı
- [ ] Sidebar'a eklendi
- [ ] URL kebab-case ve Türkçe
