"use client"
import useSWR from "swr"

const fetcher = (u: string) => fetch(u).then(r => r.json())

export function useTelemetry() {
  const { data } = useSWR("/api/telemetry", fetcher, {
    refreshInterval: 1500,
    revalidateOnFocus: false,
  })

  return {
    cpu: data?.cpu ?? 0,
    ram: data?.ram ?? 0,
    net: data?.net ?? 0,
    uptime: data?.uptime ?? "--",
    cpuDelta: data?.cpuDelta ?? 0,
  }
}
