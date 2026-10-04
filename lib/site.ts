// Canonical origin for metadata, sitemap and robots. Set NEXT_PUBLIC_SITE_URL
// on the host if the domain changes; the fallback is the current deployment.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://my-playground-sooty.vercel.app'
).replace(/\/$/, '');
