"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Essential",
    key: "essencial",
    price: "199",
    originalPrice: "249",
    description: "Perfeito para pequenas empresas que querem começar com automação",
    features: [
      "Chatbot IA Conversacional",
      "Integração CRM Básica", 
      "Automação de Email",
      "Dashboard Analytics",
      "Suporte 8x5",
      "1 Agente Virtual"
    ],
    popular: false,
    cta: "Começar Agora"
  },
  {
    name: "Professional", 
    key: "profissional",
    price: "499",
    originalPrice: "599",
    description: "Solução completa para empresas em crescimento",
    features: [
      "Tudo do Essential",
      "Multi-agente (3 Agentes)",
      "Automação Workflows",
      "Integração Google/Meta Ads",
      "API Personalizada",
      "Suporte 24x7",
      "Até 5 Utilizadores",
      "Análise Preditiva"
    ],
    popular: true,
    cta: "Mais Popular"
  },
  {
    name: "Enterprise",
    key: "enterprise", 
    price: "Personalizado",
    originalPrice: null,
    description: "Plataforma completa com white-label e consultoria",
    features: [
      "Plataforma White-label",
      "Consultoria + Setup Incluído",
      "API Privada Dedicada",
      "Integrações Ilimitadas",
      "Suporte Prioritário",
      "SLA Garantido",
      "Utilizadores Ilimitados",
      "Consultoria Estratégica"
    ],
    popular: false,
    cta: "Contactar"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.2
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

export default function PricingSciFi() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  async function subscribe(planKey: string) {
    if (planKey === "enterprise") {
      window.location.href = "/contacto";
      return;
    }

    try {
      setLoadingPlan(planKey);
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ plan: planKey }),
      });
      const json = await res.json();
      
      if (!res.ok) {
        if (json?.error === 'stripe_unconfigured') {
          alert('Pagamento temporariamente indisponível. Contacte-nos diretamente.');
        } else {
          alert('Erro: ' + (json?.error || res.statusText));
        }
        return;
      }
      
      if (json?.url) window.location.href = json.url;
    } finally {
      setLoadingPlan(null);
    }
  }

  return (
    <div className="space-y-12">
      {/* Billing Toggle */}
      <div className="flex justify-center">
        <div className="glass-card p-1 flex rounded-full">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              billingCycle === "monthly"
                ? "bg-gradient-to-r from-blue-400 to-purple-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Mensal
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 relative ${
              billingCycle === "yearly"
                ? "bg-gradient-to-r from-blue-400 to-purple-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Anual
            <span className="absolute -top-2 -right-2 bg-green-400 text-black text-xs px-2 py-0.5 rounded-full">
              -20%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {plans.map((plan, index) => (
          <motion.div
            key={plan.key}
            className={`sci-fi-card p-8 relative ${
              plan.popular ? "ring-2 ring-blue-400 ring-opacity-50 scale-105" : ""
            }`}
            variants={cardVariants}
            whileHover={{ 
              scale: plan.popular ? 1.05 : 1.02,
              transition: { duration: 0.2 }
            }}
          >
            {/* Popular Badge */}
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-blue-400 to-purple-600 text-white text-xs font-bold px-4 py-2 rounded-full">
                  MAIS POPULAR
                </div>
              </div>
            )}

            {/* Plan Header */}
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">
                {plan.name}
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                {plan.description}
              </p>
              
              {/* Price */}
              <div className="mb-4">
                {plan.price === "Personalizado" ? (
                  <div className="text-3xl font-bold text-gradient">
                    Personalizado
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    {plan.originalPrice && billingCycle === "yearly" && (
                      <span className="text-lg text-gray-500 line-through">
                        {Math.round(parseInt(plan.originalPrice) * 0.8)} EUR
                      </span>
                    )}
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold text-gradient">
                        {billingCycle === "yearly" 
                          ? Math.round(parseInt(plan.price) * 0.8)
                          : plan.price
                        }
                      </span>
                      <span className="text-gray-400 ml-1">
                        EUR/{billingCycle === "yearly" ? "ano" : "mês"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              
              {billingCycle === "yearly" && plan.price !== "Personalizado" && (
                <div className="text-sm text-green-400">
                  Poupe {parseInt(plan.price) * 12 * 0.2} EUR por ano
                </div>
              )}
            </div>

            {/* Features */}
            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-start text-sm text-gray-300">
                  <svg 
                    className="w-4 h-4 text-green-400 mr-3 flex-shrink-0 mt-0.5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M5 13l4 4L19 7" 
                    />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <Button
              onClick={() => subscribe(plan.key)}
              disabled={loadingPlan === plan.key}
              className={`w-full ${plan.popular ? "btn-primary" : "btn-secondary"}`}
              size="lg"
            >
              {loadingPlan === plan.key 
                ? "A processar..." 
                : plan.key === "enterprise" 
                  ? "Contactar Vendas"
                  : plan.cta
              }
            </Button>

            {/* Money Back Guarantee */}
            {plan.key !== "enterprise" && (
              <div className="text-center mt-4">
                <div className="text-xs text-gray-400">
                  ✅ Garantia de 30 dias
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom Info */}
      <div className="text-center space-y-4">
        <p className="text-gray-400">
          Sem fidelização • Cancele a qualquer momento • Suporte em Português
        </p>
        
        <div className="flex justify-center space-x-8 text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>SSL Seguro</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>GDPR Compliant</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>99.9% Uptime</span>
          </div>
        </div>
      </div>
    </div>
  );
}
