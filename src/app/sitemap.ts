import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/services-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const isProd = process.env.VERCEL_ENV === "production";
  if (!isProd) return []; // previews/dev: sitemap vazio

  // Use NEXT_PUBLIC_SITE_URL com fallback para crsetsolutions.com
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://crsetsolutions.com';
  const now = new Date().toISOString();
  
  // Páginas estáticas principais com prioridades otimizadas
  const staticRoutes = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/servicos", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/precos", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/centro-de-ajuda", priority: 0.7, changeFrequency: "weekly" as const },
    { path: "/faq", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/mascotes", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "/rag-demo", priority: 0.7, changeFrequency: "weekly" as const },
    { path: "/contacto", priority: 0.5, changeFrequency: "yearly" as const },
    { path: "/sobre", priority: 0.4, changeFrequency: "yearly" as const },
    { path: "/privacidade", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/termos", priority: 0.3, changeFrequency: "yearly" as const }
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: new URL(route.path, SITE_URL).href,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...getAllSlugs().map((slug) => ({
      url: new URL(`/servicos/${slug}`, SITE_URL).href,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
