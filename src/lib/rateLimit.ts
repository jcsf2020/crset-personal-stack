import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Rate limiters for different endpoints
export const rateLimiters = {
  // RAG endpoints: 10 requests per minute per IP
  rag: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 m"),
    analytics: true,
    prefix: "ratelimit:rag",
  }),

  // Contact form: 5 requests per hour per IP
  contact: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "1 h"),
    analytics: true,
    prefix: "ratelimit:contact",
  }),

  // General API: 60 requests per minute per IP
  api: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(60, "1 m"),
    analytics: true,
    prefix: "ratelimit:api",
  }),
};

/**
 * Get client identifier from request (IP + User-Agent)
 */
export function getClientId(req: Request): string {
  // Try to get real IP from headers (Vercel provides this)
  const forwardedFor = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  const ip = forwardedFor?.split(",")[0] || realIp || "unknown";
  
  // Add user agent for better identification
  const ua = req.headers.get("user-agent") || "unknown";
  const uaHash = hashString(ua);
  
  return `${ip}:${uaHash}`;
}

/**
 * Simple hash function for user agent
 */
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36).substring(0, 8);
}

/**
 * Check rate limit and return appropriate response
 */
export async function checkRateLimit(
  req: Request,
  limiter: Ratelimit
): Promise<{ success: boolean; limit: number; remaining: number; reset: number } | null> {
  try {
    const identifier = getClientId(req);
    const { success, limit, remaining, reset } = await limiter.limit(identifier);
    
    return { success, limit, remaining, reset };
  } catch (error) {
    console.error("Rate limit check failed:", error);
    // On error, allow the request (fail open)
    return null;
  }
}

/**
 * Create rate limit headers for response
 */
export function createRateLimitHeaders(result: {
  limit: number;
  remaining: number;
  reset: number;
}): Record<string, string> {
  return {
    "X-RateLimit-Limit": result.limit.toString(),
    "X-RateLimit-Remaining": result.remaining.toString(),
    "X-RateLimit-Reset": new Date(result.reset).toISOString(),
    "Retry-After": Math.ceil((result.reset - Date.now()) / 1000).toString(),
  };
}




// ---- Compat: named export "rateLimit" expected by older code ----

export function rateLimit(name: keyof typeof rateLimiters = 'default') {

  // devolve o limiter pedido ou o default

  // @ts-ignore - fallback seguro se a chave não existir

  return (rateLimiters as any)[name] ?? rateLimiters.default;

}

