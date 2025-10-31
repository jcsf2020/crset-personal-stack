import { NextResponse } from "next/server";
import { getFinancePortfolio } from "@/lib/integrations/alphavantage";
import { logger } from "@/lib/logger";
import { captureException } from "@sentry/nextjs";

export const runtime = "edge";
export const dynamic = "force-dynamic";

/**
 * GET /api/finance/portfolio
 * 
 * Retorna portfolio de acoes com cotacoes em tempo real
 * 
 * Query params:
 * - symbols: lista de simbolos separados por virgula (ex: AAPL,GOOGL,MSFT)
 * - currency: moeda fiat (default: usd)
 */
export async function GET(req: Request) {
  const requestId = req.headers.get("x-request-id") || `req_${Date.now()}`;
  const startTime = Date.now();

  try {
    const { searchParams } = new URL(req.url);
    const symbolsParam = searchParams.get("symbols") || "AAPL,GOOGL,MSFT";
    const symbols = symbolsParam.split(",").map(s => s.trim().toUpperCase());
    const currency = searchParams.get("currency") || "usd";

    const apiKey = process.env.ALPHAVANTAGE_API_KEY;
    
    if (!apiKey) {
      logger.warn("AlphaVantage API key not configured", {
        requestId,
        endpoint: "/api/finance/portfolio",
      });
      
      return NextResponse.json(
        {
          ok: false,
          error: "api_key_not_configured",
          message: "AlphaVantage API key is required. Set ALPHAVANTAGE_API_KEY environment variable.",
        },
        {
          status: 500,
          headers: {
            "X-Request-Id": requestId,
          },
        }
      );
    }

    logger.info("Fetching finance portfolio", {
      requestId,
      endpoint: "/api/finance/portfolio",
      symbols,
      currency,
    });

    const portfolio = await getFinancePortfolio(symbols, apiKey, currency);
    const duration = Date.now() - startTime;

    logger.info("Finance portfolio fetched successfully", {
      requestId,
      endpoint: "/api/finance/portfolio",
      duration_ms: duration,
      stocks_count: portfolio.stocks.length,
      total_value: portfolio.total_value,
    });

    return NextResponse.json(portfolio, {
      status: 200,
      headers: {
        "X-Request-Id": requestId,
        "X-Response-Time": `${duration}ms`,
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
      },
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    
    logger.error("Failed to fetch finance portfolio", {
      requestId,
      endpoint: "/api/finance/portfolio",
      duration_ms: duration,
      error: (error as Error).message,
      stack: (error as Error).stack,
    });

    captureException(error, {
      extra: { requestId, endpoint: "/api/finance/portfolio" },
    });

    return NextResponse.json(
      {
        ok: false,
        error: "finance_fetch_failed",
        message: (error as Error).message,
      },
      {
        status: 500,
        headers: {
          "X-Request-Id": requestId,
          "X-Response-Time": `${duration}ms`,
        },
      }
    );
  }
}
