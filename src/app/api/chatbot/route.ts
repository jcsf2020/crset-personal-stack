import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/chatbot
 * Minimal chatbot endpoint for testing
 */
export async function POST(req: NextRequest) {
  try {
    // Parse JSON with proper error handling
    let body;
    try {
      body = await req.json();
    } catch (jsonError) {
      return NextResponse.json(
        { ok: false, error: 'invalid_json', message: 'Request body must be valid JSON' },
        { status: 400 }
      );
    }
    
    const { message, language = 'pt' } = body;

    if (!message) {
      return NextResponse.json({ ok: false, error: 'no_message' }, { status: 400 });
    }

    // Get env vars
    const apiKey = process.env.OPENAI_API_KEY;
    const baseUrlRaw = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
    const model = process.env.AGI_OPENAI_MODEL || 'gpt-4o-mini';

    if (!apiKey) {
      return NextResponse.json({ ok: false, error: 'api_key_missing' }, { status: 500 });
    }

    // Clean base URL (remove quotes if present)
    const baseUrl = baseUrlRaw.replace(/^["']|["']$/g, '').replace(/\/+$/, '');

    // Call LLM
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: language === 'pt'
              ? 'Voce e um assistente da CRSET Solutions. Seja prestativo e conciso.'
              : 'You are a CRSET Solutions assistant. Be helpful and concise.'
          },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { ok: false, error: 'llm_failed', details: errorText.substring(0, 200) },
        { status: 500 }
      );
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'Sem resposta';

    return NextResponse.json({
      ok: true,
      message: reply.trim(),
      timestamp: Date.now(),
    });

  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: 'internal_error', message: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    endpoint: '/api/chatbot',
    status: 'operational',
    timestamp: Date.now(),
  });
}

