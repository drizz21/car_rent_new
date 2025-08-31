import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Cek apakah request ke admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Skip login page
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }

    // Cek token admin dari cookies atau headers
    const adminToken = request.cookies.get('adminToken')?.value || 
                      request.headers.get('authorization')?.replace('Bearer ', '');

    // Jika tidak ada token, redirect ke login
    if (!adminToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Validasi token (dalam implementasi nyata, validasi dengan backend)
    // Untuk sementara, terima semua token yang dimulai dengan 'admin-token-'
    if (!adminToken.startsWith('admin-token-')) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
}; 