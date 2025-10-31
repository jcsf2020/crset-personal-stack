'use server';

export async function agiChat(
  input: string,
  agent = 'boris',
  sessionId = 't1'
) {
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

  const res = await fetch(`${origin}/api/agi/chat`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: 'Bearer ' + (process.env.AGI_API_KEY || ''),
    },
    body: JSON.stringify({ agent, input, sessionId }),
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(`AGI ${res.status}`);
  return await res.text(); // ex: "OK"
}
