export function isAllowedOrigin(h: Headers): boolean {
  const o = h.get("origin") || h.get("referer") || "";
  try {
    const u = new URL(o);
    const host = u.hostname;
    // Permite localhost, 127.0.0.1, *.vercel.app e (se tiver) DOMINIO PROPRIO
    const ok =
      host === "localhost" ||
      host === "127.0.0.1" ||
      /\.vercel\.app$/i.test(host) ||
      (process.env.NEXT_PUBLIC_APP_DOMAIN && host.endsWith(process.env.NEXT_PUBLIC_APP_DOMAIN));
    return !!ok;
  } catch { return false; }
}

export function withCors(res: Response) {
  const headers = new Headers(res.headers);
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Headers", "Authorization, Content-Type");
  headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  return new Response(res.body, { status: res.status, headers });
}
