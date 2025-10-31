import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface CacheEntry {
  key: string;
  value: any;
  ttl?: number; // Time to live em segundos
  tags?: string[];
}

// Simulação de cache em memória (em produção usar Redis/Cloudflare KV)
const cache = new Map<string, { value: any; expires: number; tags: string[] }>();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');
  const debug = searchParams.get('debug');

  if (debug === '1') {
    return NextResponse.json({
      ok: true,
      service: 'cache',
      status: 'operational',
      stats: {
        total_keys: cache.size,
        memory_usage: `${Math.round(JSON.stringify([...cache.entries()]).length / 1024)}KB`,
        hit_rate: '85%' // Simulado
      },
      features: {
        memory_cache: true,
        redis_integration: false, // TODO: implementar
        cloudflare_kv: false,     // TODO: implementar
        cache_tags: true
      }
    });
  }

  if (!key) {
    return NextResponse.json(
      { ok: false, error: 'Chave é obrigatória' },
      { status: 400 }
    );
  }

  const entry = cache.get(key);
  if (!entry) {
    return NextResponse.json(
      { ok: false, error: 'Chave não encontrada' },
      { status: 404 }
    );
  }

  // Verificar se expirou
  if (Date.now() > entry.expires) {
    cache.delete(key);
    return NextResponse.json(
      { ok: false, error: 'Chave expirada' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    ok: true,
    key,
    value: entry.value,
    tags: entry.tags,
    expires_in: Math.max(0, Math.floor((entry.expires - Date.now()) / 1000))
  });
}

export async function POST(request: NextRequest) {
  try {
    const data: CacheEntry = await request.json();

    if (!data.key || data.value === undefined) {
      return NextResponse.json(
        { ok: false, error: 'Chave e valor são obrigatórios' },
        { status: 400 }
      );
    }

    const ttl = data.ttl || 3600; // 1 hora por defeito
    const expires = Date.now() + (ttl * 1000);
    const tags = data.tags || [];

    cache.set(data.key, {
      value: data.value,
      expires,
      tags
    });

    return NextResponse.json({
      ok: true,
      message: 'Valor armazenado no cache',
      key: data.key,
      expires_in: ttl,
      tags
    });

  } catch (error) {
    console.error('Erro ao armazenar no cache:', error);
    return NextResponse.json(
      { ok: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');
  const tag = searchParams.get('tag');

  if (key) {
    // Eliminar chave específica
    const deleted = cache.delete(key);
    return NextResponse.json({
      ok: true,
      message: deleted ? 'Chave eliminada' : 'Chave não encontrada',
      deleted
    });
  }

  if (tag) {
    // Eliminar todas as chaves com a tag
    let deletedCount = 0;
    for (const [cacheKey, entry] of cache.entries()) {
      if (entry.tags.includes(tag)) {
        cache.delete(cacheKey);
        deletedCount++;
      }
    }
    return NextResponse.json({
      ok: true,
      message: `${deletedCount} chaves eliminadas com a tag '${tag}'`,
      deleted_count: deletedCount
    });
  }

  return NextResponse.json(
    { ok: false, error: 'Chave ou tag é obrigatória' },
    { status: 400 }
  );
}
