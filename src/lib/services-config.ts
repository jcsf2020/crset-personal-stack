/**
 * Services configuration with titles, descriptions, and features
 */

import { ServiceKey } from './prices';

export interface ServiceConfig {
  slug: string;
  key: ServiceKey;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  mascot?: string;
  category: string;
}

export const SERVICES_CONFIG: ServiceConfig[] = [
  {
    slug: 'essential',
    key: 'ESSENTIAL',
    title: 'Essential',
    subtitle: 'Pacote básico para pequenas empresas',
    description: 'Solução completa para automatizar processos básicos e melhorar a eficiência operacional.',
    category: 'Automação',
    mascot: '/mascotes/boris.png',
    features: [
      'Automação de leads e captação',
      'Chat inteligente com IA',
      'Integração com CRM básico',
      'Dashboard de métricas',
      'Suporte por email',
      'Configuração inicial incluída'
    ]
  },
  {
    slug: 'pro',
    key: 'PRO',
    title: 'Pro',
    subtitle: 'Solução avançada para empresas em crescimento',
    description: 'Pacote completo com funcionalidades avançadas de IA e automação para empresas que querem escalar.',
    category: 'Automação Avançada',
    mascot: '/mascotes/Laya.png',
    features: [
      'Tudo do Essential',
      'IA avançada para análise de dados',
      'Automação de workflows complexos',
      'Integrações personalizadas',
      'API completa',
      'Suporte prioritário',
      'Relatórios avançados',
      'Multi-utilizadores'
    ]
  },
  {
    slug: 'enterprise',
    key: 'ENTERPRISE',
    title: 'Enterprise',
    subtitle: 'Solução empresarial personalizada',
    description: 'Pacote totalmente personalizado para grandes empresas com necessidades específicas.',
    category: 'Empresarial',
    mascot: '/mascotes/Irina.png',
    features: [
      'Tudo do Pro',
      'Desenvolvimento personalizado',
      'Integração com sistemas legados',
      'SLA garantido',
      'Suporte 24/7',
      'Consultoria estratégica',
      'Treinamento da equipa',
      'Implementação dedicada'
    ]
  },
  {
    slug: 'imobiliaria',
    key: 'IMOBILIARIA',
    title: 'Imobiliária Smart',
    subtitle: 'CRM especializado para imobiliárias',
    description: 'Solução completa para imobiliárias com IA para captação, gestão de leads e automação de processos.',
    category: 'Imobiliário',
    mascot: '/mascotes/laya_lider_equipa.png',
    features: [
      'CRM especializado para imobiliário',
      'Captação automática de leads',
      'IA para qualificação de clientes',
      'Gestão de propriedades',
      'Portal do cliente',
      'Integração com portais imobiliários',
      'Relatórios de performance',
      'App móvel'
    ]
  },
  {
    slug: 'agenda',
    key: 'AGENDA',
    title: 'Agenda Inteligente',
    subtitle: 'Gestão automatizada de agendamentos',
    description: 'Sistema inteligente de agendamentos com IA para otimizar horários e reduzir no-shows.',
    category: 'Agendamento',
    mascot: '/mascotes/boris_variacao_automacao.png',
    features: [
      'Agendamento online 24/7',
      'IA para otimização de horários',
      'Lembretes automáticos',
      'Gestão de recursos',
      'Integração com calendários',
      'Relatórios de ocupação',
      'Sistema de avaliações',
      'Pagamentos integrados'
    ]
  },
  {
    slug: 'ecommerce',
    key: 'ECOMMERCE',
    title: 'E-commerce Plus',
    subtitle: 'Loja online com IA integrada',
    description: 'Plataforma de e-commerce com IA para recomendações, chatbot e automação de vendas.',
    category: 'E-commerce',
    mascot: '/mascotes/laya_futurista_tech.png',
    features: [
      'Loja online completa',
      'IA para recomendações de produtos',
      'Chatbot de vendas',
      'Gestão de inventário',
      'Integração com Shopify/WooCommerce',
      'Analytics avançados',
      'Marketing automation',
      'Suporte multi-moeda'
    ]
  },
  {
    slug: 'catalogo',
    key: 'CATALOGO',
    title: 'Catálogo Digital',
    subtitle: 'Showcase inteligente de produtos/serviços',
    description: 'Catálogo digital interativo com IA para apresentação inteligente de produtos e serviços.',
    category: 'Showcase',
    mascot: '/mascotes/irina_variacao_insights.png',
    features: [
      'Catálogo interativo responsivo',
      'IA para recomendações personalizadas',
      'Busca inteligente',
      'Gestão de conteúdo fácil',
      'Integração com redes sociais',
      'Analytics de visualizações',
      'SEO otimizado',
      'Formulários de contacto integrados'
    ]
  }
];

export const getServiceBySlug = (slug: string): ServiceConfig | undefined => {
  return SERVICES_CONFIG.find(service => service.slug === slug);
};

export const getAllSlugs = (): string[] => {
  return SERVICES_CONFIG.map(service => service.slug);
};

