import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function TerminalCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="relative holo-dark scanlines rounded-2xl">
      <CardHeader className="border-b border-white/10">
        <CardTitle className="font-mono text-sm text-cyber-400">{title}</CardTitle>
      </CardHeader>
      <CardContent className="font-mono text-xs text-muted-foreground">
        <pre className="whitespace-pre-wrap leading-relaxed">{children}</pre>
      </CardContent>
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/5" />
    </Card>
  )
}
