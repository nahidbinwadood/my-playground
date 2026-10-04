// Canonical origin for metadata, sitemap and robots. Set NEXT_PUBLIC_SITE_URL
// on the host if the domain changes; the fallback is the current deployment.
import { env } from '@/lib/env';

export const SITE_URL = (
  env.NEXT_PUBLIC_SITE_URL ?? 'https://my-playground-sooty.vercel.app'
).replace(/\/$/, '');
