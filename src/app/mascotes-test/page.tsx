export const metadata: Metadata = { openGraph: { url: "https://crset-solutions-frontend.vercel.app/mascotes-test" } };
import MascoteBoris from "@/components/MascoteBoris";
import type { Metadata } from "next";

export default function Page() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-8">Teste Mascotes</h1>
      <MascoteBoris />
    </main>
  );
}
