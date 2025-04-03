"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";

export default function AREcoLense() {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Reset states
    setError(null);
    setResultImage(null);
    
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      setError("Please upload an image file");
      return;
    }

    // Check file size (4MB max for OpenAI API)
    if (file.size > 4 * 1024 * 1024) {
      setError("Image size must be less than 4MB");
      return;
    }

    // Check if file is PNG format
    if (file.type !== 'image/png') {
      setError("Please upload a PNG image");
      return;
    }

    setImage(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      setError("Please select an image first");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Create form data
      const formData = new FormData();
      formData.append("image", image);
      formData.append("prompt", "Show this environment without any plastic pollution, clean and pristine nature");

      // Send to OpenAI API
      const response = await fetch("/api/generate-clean-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to process image");
      }

      const data = await response.json();
      console.log('Client received OpenAI response:', data);
      setResultImage(data.url);
    } catch (err) {
      console.error("Error processing image:", err);
      setError(err.message || "Failed to process image");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setImage(null);
    setPreviewUrl(null);
    setResultImage(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
            Upload an image of an environment with plastic pollution, and our AI will show you how it would look clean and pristine.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                 onClick={() => fileInputRef.current?.click()}>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleImageChange} 
                accept="image/png" 
                className="hidden" 
              />
              
              {!previewUrl ? (
                <div className="text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm text-gray-500">Click to upload an image or drag and drop</p>
                  <p className="text-xs text-gray-400 mt-1">PNG format only, up to 4MB</p>
                </div>
              ) : (
                <div className="relative w-full h-64">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-full h-full object-contain" 
                  />
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      resetForm();
                    }} 
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-lg text-center">
                {error}
              </div>
            )}

            <div className="flex justify-center">
              <button 
                type="submit" 
                disabled={!image || isLoading}
                className={`px-6 py-3 rounded-full font-medium ${!image || isLoading ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white'} transition-colors`}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : 'Visualize Clean Environment'}
              </button>
            </div>
          </form>

          {resultImage && (
            <div className="mt-8 border-t pt-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Result: Environment Without Pollution</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="relative w-full h-80">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={resultImage} 
                    alt="Clean Environment" 
                    className="w-full h-full object-contain" 
                  />
                </div>
                <div className="mt-4 text-center">
                  <a 
                    href={resultImage} 
                    download={`clean-environment-${uuidv4().substring(0, 8)}.png`}
                    className="text-blue-500 hover:text-blue-700 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download Image
                  </a>
                </div>
              </div>
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