'use server';

import { LoginFormValues } from '@/app/(auth)/auth/login/schema';
import { SignupPayload } from '@/app/(auth)/auth/signup/schema';
import { getToken } from '@/lib/getToken';
import { authCookieOptions, TAuthTokens } from '@/lib/auth-cookies';
import { cookies } from 'next/headers';

export const signupAction = async (payload: SignupPayload) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/create`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        cache: 'no-store',
      }
    );

    const data = await response.json();

    // surface the backend's message ("user already exists", validation
    // failures…) instead of a generic one
    return data;
  } catch (error) {
    console.error('signupAction error:', error);
    return {
      success: false,
      message: 'Something went wrong. Please try again.',
    };
  }
};

export const loginAction = async (payload: LoginFormValues) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        cache: 'no-store',
      }
    );

    const data = await response.json();

    if (!data.success) {
      return { success: false, message: data.message };
    }

    // The backend returns the token pair in the body. Each cookie's maxAge
    // follows its JWT's own expiry, so the cookie dies with the token.
    const tokens = data.data?.tokens as TAuthTokens;
    const cookieStore = await cookies();
    cookieStore.set(
      'accessToken',
      tokens.accessToken,
      authCookieOptions(tokens.accessToken)
    );
    cookieStore.set(
      'refreshToken',
      tokens.refreshToken,
      authCookieOptions(tokens.refreshToken)
    );

    // never hand the tokens to the browser — that is what httpOnly is for
    return { success: true, message: data.message };
  } catch (error) {
    console.error('loginAction error:', error);
    return {
      success: false,
      message: 'Something went wrong. Please try again.',
    };
  }
};

// Logout is purely local: the backend keeps no session, so clearing the two
// cookies is the whole job. No backend call means an expired token can never
// make logout fail.
export const logoutAction = async () => {
  const cookieStore = await cookies();
  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');
  return { success: true, message: 'Your session ended.' };
};

export const getProfileAction = async () => {
  const accessToken = (await getToken()).accessToken;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/me`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
        cache: 'no-store',
      }
    );

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message);
    }

    return data;
    // NOTE: no cookie writes here — this is read during Server Component
    // render (admin layout), where cookie mutation is forbidden
  } catch {
    return null;
  }
};
