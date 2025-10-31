'use client';
import React from 'react';
export default function AgiPage() {
  return (
    <main className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-4">AGI Tools</h1>
      <h2 className="text-2xl font-semibold mt-4 mb-2">Health-check</h2>
      <pre className="bg-black/30 p-3 rounded border border-white/10 text-white">
{`curl -s https://crsetsolutions.com/api/agi/status`}
      </pre>
      <h2 className="text-2xl font-semibold mt-4 mb-2">POST /api/agi/chat</h2>
      <pre className="bg-black/30 p-3 rounded border border-white/10 text-white">
{`curl -i -X POST https://crsetsolutions.com/api/agi/chat -H 'content-type: application/json' -d '{"agent":"boris","input":"diagnostico rapido"}'`}
      </pre>
    </main>
  );
}
