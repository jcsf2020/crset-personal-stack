import { NextRequest, NextResponse } from 'next/server';
import { getCMCMarketOverview } from '@/lib/integrations/coinmarketcap';
import { getCryptoTradingSummary } from '@/lib/integrations/binance';
import { generateMarketInsights } from '@/lib/ai/insights';

export const runtime = 'edge';

/**
 * GET /api/reports/generate
 * 
 * Generates comprehensive market reports in JSON format.
 * Includes market data, trading data, and AI insights.
 * 
 * Query Parameters:
 * - format: report format (json|markdown) - default: json
 * - limit: number of cryptos to include (default: 10)
 * 
 * Example Response (JSON):
 * {
 *   "ok": true,
 *   "report_id": "rpt_abc123",
 *   "generated_at": "2025-11-02T01:00:00.000Z",
 *   "format": "json",
 *   "data": {
 *     "market_overview": {...},
 *     "trading_summary": {...},
 *     "ai_insights": {...}
 *   },
 *   "meta": {
 *     "version": "2.0",
 *     "data_sources": ["CoinMarketCap", "Binance", "OpenAI"]
 *   }
 * }
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const requestId = crypto.randomUUID();
  const reportId = `rpt_${Date.now()}_${requestId.slice(0, 8)}`;
  
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json';
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50);
    
    // Fetch all data in parallel
    const [marketOverview, tradingSummary] = await Promise.all([
      getCMCMarketOverview(limit, 'USD'),
      getCryptoTradingSummary(),
    ]);
    
    // Generate AI insights
    const aiInsights = await generateMarketInsights(marketOverview);
    
    const reportData = {
      ok: true,
      report_id: reportId,
      generated_at: new Date().toISOString(),
      format,
      data: {
        market_overview: marketOverview,
        trading_summary: tradingSummary,
        ai_insights: aiInsights,
      },
      meta: {
        version: '2.0',
        data_sources: ['CoinMarketCap', 'Binance', 'OpenAI'],
        generation_duration_ms: Date.now() - startTime,
      },
    };
    
    if (format === 'markdown') {
      const markdown = generateMarkdownReport(reportData);
      
      return new NextResponse(markdown, {
        status: 200,
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8',
          'Content-Disposition': `attachment; filename="financeflow_report_${reportId}.md"`,
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
          'X-Content-Type-Options': 'nosniff',
          'X-Request-ID': requestId,
        },
      });
    }
    
    // Default: JSON format
    const duration = Date.now() - startTime;
    
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'info',
      message: 'Market report generated',
      requestId,
      reportId,
      duration_ms: duration,
      format,
    }));
    
    return NextResponse.json(reportData, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'X-Content-Type-Options': 'nosniff',
        'X-Request-ID': requestId,
      },
    });
    
  } catch (error) {
    const duration = Date.now() - startTime;
    
    console.error(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'error',
      message: 'Error generating report',
      requestId,
      duration_ms: duration,
      error: error instanceof Error ? error.message : 'Unknown error',
    }));
    
    return NextResponse.json(
      {
        ok: false,
        error: 'Failed to generate report',
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

/**
 * Generate Markdown report from data
 */
function generateMarkdownReport(data: any): string {
  const { report_id, generated_at, data: reportData, meta } = data;
  const { market_overview, trading_summary, ai_insights } = reportData;
  
  const formatCurrency = (num: number): string => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toFixed(2)}`;
  };
  
  const formatPercent = (num: number): string => {
    const sign = num >= 0 ? '+' : '';
    return `${sign}${num.toFixed(2)}%`;
  };
  
  return `# FinanceFlow Market Report

**Report ID:** ${report_id}  
**Generated:** ${new Date(generated_at).toLocaleString()}  
**Version:** ${meta.version}  
**Data Sources:** ${meta.data_sources.join(', ')}

---

## Executive Summary

${ai_insights.summary}

**Market Sentiment:** ${ai_insights.sentiment.toUpperCase()}  
**Confidence Level:** ${ai_insights.confidence}%

---

## Global Market Overview

| Metric | Value |
|--------|-------|
| Total Market Cap | ${formatCurrency(market_overview.global.total_market_cap)} |
| 24h Volume | ${formatCurrency(market_overview.global.total_volume_24h)} |
| BTC Dominance | ${market_overview.global.btc_dominance.toFixed(1)}% |
| ETH Dominance | ${market_overview.global.eth_dominance.toFixed(1)}% |
| Active Cryptocurrencies | ${market_overview.global.active_cryptocurrencies.toLocaleString()} |
| Active Exchanges | ${market_overview.global.active_exchanges.toLocaleString()} |

---

## Top Cryptocurrencies

| Rank | Name | Symbol | Price | 24h Change | 7d Change | Market Cap |
|------|------|--------|-------|------------|-----------|------------|
${market_overview.top_cryptos.map((c: any) => 
  `| ${c.rank} | ${c.name} | ${c.symbol} | ${formatCurrency(c.price)} | ${formatPercent(c.percent_change_24h)} | ${formatPercent(c.percent_change_7d)} | ${formatCurrency(c.market_cap)} |`
).join('\n')}

---

## Top Trading Pairs (Binance)

| Pair | Price | 24h Change | Volume |
|------|-------|------------|--------|
${trading_summary.pairs.slice(0, 10).map((p: any) => 
  `| ${p.symbol} | ${formatCurrency(p.price)} | ${formatPercent(p.priceChangePercent24h)} | ${formatCurrency(p.quoteVolume24h)} |`
).join('\n')}

---

## AI Insights

### Key Points

${ai_insights.key_points.map((point: string) => `- ${point}`).join('\n')}

### Opportunities

${ai_insights.opportunities.map((opp: string) => `- ${opp}`).join('\n')}

### Risks

${ai_insights.risks.map((risk: string) => `- ${risk}`).join('\n')}

### Recommendation

${ai_insights.recommendation}

---

## Disclaimer

This report is generated automatically using AI and real-time market data. It is for informational purposes only and should not be considered as financial advice. Always conduct your own research and consult with a qualified financial advisor before making investment decisions.

---

*Report generated by FinanceFlow v2.0 - CRSET Personal Stack*  
*Powered by CoinMarketCap, Binance, and OpenAI*
`;
}
