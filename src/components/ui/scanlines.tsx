export function ScanlinesOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 opacity-[0.07] mix-blend-overlay"
      style={{
        background:
          "repeating-linear-gradient(to bottom, rgba(255,255,255,.8), rgba(255,255,255,.8) 1px, transparent 1px, transparent 3px)",
      }}
    />
  )
}
