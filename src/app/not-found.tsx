import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-2">Pagina nao encontrada</h1>
      <Link href="/" className="underline">Voltar ao inicio</Link>
    </main>
  );
}
