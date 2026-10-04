import { NextRequest, NextResponse } from 'next/server';
import {
  authCookieOptions,
  decodeJwt,
  secondsLeft,
  TAuthTokens,
} from '@/lib/auth-cookies';
import { env } from '@/lib/env';

// Prefix matching, not exact matching — an explicit list silently leaves nested
// routes (e.g. /admin/blogs/create-blog) unprotected. A route matches its own
// prefix or anything nested beneath it.
const protectedRoutes = ['/admin'];
const authRoutes = ['/auth/login', '/auth/signup'];

const matchesRoute = (pathname: string, routes: string[]) =>
  routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

// Trades a refresh token for a fresh pair. The backend reads the refresh token
// from its cookie, so it is forwarded as a Cookie header. null = log in again.
const refreshAuthTokens = async (
  refreshToken: string
): Promise<TAuthTokens | null> => {
  try {
    const response = await fetch(
      `${env.NEXT_PUBLIC_SERVER_URL}/auth/refresh-token`,
      {
        method: 'POST',
        headers: { Cookie: `refreshToken=${refreshToken}` },
        cache: 'no-store',
      }
    );
    const data = await response.json();
    return data?.success ? (data.data as TAuthTokens) : null;
  } catch {
    return null;
  }
};

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
