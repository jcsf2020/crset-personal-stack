import Link from "next/link";
import { ExternalLink, Shield, Zap, GitBranch, Award, Users } from "lucide-react";

export function SocialProof() {
  const metrics = [
    {
      icon: Zap,
      title: "Lighthouse Desktop",
      value: "100/100/96/100",
      description: "Performance máxima",
      href: "https://storage.googleapis.com/lighthouse-infrastructure.appspot.com/reports/1758060570753-93513.report.html",
      color: "green"
    },
    {
      icon: Zap,
      title: "Lighthouse Mobile",
      value: "100/100/96/100", 
      description: "Otimizado para mobile",
      href: "https://storage.googleapis.com/lighthouse-infrastructure.appspot.com/reports/1758060659567-47467.report.html",
      color: "green"
    },
    {
      icon: Shield,
      title: "Security Scan",
      value: "GitGuardian ✓",
      description: "Código auditado",
      href: "https://github.com/jcsf2020/crset-solutions-frontend/actions",
      color: "blue"
    },
    {
      icon: GitBranch,
      title: "Changelog",
      value: "Público",
      description: "Transparência total",
      href: "https://github.com/jcsf2020/crset-solutions-frontend/pulls?q=is%3Apr+is%3Amerged",
      color: "purple"
    },
    {
      icon: Award,
      title: "Uptime",
      value: "99.9%",
      description: "Disponibilidade garantida",
      href: "https://crsetsolutions.com",
      color: "emerald"
    },
    {
      icon: Users,
      title: "Suporte",
      value: "< 2h",
      description: "Tempo de resposta",
      href: "/faq",
      color: "orange"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      green: "bg-green-500/10 text-green-600 border-green-200",
      blue: "bg-blue-500/10 text-blue-600 border-blue-200", 
      purple: "bg-purple-500/10 text-purple-600 border-purple-200",
      emerald: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
      orange: "bg-orange-500/10 text-orange-600 border-orange-200"
    };
    return colors[color as keyof typeof colors] || colors.green;
  };

  return (
    <section className="py-16 bg-gradient-subtle">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Métricas que{" "}
            <span className="bg-gradient-accent bg-clip-text text-transparent">
              comprovam
            </span>
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Transparência total • Métricas públicas • Verificação independente
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            const isExternal = metric.href.startsWith('http');
            
            return (
              <Link 
                key={index}
                href={metric.href}
                className="group card-glass shadow-elev-1 hover:shadow-elev-3 p-6 transition-all duration-300 hover:-translate-y-1"
                {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                <div className="flex items-start gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${getColorClasses(metric.color)} border`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-neutral-900">{metric.title}</h3>
                      <ExternalLink className="h-4 w-4 text-neutral-400 group-hover:text-neutral-600 transition-colors" />
                    </div>
                    <div className="text-2xl font-bold text-neutral-900 mb-1">{metric.value}</div>
                    <p className="text-sm text-neutral-600">{metric.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-sm border border-neutral-200 px-6 py-3 text-sm font-medium text-neutral-700 shadow-sm">
            <Shield className="h-4 w-4 text-green-600" />
            Todos os links são públicos • Verificação independente disponível
          </div>
        </div>
      </div>
    </section>
  );
}
