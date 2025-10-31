"use client"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  console.error("[GlobalError]", error)
  return (
    <html>
      <body>
        <div style={{ padding: 16 }}>
          <h2>Algo correu mal.</h2>
          <button onClick={() => reset()} style={{ marginTop: 8 }}>
            Tentar de novo
          </button>
        </div>
      </body>
    </html>
  )
}
