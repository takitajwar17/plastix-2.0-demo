"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";

export default function AREcoLense() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [progressText, setProgressText] = useState("");
  const [showCleanImage, setShowCleanImage] = useState(false);
  const progressIntervalRef = useRef(null);
  
  // Available polluted images
  const pollutedImages = [
    { id: 1, src: "/assets/raw/image-1.png", cleanSrc: "/assets/clean/image-1.png" },
    { id: 2, src: "/assets/raw/image-2.png", cleanSrc: "/assets/clean/image-1.png" } // Using image-1 as clean for both as per requirements
  ];

  // Function to simulate progress with varying speeds
  const simulateProgress = () => {
    // Clear any existing interval
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    
    // Reset progress
    setLoadingProgress(0);
    setProgressText("Initializing AR EcoLens...");
    setShowCleanImage(false);
    
    // Create a new interval that updates progress with varying speeds
    progressIntervalRef.current = setInterval(() => {
      setLoadingProgress(prevProgress => {
        // Different speed ranges for different progress stages
        let increment;
        
        if (prevProgress < 20) {
          // Fast initial progress
          increment = Math.random() * 1.5 + 0.5;
          setProgressText("Analyzing pollution patterns...");
        } else if (prevProgress < 40) {
          // Slower
          increment = Math.random() * 0.8 + 0.2;
          setProgressText("Identifying plastic types...");
        } else if (prevProgress < 60) {
          // Even slower
          increment = Math.random() * 0.6 + 0.1;
          setProgressText("Calculating environmental impact...");
        } else if (prevProgress < 80) {
          // Slowest
          increment = Math.random() * 0.4 + 0.1;
          setProgressText("Generating clean environment visualization...");
        } else if (prevProgress < 95) {
          // Final stage
          increment = Math.random() * 0.3 + 0.05;
          setProgressText("Finalizing AR transformation...");
        } else {
          // Complete
          clearInterval(progressIntervalRef.current);
          setProgressText("Transformation complete!");
          setShowCleanImage(true);
          return 100;
        }
        
        return Math.min(prevProgress + increment, 95);
      });
    }, 200); // Update every 200ms
  };
  
  // Clean up interval on component unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  const handleImageSelect = (image) => {
    setSelectedImage(image);
    setShowCleanImage(false);
  };

  const handleProcessImage = () => {
    if (!selectedImage) return;
    
    setIsProcessing(true);
    // Start progress simulation
    simulateProgress();
  };

  const resetDemo = () => {
    setSelectedImage(null);
    setIsProcessing(false);
    setLoadingProgress(0);
    setProgressText("");
    setShowCleanImage(false);
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col" style={{ background: 'linear-gradient(to bottom, white, #f0fdf4)' }}>
      {/* Header */}
      <header className="w-full py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-green-600">AR EcoLens</h1>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li><a href="/" className="text-gray-600 hover:text-green-500 transition-colors">Home</a></li>
          </ul>
        </nav>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Visualize Environments Without Plastic Pollution</h2>
          
          <p className="text-gray-600 mb-6 text-center">
            Select an image of an environment with plastic pollution, and our AI will show you how it would look clean and pristine.
          </p>

          {!selectedImage && !isProcessing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {pollutedImages.map((image) => (
                <div 
                  key={image.id} 
                  className={`border-2 rounded-lg p-2 cursor-pointer hover:border-green-500 transition-all`}
                  onClick={() => handleImageSelect(image)}
                >
                  <div className="relative w-full h-48">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={image.src} 
                      alt={`Polluted Environment ${image.id}`} 
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <p className="text-center mt-2 text-sm text-gray-600">Polluted Image {image.id}</p>
                </div>
              ))}
            </div>
          ) : null}

          {selectedImage && !isProcessing ? (
            <div className="mb-6">
              <div className="relative w-full h-64 mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={selectedImage.src} 
                  alt="Selected Polluted Environment" 
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <div className="flex justify-between">
                <button 
                  onClick={resetDemo}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Back to Selection
                </button>
                <button 
                  onClick={handleProcessImage}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Process Image
                </button>
              </div>
            </div>
          ) : null}

          {isProcessing && (
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Original Image</h4>
                  <div className="relative w-full h-64">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={selectedImage.src} 
                      alt="Original Environment" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Clean Environment</h4>
                  <div className="relative w-full h-64 overflow-hidden">
                    {showCleanImage ? (
                      <div 
                        className="w-full" 
                        style={{
                          height: `${loadingProgress}%`,
                          transition: 'height 0.5s ease-out',
                          overflow: 'hidden'
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={selectedImage.cleanSrc} 
                          alt="Clean Environment" 
                          className="w-full h-64 object-contain transform-origin-top"
                          style={{ objectPosition: 'top' }}
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <div className="text-center">
                          <svg className="animate-spin h-10 w-10 text-green-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <p className="text-sm text-gray-600">{progressText}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Processing...</span>
                  <span>{loadingProgress}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 transition-all duration-300 ease-out"
                    style={{ width: `${loadingProgress}%` }}
                  ></div>
                </div>
              </div>
              
              <button 
                onClick={resetDemo}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Start Over
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-white py-6 border-t">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Plastix 2.0 - AR EcoLens Feature</p>
        </div>
      </footer>
    </div>
  );
}