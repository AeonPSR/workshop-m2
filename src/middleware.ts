import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if the request is for staff pages
  if (request.nextUrl.pathname.startsWith('/staff')) {
    // Allow access to the login page
    if (request.nextUrl.pathname === '/staff/login') {
      return NextResponse.next();
    }

    // Check for auth cookie
    const authCookie = request.cookies.get('staff_auth');
    
    if (!authCookie || authCookie.value !== 'authenticated') {
      // Redirect to login page
      const loginUrl = new URL('/staff/login', request.url);
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/staff/:path*',
};
