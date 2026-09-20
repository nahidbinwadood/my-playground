import { NextRequest, NextResponse } from 'next/server';

// Prefix matching, not exact matching — an explicit list silently leaves nested
// routes (e.g. /admin/blogs/create-blog) unprotected. A route matches its own
// prefix or anything nested beneath it.
const protectedRoutes = ['/admin'];
const authRoutes = ['/auth/login', '/auth/signup'];

const matchesRoute = (pathname: string, routes: string[]) =>
  routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // check if this is the protected route or not==>

  const isProtectedRoute = matchesRoute(pathname, protectedRoutes);
  const isAuthRoute = matchesRoute(pathname, authRoutes);

  const accessToken = request.cookies.get('accessToken');

  // redirect to the homepage ==>
  if (isProtectedRoute && !accessToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // if the login user tries to access the auth page after login==>
  if (accessToken && isAuthRoute) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  // proceed==>
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
};
