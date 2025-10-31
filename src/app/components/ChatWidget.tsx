'use client';
import { useEffect, useRef, useState } from 'react';

type Msg = { role: 'user' | 'assistant'; content: string };

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState('');
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: 'assistant', content: 'Olá! Escreve a tua pergunta.' },
  ]);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    boxRef.current?.scrollTo({ top: 9e9, behavior: 'smooth' });
  }, [msgs, open]);

  useEffect(() => {
    fetch('/api/flags/chat', { credentials: 'include', cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((j) => setAllowed(!!j.allowed))
      .catch(() => setAllowed(true));
  }, []);

  async function send() {
    const text = input.trim();
    if (!text || busy) return;
    setInput('');
    const next = [...msgs, { role: 'user', content: text } as Msg];
    setMsgs(next);
    setBusy(true);
    try {
      const res = await fetch(`/api/agi/chat?v=${Date.now()}`, {
        method: 'POST',
        credentials: 'include',
        cache: 'no-store',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      });
      if (!res.ok) {
        const reason =
          res.status === 401
            ? 'Não autorizado. Faz login em /chat-login.'
            : `Erro ${res.status}`;
        setMsgs((m) => [...m, { role: 'assistant', content: reason }]);
      } else {
        const data = await res.json();
        const reply =
          data.reply ||
          data.message ||
          (typeof data === 'string' ? data : '(sem resposta)');
        setMsgs((m) => [...m, { role: 'assistant', content: reply }]);
      }
    } catch {
      setMsgs((m) => [...m, { role: 'assistant', content: 'Erro de rede.' }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <style jsx global>{`
        .crset-chat-fab{position:fixed;right:18px;bottom:calc(env(safe-area-inset-bottom) + 16px);z-index:9999;background:#111;color:#fff;border:none;border-radius:999px;padding:12px 16px;box-shadow:0 8px 24px rgba(0,0,0,.2);cursor:pointer;font:600 14px/1 system-ui;min-width:120px;min-height:44px}
        .crset-chat-panel{position:fixed;right:18px;bottom:calc(env(safe-area-inset-bottom) + 78px);width:320px;max-width:90vw;height:420px;display:flex;flex-direction:column;border-radius:14px;box-shadow:0 12px 32px rgba(0,0,0,.22);overflow:hidden;background:#fff;color:#111;z-index:9999}
        .crset-chat-header{padding:10px 12px;background:#0f172a;color:#fff;display:flex;justify-content:space-between;align-items:center;font:600 14px/1 system-ui}
        .crset-chat-body{flex:1;overflow:auto;padding:12px;background:#f8fafc}
        .crset-chat-msg{max-width:80%;margin:6px 0;padding:8px 10px;border-radius:10px;font:14px/1.3 system-ui;white-space:pre-wrap;word-break:break-word}
        .crset-chat-user{margin-left:auto;background:#0ea5e9;color:#fff;border-bottom-right-radius:2px}
        .crset-chat-assistant{margin-right:auto;background:#e5e7eb;border-bottom-left-radius:2px}
        .crset-chat-input{display:flex;gap:8px;padding:10px;background:#fff;border-top:1px solid #e5e7eb}
        .crset-chat-input textarea{flex:1;resize:none;min-height:44px;max-height:120px;padding:8px 10px;border:1px solid #d1d5db;border-radius:10px;outline:none;font:14px system-ui}
        .crset-chat-input button{min-width:92px;border:0;border-radius:10px;padding:10px 12px;font:600 14px system-ui;background:#111;color:#fff;cursor:pointer}
        .crset-chat-input button[disabled]{opacity:.6;cursor:not-allowed}
      `}</style>

      <button
        className="crset-chat-fab"
        style={{ bottom: 'calc(env(safe-area-inset-bottom) + 16px)' }}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Fechar assistente de chat' : 'Abrir assistente de chat'}
      >
        {open ? 'Fechar chat' : 'Abrir chat'}
      </button>

      {open && (
        <div className="crset-chat-panel">
          <div className="crset-chat-header">
            <span>CRSET — Chat</span>
            <button onClick={() => setOpen(false)} style={{ background: 'transparent', color: '#fff', border: 0, cursor: 'pointer' }}>×</button>
          </div>

          <div className="crset-chat-body" ref={boxRef}>
            {!allowed && (
              <div className="crset-chat-msg crset-chat-assistant">
                Não autorizado. Faz login em <a href="/chat-login">/chat-login</a>.
              </div>
            )}
            {msgs.map((m, i) => (
              <div key={i} className={`crset-chat-msg ${m.role === 'user' ? 'crset-chat-user' : 'crset-chat-assistant'}`}>
                {m.content}
              </div>
            ))}
          </div>

          <div className="crset-chat-input">
            <textarea
              id="chat-message-input"
              name="message"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escreve aqui..."
              aria-label="Mensagem para o assistente"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
            />
            <button
              disabled={!allowed || busy || !input.trim()}
              onClick={() => send()}
              type="button"
              aria-busy={busy ? 'true' : 'false'}
              aria-label="Enviar mensagem"
            >
              {busy ? 'A enviar…' : 'Enviar'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
