import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { mkdir } from 'fs/promises';
import OpenAI from 'openai';

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
    
    // Generate a unique filename
    const uniqueId = uuidv4();
    const filename = `${uniqueId}.png`;

    // Ensure the uploads directory exists
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (err) {
      // Directory might already exist, ignore this error
      if (err.code !== 'EEXIST') throw err;
    }

    // Save the uploaded image
    const imagePath = join(uploadDir, filename);
    await writeFile(imagePath, buffer);

    // Convert buffer to base64 for OpenAI API
    const base64Image = buffer.toString('base64');
    
    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Call OpenAI API to analyze the image
    const analysisPrompt = prompt || "Analyze this image and identify what type of plastic this is. Provide details about the plastic type, its recycling code, common uses, and recyclability.";
    
    const response = await openai.chat.completions.create({
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

    // Extract the analysis from the response
    const analysis = response.choices[0].message.content;
    
    return NextResponse.json({
      analysis: analysis,
      original: `/uploads/${filename}`,
    });
  } catch (error) {
    console.error('Error analyzing image:', error);
    return NextResponse.json(
      { error: 'Failed to analyze image' },
      { status: 500 }
    );
  }
}