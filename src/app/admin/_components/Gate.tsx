'use client';
import { useEffect, useState } from 'react';
const KEY = process.env.NEXT_PUBLIC_ADMIN_KEY || 'devonly';

export default function Gate({ children }: { children: React.ReactNode }) {
  const [ok, setOk] = useState(false);
  const [v, setV] = useState('');
  useEffect(() => { if (typeof window !== 'undefined' && localStorage.getItem('ADMIN_OK')==='1') setOk(true); }, []);
  if (ok) return <>{children}</>;
  return (
    <main style={{ padding:24, fontFamily:'system-ui', maxWidth:520, margin:'40px auto' }}>
      <h1 style={{ fontSize:22, fontWeight:600, marginBottom:12 }}>Admin</h1>
      <input type="password" placeholder="Pass" value={v} onChange={e=>setV(e.target.value)}
             style={{ width:'100%', padding:'10px', border:'1px solid #ddd', borderRadius:8, marginBottom:12 }}/>
      <button onClick={()=>{ if(v===KEY){ localStorage.setItem('ADMIN_OK','1'); setOk(true); } else alert('Wrong pass'); }}
              style={{ width:'100%', padding:'10px', borderRadius:12, border:'1px solid #ddd' }}>
        Entrar
      </button>
      <p style={{ opacity:.6, fontSize:12, marginTop:8 }}>Gate temporario - NEXT_PUBLIC_ADMIN_KEY.</p>
    </main>
  );
}
