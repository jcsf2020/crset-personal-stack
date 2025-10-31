/**
 * Monitoring and Health Checks System
 * 
 * Provides health checks, metrics collection, and alerting capabilities.
 * 
 * Features:
 * - Health check endpoints
 * - Metrics collection
 * - Performance tracking
 * - Error rate monitoring
 * - Alerting thresholds
 */

import { logger } from './logger';

/**
 * Health check status
 */
export type HealthStatus = 'healthy' | 'degraded' | 'unhealthy';

export interface HealthCheck {
  status: HealthStatus;
  timestamp: string;
  checks: {
    [key: string]: {
      status: HealthStatus;
      message?: string;
      latency?: number;
    };
  };
  metadata?: Record<string, any>;
}

/**
 * Metric types
 */
export interface Metric {
  name: string;
  value: number;
  timestamp: string;
  tags?: Record<string, string>;
}

/**
 * Performance tracker
 */
export class PerformanceTracker {
  private startTime: number;
  private operation: string;

  constructor(operation: string) {
    this.operation = operation;
    this.startTime = Date.now();
  }

  end(metadata?: Record<string, any>): number {
    const duration = Date.now() - this.startTime;
    
    logger.info(`Performance: ${this.operation}`, {
      operation: this.operation,
      duration,
      ...metadata,
    });

    return duration;
  }
}

/**
 * Start performance tracking
 */
export function trackPerformance(operation: string): PerformanceTracker {
  return new PerformanceTracker(operation);
}

/**
 * Metrics collector
 */
class MetricsCollector {
  private metrics: Map<string, number[]> = new Map();
  private maxSamples: number = 1000;

  /**
   * Record a metric value
   */
  record(name: string, value: number, tags?: Record<string, string>): void {
    const key = tags ? `${name}:${JSON.stringify(tags)}` : name;
    
    if (!this.metrics.has(key)) {
      this.metrics.set(key, []);
    }

    const samples = this.metrics.get(key)!;
    samples.push(value);

    // Keep only last N samples
    if (samples.length > this.maxSamples) {
      samples.shift();
    }
  }

  /**
   * Get metric statistics
   */
  getStats(name: string, tags?: Record<string, string>): {
    count: number;
    min: number;
    max: number;
    avg: number;
    p50: number;
    p95: number;
    p99: number;
  } | null {
    const key = tags ? `${name}:${JSON.stringify(tags)}` : name;
    const samples = this.metrics.get(key);

    if (!samples || samples.length === 0) {
      return null;
    }

    const sorted = [...samples].sort((a, b) => a - b);
    const count = sorted.length;

    return {
      count,
      min: sorted[0],
      max: sorted[count - 1],
      avg: sorted.reduce((a, b) => a + b, 0) / count,
      p50: sorted[Math.floor(count * 0.5)],
      p95: sorted[Math.floor(count * 0.95)],
      p99: sorted[Math.floor(count * 0.99)],
    };
  }

  /**
   * Clear metrics
   */
  clear(): void {
    this.metrics.clear();
  }
}

// Singleton instance
let metricsCollector: MetricsCollector | null = null;

export function getMetricsCollector(): MetricsCollector {
  if (!metricsCollector) {
    metricsCollector = new MetricsCollector();
  }
  return metricsCollector;
}

/**
 * Health check functions
 */

/**
 * Check database connectivity
 */
export async function checkDatabase(): Promise<{
  status: HealthStatus;
  message?: string;
  latency?: number;
}> {
  try {
    const start = Date.now();
    
    // Try to import and use Supabase
    const { getSupabaseAdmin } = await import('./supabaseServer');
    const supabase = getSupabaseAdmin();
    
    // Simple query to check connectivity
    const { error } = await supabase.from('rag_documents').select('count').limit(1);
    
    const latency = Date.now() - start;

    if (error) {
      return {
        status: 'degraded',
        message: error.message,
        latency,
      };
    }

    return {
      status: 'healthy',
      latency,
    };
  } catch (error: any) {
    return {
      status: 'unhealthy',
      message: error.message,
    };
  }
}

/**
 * Check Redis connectivity
 */
