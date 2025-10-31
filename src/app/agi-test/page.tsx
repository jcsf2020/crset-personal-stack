import dynamic from 'next/dynamic';
import type { Metadata } from "next";

const Chatbox = dynamic(() => import('@/components/Chatbox'), { ssr: false });

export const metadata = {
  openGraph: { url: "https://crset-solutions-frontend.vercel.app/agi-test" }, title: 'AGI Test · CRSET',
  description: 'Chatbox AGI Commander de teste'
};

export default function Page() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-start p-6 gap-6">
      <h1 className="text-2xl font-semibold">AGI Commander · Chatbox (Teste)</h1>
      <p className="text-gray-600 max-w-xl text-center">
        Fala com o nosso AGI. Em produção, o acesso ao endpoint está protegido por token Bearer.
      </p>
      <Chatbox />
      <div className="text-xs text-gray-500">
        Dica: se o botão ficar em &ldquo;...&rdquo;, é o rate-limit ou a chave de teste. Tenta novamente.
      </div>
    </main>
  );
}
