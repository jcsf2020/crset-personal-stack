import { cookies } from "next/headers";
import { verify } from "@/lib/jwt";

export function bearerFrom(req: Request) {
  const h = req.headers.get("authorization") || "";
  const m = /^bearer\s+(.+)$/i.exec(h);
  return m?.[1] || null;
}

export function cookieAdminJWT(): string | null {
  // next/headers le cookies em runtime server
  const c = cookies().get("admin_jwt");
  return c?.value || null;
}

export function isAuthorized(req: Request, jwtSecret: string, acceptBearer=true, acceptCookie=true): boolean {
  if (!jwtSecret) return false;
  const fromBearer = acceptBearer ? bearerFrom(req) : null;
  if (fromBearer && verify(fromBearer, jwtSecret)) return true;
  const fromCookie = acceptCookie ? cookieAdminJWT() : null;
  if (fromCookie && verify(fromCookie, jwtSecret)) return true;
  return false;
}
