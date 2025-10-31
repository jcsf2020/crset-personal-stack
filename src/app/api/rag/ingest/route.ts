export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'content-type,user-agent',
    },
  });
}

function withCORS(res: Response) { 
  res.headers.set('Access-Control-Allow-Origin','*'); 
  return res; 
}

import { embed } from "../_shared/embeddings";
import { rateLimiters, checkRateLimit, createRateLimitHeaders } from "@/lib/rateLimit";
import { getSupabaseAdmin } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  try {
    // Check rate limit (10 req/min per IP)
    const rateLimitResult = await checkRateLimit(req, rateLimiters.rag);
    
    if (rateLimitResult && !rateLimitResult.success) {
      const headers = createRateLimitHeaders(rateLimitResult);
      return withCORS(new Response(
        JSON.stringify({ 
          ok: false,
          error: "rate_limit_exceeded", 
          message: "Too many requests. Please try again later.",
          ...headers
        }), 
        { status: 429, headers }
      ));
    }

    const { text, metadata = {} } = await req.json();
    if (!text) {
      return withCORS(new Response(
        JSON.stringify({ error: "text is required" }), 
        { status: 400 }
      ));
    }

    // Generate embedding
    const embedding = await embed(text);
    
    // Store in Supabase
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('rag_documents')
      .insert({
        content: text,
        embedding: JSON.stringify(embedding), // Supabase vector type accepts JSON array
        metadata: metadata
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return withCORS(new Response(
        JSON.stringify({ 
          ok: false,
          error: "storage_failed",
          message: error.message 
        }), 
        { status: 500 }
      ));
    }

    const response = withCORS(new Response(
      JSON.stringify({ 
        ok: true, 
        id: data.id,
        dim: embedding.length,
        stored: true
      }), 
      { status: 200 }
    ));

    // Add rate limit headers to successful response
    if (rateLimitResult) {
      const headers = createRateLimitHeaders(rateLimitResult);
      Object.entries(headers).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
    }

    return response;
  } catch (e: any) {
    console.error('Ingest error:', e);
    return withCORS(new Response(
      JSON.stringify({ error: e.message || "ingest failed" }), 
      { status: 500 }
    ));
  }
}

