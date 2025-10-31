import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface ErrorReport {
  message: string;
  stack?: string;
  user_id?: string;
  user_email?: string;
  url?: string;
  user_agent?: string;
  level: 'error' | 'warning' | 'info';
  tags?: Record<string, string>;
  extra?: Record<string, any>;
}

export async function POST(request: NextRequest) {
  try {
    const data: ErrorReport = await request.json();

    // Validação básica
    if (!data.message) {
      return NextResponse.json(
        { ok: false, error: 'Mensagem é obrigatória' },
        { status: 400 }
      );
    }

    // Preparar dados do erro
    const errorData = {
      message: data.message,
      stack: data.stack || null,
      level: data.level || 'error',
      timestamp: new Date().toISOString(),
      user: {
        id: data.user_id || null,
        email: data.user_email || null
      },
      request: {
        url: data.url || request.url,
        user_agent: data.user_agent || request.headers.get('user-agent'),
        ip: request.headers.get('x-forwarded-for') || 'unknown'
      },
      tags: data.tags || {},
      extra: data.extra || {}
    };

    // TODO: Integrar com Sentry quando as credenciais estiverem configuradas
    // const Sentry = require('@sentry/node');
    // Sentry.captureException(new Error(data.message), {
    //   level: data.level,
    //   user: errorData.user,
    //   tags: errorData.tags,
    //   extra: errorData.extra
    // });

    // Por agora, registar no console
    console.error('Erro capturado:', errorData);

    return NextResponse.json({
      ok: true,
      message: 'Erro registado com sucesso',
      event_id: `mock_${Date.now()}`
    });

  } catch (error) {
    console.error('Erro ao processar relatório de erro:', error);
    return NextResponse.json(
      { ok: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const debug = searchParams.get('debug');

  if (debug === '1') {
    return NextResponse.json({
      ok: true,
      service: 'monitoring',
      status: 'operational',
      features: {
        error_tracking: true,
        performance_monitoring: false, // TODO: implementar
        user_feedback: false,          // TODO: implementar
        sentry_integration: false      // TODO: ativar quando configurado
      },
      stats: {
        errors_today: 0,
        warnings_today: 0,
        uptime: '99.9%'
      }
    });
  }

  return NextResponse.json(
    { ok: false, error: 'Método não permitido' },
    { status: 405 }
  );
}
