import type { Metadata } from "next";
import Link from "next/link";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
function AIChatWidgetEnhanced({ language = "pt" }: { language?: string }) {
  return null
}

export const metadata: Metadata = {
  title: {
    default: "CRSET Solutions - Intelligent Business Automation",
    template: "%s | CRSET Solutions",
  },
  description: "Intelligent automation, cybersecurity, and development solutions for businesses that want to grow.",
};

export default function EnglishLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/en" className="text-2xl font-bold text-blue-600">
              CRSET Solutions
            </Link>
            
            <div className="flex items-center gap-6">
              <Link href="/en" className="hover:text-blue-600 transition">
                Home
              </Link>
              <Link href="/en/services" className="hover:text-blue-600 transition">
                Services
              </Link>
              <Link href="/en/pricing" className="hover:text-blue-600 transition">
                Pricing
              </Link>
              <Link href="/en/help" className="hover:text-blue-600 transition">
                Help
              </Link>
              <Link href="/en/rag-demo" className="hover:text-blue-600 transition">
                RAG Demo
              </Link>
              <Link href="/en/contact" className="hover:text-blue-600 transition">
                Contact
              </Link>
              
              <LanguageSwitcher />
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* AI Chat Widget */}
      <AIChatWidgetEnhanced language="en" />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">CRSET Solutions</h3>
              <p className="text-gray-400">
                Intelligent solutions for your business
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/en" className="hover:text-white transition">Home</Link></li>
                <li><Link href="/en/services" className="hover:text-white transition">Services</Link></li>
                <li><Link href="/en/pricing" className="hover:text-white transition">Pricing</Link></li>
                <li><Link href="/en/contact" className="hover:text-white transition">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/en/privacy" className="hover:text-white transition">Privacy</Link></li>
                <li><Link href="/en/terms" className="hover:text-white transition">Terms</Link></li>
                <li><Link href="/en/cookies" className="hover:text-white transition">Cookies</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Social Media</h4>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-white transition">LinkedIn</a>
                <a href="#" className="text-gray-400 hover:text-white transition">Twitter</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            © 2025 CRSET Solutions. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

