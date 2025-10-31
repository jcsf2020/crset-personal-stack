"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const services = [
  {
    id: "essential",
    title: "Essential",
    description: "Automação básica para pequenas empresas. Chatbots inteligentes e integração com sistemas existentes.",
    features: ["Chatbot IA", "Integração CRM", "Suporte 8x5", "Dashboard Analytics"],
    price: "199",
    popular: false,
    icon: "⚡"
  },
  {
    id: "pro", 
    title: "Professional",
    description: "Solução completa para empresas em crescimento. Automação avançada e análise preditiva.",
    features: ["IA Conversacional", "Automação Workflows", "Suporte 24x7", "API Personalizada", "Análise Preditiva"],
    price: "499",
    popular: true,
    icon: "🚀"
  },
  {
    id: "enterprise",
    title: "Enterprise", 
    description: "Plataforma empresarial completa com integração total e suporte dedicado.",
    features: ["Solução Personalizada", "Integração Completa", "Suporte Dedicado", "SLA Garantido", "Consultoria Estratégica"],
    price: "Personalizado",
    popular: false,
    icon: "🏢"
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

export default function ServicesGrid() {
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {services.map((service, index) => (
        <motion.div
          key={service.id}
          className={`sci-fi-card p-8 relative ${
            service.popular ? "ring-2 ring-blue-400 ring-opacity-50" : ""
          }`}
          variants={cardVariants}
          whileHover={{ 
            scale: 1.02,
            transition: { duration: 0.2 }
          }}
        >
          {/* Popular Badge */}
          {service.popular && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-blue-400 to-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                MAIS POPULAR
              </div>
            </div>
          )}
          
          {/* Icon */}
          <div className="text-4xl mb-4">{service.icon}</div>
          
          {/* Title */}
          <h3 className="text-2xl font-bold text-white mb-2">
            {service.title}
          </h3>
          
          {/* Price */}
          <div className="mb-4">
            {service.price === "Personalizado" ? (
              <span className="text-2xl font-bold text-gradient">
                Personalizado
              </span>
            ) : (
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-gradient">
                  {service.price}
                </span>
                <span className="text-gray-400 ml-1">EUR/mês</span>
              </div>
            )}
          </div>
          
          {/* Description */}
          <p className="text-gray-300 mb-6 leading-relaxed">
            {service.description}
          </p>
          
          {/* Features */}
          <ul className="space-y-3 mb-8">
            {service.features.map((feature, featureIndex) => (
              <li key={featureIndex} className="flex items-center text-sm text-gray-300">
                <svg 
                  className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" 
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
            asChild 
            className={`w-full ${service.popular ? "btn-primary" : "btn-secondary"}`}
            size="lg"
          >
            <Link href={`/servicos/${service.id}`}>
              {service.price === "Personalizado" ? "Contactar" : "Começar Agora"}
            </Link>
          </Button>
        </motion.div>
      ))}
    </motion.div>
  );
}
