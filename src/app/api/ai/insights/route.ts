import { NextRequest, NextResponse } from 'next/server';
import { getCMCMarketOverview } from '@/lib/integrations/coinmarketcap';
import { generateMarketInsights, generateMarketAlerts } from '@/lib/ai/insights';

export const runtime = 'edge';

/**
 * GET /api/ai/insights
 * 
 * Returns AI-generated market insights and analysis using OpenAI GPT models.
 * Analyzes current cryptocurrency market data and provides actionable intelligence.
 * 
 * Query Parameters:
 * - limit: number of cryptos to analyze (default: 10)
 * - currency: fiat currency for prices (default: USD)
 * 
 * Example Response:
 * {
 *   "ok": true,
 *   "timestamp": "2025-11-02T01:00:00.000Z",
 *   "insights": {
 *     "summary": "The cryptocurrency market shows strong bullish momentum...",
 *     "sentiment": "bullish",
 *     "key_points": ["...", "..."],
 *     "opportunities": ["...", "..."],
 *     "risks": ["...", "..."],
 *     "recommendation": "Consider increasing exposure to...",
 *     "confidence": 85
 *   },
 *   "alerts": {
 *     "alerts": [
 *       {
 *         "type": "opportunity",
 *         "title": "Bitcoin Surge",
 *         "message": "BTC has gained 5.2% in the last 24 hours.",
 *         "priority": "medium"
 *       }
 *     ]
 *   },
 *   "meta": {
 *     "model": "gpt-4o-mini",
 *     "data_source": "CoinMarketCap API"
 *   }
 * }
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const requestId = crypto.randomUUID();
  
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50);
    const currency = (searchParams.get('currency') || 'USD').toUpperCase();
    
    // Get market data
    const marketData = await getCMCMarketOverview(limit, currency);
    
    // Generate AI insights
    const [insights, alerts] = await Promise.all([
      generateMarketInsights(marketData),
      generateMarketAlerts(marketData),
    ]);
    
    const duration = Date.now() - startTime;
    
    // Log request
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'info',
      message: 'AI market insights generated',
      requestId,
      duration_ms: duration,
      sentiment: insights.sentiment,
      confidence: insights.confidence,
      alerts_count: alerts.alerts.length,
    }));
    
    return NextResponse.json(
      {
        ok: true,
        timestamp: new Date().toISOString(),
        insights,
        alerts,
        meta: {
          model: 'gpt-4o-mini',
          data_source: 'CoinMarketCap API',
          analysis_duration_ms: duration,
        },
      },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-Request-ID': requestId,
        },
      }
    );
    
  } catch (error) {
    const duration = Date.now() - startTime;
    
    console.error(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'error',
      message: 'Error generating AI insights',
      requestId,
      duration_ms: duration,
      error: error instanceof Error ? error.message : 'Unknown error',
    }));
    
    return NextResponse.json(
      {
        ok: false,
        error: 'Failed to generate AI insights',
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
