import Link from "next/link";

import Image from "next/image";
export default function HeroPro() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32 bg-[url(/mascotes/crset_mascotes_conjunta-w1024.webp)] bg-no-repeat bg-right-bottom bg-contain min-h-[68vh] md:min-h-[72vh] bg-[length:640px_auto] md:bg-[length:760px_auto] lg:bg-[length:880px_auto] bg-[position:right_-16px_bottom_-16px]">
      {/* overlay para legibilidade sobre a arte das mascotes */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
      {/* background accents */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-60"
        aria-hidden
        style={{
          background:
            "radial-gradient(60% 50% at 90% 0%, rgba(59,130,246,.18) 0%, rgba(59,130,246,0) 60%)," +
            "radial-gradient(60% 50% at 0% 100%, rgba(139,92,246,.18) 0%, rgba(139,92,246,0) 60%)",
        }}
      />
      <div className="container-pro grid items-center gap-12 lg:grid-cols-2">
        {/* copy */}
        <div className="animate-in fade-in slide-in-from-left-4 duration-700">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--card))]/60 px-3 py-1 text-xs text-[rgb(var(--muted))] backdrop-blur">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[rgb(var(--success))]" />
            AGI Commander • Disponível hoje
          </div>
          <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
            <span className="bg-[linear-gradient(90deg,#2563EB, #8B5CF6, #14B8A6)] bg-clip-text text-transparent">
              Automação &amp; AGI para o teu negócio
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-[rgb(var(--muted))]">
            Integração rápida, CORS blindado, monitorização diária e UX moderna.
            Constrói chats e workflows com latência baixa e fiabilidade de nível
            produção.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/start"
              className="btn-primary rounded-[var(--radius-md)] px-5 py-3"
            >
              Começar agora
            </Link>
            <Link
              href="/precos"
              className="btn-secondary rounded-[var(--radius-md)] px-5 py-3"
            >
              Ver preços
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-6 text-sm text-[rgb(var(--muted))]">
            <div className="flex items-center gap-2">
              <span>⚡</span> <span>Latência baixa (GROQ)</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🛡️</span> <span>CORS + Cron monitorizado</span>
            </div>
            <div className="flex items-center gap-2">
              <span>📈</span> <span>Smoke &amp; Health diários</span>
            </div>
          </div>
        </div>

        {/* card */}
        <div className="animate-in fade-in slide-in-from-right-4 duration-700">
          <div className="crset-glass-card p-6 md:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div className="font-semibold text-white/90">CRSET Commander</div>
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white/80">
                Preview
              </span>
            </div>
            <ul className="space-y-3 text-sm text-white/80">
              {[
                "Chat /api/agi/chat em produção (GROQ)",
                "Preflight OPTIONS 204 e POST allowlist",
                "Cron /api/cron/health com verificação",
                "Smoke tests & GitHub Actions diários",
                "Tokens & Tailwind plugins activos",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="mt-0.5">✔</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 grid grid-cols-3 divide-x divide-white/10 rounded-[var(--radius-md)] border border-white/10 bg-white/5 text-center text-white/80">
              <div className="p-4">
                <div className="text-lg font-bold">200</div>
                <div className="text-xs opacity-80">OK (prod)</div>
              </div>
              <div className="p-4">
                <div className="text-lg font-bold">204</div>
                <div className="text-xs opacity-80">Preflight</div>
              </div>
              <div className="p-4">
                <div className="text-lg font-bold">403</div>
                <div className="text-xs opacity-80">CORS bloqueia</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
