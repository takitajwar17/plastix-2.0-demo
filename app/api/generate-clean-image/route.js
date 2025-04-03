import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
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
    
    // Process the image with sharp to ensure it's a valid PNG
    // This will convert any image format (JPG, JPEG, etc.) to PNG
    // and ensure it meets OpenAI's requirements
    let processedBuffer;
    // Declare metadata variable outside the try block so it's accessible throughout the function
    let metadata;
    try {
      // Get image metadata to determine dimensions
      metadata = await sharp(buffer).metadata();
      
      // Process the image: convert to PNG, resize if needed, and optimize
      processedBuffer = await sharp(buffer)
        // Ensure the image has proper color space
        .toColorspace('srgb')
        // Resize if the image is too large (keeping aspect ratio)
        .resize({
          width: Math.min(metadata.width, 1024),
          height: Math.min(metadata.height, 1024),
          fit: 'inside',
          withoutEnlargement: true
        })
        // Convert to PNG format with appropriate settings
        .png({
          quality: 90,
          compressionLevel: 9,
          adaptiveFiltering: true,
          force: true
        })
        .toBuffer();
      
      // Verify the processed image size is under 4MB
      if (processedBuffer.length > 4 * 1024 * 1024) {
        // If still too large, compress more aggressively
        processedBuffer = await sharp(processedBuffer)
          .resize({
            width: Math.min(metadata.width, 768),
            height: Math.min(metadata.height, 768),
            fit: 'inside'
          })
          .png({ quality: 80, compressionLevel: 9 })
          .toBuffer();
      }
      
      // Get updated metadata after processing
      metadata = await sharp(processedBuffer).metadata();
      console.log('Processed image:', {
        format: metadata.format,
        width: metadata.width,
        height: metadata.height,
        size: `${(processedBuffer.length / 1024 / 1024).toFixed(2)}MB`
      });      
    } catch (err) {
      console.error('Error processing image with sharp:', err);
      return NextResponse.json(
        { error: 'Failed to process image: ' + err.message },
        { status: 500 }
      );
    }
    
    // Generate a unique ID for reference (not used for file storage)
    const uniqueId = uuidv4();
    
    // Create a mask image that is completely transparent (alpha=0) everywhere
    // This tells DALL-E to consider the entire image as editable
    const maskBuffer = await sharp({
      create: {
        width: metadata.width,
        height: metadata.height,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    })
    .png({
      force: true
    })
    .toBuffer();

    // Call OpenAI API to generate clean image
    console.log('Sending request to OpenAI API with prompt:', prompt);
    
    const openaiFormData = new FormData();
    
    // Add the processed image
    openaiFormData.append('image', new Blob([processedBuffer], { type: 'image/png' }), 'image.png');
    
    // Add the mask image
    openaiFormData.append('mask', new Blob([maskBuffer], { type: 'image/png' }), 'mask.png');
    
    // Add other parameters
    openaiFormData.append('prompt', prompt || 'Detect and remove all the plastic from this image.');
    openaiFormData.append('model', 'dall-e-2');
    openaiFormData.append('n', '1');
    openaiFormData.append('size', '1024x1024');
    
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
      requestId: uniqueId // Return the unique ID for reference instead of file paths
    });
  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json(
      { error: 'Failed to process image: ' + error.message },
      { status: 500 }
    );
  }
}