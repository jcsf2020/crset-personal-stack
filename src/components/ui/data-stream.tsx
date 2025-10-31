"use client"
import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const ABC = "01▮▯▰▱░▒▓#*+:-.•◦◽◾"
const randChar = () => ABC[Math.floor(Math.random() * ABC.length)]
const genLine = (cols: number) => Array.from({ length: cols }, randChar).join("")

export function DataStream({
  title = "/stream/telemetry",
  rows = 10,
  cols = 38,
  interval = 80,
}: { title?: string; rows?: number; cols?: number; interval?: number }) {
  const [lines, setLines] = useState<string[] | null>(null) // evita SSR mismatch
  const timer = useRef<number | null>(null)

  useEffect(() => {
    // init só no cliente
    const initial = Array.from({ length: rows }, () => genLine(cols))
    setLines(initial)
    timer.current = window.setInterval(() => {
      setLines(prev => {
        if (!prev) return initial
        const next = prev.slice(1)
        next.push(genLine(cols))
        return next
      })
    }, interval)
    return () => { if (timer.current) clearInterval(timer.current) }
  }, [rows, cols, interval])

  return (
    <Card className="relative rounded-2xl border border-white/10 bg-black/30 dark:bg-black/30 holo-dark overflow-hidden">
      <CardHeader className="border-b border-white/10">
        <CardTitle className="font-mono text-sm text-cyber-400">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <pre
          className="scrollbar-none max-h-[260px] overflow-hidden p-4 font-mono text-[11px] leading-5 text-cyan-100/80"
          style={{ minHeight: rows * 20 }}
        >
{lines ? lines.join("\n") : ""}
        </pre>
      </CardContent>
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/5" />
    </Card>
  )
}

export default DataStream
