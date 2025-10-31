import * as Sentry from '@sentry/nextjs';

function initSentry() {
  try {
    // Avoid double-init in dev/serverless
    // @ts-ignore
    const client = Sentry.getCurrentHub().getClient?.();
    if (!client) {
      Sentry.init({
        dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,
        environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV || 'production',
        tracesSampleRate: 0,
      });
    }
  } catch {}
}

export async function GET() {
  initSentry();
  const eventId = Sentry.captureMessage('SENTRY DEBUG PING /api/debug/sentry');
  await Sentry.flush(2000);
  return new Response(JSON.stringify({ ok: true, eventId }), {
    headers: { 'content-type': 'application/json' },
  });
}

export async function POST() {
  initSentry();
  try {
    throw new Error('SENTRY DEBUG ERROR /api/debug/sentry');
  } catch (err) {
    const eventId = Sentry.captureException(err);
    await Sentry.flush(2000);
    return new Response(JSON.stringify({ ok: true, eventId }), {
      headers: { 'content-type': 'application/json' },
    });
  }
}
