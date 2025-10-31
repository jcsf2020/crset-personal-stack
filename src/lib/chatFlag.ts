import crypto from "crypto";

const COOKIE_NAME = "crset-chat";
const ALG = "sha256";

type Payload = {
  sub: string;   // "owner" por agora
  exp: number;   // unix seconds
  v: number;     // versao do token
};

function getSecret(): string {
  const s = process.env.CHAT_FLAG_SECRET;
  if (!s) throw new Error("CHAT_FLAG_SECRET not set");
  return s;
}

export function createToken(p: Payload): string {
  const secret = getSecret();
  const payload = Buffer.from(JSON.stringify(p)).toString("base64url");
  const sig = crypto
    .createHmac(ALG, secret)
    .update(payload)
    .digest("base64url");
  return `${payload}.${sig}`;
}

export function verifyToken(tok: string): { ok: true; payload: Payload } | { ok: false; reason: string } {
  try {
    const [payloadB64, sig] = tok.split(".");
    if (!payloadB64 || !sig) return { ok: false, reason: "malformed" };
    const secret = getSecret();
    const expected = crypto.createHmac(ALG, secret).update(payloadB64).digest("base64url");
    if (!timingSafeEq(sig, expected)) return { ok: false, reason: "bad_sig" };
    const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8")) as Payload;
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && now > payload.exp) return { ok: false, reason: "expired" };
    if (payload.v !== 1) return { ok: false, reason: "version" };
    return { ok: true, payload };
  } catch {
    return { ok: false, reason: "invalid" };
  }
}

// timing-safe compare
function timingSafeEq(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

export const ChatFlag = {
  COOKIE_NAME,
  createToken,
  verifyToken,
};
