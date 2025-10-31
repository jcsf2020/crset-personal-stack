type Props = { label: string; value: number; suffix?: string }
export function HudBar({ label, value, suffix = "%" }: Props) {
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div className="rounded-xl border border-white/10 p-3 holo-dark">
      <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
        <span className="font-mono">{label}</span>
        <span className="font-mono">{pct}{suffix}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-md bg-white/5">
        <div
          className="h-full animate-in fade-in-50 duration-500"
          style={{
            width: pct + "%",
            background: "linear-gradient(90deg, rgba(var(--accent), .35), rgba(var(--accent), .7))",
            boxShadow: "0 0 12px rgba(var(--accent), .35)"
          }}
        />
      </div>
    </div>
  )
}
