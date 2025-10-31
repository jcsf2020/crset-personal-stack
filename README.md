# CRSET Personal Stack (FinanceFlow)

Personal finance, crypto, domains and SaaS intelligence dashboard powered by CRSET Solutions v2.0.0.

## Overview

FinanceFlow is a personal stack built on top of CRSET Solutions that integrates multiple APIs to provide real-time insights into:

- **Cryptocurrency Market** (CoinGecko)
- **Finance Portfolio** (AlphaVantage)
- **Domain Opportunities** (Namecheap, GoDaddy, Dynadot, Sedo)
- **Business Opportunities** (Flippa, MicroAcquire, IndieHackers)

## Features

- ✅ 4 API integrations with real-time data
- ✅ Edge runtime for ultra-fast responses
- ✅ Intelligent caching strategies (1min-1h)
- ✅ Structured logging with requestId
- ✅ Sentry integration for error tracking
- ✅ Security headers on all endpoints
- ✅ TypeScript with full type safety
- ✅ Modern dashboard with Tailwind CSS

## API Endpoints

### 1. Crypto Market Summary

```bash
GET /api/crypto/summary?limit=10&currency=usd
```

**Response:**
```json
{
  "ok": true,
  "timestamp": "2025-10-31T08:00:00.000Z",
  "currency": "usd",
  "total_market_cap": 2500000000000,
  "total_volume": 150000000000,
  "coins": [...],
  "meta": {
    "source": "CoinGecko API v3",
    "count": 10
  }
}
```

**Cache:** 5 minutes

### 2. Finance Portfolio

```bash
GET /api/finance/portfolio?symbols=AAPL,GOOGL,MSFT&currency=usd
```

**Response:**
```json
{
  "ok": true,
  "timestamp": "2025-10-31T08:00:00.000Z",
  "currency": "usd",
  "total_value": 450000,
  "stocks": [...],
  "meta": {
    "source": "AlphaVantage API",
    "count": 3
  }
}
```

**Cache:** 1 minute  
**Requires:** `ALPHAVANTAGE_API_KEY` environment variable

### 3. Domain Opportunities

```bash
GET /api/domains/opportunities?keywords=finance,crypto&maxPrice=1000
```

**Response:**
```json
{
  "ok": true,
  "timestamp": "2025-10-31T08:00:00.000Z",
  "currency": "USD",
  "opportunities": [...],
  "meta": {
    "source": "Namecheap API (Mock)",
    "count": 4,
    "total_value": 2038
  }
}
```

**Cache:** 1 hour  
**Note:** Mock implementation for demo. Replace with real API calls in production.

### 4. Business Tracker

```bash
GET /api/business/tracker?category=saas&maxPrice=50000&minRevenue=1000
```

**Response:**
```json
{
  "ok": true,
  "timestamp": "2025-10-31T08:00:00.000Z",
  "currency": "USD",
  "opportunities": [...],
  "meta": {
    "source": "Flippa + MicroAcquire + IndieHackers (Mock)",
    "count": 3,
    "total_value": 172000,
    "avg_multiple": 25.6
  }
}
```

**Cache:** 30 minutes  
**Note:** Mock implementation for demo. Replace with real API calls in production.

## Environment Variables

Create a `.env.local` file with:

```bash
# Required for Finance Portfolio
ALPHAVANTAGE_API_KEY=your_alphavantage_api_key

# Optional (inherited from CRSET Solutions)
AGI_OPENAI_KEY=your_openai_api_key
OPENAI_API_KEY=your_openai_api_key
SENTRY_DSN=your_sentry_dsn
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn

# Optional (for production Namecheap/Flippa APIs)
NAMECHEAP_API_KEY=your_namecheap_api_key
FLIPPA_API_KEY=your_flippa_api_key
```

## Installation

```bash
# Clone repository
git clone https://github.com/jcsf2020/crset-personal-stack.git
cd crset-personal-stack

# Install dependencies
pnpm install

# Create .env.local
cp .env.example .env.local
# Edit .env.local with your API keys

# Run development server
pnpm dev
```

Open [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables
vercel env add ALPHAVANTAGE_API_KEY
# ... add other variables
```

### Custom Domain

Configure DNS:
```
CNAME: financeflow.crsetsolutions.com -> cname.vercel-dns.com
```

Add domain in Vercel:
```bash
vercel domains add financeflow.crsetsolutions.com
```

## Architecture

```
src/
├── app/
│   ├── api/
│   │   ├── crypto/summary/route.ts
│   │   ├── finance/portfolio/route.ts
│   │   ├── domains/opportunities/route.ts
│   │   └── business/tracker/route.ts
│   └── dashboard/page.tsx
├── lib/
│   ├── integrations/
│   │   ├── coingecko.ts
│   │   ├── alphavantage.ts
│   │   ├── namecheap.ts
│   │   └── flippa.ts
│   └── logger.ts
└── ...
```

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Runtime:** Edge
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Monitoring:** Sentry
- **Logging:** Structured JSON logs
- **Deployment:** Vercel

## Integrations

### CoinGecko (✅ Production Ready)
- **Status:** Active
- **API:** Free tier (10-50 req/min)
- **Documentation:** https://www.coingecko.com/en/api/documentation

### AlphaVantage (✅ Production Ready)
- **Status:** Active (requires API key)
- **API:** Free tier (5 req/min)
- **Documentation:** https://www.alphavantage.co/documentation/

### Namecheap (⚠️ Mock/Demo)
- **Status:** Mock implementation
- **Production:** Requires API whitelisting
- **Documentation:** https://www.namecheap.com/support/api/intro/

### Flippa/MicroAcquire (⚠️ Mock/Demo)
- **Status:** Mock implementation
- **Production:** Requires API authentication
- **Documentation:** https://flippa.com/api

## Roadmap

- [x] Phase 1: Crypto integration (CoinGecko)
- [x] Phase 2: Finance integration (AlphaVantage)
- [x] Phase 3: Domains integration (Namecheap mock)
- [x] Phase 4: Business integration (Flippa mock)
- [x] Phase 5: Dashboard v1
- [ ] Phase 6: Real Namecheap API integration
- [ ] Phase 7: Real Flippa API integration
- [ ] Phase 8: Binance integration
- [ ] Phase 9: Advanced analytics dashboard
- [ ] Phase 10: Email alerts and notifications

## License

MIT License - See LICENSE file for details

## Author

Joao Fonseca  
Email: crsetsolutions@gmail.com  
Website: https://crsetsolutions.com

## Acknowledgments

Built on top of [CRSET Solutions v2.0.0](https://crsetsolutions.com)  
Powered by Next.js, Vercel, and multiple API providers
