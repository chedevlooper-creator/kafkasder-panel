import { z } from "zod"

export const socialAidApplicationSchema = z.object({
  beneficiary_id: z.number(),
  yardim_turu: z.enum(["gida", "egitim", "saglik", "barinma", "giyim", "diger"]),
  talep_edilen_tutar: z.number().optional(),
  gerekce: z.string().min(10, "Gerekçe en az 10 karakter olmalı"),
  durum: z.enum(["beklemede", "inceleniyor", "onaylandi", "reddeddi"]).optional(),
})

export type SocialAidApplicationInput = z.infer<typeof socialAidApplicationSchema>

export const socialAidApplicationUpdateSchema = socialAidApplicationSchema.partial()

export type SocialAidApplicationUpdateInput = z.infer<typeof socialAidApplicationUpdateSchema>

export const socialAidApplicationQuerySchema = z.object({
  page: z.string().optional().default("1"),
  limit: z.string().optional().default("10"),
  durum: z.string().optional(),
})

export type SocialAidApplicationQueryInput = z.infer<typeof socialAidApplicationQuerySchema>

export const socialAidPaymentSchema = z.object({
  application_id: z.number(),
  tutar: z.number().positive("Tutar pozitif olmalı"),
  odeme_yontemi: z.enum(["nakit", "havale", "kredi_karti"]),
  odeme_tarihi: z.string().optional(),
  not: z.string().optional(),
})

export type SocialAidPaymentInput = z.infer<typeof socialAidPaymentSchema>
