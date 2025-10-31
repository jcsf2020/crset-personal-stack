export default function Head() {
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "CRSET Solutions",
    "url": "https://crset-solutions-frontend.vercel.app",
    "logo": "https://crset-solutions-frontend.vercel.app/opengraph-image"
  };
  const web = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "https://crset-solutions-frontend.vercel.app",
    "name": "CRSET Solutions"
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(web) }} />
    </>
  );
}
