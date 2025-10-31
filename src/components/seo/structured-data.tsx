import Script from 'next/script'

interface OrganizationSchemaProps {
  name?: string
  description?: string
  url?: string
  logo?: string
  contactPoint?: {
    telephone?: string
    email?: string
    contactType?: string
  }
}

export function OrganizationSchema({
  name = "CRSET Solutions",
  description = "Automação e AGI aplicada ao negócio. Resultados práticos, sem circo.",
  url = "https://crsetsolutions.com",
  logo = "https://crsetsolutions.com/og.png",
  contactPoint = {
    email: "hello@crsetsolutions.com",
    contactType: "customer service"
  }
}: OrganizationSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": name,
    "description": description,
    "url": url,
    "logo": {
      "@type": "ImageObject",
      "url": logo
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "email": contactPoint.email,
      "contactType": contactPoint.contactType
    },
    "sameAs": [
      "https://linkedin.com/company/crset-solutions"
    ]
  }

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface ServiceSchemaProps {
  name: string
  description: string
  provider?: string
  areaServed?: string
  serviceType?: string
  url?: string
}

export function ServiceSchema({
  name,
  description,
  provider = "CRSET Solutions",
  areaServed = "Portugal",
  serviceType = "Technology Consulting",
  url = "https://crsetsolutions.com/servicos"
}: ServiceSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": name,
    "description": description,
    "provider": {
      "@type": "Organization",
      "name": provider
    },
    "areaServed": {
      "@type": "Country",
      "name": areaServed
    },
    "serviceType": serviceType,
    "url": url
  }

  return (
    <Script
      id={`service-schema-${name.toLowerCase().replace(/\s+/g, '-')}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface WebsiteSchemaProps {
  name?: string
  description?: string
  url?: string
  potentialAction?: {
    target?: string
    queryInput?: string
  }
}

export function WebsiteSchema({
  name = "CRSET Solutions",
  description = "Automação e AGI aplicada ao negócio. Resultados práticos, sem circo.",
  url = "https://crsetsolutions.com",
  potentialAction = {
    target: "https://crsetsolutions.com/search?q={search_term_string}",
    queryInput: "required name=search_term_string"
  }
}: WebsiteSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": name,
    "description": description,
    "url": url,
    "potentialAction": {
      "@type": "SearchAction",
      "target": potentialAction.target,
      "query-input": potentialAction.queryInput
    }
  }

  return (
    <Script
      id="website-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface BreadcrumbSchemaProps {
  items: Array<{
    name: string
    url: string
  }>
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  }

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
