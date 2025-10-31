import { cookies } from "next/headers";
import { ChatFlag } from "@/lib/chatFlag";

export type GateResult = 
  | { allowed: true; reason: "valid_token" }
  | { allowed: false; reason: "no_cookie" | "invalid_token" | "expired" | "bad_sig" | "version" };

/**
 * checkChatGate - Verifica se o utilizador tem permissão para aceder ao chat
 * @param req - Request object (não utilizado nesta versão, mas mantido para compatibilidade)
 * @returns GateResult indicando se o acesso é permitido
 */
export async function checkChatGate(req?: Request): Promise<GateResult> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ChatFlag.COOKIE_NAME)?.value;

  if (!token) {
    return { allowed: false, reason: "no_cookie" };
  }

  const result = ChatFlag.verifyToken(token);
  
  if (!result.ok) {
    return { allowed: false, reason: result.reason as any };
  }

  return { allowed: true, reason: "valid_token" };
}
