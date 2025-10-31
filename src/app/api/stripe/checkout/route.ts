export const runtime = 'nodejs';
export async function POST() {
  return new Response('Deprecated: use /api/checkout', { status: 410 });
}
