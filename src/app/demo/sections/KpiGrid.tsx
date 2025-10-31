"use client"

import { Cpu, Server, Activity } from "lucide-react"
import { KpiCard } from "@/components/kpi/KpiCard"
import { useTelemetry } from "@/components/hooks/use-telemetry"

export default function KpiGrid() {
  const { cpu, ram, net, uptime, cpuDelta } = useTelemetry()

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      <KpiCard
        title="CPU"
        value={Math.round(cpu)}
        unit="%"
        delta={{ value: Math.abs(cpuDelta), direction: cpuDelta >= 0 ? "up" : "down" }}
        icon={<Cpu className="size-4" />}
        hint="Uso médio nos últimos 60s"
      />
      <KpiCard
        title="RAM"
        value={ram.toFixed(1)}
        unit="GB"
        icon={<Server className="size-4" />}
        hint="Memória em uso"
      />
      <KpiCard
        title="NET"
        value={net.toFixed(1)}
        unit="MB/s"
        icon={<Activity className="size-4" />}
        hint="Throughput atual"
      />
      <KpiCard
        title="Uptime"
        value={uptime}
        hint="Desde último reboot"
      />
    </section>
  )
}
