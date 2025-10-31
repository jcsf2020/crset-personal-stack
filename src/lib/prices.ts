/**
 * Price management utilities with environment variables and fallbacks
 */

export const env = (k: string, fb?: string) => (process.env[k] ?? fb ?? "").trim();

export function pricePair(prefix: string, fbSetup: string, fbMonth: string) {
  const setup = env(`NEXT_PUBLIC_PRICE_${prefix}_SETUP`, fbSetup);
  const month = env(`NEXT_PUBLIC_PRICE_${prefix}_MONTH`, fbMonth);
  return { setup, month };
}

// Fallback prices for all services
export const PRICE_FALLBACKS = {
  ESSENTIAL: { setup: "€990",   month: "€79/m" },
  PRO:        { setup: "€2 900", month: "€149/m" },
  ENTERPRISE:  { setup: "€5 900", month: "€299/m" },
  IMOBILIARIA: { setup: "€3 900", month: "€199/m" },
  AGENDA:      { setup: "€1 900", month: "€119/m" },
  ECOMMERCE:   { setup: "€3 500", month: "€149/m + Shopify" },
  CATALOGO:    { setup: "€2 500", month: "€129/m" },
} as const;

export type ServiceKey = keyof typeof PRICE_FALLBACKS;

