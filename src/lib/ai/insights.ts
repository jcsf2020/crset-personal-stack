/**
 * AI Insights Module
 * 
 * Provides automated market analysis and insights using OpenAI GPT models.
 * Analyzes cryptocurrency market data and generates actionable intelligence.
 * 
 * @see https://platform.openai.com/docs/api-reference
 */

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.AGI_OPENAI_KEY || process.env.OPENAI_API_KEY,
});

export interface MarketInsight {
  summary: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  key_points: string[];
  opportunities: string[];
  risks: string[];
  recommendation: string;
  confidence: number;
  timestamp: string;
}

/**
 * Generate market insights from cryptocurrency data
 */
export async function generateMarketInsights(marketData: any): Promise<MarketInsight> {
  const prompt = `You are a professional cryptocurrency market analyst. Analyze the following market data and provide actionable insights.

Market Data:
- Total Market Cap: $${(marketData.global.total_market_cap / 1e9).toFixed(2)}B
- 24h Volume: $${(marketData.global.total_volume_24h / 1e9).toFixed(2)}B
- BTC Dominance: ${marketData.global.btc_dominance.toFixed(1)}%
- ETH Dominance: ${marketData.global.eth_dominance.toFixed(1)}%

Top 5 Cryptocurrencies:
${marketData.top_cryptos.slice(0, 5).map((c: any) => 
  `- ${c.name} (${c.symbol}): $${c.price.toFixed(2)}, 24h: ${c.percent_change_24h >= 0 ? '+' : ''}${c.percent_change_24h.toFixed(2)}%, 7d: ${c.percent_change_7d >= 0 ? '+' : ''}${c.percent_change_7d.toFixed(2)}%`
).join('\n')}

Provide a structured analysis with:
1. Brief market summary (2-3 sentences)
2. Overall sentiment (bullish/bearish/neutral)
3. 3-5 key points
4. 2-3 opportunities
5. 2-3 risks
6. A clear recommendation
7. Confidence level (0-100)

Format your response as JSON with this structure:
{
  "summary": "...",
  "sentiment": "bullish|bearish|neutral",
  "key_points": ["...", "..."],
  "opportunities": ["...", "..."],
  "risks": ["...", "..."],
  "recommendation": "...",
  "confidence": 85
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a professional cryptocurrency market analyst providing data-driven insights. Always respond with valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('No content in OpenAI response');
    }

    const insight = JSON.parse(content);
    
    return {
      ...insight,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error generating market insights:', error);
    throw error;
  }
}

/**
 * Generate trading pair analysis
 */
export async function analyzeTradingPair(pairData: any): Promise<string> {
  const prompt = `Analyze this trading pair and provide a brief technical analysis (max 3 sentences):

Pair: ${pairData.symbol}
Current Price: $${pairData.price.toFixed(2)}
24h Change: ${pairData.priceChangePercent24h >= 0 ? '+' : ''}${pairData.priceChangePercent24h.toFixed(2)}%
24h High: $${pairData.high24h.toFixed(2)}
24h Low: $${pairData.low24h.toFixed(2)}
24h Volume: $${(pairData.quoteVolume24h / 1e6).toFixed(2)}M

Focus on: price action, support/resistance levels, and short-term outlook.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a technical analyst. Provide concise, actionable analysis.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    return completion.choices[0].message.content || 'Analysis unavailable';
  } catch (error) {
    console.error('Error analyzing trading pair:', error);
    throw error;
  }
}

/**
 * Generate portfolio recommendations
 */
export async function generatePortfolioRecommendations(
  portfolioData: any,
  riskTolerance: 'low' | 'medium' | 'high' = 'medium'
): Promise<{
  allocation: Record<string, number>;
  rationale: string;
  rebalancing_needed: boolean;
}> {
  const prompt = `You are a portfolio manager. Based on current market conditions and ${riskTolerance} risk tolerance, suggest an optimal cryptocurrency portfolio allocation.

Current Market Leaders:
${portfolioData.top_cryptos.slice(0, 10).map((c: any) => 
  `- ${c.name} (${c.symbol}): Market Cap $${(c.market_cap / 1e9).toFixed(2)}B, 24h: ${c.percent_change_24h >= 0 ? '+' : ''}${c.percent_change_24h.toFixed(2)}%`
).join('\n')}

Provide:
1. Recommended allocation percentages (must sum to 100%)
2. Brief rationale (2-3 sentences)
3. Whether rebalancing is needed

Format as JSON:
{
  "allocation": {
    "BTC": 40,
    "ETH": 30,
    "...": 10
  },
  "rationale": "...",
  "rebalancing_needed": true
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a professional portfolio manager. Always respond with valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('No content in OpenAI response');
    }

    return JSON.parse(content);
  } catch (error) {
    console.error('Error generating portfolio recommendations:', error);
    throw error;
  }
}

/**
 * Generate market alerts based on conditions
 */
export async function generateMarketAlerts(marketData: any): Promise<{
  alerts: Array<{
    type: 'opportunity' | 'warning' | 'info';
    title: string;
    message: string;
    priority: 'high' | 'medium' | 'low';
  }>;
}> {
  const alerts: any[] = [];
  
  // Check for significant price movements
  marketData.top_cryptos.forEach((crypto: any) => {
    if (Math.abs(crypto.percent_change_24h) > 10) {
      alerts.push({
        type: crypto.percent_change_24h > 0 ? 'opportunity' : 'warning',
        title: `${crypto.name} ${crypto.percent_change_24h > 0 ? 'Surge' : 'Drop'}`,
        message: `${crypto.symbol} has ${crypto.percent_change_24h > 0 ? 'gained' : 'lost'} ${Math.abs(crypto.percent_change_24h).toFixed(2)}% in the last 24 hours.`,
        priority: Math.abs(crypto.percent_change_24h) > 15 ? 'high' : 'medium',
      });
    }
  });
  
  // Check market dominance shifts
  if (marketData.global.btc_dominance < 50) {
    alerts.push({
      type: 'info',
      title: 'Altcoin Season Indicator',
      message: `BTC dominance is at ${marketData.global.btc_dominance.toFixed(1)}%, suggesting increased altcoin activity.`,
      priority: 'medium',
    });
  }
  
  return { alerts };
}
