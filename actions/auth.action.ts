'use server';

import { LoginFormValues } from '@/app/(auth)/auth/login/schema';
import { SignupPayload } from '@/app/(auth)/auth/signup/schema';
import { ApiError, apiFetch, apiFetchOrNull } from '@/lib/api';
import { authCookieOptions, TAuthTokens } from '@/lib/auth-cookies';
import { IUser } from '@/types';
import { cookies } from 'next/headers';

// The auth forms branch on `response.success` and toast `response.message`,
// so these two catch at the boundary and return a result instead of throwing.
// The backend's message ("user already exists", validation failures…) is
// surfaced verbatim; only network/non-JSON failures get the generic text.
const toFailure = (error: unknown, fallback: string) => ({
  success: false as const,
  message: error instanceof ApiError ? error.message : fallback,
});

export const signupAction = async (payload: SignupPayload) => {
  try {
    return await apiFetch<unknown>('/auth/create', {
      method: 'POST',
      body: payload,
    });
  } catch (error) {
    console.error('signupAction error:', error);
    return toFailure(error, 'Something went wrong. Please try again.');
  }
};

export const loginAction = async (payload: LoginFormValues) => {
  try {
    const data = await apiFetch<{ tokens: TAuthTokens }>('/auth/login', {
      method: 'POST',
      body: payload,
    });

    // The backend returns the token pair in the body. Each cookie's maxAge
    // follows its JWT's own expiry, so the cookie dies with the token.
    const { tokens } = data.data;
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
    return toFailure(error, 'Something went wrong. Please try again.');
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

// null on any failure: the admin layout treats that as a dead session.
// NOTE: no cookie writes here — this is read during Server Component render
// (admin layout), where cookie mutation is forbidden.
export const getProfileAction = async () => {
  try {
    return await apiFetchOrNull<IUser>('/auth/me', { auth: true });
  } catch {
    return null;
  }
};
