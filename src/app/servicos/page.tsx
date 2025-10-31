import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Rocket, 
  Bot, 
  Database, 
  Building2, 
  ArrowRight, 
  Clock, 
  CheckCircle,
  ExternalLink
} from "lucide-react";
import { ServiceSchema } from "@/components/seo/structured-data";
import { Breadcrumbs, commonBreadcrumbs } from "@/components/ui/breadcrumbs";

export const metadata = {
  title: "Serviços — CRSET Solutions",
  description: "Automação prática e AGI aplicada ao negócio. Ciclos curtos, KPIs visíveis e entrega real em produção.",
  alternates: { canonical: "/servicos" },
};

const services = [
  {
    icon: Rocket,
    title: "Lançamento Rápido",
    subtitle: "1–2 semanas",
    price: "A partir de 2.500 EUR",
    description: "Solução completa para começar rapidamente com infraestrutura robusta e processos otimizados.",
    features: [
      "Landing otimizada + captação de leads",
      "Integração CRM/Supabase + workflows de e-mail",
      "Relatórios básicos e alertas automáticos",
      "Deploy automatizado e monitorização",
      "Suporte técnico durante 30 dias"
    ],
    highlight: "Mais popular",
    color: "primary"
  },
  {
    icon: Bot,
    title: "AGI & Automação",
    subtitle: "Inteligência aplicada",
    price: "A partir de 4.000 EUR",
    description: "Assistentes inteligentes e automação de processos com tecnologia de vanguarda.",
    features: [
      "Assistentes e chatbots orientados a processos",
      "Integrações com Notion, Gmail, Slack e webhooks",
      "Guardrails, métricas e modo 'humano-no-loop'",
      "Treino personalizado e otimização contínua",
      "Dashboard de performance e analytics"
    ],
    highlight: "Inovação",
    color: "secondary"
  },
  {
    icon: Database,
    title: "Integrações & Dados",
    subtitle: "Ecosistema conectado",
    price: "A partir de 3.200 EUR",
    description: "Conecte todos os seus sistemas e tenha visibilidade total dos seus dados e processos.",
    features: [
      "Stripe, Resend, Supabase e serviços de terceiros",
      "Dashboards de saúde (status/metrics) e telemetry",
      "CI/CD, monitorização e testes E2E",
      "APIs robustas e documentação completa",
      "Backup automático e recuperação de desastres"
    ],
    highlight: "Essencial",
    color: "accent"
  },
  {
    icon: Building2,
    title: "Soluções Empresariais",
    subtitle: "Escala e segurança",
    price: "Sob consulta",
    description: "Soluções personalizadas para grandes organizações com requisitos específicos.",
    features: [
      "Arquitetura personalizada e escalável",
      "Conformidade GDPR e auditoria de segurança",
      "Integração com sistemas legados",
      "SLA dedicado e suporte prioritário",
      "Consultoria estratégica e roadmap técnico"
    ],
    highlight: "Premium",
    color: "enterprise"
  }
];

