import { NextResponse } from "next/server";
import { getDomainOpportunities } from "@/lib/integrations/namecheap";
import { logger } from "@/lib/logger";
import { captureException } from "@sentry/nextjs";

export const runtime = "edge";
export const dynamic = "force-dynamic";

/**
 * GET /api/domains/opportunities
 * 
 * Retorna oportunidades de dominios disponiveis e em leilao
 * 
 * Query params:
 * - keywords: lista de keywords separadas por virgula
 * - maxPrice: preco maximo em USD (default: 1000)
 */
export async function GET(req: Request) {
  const requestId = req.headers.get("x-request-id") || `req_${Date.now()}`;
  const startTime = Date.now();

  try {
    const { searchParams } = new URL(req.url);
    const keywordsParam = searchParams.get("keywords") || "";
    const keywords = keywordsParam ? keywordsParam.split(",").map(k => k.trim()) : [];
    const maxPrice = parseInt(searchParams.get("maxPrice") || "1000");

    logger.info("Fetching domain opportunities", {
      requestId,
      endpoint: "/api/domains/opportunities",
      keywords,
      maxPrice,
    });

    const report = await getDomainOpportunities(keywords, maxPrice);
    const duration = Date.now() - startTime;

    logger.info("Domain opportunities fetched successfully", {
      requestId,
      endpoint: "/api/domains/opportunities",
      duration_ms: duration,
      opportunities_count: report.opportunities.length,
      total_value: report.meta.total_value,
    });

    return NextResponse.json(report, {
      status: 200,
      headers: {
        "X-Request-Id": requestId,
        "X-Response-Time": `${duration}ms`,
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
      },
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    
    logger.error("Failed to fetch domain opportunities", {
      requestId,
      endpoint: "/api/domains/opportunities",
      duration_ms: duration,
      error: (error as Error).message,
      stack: (error as Error).stack,
    });

    captureException(error, {
      extra: { requestId, endpoint: "/api/domains/opportunities" },
    });

    return NextResponse.json(
      {
        ok: false,
        error: "domains_fetch_failed",
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
