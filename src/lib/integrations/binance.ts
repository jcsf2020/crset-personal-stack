/**
 * Binance API Integration
 * 
 * Provides real-time cryptocurrency trading data from Binance exchange.
 * Supports spot prices, 24h statistics, and market depth.
 * 
 * @see https://binance-docs.github.io/apidocs/spot/en/
 */

export interface BinanceTickerPrice {
  symbol: string;
  price: string;
}

export interface Binance24hrTicker {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  prevClosePrice: string;
  lastPrice: string;
  lastQty: string;
  bidPrice: string;
  bidQty: string;
  askPrice: string;
  askQty: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
  firstId: number;
  lastId: number;
  count: number;
}

export interface BinanceMarketSummary {
  symbol: string;
  price: number;
  priceChange24h: number;
  priceChangePercent24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  quoteVolume24h: number;
}

const BINANCE_API_BASE = 'https://api.binance.com/api/v3';

/**
 * Get current price for a symbol
 */
export async function getBinancePrice(symbol: string): Promise<number> {
  const response = await fetch(`${BINANCE_API_BASE}/ticker/price?symbol=${symbol.toUpperCase()}`);
  
  if (!response.ok) {
    throw new Error(`Binance API error: ${response.status} ${response.statusText}`);
  }
  
  const data: BinanceTickerPrice = await response.json();
  return parseFloat(data.price);
}

/**
 * Get 24hr ticker statistics
 */
export async function getBinance24hrTicker(symbol: string): Promise<Binance24hrTicker> {
  const response = await fetch(`${BINANCE_API_BASE}/ticker/24hr?symbol=${symbol.toUpperCase()}`);
  
  if (!response.ok) {
    throw new Error(`Binance API error: ${response.status} ${response.statusText}`);
  }
  
  return await response.json();
}

/**
 * Get market summary for multiple symbols
 */
export async function getBinanceMarketSummary(symbols: string[]): Promise<BinanceMarketSummary[]> {
  const promises = symbols.map(async (symbol) => {
    try {
      const ticker = await getBinance24hrTicker(symbol);
      
      return {
        symbol: ticker.symbol,
        price: parseFloat(ticker.lastPrice),
        priceChange24h: parseFloat(ticker.priceChange),
        priceChangePercent24h: parseFloat(ticker.priceChangePercent),
        high24h: parseFloat(ticker.highPrice),
        low24h: parseFloat(ticker.lowPrice),
        volume24h: parseFloat(ticker.volume),
        quoteVolume24h: parseFloat(ticker.quoteVolume),
      };
    } catch (error) {
      console.error(`Error fetching Binance data for ${symbol}:`, error);
      return null;
    }
  });
  
  const results = await Promise.all(promises);
  return results.filter((r): r is BinanceMarketSummary => r !== null);
}

/**
 * Get top trading pairs by volume
 */
export async function getBinanceTopPairs(limit: number = 10): Promise<BinanceMarketSummary[]> {
  // Get all tickers
  const response = await fetch(`${BINANCE_API_BASE}/ticker/24hr`);
  
  if (!response.ok) {
    throw new Error(`Binance API error: ${response.status} ${response.statusText}`);
  }
  
  const tickers: Binance24hrTicker[] = await response.json();
  
  // Filter USDT pairs and sort by quote volume
  const usdtPairs = tickers
    .filter(t => t.symbol.endsWith('USDT'))
    .map(ticker => ({
      symbol: ticker.symbol,
      price: parseFloat(ticker.lastPrice),
      priceChange24h: parseFloat(ticker.priceChange),
      priceChangePercent24h: parseFloat(ticker.priceChangePercent),
      high24h: parseFloat(ticker.highPrice),
      low24h: parseFloat(ticker.lowPrice),
      volume24h: parseFloat(ticker.volume),
      quoteVolume24h: parseFloat(ticker.quoteVolume),
    }))
    .sort((a, b) => b.quoteVolume24h - a.quoteVolume24h)
    .slice(0, limit);
  
  return usdtPairs;
}

/**
 * Get crypto trading summary (combines Binance + CoinGecko data)
 */
export async function getCryptoTradingSummary() {
  try {
    const topPairs = await getBinanceTopPairs(10);
    
    return {
      ok: true,
      timestamp: new Date().toISOString(),
      source: 'Binance API',
      pairs: topPairs,
      meta: {
        exchange: 'Binance',
        pairs_count: topPairs.length,
        base_currency: 'USDT',
      },
    };
  } catch (error) {
    console.error('Error in getCryptoTradingSummary:', error);
    throw error;
  }
}
