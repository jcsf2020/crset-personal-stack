import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/chat-debug
 * Debug version of chat endpoint with extensive logging
 */
export async function POST(req: NextRequest) {
  const logs: string[] = [];
  
  try {
    logs.push('1. Request received');
    
    const body = await req.json();
    logs.push(`2. Body parsed: ${JSON.stringify(body)}`);
    
    const { message } = body;
    if (!message) {
      return NextResponse.json({ ok: false, error: 'no_message', logs });
    }
    logs.push(`3. Message: ${message}`);
    
    // Check env vars
    const apiKey = process.env.OPENAI_API_KEY;
    const baseUrlRaw = process.env.OPENAI_BASE_URL;
    const model = process.env.AGI_OPENAI_MODEL || process.env.AGI_MODEL || 'gpt-4o-mini';
    
    logs.push(`4. Env check:`);
    logs.push(`   - API Key: ${apiKey ? apiKey.substring(0, 15) + '...' : 'MISSING'}`);
    logs.push(`   - Base URL raw: ${baseUrlRaw || 'MISSING'}`);
    logs.push(`   - Model: ${model}`);
    
    if (!apiKey) {
      return NextResponse.json({ ok: false, error: 'no_api_key', logs });
    }
    
    const baseUrl = (baseUrlRaw || 'https://api.openai.com/v1')
      .replace(/^["']|["']$/g, '')
      .replace(/\/+$/, '');
    
    logs.push(`5. Base URL cleaned: ${baseUrl}`);
    
    const url = `${baseUrl}/chat/completions`;
    logs.push(`6. Full URL: ${url}`);
    
    const payload = {
      model,
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 100,
    };
    logs.push(`7. Payload: ${JSON.stringify(payload)}`);
    
    logs.push('8. Calling LLM API...');
    const llmResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });
    
    logs.push(`9. LLM Response status: ${llmResponse.status}`);
    
    if (!llmResponse.ok) {
      const errorText = await llmResponse.text();
      logs.push(`10. LLM Error: ${errorText.substring(0, 200)}`);
      return NextResponse.json({ ok: false, error: 'llm_failed', logs, status: llmResponse.status, errorText: errorText.substring(0, 500) });
    }
    
    const llmData = await llmResponse.json();
    logs.push(`11. LLM Data received: ${JSON.stringify(llmData).substring(0, 200)}...`);
    
    const responseMessage = llmData.choices?.[0]?.message?.content || 'No response';
    logs.push(`12. Extracted message: ${responseMessage.substring(0, 100)}`);
    
    return NextResponse.json({
      ok: true,
      message: responseMessage,
      logs,
      debug: {
        model,
        baseUrl,
        usage: llmData.usage,
      }
    });
    
  } catch (error: any) {
    logs.push(`ERROR: ${error.message}`);
    logs.push(`ERROR Stack: ${error.stack?.substring(0, 500)}`);
    
    return NextResponse.json({
      ok: false,
      error: 'exception',
      message: error.message,
      logs,
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: 'Chat debug endpoint - use POST',
    env: {
      hasApiKey: !!process.env.OPENAI_API_KEY,
      hasBaseUrl: !!process.env.OPENAI_BASE_URL,
      baseUrlValue: process.env.OPENAI_BASE_URL,
      model: process.env.AGI_OPENAI_MODEL || process.env.AGI_MODEL || 'default',
    }
  });
}

