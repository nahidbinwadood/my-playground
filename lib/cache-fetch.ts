import { headers } from 'next/headers';

/**
 * Checks whether the current incoming request is a client hard-reload
 * (e.g., Ctrl+F5 or Cmd+Shift+R, which sends Cache-Control: no-cache or Pragma: no-cache).
 */
export const isHardReloadRequest = async (): Promise<boolean> => {
  try {
    const h = await headers();
    const cacheControl = h.get('cache-control') ?? '';
    const pragma = h.get('pragma') ?? '';
    return (
      cacheControl.toLowerCase().includes('no-cache') ||
      pragma.toLowerCase().includes('no-cache')
    );
  } catch {
    return false;
  }
};

/**
 * Generates Next.js fetch cache configuration:
 * - If hard reload is detected: bypasses the cache with { cache: 'no-store' } to query the live API.
 * - Under normal requests: serves from Next.js Data Cache with 1-hour ISR (3600s) and cache tags.
 */
export const getCacheFetchOptions = async ({
  tag,
  revalidateSeconds = 3600,
  extraHeaders = {},
}: {
  tag?: string;
  revalidateSeconds?: number;
  extraHeaders?: Record<string, string>;
}): Promise<RequestInit> => {
  const isHardReload = await isHardReloadRequest();

  if (isHardReload) {
    return {
      headers: {
        ...extraHeaders,
      },
      cache: 'no-store',
    };
  }

  return {
    headers: {
      ...extraHeaders,
    },
    cache: 'force-cache',
    next: {
      revalidate: revalidateSeconds,
      ...(tag ? { tags: [tag] } : {}),
    },
  };
};
