import { stripe, hasStripe, getPriceId, priceEnvSnapshot } from '@/lib/stripe';

export const runtime = 'nodejs';

function normalizeOrigin(s?: string | null) {
  if (!s) return 'https://crsetsolutions.com';
  return /^https?:\/\//.test(s) ? s : `https://${s}`;
}

export async function POST(req: Request) {
  try {
    const origin =
      normalizeOrigin(
        req.headers.get('origin') ||
        process.env.PRIMARY_HOST ||
        'https://crsetsolutions.com'
      );

    const { plan } = await req.json();
    const _snap = priceEnvSnapshot();
    console.log('[checkout] plan', plan, 'env', _snap, 'origin', origin);

    // Stripe desligado -> 503 controlado
    if (!hasStripe) {
      return Response.json({ ok: false, error: 'stripe_unconfigured' }, { status: 503 });
    }

    const price = getPriceId(String(plan || '').toLowerCase());
    // Sem PRICE IDs configurados -> 503 controlado
    if (!price) {
      return Response.json({ ok: false, error: 'stripe_unconfigured' }, { status: 503 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price, quantity: 1 }],
      success_url: `${origin}/precos?ok=1`,
      cancel_url: `${origin}/precos?cancel=1`,
      allow_promotion_codes: true,
    });

    return Response.json({ url: session.url });
  } catch (e: any) {
    console.error('[checkout] error', e?.message);
    return Response.json({ ok: false, error: 'CHECKOUT_ERROR' }, { status: 500 });
  }
}
