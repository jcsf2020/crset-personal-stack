import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/** Cria o client apenas em runtime (nunca na build) */
export function getSupabaseAdmin() {
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const srv = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !srv) {
    throw new Error("Supabase envs em falta em runtime (URL/SERVICE_ROLE).");
  }
  client = createClient(url, srv, { auth: { persistSession: false } });
  return client;
}
