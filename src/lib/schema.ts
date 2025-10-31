/**
 * Schema.org Structured Data Generator
 * 
 * Generates JSON-LD structured data for better SEO.
 * Helps search engines understand page content and display rich snippets.
 * 
 * References:
 * - https://schema.org/
 * - https://developers.google.com/search/docs/appearance/structured-data
 */

import { type Organization, type WebSite, type Service, type FAQPage, type Question, type Answer, type Offer, type Product } from 'schema-dts';

/**
 * Organization Schema
 * Describes the company/organization
 */
export function getOrganizationSchema(): Organization {
  return {
    '@type': 'Organization',
    '@id': 'https://crsetsolutions.com/#organization',
    name: 'CRSET Solutions',
    url: 'https://crsetsolutions.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://crsetsolutions.com/logo.png',
      width: '512',
      height: '512',
    },
    description: 'Automacao pratica. Sem circo. Especializados em automacao e AGI aplicada ao negocio.',
    email: 'crsetsolutions@gmail.com',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'PT',
    },
    sameAs: [
      // Add social media links when available
      // 'https://linkedin.com/company/crset-solutions',
      // 'https://twitter.com/crsetsolutions',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'crsetsolutions@gmail.com',
      availableLanguage: ['pt', 'en'],
    },
  };
}

/**
 * WebSite Schema
 * Describes the website and enables sitelinks search box
 */
export function getWebSiteSchema(): WebSite {
  return {
    '@type': 'WebSite',
    '@id': 'https://crsetsolutions.com/#website',
    url: 'https://crsetsolutions.com',
    name: 'CRSET Solutions',
    description: 'Automacao pratica. Sem circo. AGI aplicada ao negocio.',
    publisher: {
      '@id': 'https://crsetsolutions.com/#organization',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://crsetsolutions.com/rag-demo?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Service Schema
 * Describes a service offered by the organization
 */
export function getServiceSchema(service: {
  name: string;
  description: string;
  url: string;
  price?: string;
  priceCurrency?: string;
}): Service {
  return {
    '@type': 'Service',
    name: service.name,
    description: service.description,
    url: service.url,
    provider: {
      '@id': 'https://crsetsolutions.com/#organization',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Portugal',
    },
    ...(service.price && {
      offers: {
        '@type': 'Offer',
        price: service.price,
        priceCurrency: service.priceCurrency || 'EUR',
      },
    }),
  };
}

/**
 * FAQ Page Schema
 * Describes FAQ pages for rich snippets
 */
export function getFAQPageSchema(faqs: Array<{ question: string; answer: string }>): FAQPage {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Product Schema (for pricing plans)
 * Describes products/plans with pricing
 */
export function getProductSchema(product: {
  name: string;
  description: string;
  price: string;
  priceCurrency?: string;
  url: string;
  features?: string[];
}): Product {
  return {
    '@type': 'Product',
    name: product.name,
    description: product.description,
    url: product.url,
    brand: {
      '@id': 'https://crsetsolutions.com/#organization',
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.priceCurrency || 'EUR',
      availability: 'https://schema.org/InStock',
      url: product.url,
    },
    ...(product.features && {
      additionalProperty: product.features.map((feature) => ({
        '@type': 'PropertyValue',
        name: 'Feature',
        value: feature,
      })),
    }),
  };
}

/**
 * Breadcrumb Schema
 * Describes page hierarchy for breadcrumb navigation
 */
export function getBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate JSON-LD script tag content
 */
export function generateJSONLD(schema: any): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    ...schema,
  });
}

/**
 * Combine multiple schemas into a graph
 */
export function combineSchemas(...schemas: any[]): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': schemas,
  });
}

/**
 * Default schemas for all pages
 */
export function getDefaultSchemas(): string {
  return combineSchemas(
    getOrganizationSchema(),
    getWebSiteSchema()
  );
}

/**
 * Services page schemas
 */
export function getServicesSchemas(): string {
  const services = [
    {
      name: 'Consultoria em Automacao',
      description: 'Analise de processos e identificacao de oportunidades de automacao',
      url: 'https://crsetsolutions.com/servicos#consultoria',
    },
    {
      name: 'Desenvolvimento de Automacoes',
      description: 'Criacao de workflows e integracao de sistemas',
      url: 'https://crsetsolutions.com/servicos#desenvolvimento',
    },
    {
      name: 'Sistema RAG',
      description: 'Retrieval-Augmented Generation para busca inteligente',
      url: 'https://crsetsolutions.com/servicos#rag',
    },
    {
      name: 'AGI Aplicada',
      description: 'Inteligencia Artificial Geral aplicada ao negocio',
      url: 'https://crsetsolutions.com/servicos#agi',
    },
  ];

  return combineSchemas(
    getOrganizationSchema(),
    getWebSiteSchema(),
    ...services.map(getServiceSchema)
  );
}

/**
 * Pricing page schemas
 */
export function getPricingSchemas(): string {
  const plans = [
    {
      name: 'Essential',
      description: 'Perfeito para pequenos negocios que querem comecar rapidamente',
      price: '990',
      url: 'https://crsetsolutions.com/precos#essential',
      features: [
        'Site CRSET pronto a usar',
        'Captacao de leads por email',
        'Atualizacoes basicas incluidas',
        'Suporte por email',
      ],
    },
    {
      name: 'Pro',
      description: 'A escolha ideal para empresas que querem automacao inteligente',
      price: '2900',
      url: 'https://crsetsolutions.com/precos#pro',
      features: [
        'Tudo do Essential',
        'Automacoes personalizadas',
        'Integracoes com ferramentas',
        'Suporte prioritario',
      ],
    },
    {
      name: 'Enterprise',
      description: 'Solucao completa para empresas que querem escalar',
      price: '7900',
      url: 'https://crsetsolutions.com/precos#enterprise',
      features: [
        'Tudo do Pro',
        'AGI aplicada ao negocio',
        'Suporte dedicado',
        'SLA garantido',
      ],
    },
  ];

  return combineSchemas(
    getOrganizationSchema(),
    getWebSiteSchema(),
    ...plans.map(getProductSchema)
  );
}

/**
 * FAQ page schemas
 */
export function getFAQSchemas(faqs: Array<{ question: string; answer: string }>): string {
  return combineSchemas(
    getOrganizationSchema(),
    getWebSiteSchema(),
    getFAQPageSchema(faqs)
  );
}

