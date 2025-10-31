"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Activity } from "lucide-react"

type Delta = { value: number; direction: "up"|"down"|"flat" }
type KpiProps = {
  title: string
  value: string | number
  unit?: string
  delta?: Delta
  icon?: React.ReactNode
  hint?: string
  compact?: boolean
}

const IconByDelta = ({dir}:{dir:Delta["direction"]}) => {
  if (dir==="up")   return <TrendingUp className="size-4" aria-hidden />
  if (dir==="down") return <TrendingDown className="size-4" aria-hidden />
  return <Activity className="size-4" aria-hidden />
}

export function KpiCard({ title, value, unit, delta, icon, hint, compact }: KpiProps) {
  const dir = delta?.direction ?? "flat"
  const deltaColor =
    dir==="up"   ? "text-emerald-400" :
    dir==="down" ? "text-rose-400"    : "text-zinc-400"

  return (
    <Card className="ui-hairline ui-card ui-surface p-4 md:p-5 grid gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-zinc-400">{title}</span>
        <span className="text-zinc-400" aria-label={hint ?? title}>{icon ?? <Activity className="size-4" />}</span>
      </div>

      <div className="flex items-baseline gap-2">
        <span className={compact ? "text-2xl font-semibold" : "text-3xl md:text-4xl font-semibold"}>
          {value}{unit ? <span className="text-base text-zinc-400"> {unit}</span> : null}
        </span>
        {delta && (
          <span className={`flex items-center gap-1 text-sm ${deltaColor}`}>
            <IconByDelta dir={dir} />
            {delta.value}%
          </span>
        )}
      </div>

      {hint && <p className="text-xs text-zinc-500">{hint}</p>}
    </Card>
  )
}
