"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
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

const glowVariants = {
  initial: { scale: 1, opacity: 0.3 },
  animate: {
    scale: [1, 1.1, 1],
    opacity: [0.3, 0.6, 0.3],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export default function HeroSciFi() {
  return (
    <section className="hero-section relative">
      {/* Animated Grid Background */}
      <div className="hero-grid" />
      
      {/* Animated Glow Effect */}
      <motion.div 
        className="hero-glow"
        variants={glowVariants}
        initial="initial"
        animate="animate"
      />
      
      {/* Content */}
      <div className="container-pro relative z-10">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div variants={itemVariants}>
            <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-6">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-gray-300">
                Sistema Operacional • 99.9% Uptime
              </span>
            </div>
          </motion.div>
          
          {/* Main Heading */}
          <motion.h1 
            className="text-gradient mb-6 font-display"
            variants={itemVariants}
          >
            CRSET Solutions
          </motion.h1>
          
          {/* Subheading */}
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            Automação inteligente para empresas que pensam no futuro. 
            Transformamos processos complexos em soluções elegantes e eficientes.
          </motion.p>
          
          {/* Feature Pills */}
          <motion.div 
            className="flex flex-wrap justify-center gap-3 mb-12"
            variants={itemVariants}
          >
            {[
              "IA Conversacional",
              "Automação de Processos", 
              "Integração Empresarial",
              "Análise Preditiva"
            ].map((feature, index) => (
              <div 
                key={feature}
                className="glass-card px-4 py-2 text-sm font-medium text-gray-300"
              >
                {feature}
              </div>
            ))}
          </motion.div>
          
          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            variants={itemVariants}
          >
            <Button asChild size="lg" className="btn-primary min-w-[200px]">
              <Link href="/servicos">
                Explorar Soluções
              </Link>
            </Button>
            
            <Button asChild variant="secondary" size="lg" className="btn-secondary min-w-[200px]">
              <Link href="/chat-login">
                Demo Interativa
              </Link>
            </Button>
          </motion.div>
          
          {/* Stats */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-16 border-t border-gray-800"
            variants={itemVariants}
          >
            {[
              { value: "99.9%", label: "Disponibilidade" },
              { value: "< 200ms", label: "Tempo de Resposta" },
              { value: "24/7", label: "Suporte Técnico" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-gradient mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        <div className="flex flex-col items-center gap-2 text-gray-400">
          <span className="text-xs uppercase tracking-wide">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
