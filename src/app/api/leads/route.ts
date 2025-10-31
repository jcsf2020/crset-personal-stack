import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseServer";

export async function GET() {
  return NextResponse.json({ ok: true, method: "GET", endpoint: "/api/leads" }, { status: 200 });
}

export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Allow': 'GET, HEAD, OPTIONS, POST',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS, POST',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}

export async function POST(req: Request) {
  try {
    const auth = req.headers.get("authorization") || "";
    if (!auth.endsWith("SMOKE")) {
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const lead = {
      name: body.name,
      email: body.email,
      phone: body.phone,
      source: body.source ?? "site",
      utm_source: body.utm_source ?? null,
      test: !!body.test,
      ts: new Date().toISOString(),
    };

    const supabase = getSupabaseAdmin(); // cria só em runtime
    const { error } = await supabase.from("leads").insert(lead);
    if (error) {
      console.error("supabase.insert error:", error);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, lead }, { status: 200 });
  } catch (e: any) {
    console.error("leads.POST fatal:", e);
    return NextResponse.json({ ok: false, error: e?.message ?? "fatal" }, { status: 500 });
  }
}
