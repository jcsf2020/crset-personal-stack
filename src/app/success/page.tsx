export const metadata: Metadata = { openGraph: { url: "https://crset-solutions-frontend.vercel.app/success" } };
import Link from 'next/link';
import type { Metadata } from "next";

export default function SuccessPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16 space-y-6">
      <h1 className="text-3xl font-bold">Pagamento concluido</h1>

      <section className="border rounded-2xl p-6 space-y-2">
        <p className="opacity-80">Obrigado! Recebemos o teu pagamento.</p>

        <div className="flex gap-2">
          <Link href="/start" className="px-4 py-3 rounded-xl bg-black text-white text-white">Comecar</Link>
          <Link href="/" className="px-4 py-3 rounded-xl border">Voltar ao inicio</Link>
        </div>
      </section>
    </main>
  );
}
