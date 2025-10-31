import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      return NextResponse.json(
        { ok: false, error: "stripe_unconfigured" },
        { status: 503 },
      );
    }
    if (!id) {
      return NextResponse.json(
        { ok: false, error: "missing_id" },
        { status: 400 },
      );
    }

    const { default: Stripe } = await import("stripe");
    // @ts-expect-error apiVersion typing can differ by package version
    const stripe = new Stripe(key, { apiVersion: "2024-06-20" });

    const sess = await stripe.checkout.sessions.retrieve(id);
    return NextResponse.json({
      ok: true,
      session: {
        id: sess.id,
        status: sess.status,
        mode: sess.mode,
        payment_status: sess.payment_status,
        amount_total: sess.amount_total,
        currency: (sess as any).currency,
      },
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: "stripe_error", detail: e?.message },
      { status: 500 },
    );
  }
}
