import { t } from "@/lib/i18n";
import BuyButton from "./BuyButton";

export default function Pricing() {
  return (
    <section className="py-16" id="pricing">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-4">{t("plans_title")}</h2>
        <p className="text-gray-600 mb-8">{t("plans_subtitle")}</p>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="border rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-2">{t("plan_starter")}</h3>
            <p className="text-gray-600 mb-4">{t("plan_starter_desc")}</p>
            <p className="text-2xl font-bold mb-2">{t("plan_starter_price")}</p>
            <p className="text-sm text-gray-500 mb-4">{t("no_lockin")}</p>
            <BuyButton href="/checkout/starter" label={t("cta_start_now")} className="w-full mb-2" />
            <BuyButton href="https://wa.me/351914423688" label={t("cta_whatsapp")} variant="secondary" className="w-full" />
          </div>
          <div className="border rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-2">{t("plan_growth")}</h3>
            <p className="text-gray-600 mb-4">{t("plan_growth_desc")}</p>
            <p className="text-2xl font-bold mb-2">{t("plan_growth_price")}</p>
            <p className="text-sm text-gray-500 mb-4">{t("no_lockin")}</p>
            <BuyButton href="/checkout/growth" label={t("cta_start_now")} className="w-full mb-2" />
            <BuyButton href="https://wa.me/351914423688" label={t("cta_whatsapp")} variant="secondary" className="w-full" />
          </div>
          <div className="border rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-2">{t("plan_scale")}</h3>
            <p className="text-gray-600 mb-4">{t("plan_scale_desc")}</p>
            <p className="text-2xl font-bold mb-2">{t("plan_scale_price")}</p>
            <p className="text-sm text-gray-500 mb-4">{t("no_lockin")}</p>
            <BuyButton href="/checkout/scale" label={t("cta_start_now")} className="w-full mb-2" />
            <BuyButton href="https://wa.me/351914423688" label={t("cta_whatsapp")} variant="secondary" className="w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
