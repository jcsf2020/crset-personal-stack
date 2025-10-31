import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || "";

// stringify estável (ordena chaves)
function stableStringify(x: any): string {
  if (x === null || typeof x !== "object") return JSON.stringify(x);
  if (Array.isArray(x)) return `[${x.map(stableStringify).join(",")}]`;
  return `{${Object.keys(x).sort().map(k => JSON.stringify(k)+":"+stableStringify(x[k])).join(",")}}`;
}
function sha256(s: string) {
  return crypto.createHash("sha256").update(s).digest("hex");
}
function bucket120s(now = Date.now()) {
  return Math.floor(now / 1000 / 120); // janela 120s
}

// Tenta registar (key_hash,bucket). Se já existir => duplicado.
export async function acquireContactOnce(payload: unknown): Promise<boolean> {
  const supa = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false }});
  const key_hash = sha256(stableStringify(payload));
  const bucket = bucket120s();

  const { error } = await supa.from("contact_dedupe")
    .insert({ key_hash, bucket })
    .select("key_hash")
    .single();

  if (!error) return true;               // inseriu -> enviar email
  if ((error as any)?.code === "23505")  // unique_violation
    return false;                        // já tratado nesta janela
  throw error;                           // outro erro -> rebenta (para logar)
}
