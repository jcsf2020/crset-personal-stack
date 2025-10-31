import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { FEATURE_SERVICOS } from "@/lib/flags";
import { pricePair, PRICE_FALLBACKS } from "@/lib/prices";
import { SERVICES_CONFIG, getServiceBySlug, getAllSlugs } from "@/lib/services-config";
import type { Metadata } from "next";
export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  // Use NEXT_PUBLIC_SITE_URL com fallback para crsetsolutions.com
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://crsetsolutions.com';
  const canonicalUrl = `${SITE_URL}/servicos/${params.slug}`;
  
  return { 
    openGraph: { url: canonicalUrl }, 
    alternates: { canonical: canonicalUrl },
  };
}

interface ServicePageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({
    slug,
  }));
}

export default function ServicePage({ params }: ServicePageProps) {
  // Feature flag check
  if (!FEATURE_SERVICOS) {
    notFound();
  }

  const service = getServiceBySlug(params.slug);
  
  if (!service) {
    notFound();
  }

  // Get prices with fallbacks
  const fallback = PRICE_FALLBACKS[service.key];
  const prices = pricePair(service.key, fallback.setup, fallback.month);

  // UTM parameters for CTAs
  const utmParams = `utm_source=site&utm_medium=cta&utm_campaign=servicos&utm_content=${service.slug}`;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8" aria-label="Breadcrumb">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Link 
            href="/servicos" 
            className="hover:text-blue-600 transition-colors"
            aria-label="Voltar para página de serviços"
          >
            Serviços
          </Link>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-900 font-medium">{service.title}</span>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="mb-16 space-y-6 md:space-y-8">
        <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12">
          <div className="flex-1 space-y-6 md:space-y-8">
            <div className="flex items-center gap-3">
              <span className="inline-block px-4 py-2 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                {service.category}
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {service.title}
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed">
              {service.subtitle}
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              {service.description}
            </p>
          </div>
          
          {/* Hero Mascot */}
          {service.mascot && (
            <div className="w-48 h-48 lg:w-64 lg:h-64 relative flex-shrink-0">
              <Image
                src={service.mascot}
                alt={`Mascote do serviço ${service.title}`}
                fill
                className="object-contain"
                priority
                sizes="(max-width: 1024px) 192px, 256px"
              />
            </div>
          )}
        </div>
      </section>

      <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          {/* Features Section */}
          <section className="p-8 rounded-2xl border border-white/10 bg-white/[0.03]">
            <h2 className="text-2xl lg:text-3xl font-semibold mb-8">Funcionalidades Incluídas</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {service.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700 text-base leading-relaxed">{feature}</span>
                </div>
              ))}
            </div>
          </section>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href={`/#contact?${utmParams}`}
              className="flex-1 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-center text-lg shadow-lg hover:shadow-xl"
              aria-label={`Pedir proposta para ${service.title}`}
            >
              Pedir Proposta
            </Link>
            <Link
              href={`/precos?${utmParams}`}
              className="flex-1 px-8 py-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium text-center text-lg"
              aria-label="Ver tabela completa de preços"
            >
              Ver Tabela de Preços
            </Link>
          </div>
        </div>

        {/* Sidebar with pricing */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-6">
            {/* Pricing Card */}
            <div className="p-8 rounded-2xl border border-white/10 bg-white/[0.03]">
              <h3 className="text-xl lg:text-2xl font-semibold mb-6">Preços</h3>
              
              <div className="space-y-6">
                <div>
                  <div className="text-sm text-gray-600 mb-2">Setup Inicial</div>
                  <div className="text-3xl font-bold text-gray-900">{prices.setup}</div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-600 mb-2">Mensalidade</div>
                  <div className="text-3xl font-bold text-gray-900">{prices.month}</div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-3">
                  Preços podem ser personalizados via variáveis de ambiente:
                </p>
                <pre className="text-xs bg-gray-100 p-3 rounded text-gray-700 overflow-x-auto">
{`NEXT_PUBLIC_PRICE_${service.key}_SETUP
NEXT_PUBLIC_PRICE_${service.key}_MONTH`}
                </pre>
              </div>
            </div>

            {/* Additional info */}
            <div className="p-6 rounded-xl bg-blue-50 border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-4">Inclui sempre:</h4>
              <ul className="text-sm text-blue-800 space-y-2">
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Configuração inicial
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Formação da equipa
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Suporte técnico
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Atualizações regulares
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Back to services */}
      <div className="mt-16 pt-8 border-t border-gray-200">
        <Link
          href="/servicos"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-lg transition-colors"
          aria-label="Voltar para página de serviços"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar aos Serviços
        </Link>
      </div>
    </main>
  );
}
