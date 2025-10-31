"use client"

export function MascotHint({ children }: { children: React.ReactNode }) {
  return (
    <div className="holo-dark rounded-2xl border border-white/10 p-3 shadow-neon animate-in zoom-in-95 fade-in-50 duration-300">
      <div className="text-xs text-cyber-400">Assist 🡒</div>
      <div className="mt-1 text-sm text-muted-foreground">{children}</div>
    </div>
  )
}
