export const runtime = 'nodejs';
import { NextResponse } from "next/server";
import { sign } from "@/lib/jwt";

function bad(msg: string, code=401){ return NextResponse.json({ok:false,error:msg},{status:code}); }

export async function POST(req: Request) {
  const { password } = await req.json().catch(()=>({}));
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";
  const JWT_SECRET = process.env.JWT_SECRET || "";
  if (!ADMIN_PASSWORD || !JWT_SECRET) return bad("server_not_configured",500);
  if (!password || password !== ADMIN_PASSWORD) return bad("invalid_credentials",401);

  const token = sign({ sub: "admin", role: "admin" }, JWT_SECRET, 60*60*8); // 8h
  const res = NextResponse.json({ ok:true });
  res.headers.set("Set-Cookie", [
    `admin_jwt=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${60*60*8}`,
  ].join(""));
  return res;
}
