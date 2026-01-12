import { z } from "zod"

const envSchema = z.object({
  // Supabase Configuration
  NEXT_PUBLIC_SUPABASE_URL: z.string().url("Invalid Supabase URL"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "Supabase anon key is required"),

  // Application Configuration
  NEXT_PUBLIC_APP_URL: z.string().url("Invalid app URL"),

  // Optional: Sentry
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
  SENTRY_AUTH_TOKEN: z.string().optional(),

  // Optional: API Configuration
  NEXT_PUBLIC_API_URL: z.string().optional(),
  NEXT_PUBLIC_API_TIMEOUT: z.string().optional(),
  NEXT_PUBLIC_USE_MOCK_API: z.string().optional(),
})

export type Env = z.infer<typeof envSchema>

function validateEnv(): Env {
  try {
    const env = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
      NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
      SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
      NEXT_PUBLIC_API_TIMEOUT: process.env.NEXT_PUBLIC_API_TIMEOUT,
      NEXT_PUBLIC_USE_MOCK_API: process.env.NEXT_PUBLIC_USE_MOCK_API,
    }

    const validatedEnv = envSchema.parse(env)
    return validatedEnv
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues.map((issue) => issue.path.join(".")).join(", ")
      throw new Error(
        `Environment validation failed:\nMissing or invalid variables: ${missingVars}\n\nPlease check your .env.local file.`
      )
    }
    throw error
  }
}

export const env = validateEnv()
