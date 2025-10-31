'use client';
import { useState, useEffect } from 'react';
import AGIWidget from "../_components/AGIWidget";
export default function AgiLivePage() {
  const [token, setToken] = useState('');
  const [agent, setAgent] = useState<'boris'|'laya'|'irina'>('boris');
  const [strict, setStrict] = useState(false);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState('web-demo-' + Math.random().toString(36).slice(2,8));
  const [mode, setMode] = useState<'normal'|'noop'>('normal');
  const [out, setOut] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // carregar JWT do browser
  useEffect(() => {
    const t = localStorage.getItem('CRSET_JWT') || '';
    if (t) setToken(t);
  }, []);

  // persistir agent/mode/strict
  useEffect(()=>{ const v = localStorage.getItem('CRSET_AGENT'); if (v) setAgent(v as any); },[]);
  useEffect(()=>{ localStorage.setItem('CRSET_AGENT', agent); },[agent]);
  useEffect(()=>{ const v = localStorage.getItem('CRSET_MODE'); if (v) setMode(v as any); },[]);
  useEffect(()=>{ localStorage.setItem('CRSET_MODE', mode); },[mode]);
  useEffect(()=>{ const v = localStorage.getItem('CRSET_STRICT'); if (v) setStrict(v==='1'); },[]);
  useEffect(()=>{ localStorage.setItem('CRSET_STRICT', strict ? '1' : '0'); },[strict]);

  const saveToken = () => {
    localStorage.setItem('CRSET_JWT', token.trim());
  };

  async function send() {
    if (!input.trim()) return;
    setLoading(true);
    setOut('');
    try {
      const res = await fetch('/api/agi/chat', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          ...(token.trim() ? { authorization: `Bearer ${token.trim()}` } : {})
        },
        body: JSON.stringify({
          agent,
          input,
          sessionId,
          strict,
          ...(mode === 'noop' ? { mode: 'noop' } : {})
        })
      });
      const text = await res.text();
      setOut(text);
    } catch (e:any) {
      setOut('CLIENT_ERROR: ' + (e?.message || 'unknown'));
    } finally {
      setLoading(false);
    }
  }

  return (<>
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <h1 className="text-2xl font-semibold">AGI Live Demo</h1>

      <div className="grid gap-4">
        <label className="grid gap-2">
          <span className="text-sm font-medium">JWT (Authorization Bearer)</span>
          <input
            value={token}
            onChange={(e)=>setToken(e.target.value)}
            placeholder="cole aqui o JWT"
            className="w-full rounded border px-3 py-2 bg-white text-black placeholder-gray-500"
          />
          <div className="flex gap-2">
            <button onClick={saveToken} className="rounded px-3 py-2 border">Guardar no browser</button>
            <button
              onClick={()=>navigator.clipboard.writeText(token)}
              className="rounded px-3 py-2 border"
              title="Copiar JWT"
            >
              Copiar JWT
            </button>
          </div>
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="grid gap-1">
            <span className="text-sm font-medium">Agent</span>
            <select
              value={agent}
              onChange={(e)=>setAgent(e.target.value as any)}
              className="rounded border px-2 py-2 bg-white text-black"
            >
              <option value="boris">Boris</option>
              <option value="laya">Laya</option>
              <option value="irina">Irina</option>
            </select>
          </label>

          <label className="grid gap-1">
            <span className="text-sm font-medium">Modo</span>
            <select
              value={mode}
              onChange={(e)=>setMode(e.target.value as any)}
              className="rounded border px-2 py-2 bg-white text-black"
            >
              <option value="normal">Normal</option>
              <option value="noop">No-op</option>
            </select>
          </label>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={strict} onChange={(e)=>setStrict(e.target.checked)} />
            <span className="text-sm">Strict (raw)</span>
          </label>
        </div>

        <label className="grid gap-2">
          <span className="text-sm font-medium">Input</span>
          <textarea
            value={input}
            onChange={(e)=>setInput(e.target.value)}
            onKeyDown={(e)=>{ if(e.key==='Enter' && (e.ctrlKey||e.metaKey)){ e.preventDefault(); send(); } }}
            placeholder="Escreve aqui..."
            className="w-full rounded border px-3 py-2 min-h-[96px] bg-white text-black placeholder-gray-500"
          />
          <button
            disabled={loading || !input.trim()}
            onClick={send}
            className="rounded px-3 py-2 border bg-blue-500 text-white disabled:opacity-50"
            aria-busy={loading ? 'true' : 'false'}
          >
            {loading ? 'A enviar' : 'Enviar'}
          </button>
        </label>

        <div className="grid gap-2">
          <span className="text-sm font-medium">Output</span>
          <pre aria-live="polite" className="rounded border p-3 min-h-[96px] whitespace-pre-wrap">{out}</pre>
        </div>
      </div>
    </main>
    <AGIWidget />
    </>
);
}
