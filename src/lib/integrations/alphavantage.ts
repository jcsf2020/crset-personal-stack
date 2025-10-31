/**
 * AlphaVantage API Integration
 * 
 * API para dados financeiros (stocks, forex, crypto)
 * Documentacao: https://www.alphavantage.co/documentation/
 */

export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  change_percent: number;
  volume: number;
  latest_trading_day: string;
}

export interface FinancePortfolio {
  ok: boolean;
  timestamp: string;
  currency: string;
  total_value: number;
  stocks: StockQuote[];
  meta: {
    source: string;
    count: number;
  };
}

const ALPHAVANTAGE_API_BASE = "https://www.alphavantage.co/query";

/**
 * Busca cotacao de uma acao
 */
export async function getStockQuote(
  symbol: string,
  apiKey: string
): Promise<StockQuote> {
  const url = `${ALPHAVANTAGE_API_BASE}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
  
  const response = await fetch(url, {
    headers: {
      "Accept": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`AlphaVantage API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  
  if (data["Error Message"]) {
    throw new Error(`AlphaVantage: ${data["Error Message"]}`);
  }

  const quote = data["Global Quote"];
  
  if (!quote || Object.keys(quote).length === 0) {
    throw new Error(`No data found for symbol: ${symbol}`);
  }

  return {
    symbol: quote["01. symbol"],
    price: parseFloat(quote["05. price"]),
    change: parseFloat(quote["09. change"]),
    change_percent: parseFloat(quote["10. change percent"].replace("%", "")),
    volume: parseInt(quote["06. volume"]),
    latest_trading_day: quote["07. latest trading day"],
  };
}

/**
 * Busca portfolio completo
 */
export async function getFinancePortfolio(
  symbols: string[],
  apiKey: string,
  currency: string = "usd"
): Promise<FinancePortfolio> {
  try {
    // Buscar cotacoes em paralelo (max 5 por vez para respeitar rate limits)
    const chunks = [];
    for (let i = 0; i < symbols.length; i += 5) {
      chunks.push(symbols.slice(i, i + 5));
    }

    const stocks: StockQuote[] = [];
    
    for (const chunk of chunks) {
      const promises = chunk.map(symbol => getStockQuote(symbol, apiKey));
      const results = await Promise.allSettled(promises);
      
      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          stocks.push(result.value);
        } else {
          console.error(`Failed to fetch ${chunk[index]}:`, result.reason);
        }
      });
      
      // Delay entre chunks para respeitar rate limits
      if (chunks.indexOf(chunk) < chunks.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    const total_value = stocks.reduce((sum, stock) => sum + (stock.price * 1), 0);

    return {
      ok: true,
      timestamp: new Date().toISOString(),
      currency,
      total_value,
      stocks,
      meta: {
        source: "AlphaVantage API",
        count: stocks.length,
      },
    };
  } catch (error) {
    throw new Error(`Failed to fetch finance portfolio: ${(error as Error).message}`);
  }
}
