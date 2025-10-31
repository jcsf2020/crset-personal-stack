import { NextResponse } from "next/server";
import { Resend } from "resend";
export const dynamic = "force-dynamic";

type Payload = {
  to?: string;
  subject?: string;
  message?: string;
  from?: string;
  token?: string;
};

function isPreview() {
  return process.env.VERCEL_ENV === "preview" || process.env.NEXT_PUBLIC_VERCEL_ENV === "preview" || process.env.NODE_ENV !== "production";
}

function json(body: any, init: ResponseInit = {}) {
  return new NextResponse(JSON.stringify(body), {
    ...init,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...(init.headers || {}) },
  });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const params = Object.fromEntries(url.searchParams.entries());
  return json({ ok: true, hint: "Use POST with JSON {to, subject, message, from?, token?}. In production set TEST_EMAIL_TOKEN and include ?token= or payload.token.", echo: params });
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Payload;

  // Auth: in production require TEST_EMAIL_TOKEN to match payload token (or ?token=)
  const url = new URL(req.url);
  const qToken = url.searchParams.get("token") || undefined;
  const token = body.token ?? qToken;
  const needsToken = !isPreview();
  const requiredToken = process.env.TEST_EMAIL_TOKEN || "";

  if (needsToken) {
    if (!requiredToken) return json({ ok: false, error: "server_token_missing", msg: "Set TEST_EMAIL_TOKEN in env" }, { status: 500 });
    if (!token) return json({ ok: false, error: "client_token_missing", msg: "Provide token in body.token or ?token=" }, { status: 401 });
    if (token !== requiredToken) return json({ ok: false, error: "token_invalid" }, { status: 403 });
  }

  const to = body.to;
  const subject = body.subject;
  const message = body.message;
  const from = body.from || process.env.RESEND_FROM || "no-reply@crsetsolutions.com";

  if (!to || !subject || !message) {
    return json({ ok: false, error: "missing_fields", need: ["to", "subject", "message"] }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return json({ ok: false, error: "resend_api_key_missing" }, { status: 500 });

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      text: message,
    });
    if (error) return json({ ok: false, error: "resend_error", detail: String(error) }, { status: 502 });
    return json({ ok: true, id: data?.id || null });
  } catch (e: any) {
    return json({ ok: false, error: "send_exception", detail: e?.message || String(e) }, { status: 500 });
  }
}
