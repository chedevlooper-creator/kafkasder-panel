---
name: code-review
description: |
  Kod kalitesi, TypeScript, React 19/Next.js 16 patterns, ESLint 9, Tailwind 4, 
  TanStack Query 5, Zustand 5, Zod 4 uyumluluğu ve proje konvansiyonları kontrolü.
  Activate: "Review my code", "Kod kalitesini kontrol et", "Code review yap"
---

# Code Review Skill

Otomatik kod inceleme ve kalite kontrolü. Next.js 16, React 19 ve modern tooling best practices.

## Activation Triggers

- "Review my code" / "Kod kalitesini kontrol et"
- "Code review yap"
- "Commit öncesi kontrol"
- "PR için review"
- "Kalite kontrolü"

## Quick Commands

```bash
# Tüm kontrolleri çalıştır
npm run lint && npm run type-check && npm run format:check && npm run test

# Otomatik düzelt
npm run lint:fix && npm run format

# Bundle analizi
npm run build:analyze
```

---

## 1. TypeScript Kontrolü

### Strict Mode Compliance

```bash
npm run type-check
```

**Kontrol Noktaları:**

- [ ] `any` tipi kullanılmıyor (zorunlu ise `// eslint-disable-next-line` ile açıklama)
- [ ] Tüm fonksiyonlar return type belirtmiş
- [ ] Props için interface tanımlanmış
- [ ] `unknown` yerine spesifik tipler kullanılmış
- [ ] Generic tipler uygun şekilde constraint edilmiş

**Yaygın Hatalar:**

```tsx
// ❌ YANLIŞ
const handleClick = (e) => {}; // any implicit
const data: any = fetchData();
function process(items) {}

// ✅ DOĞRU
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {};
const data: UserData = fetchData();
function process(items: Item[]): ProcessedItem[] {}
```

### Unused Variables (tsconfig.json'da aktif)

```json
{
  "noUnusedLocals": true,
  "noUnusedParameters": true
}
```

**ESLint Kuralı:**

```typescript
// Underscore prefix ile ignore
const { data, _unusedField } = response;
function handler(_event: Event) {}
```

---

## 2. ESLint 9 Flat Config

### Mevcut Kurallar (eslint.config.mjs)

| Kural                                | Seviye | Açıklama                  |
| ------------------------------------ | ------ | ------------------------- |
| `react-hooks/rules-of-hooks`         | error  | Hook kuralları zorunlu    |
| `react-hooks/exhaustive-deps`        | warn   | Dependency array kontrolü |
| `@typescript-eslint/no-unused-vars`  | error  | `_` prefix hariç          |
| `@typescript-eslint/no-explicit-any` | warn   | `any` kullanımı uyarı     |
| `no-constant-binary-expression`      | warn   | Sabit ifade kontrolü      |

```bash
# Lint kontrolü
npm run lint

# Otomatik düzelt
npm run lint:fix
```

### Hook Kuralları Kontrolü

```tsx
// ❌ YANLIŞ - Conditional hook
if (condition) {
  const [state, setState] = useState();
}

// ❌ YANLIŞ - Eksik dependency
useEffect(() => {
  fetchData(userId);
}, []); // userId eksik

// ✅ DOĞRU
const [state, setState] = useState();
useEffect(() => {
  fetchData(userId);
}, [userId]);
```

---

## 3. React 19 Best Practices

### Server vs Client Components

```tsx
// Server Component (default) - src/app/**/page.tsx
// Hiçbir directive yok, async olabilir
export default async function Page() {
  const data = await fetchData();
  return <div>{data}</div>;
}

// Client Component - interactive, hooks, browser APIs
("use client");
export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount((c) => c + 1)}>{count}</button>;
}
```

**'use client' Gerektiren Durumlar:**

- [ ] `useState`, `useEffect`, `useContext` kullanımı
- [ ] Event handlers (`onClick`, `onChange`, vb.)
- [ ] Browser APIs (`window`, `document`, `localStorage`)
- [ ] Third-party client libraries

### React 19 Yeni Özellikler

