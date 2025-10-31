import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dashboard - FinanceFlow",
  description: "Personal finance, crypto, domains and SaaS intelligence dashboard",
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            FinanceFlow Dashboard
          </h1>
          <p className="text-xl text-purple-300 mb-2">
            CRSET Personal Stack v1.0.0
          </p>
          <p className="text-md text-purple-400">
            Personal Finance, Crypto, Domains & SaaS Intelligence
          </p>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Crypto Card */}
          <DashboardCard
            title="Crypto Market"
            description="Real-time cryptocurrency prices and market data"
            endpoint="/api/crypto/summary"
            icon="💰"
            color="from-yellow-500 to-orange-500"
            stats={[
              { label: "Top Coins", value: "10" },
              { label: "Update", value: "5min" },
            ]}
          />

          {/* Finance Card */}
          <DashboardCard
            title="Finance Portfolio"
            description="Stock quotes and portfolio tracking"
            endpoint="/api/finance/portfolio"
            icon="📈"
            color="from-green-500 to-emerald-500"
            stats={[
              { label: "Stocks", value: "Custom" },
              { label: "Update", value: "1min" },
            ]}
          />

          {/* Domains Card */}
          <DashboardCard
            title="Domain Opportunities"
            description="Available domains and auction tracking"
            endpoint="/api/domains/opportunities"
            icon="🌐"
            color="from-blue-500 to-cyan-500"
            stats={[
              { label: "Sources", value: "4" },
              { label: "Update", value: "1h" },
            ]}
          />

          {/* Business Card */}
          <DashboardCard
            title="Business Radar"
            description="SaaS and ecommerce acquisition opportunities"
            endpoint="/api/business/tracker"
            icon="🚀"
            color="from-pink-500 to-rose-500"
            stats={[
              { label: "Listings", value: "5+" },
              { label: "Update", value: "30min" },
            ]}
          />
        </div>

        {/* API Documentation */}
        <section className="bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-purple-500/20 mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">API Endpoints</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <APIEndpoint
              method="GET"
              path="/api/crypto/summary"
              description="Top cryptocurrencies by market cap"
            />
            <APIEndpoint
              method="GET"
              path="/api/finance/portfolio"
              description="Stock quotes and portfolio data"
            />
            <APIEndpoint
              method="GET"
              path="/api/domains/opportunities"
              description="Available domains and auctions"
            />
            <APIEndpoint
              method="GET"
              path="/api/business/tracker"
              description="SaaS and business opportunities"
            />
          </div>
        </section>

        {/* Features */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <FeatureCard
            icon="🔒"
            title="Secure"
            description="Environment variables and API key management"
          />
          <FeatureCard
            icon="⚡"
            title="Fast"
            description="Edge runtime with intelligent caching"
          />
          <FeatureCard
            icon="📊"
            title="Comprehensive"
            description="4 integrations: Crypto, Finance, Domains, SaaS"
          />
        </section>

        {/* Footer */}
        <footer className="text-center text-purple-400 text-sm">
          <p className="mb-2">
            <Link href="/" className="text-purple-300 hover:text-purple-100 underline">
              ← Back to Home
            </Link>
          </p>
          <p className="mb-2">
            Powered by{" "}
            <a 
              href="https://crsetsolutions.com" 
              className="text-purple-300 hover:text-purple-100 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              CRSET Solutions v2.0.0
            </a>
          </p>
          <p className="mb-2">
            Built with Next.js 14, TypeScript, Tailwind CSS
          </p>
          <p className="text-purple-500 text-xs">
            &copy; 2025 Joao Fonseca | Licensed under MIT
          </p>
        </footer>
      </div>
    </div>
  );
}

// Dashboard Card Component
function DashboardCard({
  title,
  description,
  endpoint,
  icon,
  color,
  stats,
}: {
  title: string;
  description: string;
  endpoint: string;
  icon: string;
  color: string;
  stats: { label: string; value: string }[];
}) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all">
      <div className="flex items-center gap-4 mb-4">
        <div className={`text-5xl bg-gradient-to-br ${color} bg-clip-text`}>
          {icon}
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white">{title}</h3>
          <p className="text-purple-300 text-sm">{description}</p>
        </div>
      </div>
      
      <div className="flex gap-4 mb-4">
        {stats.map((stat, i) => (
          <div key={i} className="flex-1">
            <div className="text-purple-400 text-xs">{stat.label}</div>
            <div className="text-white font-bold">{stat.value}</div>
          </div>
        ))}
      </div>

      <Link
        href={endpoint}
        className={`block w-full bg-gradient-to-r ${color} text-white font-bold py-3 px-6 rounded-lg text-center transition-transform hover:scale-105`}
        target="_blank"
      >
        View API Response
      </Link>
    </div>
  );
}

// API Endpoint Component
function APIEndpoint({
  method,
  path,
  description,
}: {
  method: string;
  path: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 p-4 bg-white/5 rounded-lg border border-purple-500/10">
      <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs font-mono rounded">
        {method}
      </span>
      <div className="flex-1">
        <code className="text-purple-300 text-sm font-mono">{path}</code>
        <p className="text-purple-400 text-xs mt-1">{description}</p>
      </div>
    </div>
  );
}

// Feature Card Component
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20 text-center">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-purple-300 text-sm">{description}</p>
    </div>
  );
}
