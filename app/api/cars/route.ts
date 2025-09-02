import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const API_URL = 'http://localhost:5000/cars';

export async function GET(req: NextRequest) {
  try {
    // Coba ambil data dari backend server terlebih dahulu
    const res = await fetch(API_URL);
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    }
  } catch (err) {
    console.log('Backend server tidak tersedia, menggunakan data lokal');
  }

  // Fallback ke data lokal jika backend tidak tersedia
  try {
    const filePath = path.join(process.cwd(), 'data', 'cars.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const carsData = JSON.parse(fileContents);
    
    return NextResponse.json(carsData, { status: 200 });
  } catch (err) {
    return NextResponse.json({ 
      success: false, 
      message: 'Gagal mengambil data mobil', 
      error: String(err) 
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const res = await fetch('http://localhost:5000/add-car', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json({ 
      success: false, 
      message: 'Gagal menambah mobil', 
      error: String(err) 
    }, { status: 500 });
  }
}