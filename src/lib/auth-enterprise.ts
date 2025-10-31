import jwt from 'jsonwebtoken';
import { Redis } from '@upstash/redis';
const hasUpstash = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

interface ApiKeyPayload {
  sub: string; // client_id
  iat: number;
  exp: number;
  scope: string[];
  tier: 'basic' | 'pro' | 'enterprise';
}

export class EnterpriseAuth {
  private redis = hasUpstash ? Redis.fromEnv() : (null as any);
  private secret = process.env.JWT_SECRET || 'dev-secret';

  async validateApiKey(token: string): Promise<ApiKeyPayload | null> {
    try {
      // revocation check
      const isRevoked = this.redis ? await this.redis.get(`revoked:${token.slice(-8)}`) : null;
      if (isRevoked) return null;

      const payload = jwt.verify(token, this.secret) as ApiKeyPayload;
      return payload;
    } catch {
      return null;
    }
  }

  async revokeKey(token: string): Promise<void> {
    if (this.redis) { await this.redis.setex(`revoked:${token.slice(-8)}`, 86400, '1'); }
  }

  generateApiKey(clientId: string, tier: 'basic' | 'pro' | 'enterprise' = 'basic'): string {
    return jwt.sign({
      sub: clientId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days
      scope: ['agi:chat','agi:status'],
      tier
    }, this.secret);
  }
}
