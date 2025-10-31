
import { NextRequest, NextResponse } from "next/server";

import { ChatFlag } from "@/lib/chatFlag";



export const runtime = "nodejs";

export const dynamic = "force-dynamic";



const JSON_UTF8 = { "content-type": "application/json; charset=utf-8" } as const;



function extractText(body: any): { agent: string; input: string } {

  if (!body) return { agent: "boris", input: "" };

  const agent = String(body.agent ?? body.role ?? "boris").toLowerCase().trim();

  const fromMessages =

    Array.isArray(body.messages)

      ? body.messages

          .map((m: any) => (typeof m === "string" ? m : (m?.content ?? "")))

          .filter(Boolean)

          .join("\n")

      : null;

  const input = String(body.input ?? body.text ?? body.message ?? body.prompt ?? fromMessages ?? "").trim();

  return { agent: agent || "boris", input };

}



function systemFor(agent: string) {

  const a = String(agent || "").toLowerCase();

  if (a === "boris") return "You are Boris: security, automation, DevOps. Be short and practical.";

  if (a === "laya")  return "You are Laya: comms and org. Be clear and action-oriented.";

  if (a === "irina") return "You are Irina: analytics and insights. Prefer bullets and metrics.";

  return "You are a technical assistant. Be concise and useful.";

}



function clean(s: string) {

  return (s || "").trim().replace(/^['"]|['"]$/g, "").replace(/\/+$/, "");

}



function gate(req: NextRequest) {

  const isPreview =

    process.env.NEXT_PUBLIC_CHAT_PUBLIC === "true" ||

    process.env.VERCEL_ENV === "preview" ||

    process.env.NEXT_PUBLIC_VERCEL_ENV === "preview";

  if (isPreview) return null;



  try {

    const allow = (process.env.CHAT_ALLOWLIST_IPS || "").split(",").map(s => s.trim()).filter(Boolean);

    const ip =

      (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||

      (req as any).ip ||

      req.headers.get("x-real-ip") ||

      "";

    if (ip && allow.includes(ip)) return null;



    const tok = req.cookies.get(ChatFlag.COOKIE_NAME)?.value || "";

    const v = ChatFlag.verifyToken(tok);

    if (!v || !v.ok) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401, headers: JSON_UTF8 });

    return null;

  } catch {

    return NextResponse.json({ ok: false, error: "forbidden" }, { status: 403, headers: JSON_UTF8 });

  }

}



async function askUpstream(base: string, key: string, model: string, agent: string, input: string, timeoutMs: number) {

  const url = clean(base) + "/chat/completions";

  const ctrl = new AbortController();

  const t = setTimeout(() => ctrl.abort("timeout"), timeoutMs);

  try {

    const res = await fetch(url, {

      method: "POST",

      signal: ctrl.signal,

      headers: {

        "content-type": "application/json",

        authorization: "Bearer " + key,

      },

      body: JSON.stringify({

        model,

        stream: false,

        temperature: 0.2,

        messages: [

          { role: "system", content: systemFor(agent) },

          { role: "user", content: input },

        ],

      }),

    });

    if (!res.ok) {

      const text = await res.text().catch(() => "");

      throw new Error(`upstream_${res.status}:${text.slice(0, 200)}`);

    }

    const json: any = await res.json();

    const reply = String(json?.choices?.[0]?.message?.content ?? "").trim();

    return reply || "(empty)";

  } finally {

    clearTimeout(t);

  }

}



export async function POST(req: NextRequest) {

  const gated = gate(req);

  if (gated) return gated;



  let body: any = {};

  try {

    if (req.headers.get("content-type")?.includes("application/json")) {

      body = await req.json();

    }

  } catch {}



  const { agent, input } = extractText(body);

  if (!input) return NextResponse.json({ ok: false, error: "empty_input" }, { status: 400, headers: JSON_UTF8 });

  if (input.length > 2000)

    return NextResponse.json({ ok: false, error: "too_long", max: 2000 }, { status: 413, headers: JSON_UTF8 });



  const prefer = (process.env.AGI_BACKEND || "openai").trim().toLowerCase();

  const base =

    clean(

      process.env.AGI_OPENAI_BASE_URL ||

        process.env.OPENAI_BASE_URL ||

        process.env.AGI_UPSTREAM_BASE ||

        "https://api.openai.com/v1",

    );

  const key = (process.env.AGI_OPENAI_KEY || process.env.OPENAI_API_KEY || "").trim();

  const model = (process.env.AGI_OPENAI_MODEL || process.env.AGI_MODEL || "gpt-4o-mini").trim();

  const timeoutMs = Number(process.env.AGI_UPSTREAM_TIMEOUT_MS || 20000);



  let reply = `(${agent}) mock online — backend=mock`;

  let used: "mock" | "openai" = "mock";

  let error = "";



  if (prefer === "openai" && key && base) {

    try {

      reply = await askUpstream(base, key, model, agent, input, timeoutMs);

      used = "openai";

    } catch (e: any) {

      used = "mock";

      error = String(e?.message || e);

      reply = "Sem ligação ao backend neste momento. Tenta novamente.";

    }

  }



  return NextResponse.json(

    { ok: true, reply, message: reply, meta: { backend: used, upstream_base: base, model, agent }, ...(error ? { error } : {}) },

    { headers: JSON_UTF8 },

  );

}



export function GET() {

  return NextResponse.json({ error: "method_not_allowed" }, { status: 405, headers: JSON_UTF8 });

}

