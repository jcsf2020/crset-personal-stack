// cria um endpoint GET que devolve {ok: true, message: "Olá Copilot"}

export async function GET() {
  return Response.json({ ok: true, message: "Olá Copilot" });
}
