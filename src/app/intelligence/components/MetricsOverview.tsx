"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Users, DollarSign, Activity, Zap } from "lucide-react";

interface MetricsOverviewProps {
  timeRange: "7d" | "30d" | "90d";
}

interface Metric {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
}

export function MetricsOverview({ timeRange }: MetricsOverviewProps) {
  // Simulated data - in production, fetch from API
  const metrics: Metric[] = [
    {
      title: "Receita Total",
      value: "EUR 45,230",
      change: 12.5,
      icon: <DollarSign className="w-6 h-6" />,
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Utilizadores Ativos",
      value: "2,847",
      change: 8.3,
      icon: <Users className="w-6 h-6" />,
      color: "from-blue-500 to-cyan-600",
    },
    {
      title: "Taxa de Conversão",
      value: "3.2%",
      change: -2.1,
      icon: <Activity className="w-6 h-6" />,
      color: "from-purple-500 to-pink-600",
    },
    {
      title: "Performance",
      value: "98.5%",
      change: 5.7,
      icon: <Zap className="w-6 h-6" />,
      color: "from-orange-500 to-red-600",
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.title}
          variants={item}
          whileHover={{ scale: 1.02, y: -5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-lg bg-gradient-to-br ${metric.color}`}>
              <div className="text-white">{metric.icon}</div>
            </div>
            <div
              className={`flex items-center gap-1 text-sm font-medium ${
                metric.change >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {metric.change >= 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              {Math.abs(metric.change)}%
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              {metric.title}
            </p>
            <p className="text-3xl font-bold">{metric.value}</p>
          </div>

          {/* Mini Sparkline */}
          <div className="mt-4 h-12 flex items-end gap-1">
            {Array.from({ length: 12 }).map((_, i) => {
              const height = Math.random() * 100;
              return (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: index * 0.1 + i * 0.05 }}
                  className={`flex-1 rounded-t bg-gradient-to-t ${metric.color} opacity-30`}
                />
              );
            })}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

