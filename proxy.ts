import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = ['/admin/dashboard', '/admin/blogs'];
const authRoutes = ['/auth/login', 'auth/signup'];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // check if this is the protected route or not==>

  const isProtectedRoute = protectedRoutes.includes(pathname);
  const isAuthRoute = authRoutes.includes(pathname);

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
