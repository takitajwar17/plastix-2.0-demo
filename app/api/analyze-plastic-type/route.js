import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Configure API response timeout
const API_TIMEOUT = 25000; // 25 seconds (under Vercel's 30s hard limit)

export async function POST(request) {
  try {
    // Parse the form data
    const formData = await request.formData();
    const image = formData.get('image');
    const prompt = formData.get('prompt');

    if (!image) {
      return NextResponse.json(
        { error: 'Image is required' },
        { status: 400 }
      );
    }

    // Convert the image to a buffer
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Convert buffer to base64 for OpenAI API
    const base64Image = buffer.toString('base64');
    
    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Call OpenAI API to analyze the image with timeout handling
    const analysisPrompt = prompt || "Analyze this image and identify what type of plastic this is. Provide details about the plastic type, its recycling code, common uses, and recyclability.";
    
    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('OpenAI API request timed out'));
      }, API_TIMEOUT);
    });

    // Create the OpenAI API request promise
    const openaiPromise = openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: analysisPrompt },
            {
              type: "image_url",
              image_url: {
                url: `data:image/png;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 500,
    });

    // Race the promises
    const response = await Promise.race([openaiPromise, timeoutPromise]);

    // Extract the analysis from the response
    const analysis = response.choices[0].message.content;
    
    return NextResponse.json({
      analysis: analysis
    });
  } catch (error) {
    console.error('Error analyzing image:', error);
    
    // Provide more specific error messages based on error type
    let errorMessage = 'Failed to analyze image';
    let statusCode = 500;
    
    if (error.message === 'OpenAI API request timed out') {
      errorMessage = 'The image analysis took too long to complete. Please try again with a simpler image or try later.';
      statusCode = 504; // Gateway Timeout
    } else if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
      errorMessage = 'Connection to the analysis service timed out. Please try again later.';
      statusCode = 504;
    } else if (error.response && error.response.status) {
      // Handle OpenAI API specific errors
      statusCode = error.response.status;
      errorMessage = `OpenAI API error: ${error.response.data?.error?.message || errorMessage}`;
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}