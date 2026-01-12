---
name: component-creation
description: Proje yapısına uygun React bileşeni oluşturma. shadcn/ui, Tailwind CSS, CVA variants, TypeScript props, 'use client' directive kullanımı. Feature, shared veya ui bileşenleri için doğru dizin yapısı ve naming conventions.
---

# Bileşen Oluşturma Skill'i

## Amaç
Proje standartlarına uygun, yeniden kullanılabilir React bileşenleri oluşturmak.

## Ne Zaman Kullanılır
- Yeni bir UI bileşeni gerektiğinde
- Feature-specific bileşen oluşturulacağında
- Mevcut bileşenin genelleştirilmesi gerektiğinde

## Bileşen Türleri ve Dizinler

```
src/components/
├── ui/              # Temel UI bileşenleri (shadcn/ui tabanlı)
├── shared/          # Projede paylaşılan bileşenler
├── features/        # Modül-specific bileşenler
│   ├── members/     # Üye modülü bileşenleri
│   ├── donations/   # Bağış modülü bileşenleri
│   ├── social-aid/  # Sosyal yardım bileşenleri
│   └── ...
└── layout/          # Layout bileşenleri (sidebar, header)
```

## 1. UI Bileşeni Şablonu (shadcn/ui tarzı)

```tsx
// src/components/ui/status-badge.tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary/10 text-primary",
        success: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
        danger: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
        info: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      },
      size: {
        sm: "text-xs px-2 py-0.5",
        md: "text-sm px-2.5 py-0.5",
        lg: "text-sm px-3 py-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {}

function StatusBadge({ className, variant, size, ...props }: StatusBadgeProps) {
  return (
    <span
      className={cn(statusBadgeVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { StatusBadge, statusBadgeVariants }
```

## 2. Feature Bileşeni Şablonu

```tsx
// src/components/features/members/member-card.tsx
"use client"

import { useState } from "react"
import { User, Phone, Mail, MoreVertical } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Member } from "@/types"

interface MemberCardProps {
  member: Member
  onEdit?: (member: Member) => void
  onDelete?: (member: Member) => void
  className?: string
}

export function MemberCard({ member, onEdit, onDelete, className }: MemberCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      await onDelete?.(member)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={member.avatar} alt={member.name} />
            <AvatarFallback>
              {member.name.split(" ").map((n) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-base font-medium">{member.name}</CardTitle>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" disabled={isLoading}>
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Menü</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit?.(member)}>
              Düzenle
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-destructive"
            >
              Sil
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="space-y-2">
        {member.phone && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>{member.phone}</span>
          </div>
        )}
        {member.email && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span>{member.email}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
```

## 3. Shared Bileşen Şablonu

```tsx
// src/components/shared/confirmation-dialog.tsx
"use client"

import { useState } from "react"
import { AlertTriangle } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

interface ConfirmationDialogProps {
  trigger: React.ReactNode
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: "default" | "destructive"
  onConfirm: () => void | Promise<void>
}

export function ConfirmationDialog({
  trigger,
  title,
  description,
  confirmText = "Onayla",
  cancelText = "İptal",
  variant = "default",
  onConfirm,
}: ConfirmationDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirm = async () => {
    setIsLoading(true)
    try {
      await onConfirm()
      setOpen(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            {variant === "destructive" && (
              <AlertTriangle className="h-5 w-5 text-destructive" />
            )}
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className={variant === "destructive" ? "bg-destructive hover:bg-destructive/90" : ""}
          >
            {isLoading ? "Yükleniyor..." : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

## Kritik Kurallar

### 'use client' Direktifi

```tsx
// ✅ Gerekli durumlar:
// - useState, useEffect, useRef kullanımı
// - Event handlers (onClick, onChange, etc.)
// - Browser API'leri (localStorage, window)
// - Interactive bileşenler

"use client"

import { useState } from "react"
// ...

// ❌ Gereksiz durumlar:
// - Sadece props alan ve render eden bileşenler
// - Server component olarak çalışabilecek bileşenler
```

### TypeScript Props

```tsx
// ✅ Doğru: Explicit interface
interface ButtonProps {
  variant?: "primary" | "secondary"
  size?: "sm" | "md" | "lg"
  children: React.ReactNode
  onClick?: () => void
}

// ❌ Yanlış: any veya implicit types
function Button(props: any) { ... }
```

### Import Sırası

```tsx
// 1. React ve external
import { useState, useEffect } from "react"
import { Plus, Edit } from "lucide-react"

// 2. Internal UI components
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

// 3. Internal features/shared
import { MemberForm } from "@/components/features/members/member-form"

// 4. Hooks, utils, types
import { useMembers } from "@/hooks/use-api"
import { cn } from "@/lib/utils"
import type { Member } from "@/types"
```

### Naming Conventions

| Tür | Örnek | Konum |
|-----|-------|-------|
| UI Component | `Button`, `Card` | `ui/button.tsx` |
| Feature Component | `MemberCard`, `DonationForm` | `features/members/member-card.tsx` |
| Shared Component | `PageHeader`, `EmptyState` | `shared/page-header.tsx` |
| Props Interface | `MemberCardProps` | Component dosyası içinde |

## Kontrol Listesi

- [ ] Doğru dizine yerleştirildi
- [ ] TypeScript interface tanımlandı
- [ ] `'use client'` gerekirse eklendi
- [ ] Import sırası doğru
- [ ] Tailwind class'ları kullanıldı
- [ ] CVA kullanıldı (variants varsa)
- [ ] Accessibility (aria-label, sr-only)
- [ ] Loading/disabled durumları
- [ ] Türkçe UI metinleri
