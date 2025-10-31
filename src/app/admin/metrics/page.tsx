export const dynamic='force-dynamic';
async function getM(){ const r=await fetch('/api/agi/metrics',{cache:'no-store'}); return r.json(); }
export default async function Page(){
  const m=await getM(); const t=m?.totals??{}; const l=m?.latency_ms??{};
  return (<main style={{padding:24,fontFamily:'ui-sans-serif'}}>
    <h1 style={{marginBottom:16}}>AGI Metrics</h1>
    <ul>
      <li>Total: {t.req??0} | OK: {t.ok??0} | Err: {t.err??0} ({t.error_rate??0}%)</li>
      <li>p95: {l.p95??0}ms | p99: {l.p99??0}ms | avg: {l.avg??0}ms | samples: {l.samples??0}</li>
      <li>RPS (est.): {m?.rps_estimate??0}</li>
    </ul>
    <pre style={{marginTop:16,background:'#0b1220',color:'#e5e7eb',padding:12,borderRadius:8}}>{JSON.stringify(m,null,2)}</pre>
  </main>);
}
