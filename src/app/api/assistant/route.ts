import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/assistant
 * AI Assistant endpoint with RAG integration
 * Alternative to /api/chat while investigating Vercel routing issue
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, language = 'pt' } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { ok: false, error: 'invalid_message' },
        { status: 400 }
      );
    }

    // Step 1: Query RAG for context (optional, continue if fails)
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
      // Continue without RAG
    }

    // Step 2: Call LLM
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
        { ok: false, error: 'llm_request_failed' },
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

  } catch (error: any) {
    console.error('Assistant endpoint error:', error);
    return NextResponse.json(
      { ok: false, error: 'internal_server_error', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    endpoint: '/api/assistant',
    status: 'operational',
    description: 'AI Assistant with RAG integration',
  });
}

