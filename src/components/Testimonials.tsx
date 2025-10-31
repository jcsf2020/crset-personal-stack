import { t } from "@/lib/i18n";

export default function Testimonials() {
  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto">
        {/* LCP Element: Otimizado para carregamento prioritário */}
        <h2 className="text-2xl font-heading font-bold mb-2">{t("results_title")}</h2>
        <p className="text-gray-600 mb-6">{t("results_subtitle")}</p>
        <div className="grid md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 rounded border bg-white">
              <p className="italic text-gray-700">{t("testimonial_placeholder")}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
