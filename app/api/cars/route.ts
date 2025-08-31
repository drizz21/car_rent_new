import { NextRequest, NextResponse } from 'next/server';

const API_URL = 'http://localhost:5000/cars';

export async function GET(req: NextRequest) {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
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