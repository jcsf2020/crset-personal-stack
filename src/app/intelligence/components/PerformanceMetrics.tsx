"use client";

import { motion } from "framer-motion";
import { Zap, Clock, Database, Server } from "lucide-react";

export function PerformanceMetrics() {
  const metrics = [
    { label: "API Latency", value: "45ms", status: "excellent", icon: <Zap className="w-4 h-4" /> },
    { label: "Uptime", value: "99.9%", status: "excellent", icon: <Server className="w-4 h-4" /> },
    { label: "Cache Hit Rate", value: "94%", status: "good", icon: <Database className="w-4 h-4" /> },
    { label: "Avg Response", value: "1.2s", status: "good", icon: <Clock className="w-4 h-4" /> },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "text-green-600 bg-green-50 dark:bg-green-900/20";
      case "good":
        return "text-blue-600 bg-blue-50 dark:bg-blue-900/20";
      case "warning":
        return "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20";
      default:
        return "text-gray-600 bg-gray-50 dark:bg-gray-700";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
    >
      <h3 className="text-lg font-semibold mb-4">Performance</h3>

      <div className="space-y-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${getStatusColor(metric.status)}`}>
                {metric.icon}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {metric.label}
              </span>
            </div>
            <span className="font-semibold">{metric.value}</span>
          </motion.div>
        ))}
      </div>

      {/* Progress Ring */}
      <div className="mt-6 flex items-center justify-center">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200 dark:text-gray-700"
            />
            <motion.circle
              cx="64"
              cy="64"
              r="56"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              className="text-green-500"
              initial={{ strokeDasharray: "0 352" }}
              animate={{ strokeDasharray: "330 352" }}
              transition={{ duration: 2, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold">98.5%</span>
            <span className="text-xs text-gray-600 dark:text-gray-400">Health Score</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

