'use client';
import Script from 'next/script';
import { COMPANY } from '../data/company';

export function SchemaOrg(){
  const org = {
    '@context':'https://schema.org',
    '@type':'Organization',
    name: COMPANY.name,
    url: COMPANY.url,
    email: COMPANY.email || undefined,
    telephone: COMPANY.phone || undefined,
    address: {
      '@type':'PostalAddress',
      streetAddress: COMPANY.address.streetAddress || undefined,
      addressLocality: COMPANY.address.addressLocality,
      addressRegion: COMPANY.address.addressRegion || undefined,
      postalCode: COMPANY.address.postalCode || undefined,
      addressCountry: COMPANY.address.addressCountry,
    }
  };
  return (
    <Script id="schema-org" type="application/ld+json"
      dangerouslySetInnerHTML={{__html: JSON.stringify(org)}} />
  );
}
