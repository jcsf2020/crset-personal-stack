import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SocialProof } from "@/components/home/SocialProof";
import { ValueProps } from "@/components/home/ValueProps";
import { HowWeWork } from "@/components/home/HowWeWork";
import { FAQ } from "@/components/home/FAQ";
import { MascotBubble } from "@/components/home/MascotBubble";

/**
 * Forca o tema LIGHT no 1o paint (sem tocar em layout.tsx)
 */
function ForceLight() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html:
          "try{localStorage.setItem('theme','light');var d=document.documentElement;d.classList.remove('dark');d.classList.add('light');}catch(_){/*noop*/}",
      }}
    />
  );
}

export const metadata = {
  title: "CRSET Solutions — Automação prática. Sem circo.",
  description: "Automação e AGI aplicada ao negócio. Resultados práticos, sem circo.",
  alternates: {
    canonical: "/",
  },
};

export default function Page() {
  return (
    <main className="container mx-auto max-w-6xl px-4 py-12 space-y-14">
      <ForceLight />

      {/* Header Navigation */}
      <header className="flex items-center justify-between mb-8">
        <Link href="/" className="text-xl font-bold">CRSET</Link>
        <nav id="navigation" className="hidden md:flex items-center space-x-6 text-sm" aria-label="Navegação principal">
          <Link href="/" className="hover:underline">Início</Link>
          <Link href="/servicos" className="hover:underline">Serviços</Link>
          <Link href="/precos" className="hover:underline">Planos & Preços</Link>
          <Link href="/faq" className="hover:underline">Ajuda</Link>
          <Link href="https://agi.crsetsolutions.com" className="hover:underline">Demo AGI</Link>
        </nav>
      </header>

      {/* Hero Premium */}
      <section id="main-content" className="relative overflow-hidden rounded-2xl bg-grid card-glass-medium shadow-elev-3 p-8 md:p-12">
        {/* Background decorativo */}
        <div className="absolute inset-0 bg-gradient-subtle opacity-50" aria-hidden="true" />
        
        <div className="relative grid items-center gap-10 md:grid-cols-2">
          <div className="space-y-6">
            <div className="inline-flex items-center rounded-full border border-black/10 bg-white/80 backdrop-blur-sm px-4 py-2 text-sm font-medium shadow-sm">
              <span className="mr-2 h-2 w-2 rounded-full bg-green-500" aria-hidden="true" />
              Foco em resultados • zero drama
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight text-balance">
              Automação prática.
              <br className="hidden md:block" />
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Resultado em dias, não meses.
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-neutral-700 max-w-prose leading-relaxed">
              Ciclos curtos, KPIs visíveis em produção e zero circo. Começa pequeno, entrega real.
            </p>
            
            {/* CTA Dupla */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                asChild 
                size="lg"
                className="rounded-xl px-8 py-4 text-base font-semibold shadow-elev-2 hover:shadow-elev-3 transition-all duration-200 hover:-translate-y-0.5"
              >
                <Link href="/servicos">Começar agora</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-xl px-8 py-4 text-base font-semibold border-2 border-green-600 text-green-700 hover:bg-green-50 hover:border-green-700 transition-all duration-200 hover:-translate-y-0.5"
              >
                <Link href="https://wa.me/351912345678?text=Olá! Gostaria de saber mais sobre os serviços CRSET.">
                  WhatsApp direto
                </Link>
              </Button>
            </div>
            
            {/* Tags de benefícios */}
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex items-center rounded-lg bg-white/60 backdrop-blur-sm border border-black/10 px-3 py-2 text-sm font-medium shadow-sm">
                ⚡ Entrega rápida
              </span>
              <span className="inline-flex items-center rounded-lg bg-white/60 backdrop-blur-sm border border-black/10 px-3 py-2 text-sm font-medium shadow-sm">
                📊 KPIs visíveis
              </span>
              <span className="inline-flex items-center rounded-lg bg-white/60 backdrop-blur-sm border border-black/10 px-3 py-2 text-sm font-medium shadow-sm">
                🎯 Suporte direto
              </span>
            </div>
          </div>

          {/* Mascotes decorativas */}
          <div className="relative justify-self-end">
            {/* Ilustração decorativa removida - foco no conteúdo */}
            <div className="relative w-full max-w-md h-64 rounded-2xl bg-gradient-subtle border border-white/20 shadow-elev-4 flex items-center justify-center" aria-hidden="true">
              <div className="text-6xl opacity-30">⚡</div>
              {/* Efeito de brilho decorativo */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-primary opacity-20 blur-xl" />
            </div>
            
            {/* Mascotes flutuantes decorativas com offset consistente */}
            <div className="absolute -top-2 -right-2 translate-y-2 translate-x-2 w-16 h-16 rounded-full bg-gradient-accent shadow-elev-3 flex items-center justify-center text-2xl animate-bounce" aria-hidden="true" style={{animationDelay: '0.5s'}}>
              🚀
            </div>
            <div className="absolute -bottom-2 -left-2 translate-y-2 translate-x-2 w-12 h-12 rounded-full bg-gradient-primary shadow-elev-2 flex items-center justify-center text-lg animate-bounce" aria-hidden="true" style={{animationDelay: '1s'}}>
              ⚡
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <SocialProof />

      {/* Value Props */}
      <ValueProps />

      {/* How We Work */}
      <HowWeWork />

      {/* FAQ */}
      <FAQ />

      {/* Footer */}
      <footer className="text-xs text-muted-foreground">
        © CRSET Solutions. Links rápidos:{" "}
        <Link className="underline" href="/servicos">Serviços</Link> ·{" "}
        <Link className="underline" href="/precos">Preços</Link> ·{" "}
        <Link className="underline" href="/faq">Ajuda</Link>
      </footer>

      {/* Mascot Assistant */}
      <MascotBubble />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "CRSET Solutions",
            "description": "Automação e AGI aplicada ao negócio. Resultados práticos, sem circo.",
            "url": "https://crsetsolutions.com",
            "logo": "https://crsetsolutions.com/logo.png",
            "sameAs": [
              "https://agi.crsetsolutions.com"
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "customer service",
              "url": "https://crsetsolutions.com/#contact"
            },
            "offers": {
              "@type": "AggregateOffer",
              "description": "Serviços de automação e AGI para empresas",
              "url": "https://crsetsolutions.com/servicos"
            }
          })
        }}
      />
    </main>
  );
}
