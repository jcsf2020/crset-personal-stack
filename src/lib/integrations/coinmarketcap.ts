/**
 * CoinMarketCap API Integration
 * 
 * Provides comprehensive cryptocurrency market data including:
 * - Market cap rankings
 * - Price data with multiple fiat currencies
 * - Global market metrics
 * - Trending cryptocurrencies
 * 
 * @see https://coinmarketcap.com/api/documentation/v1/
 * 
 * Note: Requires COINMARKETCAP_API_KEY environment variable
 */

export interface CMCCryptocurrency {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  cmc_rank: number;
  num_market_pairs: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number | null;
  last_updated: string;
  date_added: string;
  tags: string[];
  platform: any | null;
  quote: {
    [currency: string]: {
      price: number;
      volume_24h: number;
      volume_change_24h: number;
      percent_change_1h: number;
      percent_change_24h: number;
      percent_change_7d: number;
      percent_change_30d: number;
      market_cap: number;
      market_cap_dominance: number;
      fully_diluted_market_cap: number;
      last_updated: string;
    };
  };
}

export interface CMCGlobalMetrics {
  active_cryptocurrencies: number;
  total_cryptocurrencies: number;
  active_market_pairs: number;
  active_exchanges: number;
  total_exchanges: number;
  eth_dominance: number;
  btc_dominance: number;
  defi_volume_24h: number;
  defi_market_cap: number;
  stablecoin_volume_24h: number;
  stablecoin_market_cap: number;
  derivatives_volume_24h: number;
  total_market_cap: number;
  total_volume_24h: number;
  last_updated: string;
}

const CMC_API_BASE = 'https://pro-api.coinmarketcap.com/v1';
const CMC_API_KEY = process.env.COINMARKETCAP_API_KEY || '';

/**
 * Get top cryptocurrencies by market cap
 */
export async function getCMCTopCryptos(
  limit: number = 10,
  currency: string = 'USD'
): Promise<CMCCryptocurrency[]> {
  if (!CMC_API_KEY) {
    console.warn('COINMARKETCAP_API_KEY not configured, using mock data');
    return getMockCMCData(limit);
  }
  
  const response = await fetch(
    `${CMC_API_BASE}/cryptocurrency/listings/latest?limit=${limit}&convert=${currency}`,
    {
      headers: {
        'X-CMC_PRO_API_KEY': CMC_API_KEY,
        'Accept': 'application/json',
      },
    }
  );
  
  if (!response.ok) {
    throw new Error(`CoinMarketCap API error: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.data;
}

/**
 * Get global cryptocurrency market metrics
 */
export async function getCMCGlobalMetrics(currency: string = 'USD'): Promise<CMCGlobalMetrics> {
  if (!CMC_API_KEY) {
    console.warn('COINMARKETCAP_API_KEY not configured, using mock data');
    return getMockGlobalMetrics();
  }
  
  const response = await fetch(
    `${CMC_API_BASE}/global-metrics/quotes/latest?convert=${currency}`,
    {
      headers: {
        'X-CMC_PRO_API_KEY': CMC_API_KEY,
        'Accept': 'application/json',
      },
    }
  );
  
  if (!response.ok) {
    throw new Error(`CoinMarketCap API error: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.data;
}

/**
 * Get market overview with top cryptos and global metrics
 */
export async function getCMCMarketOverview(limit: number = 10, currency: string = 'USD') {
  try {
    const [topCryptos, globalMetrics] = await Promise.all([
      getCMCTopCryptos(limit, currency),
      getCMCGlobalMetrics(currency),
    ]);
    
    return {
      ok: true,
      timestamp: new Date().toISOString(),
      currency,
      global: {
        total_market_cap: globalMetrics.total_market_cap,
        total_volume_24h: globalMetrics.total_volume_24h,
        btc_dominance: globalMetrics.btc_dominance,
        eth_dominance: globalMetrics.eth_dominance,
        active_cryptocurrencies: globalMetrics.active_cryptocurrencies,
        active_exchanges: globalMetrics.active_exchanges,
      },
      top_cryptos: topCryptos.map(crypto => ({
        rank: crypto.cmc_rank,
        name: crypto.name,
        symbol: crypto.symbol,
        price: crypto.quote[currency].price,
        market_cap: crypto.quote[currency].market_cap,
        volume_24h: crypto.quote[currency].volume_24h,
        percent_change_24h: crypto.quote[currency].percent_change_24h,
        percent_change_7d: crypto.quote[currency].percent_change_7d,
      })),
      meta: {
        source: 'CoinMarketCap API',
        count: topCryptos.length,
      },
    };
  } catch (error) {
    console.error('Error in getCMCMarketOverview:', error);
    throw error;
  }
}

/**
 * Mock data for development/testing when API key is not available
 */
function getMockCMCData(limit: number): CMCCryptocurrency[] {
  const mockData: CMCCryptocurrency[] = [
    {
      id: 1,
      name: 'Bitcoin',
      symbol: 'BTC',
      slug: 'bitcoin',
      cmc_rank: 1,
      num_market_pairs: 10000,
      circulating_supply: 19500000,
      total_supply: 19500000,
      max_supply: 21000000,
      last_updated: new Date().toISOString(),
      date_added: '2013-04-28T00:00:00.000Z',
      tags: ['mineable', 'pow', 'sha-256'],
      platform: null,
      quote: {
        USD: {
          price: 109554.23,
          volume_24h: 35000000000,
          volume_change_24h: 5.2,
          percent_change_1h: 0.15,
          percent_change_24h: 1.57,
          percent_change_7d: 3.45,
          percent_change_30d: 12.34,
          market_cap: 2136307485000,
          market_cap_dominance: 56.5,
          fully_diluted_market_cap: 2300634830000,
          last_updated: new Date().toISOString(),
        },
      },
    },
    {
      id: 1027,
      name: 'Ethereum',
      symbol: 'ETH',
      slug: 'ethereum',
      cmc_rank: 2,
      num_market_pairs: 8000,
      circulating_supply: 120000000,
      total_supply: 120000000,
      max_supply: null,
      last_updated: new Date().toISOString(),
      date_added: '2015-08-07T00:00:00.000Z',
      tags: ['mineable', 'pow', 'smart-contracts'],
      platform: null,
      quote: {
        USD: {
          price: 3858.23,
          volume_24h: 18000000000,
          volume_change_24h: 3.8,
          percent_change_1h: 0.25,
          percent_change_24h: 2.34,
          percent_change_7d: 5.67,
          percent_change_30d: 15.89,
          market_cap: 462987600000,
          market_cap_dominance: 18.2,
          fully_diluted_market_cap: 462987600000,
          last_updated: new Date().toISOString(),
        },
      },
    },
  ];
  
  return mockData.slice(0, limit);
}

function getMockGlobalMetrics(): CMCGlobalMetrics {
  return {
    active_cryptocurrencies: 10500,
    total_cryptocurrencies: 25000,
    active_market_pairs: 85000,
    active_exchanges: 750,
    total_exchanges: 1200,
    eth_dominance: 18.2,
    btc_dominance: 56.5,
    defi_volume_24h: 5000000000,
    defi_market_cap: 85000000000,
    stablecoin_volume_24h: 75000000000,
    stablecoin_market_cap: 150000000000,
    derivatives_volume_24h: 120000000000,
    total_market_cap: 3800000000000,
    total_volume_24h: 125000000000,
    last_updated: new Date().toISOString(),
  };
}
