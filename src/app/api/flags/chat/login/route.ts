import { NextResponse } from "next/server";
import crypto from "crypto";
import { ChatFlag } from "@/lib/chatFlag";

function safeEqHex(a: string, b: string) {
  const ab = Buffer.from(a, "hex");
  const bb = Buffer.from(b, "hex");
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

export async function POST(req: Request) {
  const resInit: ResponseInit = {
    headers: { "Cache-Control": "no-store, max-age=0" },
  };

  const secret = process.env.CHAT_FLAG_SECRET;
  const salt = process.env.CHAT_PASS_SALT;
  const hash = process.env.CHAT_PASS_HASH;

  if (!secret || !salt || !hash) {
    return NextResponse.json(
      { ok: false, error: "server_not_configured" },
      { status: 500, ...resInit },
    );
  }

  let body: any = {};
  try { body = await req.json(); } catch {}
  const pwd = (body?.password ?? "") as string;
  if (!pwd) {
    return NextResponse.json({ ok: false, error: "missing_password" }, { status: 400, ...resInit });
  }

  const derived = crypto.scryptSync(pwd, salt, 32).toString("hex");
  const ok = safeEqHex(derived, hash);
  if (!ok) {
    return NextResponse.json({ ok: false, error: "bad_credentials" }, { status: 401, ...resInit });
  }

  const exp = Math.floor(Date.now()/1000) + 7*24*3600; // 7d
  const token = ChatFlag.createToken({ sub: "owner", exp, v: 1 });

  const res = NextResponse.json({ ok: true, allowed: true, reason: "login_ok" }, resInit);
  res.headers.append(
    "Set-Cookie",
    `${ChatFlag.COOKIE_NAME}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${7*24*3600}`
  );
  return res;
}

// Optional: logout (clear cookie)
export async function DELETE() {
  const res = NextResponse.json({ ok: true, reason: "logout" }, { headers: { "Cache-Control": "no-store" } });
  res.headers.append(
    "Set-Cookie",
    `${ChatFlag.COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`
  );
  return res;
}
