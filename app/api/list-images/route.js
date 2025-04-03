import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Get the path to the raw images directory
    const rawDirPath = path.join(process.cwd(), 'public', 'assets', 'raw');
    
    // Read the directory
    const files = fs.readdirSync(rawDirPath);
    
    // Filter for image files (jpg, jpeg, png)
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png'].includes(ext);
    });
    
    // Randomly shuffle the array of image files
    const shuffledImages = [...imageFiles].sort(() => Math.random() - 0.5);
    
    // Take the first 4 images after shuffling and map them to numbers 1-4
    const randomNumberedFiles = shuffledImages.slice(0, 4).map((file, index) => `image-${index + 1}${path.extname(file)}`);
    
    return NextResponse.json({
      images: randomNumberedFiles
    });
  } catch (error) {
    console.error('Error reading images directory:', error);
    return NextResponse.json(
      { error: 'Failed to read images directory' },
      { status: 500 }
    );
  }
}