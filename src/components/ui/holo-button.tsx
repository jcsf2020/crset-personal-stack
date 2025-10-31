"use client"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function HoloButton({ className, children, ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button
      className={cn(
        "relative overflow-hidden backdrop-blur-md",
        className
      )}
      style={{
        border: "1px solid rgba(var(--accent), .30)",
        background: "rgba(var(--accent), .10)",
        boxShadow: "0 0 24px rgba(var(--accent), .35)"
      }}
      {...props}
    >
      <span style={{ textShadow: "0 0 8px rgba(var(--accent), .8)" }}>{children}</span>
      <span className="pointer-events-none absolute inset-0 animate-scan bg-gradient-to-b from-transparent via-white/5 to-transparent" />
    </Button>
  )
}
export default HoloButton
