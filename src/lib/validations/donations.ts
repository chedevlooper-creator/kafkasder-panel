import { z } from "zod"

export const donationSchema = z.object({
  member_id: z.number().optional(),
  bagisci_adi: z.string().min(2, "Bağışçı adı en az 2 karakter olmalı"),
  tutar: z.number().positive("Tutar pozitif olmalı"),
  currency: z.enum(["TRY", "USD", "EUR"]),
  amac: z.enum(["genel", "kumbara", "sosyal-yardim", "etkinlik", "diger"]),
  odeme_yontemi: z.enum(["kumbara", "nakit", "havale", "kredi_karti"]),
  tarih: z.string().optional(),
  not: z.string().optional(),
})

export type DonationInput = z.infer<typeof donationSchema>

export const donationUpdateSchema = donationSchema.partial()

export type DonationUpdateInput = z.infer<typeof donationUpdateSchema>

export const donationQuerySchema = z.object({
  page: z.string().optional().default("1"),
  limit: z.string().optional().default("10"),
  search: z.string().optional(),
  amac: z.string().optional(),
})

export type DonationQueryInput = z.infer<typeof donationQuerySchema>
