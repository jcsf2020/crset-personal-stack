export const dynamic = 'force-dynamic';
async function getStatus(){ const r=await fetch('/api/agi/status',{cache:'no-store'}); try{return await r.json()}catch{return {ok:false}}}
export default async function AgiBadge(){
  const s=await getStatus(); const ok=!!s?.ok && s?.openaiConfigured!==false;
  const txt=ok?'AGI: OK':'AGI: ERRO'; const color=ok?'#16a34a':'#dc2626';
  return (<div style={{display:'inline-flex',gap:8,alignItems:'center',padding:'6px 10px',borderRadius:12,background:'#0f172a',color:color,border:`1px solid ${color}`}}>
    <strong>{txt}</strong><span style={{fontSize:12,opacity:.8}}>{s?.backend??'-'}</span>
  </div>);
}