const getColorClasses = (color: string) => {
  const colors = {
    primary: {
      highlight: "bg-blue-500 text-white",
      icon: "bg-blue-500/10 text-blue-600 border-blue-200",
      button: "bg-blue-600 hover:bg-blue-700 text-white"
    },
    secondary: {
      highlight: "bg-purple-500 text-white", 
      icon: "bg-purple-500/10 text-purple-600 border-purple-200",
      button: "bg-purple-600 hover:bg-purple-700 text-white"
    },
    accent: {
      highlight: "bg-teal-500 text-white",
      icon: "bg-teal-500/10 text-teal-600 border-teal-200", 
      button: "bg-teal-600 hover:bg-teal-700 text-white"
    },
    enterprise: {
      highlight: "bg-gray-900 text-white",
      icon: "bg-gray-500/10 text-gray-600 border-gray-200",
      button: "bg-gray-900 hover:bg-gray-800 text-white"
    }
  };
  return colors[color as keyof typeof colors] || colors.primary;
};

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="container mx-auto max-w-7xl px-4 py-16">
        {/* Breadcrumbs */}
        <div className="mb-8">
          <Breadcrumbs items={commonBreadcrumbs.servicos} />
        </div>
        
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
            Serviços que{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              entregam
            </span>
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            Ciclos curtos, KPIs visíveis e entrega real em produção. 
            Escolha a solução que melhor se adapta às suas necessidades.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 mb-16">
          {services.map((service, index) => {
            const Icon = service.icon;
            const colors = getColorClasses(service.color);
            
            return (
              <div 
                key={index}
                className="group card-glass shadow-elev-2 hover:shadow-elev-4 p-8 transition-all duration-300 hover:-translate-y-2 relative overflow-hidden"
              >
                {/* Highlight Badge */}
                <div className={`absolute top-6 right-6 px-3 py-1 rounded-full text-xs font-semibold ${colors.highlight}`}>
                  {service.highlight}
                </div>

                {/* Icon */}
                <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl border mb-6 ${colors.icon}`}>
                  <Icon className="h-8 w-8" />
                </div>

                {/* Header */}
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-neutral-900 mb-2">{service.title}</h2>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-neutral-600 bg-neutral-100 px-3 py-1 rounded-full">
                      {service.subtitle}
                    </span>
                    <span className="text-lg font-bold text-neutral-900">{service.price}</span>
                  </div>
                  <p className="text-neutral-600 leading-relaxed">{service.description}</p>
                </div>

                {/* Features */}
                <div className="mb-8">
                  <ul className="space-y-3">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-neutral-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <div className="space-y-3">
                  <Button 
                    asChild 
                    className={`w-full rounded-xl py-3 font-semibold transition-all duration-200 hover:-translate-y-0.5 shadow-elev-1 hover:shadow-elev-2 ${colors.button}`}
                  >
                    <Link href={`/api/contact?utm_source=servicos&utm_content=${service.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      Começar agora
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button 
                    asChild 
                    variant="outline"
                    className="w-full rounded-xl py-3 font-semibold border-2 hover:bg-neutral-50 transition-all duration-200"
                  >
                    <Link href="/precos">
                      Ver detalhes
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Section */}
        <div className="card-glass shadow-elev-3 p-12 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 text-neutral-900">
              Não encontrou o que procura?
            </h2>
            <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
              Cada projeto é único. Vamos conversar sobre as suas necessidades específicas 
              e criar uma solução à medida.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                asChild 
                size="lg"
                className="rounded-xl px-8 py-4 text-base font-semibold shadow-elev-2 hover:shadow-elev-3 transition-all duration-200 hover:-translate-y-0.5"
              >
                <Link href="mailto:crsetsolutions@gmail.com">
                  Falar com a equipa
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button 
                asChild 
                variant="outline"
                size="lg"
                className="rounded-xl px-8 py-4 text-base font-semibold border-2 hover:bg-neutral-50 transition-all duration-200"
              >
                <Link href="https://agi.crsetsolutions.com" target="_blank" rel="noopener noreferrer">
                  Ver demo AGI
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-6 text-sm text-neutral-600">
            <Link href="/precos" className="hover:text-neutral-900 transition-colors flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Ver planos & preços
            </Link>
            <span>•</span>
            <Link href="/faq" className="hover:text-neutral-900 transition-colors">
              Perguntas frequentes
            </Link>
            <span>•</span>
            <Link href="/" className="hover:text-neutral-900 transition-colors">
              Voltar ao início
            </Link>
          </div>
        </div>
      </div>
      
      {/* Structured Data for Services */}
      <ServiceSchema 
        name="Automação e AGI para Negócios"
        description="Automação prática e AGI aplicada ao negócio. Ciclos curtos, KPIs visíveis e entrega real em produção."
        url="https://crsetsolutions.com/servicos"
      />
    </main>
  );
}
