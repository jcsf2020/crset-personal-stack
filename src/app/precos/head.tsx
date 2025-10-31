export default function Head() {
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Como funciona a subscrição?",
        "acceptedAnswer": { "@type": "Answer", "text": "Planos mensais. Podes cancelar quando quiseres." }
      },
      {
        "@type": "Question",
        "name": "Existe período de teste?",
        "acceptedAnswer": { "@type": "Answer", "text": "Demo gratuita. Trial disponível mediante pedido após a demo." }
      },
      {
        "@type": "Question",
        "name": "Que integrações suportam?",
        "acceptedAnswer": { "@type": "Answer", "text": "WhatsApp, Stripe e Email. Roadmap com CRM e outras integrações." }
      },
      {
        "@type": "Question",
        "name": "Como é o onboarding?",
        "acceptedAnswer": { "@type": "Answer", "text": "Setup guiado em 24-48h consoante o plano." }
      },
      {
        "@type": "Question",
        "name": "Posso migrar do meu site atual?",
        "acceptedAnswer": { "@type": "Answer", "text": "Sim. Migramos conteúdo essencial e configuramos redirecionamentos." }
      }
    ]
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
    </>
  );
}
