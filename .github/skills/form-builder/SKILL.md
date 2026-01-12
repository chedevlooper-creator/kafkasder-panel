---
name: form-builder
description: React Hook Form + Zod validation ile form oluşturma. shadcn/ui form bileşenleri, validation schemas, error handling, loading states ve form submission. Türkçe hata mesajları ve proje form patterns'ına uygun yapı.
---

# Form Oluşturma Skill'i

## Amaç
React Hook Form + Zod kullanarak proje standartlarına uygun formlar oluşturmak.

## Ne Zaman Kullanılır
- Yeni kayıt formu gerektiğinde
- Düzenleme formu oluşturulacağında
- Arama/filtre formları için
- Multi-step formlar için

## Form Oluşturma Adımları

### 1. Zod Schema Tanımla

```tsx
// src/lib/validators/member-schema.ts
import { z } from "zod"

export const memberSchema = z.object({
  name: z
    .string()
    .min(2, "İsim en az 2 karakter olmalı")
    .max(100, "İsim en fazla 100 karakter olabilir"),
  email: z
    .string()
    .email("Geçerli bir e-posta adresi girin")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .regex(/^[0-9]{10,11}$/, "Geçerli bir telefon numarası girin")
    .optional()
    .or(z.literal("")),
  birthDate: z
    .date({
      required_error: "Doğum tarihi seçin",
    })
    .optional(),
  memberType: z.enum(["active", "passive", "honorary"], {
    required_error: "Üyelik türü seçin",
  }),
  address: z.string().optional(),
  notes: z.string().max(500, "Notlar en fazla 500 karakter olabilir").optional(),
})

export type MemberFormData = z.infer<typeof memberSchema>

// Default values for form
export const memberDefaultValues: Partial<MemberFormData> = {
  name: "",
  email: "",
  phone: "",
  memberType: "active",
  address: "",
  notes: "",
}
```

### 2. Form Component Oluştur

```tsx
// src/components/features/members/member-form.tsx
"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { tr } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import {
  memberSchema,
  memberDefaultValues,
  type MemberFormData,
} from "@/lib/validators/member-schema"
import type { Member } from "@/types"

interface MemberFormProps {
  member?: Member // Düzenleme için mevcut veri
  onSubmit: (data: MemberFormData) => Promise<void>
  onCancel?: () => void
}

export function MemberForm({ member, onSubmit, onCancel }: MemberFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
    defaultValues: member
      ? {
          name: member.name,
          email: member.email ?? "",
          phone: member.phone ?? "",
          memberType: member.memberType,
          address: member.address ?? "",
          notes: member.notes ?? "",
          birthDate: member.birthDate ? new Date(member.birthDate) : undefined,
        }
      : memberDefaultValues,
  })

  const handleSubmit = async (data: MemberFormData) => {
    setIsSubmitting(true)
    try {
      await onSubmit(data)
    } catch (error) {
      console.error("[MemberForm Error]", error)
      // Toast notification for error
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* İsim */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>İsim Soyisim *</FormLabel>
              <FormControl>
                <Input placeholder="Ahmet Yılmaz" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* E-posta ve Telefon - Yan yana */}
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-posta</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="ornek@email.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefon</FormLabel>
                <FormControl>
                  <Input placeholder="5551234567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Üyelik Türü ve Doğum Tarihi */}
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="memberType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Üyelik Türü *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seçin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Aktif Üye</SelectItem>
                    <SelectItem value="passive">Pasif Üye</SelectItem>
                    <SelectItem value="honorary">Onursal Üye</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Doğum Tarihi</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "d MMMM yyyy", { locale: tr })
                        ) : (
                          <span>Tarih seçin</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Adres */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adres</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Adres bilgisi"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Notlar */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notlar</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Ek notlar..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>En fazla 500 karakter</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Butonlar */}
        <div className="flex justify-end gap-3">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              İptal
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {member ? "Güncelle" : "Kaydet"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
```

## Yaygın Validation Patterns

### Türkçe Hata Mesajları

```tsx
// String validations
z.string()
  .min(2, "En az 2 karakter olmalı")
  .max(100, "En fazla 100 karakter olabilir")
  .regex(/^[a-zA-ZğüşöçıİĞÜŞÖÇ\s]+$/, "Sadece harf kullanın")

// Number validations  
z.number()
  .min(0, "Sıfırdan küçük olamaz")
  .max(1000000, "Çok yüksek bir değer")
  .positive("Pozitif bir sayı girin")

// Email & Phone
z.string().email("Geçerli bir e-posta adresi girin")
z.string().regex(/^[0-9]{10,11}$/, "Geçerli bir telefon numarası girin")

// Date
z.date({ required_error: "Tarih seçin" })

// Enum/Select
z.enum(["option1", "option2"], { required_error: "Bir seçenek seçin" })

// Optional with empty string
z.string().optional().or(z.literal(""))

// TC Kimlik No
z.string()
  .length(11, "TC Kimlik No 11 haneli olmalı")
  .regex(/^[1-9][0-9]{10}$/, "Geçerli bir TC Kimlik No girin")

// Para miktarı
z.coerce.number()
  .min(0, "Miktar sıfırdan küçük olamaz")
  .multipleOf(0.01, "En fazla 2 ondalık basamak")
```

### Form State Hooks

```tsx
// Mevcut hooks kullan
import { useFormPersist } from "@/hooks/use-form-persist"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { useConfirmLeave } from "@/hooks/use-confirm-leave"

// Form değişikliklerini kaydet
useFormPersist("member-form", form)

// Ayrılırken uyar
useConfirmLeave(form.formState.isDirty)
```

## Kontrol Listesi

- [ ] Zod schema ayrı dosyada tanımlandı
- [ ] Türkçe validation mesajları
- [ ] Default values tanımlandı
- [ ] Loading state (isSubmitting)
- [ ] Error handling (try/catch)
- [ ] Responsive layout (grid sm:grid-cols-2)
- [ ] Required alanlar * ile işaretli
- [ ] FormDescription gerekirse eklendi
- [ ] Cancel butonu varsa disabled state
- [ ] Form submit sonrası redirect/toast
