/**
 * Flippa/MicroAcquire API Integration (Mock/Demo)
 * 
 * API para tracking de oportunidades de negocio SaaS
 * Documentacao: https://flippa.com/api
 * 
 * Nota: Esta e uma implementacao demo/mock. Para producao, usar APIs reais:
 * - Flippa API (requer autenticacao)
 * - MicroAcquire API
 * - IndieHackers scraping
 */

export interface BusinessOpportunity {
  id: string;
  title: string;
  description: string;
  category: "saas" | "ecommerce" | "content" | "app" | "other";
  price: number;
  currency: string;
  monthly_revenue: number;
  monthly_profit: number;
  multiple: number;
  age_months: number;
  marketplace: string;
  url: string;
  verified: boolean;
  score: number;
}

export interface BusinessReport {
  ok: boolean;
  timestamp: string;
  currency: string;
  opportunities: BusinessOpportunity[];
  meta: {
    source: string;
    count: number;
    total_value: number;
    avg_multiple: number;
  };
}

/**
 * Busca oportunidades de negocio (DEMO/MOCK)
 */
export async function getBusinessOpportunities(
  category?: string,
  maxPrice?: number,
  minRevenue?: number
): Promise<BusinessReport> {
  try {
    // Mock data para demonstracao
    const mockOpportunities: BusinessOpportunity[] = [
      {
        id: "flip_001",
        title: "AI Content Generator SaaS",
        description: "Automated content generation tool with 500+ active users",
        category: "saas",
        price: 45000,
        currency: "USD",
        monthly_revenue: 2500,
        monthly_profit: 1800,
        multiple: 25,
        age_months: 18,
        marketplace: "Flippa",
        url: "https://flippa.com/12345",
        verified: true,
        score: 8.5,
      },
      {
        id: "micro_002",
        title: "Niche E-commerce Store",
        description: "Dropshipping store in fitness niche with established supplier relationships",
        category: "ecommerce",
        price: 28000,
        currency: "USD",
        monthly_revenue: 4200,
        monthly_profit: 1200,
        multiple: 23.3,
        age_months: 24,
        marketplace: "MicroAcquire",
        url: "https://microacquire.com/listings/xyz",
        verified: true,
        score: 7.8,
      },
      {
        id: "indie_003",
        title: "Developer Tools Chrome Extension",
        description: "Productivity tool for developers with 10k+ users",
        category: "app",
        price: 15000,
        currency: "USD",
        monthly_revenue: 800,
        monthly_profit: 650,
        multiple: 23.1,
        age_months: 12,
        marketplace: "IndieHackers",
        url: "https://indiehackers.com/product/abc",
        verified: false,
        score: 7.2,
      },
      {
        id: "flip_004",
        title: "Newsletter Platform SaaS",
        description: "Email newsletter platform with 200 paying customers",
        category: "saas",
        price: 95000,
        currency: "USD",
        monthly_revenue: 5500,
        monthly_profit: 3800,
        multiple: 25,
        age_months: 30,
        marketplace: "Flippa",
        url: "https://flippa.com/67890",
        verified: true,
        score: 9.1,
      },
      {
        id: "micro_005",
        title: "Social Media Analytics Tool",
        description: "Instagram analytics dashboard with API integration",
        category: "saas",
        price: 32000,
        currency: "USD",
        monthly_revenue: 1800,
        monthly_profit: 1200,
        multiple: 26.7,
        age_months: 15,
        marketplace: "MicroAcquire",
        url: "https://microacquire.com/listings/social",
        verified: true,
        score: 8.0,
      },
    ];

    // Filtrar por criterios
    let filtered = mockOpportunities;
    
    if (category) {
      filtered = filtered.filter(opp => opp.category === category);
    }
    
    if (maxPrice) {
      filtered = filtered.filter(opp => opp.price <= maxPrice);
    }
    
    if (minRevenue) {
      filtered = filtered.filter(opp => opp.monthly_revenue >= minRevenue);
    }

    // Ordenar por score (descendente)
    filtered.sort((a, b) => b.score - a.score);

    const total_value = filtered.reduce((sum, opp) => sum + opp.price, 0);
    const avg_multiple = filtered.length > 0
      ? filtered.reduce((sum, opp) => sum + opp.multiple, 0) / filtered.length
      : 0;

    return {
      ok: true,
      timestamp: new Date().toISOString(),
      currency: "USD",
      opportunities: filtered,
      meta: {
        source: "Flippa + MicroAcquire + IndieHackers (Mock)",
        count: filtered.length,
        total_value,
        avg_multiple: Math.round(avg_multiple * 10) / 10,
      },
    };
  } catch (error) {
    throw new Error(`Failed to fetch business opportunities: ${(error as Error).message}`);
  }
}

/**
 * Calcula metricas de uma oportunidade
 */
export function calculateBusinessMetrics(opp: BusinessOpportunity): {
  roi_months: number;
  annual_revenue: number;
  annual_profit: number;
  profit_margin: number;
} {
  const roi_months = opp.price / opp.monthly_profit;
  const annual_revenue = opp.monthly_revenue * 12;
  const annual_profit = opp.monthly_profit * 12;
  const profit_margin = (opp.monthly_profit / opp.monthly_revenue) * 100;

  return {
    roi_months: Math.round(roi_months * 10) / 10,
    annual_revenue,
    annual_profit,
    profit_margin: Math.round(profit_margin * 10) / 10,
  };
}
