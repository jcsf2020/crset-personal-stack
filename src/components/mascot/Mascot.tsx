"use client"

import { useEffect, useState } from "react"
import clsx from "clsx"
import { useTelemetry } from "@/components/hooks/use-telemetry"

export function Mascot() {
  const { cpu } = useTelemetry()
  const [state, setState] = useState<"idle"|"warn"|"crit">("idle")

  useEffect(() => {
    if (cpu >= 95) setState("crit")
    else if (cpu >= 80) setState("warn")
    else setState("idle")
  }, [cpu])

  return (
    <div
      className={clsx(
        "ui-card ui-hairline p-3 rounded-2xl grid gap-2",
        state==="warn" && "ring-2 ring-amber-400/60",
        state==="crit" && "ring-2 ring-rose-500/70"
      )}
      aria-live="polite"
      aria-atomic="true"
    >
      <div className={clsx("mascot-face", state)} />
      <p className="text-xs text-zinc-400">
        {state==="crit" ? "ALERTA CRÍTICO: CPU > 95%" :
         state==="warn" ? "Atenção: CPU > 80%" :
         "Estável"}
      </p>
    </div>
  )
}