```tsx
// ✅ use() hook - Promise/Context okuma
import { use } from "react";

function Component({ dataPromise }) {
  const data = use(dataPromise); // Suspense ile çalışır
  return <div>{data}</div>;
}

// ✅ Actions - Form işleme
async function submitAction(formData: FormData) {
  "use server";
  // Server-side işlem
}

// ✅ useOptimistic - Optimistic UI
const [optimisticItems, addOptimisticItem] = useOptimistic(
  items,
  (state, newItem) => [...state, newItem],
);

// ✅ useFormStatus - Form durumu
import { useFormStatus } from "react-dom";
function SubmitButton() {
  const { pending } = useFormStatus();
  return <button disabled={pending}>Submit</button>;
}
```

---

## 4. Next.js 16 Patterns

### App Router Yapısı

```
src/app/
├── layout.tsx          # Root layout
├── page.tsx            # Home page
├── loading.tsx         # Loading UI
├── error.tsx           # Error boundary
├── not-found.tsx       # 404 page
└── (dashboard)/        # Route group
    ├── layout.tsx      # Dashboard layout
    └── members/
        ├── page.tsx    # /members
        ├── [id]/       # Dynamic route
        │   └── page.tsx
        └── loading.tsx
```

### Metadata API

```tsx
// Static metadata
export const metadata: Metadata = {
  title: "Sayfa Başlığı",
  description: "Sayfa açıklaması",
};

// Dynamic metadata
export async function generateMetadata({ params }): Promise<Metadata> {
  return { title: `Üye: ${params.id}` };
}
```

### Loading & Error States

```tsx
// loading.tsx
export default function Loading() {
  return <LoadingState />;
}

// error.tsx
("use client");
export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Bir hata oluştu</h2>
      <button onClick={reset}>Tekrar dene</button>
    </div>
  );
}
```

---

## 5. Proje Konvansiyonları

### Component Props API

```tsx
// PageHeader - action (TEKİL, actions DEĞİL)
<PageHeader
  title="Üyeler"
  description="Tüm üyeleri görüntüle"
  action={<Button>Yeni Üye</Button>}
/>

// StatCard
<StatCard
  label="Toplam Üye"
  value={1250}
  icon={Users}
  trend={{ value: 12, isPositive: true }}
  variant="default"
/>

// EmptyState
<EmptyState
  icon={FileQuestion}
  title="Kayıt bulunamadı"
  description="Henüz kayıt eklenmemiş"
  action={<Button>Ekle</Button>}
/>

// QueryError (API hataları için)
<QueryError error={error} onRetry={refetch} />
```

### Import Sıralaması

```tsx
// 1. React/Next.js
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// 2. Third-party
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

// 3. Internal - absolute paths
import { Button } from "@/components/ui/button";
import { useApi } from "@/hooks/use-api";
import { cn } from "@/lib/utils";

// 4. Types
import type { Member } from "@/types";

// 5. Relative (aynı modül içi)
import { columns } from "./columns";
```

### Dosya İsimlendirme

| Tür                 | Format                   | Örnek             |
| ------------------- | ------------------------ | ----------------- |
| Component dosyaları | kebab-case               | `member-form.tsx` |
| Component isimleri  | PascalCase               | `MemberForm`      |
| Hook dosyaları      | kebab-case + use- prefix | `use-members.ts`  |
| Utility dosyaları   | kebab-case               | `format-date.ts`  |
| Constants           | UPPER_SNAKE_CASE         | `MAX_FILE_SIZE`   |

---

## 6. State Management

### Zustand (Global State)

```tsx
// src/stores/user-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    { name: "user-storage" },
  ),
);
```

### TanStack Query 5 (Server State)

```tsx
// src/hooks/use-api.ts pattern
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Query with proper typing
export function useMembers() {
  return useQuery({
    queryKey: ["members"],
    queryFn: fetchMembers,
    staleTime: 5 * 60 * 1000, // 5 dakika
  });
}

// Mutation with optimistic update
export function useCreateMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMember,
    onMutate: async (newMember) => {
      await queryClient.cancelQueries({ queryKey: ["members"] });
      const previous = queryClient.getQueryData(["members"]);
      queryClient.setQueryData(["members"], (old) => [...old, newMember]);
      return { previous };
    },
    onError: (err, newMember, context) => {
      queryClient.setQueryData(["members"], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });
}
```

