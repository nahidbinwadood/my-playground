// Auth cookie helpers shared by the login action and the proxy (edge-safe: no
// node APIs). The cookies mirror the JWTs' own lifetimes, so a cookie never
// outlives the token inside it.

export type TAuthTokens = { accessToken: string; refreshToken: string };

type TJwtPayload = { exp?: number; role?: string; email?: string };

// Reads the payload WITHOUT verifying the signature. Only for UX decisions
// (is it expired, which role) — the backend verifies on every request.
export const decodeJwt = (token?: string): TJwtPayload | null => {
  try {
    const part = token?.split('.')[1];
    if (!part) return null;
    const base64 = part.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
};

// Seconds left on a token; 0 when expired or unreadable. A 30s margin keeps a
// token from expiring between the check and the backend call.
export const secondsLeft = (token?: string) => {
  const exp = decodeJwt(token)?.exp;
  if (!exp) return 0;
  return Math.max(0, exp - Math.floor(Date.now() / 1000) - 30);
};

export const authCookieOptions = (token: string) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: secondsLeft(token),
});

// Trades a refresh token for a fresh pair. The backend reads the refresh token
// from its cookie, so it is forwarded as a Cookie header. null = log in again.
export const refreshAuthTokens = async (
  refreshToken: string
): Promise<TAuthTokens | null> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/refresh-token`,
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
