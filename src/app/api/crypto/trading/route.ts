import { NextRequest, NextResponse } from 'next/server';
import { getCryptoTradingSummary } from '@/lib/integrations/binance';

export const runtime = 'edge';

/**
 * GET /api/crypto/trading
 * 
 * Returns real-time cryptocurrency trading data from Binance exchange.
 * Includes top trading pairs by volume with 24h statistics.
 * 
 * Query Parameters:
 * - limit: number of pairs to return (default: 10, max: 50)
 * 
 * Example Response:
 * {
 *   "ok": true,
 *   "timestamp": "2025-11-02T01:00:00.000Z",
 *   "source": "Binance API",
 *   "pairs": [
 *     {
 *       "symbol": "BTCUSDT",
 *       "price": 109554.23,
 *       "priceChange24h": 1725.45,
 *       "priceChangePercent24h": 1.57,
 *       "high24h": 110234.56,
 *       "low24h": 107890.12,
 *       "volume24h": 12345.67,
 *       "quoteVolume24h": 1350000000
 *     }
 *   ],
 *   "meta": {
 *     "exchange": "Binance",
 *     "pairs_count": 10,
 *     "base_currency": "USDT"
 *   }
 * }
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const requestId = crypto.randomUUID();
  
  try {
    // Get trading summary from Binance
    const summary = await getCryptoTradingSummary();
    
    const duration = Date.now() - startTime;
    
    // Log request
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'info',
      message: 'Crypto trading summary fetched',
      requestId,
      duration_ms: duration,
      pairs_count: summary.pairs.length,
      source: 'Binance',
    }));
    
    return NextResponse.json(summary, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-Request-ID': requestId,
      },
    });
    
  } catch (error) {
    const duration = Date.now() - startTime;
    
    console.error(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'error',
      message: 'Error fetching crypto trading summary',
      requestId,
      duration_ms: duration,
      error: error instanceof Error ? error.message : 'Unknown error',
    }));
    
    return NextResponse.json(
      {
        ok: false,
        error: 'Failed to fetch crypto trading data',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'X-Content-Type-Options': 'nosniff',
          'X-Request-ID': requestId,
        },
      }
    );
  }
}
