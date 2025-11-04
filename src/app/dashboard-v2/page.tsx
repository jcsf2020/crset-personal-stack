'use client';

import { useEffect, useState } from 'react';

interface CryptoMarketData {
  ok: boolean;
  timestamp: string;
  currency: string;
  global: {
    total_market_cap: number;
    total_volume_24h: number;
    btc_dominance: number;
    eth_dominance: number;
    active_cryptocurrencies: number;
    active_exchanges: number;
  };
  top_cryptos: Array<{
    rank: number;
    name: string;
    symbol: string;
    price: number;
    market_cap: number;
    volume_24h: number;
    percent_change_24h: number;
    percent_change_7d: number;
  }>;
  meta: {
    source: string;
    count: number;
  };
}

interface TradingData {
  ok: boolean;
  timestamp: string;
  source: string;
  pairs: Array<{
    symbol: string;
    price: number;
    priceChange24h: number;
    priceChangePercent24h: number;
    high24h: number;
    low24h: number;
    volume24h: number;
    quoteVolume24h: number;
  }>;
  meta: {
    exchange: string;
    pairs_count: number;
    base_currency: string;
  };
}

export default function DashboardV2() {
  const [marketData, setMarketData] = useState<CryptoMarketData | null>(null);
  const [tradingData, setTradingData] = useState<TradingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        const [marketRes, tradingRes] = await Promise.all([
          fetch('/api/crypto/market?limit=10'),
          fetch('/api/crypto/trading'),
        ]);
        
        if (!marketRes.ok || !tradingRes.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const market = await marketRes.json();
        const trading = await tradingRes.json();
        
        setMarketData(market);
        setTradingData(trading);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
    
    // Refresh every 60 seconds
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number, decimals: number = 2): string => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  };

  const formatCurrency = (num: number): string => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const formatPercent = (num: number): string => {
    const sign = num >= 0 ? '+' : '';
    return `${sign}${num.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading FinanceFlow v2.0...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-red-400 text-xl">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          FinanceFlow v2.0
        </h1>
        <p className="text-gray-300">
          Real-time cryptocurrency market intelligence powered by Binance & CoinMarketCap
        </p>
        <p className="text-gray-400 text-sm mt-2">
          Last updated: {marketData ? new Date(marketData.timestamp).toLocaleString() : 'N/A'}
        </p>
      </div>

      {/* Global Market Stats */}
      {marketData && (
        <div className="max-w-7xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Global Market Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20">
              <div className="text-gray-300 text-sm mb-1">Total Market Cap</div>
              <div className="text-white text-xl font-bold">
                {formatCurrency(marketData.global.total_market_cap)}
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20">
              <div className="text-gray-300 text-sm mb-1">24h Volume</div>
              <div className="text-white text-xl font-bold">
                {formatCurrency(marketData.global.total_volume_24h)}
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20">
              <div className="text-gray-300 text-sm mb-1">BTC Dominance</div>
              <div className="text-white text-xl font-bold">
                {marketData.global.btc_dominance.toFixed(1)}%
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20">
              <div className="text-gray-300 text-sm mb-1">ETH Dominance</div>
              <div className="text-white text-xl font-bold">
                {marketData.global.eth_dominance.toFixed(1)}%
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20">
              <div className="text-gray-300 text-sm mb-1">Active Cryptos</div>
              <div className="text-white text-xl font-bold">
                {marketData.global.active_cryptocurrencies.toLocaleString()}
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20">
              <div className="text-gray-300 text-sm mb-1">Active Exchanges</div>
              <div className="text-white text-xl font-bold">
                {marketData.global.active_exchanges.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Cryptocurrencies */}
      {marketData && (
        <div className="max-w-7xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Top Cryptocurrencies by Market Cap</h2>
          <div className="bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Rank</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">24h %</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">7d %</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Market Cap</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Volume 24h</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {marketData.top_cryptos.map((crypto) => (
                    <tr key={crypto.rank} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{crypto.rank}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-white">{crypto.name}</div>
                            <div className="text-sm text-gray-400">{crypto.symbol}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-white font-medium">
                        ${formatNumber(crypto.price)}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-medium ${
                        crypto.percent_change_24h >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {formatPercent(crypto.percent_change_24h)}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-medium ${
                        crypto.percent_change_7d >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {formatPercent(crypto.percent_change_7d)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-300">
                        {formatCurrency(crypto.market_cap)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-300">
                        {formatCurrency(crypto.volume_24h)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Top Trading Pairs (Binance) */}
      {tradingData && (
        <div className="max-w-7xl mx-auto mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Top Trading Pairs (Binance)</h2>
          <div className="bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Pair</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">24h Change</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">24h High</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">24h Low</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Volume</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {tradingData.pairs.slice(0, 10).map((pair) => (
                    <tr key={pair.symbol} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{pair.symbol}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-white font-medium">
                        ${formatNumber(pair.price)}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-medium ${
                        pair.priceChangePercent24h >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {formatPercent(pair.priceChangePercent24h)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-300">
                        ${formatNumber(pair.high24h)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-300">
                        ${formatNumber(pair.low24h)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-300">
                        {formatCurrency(pair.quoteVolume24h)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="max-w-7xl mx-auto mt-8 text-center text-gray-400 text-sm">
        <p>Data sources: CoinMarketCap API & Binance API</p>
        <p className="mt-2">FinanceFlow v2.0 - CRSET Personal Stack</p>
      </div>
    </div>
  );
}
