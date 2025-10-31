'use client';
import { COMPANY } from '../data/company';

type Props = { compact?: boolean };

export default function ContactInfo({ compact=false }: Props) {
  const email = COMPANY.email || process.env.NEXT_PUBLIC_SUPPORT_EMAIL || '';
  const phone = COMPANY.phone || '';
  const addr  = COMPANY.address || {};
  const hasAddress =
    !!(addr.streetAddress || addr.postalCode || addr.addressLocality || addr.addressRegion || addr.countryName || addr.addressCountry);

  const hours = process.env.NEXT_PUBLIC_COMPANY_HOURS || ''; // opcional: só mostra se existir

  const locationLine = [
    addr.streetAddress,
    addr.postalCode,
    addr.addressLocality,
    addr.addressRegion,
    addr.countryName || addr.addressCountry
  ].filter(Boolean).join(', ');

  return (
    <section aria-labelledby="contact-info" className={compact ? 'text-sm' : ''}>
      <h2 id="contact-info" style={{marginBottom:8}}>Contactos</h2>
      <ul style={{lineHeight:1.6}}>
        {email ? <li>Email: <a href={`mailto:${email}`}>{email}</a></li> : null}
        {phone ? <li>Telefone: <a href={`tel:${phone.replace(/\s+/g,'')}`}>{phone}</a></li> : null}
        {hasAddress ? <li>Localização: {locationLine}</li> : null}
        {hours ? <li>Horário: {hours}</li> : null}
      </ul>
    </section>
  );
}
