import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "CRSET Solutions - Intelligent Business Automation",
  description: "Intelligent automation, cybersecurity, and development solutions for businesses that want to grow.",
  alternates: {
    canonical: "https://crsetsolutions.com/en",
    languages: {
      'pt': 'https://crsetsolutions.com',
      'en': 'https://crsetsolutions.com/en',
    },
  },
};

export default function HomePageEN() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Automate your business with AI
            </h1>
            <p className="text-xl mb-8">
              Intelligent automation, cybersecurity, and development solutions for businesses that want to grow.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/en/contact"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Get started now
              </Link>
              <Link
                href="/en/services"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
              >
                View services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why choose CRSET Solutions?</h2>
            <p className="text-xl text-gray-600">
              We offer complete and customized solutions for your business
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-2xl font-bold mb-4">Intelligent Automation</h3>
              <p className="text-gray-600">
                Automate repetitive processes and increase your team's productivity.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-2xl font-bold mb-4">Cybersecurity</h3>
              <p className="text-gray-600">
                Protect your data and systems against cyber threats.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="text-4xl mb-4">💻</div>
              <h3 className="text-2xl font-bold mb-4">Development</h3>
              <p className="text-gray-600">
                We create customized solutions for your business needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-100 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Proven results</h2>
          
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">Satisfied clients</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-blue-600 mb-2">100+</div>
              <div className="text-gray-600">Completed projects</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-blue-600 mb-2">99.9%</div>
              <div className="text-gray-600">Guaranteed uptime</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-gray-600">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to transform your business?
          </h2>
          <p className="text-xl mb-8">
            Contact us today and discover how we can help.
          </p>
          <Link
            href="/en/contact"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-block"
          >
            Schedule free consultation
          </Link>
        </div>
      </section>
    </div>
  );
}

