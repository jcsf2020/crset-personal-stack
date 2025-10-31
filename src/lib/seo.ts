/**
 * SEO Meta Tags Generator
 * 
 * Generates comprehensive meta tags for better SEO and social sharing.
 * 
 * References:
 * - https://nextjs.org/docs/app/api-reference/functions/generate-metadata
 * - https://ogp.me/
 * - https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards
 */

import { type Metadata } from 'next';

export interface SEOConfig {
  title: string;
  description: string;
  url?: string;
  image?: string;
  type?: 'website' | 'article' | 'product';
  keywords?: string[];
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  noindex?: boolean;
  nofollow?: boolean;
  canonical?: string;
}

const DEFAULT_CONFIG = {
  siteName: 'CRSET Solutions',
  defaultTitle: 'CRSET Solutions - Automacao pratica. Sem circo.',
  defaultDescription: 'Especializados em automacao e AGI aplicada ao negocio. Entrega rapida, KPIs visiveis, sem circo.',
  defaultImage: 'https://crsetsolutions.com/og-image.png',
  twitterHandle: '@crsetsolutions',
  locale: 'pt_PT',
  baseUrl: 'https://crsetsolutions.com',
};

/**
 * Generate complete metadata for a page
 */
export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    url,
    image = DEFAULT_CONFIG.defaultImage,
    type = 'website',
    keywords = [],
    author,
    publishedTime,
    modifiedTime,
    noindex = false,
    nofollow = false,
    canonical,
  } = config;

  const fullTitle = title.includes(DEFAULT_CONFIG.siteName)
    ? title
    : `${title} | ${DEFAULT_CONFIG.siteName}`;

  const fullUrl = url || DEFAULT_CONFIG.baseUrl;

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: keywords.length > 0 ? keywords.join(', ') : undefined,
    authors: author ? [{ name: author }] : undefined,
    creator: DEFAULT_CONFIG.siteName,
    publisher: DEFAULT_CONFIG.siteName,
    
    // Canonical URL
    alternates: {
      canonical: canonical || fullUrl,
    },

    // Robots
    robots: {
      index: !noindex,
      follow: !nofollow,
      googleBot: {
        index: !noindex,
        follow: !nofollow,
      },
    },

    // Open Graph
    openGraph: {
      type,
      siteName: DEFAULT_CONFIG.siteName,
      title: fullTitle,
      description,
      url: fullUrl,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: DEFAULT_CONFIG.locale,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      site: DEFAULT_CONFIG.twitterHandle,
      creator: DEFAULT_CONFIG.twitterHandle,
      title: fullTitle,
      description,
      images: [image],
    },

    // Additional meta tags
    other: {
      'application-name': DEFAULT_CONFIG.siteName,
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',
      'apple-mobile-web-app-title': DEFAULT_CONFIG.siteName,
      'format-detection': 'telephone=no',
      'mobile-web-app-capable': 'yes',
    },
  };

  return metadata;
}

/**
 * Homepage metadata
 */
export function getHomeMetadata(): Metadata {
  return generateMetadata({
    title: DEFAULT_CONFIG.defaultTitle,
    description: DEFAULT_CONFIG.defaultDescription,
    url: DEFAULT_CONFIG.baseUrl,
    keywords: [
      'automacao',
      'agi',
      'inteligencia artificial',
      'crset solutions',
      'portugal',
      'consultoria',
      'desenvolvimento',
      'rag',
      'retrieval augmented generation',
    ],
  });
}

/**
 * Services page metadata
 */
export function getServicesMetadata(): Metadata {
  return generateMetadata({
    title: 'Servicos - Automacao e AGI Aplicada',
    description: 'Consultoria em automacao, desenvolvimento de workflows, sistema RAG e AGI aplicada ao negocio. Resultados praticos, sem drama.',
    url: `${DEFAULT_CONFIG.baseUrl}/servicos`,
    keywords: [
      'servicos',
      'consultoria',
      'automacao',
      'agi',
      'rag',
      'desenvolvimento',
      'workflows',
      'integracao',
    ],
  });
}

/**
 * Pricing page metadata
 */
export function getPricingMetadata(): Metadata {
  return generateMetadata({
    title: 'Planos & Precos - Valores Transparentes',
    description: 'Valores transparentes, sem surpresas. Essential desde 990 EUR, Pro desde 2.900 EUR, Enterprise desde 7.900 EUR. Foco em resultado.',
    url: `${DEFAULT_CONFIG.baseUrl}/precos`,
    keywords: [
      'precos',
      'planos',
      'valores',
      'essential',
      'pro',
      'enterprise',
      'orcamento',
    ],
  });
}

/**
 * FAQ page metadata
 */
export function getFAQMetadata(): Metadata {
  return generateMetadata({
    title: 'FAQ - Perguntas Frequentes',
    description: 'Respostas rapidas sobre automacao, AGI, RAG, precos, prazos e suporte. Tudo o que precisa saber sobre CRSET Solutions.',
    url: `${DEFAULT_CONFIG.baseUrl}/faq`,
    keywords: [
      'faq',
      'perguntas frequentes',
      'ajuda',
      'suporte',
      'duvidas',
    ],
  });
}

/**
 * RAG Demo page metadata
 */
export function getRAGDemoMetadata(): Metadata {
  return generateMetadata({
    title: 'RAG Demo - Sistema de Busca Inteligente',
    description: 'Demonstracao do sistema RAG (Retrieval-Augmented Generation) com busca semantica e embeddings OpenAI. 100% funcional.',
    url: `${DEFAULT_CONFIG.baseUrl}/rag-demo`,
    keywords: [
      'rag',
      'demo',
      'busca inteligente',
      'semantic search',
      'embeddings',
      'openai',
      'retrieval augmented generation',
    ],
  });
}

/**
 * Contact page metadata
 */
export function getContactMetadata(): Metadata {
  return generateMetadata({
    title: 'Contacto - Fale Connosco',
    description: 'Entre em contacto com CRSET Solutions. Email: crsetsolutions@gmail.com. Resposta em 24h.',
    url: `${DEFAULT_CONFIG.baseUrl}/contato`,
    keywords: [
      'contacto',
      'email',
      'suporte',
      'orcamento',
      'consulta',
    ],
  });
}

/**
 * Generate sitemap entry
 */
export interface SitemapEntry {
  url: string;
  lastModified?: Date;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

/**
 * Get all sitemap entries
 */
export function getSitemapEntries(): SitemapEntry[] {
  const now = new Date();
  
  return [
    {
      url: DEFAULT_CONFIG.baseUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${DEFAULT_CONFIG.baseUrl}/servicos`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${DEFAULT_CONFIG.baseUrl}/precos`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${DEFAULT_CONFIG.baseUrl}/faq`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${DEFAULT_CONFIG.baseUrl}/rag-demo`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${DEFAULT_CONFIG.baseUrl}/contato`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.6,
    },
  ];
}

