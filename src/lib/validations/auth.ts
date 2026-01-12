import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi girin"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı"),
})

export type LoginInput = z.infer<typeof loginSchema>

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token gerekli"),
})

export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>
