"use client";

import { motion } from "framer-motion";
import { Brain, TrendingUp, AlertCircle, Lightbulb, Target } from "lucide-react";

interface AIInsightsProps {
  timeRange: "7d" | "30d" | "90d";
}

interface Insight {
  type: "success" | "warning" | "info" | "opportunity";
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  action?: string;
}

export function AIInsights({ timeRange }: AIInsightsProps) {
  // Simulated AI insights - in production, generate from real data
  const insights: Insight[] = [
    {
      type: "success",
      title: "Crescimento Acelerado Detectado",
      description: "A receita aumentou 12.5% nos últimos 30 dias, superando a meta em 8%. Continue investindo em marketing digital.",
      impact: "high",
      action: "Aumentar orçamento de marketing em 15%",
    },
    {
      type: "opportunity",
      title: "Oportunidade de Conversão",
      description: "45% dos visitadores abandonam no checkout. Implementar checkout simplificado pode aumentar conversões em 20%.",
      impact: "high",
      action: "Otimizar processo de checkout",
    },
    {
      type: "warning",
      title: "Taxa de Retenção em Declínio",
      description: "A retenção de utilizadores caiu 5% esta semana. Considere implementar programa de fidelização.",
      impact: "medium",
      action: "Criar programa de recompensas",
    },
    {
      type: "info",
      title: "Padrão Sazonal Identificado",
      description: "Picos de atividade às quintas-feiras (+35%). Agende campanhas para maximizar impacto.",
      impact: "medium",
      action: "Ajustar calendário de campanhas",
    },
  ];

  const getIcon = (type: Insight["type"]) => {
    switch (type) {
      case "success":
        return <TrendingUp className="w-5 h-5" />;
      case "warning":
        return <AlertCircle className="w-5 h-5" />;
      case "opportunity":
        return <Target className="w-5 h-5" />;
      case "info":
        return <Lightbulb className="w-5 h-5" />;
    }
  };

  const getColor = (type: Insight["type"]) => {
    switch (type) {
      case "success":
        return "from-green-500 to-emerald-600";
      case "warning":
        return "from-orange-500 to-red-600";
      case "opportunity":
        return "from-purple-500 to-pink-600";
      case "info":
        return "from-blue-500 to-cyan-600";
    }
  };

  const getBgColor = (type: Insight["type"]) => {
    switch (type) {
      case "success":
        return "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800";
      case "warning":
        return "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800";
      case "opportunity":
        return "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800";
      case "info":
        return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800";
    }
  };

  const getImpactBadge = (impact: Insight["impact"]) => {
    const colors = {
      high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      low: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
    };

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${colors[impact]}`}>
        {impact === "high" && "Alto Impacto"}
        {impact === "medium" && "Médio Impacto"}
        {impact === "low" && "Baixo Impacto"}
      </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">AI Insights</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Análises automáticas e recomendações inteligentes
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className={`border rounded-lg p-4 ${getBgColor(insight.type)}`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${getColor(insight.type)}`}>
                <div className="text-white">{getIcon(insight.type)}</div>
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold">{insight.title}</h4>
                  {getImpactBadge(insight.impact)}
                </div>

                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  {insight.description}
                </p>

                {insight.action && (
                  <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                    → {insight.action}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* AI Status */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>AI em tempo real</span>
          </div>
          <span className="text-gray-500 dark:text-gray-500">
            Última atualização: há 2 minutos
          </span>
        </div>
      </div>
    </motion.div>
  );
}

