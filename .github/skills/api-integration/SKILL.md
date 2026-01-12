---
name: api-integration
description: TanStack Query ile API entegrasyonu. Custom hooks, query/mutation patterns, caching strategies, error handling ve optimistic updates. Supabase service fonksiyonları ve mock service kullanımı.
---

# API Entegrasyonu Skill'i

## Amaç
TanStack Query kullanarak API çağrıları için custom hooks oluşturmak ve veri yönetimini sağlamak.

## Ne Zaman Kullanılır
- Yeni bir API endpoint'i entegre edilecekse
- CRUD işlemleri için hooks gerekiyorsa
- Cache stratejisi belirlenecekse
- Optimistic updates eklenecekse

## Proje Yapısı

```
src/
├── hooks/
│   └── use-api.ts           # Tüm API hooks'ları
├── lib/
│   ├── mock-service.ts      # Development mock service
│   └── supabase-service.ts  # Production Supabase service
└── providers/
    └── query-provider.tsx   # TanStack Query provider
```

## 1. Query Hook Şablonu (Veri Çekme)

```tsx
// src/hooks/use-api.ts içine ekle

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { mockService } from "@/lib/mock-service"
import type { Member, CreateMemberInput, UpdateMemberInput } from "@/types"

// Query Keys - Tutarlılık için sabitler
export const queryKeys = {
  members: ["members"] as const,
  member: (id: string) => ["members", id] as const,
  membersByType: (type: string) => ["members", "type", type] as const,
  donations: ["donations"] as const,
  donation: (id: string) => ["donations", id] as const,
  dashboardStats: ["dashboard", "stats"] as const,
}

// ============ MEMBERS ============

// Tüm üyeleri getir
export function useMembers(options?: { type?: string; search?: string }) {
  return useQuery({
    queryKey: options?.type
      ? queryKeys.membersByType(options.type)
      : queryKeys.members,
    queryFn: () => mockService.getMembers(options),
    staleTime: 5 * 60 * 1000, // 5 dakika
  })
}

// Tek üye getir
export function useMember(id: string) {
  return useQuery({
    queryKey: queryKeys.member(id),
    queryFn: () => mockService.getMember(id),
    enabled: !!id, // id yoksa çalıştırma
  })
}

// Üye oluştur
export function useCreateMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateMemberInput) => mockService.createMember(data),
    onSuccess: () => {
      // Cache'i invalidate et
      queryClient.invalidateQueries({ queryKey: queryKeys.members })
    },
    onError: (error) => {
      console.error("[useCreateMember Error]", error)
    },
  })
}

// Üye güncelle
export function useUpdateMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMemberInput }) =>
      mockService.updateMember(id, data),
    onSuccess: (_, { id }) => {
      // Hem liste hem detay cache'ini güncelle
      queryClient.invalidateQueries({ queryKey: queryKeys.members })
      queryClient.invalidateQueries({ queryKey: queryKeys.member(id) })
    },
  })
}

// Üye sil
export function useDeleteMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => mockService.deleteMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.members })
    },
  })
}
```

## 2. Optimistic Update Pattern

```tsx
export function useUpdateMemberOptimistic() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMemberInput }) =>
      mockService.updateMember(id, data),

    // Mutation başlamadan önce
    onMutate: async ({ id, data }) => {
      // Devam eden query'leri iptal et
      await queryClient.cancelQueries({ queryKey: queryKeys.member(id) })

      // Önceki değeri sakla
      const previousMember = queryClient.getQueryData(queryKeys.member(id))

      // Optimistic update
      queryClient.setQueryData(queryKeys.member(id), (old: Member) => ({
        ...old,
        ...data,
      }))

      // Rollback için context döndür
      return { previousMember }
    },

    // Hata durumunda rollback
    onError: (err, { id }, context) => {
      if (context?.previousMember) {
        queryClient.setQueryData(queryKeys.member(id), context.previousMember)
      }
      console.error("[useUpdateMember Error]", err)
    },

    // Başarı veya hata sonrası cache'i yenile
    onSettled: (_, __, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.member(id) })
    },
  })
}
```

## 3. Component'te Kullanım

