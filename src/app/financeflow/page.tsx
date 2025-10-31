import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FinanceFlow - CRSET Personal Stack",
  description: "Dashboard pessoal de integracao financeira, cripto, dominios e SaaS intelligence",
};

export default function FinanceFlowPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            FinanceFlow
          </h1>
          <p className="text-xl text-purple-300">
            CRSET Personal Stack - Integracao Financeira e Business Intelligence
          </p>
        </div>

        {/* Crypto Summary Widget */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <CryptoSummaryWidget />
          <MarketStatsWidget />
        </div>

        {/* Coming Soon Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ComingSoonCard
            title="Finance Portfolio"
            description="Integracao com AlphaVantage e Binance para tracking de ativos"
            phase={2}
          />
          <ComingSoonCard
            title="Domain Opportunities"
            description="Rastreamento de leiloes e oportunidades em Namecheap e GoDaddy"
            phase={3}
          />
          <ComingSoonCard
            title="Business Radar"
            description="Scraper de marketplaces Flippa e MicroAcquire"
            phase={4}
          />
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-purple-400 text-sm">
          <p>Powered by CRSET Solutions v2.0.0 | Built with Next.js 14</p>
          <p className="mt-2">
            <a 
              href="/api/crypto/summary" 
              className="text-purple-300 hover:text-purple-100 underline"
              target="_blank"
            >
              API Documentation
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

// Crypto Summary Widget (Client Component)
function CryptoSummaryWidget() {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-purple-500/30">
      <h2 className="text-2xl font-bold text-white mb-4">Crypto Market Summary</h2>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-purple-300">Total Market Cap</span>
          <span className="text-white font-mono">Loading...</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-purple-300">24h Volume</span>
          <span className="text-white font-mono">Loading...</span>
        </div>
        <div className="mt-6">
          <a
            href="/api/crypto/summary"
            className="block w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg text-center transition-colors"
            target="_blank"
          >
            View Full API Response
          </a>
        </div>
      </div>
    </div>
  );
}

// Market Stats Widget
function MarketStatsWidget() {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-purple-500/30">
      <h2 className="text-2xl font-bold text-white mb-4">Top 10 Cryptocurrencies</h2>
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex justify-between items-center py-2 border-b border-purple-500/20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-500/30 rounded-full" />
              <div>
                <div className="text-white font-semibold">Loading...</div>
                <div className="text-purple-400 text-sm">---</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white font-mono">$---</div>
              <div className="text-green-400 text-sm">+---%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Coming Soon Card
function ComingSoonCard({ title, description, phase }: { title: string; description: string; phase: number }) {
  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-bold text-purple-400 bg-purple-900/50 px-2 py-1 rounded">
          FASE {phase}
        </span>
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-purple-300 text-sm">{description}</p>
      <div className="mt-4 text-purple-500 text-sm font-semibold">
        Coming Soon...
      </div>
    </div>
  );
}
