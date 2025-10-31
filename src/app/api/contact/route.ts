import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { Resend } from "resend";
import { acquireContactOnce } from "@/lib/idempotency";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = { 
  name?: string; 
  email?: string; 
  message?: string; 
  phone?: string;
  source?: string;
  utm?: string | object; 
  metadata?: object;
};

function bad(msg: string, code = 400) {
  return NextResponse.json({ ok: false, error: msg }, { status: code });
}

// Função para normalizar UTM (objeto/string)
function parseUtm(utm: string | object | undefined): object | null {
  if (!utm) return null;
  
  if (typeof utm === 'string') {
    try {
      return JSON.parse(utm);
    } catch {
      return { raw: utm };
    }
  }
  
  if (typeof utm === 'object') {
    return utm;
  }
  
  return null;
}

export async function POST(req: Request) {
  try {
    const { name, email, message, phone, source, utm, metadata }: Body = await req.json().catch(() => ({} as any));
    if (!name || !email || !message) return bad("bad_request");

// Idempotência (120s) — evita duplicados quase simultâneos
try {
  const rawForKey = { name, email, message, phone: phone ?? null, source: source ?? null, utm: utm ?? null, metadata: metadata ?? null };
  if (!(await acquireContactOnce(rawForKey))) {
    return NextResponse.json({ ok: true, deduped: true });
  }
} catch (e) {
  // Não bloquear o fluxo se o cadeado falhar; só regista
  Sentry.captureException(e);
  await Sentry.flush(100);
}

    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceKey) return bad("supabase_unconfigured", 503);

    // Processar UTM - aceitar string JSON ou objeto
    const utmProcessed = parseUtm(utm);

    // Embeber metadata em utm._metadata se ambos existirem
    let finalUtm = utmProcessed;
    if (utmProcessed && metadata) {
      finalUtm = { ...utmProcessed, _metadata: metadata };
    } else if (!utmProcessed && metadata) {
      finalUtm = { _metadata: metadata };
    }

    // Preparar dados para Supabase - defensivo para colunas que podem existir
    const supabaseData: any = {
      name,
      email,
      message
    };

    // Adicionar campos opcionais se fornecidos
    if (phone) supabaseData.phone = phone;
    if (source) supabaseData.source = source;
    if (finalUtm) supabaseData.utm = finalUtm;

    // Preencher colunas UTM individuais se existirem no objeto UTM (defensivo)
    if (finalUtm && typeof finalUtm === 'object') {
      const utmObj = finalUtm as any;
      if (utmObj.utm_source) supabaseData.utm_source = utmObj.utm_source;
      if (utmObj.utm_medium) supabaseData.utm_medium = utmObj.utm_medium;
      if (utmObj.utm_campaign) supabaseData.utm_campaign = utmObj.utm_campaign;
      if (utmObj.utm_content) supabaseData.utm_content = utmObj.utm_content;
    }

    // 1) Upsert em Supabase (idempotente por email, numa só chamada)
    let supabaseSuccess = false;
    try {
      const upsert = await fetch(supabaseUrl + '/rest/v1/leads?on_conflict=email', {
        method: 'POST',
        headers: {
          apikey: serviceKey,
          Authorization: 'Bearer ' + serviceKey,
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates,return=representation',
        },
        body: JSON.stringify(supabaseData),
        cache: 'no-store',
      });

      if (upsert.ok) {
        supabaseSuccess = true;
      } else {
        const detail = await upsert.text().catch(() => '');
        Sentry.captureException(new Error('Supabase upsert failed: ' + upsert.status + ' '+ detail));
        await Sentry.flush(2000);
      }
    } catch (supabaseError) {
      Sentry.captureException(supabaseError);
      await Sentry.flush(2000);
    }

      // 2) Email via Resend (sempre enviar)

    const from = process.env.RESEND_FROM || "CRSET <onboarding@resend.dev>";
    const to = process.env.CONTACT_TO || process.env.ALERT_TO || "crsetsolutions@gmail.com";
    
    let emailSuccess = false;
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      
      const emailResult = await resend.emails.send({
        from,
        to,
        subject: `Novo lead: ${name}`,
        html: `
          <h2>Novo lead recebido</h2>
          <p><strong>Nome:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Telefone:</strong> ${phone || "N/A"}</p>
          <p><strong>Mensagem:</strong></p>
          <p>${message}</p>
          <hr>
          <p><small>Source: ${source || "N/A"} | UTM: ${JSON.stringify(finalUtm || {})}</small></p>
        `,
      });

      if (emailResult.data?.id) {
        emailSuccess = true;
      } else {
        Sentry.captureException(new Error(`Resend failed: ${JSON.stringify(emailResult.error)}`));
        await Sentry.flush(2000);
      }
    } catch (emailError: any) {
      Sentry.captureException(emailError);
      await Sentry.flush(2000);
    }

    // 3) Contrato de resposta
    if (!supabaseSuccess && !emailSuccess) {
      // Falha total - não gravou e não enviou
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    // Sucesso (pelo menos um funcionou)
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    Sentry.captureException(e);
    await Sentry.flush(2000);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

// Opcional: health check
export async function GET() {
  return NextResponse.json({ ok: true, endpoint: "contact" });
}
