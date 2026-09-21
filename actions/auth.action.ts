'use server';

import { LoginFormValues } from '@/app/(auth)/auth/login/schema';
import { SignupPayload } from '@/app/(auth)/auth/signup/schema';
import { getToken } from '@/lib/getToken';
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
    return { success: false, message: 'Something went wrong. Please try again.' };
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
        credentials: 'include',
        cache: 'no-store',
      }
    );

    const data = await response.json();

    if (!data.success) {
      return data;
    }

    const cookieList = response.headers.getSetCookie();

    if (!!cookieList.length) {
      const cookieStore = await cookies();

      cookieList.forEach((cookie) => {
        const [nameValue] = cookie.split(';');

        const [name, value] = nameValue.trim().split('=');

        cookieStore.set(name.trim(), value.trim(), {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
        });
      });
    }
    return data;
  } catch (error) {
    console.error('loginAction error:', error);
    return { success: false, message: 'Something went wrong. Please try again.' };
  }
};

export const logoutAction = async () => {
  const accessToken = (await getToken()).accessToken;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/logout`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
        cache: 'no-store',
      }
    );

    const data = await response.json();

    // throw error if the response doesn't return success==>
    if (!data.success) {
      throw new Error(data.message);
    }
    const cookieStore = await cookies();
    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');
    return data;
  } catch (error) {
    throw error;
  }
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