export async function checkRedis(): Promise<{
  status: HealthStatus;
  message?: string;
  latency?: number;
}> {
  try {
    const start = Date.now();
    
    // Try to import and use Redis
    const { Redis } = await import('@upstash/redis');
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
    
    // Simple ping
    await redis.ping();
    
    const latency = Date.now() - start;

    return {
      status: 'healthy',
      latency,
    };
  } catch (error: any) {
    return {
      status: 'unhealthy',
      message: error.message,
    };
  }
}

/**
 * Check OpenAI API
 */
export async function checkOpenAI(): Promise<{
  status: HealthStatus;
  message?: string;
  latency?: number;
}> {
  try {
    const start = Date.now();
    
    // Simple test embedding
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: 'test',
      }),
    });

    const latency = Date.now() - start;

    if (!response.ok) {
      return {
        status: 'degraded',
        message: `HTTP ${response.status}`,
        latency,
      };
    }

    return {
      status: 'healthy',
      latency,
    };
  } catch (error: any) {
    return {
      status: 'unhealthy',
      message: error.message,
    };
  }
}

/**
 * Perform all health checks
 */
export async function performHealthChecks(): Promise<HealthCheck> {
  const timestamp = new Date().toISOString();
  
  const [database, redis, openai] = await Promise.all([
    checkDatabase(),
    checkRedis(),
    checkOpenAI(),
  ]);

  const checks = {
    database,
    redis,
    openai,
  };

  // Determine overall status
  const statuses = Object.values(checks).map(c => c.status);
  let status: HealthStatus = 'healthy';
  
  if (statuses.includes('unhealthy')) {
    status = 'unhealthy';
  } else if (statuses.includes('degraded')) {
    status = 'degraded';
  }

  return {
    status,
    timestamp,
    checks,
    metadata: {
      env: process.env.NODE_ENV,
      version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || 'local',
    },
  };
}

/**
 * Alert thresholds
 */
export const AlertThresholds = {
  ERROR_RATE: 0.05,        // 5% error rate
  RESPONSE_TIME_P95: 2000, // 2 seconds
  RESPONSE_TIME_P99: 5000, // 5 seconds
  MEMORY_USAGE: 0.9,       // 90% memory usage
} as const;

/**
 * Check if alert should be triggered
 */
export function shouldAlert(
  metric: string,
  value: number,
  threshold: number
): boolean {
  return value > threshold;
}

/**
 * Common metric names
 */
export const MetricNames = {
  // API
  API_REQUEST_DURATION: 'api.request.duration',
  API_REQUEST_COUNT: 'api.request.count',
  API_ERROR_COUNT: 'api.error.count',
  
  // RAG
  RAG_QUERY_DURATION: 'rag.query.duration',
  RAG_INGEST_DURATION: 'rag.ingest.duration',
  RAG_EMBEDDING_DURATION: 'rag.embedding.duration',
  
  // Cache
  CACHE_HIT_RATE: 'cache.hit_rate',
  CACHE_MISS_RATE: 'cache.miss_rate',
  
  // Database
  DB_QUERY_DURATION: 'db.query.duration',
  DB_CONNECTION_COUNT: 'db.connection.count',
} as const;

/**
 * Record API request metric
 */
export function recordAPIRequest(
  method: string,
  path: string,
  status: number,
  duration: number
): void {
  const collector = getMetricsCollector();
  
  collector.record(MetricNames.API_REQUEST_DURATION, duration, {
    method,
    path,
    status: status.toString(),
  });
  
  collector.record(MetricNames.API_REQUEST_COUNT, 1, {
    method,
    path,
    status: status.toString(),
  });
  
  if (status >= 400) {
    collector.record(MetricNames.API_ERROR_COUNT, 1, {
      method,
      path,
      status: status.toString(),
    });
  }
}

/**
 * Get API metrics summary
 */
export function getAPIMetrics(): {
  requests: any;
  errors: any;
  duration: any;
} {
  const collector = getMetricsCollector();
  
  return {
    requests: collector.getStats(MetricNames.API_REQUEST_COUNT),
    errors: collector.getStats(MetricNames.API_ERROR_COUNT),
    duration: collector.getStats(MetricNames.API_REQUEST_DURATION),
  };
}

