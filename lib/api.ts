import { getCacheFetchOptions } from '@/lib/cache-fetch';
import { env } from '@/lib/env';
import { getToken } from '@/lib/getToken';

// The envelope every backend endpoint replies with.
export type TApiResponse<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
};

type TApiFetchOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  // FormData is sent as-is; anything else is JSON-encoded
  body?: unknown;
  // Only `auth: true` reads cookies. Public reads must never do so: touching
  // cookies() makes the calling page dynamic and cancels its ISR.
  auth?: boolean;
  // Omitted = no-store (writes, per-request reads). An object = Data Cache with
  // ISR under that tag, so a write's updateTag() expires it.
  cache?: { tag: string; revalidateSeconds?: number } | 'no-store';
  headers?: Record<string, string>;
};

// Error policy — one rule for every action:
// - `apiFetch` resolves with the envelope only when `success` is true and
//   throws `ApiError(message)` otherwise. The backend flattens Zod/Mongo errors
//   into `message`, so it is the most useful thing to surface.
// - `apiFetchOrNull` is for reads where "not there" is a normal answer (a
//   missing slug, a dead session): `success: false` resolves to null.
// - Both throw on network failure or a non-JSON reply (gateway/5xx HTML
//   pages), with the HTTP status in the message, rather than letting
//   JSON.parse crash a page render with a SyntaxError.
// Actions whose UI expects a `{ success, message }` result instead of a throw
// (login, signup) catch at the action boundary.
// An Error subclass so callers can tell "the backend said no" (message is
// user-facing) apart from network/parse failures (message is not).
export class ApiError extends Error {
  constructor(
    message: string,
    readonly statusCode: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const request = async <T>(
  path: string,
  { method = 'GET', body, auth = false, cache, headers = {} }: TApiFetchOptions
): Promise<TApiResponse<T>> => {
  const isFormData = body instanceof FormData;

  const finalHeaders: Record<string, string> = { ...headers };
  // FormData gets no Content-Type: fetch must set the multipart boundary.
  if (body !== undefined && !isFormData) {
    finalHeaders['Content-Type'] = 'application/json';
  }
  if (auth) {
    finalHeaders.Authorization = `Bearer ${(await getToken()).accessToken}`;
  }

  // The Authorization header is part of the Data Cache key, so an
  // authenticated cached read can never be served to a signed-out visitor.
  const cacheInit: RequestInit =
    cache && cache !== 'no-store'
      ? await getCacheFetchOptions({
          tag: cache.tag,
          revalidateSeconds: cache.revalidateSeconds,
        })
      : { cache: 'no-store' };

  const response = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}${path}`, {
    ...cacheInit,
    method,
    headers: finalHeaders,
    body:
      body === undefined
        ? undefined
        : isFormData
          ? (body as FormData)
          : JSON.stringify(body),
  });

  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.toLowerCase().includes('application/json')) {
    throw new Error(
      `API ${method} ${path} → ${response.status} ${response.statusText}: expected a JSON response`
    );
  }

  return (await response.json()) as TApiResponse<T>;
};

export const apiFetch = async <T>(
  path: string,
  options: TApiFetchOptions = {}
): Promise<TApiResponse<T>> => {
  const data = await request<T>(path, options);

  if (!data.success) {
    throw new ApiError(data.message, data.statusCode);
  }

  return data;
};

export const apiFetchOrNull = async <T>(
  path: string,
  options: TApiFetchOptions = {}
): Promise<TApiResponse<T> | null> => {
  const data = await request<T>(path, options);

  return data.success ? data : null;
};
