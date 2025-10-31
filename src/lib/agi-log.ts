import { Redis } from '@upstash/redis';

const redis = (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
  ? new Redis({ url: process.env.UPSTASH_REDIS_REST_URL!, token: process.env.UPSTASH_REDIS_REST_TOKEN! })
  : null;

export async function logAgiRoute(evt: Record<string, unknown>) {
  try {
    if (!redis) return;
    const row = { t: Date.now(), ...evt };
    await redis.lpush('agi:logs', JSON.stringify(row));
    await redis.ltrim('agi:logs', 0, 4999);
  } catch {}
}
