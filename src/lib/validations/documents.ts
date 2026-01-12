import { z } from "zod"

export const documentSchema = z.object({
  beneficiary_id: z.string(),
  file_name: z.string().min(1, "Dosya adı gerekli"),
  file_type: z.string(),
  file_size: z.number().positive("Dosya boyutu pozitif olmalı"),
  document_type: z.enum([
    "kimlik",
    "ikametgah",
    "gelir-belgesi",
    "saglik-raporu",
    "ogrenci-belgesi",
    "diger",
  ]),
})

export type DocumentInput = z.infer<typeof documentSchema>

export const documentQuerySchema = z.object({
  beneficiary_id: z.string().optional(),
})

export type DocumentQueryInput = z.infer<typeof documentQuerySchema>
