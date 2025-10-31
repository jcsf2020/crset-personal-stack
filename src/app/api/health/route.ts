export async function GET(req: Request) {
  const origin = new URL(req.url).origin;
  const fe = (path: string) => `${origin}${path}`;

  const urls = [
    { name: 'fe_leads',   url: fe('/api/leads') },
    { name: 'fe_metrics', url: fe('/api/metrics') },
    { name: 'be_health',  url: 'https://crset-api-production.up.railway.app/health' },
  ];

  const checks = await Promise.all(urls.map(async (u) => {
    try {
      const t0 = Date.now();
      const r = await fetch(u.url, { cache: 'no-store' });
      const ms = Date.now() - t0;
      return { name: u.name, url: u.url, ok: r.ok, status: r.status, ms };
    } catch (e: any) {
      return { name: u.name, url: u.url, ok: false, status: 0, ms: -1, error: String(e?.message || e) };
    }
  }));

  return Response.json(
    { ts: new Date().toISOString(), env: process.env.ENVIRONMENT || 'production', checks },
    { headers: { 'Cache-Control': 'no-store, max-age=0, must-revalidate' } }
  );
}
