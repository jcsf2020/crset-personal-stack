import React from 'react';
import Link from 'next/link';
import { COMPANY } from '../data/company';

export default function FooterCompany(){
  const hasPhone = COMPANY.phone && COMPANY.phone.trim().length>0;
  const hasEmail = COMPANY.email && COMPANY.email.trim().length>0;
  const addr = COMPANY.address;
  const mapQ = encodeURIComponent(`${addr.streetAddress ? addr.streetAddress+ ', ' : ''}${addr.addressLocality}, ${addr.countryName}`);
  return (
    <footer className="border-t mt-12">
      <div className="mx-auto max-w-6xl px-6 py-10 grid gap-4 sm:grid-cols-2">
        <div>
          <div className="text-lg font-semibold">{COMPANY.name}</div>
          <ul className="mt-2 text-sm text-gray-600">
            <li>
              <a href={`https://www.google.com/maps/search/?api=1&query=${mapQ}`} target="_blank" rel="noreferrer">
                {addr.streetAddress ? addr.streetAddress + ', ' : ''}{addr.addressLocality}, {addr.countryName}
              </a>
            </li>
            {hasPhone && <li>📞 <a href={`tel:${COMPANY.phone}`}>{COMPANY.phone}</a></li>}
            {hasEmail && <li>✉️ <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a></li>}
            <li className="mt-2"><Link href="/">Home</Link> · <Link href="/precos">Preços</Link> · <Link href="/contacto">Contacto</Link></li>
          </ul>
        </div>
        <div className="text-sm text-gray-500 self-end sm:text-right">
          <div>{new Date().getFullYear()} © {COMPANY.name}. Todos os direitos reservados.</div>
        </div>
      </div>
    </footer>
  );
}
