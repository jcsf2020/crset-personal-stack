import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const debug = url.searchParams.get("debug") === "1";

  const backend = process.env.AGI_BACKEND || "openai";
  const body: any = {
    ok: true,
    backend,
    gated: false,
    now: new Date().toISOString(),
  };

  if (debug) {
    body.env = {
      AGI_BACKEND: process.env.AGI_BACKEND || null,
      AGI_UPSTREAM_BASE: process.env.AGI_UPSTREAM_BASE || null,
      AGI_OPENAI_BASE_URL: process.env.AGI_OPENAI_BASE_URL || null,
      OPENAI_BASE_URL: process.env.OPENAI_BASE_URL || null,
      HAS_AGI_OPENAI_KEY: Boolean(process.env.AGI_OPENAI_KEY),
      HAS_OPENAI_API_KEY: Boolean(process.env.OPENAI_API_KEY),
      AGI_MODEL: process.env.AGI_MODEL || null,
      NODE_ENV: process.env.NODE_ENV || null,
      VERCEL_ENV: process.env.VERCEL_ENV || null,
    };
  }

  return NextResponse.json(body);
}
// touch: 2025-10-02T11:19:18+01:00
