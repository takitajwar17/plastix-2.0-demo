"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";

export default function PlasticAnalysis() {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Reset states
    setError(null);
    setAnalysisResult(null);
    
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
      formData.append("prompt", "Perform a comprehensive analysis of all the plastic items in the image. Identify the plastic type, recycling code, and provide detailed information about specific categories.\n\nEnsure your analysis includes:\n\n1. Material composition and properties.\n2. Common industrial and consumer applications.\n3. Recyclability status and best practices.\n4. Environmental impact and degradation timeline.\n5. Safety considerations and usage guidelines.\n\n# Output Format\n\nFormat the response as a detailed JSON object according to the following JSON schema:\n\n```json\n{\n  \"plastics\": [\n    {\n      \"plasticType\": \"Full name and chemical classification\",\n      \"recyclingCode\": \"Numerical code (1-7)\",\n      \"commonUses\": [\"List of primary applications\"],\n      \"recyclability\": \"Detailed recyclability status\",\n      \"environmentalImpact\": \"Environmental considerations\",\n      \"additionalInfo\": \"Safety and handling guidelines\"\n    }\n  ]\n}\n```");

      // Send to OpenAI API
      const response = await fetch("/api/analyze-plastic-type", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze image");
      }

      const data = await response.json();
      console.log('Client received plastic analysis:', data);
      
      // Try to parse the analysis as JSON
      try {
        // Check if the analysis is already a JSON object
        let analysisData;
        if (typeof data.analysis === 'string') {
          // Try to extract JSON from the string response
          // Look for JSON-like structure in the text
          const jsonMatch = data.analysis.match(/\{[\s\S]*\}/m);
          if (jsonMatch) {
            try {
              analysisData = JSON.parse(jsonMatch[0]);
            } catch (innerError) {
              console.error("Error parsing extracted JSON:", innerError);
              throw new Error("Could not parse JSON structure");
            }
          } else {
            throw new Error("No JSON structure found in response");
          }
        } else {
          analysisData = data.analysis;
        }
        
        // Validate the structure of the parsed data
        if (!analysisData.plastics || !Array.isArray(analysisData.plastics)) {
          throw new Error("Invalid data structure: missing plastics array");
        }
        
        setAnalysisResult(analysisData);
      } catch (parseError) {
        console.error("Error parsing analysis JSON:", parseError);
        // Create a fallback structure that includes the raw response
        setAnalysisResult({ plastics: [{ 
          plasticType: "Unknown", 
          recyclingCode: "Unknown", 
          commonUses: ["Unknown"], 
          recyclability: "Could not determine", 
          environmentalImpact: "Could not determine", 
          additionalInfo: data.analysis 
        }]});
      }
    } catch (err) {
      console.error("Error analyzing image:", err);
      setError(err.message || "Failed to analyze image");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setImage(null);
    setPreviewUrl(null);
    setAnalysisResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Function to render the plastic analysis results in a structured format
  const renderPlasticAnalysis = () => {
    if (!analysisResult || !analysisResult.plastics || analysisResult.plastics.length === 0) {
      return null;
    }

    return analysisResult.plastics.map((plastic, index) => (
      <div key={index} className="mb-6 last:mb-0 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center mb-3">
          <div className="bg-purple-100 p-2 rounded-full mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h4 className="text-lg font-semibold text-gray-900">{plastic.plasticType}</h4>
          <div className="ml-auto bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
            Recycling Code: {plastic.recyclingCode}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="space-y-3">
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-1">Common Uses</h5>
              <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
                {plastic.commonUses.map((use, i) => (
                  <li key={i}>{use}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-1">Recyclability</h5>
              <p className="text-gray-600 text-sm">{plastic.recyclability}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-1">Environmental Impact</h5>
              <p className="text-gray-600 text-sm">{plastic.environmentalImpact}</p>
            </div>
            
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-1">Additional Information</h5>
              <p className="text-gray-600 text-sm">{plastic.additionalInfo}</p>
            </div>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-white flex flex-col" style={{ background: 'linear-gradient(to bottom, white, #f5f0ff)' }}>
      {/* Header */}
      <header className="w-full py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center">
          <div className="mr-2 float">
            <Image src="/mascot.svg" width={50} height={50} alt="Plastix Mascot" className="bounce" />
          </div>
          <h1 className="text-2xl font-bold text-purple-600 wiggle">Plastic Analysis</h1>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li><a href="/" className="text-gray-600 hover:text-purple-500 transition-colors">Home</a></li>
          </ul>
        </nav>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Analyze Plastic Types & Properties</h2>
          
          <p className="text-gray-600 mb-6 text-center">
            Upload an image of a plastic item, and our AI will analyze what type of plastic it is and provide detailed information about its properties, recyclability, and environmental impact.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                 onClick={() => fileInputRef.current?.click()}>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleImageChange} 
                accept="image/*" 
                className="hidden" 
              />
              
              {!previewUrl ? (
                <div className="text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm text-gray-500">Click to upload an image or drag and drop</p>
                  <p className="text-xs text-gray-400 mt-1">Image file up to 4MB</p>
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
                className={`px-6 py-3 rounded-full font-medium ${!image || isLoading ? 'bg-gray-300 cursor-not-allowed' : 'bg-purple-500 hover:bg-purple-600 text-white'} transition-colors`}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </span>
                ) : 'Analyze Plastic Type'}
              </button>
            </div>
          </form>

          {analysisResult && (
            <div className="mt-8 border-t pt-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Plastic Analysis Results</h3>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="space-y-4">
                  {renderPlasticAnalysis()}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-white py-6 border-t">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Plastix 2.0 - Plastic Analysis</p>
        </div>
      </footer>
    </div>
  );
}