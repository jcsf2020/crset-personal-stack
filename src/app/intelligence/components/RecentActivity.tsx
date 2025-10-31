"use client";

import { motion } from "framer-motion";
import { Activity, UserPlus, DollarSign, AlertCircle, CheckCircle } from "lucide-react";

export function RecentActivity() {
  const activities = [
    {
      type: "user",
      title: "Novo utilizador registado",
      description: "João Silva criou uma conta",
      time: "há 2 minutos",
      icon: <UserPlus className="w-4 h-4" />,
      color: "from-blue-500 to-cyan-600",
    },
    {
      type: "revenue",
      title: "Nova venda realizada",
      description: "Plano Pro - EUR 299",
      time: "há 15 minutos",
      icon: <DollarSign className="w-4 h-4" />,
      color: "from-green-500 to-emerald-600",
    },
    {
      type: "success",
      title: "Backup concluído",
      description: "Backup automático finalizado com sucesso",
      time: "há 1 hora",
      icon: <CheckCircle className="w-4 h-4" />,
      color: "from-purple-500 to-pink-600",
    },
    {
      type: "warning",
      title: "Uso de API elevado",
      description: "85% do limite mensal atingido",
      time: "há 2 horas",
      icon: <AlertCircle className="w-4 h-4" />,
      color: "from-orange-500 to-red-600",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
          <Activity className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Atividade Recente</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Eventos e notificações em tempo real
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 + index * 0.1 }}
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div className={`p-2 rounded-lg bg-gradient-to-br ${activity.color} flex-shrink-0`}>
              <div className="text-white">{activity.icon}</div>
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm">{activity.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {activity.description}
              </p>
            </div>

            <span className="text-xs text-gray-500 dark:text-gray-500 flex-shrink-0">
              {activity.time}
            </span>
          </motion.div>
        ))}
      </div>

      <button className="w-full mt-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
        Ver todas as atividades →
      </button>
    </motion.div>
  );
}

