import { z } from "zod"

export const memberSchema = z.object({
  tc_kimlik_no: z.string().min(11, "TC Kimlik No 11 haneli olmalı").max(11),
  ad: z.string().min(2, "Ad en az 2 karakter olmalı"),
  soyad: z.string().min(2, "Soyad en az 2 karakter olmalı"),
  dogum_tarihi: z.string().optional(),
  cinsiyet: z.enum(["erkek", "kadin"]),
  telefon: z.string().min(10, "Telefon en az 10 haneli olmalı"),
  email: z.string().email("Geçerli bir e-posta adresi girin").optional().or(z.literal("")),
  adres: z.string().optional(),
  uye_turu: z.enum(["onursal", "standart", "fahri"]),
  aidat_durumu: z.enum(["odendi", "gecikti", "beklemede"]).optional(),
  kayit_tarihi: z.string().optional(),
})

export type MemberInput = z.infer<typeof memberSchema>

export const memberUpdateSchema = memberSchema.partial()

export type MemberUpdateInput = z.infer<typeof memberUpdateSchema>

export const memberQuerySchema = z.object({
  page: z.string().optional().default("1"),
  limit: z.string().optional().default("10"),
  search: z.string().optional(),
})

export type MemberQueryInput = z.infer<typeof memberQuerySchema>
