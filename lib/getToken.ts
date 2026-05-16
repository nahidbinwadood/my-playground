'use server';

import { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { cookies } from 'next/headers';

export const getToken = async (): Promise<{
  accessToken: string | undefined;
  refreshToken: string | undefined;
}> => {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('accessToken')?.value;

  return {
    accessToken,
    refreshToken,
  };
};
