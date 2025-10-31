import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  openGraph: { url: "https://crset-solutions-frontend.vercel.app/centro-de-ajuda" }, alternates: { canonical: "https://crset-solutions-frontend.vercel.app/centro-de-ajuda" },
};

export default function AjudaLayout({ children }: { children: ReactNode }) {
  return <> {children} </>;
}
