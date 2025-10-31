import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ ok: true, ts: new Date().toISOString() });
}

/**
 * POST /api/status - AI Chat functionality
 * Using existing working endpoint to bypass Vercel routing issues
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, language = 'pt', action } = body;

    // If action is 'chat', handle chat request
    if (action === 'chat') {
      if (!message || typeof message !== 'string') {
        return NextResponse.json(
          { ok: false, error: 'invalid_message' },
          { status: 400 }
        );
      }

      // Query RAG for context
      let context = '';
      let sources: any[] = [];

      try {
        const ragResponse = await fetch(`${req.nextUrl.origin}/api/rag/query`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message, language }),
        });

        if (ragResponse.ok) {
          const ragData = await ragResponse.json();
          if (ragData.ok && ragData.documents && ragData.documents.length > 0) {
            context = ragData.documents
              .slice(0, 3)
              .map((doc: any) => doc.content)
              .join('\n\n');

            sources = ragData.documents.slice(0, 3).map((doc: any) => ({
              title: doc.metadata?.title || 'Document',
              url: doc.metadata?.url || '#',
              similarity: doc.similarity,
            }));
          }
        }
      } catch (error) {
        console.error('RAG query failed:', error);
      }

      // Call LLM
      const apiKey = process.env.OPENAI_API_KEY;
      const baseUrlRaw = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
      const model = process.env.AGI_OPENAI_MODEL || process.env.AGI_MODEL || 'gpt-4o-mini';

      if (!apiKey) {
        return NextResponse.json(
          { ok: false, error: 'llm_not_configured' },
          { status: 500 }
        );
      }

      const baseUrl = baseUrlRaw.replace(/^["']|["']$/g, '').replace(/\/+$/, '');

      const systemPrompt = language === 'pt'
        ? `Voce e um assistente virtual da CRSET Solutions, especializada em automacao inteligente, ciberseguranca e desenvolvimento de software. Seja prestativo, profissional e conciso.${context ? `\n\nContexto relevante:\n${context}` : ''}`
        : `You are a virtual assistant for CRSET Solutions, specialized in intelligent automation, cybersecurity, and software development. Be helpful, professional, and concise.${context ? `\n\nRelevant context:\n${context}` : ''}`;

      const llmResponse = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!llmResponse.ok) {
        const errorText = await llmResponse.text();
        console.error('LLM failed:', llmResponse.status, errorText);
        return NextResponse.json(
          { ok: false, error: 'llm_request_failed', status: llmResponse.status, details: errorText.substring(0, 300) },
          { status: 500 }
        );
      }

      const llmData = await llmResponse.json();
      const reply = llmData.choices?.[0]?.message?.content || 'Desculpe, nao consegui processar a sua mensagem.';

      return NextResponse.json({
        ok: true,
        message: reply.trim(),
        sources: sources.length > 0 ? sources : undefined,
        timestamp: Date.now(),
      });
    }

    // Default response for non-chat POST requests
    return NextResponse.json({ ok: true, ts: new Date().toISOString() });

  } catch (error: any) {
    console.error('Status endpoint error:', error);
    return NextResponse.json(
      { ok: false, error: 'internal_server_error', details: error.message, stack: error.stack?.substring(0, 500) },
      { status: 500 }
    );
  }
}

