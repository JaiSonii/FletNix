import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // If user is on login page but has token, redirect to home
  if (pathname.startsWith('/login') && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If user is on protected routes but has no token, redirect to login
  if (!pathname.startsWith('/login') && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// Apply to all routes except static files
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};