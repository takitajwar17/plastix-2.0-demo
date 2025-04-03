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

  // Get appropriate icon based on recycling code
  const getPlasticIcon = (code) => {
    // Default icon if code is unknown
    if (!code || code === "Unknown") {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      );
    }

    // Convert code to number if it's a string
    const codeNum = parseInt(code, 10);
    
    // Return appropriate icon based on recycling code
    switch(codeNum) {
      case 1: // PET
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v8M8 12h8" />
          </svg>
        );
      case 2: // HDPE
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 8.5L12 6l2.5 2.5M12 6v12" />
          </svg>
        );
      case 3: // PVC
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 9l5 6 5-6" />
          </svg>
        );
      case 4: // LDPE
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h8M8 14h8" />
          </svg>
        );
      case 5: // PP
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V8M8 10h8" />
          </svg>
        );
      case 6: // PS
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v8M15 12H9" />
          </svg>
        );
      case 7: // Other
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v.01M12 12v-4" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
    }
  };

  // Get color scheme based on recycling code
  const getColorScheme = (code) => {
    if (!code || code === "Unknown") return { bg: "bg-gray-100", border: "border-gray-300", text: "text-gray-800" };
    
    const codeNum = parseInt(code, 10);
    
    switch(codeNum) {
      case 1: // PET
        return { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-800" };
      case 2: // HDPE
        return { bg: "bg-green-50", border: "border-green-200", text: "text-green-800" };
      case 3: // PVC
        return { bg: "bg-red-50", border: "border-red-200", text: "text-red-800" };
      case 4: // LDPE
        return { bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-800" };
      case 5: // PP
        return { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-800" };
      case 6: // PS
        return { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-800" };
      case 7: // Other
        return { bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-800" };
      default:
        return { bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-800" };
    }
  };

  // Function to render the plastic analysis results in a structured format
  const renderPlasticAnalysis = () => {
    if (!analysisResult || !analysisResult.plastics || analysisResult.plastics.length === 0) {
      return null;
    }

    return analysisResult.plastics.map((plastic, index) => {
      const colors = getColorScheme(plastic.recyclingCode);
      
      return (
        <div key={index} className={`mb-8 last:mb-0 ${colors.bg} border ${colors.border} p-6 rounded-xl shadow-md transition-all hover:shadow-lg`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4 gap-3">
            <div className={`p-3 rounded-full ${colors.bg} border ${colors.border}`}>
              {getPlasticIcon(plastic.recyclingCode)}
            </div>
            
            <div className="flex-grow">
              <h4 className={`text-xl font-bold ${colors.text}`}>{plastic.plasticType}</h4>
              <p className="text-gray-500 text-sm mt-1">Identification and Classification</p>
            </div>
            
            <div className={`${colors.bg} ${colors.text} text-sm font-bold px-4 py-2 rounded-full border ${colors.border} flex items-center gap-1`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Code {plastic.recyclingCode}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div className="space-y-4">
              <div className="bg-white bg-opacity-60 p-4 rounded-lg border border-gray-100 shadow-sm">
                <h5 className={`${colors.text} font-semibold flex items-center gap-2 mb-3`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Common Uses
                </h5>
                <ul className="list-disc pl-5 text-gray-700 space-y-2">
                  {plastic.commonUses.map((use, i) => (
                    <li key={i} className="leading-relaxed">{use}</li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white bg-opacity-60 p-4 rounded-lg border border-gray-100 shadow-sm">
                <h5 className={`${colors.text} font-semibold flex items-center gap-2 mb-3`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Recyclability
                </h5>
                <p className="text-gray-700 leading-relaxed">{plastic.recyclability}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white bg-opacity-60 p-4 rounded-lg border border-gray-100 shadow-sm">
                <h5 className={`${colors.text} font-semibold flex items-center gap-2 mb-3`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Environmental Impact
                </h5>
                <p className="text-gray-700 leading-relaxed">{plastic.environmentalImpact}</p>
              </div>
              
              <div className="bg-white bg-opacity-60 p-4 rounded-lg border border-gray-100 shadow-sm">
                <h5 className={`${colors.text} font-semibold flex items-center gap-2 mb-3`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Additional Information
                </h5>
                <p className="text-gray-700 leading-relaxed">{plastic.additionalInfo}</p>
              </div>
            </div>
          </div>
        </div>
      );
    });
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
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Plastic Analysis Results
              </h3>
              <div className="bg-gradient-to-br from-white to-purple-50 p-6 rounded-xl shadow-md border border-purple-100">
                <div className="space-y-6">
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