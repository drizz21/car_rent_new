import { NextRequest, NextResponse } from 'next/server';

const API_URL = 'http://localhost:5000/bookings';

export async function GET(req: NextRequest) {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json({ 
      success: false, 
      message: 'Gagal mengambil data booking', 
      error: String(err) 
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json({ 
      success: false, 
      message: 'Gagal menambah booking', 
      error: String(err) 
    }, { status: 500 });
  }
}