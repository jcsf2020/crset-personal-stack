import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help & FAQ - CRSET Solutions",
  description: "Find answers to your questions about our services, pricing, and support.",
  alternates: {
    canonical: "https://crsetsolutions.com/en/help",
    languages: {
      'pt': 'https://crsetsolutions.com/centro-de-ajuda',
      'en': 'https://crsetsolutions.com/en/help',
    },
  },
};

export default function HelpPageEN() {
  const faqs = [
    {
      category: "General",
      questions: [
        {
          q: "What services does CRSET Solutions offer?",
          a: "We offer process automation, cybersecurity, software development, and technology consulting services."
        },
        {
          q: "How long does implementation take?",
          a: "Implementation time varies depending on project complexity, but typically between 2 to 8 weeks."
        },
        {
          q: "Do you work with small businesses?",
          a: "Yes! We have solutions for businesses of all sizes, from startups to large enterprises."
        }
      ]
    },
    {
      category: "Pricing & Plans",
      questions: [
        {
          q: "What payment methods do you accept?",
          a: "We accept credit cards, bank transfers, and PayPal. For Enterprise plans, we can arrange custom payment terms."
        },
        {
          q: "Can I change plans at any time?",
          a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately."
        },
        {
          q: "Do you offer refunds?",
          a: "We offer a 30-day money-back guarantee for all plans. If you're not satisfied, we'll refund your payment."
        },
        {
          q: "Are there any setup fees?",
          a: "No, there are no setup fees. The price you see is the price you pay."
        }
      ]
    },
    {
      category: "Technical Support",
      questions: [
        {
          q: "What support channels are available?",
          a: "We offer support via email, phone, and live chat. Enterprise clients get dedicated support with guaranteed response times."
        },
        {
          q: "Do you offer support after implementation?",
          a: "Yes, all our plans include ongoing support. The level of support varies depending on the chosen plan."
        },
        {
          q: "What are your support hours?",
          a: "Essential and Pro plans have support during business hours (9am-6pm). Enterprise plans include 24/7 support."
        }
      ]
    },
    {
      category: "Technology",
      questions: [
        {
          q: "What technologies do you work with?",
          a: "We work with the latest technologies, including Python, Node.js, React, Next.js, and AI tools like OpenAI and Anthropic."
        },
        {
          q: "Can you integrate with our existing systems?",
          a: "Yes! We specialize in system integration and can connect with most existing platforms and tools."
        },
        {
          q: "Do you provide training?",
          a: "Yes, all implementations include training for your team. Additional training sessions can be arranged as needed."
        }
      ]
    },
    {
      category: "Security & Compliance",
      questions: [
        {
          q: "How do you ensure data security?",
          a: "We follow industry best practices including encryption, secure authentication, regular audits, and compliance with GDPR and other regulations."
        },
        {
          q: "Where is data stored?",
          a: "Data is stored in secure EU-based data centers with redundancy and backup systems."
        },
        {
          q: "Are you GDPR compliant?",
          a: "Yes, all our services are fully GDPR compliant. We can provide documentation upon request."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Help & FAQ</h1>
            <p className="text-xl">
              Find answers to your questions
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            {faqs.map((category, catIndex) => (
              <div key={catIndex}>
                <h2 className="text-3xl font-bold mb-6 text-blue-600">
                  {category.category}
                </h2>
                <div className="space-y-6">
                  {category.questions.map((faq, qIndex) => (
                    <div key={qIndex} className="bg-white p-6 rounded-lg shadow">
                      <h3 className="font-bold text-xl mb-3">{faq.q}</h3>
                      <p className="text-gray-600">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-gray-100 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Didn't find what you were looking for?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Our team is here to help answer your questions
          </p>
          <a
            href="/en/contact"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition inline-block"
          >
            Contact us
          </a>
        </div>
      </section>
    </div>
  );
}

