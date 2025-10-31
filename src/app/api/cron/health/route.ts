export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import type { NextRequest } from 'next/server';

function headers() {
  const H = new Headers();
  H.set('content-type','application/json; charset=UTF-8');
  H.set('cache-control','no-store, no-cache, must-revalidate, private');
  H.set('x-content-type-options','nosniff');
  H.set('referrer-policy','strict-origin-when-cross-origin');
  H.set('permissions-policy','camera=(), microphone=(), geolocation=()');
  return H;
}

export async function GET(req: NextRequest) {
  const H = headers();
  const url = new URL(req.url);
  const SECRET = process.env.CRON_SECRET || '';

  const xWebhook = req.headers.get('x-webhook-secret') || '';
  const auth = req.headers.get('authorization') || '';
  const bearer = auth.toLowerCase().startsWith('bearer ') ? auth.slice(7).trim() : '';
  const vercelCron = req.headers.get('x-vercel-cron') === '1';
  const key = url.searchParams.get('key') || url.searchParams.get('token') || '';

  const ok =
    vercelCron ||
    (SECRET && (xWebhook === SECRET || bearer === SECRET || key === SECRET));

  if (!ok) return new Response('forbidden', { status: 403, headers: H });

  return new Response(JSON.stringify({ ok: true, src: url.searchParams.get('src') || undefined }), { status: 200, headers: H });
}
