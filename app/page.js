"use client";

import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="w-full py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center border-b border-gray-200">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-gray-800">Plastix 2.0</h1>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li><a href="#features" className="text-gray-600 hover:text-gray-800">Features</a></li>
            <li><a href="#about" className="text-gray-600 hover:text-gray-800">About</a></li>
          </ul>
        </nav>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Combat Plastic Pollution with AR</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional solutions for plastic pollution detection and visualization
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Innovation 1: AR Eco Lens */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-3 rounded-lg mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800">AR Eco Lens</h3>
              </div>
              <p className="text-gray-600 mb-4">
                The AR visualization shows users how areas would look without plastic pollution, creating emotional connection and motivation. Our technology creates a "what if" scenario to demonstrate the potential impact of pollution reduction efforts.
              </p>
              <div className="mt-4">
                <a href="/ar-ecolense" className="inline-block bg-green-600 text-white font-medium rounded-lg px-4 py-2 hover:bg-green-700 transition-colors">
                  Visit AR Eco Lens
                </a>
              </div>
            </div>

            {/* Innovation 2: Plastic Detection and Analysis */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Plastic Detection and Analysis</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Our ML algorithm detects 95% of common plastic waste and provides real-time environmental impact data. This advanced technology enables precise identification and classification of plastic pollution, supporting effective remediation efforts.
              </p>
              <div className="mt-4">
                <a href="/plastic-analysis" className="inline-block bg-blue-600 text-white font-medium rounded-lg px-4 py-2 hover:bg-blue-700 transition-colors">
                  Visit Plastic Analysis
                </a>
              </div>
            </div>
          </div>

          {/* Removed 'Learn More' button as requested */}
        </section>
        
        {/* About Section */}
        <section id="about" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">About Plastix 2.0</h2>
            <p className="text-gray-600 mb-6">
              Plastix 2.0 is an innovative Augmented Reality (AR) mobile application that combines cutting-edge technology with behavioral science to address plastic pollution in Bangladesh's waterways. Our solution empowers citizens to visualize, track, and reduce plastic waste while contributing to a nationwide pollution monitoring system.
            </p>
            <p className="text-gray-600">
              With our team's diverse expertise in AR development, product management, UI/UX design, database engineering, and environmental business models, Plastix 2.0 delivers a technologically sophisticated yet accessible solution optimized for Bangladesh's infrastructure challenges.
            </p>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div>
            <h3 className="text-lg font-bold">Plastix 2.0</h3>
            <p className="text-gray-400 text-sm">Professional AR Solution for Plastic Pollution</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">© 2025 Plastix 2.0 Team. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
