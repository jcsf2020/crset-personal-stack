import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { ChatFlag } from "@/lib/chatFlag";

function getIP(): string | null {
  const h = headers();
  const xff = h.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() || null;
  const cf = h.get("cf-connecting-ip");
  if (cf) return cf;
  const real = h.get("x-real-ip");
  if (real) return real;
  return null;
}

function inAllowlistIP(ip: string | null): boolean {
  if (!ip) return false;
  const raw = process.env.CHAT_ALLOWLIST_IPS || "";
  const list = raw.split(",").map(s => s.trim()).filter(Boolean);
  return list.includes(ip);
}

export async function GET(request: Request) {
  // No-cache always
  const resInit: ResponseInit = {
    headers: {
      "Cache-Control": "no-store, max-age=0",
      "Content-Type": "application/json; charset=utf-8",
    },
  };

  // If secret is missing, default to closed (safer)
  if (!process.env.CHAT_FLAG_SECRET) {
    return new NextResponse(JSON.stringify({ ok: true, allowed: false, reason: "secret_missing" }), resInit);
  }

  // Check if in preview environment - allow free access
  const isPreview = process.env.VERCEL_ENV === "preview" || 
                    process.env.NEXT_PUBLIC_VERCEL_ENV === "preview" ||
                    process.env.NEXT_PUBLIC_CHAT_PUBLIC === "true";

  if (isPreview) {
    return new NextResponse(JSON.stringify({ 
      ok: true, allowed: true, reason: "preview_mode" 
    }), resInit);
  }

  const ip = getIP();

  // Allowlist by IP (optional)
  if (inAllowlistIP(ip)) {
    return new NextResponse(JSON.stringify({ ok: true, allowed: true, reason: "allowlist_ip" }), resInit);
  }

  // Verify signed cookie token
  const cookie = (await import("next/headers")).cookies();
  const tok = cookie.get(ChatFlag.COOKIE_NAME)?.value;

  if (!tok) {
    return new NextResponse(JSON.stringify({ ok: true, allowed: false, reason: "no_cookie" }), resInit);
  }

  const v = ChatFlag.verifyToken(tok);
  if (!v.ok) {
    return new NextResponse(JSON.stringify({ ok: true, allowed: false, reason: v.reason }), resInit);
  }

  return new NextResponse(JSON.stringify({ ok: true, allowed: true, reason: "valid" }), resInit);
}
