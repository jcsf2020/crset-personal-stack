import { Search, FileText, Cog, ArrowRight } from "lucide-react";

export function HowWeWork() {
  const steps = [
    {
      number: "01",
      icon: Search,
      title: "Diagnóstico",
      subtitle: "≤48h",
      description: "Mapa completo de dores e oportunidades. Análise técnica detalhada e identificação de quick wins."
    },
    {
      number: "02", 
      icon: FileText,
      title: "Plano & OKRs",
      subtitle: "Estratégia clara",
      description: "O que muda, como medimos, quando entregamos. Roadmap detalhado com marcos mensuráveis."
    },
    {
      number: "03",
      icon: Cog,
      title: "Entrega & Operação", 
      subtitle: "Melhoria contínua",
      description: "Iterações curtas, monitorização em tempo real e otimização baseada em dados."
    }
  ];

  return (
    <section id="como-trabalhamos" className="py-20 bg-white">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
            Como{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              trabalhamos
            </span>
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            Processo simples, transparente e focado em resultados mensuráveis. 
            Cada passo é documentado e validado.
          </p>
        </div>

        <div className="relative">
          {/* Linha conectora - apenas em desktop */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
          
          <div className="grid gap-12 md:grid-cols-3 relative">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isLast = index === steps.length - 1;
              
              return (
                <div key={index} className="relative text-center group">
                  {/* Seta conectora - apenas entre cards, não no último */}
                  {!isLast && (
                    <div className="hidden lg:block absolute top-24 -right-6 z-10">
                      <div className="w-12 h-12 rounded-full bg-white border-2 border-neutral-200 flex items-center justify-center group-hover:border-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                        <ArrowRight className="h-5 w-5" />
                      </div>
                    </div>
                  )}
                  
                  <div className="card-glass shadow-elev-2 hover:shadow-elev-4 p-8 transition-all duration-300 hover:-translate-y-2">
                    <div className="relative mb-8">
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-primary mx-auto mb-4 shadow-elev-3 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="h-10 w-10 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-accent text-white text-lg font-bold shadow-elev-2">
                        {step.number}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-2xl font-bold text-neutral-900 mb-2">{step.title}</h3>
                        <div className="inline-flex items-center rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-sm font-medium text-primary">
                          {step.subtitle}
                        </div>
                      </div>
                      <p className="text-neutral-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Bottom */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-subtle border border-neutral-200 px-6 py-3 text-sm font-medium text-neutral-700 mb-6">
            <Cog className="h-4 w-4 text-primary animate-spin" style={{animationDuration: '3s'}} />
            Processo testado em dezenas de projetos
          </div>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Cada etapa é otimizada para máxima eficiência e transparência. 
            Sem surpresas, sem atrasos.
          </p>
        </div>
      </div>
    </section>
  );
}
