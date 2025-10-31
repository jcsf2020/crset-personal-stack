export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { isAuthorized } from '@/lib/authGuard';

const NOTION_VERSION = '2022-06-28';

type NotionPage = {
  created_time: string;
  properties?: Record<string, any>;
};
type NotionQueryResult = {
  results: NotionPage[];
  has_more?: boolean;
  next_cursor?: string | null;
};

type Item = { when: string; utm: string };

async function fetchAll(): Promise<{ results: NotionPage[] } | null | { error: string; detail: string; items: any[]; total: number }> {
  const key = process.env.NOTION_API_KEY as string | undefined;
  const db  = process.env.NOTION_DATABASE_ID as string | undefined;
  if (!key || !db) return null;

  const headers: Record<string, string> = {
    Authorization: `Bearer ${key}`,
    'Notion-Version': NOTION_VERSION,
    'Content-Type': 'application/json',
  };

  let hasMore = true;
  let cursor: string | null = null;
  const results: NotionPage[] = [];

  // Ate 5 paginas de 100 = 500 itens max (protecao de custo/latencia)
  for (let i = 0; i < 5 && hasMore; i++) {
    const body: Record<string, any> = {
      page_size: 100,
      sorts: [{ timestamp: 'created_time', direction: 'descending' }],
    };
    if (cursor) body.start_cursor = cursor;

    const r = await fetch(`https://api.notion.com/v1/databases/${db}/query`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    if (!r.ok) {
      return {
        error: `notion_${r.status}`,
        detail: await r.text().catch(() => ''),
        items: [],
        total: 0,
      };
    }

    const j = (await r.json()) as NotionQueryResult;
    results.push(...(j.results || []));
    hasMore = Boolean(j.has_more);
    cursor = (j.next_cursor ?? null) as string | null;
  }

  return { results };
}

export async function GET() {
  try {
    const res = await fetchAll();
    if (res === null) return NextResponse.json({ error: 'no_env' });
    if ((res as any).error) return NextResponse.json(res);

    const results = (res as { results: NotionPage[] }).results || [];

    const toItem = (p: NotionPage): Item => {
      const pr = p.properties || {};
      const when: string =
        pr['Data/Hora']?.date?.start ||
        (p as any).created_time ||
        new Date().toISOString();

      const utm: string =
        pr['Origem/UTM']?.rich_text?.[0]?.plain_text ||
        pr['UTM']?.rich_text?.[0]?.plain_text ||
        pr['Origem']?.rich_text?.[0]?.plain_text ||
        pr['Source']?.rich_text?.[0]?.plain_text ||
        '';

      return { when, utm };
    };

    const items: Item[] = results.map(toItem);

    const now = Date.now();
    const D = (ms: number) => new Date(ms).toISOString().slice(0, 10);

    const total = items.length;
    const last24h = items.filter((i: Item) => now - new Date(i.when).getTime() <= 24 * 3600 * 1000).length;
    const last7d  = items.filter((i: Item) => now - new Date(i.when).getTime() <= 7  * 24 * 3600 * 1000).length;

    const byUtm: Record<string, number> = {};
    for (const it of items) {
      const k = (it.utm || '').trim() || '(none)';
      byUtm[k] = (byUtm[k] || 0) + 1;
    }
    const top_utm = Object.entries(byUtm).sort((a, b) => b[1] - a[1]).slice(0, 5);

    const by_day_raw: Record<string, number> = {};
    for (const it of items) {
      const k = D(new Date(it.when).getTime());
      by_day_raw[k] = (by_day_raw[k] || 0) + 1;
    }

    const days = Array.from({ length: 14 }, (_: unknown, i: number) => D(now - (13 - i) * 24 * 3600 * 1000));
    const by_day = days.map((d: string) => ({ date: d, count: by_day_raw[d] || 0 }));

    return NextResponse.json({ total, last24h, last7d, top_utm, by_day });
  } catch (e: any) {
    return NextResponse.json({ error: 'metrics_failed', detail: String(e?.message || e) }, { status: 500 });
  }
}
export async function POST(req: Request) {
  try {
    const data = await req.json().catch(() => ({}));
    return NextResponse.json({ ok: true, received: data, ts: new Date().toISOString() }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: "metrics_post_failed", detail: String(e?.message || e) }, { status: 500 });
  }
}
