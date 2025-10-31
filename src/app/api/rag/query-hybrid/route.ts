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
import { hybridSearch, type SearchResult } from "@/lib/hybridSearch";

export async function POST(req: Request) {
  try {
    const { 
      message, 
      match_count = 5,
      similarity_threshold = 0.2,
      semantic_weight = 0.7,
      keyword_weight = 0.3,
      use_hybrid = true
    } = await req.json();
    
    if (!message) {
      return withCORS(new Response(
        JSON.stringify({ error: "message is required" }), 
        { status: 400 }
      ));
    }

    // Generate embedding for the query
    const queryEmbedding = await embed(message);
    
    // Get semantic search results from Supabase
    const supabase = getSupabaseAdmin();
    const { data: semanticMatches, error } = await supabase.rpc('match_documents', {
      query_embedding: JSON.stringify(queryEmbedding),
      match_threshold: similarity_threshold,
      match_count: match_count * 2 // Get more results for hybrid fusion
    });

    if (error) {
      console.error('Supabase RPC error:', error);
      
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

    let finalMatches = semanticMatches || [];

    // Apply hybrid search if enabled and we have results
    if (use_hybrid && finalMatches.length > 0) {
      try {
        const hybridResults = await hybridSearch(
          message,
          finalMatches as SearchResult[],
          {
            semanticWeight: semantic_weight,
            keywordWeight: keyword_weight,
            minSemanticScore: similarity_threshold,
            minBM25Score: 0.1
          }
        );

        // Limit to requested count
        finalMatches = hybridResults.slice(0, match_count);
      } catch (hybridError) {
        console.error('Hybrid search error:', hybridError);
        // Fallback to semantic-only results
        finalMatches = (semanticMatches || []).slice(0, match_count);
      }
    } else {
      // Use semantic-only results
      finalMatches = (semanticMatches || []).slice(0, match_count);
    }

    return withCORS(new Response(
      JSON.stringify({ 
        ok: true, 
        dim: queryEmbedding.length,
        match_count,
        similarity_threshold,
        hybrid_enabled: use_hybrid,
        semantic_weight,
        keyword_weight,
        matches: finalMatches,
        search_type: use_hybrid ? 'hybrid' : 'semantic'
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

