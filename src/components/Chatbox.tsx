'use client';
import { useState } from 'react';

type Msg = { role: 'user' | 'bot'; text: string };

export default function Chatbox() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const msg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/agi/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_AGI_TEST_KEY ?? ''}`,
        },
        body: JSON.stringify({ input: msg, sessionId: 'web', agent: 'boris' }),
      });
      const text = await res.text();
      setMessages(prev => [...prev, { role: 'bot', text }]);
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: '[Erro de ligacao]' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col w-full max-w-md border rounded-lg shadow p-4 space-y-2 mx-auto">
      <div className="flex-1 overflow-y-auto h-64 border p-2 rounded bg-white">
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
            <span
              className={`px-2 py-1 rounded inline-block my-1 ${m.role === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-black'
              }`}
            >
              {m.text}
            </span>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="text-center text-sm text-gray-500 py-8">
            Envia a tua primeira mensagem
          </div>
        )}
      </div>

      <div className="flex space-x-2">
        <input
          className="flex-1 border rounded px-2 py-1 text-black bg-white"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Escreve uma mensagem..."
          onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-blue-600 disabled:opacity-60 text-white px-3 py-1 rounded"
        >
          {loading ? '' : 'Enviar'}
        </button>
      </div>
    </div>
  );
}
