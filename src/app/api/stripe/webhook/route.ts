import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Stripe Webhook handler (runtime only).
 * - Guards when keys are missing (returns 503, does not crash build)
 * - Verifies signature using raw body
 */
export async function POST(req: Request) {
  try {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    const key = process.env.STRIPE_SECRET_KEY;

    if (!secret || !key) {
      return NextResponse.json(
        { ok: false, error: "stripe_unconfigured" },
        { status: 503 },
      );
    }

    const sig = req.headers.get("stripe-signature");
    if (!sig) {
      return NextResponse.json(
        { ok: false, error: "missing_signature" },
        { status: 400 },
      );
    }

    const raw = await req.text();
    const { default: Stripe } = await import("stripe");
    // @ts-expect-error apiVersion typing can differ by package version
    const stripe = new Stripe(key, { apiVersion: "2024-06-20" });

    let event: any;
    try {
      event = stripe.webhooks.constructEvent(raw, sig, secret);
    } catch (e: any) {
      return NextResponse.json(
        { ok: false, error: "invalid_signature", detail: e?.message },
        { status: 400 },
      );
    }

    // Minimal handler (log and 200). Expand as needed.
    console.log("stripe.webhook event:", event.type);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("stripe.webhook fatal:", e);
    return NextResponse.json(
      { ok: false, error: "stripe_error", detail: e?.message },
      { status: 500 },
    );
  }
}

// Optional: simple GET for health checks
export async function GET() {
  return NextResponse.json({ ok: true, endpoint: "stripe_webhook" });
}
