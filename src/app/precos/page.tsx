import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Check, 
  Star, 
  ArrowRight, 
  Building2, 
  Calendar, 
  ShoppingCart, 
  FileText,
  Zap,
  Shield,
  Headphones
} from "lucide-react";
import { PRICE_FALLBACKS } from "@/lib/prices";

export const metadata = {
  title: "Planos & Preços — CRSET Solutions",
  description: "Planos simples e transparentes. Foco em resultado, sem surpresas. Valores sem IVA, personalizações sob orçamento.",
  alternates: { canonical: "/precos" },
};

const mainPlans = [
  {
    name: "Essential",
    subtitle: "Para começar",
    setup: "990 EUR",
    monthly: "79 EUR/mês",
    description: "Perfeito para pequenos negócios que querem começar rapidamente com uma presença digital profissional.",
    features: [
      "Site CRSET pronto a usar",
      "Captação de leads por email (Resend)",
      "Atualizações básicas incluídas",
      "Suporte por email",
      "SSL e backup automático",
      "Analytics básicos"
    ],
    highlight: false,
    icon: Zap,
    color: "blue"
  },
  {
    name: "Pro",
    subtitle: "Mais popular",
    setup: "2.900 EUR",
    monthly: "149 EUR/mês", 
    description: "A escolha ideal para empresas que querem automação inteligente e integração com ferramentas existentes.",
    features: [
      "Tudo do Essential",
      "Automações de marketing",
      "Leads + integrações Notion/Supabase",
      "Relatórios detalhados",
      "Suporte prioritário",
      "Integrações personalizadas",
      "Dashboard de métricas"
    ],
    highlight: true,
    icon: Star,
    color: "primary"
  },
  {
    name: "Enterprise",
    subtitle: "Máxima flexibilidade",
    setup: "5.900 EUR",
    monthly: "299 EUR/mês",
    description: "Solução completa para grandes organizações com necessidades específicas e requisitos de segurança.",
    features: [
      "Tudo do Pro",
      "Layout e módulos personalizados",
      "SLA de prioridade garantido",
      "Integrações avançadas ilimitadas",
      "Consultoria estratégica",
      "Auditoria de segurança",
      "Suporte dedicado 24/7"
    ],
    highlight: false,
    icon: Shield,
    color: "gray"
  }
];

const nicheServices = [
  {
    name: "Imobiliária",
    setup: "3.900 EUR",
    monthly: "199 EUR/mês",
    icon: Building2,
    features: [
      "Módulos de imóveis completos",
      "Agendamento de visitas",
      "Integrações com portais",
      "CRM especializado"
    ],
    highlight: true,
    color: "emerald"
  },
  {
    name: "Agenda",
    setup: "1.900 EUR", 
    monthly: "119 EUR/mês",
    icon: Calendar,
    features: [
      "Páginas de serviço",
      "Reserva de slots",
      "Alertas por email",
      "Sincronização calendários"
    ],
    highlight: false,
    color: "purple"
  },
  {
    name: "E-commerce",
    setup: "3.500 EUR",
    monthly: "149 EUR/mês",
    icon: ShoppingCart,
    features: [
      "Catálogo + checkout",
      "Integração Shopify (opcional)",
      "Relatórios de vendas",
      "Gestão de inventário"
    ],
    highlight: false,
    color: "orange"
  },
  {
    name: "Catálogo",
    setup: "2.500 EUR",
    monthly: "129 EUR/mês", 
    icon: FileText,
    features: [
      "Catálogo de produtos",
      "Formulários de pedido",
      "Leads integradas",
      "Gestão de conteúdo"
    ],
    highlight: false,
    color: "teal"
  }
];

