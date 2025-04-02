import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { mkdir } from 'fs/promises';
import sharp from 'sharp';

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
    
    // Convert image to RGBA format using Sharp
    const rgbaBuffer = await sharp(buffer)
      .toFormat('png')
      .ensureAlpha() // Ensure image has alpha channel (RGBA)
      .toBuffer();

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

    // Call OpenAI API to generate clean image
    console.log('Sending request to OpenAI API with prompt:', prompt);
    const openaiFormData = createFormData(rgbaBuffer, prompt);
    
    const openaiResponse = await fetch('https://api.openai.com/v1/images/edits', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: openaiFormData,
    });

    // Log response status and headers for debugging
    console.log('OpenAI API response status:', openaiResponse.status);
    console.log('OpenAI API response headers:', JSON.stringify(Object.fromEntries([...openaiResponse.headers])));
    
    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      console.error('OpenAI API error:', errorData);
      return NextResponse.json(
        { error: errorData.error?.message || 'Failed to process image with OpenAI' },
        { status: openaiResponse.status }
      );
    }

    const data = await openaiResponse.json();
    
    // Log the OpenAI response data for debugging
    console.log('OpenAI API response data:', JSON.stringify(data));
    
    return NextResponse.json({
      url: data.data[0].url,
      original: `/uploads/${filename}`,
    });
  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    );
  }
}

// Helper function to create form data for OpenAI API
function createFormData(imageBuffer, prompt) {
  const formData = new FormData();
  
  // Convert buffer to blob with proper RGBA format
  const blob = new Blob([imageBuffer], { type: 'image/png' });
  formData.append('image', blob, 'image.png');
  formData.append('prompt', prompt || 'Show this environment without any plastic pollution, clean and pristine nature');
  formData.append('model', 'dall-e-2');
  formData.append('n', '1');
  formData.append('size', '1024x1024');
  
  return formData;
}