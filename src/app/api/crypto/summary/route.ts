import { NextResponse } from "next/server";
import { getCryptoSummary } from "@/lib/integrations/coingecko";
import { logger } from "@/lib/logger";
import { captureException } from "@sentry/nextjs";

export const runtime = "edge";
export const dynamic = "force-dynamic";

/**
 * GET /api/crypto/summary
 * 
 * Retorna resumo do mercado de criptomoedas com top N coins
 * 
 * Query params:
 * - limit: numero de moedas (default: 10, max: 50)
 * - currency: moeda fiat (default: usd)
 */
export async function GET(req: Request) {
  const requestId = req.headers.get("x-request-id") || `req_${Date.now()}`;
  const startTime = Date.now();

  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 50);
    const currency = searchParams.get("currency") || "usd";

    logger.info("Fetching crypto summary", {
      requestId,
      endpoint: "/api/crypto/summary",
      limit,
      currency,
    });

    const summary = await getCryptoSummary(limit, currency);
    const duration = Date.now() - startTime;

    logger.info("Crypto summary fetched successfully", {
      requestId,
      endpoint: "/api/crypto/summary",
      duration_ms: duration,
      coins_count: summary.coins.length,
    });

    return NextResponse.json(summary, {
      status: 200,
      headers: {
        "X-Request-Id": requestId,
        "X-Response-Time": `${duration}ms`,
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
      },
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    
    logger.error("Failed to fetch crypto summary", {
      requestId,
      endpoint: "/api/crypto/summary",
      duration_ms: duration,
      error: (error as Error).message,
      stack: (error as Error).stack,
    });

    captureException(error, {
      extra: { requestId, endpoint: "/api/crypto/summary" },
    });

    return NextResponse.json(
      {
        ok: false,
        error: "crypto_fetch_failed",
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
