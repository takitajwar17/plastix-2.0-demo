"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [points, setPoints] = useState(120);
  const [level, setLevel] = useState(3);
  
  return (
    <div className="min-h-screen bg-white flex flex-col" style={{ background: 'linear-gradient(to bottom, white, #f0fdf4)' }}>
      {/* Hero Section */}
      <header className="w-full py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center">
          <div className="mr-2 float">
            <Image src="/mascot.svg" width={50} height={50} alt="Plastix Mascot" className="bounce" />
          </div>
          <h1 className="text-2xl font-bold text-green-600 wiggle">Plastix 2.0</h1>
          <div className="ml-2 badge bg-yellow-100 text-yellow-800 flex items-center">
            <Image src="/badge.svg" width={16} height={16} alt="Badge" className="mr-1" />
            <span>Eco Hero</span>
          </div>
          <div className="ml-2 badge bg-blue-100 text-blue-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>{points} pts</span>
          </div>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li><a href="#features" className="text-gray-600 hover:text-green-500 transition-colors">Features</a></li>
            <li><a href="#about" className="text-gray-600 hover:text-green-500 transition-colors">About</a></li>
            <li><a href="#demo" className="text-gray-600 hover:text-green-500 transition-colors">Demo</a></li>
            <li>
              <div className="flex items-center bg-green-50 px-3 py-1 rounded-full pulse">
                <Image src="/level.svg" width={20} height={20} alt="Level" className="mr-1" />
                <span className="text-green-800 font-medium">Lvl {level}</span>
              </div>
            </li>
          </ul>
        </nav>
      </header>

      <main className="flex-grow">
        {/* Hero Banner */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">Combat Plastic Pollution with AR</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            A gamified AR solution for plastic pollution awareness and reduction
          </p>
          <div className="inline-block bg-green-500 text-white font-medium rounded-full px-6 py-3 hover:bg-green-600 transition-colors cursor-pointer">
            Try Demo
          </div>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <div className="bg-white rounded-xl shadow-md p-4 flex items-center max-w-sm card-hover">
              <div className="mr-3 bg-green-100 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">Your Impact</p>
                <div className="mt-1">
                  <div className="progress-bar">
                    <div className="progress-bar-fill" style={{ width: '65%' }}></div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">65% to your next eco-badge!</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-4 flex items-center max-w-sm card-hover">
              <div className="mr-3 bg-purple-100 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">Daily Challenge</p>
                <div className="mt-1 flex items-center">
                  <div className="progress-bar flex-grow mr-2">
                    <div className="progress-bar-fill" style={{ width: '30%', background: 'linear-gradient(90deg, #c084fc 0%, #8b5cf6 100%)' }}></div>
                  </div>
                  <span className="text-xs font-medium text-purple-800">1/3</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Scan 3 plastic items today!</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Our Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col items-center text-center card-hover">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">AR Eco Lens</h3>
              <p className="text-gray-600">
                Visualize environments without plastic pollution. Our ML algorithm identifies 95% of common plastic waste types and quantifies environmental impact in real-time.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col items-center text-center card-hover">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Scanner</h3>
              <p className="text-gray-600">
                Instantly rate products' plastic footprint and discover eco-friendly alternatives. Testing shows this feature alone reduced plastic consumption by 27%.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col items-center text-center card-hover">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Citizen Science Map</h3>
              <p className="text-gray-600">
                Bangladesh's first crowdsourced pollution mapping system, documenting 5,000+ hotspots annually to guide targeted cleanup and prevention efforts.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col items-center text-center card-hover">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Eco Journey</h3>
              <p className="text-gray-600">
                Gamified experience that drives a 30% reduction in single-use plastic through community challenges, rewards, and friendly competition.
              </p>
            </div>
          </div>
        </section>

        {/* Achievements Section */}
        <section id="achievements" className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-green-50 to-white rounded-t-3xl mt-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">Your Achievements</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">Collect badges and rewards on your eco-journey!</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {/* Achievement 1 */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <Image src="/achievement.svg" width={80} height={80} alt="Achievement" className="pulse" />
                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">3</div>
              </div>
              <h3 className="text-sm font-semibold mt-2 text-center">Plastic Detective</h3>
              <p className="text-xs text-gray-500 text-center">Identified 50 plastic items</p>
            </div>
            
            {/* Achievement 2 */}
            <div className="flex flex-col items-center">
              <div className="relative grayscale opacity-70">
                <Image src="/achievement.svg" width={80} height={80} alt="Achievement" />
                <div className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">0</div>
              </div>
              <h3 className="text-sm font-semibold mt-2 text-center text-gray-500">Cleanup Champion</h3>
              <p className="text-xs text-gray-500 text-center">Join 5 cleanup events</p>
            </div>
            
            {/* Achievement 3 */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <Image src="/achievement.svg" width={80} height={80} alt="Achievement" className="pulse" />
                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">1</div>
              </div>
              <h3 className="text-sm font-semibold mt-2 text-center">Eco Shopper</h3>
              <p className="text-xs text-gray-500 text-center">Choose 10 eco-friendly alternatives</p>
            </div>
            
            {/* Achievement 4 */}
            <div className="flex flex-col items-center">
              <div className="relative grayscale opacity-70">
                <Image src="/achievement.svg" width={80} height={80} alt="Achievement" />
                <div className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">0</div>
              </div>
              <h3 className="text-sm font-semibold mt-2 text-center text-gray-500">Pollution Mapper</h3>
              <p className="text-xs text-gray-500 text-center">Map 20 pollution hotspots</p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <div className="inline-block bg-white shadow-md rounded-full px-6 py-3 text-green-600 font-medium hover:shadow-lg transition-all cursor-pointer">
              View All Achievements
            </div>
          </div>
        </section>
        
        {/* About Section */}
        <section id="about" className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-green-50 rounded-t-3xl mt-8">
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

      <footer className="bg-gray-800 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">Plastix 2.0</h3>
            <p className="text-gray-400 text-sm">Gamified AR Solution for Plastic Pollution</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">© 2025 Plastix 2.0 Team. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
