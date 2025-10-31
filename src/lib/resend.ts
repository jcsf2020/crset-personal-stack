import { Resend } from "resend";

const key = (process.env.RESEND_API_KEY || "").trim();

/** Só cria o cliente se houver chave (evita throw no build). */
export const resend: Resend | null = key ? new Resend(key) : null;
