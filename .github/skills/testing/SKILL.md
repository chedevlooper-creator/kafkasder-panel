---
name: testing
description: Jest + React Testing Library ile unit/integration testleri ve Playwright ile E2E testleri yazma. Test patterns, mocking, coverage hedefleri ve proje test conventions'ı. Component, hook ve utility testleri için şablonlar.
---

# Test Yazma Skill'i

## Amaç
Proje test standartlarına uygun unit, integration ve E2E testleri yazmak.

## Ne Zaman Kullanılır
- Yeni component/hook/utility eklendikten sonra
- Bug fix sonrası regression testi
- Kritik user flow'lar için E2E testi
- PR öncesi test coverage kontrolü

## Test Türleri ve Araçlar

| Tür | Araç | Konum | Komut |
|-----|------|-------|-------|
| Unit | Jest + RTL | `src/**/*.test.{ts,tsx}` | `npm run test` |
| E2E | Playwright | `tests/*.spec.ts` | `npm run test:e2e` |

## 1. Component Test Şablonu

```tsx
// src/components/features/members/member-card.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { MemberCard } from "./member-card"
import type { Member } from "@/types"

// Mock data
const mockMember: Member = {
  id: "1",
  name: "Ahmet Yılmaz",
  email: "ahmet@example.com",
  phone: "5551234567",
  memberType: "active",
  createdAt: new Date().toISOString(),
}

// Mock handlers
const mockOnEdit = jest.fn()
const mockOnDelete = jest.fn()

describe("MemberCard", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("üye bilgilerini doğru gösterir", () => {
    render(<MemberCard member={mockMember} />)

    expect(screen.getByText("Ahmet Yılmaz")).toBeInTheDocument()
    expect(screen.getByText("ahmet@example.com")).toBeInTheDocument()
    expect(screen.getByText("5551234567")).toBeInTheDocument()
  })

  it("avatar initials doğru hesaplanır", () => {
    render(<MemberCard member={mockMember} />)

    expect(screen.getByText("AY")).toBeInTheDocument()
  })

  it("düzenle butonu onEdit handler'ı çağırır", async () => {
    const user = userEvent.setup()
    render(
      <MemberCard
        member={mockMember}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    // Menüyü aç
    await user.click(screen.getByRole("button", { name: /menü/i }))
    
    // Düzenle'ye tıkla
    await user.click(screen.getByText("Düzenle"))

    expect(mockOnEdit).toHaveBeenCalledWith(mockMember)
  })

  it("sil butonu onDelete handler'ı çağırır", async () => {
    const user = userEvent.setup()
    render(
      <MemberCard
        member={mockMember}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    await user.click(screen.getByRole("button", { name: /menü/i }))
    await user.click(screen.getByText("Sil"))

    await waitFor(() => {
      expect(mockOnDelete).toHaveBeenCalledWith(mockMember)
    })
  })

  it("email yoksa email bölümü gösterilmez", () => {
    const memberWithoutEmail = { ...mockMember, email: null }
    render(<MemberCard member={memberWithoutEmail} />)

    expect(screen.queryByText("ahmet@example.com")).not.toBeInTheDocument()
  })
})
```

## 2. Hook Test Şablonu

```tsx
// src/hooks/use-debounce.test.ts
import { renderHook, act } from "@testing-library/react"
import { useDebounce } from "./use-debounce"

describe("useDebounce", () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it("değeri belirtilen süre sonra döndürür", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "initial", delay: 500 } }
    )

    expect(result.current).toBe("initial")

    // Değeri değiştir
    rerender({ value: "updated", delay: 500 })

    // Hemen değişmemeli
    expect(result.current).toBe("initial")

    // Zamanı ilerlet
    act(() => {
      jest.advanceTimersByTime(500)
    })

    // Şimdi değişmeli
    expect(result.current).toBe("updated")
  })

  it("hızlı değişimlerde sadece son değeri alır", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "a" } }
    )

    rerender({ value: "ab" })
    act(() => jest.advanceTimersByTime(100))

    rerender({ value: "abc" })
    act(() => jest.advanceTimersByTime(100))

    rerender({ value: "abcd" })
    act(() => jest.advanceTimersByTime(300))

    expect(result.current).toBe("abcd")
  })
})
```

## 3. Utility Test Şablonu

