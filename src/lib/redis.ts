// src/lib/redis.ts
import { Redis } from '@upstash/redis';

// Cliente Upstash Redis via REST (Edge/Node)
export const redis = Redis.fromEnv();

// Helpers opcionais (usados por /metrics ou outros)
export async function incr(key: string) {
  return redis.incr(key);
}
export async function getJSON<T = unknown>(key: string) {
  return redis.get<T>(key);
}
export async function hset(key: string, data: Record<string, any>) {
  return redis.hset(key, data);
}
