import type { Metadata } from "next";

export const metadata: Metadata = { 
  title: "Planos CRSET Solutions",
  openGraph: { url: "https://crset-solutions-frontend.vercel.app/precos" }, 
  alternates: { canonical: "https://crset-solutions-frontend.vercel.app/precos" } 
};

export default function PrecosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
