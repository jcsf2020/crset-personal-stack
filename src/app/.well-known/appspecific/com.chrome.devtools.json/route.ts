export function GET() {
  return new Response("{}", { status: 200, headers: { "Content-Type": "application/json" } })
}
