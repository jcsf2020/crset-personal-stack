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
import { getSupabaseAdmin } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  try {
    const { message, match_count = 3, similarity_threshold = 0.2 } = await req.json();
    
    if (!message) {
      return withCORS(new Response(
        JSON.stringify({ error: "message is required" }), 
        { status: 400 }
      ));
    }

    // Generate embedding for the query
    const queryEmbedding = await embed(message);
    
    // Search in Supabase using RPC function
    const supabase = getSupabaseAdmin();
    const { data: matches, error } = await supabase.rpc('match_documents', {
      query_embedding: JSON.stringify(queryEmbedding),
      match_threshold: similarity_threshold,
      match_count: match_count
    });

    if (error) {
      console.error('Supabase RPC error:', error);
      
      // If function doesn't exist, return helpful error
      if (error.message.includes('function') && error.message.includes('does not exist')) {
        return withCORS(new Response(
          JSON.stringify({ 
            ok: false,
            error: "database_not_configured",
            message: "RAG database not configured. Please run setup-supabase.sql first.",
            hint: "See scripts/rag-ingestion/setup-supabase.sql"
          }), 
          { status: 500 }
        ));
      }
      
      return withCORS(new Response(
        JSON.stringify({ 
          ok: false,
          error: "query_failed",
          message: error.message 
        }), 
        { status: 500 }
      ));
    }

    return withCORS(new Response(
      JSON.stringify({ 
        ok: true, 
        dim: queryEmbedding.length,
        match_count,
        similarity_threshold,
        matches: matches || []
      }), 
      { status: 200 }
    ));
  } catch (e: any) {
    console.error('Query error:', e);
    return withCORS(new Response(
      JSON.stringify({ error: e.message || "query failed" }), 
      { status: 500 }
    ));
  }
}

