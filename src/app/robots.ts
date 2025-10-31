import type { MetadataRoute } from "next";

function normalizeBaseUrl(raw: string | undefined): string {
  // remove espaços/quebras (incl. \n), garantir protocolo e tirar trailing slashes
  const cleaned = (raw ?? "").trim().replace(/\s+/g, "");
  const withProto = /^https?:\/\//i.test(cleaned) ? cleaned : "https://crsetsolutions.com";
  return withProto.replace(/\/+$/, "");
}

export default function robots(): MetadataRoute.Robots {
  const isProd = process.env.VERCEL_ENV === "production";
  if (!isProd) {
    // Preview/Dev: bloquear e sem sitemap
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  const BASE_URL = normalizeBaseUrl(process.env.NEXT_PUBLIC_SITE_URL);

  // Produção: permitir e expor host/sitemap (array) sem quebras de linha
  return {
    rules: { userAgent: "*", allow: "/" },
    host: BASE_URL,
    sitemap: [`${BASE_URL}/sitemap.xml`],
  };
}
