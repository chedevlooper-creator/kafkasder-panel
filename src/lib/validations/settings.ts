import { z } from "zod"

export const settingsSchema = z.object({
  key: z.string().min(1, "Ayar anahtarı gerekli"),
  value: z.string().optional(),
  category: z.enum(["genel", "uyelik", "bagis", "sosyal-yardim", "sistem"]).optional(),
  description: z.string().optional(),
})

export type SettingsInput = z.infer<typeof settingsSchema>

export const settingsUpdateSchema = settingsSchema.partial()

export type SettingsUpdateInput = z.infer<typeof settingsUpdateSchema>
