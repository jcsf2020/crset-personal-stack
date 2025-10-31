/**
 * CoinGecko API Integration
 * 
 * Free API para dados de criptomoedas em tempo real
 * Documentacao: https://www.coingecko.com/en/api/documentation
 */

export interface CoinData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d: number;
  price_change_percentage_30d: number;
  image: string;
}

export interface CryptoSummary {
  ok: boolean;
  timestamp: string;
  currency: string;
  total_market_cap: number;
  total_volume: number;
  coins: CoinData[];
  meta: {
    source: string;
    count: number;
  };
}

const COINGECKO_API_BASE = "https://api.coingecko.com/api/v3";

/**
 * Busca top N criptomoedas por market cap
 */
export async function getTopCoins(
  limit: number = 10,
  currency: string = "usd"
): Promise<CoinData[]> {
  const url = `${COINGECKO_API_BASE}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=24h,7d,30d`;
  
  const response = await fetch(url, {
    headers: {
      "Accept": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data as CoinData[];
}

/**
 * Busca dados globais do mercado cripto
 */
export async function getGlobalMarketData(): Promise<{
  total_market_cap: number;
  total_volume: number;
}> {
  const url = `${COINGECKO_API_BASE}/global`;
  
  const response = await fetch(url, {
    headers: {
      "Accept": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return {
    total_market_cap: data.data.total_market_cap.usd || 0,
    total_volume: data.data.total_volume.usd || 0,
  };
}

/**
 * Gera resumo completo do mercado cripto
 */
export async function getCryptoSummary(
  limit: number = 10,
  currency: string = "usd"
): Promise<CryptoSummary> {
  try {
    const [coins, globalData] = await Promise.all([
      getTopCoins(limit, currency),
      getGlobalMarketData(),
    ]);

    return {
      ok: true,
      timestamp: new Date().toISOString(),
      currency,
      total_market_cap: globalData.total_market_cap,
      total_volume: globalData.total_volume,
      coins,
      meta: {
        source: "CoinGecko API v3",
        count: coins.length,
      },
    };
  } catch (error) {
    throw new Error(`Failed to fetch crypto summary: ${(error as Error).message}`);
  }
}
