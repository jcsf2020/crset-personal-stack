import { Clock, BarChart3, Target, MessageCircle, Zap, Shield } from "lucide-react";

export function ValueProps() {
  const props = [
    {
      icon: Clock,
      title: "Entrega rápida",
      description: "Ciclos curtos, impacto visível em dias, não meses. Prototipagem rápida e iteração contínua."
    },
    {
      icon: BarChart3,
      title: "KPIs visíveis",
      description: "Métricas claras em produção, dashboards transparentes e relatórios automáticos."
    },
    {
      icon: Target,
      title: "Sem circo",
      description: "Design sóbrio, foco no resultado. Zero buzzwords, máxima eficiência."
    },
    {
      icon: MessageCircle,
      title: "Suporte direto",
      description: "Fala com quem faz, sem camadas. Acesso direto aos técnicos."
    },
    {
      icon: Zap,
      title: "Automação inteligente",
      description: "AGI aplicada onde faz sentido. Processos otimizados com tecnologia de ponta."
    },
    {
      icon: Shield,
      title: "Segurança garantida",
      description: "Código auditado, infraestrutura segura e conformidade com GDPR."
    }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
            Por que escolher a{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              CRSET?
            </span>
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            Automação que funciona, sem drama. Resultados práticos com transparência total 
            e tecnologia de vanguarda.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {props.map((prop, index) => {
            const Icon = prop.icon;
            return (
              <div 
                key={index}
                className="group card-glass shadow-elev-2 hover:shadow-elev-4 p-8 text-center transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-neutral-900">{prop.title}</h3>
                <p className="text-neutral-600 leading-relaxed">
                  {prop.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-green-50 border border-green-200 px-4 py-2 text-sm font-medium text-green-700 mb-4">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Tudo pronto para começar
          </div>
          <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto">
            Infraestrutura robusta, processos testados e equipa experiente. 
            O próximo passo é seu.
          </p>
        </div>
      </div>
    </section>
  );
}
