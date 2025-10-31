import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing - CRSET Solutions",
  description: "Choose the ideal plan for your business. Transparent and flexible pricing.",
  alternates: {
    canonical: "https://crsetsolutions.com/en/pricing",
    languages: {
      'pt': 'https://crsetsolutions.com/precos',
      'en': 'https://crsetsolutions.com/en/pricing',
    },
  },
};

export default function PricingPageEN() {
  const plans = [
    {
      name: "Essential",
      price: "499 EUR/month",
      description: "Ideal for small businesses",
      features: [
        "Basic automation",
        "Email support",
        "1 project included",
        "Monthly reports"
      ],
      cta: "Choose plan",
      highlighted: false
    },
    {
      name: "Pro",
      price: "999 EUR/month",
      description: "For growing businesses",
      features: [
        "Advanced automation",
        "Priority support",
        "3 projects included",
        "Weekly reports",
        "Consulting included"
      ],
      cta: "Choose plan",
      highlighted: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "Tailored solutions for large enterprises",
      features: [
        "Unlimited automation",
        "24/7 Support",
        "Unlimited projects",
        "Real-time reports",
        "Dedicated consulting",
        "Guaranteed SLA"
      ],
      cta: "Contact sales",
      highlighted: false
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Pricing</h1>
            <p className="text-xl">
              Choose the ideal plan for your business
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`bg-white p-8 rounded-lg shadow-lg ${
                  plan.highlighted ? 'ring-4 ring-blue-600 transform scale-105' : ''
                }`}
              >
                {plan.highlighted && (
                  <div className="bg-blue-600 text-white text-center py-2 -mx-8 -mt-8 mb-6 rounded-t-lg font-bold">
                    Most Popular
                  </div>
                )}
                
                <h2 className="text-3xl font-bold mb-2">{plan.name}</h2>
                <div className="text-4xl font-bold text-blue-600 mb-2">{plan.price}</div>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-blue-600 mr-2">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link
                  href={plan.name === "Enterprise" ? "/en/contact" : "/en/contact"}
                  className={`block text-center py-3 rounded-lg font-semibold transition ${
                    plan.highlighted
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-100 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-xl mb-2">Can I change plans at any time?</h3>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-xl mb-2">Do you offer refunds?</h3>
              <p className="text-gray-600">
                We offer a 30-day money-back guarantee for all plans. If you're not satisfied, we'll refund your payment.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-xl mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">
                We accept credit cards, bank transfers, and PayPal. For Enterprise plans, we can arrange custom payment terms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Still have questions?
          </h2>
          <p className="text-xl mb-8">
            Our team is here to help you choose the best plan
          </p>
          <Link
            href="/en/contact"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-block"
          >
            Contact us
          </Link>
        </div>
      </section>
    </div>
  );
}

