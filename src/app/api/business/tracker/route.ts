import { NextResponse } from "next/server";
import { getBusinessOpportunities, calculateBusinessMetrics } from "@/lib/integrations/flippa";
import { logger } from "@/lib/logger";
import { captureException } from "@sentry/nextjs";

export const runtime = "edge";
export const dynamic = "force-dynamic";

/**
 * GET /api/business/tracker
 * 
 * Retorna oportunidades de negocio SaaS e ecommerce
 * 
 * Query params:
 * - category: saas, ecommerce, content, app, other
 * - maxPrice: preco maximo em USD
 * - minRevenue: receita mensal minima em USD
 */
export async function GET(req: Request) {
  const requestId = req.headers.get("x-request-id") || `req_${Date.now()}`;
  const startTime = Date.now();

  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;
    const maxPrice = searchParams.get("maxPrice") 
      ? parseInt(searchParams.get("maxPrice")!) 
      : undefined;
    const minRevenue = searchParams.get("minRevenue") 
      ? parseInt(searchParams.get("minRevenue")!) 
      : undefined;

    logger.info("Fetching business opportunities", {
      requestId,
      endpoint: "/api/business/tracker",
      category,
      maxPrice,
      minRevenue,
    });

    const report = await getBusinessOpportunities(category, maxPrice, minRevenue);
    
    // Adicionar metricas calculadas a cada oportunidade
    const enrichedOpportunities = report.opportunities.map(opp => ({
      ...opp,
      metrics: calculateBusinessMetrics(opp),
    }));

    const enrichedReport = {
      ...report,
      opportunities: enrichedOpportunities,
    };

    const duration = Date.now() - startTime;

    logger.info("Business opportunities fetched successfully", {
      requestId,
      endpoint: "/api/business/tracker",
      duration_ms: duration,
      opportunities_count: report.opportunities.length,
      total_value: report.meta.total_value,
      avg_multiple: report.meta.avg_multiple,
    });

    return NextResponse.json(enrichedReport, {
      status: 200,
      headers: {
        "X-Request-Id": requestId,
        "X-Response-Time": `${duration}ms`,
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
      },
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    
    logger.error("Failed to fetch business opportunities", {
      requestId,
      endpoint: "/api/business/tracker",
      duration_ms: duration,
      error: (error as Error).message,
      stack: (error as Error).stack,
    });

    captureException(error, {
      extra: { requestId, endpoint: "/api/business/tracker" },
    });

    return NextResponse.json(
      {
        ok: false,
        error: "business_fetch_failed",
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
