export default function SeoJsonLd() {
  const org = {"@context":"https://schema.org","@type":"Organization","name":"CRSET Solutions","url":"https://crsetsolutions.com","logo":"https://crsetsolutions.com/icon.png"};
  const website = {"@context":"https://schema.org","@type":"WebSite","name":"CRSET Solutions","url":"https://crsetsolutions.com"};
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }} />
    </>
  );
}
