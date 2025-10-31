"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign,
  Activity,
  Zap,
  Brain,
  Download
} from "lucide-react";
import { MetricsOverview } from "./MetricsOverview";
import { RevenueChart } from "./RevenueChart";
import { UserActivityChart } from "./UserActivityChart";
import { AIInsights } from "./AIInsights";
import { RecentActivity } from "./RecentActivity";
import { PerformanceMetrics } from "./PerformanceMetrics";

export function IntelligenceHub() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Intelligence Hub
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Analytics em tempo real e AI insights
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Time Range Selector */}
              <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                {(["7d", "30d", "90d"] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      timeRange === range
                        ? "bg-white dark:bg-gray-600 shadow-sm"
                        : "hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {range === "7d" && "7 dias"}
                    {range === "30d" && "30 dias"}
                    {range === "90d" && "90 dias"}
                  </button>
                ))}
              </div>

              {/* Export Button */}
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4" />
                Exportar
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {darkMode ? "🌞" : "🌙"}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Metrics Overview */}
          <MetricsOverview timeRange={timeRange} />

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RevenueChart timeRange={timeRange} />
            <UserActivityChart timeRange={timeRange} />
          </div>

          {/* AI Insights & Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <AIInsights timeRange={timeRange} />
            </div>
            <div>
              <PerformanceMetrics />
            </div>
          </div>

          {/* Recent Activity */}
          <RecentActivity />
        </div>
      </main>
    </div>
  );
}

