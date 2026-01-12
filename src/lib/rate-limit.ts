/**
 * Rate Limiting Utility
 *
 * Simple in-memory rate limiting for API routes.
 * In production, consider using Redis-based rate limiting for distributed systems.
 */

interface RateLimitStore {
  count: number
  resetTime: number
}

const store = new Map<string, RateLimitStore>()

/**
 * Rate limit configuration
 */
export interface RateLimitConfig {
  /** Maximum number of requests allowed within the window */
  limit: number
  /** Time window in milliseconds */
  window: number
  /** Custom identifier generator (default: IP address) */
  identifier?: (request: Request) => string
}

/**
 * Check if request should be rate limited
 * @param identifier Unique identifier for the client (e.g., IP address, user ID)
 * @param config Rate limit configuration
 * @returns Object indicating if request is limited and remaining requests
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): {
  limited: boolean
  remaining: number
  resetTime: number
} {
  const now = Date.now()
  const record = store.get(identifier)

  // Clean up expired records
  if (record && now > record.resetTime) {
    store.delete(identifier)
  }

  // Get or create record
  let currentRecord = store.get(identifier)
  if (!currentRecord) {
    currentRecord = {
      count: 0,
      resetTime: now + config.window,
    }
    store.set(identifier, currentRecord)
  }

  // Check if limit exceeded
  if (currentRecord.count >= config.limit) {
    return {
      limited: true,
      remaining: 0,
      resetTime: currentRecord.resetTime,
    }
  }

  // Increment counter
  currentRecord.count++
  store.set(identifier, currentRecord)

  return {
    limited: false,
    remaining: config.limit - currentRecord.count,
    resetTime: currentRecord.resetTime,
  }
}

/**
 * Get client IP address from request
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')

  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }

  if (realIp) {
    return realIp
  }

  return 'unknown'
}

/**
 * Rate limiting middleware for Next.js API routes
 */
export function createRateLimiter(config: RateLimitConfig) {
  return function rateLimit(request: Request) {
    const identifier = config.identifier
      ? config.identifier(request)
      : getClientIp(request)

    const result = checkRateLimit(identifier, config)

    return result
  }
}

/**
 * Clean up old rate limit records (call periodically)
 */
export function cleanupRateLimitStore(): void {
  const now = Date.now()
  for (const [key, record] of store.entries()) {
    if (now > record.resetTime) {
      store.delete(key)
    }
  }
}

// Clean up expired records every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimitStore, 5 * 60 * 1000)
}

/**
 * Predefined rate limit configurations
 */
export const RateLimitPresets = {
  /** Strict rate limit for sensitive operations (e.g., login) */
  strict: {
    limit: 5,
    window: 60 * 1000, // 5 requests per minute
  },
  /** Standard rate limit for general API operations */
  standard: {
    limit: 100,
    window: 60 * 1000, // 100 requests per minute
  },
  /** Lenient rate limit for read operations */
  lenient: {
    limit: 1000,
    window: 60 * 1000, // 1000 requests per minute
  },
} as const
