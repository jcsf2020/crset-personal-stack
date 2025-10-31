import Stripe from 'stripe';

export const hasStripe = !!process.env.STRIPE_SECRET_KEY;

export const stripe = hasStripe
  ? new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2024-06-20' as any })
  : (null as any);

// Fallbacks aceitam STRIPE_* e NEXT_PUBLIC_* (para casos onde só configuraste públicos)
const PRICE_ESSENCIAL =
  process.env.STRIPE_PRICE_ESSENCIAL ||
  process.env.STRIPE_PRICE_ESSENTIAL ||
  process.env.NEXT_PUBLIC_PRICE_ESSENCIAL ||
  process.env.NEXT_PUBLIC_PRICE_ESSENTIAL;

const PRICE_PRO =
  process.env.STRIPE_PRICE_PROFISSIONAL ||
  process.env.STRIPE_PRICE_PRO ||
  process.env.NEXT_PUBLIC_PRICE_PROFISSIONAL ||
  process.env.NEXT_PUBLIC_PRICE_PRO;

const PRICE_ENTERPRISE =
  process.env.STRIPE_PRICE_ENTERPRISE ||
  process.env.NEXT_PUBLIC_PRICE_ENTERPRISE;

// Normaliza PT/EN e remove acentos (NFD + faixa de diacríticos)
export function getPriceId(plan: string) {
  const p = (plan ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  switch (p) {
    case 'essencial':
    case 'essential':
    case 'basico':
    case 'basic':
      return PRICE_ESSENCIAL;
    case 'profissional':
    case 'pro':
      return PRICE_PRO;
    case 'enterprise':
      return PRICE_ENTERPRISE;
    default:
      return undefined;
  }
}

export function priceEnvSnapshot() {
  return {
    ESSENCIAL: !!PRICE_ESSENCIAL,
    PRO: !!PRICE_PRO,
    ENTERPRISE: !!PRICE_ENTERPRISE,
  };
}
