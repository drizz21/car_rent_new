import { NextRequest, NextResponse } from 'next/server';

const API_URL = 'http://localhost:5000/cars';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const res = await fetch(`${API_URL}/${id}`);
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

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const formData = await req.formData();
    const res = await fetch(`http://localhost:5000/update-car/${id}`, {
      method: 'PUT',
      body: formData,
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json({ 
      success: false, 
      message: 'Gagal mengupdate mobil', 
      error: String(err) 
    }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json({ 
      success: false, 
      message: 'Gagal menghapus mobil', 
      error: String(err) 
    }, { status: 500 });
  }
}