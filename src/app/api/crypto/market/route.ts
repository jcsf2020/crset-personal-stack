import { NextRequest, NextResponse } from 'next/server';
import { getCMCMarketOverview } from '@/lib/integrations/coinmarketcap';

export const runtime = 'edge';

/**
 * GET /api/crypto/market
 * 
 * Returns comprehensive cryptocurrency market data from CoinMarketCap.
 * Includes global metrics and top cryptocurrencies by market cap.
 * 
 * Query Parameters:
 * - limit: number of cryptos to return (default: 10, max: 100)
 * - currency: fiat currency for prices (default: USD)
 * 
 * Example Response:
 * {
 *   "ok": true,
 *   "timestamp": "2025-11-02T01:00:00.000Z",
 *   "currency": "USD",
 *   "global": {
 *     "total_market_cap": 3800000000000,
 *     "total_volume_24h": 125000000000,
 *     "btc_dominance": 56.5,
 *     "eth_dominance": 18.2,
 *     "active_cryptocurrencies": 10500,
 *     "active_exchanges": 750
 *   },
 *   "top_cryptos": [
 *     {
 *       "rank": 1,
 *       "name": "Bitcoin",
 *       "symbol": "BTC",
 *       "price": 109554.23,
 *       "market_cap": 2136307485000,
 *       "volume_24h": 35000000000,
 *       "percent_change_24h": 1.57,
 *       "percent_change_7d": 3.45
 *     }
 *   ],
 *   "meta": {
 *     "source": "CoinMarketCap API",
 *     "count": 10
 *   }
 * }
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const requestId = crypto.randomUUID();
  
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const currency = (searchParams.get('currency') || 'USD').toUpperCase();
    
    // Get market overview from CoinMarketCap
    const overview = await getCMCMarketOverview(limit, currency);
    
    const duration = Date.now() - startTime;
    
    // Log request
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'info',
      message: 'Crypto market overview fetched',
      requestId,
      duration_ms: duration,
      limit,
      currency,
      source: 'CoinMarketCap',
    }));
    
    return NextResponse.json(overview, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=240',
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
      message: 'Error fetching crypto market overview',
      requestId,
      duration_ms: duration,
      error: error instanceof Error ? error.message : 'Unknown error',
    }));
    
    return NextResponse.json(
      {
        ok: false,
        error: 'Failed to fetch crypto market data',
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
