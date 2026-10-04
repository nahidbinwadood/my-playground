/**
 * Next.js fetch cache configuration: Data Cache with ISR and cache tags.
 *
 * Freshness comes from the tags — every write calls `updateTag()`, so readers
 * see changes on the next request. No request-header sniffing here: reading
 * `headers()` would force every page that fetches through this helper into
 * dynamic rendering and cancel its `revalidate`.
 */
export const getCacheFetchOptions = async ({
  tag,
  revalidateSeconds = 3600,
  extraHeaders = {},
}: {
  tag?: string;
  revalidateSeconds?: number;
  extraHeaders?: Record<string, string>;
}): Promise<RequestInit> => ({
  headers: { ...extraHeaders },
  cache: 'force-cache',
  next: {
    revalidate: revalidateSeconds,
    ...(tag ? { tags: [tag] } : {}),
  },
});
