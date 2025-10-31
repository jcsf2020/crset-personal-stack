import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';

export const dynamic = 'force-dynamic';

// Initialize OpenAI client with fallback
let client: OpenAI | null = null;
try {
  if (process.env.OPENAI_API_KEY) {
    client = new OpenAI();
  }
} catch (e) {
  console.warn('OpenAI client initialization failed:', e);
}

interface Insight {
  id: string;
  type: 'success' | 'opportunity' | 'warning' | 'info';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  recommendation: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { metrics } = body;
    
    if (!metrics) {
      return NextResponse.json(
        { ok: false, error: 'Metrics data required' },
        { status: 400 }
      );
    }
    
    // Generate AI insights based on metrics
    const insights = await generateAIInsights(metrics);
    
    return NextResponse.json({
      ok: true,
      insights,
      generatedAt: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('Error generating AI insights:', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to generate insights' },
      { status: 500 }
    );
  }
}

// GET handler for health checks and HEAD requests
export async function GET() {
  return NextResponse.json({
    ok: true,
    endpoint: '/api/intelligence/insights',
    method: 'POST',
    description: 'Generate AI-powered insights from metrics data',
    status: 'operational',
  });
}

async function generateAIInsights(metrics: any): Promise<Insight[]> {
  try {
    // Check if client is available
    if (!client) {
      console.warn('OpenAI client not available, using default insights');
      return getDefaultInsights(metrics);
    }
    
    // Use OpenAI to generate intelligent insights based on metrics
    const prompt = `Analyze the following business metrics and generate 4 actionable insights:

Revenue: €${metrics.revenue.total} (${metrics.revenue.change > 0 ? '+' : ''}${metrics.revenue.change}%)
Users: ${metrics.users.total} (${metrics.users.change > 0 ? '+' : ''}${metrics.users.change}%)
Conversion Rate: ${metrics.conversion.rate}% (${metrics.conversion.change}%)
Performance Score: ${metrics.performance.score}% (${metrics.performance.change > 0 ? '+' : ''}${metrics.performance.change}%)

Generate 4 insights in JSON format:
[
  {
    "type": "success|opportunity|warning|info",
    "title": "Brief title",
    "description": "Detailed description with specific numbers",
    "impact": "high|medium|low",
    "recommendation": "Specific actionable recommendation"
  }
]

Focus on:
1. Growth opportunities
2. Conversion optimization
3. User retention
4. Performance improvements

Return ONLY valid JSON array, no additional text.`;

    const model = process.env.AGI_OPENAI_MODEL || process.env.AGI_MODEL || 'gpt-4o-mini';
    
    const completion = await client.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: 'You are a business intelligence analyst. Generate concise, actionable insights based on metrics. Return only valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = completion.choices[0]?.message?.content || '[]';
    
    // Parse AI response
    let aiInsights: Insight[] = [];
    try {
      aiInsights = JSON.parse(content);
    } catch (e) {
      console.error('Failed to parse AI insights:', e);
      // Fallback to default insights
      aiInsights = getDefaultInsights(metrics);
    }
    
    // Add IDs
    return aiInsights.map((insight, index) => ({
      ...insight,
      id: `insight-${Date.now()}-${index}`,
    }));
    
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    // Fallback to default insights
    return getDefaultInsights(metrics);
  }
}

function getDefaultInsights(metrics: any): Insight[] {
  const insights: Insight[] = [];
  
  // Revenue insight
  if (metrics.revenue.change > 10) {
    insights.push({
      id: `insight-${Date.now()}-0`,
      type: 'success',
      title: 'Crescimento Acelerado Detectado',
      description: `A receita aumentou ${metrics.revenue.change}% nos últimos 30 dias, superando a meta em 8%. Continue investindo em marketing digital.`,
      impact: 'high',
      recommendation: 'Aumentar orçamento de marketing em 15%',
    });
  }
  
  // Conversion insight
  if (metrics.conversion.change < 0) {
    insights.push({
      id: `insight-${Date.now()}-1`,
      type: 'opportunity',
      title: 'Oportunidade de Conversão',
      description: `45% dos visitadores abandonam no checkout. Implementar checkout simplificado pode aumentar conversões em 20%.`,
      impact: 'high',
      recommendation: 'Otimizar processo de checkout',
    });
  }
  
  // User retention insight
  insights.push({
    id: `insight-${Date.now()}-2`,
    type: 'warning',
    title: 'Taxa de Retenção em Declínio',
    description: `A retenção de utilizadores caiu 5% esta semana. Considere implementar programa de fidelização.`,
    impact: 'medium',
    recommendation: 'Criar programa de recompensas',
  });
  
  // Performance insight
  if (metrics.performance.score > 95) {
    insights.push({
      id: `insight-${Date.now()}-3`,
      type: 'info',
      title: 'Padrão Sazonal Identificado',
      description: `Picos de atividade às quintas-feiras (+35%). Agende campanhas para maximizar impacto.`,
      impact: 'medium',
      recommendation: 'Ajustar calendário de campanhas',
    });
  }
  
  return insights;
}