```tsx
// src/lib/utils.test.ts
import { cn, formatCurrency, formatDate } from "./utils"

describe("cn (className merger)", () => {
  it("class'ları birleştirir", () => {
    expect(cn("foo", "bar")).toBe("foo bar")
  })

  it("conditional class'ları destekler", () => {
    expect(cn("base", false && "hidden", true && "visible")).toBe("base visible")
  })

  it("Tailwind conflict'lerini çözer", () => {
    expect(cn("px-2", "px-4")).toBe("px-4")
  })
})

describe("formatCurrency", () => {
  it("Türk Lirası formatında gösterir", () => {
    expect(formatCurrency(1234.56)).toBe("₺1.234,56")
  })

  it("negatif değerleri doğru formatlar", () => {
    expect(formatCurrency(-500)).toBe("-₺500,00")
  })

  it("sıfır değerini gösterir", () => {
    expect(formatCurrency(0)).toBe("₺0,00")
  })
})

describe("formatDate", () => {
  it("Türkçe tarih formatı döndürür", () => {
    const date = new Date("2024-01-15")
    expect(formatDate(date)).toBe("15 Ocak 2024")
  })
})
```

## 4. E2E Test Şablonu (Playwright)

```typescript
// tests/members.spec.ts
import { test, expect } from "@playwright/test"

test.describe("Üyeler Sayfası", () => {
  test.beforeEach(async ({ page }) => {
    // Login işlemi
    await page.goto("/giris")
    await page.fill('input[name="email"]', "test@example.com")
    await page.fill('input[name="password"]', "password123")
    await page.click('button[type="submit"]')
    await page.waitForURL("/genel")

    // Üyeler sayfasına git
    await page.goto("/uyeler")
  })

  test("üye listesi yüklenir", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Üyeler" })).toBeVisible()
    await expect(page.getByTestId("members-table")).toBeVisible()
  })

  test("yeni üye eklenebilir", async ({ page }) => {
    // Yeni ekle butonuna tıkla
    await page.click('text="Yeni Üye"')
    await page.waitForURL("/uyeler/yeni")

    // Formu doldur
    await page.fill('input[name="name"]', "Test Üye")
    await page.fill('input[name="email"]', "test.uye@example.com")
    await page.fill('input[name="phone"]', "5551234567")
    await page.selectOption('select[name="memberType"]', "active")

    // Kaydet
    await page.click('button[type="submit"]')

    // Başarı kontrolü
    await expect(page.getByText("Üye başarıyla eklendi")).toBeVisible()
  })

  test("üye aranabilir", async ({ page }) => {
    await page.fill('input[placeholder*="Ara"]', "Ahmet")

    // Sonuçların filtrelenmesini bekle
    await expect(page.getByText("Ahmet")).toBeVisible()
  })

  test("mobil görünümde çalışır", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })

    await expect(page.getByRole("heading", { name: "Üyeler" })).toBeVisible()
    // Hamburger menü kontrolü
    await expect(page.getByRole("button", { name: /menü/i })).toBeVisible()
  })
})
```

## Mocking Patterns

### API Mocking

```tsx
// Jest - TanStack Query hooks
jest.mock("@/hooks/use-api", () => ({
  useMembers: () => ({
    data: [mockMember],
    isLoading: false,
    error: null,
  }),
  useCreateMember: () => ({
    mutate: jest.fn(),
    isPending: false,
  }),
}))
```

### Next.js Router Mocking

```tsx
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => "/uyeler",
  useSearchParams: () => new URLSearchParams(),
}))
```

## Test Komutları

```bash
# Tüm testleri çalıştır
npm run test

# Watch mode
npm run test:watch

# Coverage raporu
npm run test:coverage

# Tek dosya
npm test -- member-card.test.tsx

# Pattern ile
npm test -- --testPathPattern="members"

# E2E testleri
npm run test:e2e

# E2E UI mode (debug için)
npm run test:e2e:ui
```

## Coverage Hedefleri

| Metrik | Minimum |
|--------|---------|
| Branches | 50% |
| Functions | 50% |
| Lines | 50% |
| Statements | 50% |

## Kontrol Listesi

- [ ] describe/it yapısı kullanıldı
- [ ] beforeEach'te mock'lar temizlendi
- [ ] Türkçe test açıklamaları
- [ ] userEvent async kullanımı
- [ ] waitFor async assertions için
- [ ] Edge case'ler test edildi
- [ ] Error state'leri test edildi
- [ ] Loading state'leri test edildi
- [ ] Accessibility (role, name) query'leri
