export const COMPANY = {
  name: process.env.NEXT_PUBLIC_COMPANY_NAME || 'CRSET Solutions',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://crsetsolutions.com',
  email: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || '',
  phone: process.env.NEXT_PUBLIC_COMPANY_PHONE || '',
  address: {
    streetAddress: process.env.NEXT_PUBLIC_COMPANY_STREET || '',
    addressLocality: 'Vila Nova de Gaia',
    addressRegion: process.env.NEXT_PUBLIC_COMPANY_REGION || '',
    postalCode: process.env.NEXT_PUBLIC_COMPANY_ZIP || '',
    addressCountry: 'PT',
    countryName: 'Portugal',
  },
};