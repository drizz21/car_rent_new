import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'cars.json');
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error('Cars data file not found at:', filePath);
      return NextResponse.json({ error: 'Cars data file not found' }, { status: 404 });
    }
    
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const cars = JSON.parse(fileContents);
    
    // Validate that we have an array
    if (!Array.isArray(cars)) {
      console.error('Invalid cars data format');
      return NextResponse.json({ error: 'Invalid cars data format' }, { status: 500 });
    }
    
    console.log(`Successfully loaded ${cars.length} cars from data file`);
    return NextResponse.json(cars);
  } catch (error) {
    console.error('Error reading cars data:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch cars data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}