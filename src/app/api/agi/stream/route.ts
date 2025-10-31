export const runtime = 'edge';
export const dynamic = 'force-dynamic';

type Payload = { agent?: string; input: string; sessionId?: string };

function systemFor(agent: string) {
  const a = String(agent || '').toLowerCase();
  if (a === 'boris') return 'You are Boris: security, automation, DevOps. Be short and practical.';
  if (a === 'laya')  return 'You are Laya: comms and org. Be clear and action-oriented.';
  if (a === 'irina') return 'You are Irina: analytics and insights. Prefer bullets and metrics.';
  return 'You are a technical assistant. Be concise and useful.';
}

const clean = (s: string) => (s || '').trim().replace(/^['"]|['"]$/g, '').replace(/\/+$/, '');

function corsHeaders(origin?: string) {
  const allowed = (process.env.AGI_ALLOWED_ORIGINS || 'self')
    .split(',').map(s => s.trim()).filter(Boolean);
  let allow = '';
  if (origin) {
    if (allowed.includes('*')) allow = origin;
    if (!allow && allowed.includes('self')) {
      const self = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '';
      if (origin === self) allow = origin;
    }
    if (!allow && allowed.some(o => o && origin.startsWith(o))) allow = origin;
  }
  return {
    ...(allow ? { 'access-control-allow-origin': allow } : {}),
    'access-control-allow-methods': 'GET,POST,OPTIONS',
    'access-control-allow-headers': 'content-type, authorization',
  };
}

export function OPTIONS(req: Request) {
  return new Response(null, { status: 204, headers: corsHeaders(req.headers.get('origin') || undefined) });
}

export async function POST(req: Request) {
  // gate
  const gate = (process.env.AGI_API_KEY || '').trim();
  if (gate) {
    const auth = req.headers.get('authorization') || '';
    if (auth !== 'Bearer ' + gate) {
      return new Response('unauthorized', { status: 401, headers: corsHeaders(req.headers.get('origin') || undefined) });
    }
  }

  const origin = req.headers.get('origin') || undefined;

  // body
  let body: Payload;
  try { body = await req.json(); } catch { return new Response('bad_json', { status: 400, headers: corsHeaders(origin) }); }
  const agent = (body.agent || 'boris').toLowerCase();
  const input = (body.input || '').trim();
  if (!input) return new Response('empty_input', { status: 400, headers: corsHeaders(origin) });
  if (input.length > 2000) return new Response('too_long', { status: 413, headers: corsHeaders(origin) });

  // env
  const prefer = (process.env.AGI_BACKEND || 'mock').trim().toLowerCase();
  const base   = (process.env.AGI_OPENAI_BASE_URL || 'https://api.openai.com/v1').trim();
  const model  = (process.env.AGI_OPENAI_MODEL || 'gpt-4o-mini').trim();
  const key    = (process.env.OPENAI_API_KEY || '').trim();

  const commonHeaders: Record<string, string> = {
    ...corsHeaders(origin),
    'cache-control': 'no-store',
    'content-type': 'text/event-stream; charset=utf-8',
    'x-accel-buffering': 'no',
    'x-agi-upstream-base': clean(base),
    'x-agi-upstream-model': model,
  };

  // mock fallback
  if (prefer !== 'openai' || !key) {
    const enc = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        const send = (s: string, d = 0) => setTimeout(() => controller.enqueue(enc.encode(s)), d);
        send(`event: meta\ndata: {"backend":"mock"}\n\n`, 0);
        send(`data: {"choices":[{"delta":{"content":"[MOCK] "}}]}\n\n`, 50);
        send(`data: {"choices":[{"delta":{"content":"streaming "}}]}\n\n`, 120);
        send(`data: {"choices":[{"delta":{"content":"ativo"}}]}\n\n`, 190);
        send(`data: [DONE]\n\n`, 260);
        setTimeout(() => controller.close(), 300);
      }
    });
    return new Response(stream, { headers: { ...commonHeaders, 'x-agi-backend': 'mock', 'x-agi-mock': '1' } });
  }

  // openai-compat (Groq) pass-through
  const url = clean(base) + '/chat/completions';
  const upstream = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: 'Bearer ' + key },
    body: JSON.stringify({
      model,
      stream: true,
      temperature: 0.2,
      messages: [
        { role: 'system', content: systemFor(agent) },
        { role: 'user',   content: input }
      ]
    })
  });

  if (!upstream.ok || !upstream.body) {
    return new Response('upstream_error_' + upstream.status, {
      status: 502,
      headers: { ...corsHeaders(origin), 'content-type': 'text/plain; charset=utf-8' }
    });
  }

  // devolve o body do upstream tal-e-qual (SSE)
  return new Response(upstream.body, { headers: { ...commonHeaders, 'x-agi-backend': 'openai' } });
}