```tsx
// src/components/features/members/member-list.tsx
"use client"

import { useMembers, useDeleteMember } from "@/hooks/use-api"
import { LoadingState } from "@/components/shared/loading-state"
import { EmptyState } from "@/components/shared/empty-state"
import { QueryError } from "@/components/shared/query-error"
import { MemberCard } from "./member-card"
import { Users } from "lucide-react"
import { toast } from "sonner"

export function MemberList() {
  const { data: members, isLoading, error, refetch } = useMembers()
  const deleteMember = useDeleteMember()

  const handleDelete = async (id: string) => {
    try {
      await deleteMember.mutateAsync(id)
      toast.success("Üye başarıyla silindi")
    } catch {
      toast.error("Üye silinirken bir hata oluştu")
    }
  }

  // Loading state
  if (isLoading) {
    return <LoadingState />
  }

  // Error state
  if (error) {
    return (
      <QueryError
        title="Üyeler yüklenemedi"
        message="Veriler alınırken bir hata oluştu."
        onRetry={refetch}
      />
    )
  }

  // Empty state
  if (!members?.length) {
    return (
      <EmptyState
        icon={Users}
        title="Henüz üye yok"
        description="İlk üyenizi ekleyerek başlayın."
      />
    )
  }

  // Data state
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {members.map((member) => (
        <MemberCard
          key={member.id}
          member={member}
          onDelete={() => handleDelete(member.id)}
        />
      ))}
    </div>
  )
}
```

## 4. Infinite Query (Sayfalama)

```tsx
export function useMembersInfinite(pageSize = 20) {
  return useInfiniteQuery({
    queryKey: [...queryKeys.members, "infinite"],
    queryFn: ({ pageParam = 0 }) =>
      mockService.getMembers({ offset: pageParam, limit: pageSize }),
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length < pageSize) return undefined
      return pages.length * pageSize
    },
    initialPageParam: 0,
  })
}

// Kullanım
function MemberListInfinite() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMembersInfinite()

  const allMembers = data?.pages.flat() ?? []

  return (
    <>
      {allMembers.map((member) => (
        <MemberCard key={member.id} member={member} />
      ))}
      
      {hasNextPage && (
        <Button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? "Yükleniyor..." : "Daha Fazla"}
        </Button>
      )}
    </>
  )
}
```

## 5. Mock Service Şablonu

```tsx
// src/lib/mock-service.ts

import { mockMembers } from "./mock-data"
import type { Member, CreateMemberInput } from "@/types"

// Simüle edilmiş gecikme
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

export const mockService = {
  // GET - Liste
  async getMembers(options?: { type?: string; search?: string }) {
    await delay(500)
    let result = [...mockMembers]

    if (options?.type) {
      result = result.filter((m) => m.memberType === options.type)
    }
    if (options?.search) {
      const search = options.search.toLowerCase()
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(search) ||
          m.email?.toLowerCase().includes(search)
      )
    }

    return result
  },

  // GET - Tekil
  async getMember(id: string) {
    await delay(300)
    const member = mockMembers.find((m) => m.id === id)
    if (!member) throw new Error("Üye bulunamadı")
    return member
  },

  // POST - Oluştur
  async createMember(data: CreateMemberInput): Promise<Member> {
    await delay(500)
    const newMember: Member = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date().toISOString(),
    }
    mockMembers.push(newMember)
    return newMember
  },

  // PUT - Güncelle
  async updateMember(id: string, data: Partial<Member>): Promise<Member> {
    await delay(500)
    const index = mockMembers.findIndex((m) => m.id === id)
    if (index === -1) throw new Error("Üye bulunamadı")
    mockMembers[index] = { ...mockMembers[index], ...data }
    return mockMembers[index]
  },

  // DELETE - Sil
  async deleteMember(id: string): Promise<void> {
    await delay(300)
    const index = mockMembers.findIndex((m) => m.id === id)
    if (index === -1) throw new Error("Üye bulunamadı")
    mockMembers.splice(index, 1)
  },
}
```

## Cache Stratejileri

| Veri Tipi | staleTime | cacheTime | Notlar |
|-----------|-----------|-----------|--------|
| Dashboard stats | 1 dk | 5 dk | Sık değişir |
| Liste verileri | 5 dk | 10 dk | Orta sıklık |
| Detay verileri | 10 dk | 30 dk | Az değişir |
| Sabit veriler | 1 saat | 2 saat | Referans data |

## Kontrol Listesi

- [ ] Query keys tutarlı ve unique
- [ ] Loading state handle edildi
- [ ] Error state handle edildi
- [ ] Empty state handle edildi
- [ ] Cache invalidation doğru
- [ ] Optimistic updates (UX için)
- [ ] enabled prop ile conditional query
- [ ] staleTime/cacheTime optimize
- [ ] Error logging eklenmiş
- [ ] Toast notifications
