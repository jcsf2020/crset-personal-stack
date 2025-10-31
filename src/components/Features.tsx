"use client";

import { CheckCircle } from "lucide-react";

export default function Features() {
  const items = [
    {
      title: "Automação Inteligente",
      desc: "Fluxos que poupam horas com integracoes sem friccao.",
    },
    {
      title: "Relatorios Avancados",
      desc: "Dashboards claros para decidir com dados e nao com intuicao.",
    },
    {
      title: "Integracoes Flexiveis",
      desc: "Conecta com CRM, ecom e ferramentas da tua stack.",
    },
    {
      title: "Segurança Enterprise",
      desc: "SSO, SLA e boas praticas para garantir confianca.",
    },
  ];

  return (
    <section id="serviços" className="py-14 md:py-20 bg-gray-50" aria-label="Principais features">
      <div className="container-pro">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Tudo o que precisas para escalar
          </h2>
          <p className="muted mt-3 max-w-prose mx-auto">
            Construido para captar, organizar e crescer com consistencia.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {items.map((f) => (
            <div key={f.title} className="card p-6 flex flex-col gap-3">
              <CheckCircle className="text-emerald-500 w-6 h-6" />
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="text-sm muted">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
