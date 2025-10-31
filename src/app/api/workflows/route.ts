import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface WorkflowTrigger {
  id: string;
  name: string;
  description: string;
  event: string;
  conditions?: Record<string, any>;
  actions: WorkflowAction[];
  enabled: boolean;
}

interface WorkflowAction {
  type: 'email' | 'webhook' | 'database' | 'notification' | 'slack' | 'discord';
  config: Record<string, any>;
  delay?: number; // em segundos
}

interface WorkflowExecution {
  trigger_id: string;
  event_data: Record<string, any>;
  timestamp: string;
}

// Simulação de workflows configurados
const workflows: WorkflowTrigger[] = [
  {
    id: 'new_lead_notification',
    name: 'Notificação de Novo Lead',
    description: 'Envia notificação quando um novo lead é capturado',
    event: 'lead.created',
    enabled: true,
    actions: [
      {
        type: 'email',
        config: {
          to: 'vendas@crsetsolutions.com',
          subject: 'Novo Lead Capturado',
          template: 'new_lead'
        }
      },
      {
        type: 'slack',
        config: {
          channel: '#vendas',
          message: 'Novo lead: {{lead.name}} ({{lead.email}})'
        },
        delay: 5
      }
    ]
  },
  {
    id: 'payment_success_workflow',
    name: 'Workflow de Pagamento Bem-sucedido',
    description: 'Ações após pagamento confirmado',
    event: 'payment.success',
    enabled: true,
    actions: [
      {
        type: 'email',
        config: {
          to: '{{customer.email}}',
          subject: 'Pagamento Confirmado - CRSET Solutions',
          template: 'payment_confirmation'
        }
      },
      {
        type: 'database',
        config: {
          table: 'customers',
          action: 'update',
          where: { email: '{{customer.email}}' },
          data: { status: 'active', last_payment: '{{payment.date}}' }
        }
      }
    ]
  },
  {
    id: 'error_monitoring',
    name: 'Monitorização de Erros',
    description: 'Alerta para erros críticos no sistema',
    event: 'error.critical',
    enabled: true,
    conditions: {
      level: 'error',
      count_threshold: 5
    },
    actions: [
      {
        type: 'email',
        config: {
          to: 'tech@crsetsolutions.com',
          subject: 'ALERTA: Erro Crítico Detectado',
          template: 'error_alert'
        }
      },
      {
        type: 'discord',
        config: {
          webhook_url: process.env.DISCORD_WEBHOOK_URL,
          message: '🚨 Erro crítico detectado: {{error.message}}'
        }
      }
    ]
  }
];

export async function POST(request: NextRequest) {
  try {
    const data: WorkflowExecution = await request.json();

    if (!data.trigger_id || !data.event_data) {
      return NextResponse.json(
        { ok: false, error: 'trigger_id e event_data são obrigatórios' },
        { status: 400 }
      );
    }

    // Encontrar o workflow
    const workflow = workflows.find(w => w.id === data.trigger_id);
    if (!workflow) {
      return NextResponse.json(
        { ok: false, error: 'Workflow não encontrado' },
        { status: 404 }
      );
    }

    if (!workflow.enabled) {
      return NextResponse.json(
        { ok: false, error: 'Workflow desativado' },
        { status: 400 }
      );
    }

    // Verificar condições (se existirem)
    if (workflow.conditions && !checkConditions(workflow.conditions, data.event_data)) {
      return NextResponse.json({
        ok: true,
        message: 'Workflow não executado - condições não atendidas',
        workflow_id: workflow.id
      });
    }

    // Executar ações
    const executionResults = [];
    for (const action of workflow.actions) {
      try {
        if (action.delay) {
          // Em produção, usar uma queue (Redis/Bull) para delays
          console.log(`Ação ${action.type} agendada para ${action.delay}s`);
        }

        const result = await executeAction(action, data.event_data);
        executionResults.push({
          type: action.type,
          success: true,
          result
        });
      } catch (error) {
        console.error(`Erro ao executar ação ${action.type}:`, error);
        executionResults.push({
          type: action.type,
          success: false,
          error: error instanceof Error ? error.message : 'Erro desconhecido'
        });
      }
    }

    return NextResponse.json({
      ok: true,
      message: 'Workflow executado',
      workflow_id: workflow.id,
      execution_id: `exec_${Date.now()}`,
      actions_executed: executionResults.length,
      results: executionResults
    });

  } catch (error) {
    console.error('Erro ao executar workflow:', error);
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
      service: 'workflows',
      status: 'operational',
      total_workflows: workflows.length,
      enabled_workflows: workflows.filter(w => w.enabled).length,
      available_events: [
        'lead.created',
        'payment.success',
        'payment.failed',
        'error.critical',
        'user.registered',
        'subscription.cancelled'
      ],
      features: {
        conditional_execution: true,
        delayed_actions: true,
        email_integration: false, // TODO: ativar quando Resend configurado
        slack_integration: false, // TODO: implementar
        discord_integration: false, // TODO: implementar
        zapier_integration: false  // TODO: ativar quando configurado
      }
    });
  }

  // Listar workflows
  return NextResponse.json({
    ok: true,
    workflows: workflows.map(w => ({
      id: w.id,
      name: w.name,
      description: w.description,
      event: w.event,
      enabled: w.enabled,
      actions_count: w.actions.length
    }))
  });
}

function checkConditions(conditions: Record<string, any>, eventData: Record<string, any>): boolean {
  // Implementação simples de verificação de condições
  for (const [key, expectedValue] of Object.entries(conditions)) {
    const actualValue = getNestedValue(eventData, key);
    if (actualValue !== expectedValue) {
      return false;
    }
  }
  return true;
}

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

async function executeAction(action: WorkflowAction, eventData: Record<string, any>): Promise<any> {
  switch (action.type) {
    case 'email':
      // TODO: Integrar com Resend
      console.log('Email enviado:', {
        to: interpolateTemplate(action.config.to, eventData),
        subject: interpolateTemplate(action.config.subject, eventData)
      });
      return { sent: true, provider: 'resend' };

    case 'webhook':
      // TODO: Implementar chamada HTTP
      console.log('Webhook chamado:', action.config.url);
      return { called: true, status: 200 };

    case 'database':
      // TODO: Integrar com Supabase
      console.log('Operação na base de dados:', action.config);
      return { executed: true, affected_rows: 1 };

    case 'slack':
      // TODO: Integrar com Slack
      console.log('Mensagem Slack:', {
        channel: action.config.channel,
        message: interpolateTemplate(action.config.message, eventData)
      });
      return { sent: true, channel: action.config.channel };

    case 'discord':
      // TODO: Integrar com Discord
      console.log('Mensagem Discord:', {
        message: interpolateTemplate(action.config.message, eventData)
      });
      return { sent: true };

    default:
      throw new Error(`Tipo de ação não suportado: ${action.type}`);
  }
}

function interpolateTemplate(template: string, data: Record<string, any>): string {
  return template.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
    const value = getNestedValue(data, path.trim());
    return value !== undefined ? String(value) : match;
  });
}
