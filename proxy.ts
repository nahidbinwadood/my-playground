import { NextRequest, NextResponse } from 'next/server';
import {
  authCookieOptions,
  decodeJwt,
  refreshAuthTokens,
  secondsLeft,
  TAuthTokens,
} from '@/lib/auth-cookies';

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

  const isProtectedRoute = matchesRoute(pathname, protectedRoutes);
  const isAuthRoute = matchesRoute(pathname, authRoutes);

  // public pages never touch the session
  if (!isProtectedRoute && !isAuthRoute) {
    return NextResponse.next();
  }

  let accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  // An expired access token is swapped for a fresh pair here, before any page
  // or server action runs — so nothing downstream ever sees a dead token.
  let fresh: TAuthTokens | null = null;
  if (!secondsLeft(accessToken) && refreshToken) {
    fresh = await refreshAuthTokens(refreshToken);
    accessToken = fresh?.accessToken;
  }

  const signedIn = secondsLeft(accessToken) > 0;
  // unverified read, UX only — the backend still checks the role on every call
  const isAdmin = decodeJwt(accessToken)?.role === 'admin';

  let response: NextResponse;

  if (isProtectedRoute && !signedIn) {
    response = NextResponse.redirect(new URL('/auth/login', request.url));
  } else if (isProtectedRoute && !isAdmin) {
    response = NextResponse.redirect(new URL('/', request.url));
  } else if (isAuthRoute && signedIn && isAdmin) {
    response = NextResponse.redirect(new URL('/admin/dashboard', request.url));
  } else {
    // hand the refreshed tokens to this same request's server code too
    if (fresh) {
      request.cookies.set('accessToken', fresh.accessToken);
      request.cookies.set('refreshToken', fresh.refreshToken);
    }
    response = NextResponse.next({ request: { headers: request.headers } });
  }

  if (fresh) {
    response.cookies.set(
      'accessToken',
      fresh.accessToken,
      authCookieOptions(fresh.accessToken)
    );
    response.cookies.set(
      'refreshToken',
      fresh.refreshToken,
      authCookieOptions(fresh.refreshToken)
    );
  } else if (!signedIn) {
    // dead session: drop the leftovers so the browser stops sending them
    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken');
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
};
