import Link from "next/link";

export const metadata = {
  title: "FAQ — CRSET Solutions",
  description: "Perguntas frequentes sobre os nossos serviços, preços, prazos e processo de trabalho. Encontre respostas rápidas ou contacte-nos diretamente.",
  alternates: { canonical: "/faq" },
};

const faqs = [
  {
    question: "Quanto tempo demora um projeto?",
    answer: "Depende do plano escolhido. O Essential fica pronto em 1-2 semanas, o Pro em 2-3 semanas, e o Enterprise em 3-4 semanas. Projetos personalizados têm prazos definidos na proposta inicial."
  },
  {
    question: "Como funciona o processo de desenvolvimento?",
    answer: "Seguimos 3 etapas: (1) Diagnóstico em ≤48h para mapear necessidades, (2) Plano & OKRs com roadmap detalhado, (3) Entrega & Operação com iterações curtas e monitorização contínua. Mantemos transparência total durante todo o processo."
  },
  {
    question: "Que tecnologias utilizam?",
    answer: "Usamos Next.js, TypeScript, Tailwind CSS, Supabase, Resend, e outras tecnologias modernas. Toda a infraestrutura é robusta, escalável e segura, com deploy automatizado na Vercel."
  },
  {
    question: "Oferecem suporte após o lançamento?",
    answer: "Sim! Todos os planos incluem suporte contínuo. O Essential tem suporte por email, o Pro tem suporte prioritário, e o Enterprise tem suporte dedicado 24/7 com SLA garantido."
  },
  {
    question: "Como funcionam os preços?",
    answer: "Temos preços transparentes sem taxas escondidas. Consulte /precos para ver todos os planos. Oferecemos valor inicial + mensalidade, com possibilidade de personalização conforme necessidades específicas."
  },
  {
    question: "Preciso de contrato longo?",
    answer: "Não! Começamos pequeno e renovamos por entrega. Não há compromissos longos - pode cancelar a qualquer momento após o período inicial de desenvolvimento."
  },
  {
    question: "Podem integrar com o meu stack existente?",
    answer: "Sim, trabalhamos em cima do que já tem. Fazemos integrações com CRMs, sistemas de pagamento, APIs existentes e outras ferramentas que já utiliza na sua empresa."
  },
  {
    question: "E a demo AGI?",
    answer: "A demo AGI está disponível num subdomínio dedicado. No domínio principal pode estar temporariamente bloqueada por questões de performance, mas pode sempre aceder via link direto."
  },
  {
    question: "Como começar?",
    answer: "Simples: visite /servicos, escolha o serviço que melhor se adapta às suas necessidades, e clique em 'Começar agora'. Entraremos em contacto em menos de 24h para agendar o diagnóstico inicial."
  },
  {
    question: "Oferecem garantias?",
    answer: "Sim! Oferecemos garantia de satisfação. Se não ficar satisfeito com o resultado nas primeiras 2 semanas, devolvemos o investimento inicial sem questões."
  },
  {
    question: "Trabalham com que tipo de empresas?",
    answer: "Trabalhamos com PMEs, startups e empresas estabelecidas. Temos soluções desde pequenos negócios (Essential) até grandes organizações (Enterprise) com necessidades específicas."
  },
  {
    question: "Como é feito o acompanhamento do projeto?",
    answer: "Mantemos comunicação transparente via email, Slack ou ferramenta da sua preferência. Fornecemos updates regulares, acesso ao repositório, e métricas de progresso em tempo real."
  }
];

export default function FAQ() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
            Perguntas Frequentes
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Respostas diretas às dúvidas mais comuns sobre os nossos serviços, preços e processo de trabalho.
          </p>
        </div>

        {/* FAQ Accordions */}
        <div className="space-y-4 mb-16">
          {faqs.map((faq, index) => (
            <details 
              key={index}
              className="group bg-white/80 backdrop-blur-sm border border-neutral-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-neutral-50 transition-colors">
                <h3 className="text-lg font-semibold text-neutral-900 pr-4">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center group-open:bg-blue-100 transition-colors">
                  <span className="text-sm font-bold text-neutral-600 group-open:text-blue-600 group-open:rotate-45 transition-transform">
                    +
                  </span>
                </div>
              </summary>
              <div className="px-6 pb-6 pt-0">
                <p className="text-neutral-700 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </details>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white/60 backdrop-blur-sm border border-neutral-200 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">
            Não encontrou a resposta?
          </h2>
          <p className="text-neutral-600 mb-6">
            Cada projeto é único. Vamos conversar sobre as suas necessidades específicas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/servicos"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ver Serviços
            </Link>
            <Link 
              href="/precos"
              className="inline-flex items-center justify-center px-6 py-3 border border-neutral-300 text-neutral-700 font-semibold rounded-lg hover:bg-neutral-50 transition-colors"
            >
              Consultar Preços
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-6 text-sm text-neutral-600">
            <Link href="/servicos" className="hover:text-neutral-900 transition-colors">
              Ver serviços
            </Link>
            <span>•</span>
            <Link href="/precos" className="hover:text-neutral-900 transition-colors">
              Consultar preços
            </Link>
            <span>•</span>
            <Link href="/" className="hover:text-neutral-900 transition-colors">
              Voltar ao início
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
