'use server';

import { LoginFormValues } from '@/app/(auth)/auth/login/schema';
import { cookies } from 'next/headers';

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
      throw new Error(data.message);
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
    throw error;
  }
};

export const logoutAction = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken');

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/logout`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken?.value}`,
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

    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');
    return data;
  } catch (error) {
    throw error;
  }
};
