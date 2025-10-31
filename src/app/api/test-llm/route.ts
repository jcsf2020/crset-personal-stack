import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/test-llm
 * Test LLM configuration and connectivity
 */
export async function GET(req: NextRequest) {
  const logs: string[] = [];
  
  try {
    logs.push('1. Starting LLM test');
    
    // Check environment variables
    const apiKey = process.env.OPENAI_API_KEY;
    const baseUrlRaw = process.env.OPENAI_BASE_URL;
    const model = process.env.AGI_OPENAI_MODEL || process.env.AGI_MODEL || 'gpt-4o-mini';
    
    logs.push(`2. Env vars check:`);
    logs.push(`   - API Key: ${apiKey ? apiKey.substring(0, 15) + '...' : 'MISSING'}`);
    logs.push(`   - Base URL raw: ${baseUrlRaw || 'MISSING'}`);
    logs.push(`   - Model: ${model}`);
    
    if (!apiKey) {
      return NextResponse.json({ ok: false, error: 'no_api_key', logs });
    }
    
    // Clean base URL
    const baseUrl = (baseUrlRaw || 'https://api.openai.com/v1')
      .replace(/^["']|["']$/g, '')
      .replace(/\/+$/, '');
    
    logs.push(`3. Base URL cleaned: ${baseUrl}`);
    
    const url = `${baseUrl}/chat/completions`;
    logs.push(`4. Full URL: ${url}`);
    
    // Prepare request
    const payload = {
      model,
      messages: [{ role: 'user', content: 'Hi' }],
      max_tokens: 20,
    };
    
    logs.push(`5. Payload: ${JSON.stringify(payload)}`);
    logs.push(`6. Calling LLM API...`);
    
    const startTime = Date.now();
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });
    
    const duration = Date.now() - startTime;
    logs.push(`7. Response received in ${duration}ms`);
    logs.push(`8. Status: ${response.status} ${response.statusText}`);
    
    const responseText = await response.text();
    logs.push(`9. Response length: ${responseText.length} bytes`);
    
    if (!response.ok) {
      logs.push(`10. ERROR: ${responseText.substring(0, 500)}`);
      return NextResponse.json({
        ok: false,
        error: 'llm_failed',
        status: response.status,
        response: responseText.substring(0, 500),
        logs,
      });
    }
    
    const data = JSON.parse(responseText);
    const reply = data.choices?.[0]?.message?.content || 'No content';
    
    logs.push(`10. SUCCESS: Got reply`);
    logs.push(`11. Reply: ${reply}`);
    
    return NextResponse.json({
      ok: true,
      reply,
      model: data.model,
      usage: data.usage,
      duration_ms: duration,
      logs,
    });
    
  } catch (error: any) {
    logs.push(`ERROR: ${error.message}`);
    logs.push(`Stack: ${error.stack?.substring(0, 300)}`);
    
    return NextResponse.json({
      ok: false,
      error: 'exception',
      message: error.message,
      logs,
    }, { status: 500 });
  }
}

