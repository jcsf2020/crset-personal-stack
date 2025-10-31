import Link from "next/link";
import { t } from "@/lib/i18n";

export default function Footer() {
  return (
    <footer className="border-t bg-gradient-to-r from-gray-50 to-gray-100 text-sm">
      <div className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-semibold">CRSET Solutions</h3>
          <p className="text-gray-600">{t("footer_tagline")}</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">{t("footer_product")}</h4>
          <ul className="space-y-1">
            <li><Link href="/servicos" className="hover:underline">{t("plans_services")}</Link></li>
            <li><Link href="/precos" className="hover:underline">{t("plans_title")}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">{t("footer_support")}</h4>
          <ul className="space-y-1">
            <li><a className="hover:underline" href="mailto:crsetsolutions@gmail.com">crsetsolutions@gmail.com</a></li>
            <li><Link href="/centro-de-ajuda" className="hover:underline">{t("help_center")}</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t text-center py-4 text-gray-500">
        (c) 2025 CRSET Solutions. {t("footer_rights")}  -  <a href="/termos" className="underline mr-3">Termos</a><a href="/privacidade" className="underline">Privacidade</a>
      </div>
     · <Link href="/mascotes" className="hover:underline focus-visible:outline-none focus-visible:ring">Mascotes</Link>
</footer>
  );
}
