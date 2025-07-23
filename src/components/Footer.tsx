import Link from 'next/link';
import { FileText } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      className="bg-gray-900 text-white py-12" 
      role="contentinfo" 
      aria-label="Website footer"
    >
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <section aria-labelledby="brand-heading">
            <div className="flex items-center mb-4">
              <div 
                className="bg-[#2962FF] rounded-lg p-2 mr-3" 
                aria-hidden="true"
              >
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h2 id="brand-heading" className="text-xl font-bold">
                ResumeRight
              </h2>
            </div>
            <p className="text-gray-400 mb-4">
              AI-powered resume optimization that gets you hired.
            </p>
          </section>

          {/* Product Links */}
          <nav aria-labelledby="product-heading">
            <h3 id="product-heading" className="font-semibold mb-4">
              Product
            </h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link 
                  href="/features" 
                  className="hover:text-white"
                  aria-label="Learn about our features"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link 
                  href="/pricing" 
                  className="hover:text-white"
                  aria-label="View pricing plans"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link 
                  href="/demo" 
                  className="hover:text-white"
                  aria-label="Try our demo"
                >
                  Demo
                </Link>
              </li>
            </ul>
          </nav>

          {/* Company Links */}
          <nav aria-labelledby="company-heading">
            <h3 id="company-heading" className="font-semibold mb-4">
              Company
            </h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link 
                  href="/about" 
                  className="hover:text-white"
                  aria-label="About our company"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="hover:text-white"
                  aria-label="Contact us"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link 
                  href="/careers" 
                  className="hover:text-white"
                  aria-label="Career opportunities"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </nav>

          {/* Support Links */}
          <nav aria-labelledby="support-heading">
            <h3 id="support-heading" className="font-semibold mb-4">
              Support
            </h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link 
                  href="/help" 
                  className="hover:text-white"
                  aria-label="Visit help center"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link 
                  href="/privacy" 
                  className="hover:text-white"
                  aria-label="View privacy policy"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms" 
                  className="hover:text-white"
                  aria-label="View terms of service"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Copyright */}
        <div 
          className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400"
          aria-label="Copyright information"
        >
          <p>&copy; {currentYear} ResumeRight. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;