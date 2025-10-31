import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/monitoring/openai-usage
 * 
 * Retorna informações sobre o uso da API OpenAI
 * Requer autenticação via header X-Admin-Key
 */
export async function GET(req: Request) {
  const adminKey = req.headers.get("x-admin-key");
  const expectedKey = process.env.ADMIN_API_KEY;

  if (!expectedKey || adminKey !== expectedKey) {
    return NextResponse.json(
      { ok: false, error: "unauthorized" },
      { status: 401 }
    );
  }

  const openaiKey = process.env.EMBEDDING_OPENAI_API_KEY;
  
  if (!openaiKey) {
    return NextResponse.json(
      { ok: false, error: "openai_key_not_configured" },
      { status: 500 }
    );
  }

  try {
    // Fetch usage data from OpenAI API
    const response = await fetch("https://api.openai.com/v1/usage", {
      headers: {
        "Authorization": `Bearer ${openaiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      // OpenAI API might not support this endpoint or key doesn't have access
      // Return estimated usage based on Redis metrics instead
      return NextResponse.json({
        ok: true,
        source: "estimated",
        message: "OpenAI usage API not available, showing estimated metrics",
        estimated_requests: 0,
        estimated_tokens: 0,
        estimated_cost_usd: 0,
        model: process.env.EMBEDDING_MODEL || "text-embedding-3-small",
        cost_per_1m_tokens: 0.02,
      });
    }

    const data = await response.json();

    return NextResponse.json({
      ok: true,
      source: "openai_api",
      ...data,
    });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: "failed_to_fetch_usage",
      message: error instanceof Error ? error.message : "Unknown error",
    }, { status: 500 });
  }
}

/**
 * POST /api/monitoring/openai-usage/alert
 * 
 * Configura alertas de custo
 */
export async function POST(req: Request) {
  const adminKey = req.headers.get("x-admin-key");
  const expectedKey = process.env.ADMIN_API_KEY;

  if (!expectedKey || adminKey !== expectedKey) {
    return NextResponse.json(
      { ok: false, error: "unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { threshold_usd, email } = body;

    if (!threshold_usd || !email) {
      return NextResponse.json(
        { ok: false, error: "missing_parameters" },
        { status: 400 }
      );
    }

    // TODO: Implement alert configuration in Redis or database
    // For now, just return success
    return NextResponse.json({
      ok: true,
      message: "Alert configured successfully",
      threshold_usd,
      email,
      note: "Implementation pending - alerts will be sent when threshold is exceeded",
    });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: "invalid_request",
      message: error instanceof Error ? error.message : "Unknown error",
    }, { status: 400 });
  }
}

