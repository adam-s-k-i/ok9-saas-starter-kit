import { NextResponse } from 'next/server';

// Authentication middleware for protecting routes
export default async function middleware(request: Request) {
  const { pathname } = new URL(request.url);

  // Public routes that don't require authentication
  const publicPaths = [
    '/',
    '/auth/signin',
    '/api/auth',
    '/_next',
    '/favicon.ico'
  ];

  // Check if current path is public
  const isPublicPath = publicPaths.some(path =>
    pathname === path || pathname.startsWith(path + '/')) ||
    pathname.match(/\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)$/);

  if (isPublicPath) {
    return NextResponse.next();
  }

  // For now, we'll rely on client-side guards for authentication
  // In production, you might want to implement proper JWT verification here
  // This is a simplified version that redirects to signin for any protected route
  const signInUrl = new URL('/auth/signin', request.url);
  signInUrl.searchParams.set('callbackUrl', encodeURI(request.url));
  return NextResponse.redirect(signInUrl);
}

export const config = {
  matcher: [
    // Match all routes except static files and public paths
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  ],
};