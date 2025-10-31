import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function GET() {
  // mock com jitter controlado
  const cpuBase = 60 + (Math.random() * 40)        // 60–100
  const cpu = Math.round(Math.min(100, Math.max(0, cpuBase)))
  const ram = Number((9.0 + Math.random() * 1.3).toFixed(1)) // ~9–10.3 GB
  const net = Number((Math.abs((Math.random() - 0.4) * 12)).toFixed(1)) // 0–7.2 MB/s
  const uptime = "3d 12h"
  const cpuDelta = Math.round((Math.random() - 0.5) * 6) // -3..+3

  return NextResponse.json({ cpu, ram, net, uptime, cpuDelta })
}
