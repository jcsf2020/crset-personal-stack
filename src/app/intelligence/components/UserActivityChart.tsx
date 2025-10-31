"use client";

import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Users } from "lucide-react";

interface UserActivityChartProps {
  timeRange: "7d" | "30d" | "90d";
}

export function UserActivityChart({ timeRange }: UserActivityChartProps) {
  // Simulated data - in production, fetch from API
  const data = [
    { day: "Seg", novos: 45, ativos: 120, inativos: 30 },
    { day: "Ter", novos: 52, ativos: 135, inativos: 25 },
    { day: "Qua", novos: 48, ativos: 142, inativos: 28 },
    { day: "Qui", novos: 61, ativos: 158, inativos: 22 },
    { day: "Sex", novos: 55, ativos: 165, inativos: 20 },
    { day: "Sáb", novos: 38, ativos: 98, inativos: 35 },
    { day: "Dom", novos: 32, ativos: 85, inativos: 40 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold mb-1">Atividade de Utilizadores</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Distribuição semanal de utilizadores
          </p>
        </div>
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <Users className="w-5 h-5 text-blue-600" />
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="day"
            stroke="#9ca3af"
            style={{ fontSize: "12px" }}
          />
          <YAxis
            stroke="#9ca3af"
            style={{ fontSize: "12px" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: "12px" }}
            iconType="circle"
          />
          <Bar
            dataKey="novos"
            fill="#10b981"
            radius={[4, 4, 0, 0]}
            animationDuration={1000}
            name="Novos"
          />
          <Bar
            dataKey="ativos"
            fill="#3b82f6"
            radius={[4, 4, 0, 0]}
            animationDuration={1000}
            name="Ativos"
          />
          <Bar
            dataKey="inativos"
            fill="#ef4444"
            radius={[4, 4, 0, 0]}
            animationDuration={1000}
            name="Inativos"
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