---

## 7. Form Validation (Zod 4 + React Hook Form)

```tsx
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Schema tanımı
const memberSchema = z.object({
  name: z.string().min(2, "Ad en az 2 karakter olmalı"),
  email: z.string().email("Geçerli bir e-posta giriniz"),
  phone: z.string().regex(/^[0-9]{10,11}$/, "Geçerli telefon numarası giriniz"),
  birthDate: z.date().optional(),
});

type MemberFormData = z.infer<typeof memberSchema>;

// Form kullanımı
function MemberForm() {
  const form = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = (data: MemberFormData) => {
    // handle submit
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>{/* Form fields */}</form>
    </Form>
  );
}
```

---

## 8. Tailwind CSS 4

### Class Sıralaması (prettier-plugin-tailwindcss)

```tsx
// Otomatik sıralama: Layout → Spacing → Sizing → Typography → Visual → States
<div className="flex items-center gap-4 p-4 text-sm font-medium text-gray-900 bg-white rounded-lg shadow-md hover:bg-gray-50" />
```

### Responsive Design

```tsx
// Mobile-first approach
<div className="
  flex flex-col        // Mobile: dikey
  md:flex-row          // Tablet+: yatay
  lg:gap-8             // Desktop: daha geniş gap
">
```

### Dark Mode

```tsx
// next-themes ile
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
```

### cn() Utility

```tsx
import { cn } from "@/lib/utils";

// Conditional classes
<button
  className={cn(
    "px-4 py-2 rounded",
    isActive && "bg-primary text-white",
    disabled && "opacity-50 cursor-not-allowed",
  )}
/>;
```

---

## 9. Testing Checklist

```bash
# Unit tests
npm run test

# Coverage report
npm run test:coverage

# E2E tests
npm run test:e2e
```

**Test Coverage Hedefleri:**

- [ ] Utility fonksiyonları: %100
- [ ] Custom hooks: %80+
- [ ] Components: %70+
- [ ] Critical flows: E2E testleri

---

## 10. Security Checklist

- [ ] `.env` dosyaları commit edilmemiş
- [ ] API keys hardcoded değil
- [ ] `console.log` ile sensitive data yazılmıyor
- [ ] User input sanitize ediliyor
- [ ] SQL injection koruması (Supabase RLS)
- [ ] XSS koruması (React otomatik escape)

---

## Review Process

### 1. Otomatik Kontroller

```bash
# Tüm kontrolleri çalıştır
npm run lint && npm run type-check && npm run format:check
```

### 2. Manuel Kontrol Listesi

- [ ] TypeScript strict compliance
- [ ] ESLint hatasız
- [ ] 'use client' directive doğru kullanılmış
- [ ] Import sıralaması doğru
- [ ] Component API'leri doğru (PageHeader action prop, vb.)
- [ ] Loading/Error states var
- [ ] Türkçe UI metinleri

### 3. Review Çıktısı Formatı

```markdown
## Code Review Özeti

### ✅ İyi Yapılmış

- TypeScript tipleri eksiksiz
- Error handling düzgün
- Testler eklenmiş

### ⚠️ Öneriler

- `useMemo` ile memoization düşünülebilir
- Loading state eklenebilir

### ❌ Düzeltilmeli

- `'use client'` eksik (useState kullanılıyor)
- PageHeader `actions` yerine `action` olmalı
- Import sıralaması yanlış
```

---

## Otomatik Düzeltmeler

Review sonrası şunları otomatik düzeltebilirim:

1. **Import sıralaması** - Manuel düzenleme
2. **'use client' ekleme** - Eksik yerlere ekleme
3. **Prop isimleri** - Doğru API'ye güncelleme
4. **Formatting** - `npm run format`
5. **Lint fixes** - `npm run lint:fix`

---

## Exit Criteria

Kod commit'e hazır olduğunda:

- ✅ `npm run lint` - Hatasız
- ✅ `npm run type-check` - Hatasız
- ✅ `npm run format:check` - Hatasız
- ✅ `npm run test` - Tüm testler geçiyor
- ✅ Manuel checklist tamamlandı
