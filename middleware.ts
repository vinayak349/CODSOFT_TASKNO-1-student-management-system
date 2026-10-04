import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'edumanage_production_jwt_secret_key_2026_super_secure'
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('edumanage_session')?.value;

  let sessionPayload: { role: 'ADMIN' | 'TEACHER' | 'STUDENT'; userId: string } | null = null;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      sessionPayload = payload as unknown as { role: 'ADMIN' | 'TEACHER' | 'STUDENT'; userId: string };
    } catch (e) {
      sessionPayload = null;
    }
  }

  // 1. If accessing login page while authenticated, redirect to role dashboard
  if (pathname === '/login' || pathname === '/') {
    if (sessionPayload) {
      if (sessionPayload.role === 'ADMIN') return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      if (sessionPayload.role === 'TEACHER') return NextResponse.redirect(new URL('/teacher/dashboard', request.url));
      if (sessionPayload.role === 'STUDENT') return NextResponse.redirect(new URL('/student/dashboard', request.url));
    }
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // 2. Protected routes validation
  if (pathname.startsWith('/admin')) {
    if (!sessionPayload) {
      return NextResponse.redirect(new URL('/login?error=Unauthorized', request.url));
    }
    if (sessionPayload.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login?error=Forbidden', request.url));
    }
  }

  if (pathname.startsWith('/teacher')) {
    if (!sessionPayload) {
      return NextResponse.redirect(new URL('/login?error=Unauthorized', request.url));
    }
    if (sessionPayload.role !== 'TEACHER' && sessionPayload.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login?error=Forbidden', request.url));
    }
  }

  if (pathname.startsWith('/student')) {
    if (!sessionPayload) {
      return NextResponse.redirect(new URL('/login?error=Unauthorized', request.url));
    }
    if (sessionPayload.role !== 'STUDENT' && sessionPayload.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login?error=Forbidden', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/admin/:path*', '/teacher/:path*', '/student/:path*'],
};
