export const dynamic = 'force-dynamic';
import { redis } from '@/lib/redis';

function pct(values:number[], p:number){
  if(values.length===0) return 0;
  const v = [...values].sort((a,b)=>a-b);
  const idx = Math.ceil((p/100)*(v.length-1));
  return v[idx] ?? v[v.length-1];
}
function nowMinuteKey(){
  const d = new Date();
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth()+1).padStart(2,'0');
  const day = String(d.getUTCDate()).padStart(2,'0');
  const hh = String(d.getUTCHours()).padStart(2,'0');
  const mm = String(d.getUTCMinutes()).padStart(2,'0');
  return `${y}${m}${day}${hh}${mm}`; // UTC
}

export async function GET(){
  // Counters
  const [req, ok, err] = await Promise.all([
    redis.hget<number>('metrics:agi:counters','req').then(v=>Number(v||0)),
    redis.hget<number>('metrics:agi:counters','ok').then(v=>Number(v||0)),
    redis.hget<number>('metrics:agi:counters','err').then(v=>Number(v||0)),
  ]);

  // Latencias (ultimas 1000)
  const lat = (await redis.lrange<number>('metrics:agi:lat',0,999)).map(Number);
  const p95 = Math.round(pct(lat,95));
  const p99 = Math.round(pct(lat,99));
  const avg = lat.length? Math.round(lat.reduce((a,b)=>a+b,0)/lat.length) : 0;

  // RPS simples (requests no minuto atual)
  const kMin = `metrics:agi:req:${nowMinuteKey()}`;
  const rps = Number((await redis.get<number>(kMin)) || 0) / 60;

  const body = {
    ok: true,
    totals: { req, ok, err, error_rate: req? +(err/req*100).toFixed(2) : 0 },
    latency_ms: { p95, p99, avg, samples: lat.length },
    rps_estimate: +rps.toFixed(2),
    ts: new Date().toISOString()
  };

  const res = new Response(JSON.stringify(body, null, 2), {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store, max-age=0',
    }
  });
  res.headers.set('X-Content-Type-Options','nosniff');
  res.headers.set('Referrer-Policy','strict-origin-when-cross-origin');
  res.headers.set('Permissions-Policy','camera=(), microphone=(), geolocation=()');
  res.headers.set('X-Robots-Tag','noindex');
  return res;
}
