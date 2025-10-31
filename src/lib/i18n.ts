export function t(k: string): string {
  const dict: Record<string, string> = {
    // Hero
    hero_title: "Automação Inteligente para o Futuro",
    hero_subtitle:
      "CRSET Solutions combina tecnologia de ponta com mascotes únicas para transformar negócios em experiências inteligentes.",
    cta_explorar: "Ver Serviços",

    // Planos
    plans_title: "Planos e Pre\u00E7os",
    plans_subtitle:
      "Escolhe o plano certo para o teu momento. Upgrade facil quando estiveres pronto para escalar.",
    plan_starter: "Starter",
    plan_starter_desc: "Landing + captacao para validar canal.",
    plan_starter_price: "49 EUR/m\u00EAs",
    plan_growth: "Growth",
    plan_growth_desc: "Stack para escalar aquisicao e operacao.",
    plan_growth_price: "149 EUR/m\u00EAs",
    plan_scale: "Scale",
    plan_scale_desc: "Projeto sob medida com roadmap continuo.",
    plan_scale_price: "Sob consulta",
    no_lockin: "sem fideliza\u00E7\u00E3o",
    cta_start_now: "Come\u00E7ar agora",
    cta_whatsapp: "Falar no WhatsApp",

    // Resultados / testemunhos
    results_title: "Resultados consistentes, sem ru\u00EDdo",
    results_subtitle:
      "Sec\u00E7\u00E3o de testemunhos em revis\u00E3o. Sem claims at\u00E9 valida\u00E7\u00E3o.",
    testimonial_placeholder: "\u2014 Em revis\u00E3o \u2014",

    // Admin login
    admin_login_title: "Login Admin",
    admin_login_placeholder: "ADMIN_PASSWORD",
    admin_login_button: "Entrar",
    admin_login_authenticating: "A autenticar...",
    admin_login_ok: "OK. Redirecionando...",
    admin_login_fail: "Falhou: ",

    // Admin home
    admin_home_title: "Admin",
    admin_home_nosession: "Sem sess\u00E3o.",
    admin_home_do_login: "Faz login",
    admin_metric_total: "Total",
    admin_metric_24h: "24h",
    admin_metric_7d: "7d",
    export_csv: "Exportar CSV",
    view_json: "Ver JSON",

    // Footer
    footer_tagline: "Solu\u00E7\u00F5es digitais inteligentes para captar, organizar e escalar.",
    footer_product: "Produto",
    footer_support: "Suporte",
    footer_rights: "Todos os direitos reservados.",
    help_center: "Centro de ajuda",
    plans_services: "Servi\u00E7os"
  };
  return dict[k] ?? k;
}
