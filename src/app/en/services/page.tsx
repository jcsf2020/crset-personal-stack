import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Services - CRSET Solutions",
  description: "Complete solutions for your business: automation, cybersecurity, development, and consulting.",
  alternates: {
    canonical: "https://crsetsolutions.com/en/services",
    languages: {
      'pt': 'https://crsetsolutions.com/servicos',
      'en': 'https://crsetsolutions.com/en/services',
    },
  },
};

export default function ServicesPageEN() {
  const services = [
    {
      icon: "🤖",
      title: "Process Automation",
      description: "Automate repetitive tasks and increase your team's efficiency.",
      features: [
        "RPA (Robotic Process Automation)",
        "System integration",
        "Custom workflows",
        "Real-time monitoring"
      ]
    },
    {
      icon: "🔒",
      title: "Cybersecurity",
      description: "Protect your data and systems against cyber threats.",
      features: [
        "Security audits",
        "Penetration testing",
        "Team training",
        "24/7 Monitoring"
      ]
    },
    {
      icon: "💻",
      title: "Software Development",
      description: "We create customized solutions for your business needs.",
      features: [
        "Web and mobile applications",
        "APIs and integrations",
        "Management systems",
        "Technical consulting"
      ]
    },
    {
      icon: "📊",
      title: "Consulting",
      description: "We help define the best technology strategy for your business.",
      features: [
        "Process analysis",
        "System architecture",
        "Project management",
        "Digital transformation"
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Our Services</h1>
            <p className="text-xl">
              Complete solutions for your business
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-lg">
                <div className="text-5xl mb-4">{service.icon}</div>
                <h2 className="text-3xl font-bold mb-4">{service.title}</h2>
                <p className="text-gray-600 mb-6">{service.description}</p>
                
                <h3 className="font-bold mb-3">Key Features:</h3>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-blue-600 mr-2">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Interested in our services?
          </h2>
          <p className="text-xl mb-8">
            Contact us for a free consultation
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

