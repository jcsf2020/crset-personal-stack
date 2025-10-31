export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { GET as getMetrics } from "../metrics/route";

export async function GET(req: Request) {
  try {
    // Chama diretamente a rota JSON
    const res = await getMetrics();
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      return new Response(`error: metrics ${res.status}${detail ? ` - ${detail}` : ""}`, { status: 500 });
    }

    const m = await res.json();
    const rows = [
      ["date", "count"],
      ...((m.by_day || []).map((d: any) => [d.date, String(d.count)])),
    ];

    const csv = rows
      .map(cols =>
        cols
          .map((v: string) =>
            /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v
          )
          .join(",")
      )
      .join("\n");

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": "attachment; filename=metrics.csv",
        "Cache-Control": "no-store, max-age=0, must-revalidate",
      },
    });
  } catch (e: any) {
    return new Response(`error: ${e?.message || String(e)}`, { status: 500 });
  }
}
