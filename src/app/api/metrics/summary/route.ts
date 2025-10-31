export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { getAPIMetrics, getMetricsCollector } from '@/lib/monitoring';
import { getNoCacheHeaders } from '@/lib/cache';

/**
 * Metrics Summary Endpoint
 * 
 * Returns aggregated metrics for monitoring and alerting.
 * Requires admin authentication.
 * 
 * GET /api/metrics/summary
 * Headers: X-Admin-Key
 */
export async function GET(req: Request) {
  // Check admin authentication
  const adminKey = req.headers.get('X-Admin-Key');
  const expectedKey = process.env.ADMIN_API_KEY;

  if (!expectedKey || adminKey !== expectedKey) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          ...getNoCacheHeaders(),
        },
      }
    );
  }

  try {
    const apiMetrics = getAPIMetrics();
    const collector = getMetricsCollector();

    const summary = {
      timestamp: new Date().toISOString(),
      api: apiMetrics,
      cache: {
        stats: collector.getStats('cache.hit_rate'),
      },
      rag: {
        query: collector.getStats('rag.query.duration'),
        ingest: collector.getStats('rag.ingest.duration'),
      },
    };

    return new Response(
      JSON.stringify(summary, null, 2),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...getNoCacheHeaders(),
        },
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...getNoCacheHeaders(),
        },
      }
    );
  }
}