const getColorClasses = (color: string, highlight: boolean = false) => {
  if (highlight) {
    return {
      card: "border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-elev-4",
      badge: "bg-blue-500 text-white",
      button: "bg-blue-600 hover:bg-blue-700 text-white shadow-elev-2 hover:shadow-elev-3",
      icon: "bg-blue-500 text-white"
    };
  }
  
  const colors = {
    blue: {
      card: "border-blue-100 hover:border-blue-200",
      badge: "bg-blue-100 text-blue-700",
      button: "bg-blue-600 hover:bg-blue-700 text-white",
      icon: "bg-blue-500/10 text-blue-600"
    },
    gray: {
      card: "border-gray-100 hover:border-gray-200",
      badge: "bg-gray-100 text-gray-700", 
      button: "bg-gray-900 hover:bg-gray-800 text-white",
      icon: "bg-gray-500/10 text-gray-600"
    },
    emerald: {
      card: "border-emerald-100 hover:border-emerald-200",
      badge: "bg-emerald-100 text-emerald-700",
      button: "bg-emerald-600 hover:bg-emerald-700 text-white",
      icon: "bg-emerald-500/10 text-emerald-600"
    },
    purple: {
      card: "border-purple-100 hover:border-purple-200", 
      badge: "bg-purple-100 text-purple-700",
      button: "bg-purple-600 hover:bg-purple-700 text-white",
      icon: "bg-purple-500/10 text-purple-600"
    },
    orange: {
      card: "border-orange-100 hover:border-orange-200",
      badge: "bg-orange-100 text-orange-700",
      button: "bg-orange-600 hover:bg-orange-700 text-white", 
      icon: "bg-orange-500/10 text-orange-600"
    },
    teal: {
      card: "border-teal-100 hover:border-teal-200",
      badge: "bg-teal-100 text-teal-700",
      button: "bg-teal-600 hover:bg-teal-700 text-white",
      icon: "bg-teal-500/10 text-teal-600"
    }
  };
  
  return colors[color as keyof typeof colors] || colors.blue;
};

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto max-w-7xl px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
            Planos &{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Preços
            </span>
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Valores transparentes, sem surpresas. Foco em resultado, 
            com suporte incluído e garantia de satisfação.
          </p>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-sm border border-neutral-200 px-6 py-3 text-sm font-medium text-neutral-700">
            <Headphones className="h-4 w-4 text-green-600" />
            Valores sem IVA • Personalizações sob orçamento
          </div>
        </div>

        {/* Main Plans */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-neutral-900">
            Planos Principais
          </h2>
          <div className="grid gap-8 lg:grid-cols-3">
            {mainPlans.map((plan, index) => {
              const Icon = plan.icon;
              const colors = getColorClasses(plan.color, plan.highlight);
              
              return (
                <div 
                  key={index}
                  className={`card-glass shadow-elev-2 hover:shadow-elev-4 p-8 transition-all duration-300 hover:-translate-y-2 relative ${colors.card}`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className={`px-4 py-2 rounded-full text-sm font-semibold ${colors.badge}`}>
                        {plan.subtitle}
                      </div>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl mb-4 ${colors.icon}`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-neutral-900 mb-2">{plan.name}</h3>
                    {!plan.highlight && (
                      <p className="text-sm text-neutral-600 font-medium">{plan.subtitle}</p>
                    )}
                  </div>

                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-neutral-900 mb-2">
                      {plan.setup}
                    </div>
                    <div className="text-lg text-neutral-600">
                      + {plan.monthly}
                    </div>
                  </div>

                  <p className="text-neutral-600 text-center mb-8 leading-relaxed">
                    {plan.description}
                  </p>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-neutral-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    asChild 
                    className={`w-full rounded-xl py-3 font-semibold transition-all duration-200 hover:-translate-y-0.5 ${colors.button}`}
                  >
                    <Link href="/servicos">
                      Começar já
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Niche Services */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-neutral-900">
              Soluções Especializadas
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Pacotes otimizados para sectores específicos com funcionalidades dedicadas.
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {nicheServices.map((service, index) => {
              const Icon = service.icon;
              const colors = getColorClasses(service.color, service.highlight);
              
              return (
                <div 
                  key={index}
                  className={`card-glass shadow-elev-2 hover:shadow-elev-4 p-6 transition-all duration-300 hover:-translate-y-2 ${colors.card}`}
                >
                  {service.highlight && (
                    <div className="absolute -top-2 -right-2">
                      <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                        <Star className="h-3 w-3 text-yellow-800" />
                      </div>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl mb-3 ${colors.icon}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-bold text-neutral-900 mb-2">{service.name}</h3>
                    <div className="text-2xl font-bold text-neutral-900">{service.setup}</div>
                    <div className="text-sm text-neutral-600">+ {service.monthly}</div>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-neutral-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    asChild 
                    size="sm"
                    className={`w-full rounded-lg font-semibold transition-all duration-200 ${colors.button}`}
                  >
                    <Link href="/servicos">
                      Saber mais
                    </Link>
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="card-glass shadow-elev-3 p-12 text-center">
          <h2 className="text-3xl font-bold mb-4 text-neutral-900">
            Precisa de algo diferente?
          </h2>
          <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Cada negócio é único. Vamos criar uma proposta personalizada 
            que se adapte perfeitamente às suas necessidades.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild 
              size="lg"
              className="rounded-xl px-8 py-4 text-base font-semibold shadow-elev-2 hover:shadow-elev-3 transition-all duration-200 hover:-translate-y-0.5"
            >
              <Link href="/faq">
                Falar connosco
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <Button 
              asChild 
              variant="outline"
              size="lg"
              className="rounded-xl px-8 py-4 text-base font-semibold border-2 hover:bg-neutral-50 transition-all duration-200"
            >
              <Link href="/servicos">
                Ver todos os serviços
              </Link>
            </Button>
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-12 text-center text-sm text-neutral-600">
          <p>
            Todos os preços são apresentados sem IVA. 
            <Link href="/faq" className="underline hover:text-neutral-900 transition-colors ml-1">
              Consulte as nossas FAQ
            </Link>
            {" "}para mais informações sobre condições e personalizações.
          </p>
        </div>
      </div>
    </main>
  );
}
