import crypto from "crypto";

const ALG = "HS256"; // HMAC-SHA256

function b64url(input: Buffer | string) {
  const b = Buffer.isBuffer(input) ? input : Buffer.from(input);
  return b.toString("base64").replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_");
}

export function sign(payload: Record<string, any>, secret: string, expSec = 60*60*8) {
  const header = { alg: ALG, typ: "JWT" };
  const now = Math.floor(Date.now()/1000);
  const body = { iat: now, exp: now + expSec, ...payload };
  const head = b64url(JSON.stringify(header));
  const bod  = b64url(JSON.stringify(body));
  const data = `${head}.${bod}`;
  const sig  = crypto.createHmac("sha256", secret).update(data).digest();
  return `${data}.${b64url(sig)}`;
}

export function verify(token: string, secret: string): null | Record<string, any> {
  try {
    const [head, bod, sig] = token.split(".");
    if (!head || !bod || !sig) return null;
    const data = `${head}.${bod}`;
    const expected = b64url(crypto.createHmac("sha256", secret).update(data).digest());
    if (expected !== sig) return null;
    const payload = JSON.parse(Buffer.from(bod.replace(/-/g,"+").replace(/_/g,"/"), "base64").toString("utf8"));
    const now = Math.floor(Date.now()/1000);
    if (typeof payload.exp === "number" && payload.exp < now) return null;
    return payload;
  } catch {
    return null;
  }
}
