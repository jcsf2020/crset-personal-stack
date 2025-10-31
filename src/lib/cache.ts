/**
 * Multi-Layer Cache System
 * 
 * Implements a three-tier caching strategy:
 * 1. Memory Cache (fastest, ephemeral)
 * 2. Redis Cache (fast, persistent)
 * 3. CDN Cache (edge, global)
 * 
 * Benefits:
 * - Reduced latency
 * - Lower costs (fewer DB/API calls)
 * - Better scalability
 * - Improved user experience
 */

import { Redis } from '@upstash/redis';

/**
 * Cache configuration
 */
interface CacheConfig {
  ttl?: number; // Time to live in seconds
  tags?: string[]; // Cache tags for invalidation
  revalidate?: number; // Next.js revalidation time
}

/**
 * Memory cache (in-process)
 * Fast but ephemeral (cleared on restart)
 */
class MemoryCache {
  private cache: Map<string, { value: any; expires: number }> = new Map();
  private maxSize: number = 1000; // Max entries

  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check if expired
    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  set(key: string, value: any, ttl: number = 300): void {
    // Evict oldest entry if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      value,
      expires: Date.now() + ttl * 1000,
    });
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

/**
 * Redis cache (distributed)
 * Persistent and shared across instances
 */
class RedisCache {
  private client: Redis | null = null;

  constructor() {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (url && token) {
      this.client = new Redis({ url, token });
    } else {
      console.warn('Redis not configured, caching will be memory-only');
    }
  }

  async get<T = any>(key: string): Promise<T | null> {
    if (!this.client) return null;

    try {
      const value = await this.client.get<T>(key);
      return value;
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  }

  async set(key: string, value: any, ttl: number = 300): Promise<void> {
    if (!this.client) return;

    try {
      await this.client.setex(key, ttl, JSON.stringify(value));
    } catch (error) {
      console.error('Redis set error:', error);
    }
  }

  async delete(key: string): Promise<void> {
    if (!this.client) return;

    try {
      await this.client.del(key);
    } catch (error) {
      console.error('Redis delete error:', error);
    }
  }

  async deletePattern(pattern: string): Promise<void> {
    if (!this.client) return;

    try {
      // Get all keys matching pattern
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(...keys);
      }
    } catch (error) {
      console.error('Redis deletePattern error:', error);
    }
  }

  async clear(): Promise<void> {
    if (!this.client) return;

    try {
      await this.client.flushdb();
    } catch (error) {
      console.error('Redis clear error:', error);
    }
  }
}

/**
 * Multi-layer cache manager
 */
class CacheManager {
  private memory: MemoryCache;
  private redis: RedisCache;

  constructor() {
    this.memory = new MemoryCache();
    this.redis = new RedisCache();
  }

  /**
   * Get value from cache (checks memory first, then Redis)
   */
  async get<T = any>(key: string): Promise<T | null> {
    // Try memory cache first
    const memValue = this.memory.get(key);
    if (memValue !== null) {
      return memValue as T;
    }

    // Try Redis cache
    const redisValue = await this.redis.get<T>(key);
    if (redisValue !== null) {
      // Populate memory cache
      this.memory.set(key, redisValue, 60); // 1 min in memory
      return redisValue;
    }

    return null;
  }

  /**
   * Set value in cache (writes to both memory and Redis)
   */
  async set(key: string, value: any, config: CacheConfig = {}): Promise<void> {
    const ttl = config.ttl || 300; // Default 5 minutes

    // Write to memory cache
    this.memory.set(key, value, Math.min(ttl, 300)); // Max 5 min in memory

    // Write to Redis cache
    await this.redis.set(key, value, ttl);
  }

  /**
   * Delete value from cache
   */
  async delete(key: string): Promise<void> {
    this.memory.delete(key);
    await this.redis.delete(key);
  }

  /**
   * Delete all keys matching pattern
   */
  async deletePattern(pattern: string): Promise<void> {
    // Clear memory cache (simple approach: clear all)
    this.memory.clear();
    
    // Clear Redis cache with pattern
    await this.redis.deletePattern(pattern);
  }

  /**
   * Clear all caches
   */
  async clear(): Promise<void> {
    this.memory.clear();
    await this.redis.clear();
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      memory: {
        size: this.memory.size(),
      },
    };
  }
}

// Singleton instance
let cacheManager: CacheManager | null = null;

export function getCacheManager(): CacheManager {
  if (!cacheManager) {
    cacheManager = new CacheManager();
  }
  return cacheManager;
}

/**
 * Cached function wrapper
 * Automatically caches function results
 */
export async function cached<T>(
  key: string,
  fn: () => Promise<T>,
  config: CacheConfig = {}
): Promise<T> {
  const cache = getCacheManager();

  // Try to get from cache
  const cached = await cache.get<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Execute function
  const result = await fn();

  // Store in cache
  await cache.set(key, result, config);

  return result;
}

/**
 * Cache key builders
 */
export const CacheKeys = {
  // RAG
  ragQuery: (query: string) => `rag:query:${query}`,
  ragDocument: (id: number) => `rag:doc:${id}`,
  
  // Analytics
  metrics: (type: string) => `metrics:${type}`,
  
  // User
  user: (id: string) => `user:${id}`,
  
  // General
  api: (endpoint: string, params?: string) => 
    params ? `api:${endpoint}:${params}` : `api:${endpoint}`,
} as const;

/**
 * Cache TTL presets (in seconds)
 */
export const CacheTTL = {
  SHORT: 60,        // 1 minute
  MEDIUM: 300,      // 5 minutes
  LONG: 3600,       // 1 hour
  VERY_LONG: 86400, // 24 hours
} as const;

/**
 * CDN Cache Headers
 * Use these with Next.js responses for CDN caching
 */
export function getCDNCacheHeaders(config: {
  maxAge?: number;
  sMaxAge?: number;
  staleWhileRevalidate?: number;
  staleIfError?: number;
}): Record<string, string> {
  const {
    maxAge = 0,
    sMaxAge = 60,
    staleWhileRevalidate = 300,
    staleIfError = 86400,
  } = config;

  return {
    'Cache-Control': [
      `public`,
      `max-age=${maxAge}`,
      `s-maxage=${sMaxAge}`,
      `stale-while-revalidate=${staleWhileRevalidate}`,
      `stale-if-error=${staleIfError}`,
    ].join(', '),
  };
}

/**
 * No-cache headers
 */
export function getNoCacheHeaders(): Record<string, string> {
  return {
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  };
}

export { CacheManager, MemoryCache, RedisCache };

