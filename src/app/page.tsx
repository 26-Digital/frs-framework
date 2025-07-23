"use client"
import { useState } from "react"
import Image from "next/image"  // Import Next.js Image component

export default function HomePage() {
  const [isAuthoritiesOpen, setIsAuthoritiesOpen] = useState(false)
  const [isResourcesOpen, setIsResourcesOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo + Text */}
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="text-xl font-semibold text-gray-900">Financial Regulatory Portal</span>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-4">
            {/* Authorities Dropdown */}
            {/* ... unchanged ... */}
            {/* Resources Dropdown */}
            {/* ... unchanged ... */}
            <a href="/auth/signin">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                Login
              </button>
            </a>
                        <a href="/auth/signup">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                Register
              </button>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center md:text-left flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="md:w-1/2">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Navigate <span className="text-blue-600">Financial Compliance</span> with Confidence
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl">
            Your comprehensive portal for financial regulatory requirements in Botswana. 
            Access documents, generate compliance checklists, and stay informed about regulatory changes.
          </p>
          <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
            <a href="/documents">
              <button className="flex items-center bg-blue-600 text-white text-lg px-8 py-4 rounded-md hover:bg-blue-700 transition-colors w-full sm:w-auto">
                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Browse Documents
              </button>
            </a>
            <a href="/checklist">
              <button className="flex items-center border-2 border-blue-600 text-blue-600 text-lg px-8 py-4 rounded-md hover:bg-blue-50 transition-colors w-full sm:w-auto">
                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                Generate Checklist
              </button>
            </a>
          </div>
        </div>

        {/* Hero Image */}
        <div className="md:w-1/2">
          <Image
            src="/images/bank-home.jpg" 
            alt="Financial compliance illustration"
            width={600}
            height={400}
            className="rounded-lg shadow-lg"
            priority
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Everything You Need for Compliance
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[{
            title: "Comprehensive Documents",
            description1: "Access acts, regulations, policies, and guidelines from all major financial authorities",
            description2: "Centralized repository of regulatory documents from BOB, NBFIRA, FIA, and other authorities. All documents are categorized, tagged, and searchable.",
            link: "/documents",
            buttonText: "Browse Documents",
            icon: (
              <svg className="mr-2 h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            ),
            // image: "/images/documents-icon.png" // example image for feature
          }, {
            title: "Smart Checklists",
            description1: "Generate personalized compliance checklists based on your business type and services",
            description2: "Input your business details and get a customized checklist of all regulatory requirements, with cost estimates and timelines.",
            link: "/checklist",
            buttonText: "Create Checklist",
            icon: (
              <svg className="mr-2 h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            ),
            // image: "/images/checklist-icon.png"
          }, {
            title: "Expert Guidance",
            description1: "Get answers to frequently asked questions and access detailed explanations",
            description2: "Comprehensive FAQ database covering common compliance questions, with expert explanations and practical guidance.",
            link: "/faq",
            buttonText: "View FAQs",
            icon: (
              <svg className="mr-2 h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ),
            image: "/images/guidance-icon.png"
          }].map((feature, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow flex flex-col items-center text-center">
              {/* Feature Image */}
              {/* <Image
                src={feature.image}
                alt={`${feature.title} icon`}
                width={64}
                height={64}
                className="mb-4"
              /> */}
              <div className="flex items-center mb-4">
                {feature.icon}
                <h3 className="text-xl font-semibold">{feature.title}</h3>
              </div>
              <p className="text-gray-600 mb-2">{feature.description1}</p>
              <p className="text-gray-600 mb-4">{feature.description2}</p>
              <a href={feature.link}>
                <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors">
                  {feature.buttonText}
                </button>
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Business Types Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-white/60 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Tailored for Your Business
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[ // Add images for business types
              { type: "Banking", icon: "🏦", description: "Commercial banks, microfinance, and deposit-taking institutions", image: "/images/banking.png" },
              { type: "Insurance", icon: "🛡️", description: "Life, general, and reinsurance companies", image: "/images/insurance.png" },
              { type: "FinTech", icon: "💳", description: "Digital financial services and innovation", image: "/images/fintech.png" },
              { type: "Payments", icon: "💰", description: "Payment service providers and mobile money", image: "/images/payments.png" },
              { type: "Asset Management", icon: "📈", description: "Investment funds and portfolio management", image: "/images/asset-management.png" },
              { type: "Capital Markets", icon: "📊", description: "Securities trading and market infrastructure", image: "/images/capital-markets.png" }
            ].map((business, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
                {/* Business Image */}
                {/* <Image
                  src={business.image}
                  alt={`${business.type} icon`}
                  width={64}
                  height={64}
                  className="mx-auto mb-4"
                /> */}
                <div className="text-4xl mb-2">{business.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{business.type}</h3>
                <p className="text-gray-600 text-sm">{business.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="bg-blue-600 text-white rounded-lg p-12 relative overflow-hidden">
          {/* Background subtle image (optional) */}
          {/* <Image
            src="/images/cta-bg.png"
            alt="Background"
            fill
            className="object-cover opacity-20 absolute inset-0 -z-10"
          /> */}
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of financial institutions already using our platform to stay compliant and informed.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="/auth/register">
              <button className="bg-white text-blue-600 text-lg px-8 py-4 rounded-md hover:bg-gray-100 transition-colors w-full sm:w-auto font-semibold">
                Create Free Account
              </button>
            </a>
            <a href="/demo">
              <button className="flex items-center border-2 border-white text-white text-lg px-8 py-4 rounded-md hover:bg-white hover:text-blue-600 transition-colors w-full sm:w-auto">
                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                View Demo
              </button>
            </a>
          </div>
        </div>
      </section>

          {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span className="text-lg font-semibold">Financial Regulatory Portal</span>
              </div>
              <p className="text-gray-300">
                Empowering financial institutions with comprehensive regulatory guidance and compliance tools for Botswana's financial sector.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="/documents" className="hover:text-white transition-colors">Browse Documents</a></li>
                <li><a href="/checklist" className="hover:text-white transition-colors">Compliance Checklist</a></li>
                <li><a href="/search" className="hover:text-white transition-colors">Advanced Search</a></li>
                <li><a href="/faq" className="hover:text-white transition-colors">FAQs</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Authorities</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="/authorities/bob" className="hover:text-white transition-colors">Bank of Botswana</a></li>
                <li><a href="/authorities/nbfira" className="hover:text-white transition-colors">NBFIRA</a></li>
                <li><a href="/authorities/fia" className="hover:text-white transition-colors">Financial Intelligence Agency</a></li>
                <li><a href="/authorities/all" className="hover:text-white transition-colors">All Authorities</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="/help" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="/feedback" className="hover:text-white transition-colors">Submit Feedback</a></li>
                <li><a href="/auth/login" className="hover:text-white transition-colors">Login</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Financial Regulatory Portal. Serving Botswana's financial sector.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
