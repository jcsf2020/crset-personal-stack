import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface PaymentData {
  plan: string;
  customer_email: string;
  customer_name?: string;
  success_url?: string;
  cancel_url?: string;
}

const PLANS = {
  essential: {
    name: 'Plano Essential',
    price: 29900, // 299 EUR em centavos
    currency: 'eur',
    description: 'Automação básica para pequenas empresas'
  },
  pro: {
    name: 'Plano Pro',
    price: 59900, // 599 EUR em centavos
    currency: 'eur',
    description: 'Soluções avançadas para empresas em crescimento'
  },
  enterprise: {
    name: 'Plano Enterprise',
    price: 149900, // 1499 EUR em centavos
    currency: 'eur',
    description: 'Solução completa para grandes empresas'
  }
};

export async function POST(request: NextRequest) {
  try {
    const data: PaymentData = await request.json();

    // Validação básica
    if (!data.plan || !data.customer_email) {
      return NextResponse.json(
        { ok: false, error: 'Plano e email são obrigatórios' },
        { status: 400 }
      );
    }

    // Verificar se o plano existe
    const plan = PLANS[data.plan as keyof typeof PLANS];
    if (!plan) {
      return NextResponse.json(
        { ok: false, error: 'Plano inválido' },
        { status: 400 }
      );
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.customer_email)) {
      return NextResponse.json(
        { ok: false, error: 'Email inválido' },
        { status: 400 }
      );
    }

    // TODO: Integrar com Stripe quando as credenciais estiverem configuradas
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    
    // Simular criação de sessão de pagamento
    const mockSession = {
      id: `cs_mock_${Date.now()}`,
      url: `https://checkout.stripe.com/pay/cs_mock_${Date.now()}`,
      payment_status: 'unpaid',
      amount_total: plan.price,
      currency: plan.currency,
      customer_email: data.customer_email,
      metadata: {
        plan: data.plan,
        customer_name: data.customer_name || ''
      }
    };

    console.log('Sessão de pagamento criada:', mockSession);

    return NextResponse.json({
      ok: true,
      session_id: mockSession.id,
      checkout_url: mockSession.url,
      plan: {
        name: plan.name,
        price: plan.price,
        currency: plan.currency,
        description: plan.description
      }
    });

  } catch (error) {
    console.error('Erro ao criar sessão de pagamento:', error);
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
      service: 'payments',
      status: 'operational',
      stripe_account: 'acct_1RbH0XFVbYwjbgXT',
      available_plans: Object.keys(PLANS),
      features: {
        checkout_sessions: true,
        webhooks: false, // TODO: implementar
        subscriptions: false // TODO: implementar
      }
    });
  }

  return NextResponse.json(
    { ok: false, error: 'Método não permitido' },
    { status: 405 }
  );
}
