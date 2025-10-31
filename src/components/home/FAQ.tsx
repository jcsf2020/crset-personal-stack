import Link from "next/link";
import { Button } from "@/components/ui/button";

export function FAQ() {
  const faqs = [
    {
      question: "Quanto tempo para ver valor?",
      answer: "Normalmente na 1.ª sprint (1–2 semanas)."
    },
    {
      question: "Preciso de contrato longo?",
      answer: "Não. Começamos pequeno, renovável por entrega."
    },
    {
      question: "Como funcionam os preços?",
      answer: "Tabela simples em /precos; sem taxas escondidas."
    },
    {
      question: "Podem integrar com o meu stack?",
      answer: "Sim, trabalhamos em cima do que já tens."
    },
    {
      question: "E a demo AGI?",
      answer: "No apex está bloqueada; usa o subdomínio dedicado."
    },
    {
      question: "Como começar?",
      answer: "Abre /servicos, escolhe o primeiro passo."
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold mb-4">
            Perguntas frequentes
          </h2>
          <p className="text-muted-foreground">
            Respostas diretas às dúvidas mais comuns.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-12">
          {faqs.map((faq, index) => (
            <div key={index} className="rounded-lg border p-6">
              <h3 className="font-semibold mb-3 text-sm">
                {faq.question}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Final */}
        <div className="text-center space-y-6">
          <div>
            <h3 className="text-2xl font-semibold mb-3">
              Pronto para começar?
            </h3>
            <p className="text-muted-foreground mb-6">
              Escolhe o teu ponto de partida. Sem compromissos longos.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" className="rounded-xl px-8 py-3">
              <Link href="/servicos">Ver serviços</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-xl px-8 py-3">
              <Link href="/precos">Ver preços</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

