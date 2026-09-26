import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    // In dev, Next keeps a second cache for Server Component fetches across HMR —
    // separate from the data cache, and applied even to requests that ask not to
    // be cached. A tag invalidation cannot clear it, so a just-deleted blog can
    // still come back while developing. Off, so dev behaves like production.
    serverComponentsHmrCache: false,
  },
  images: {
    remotePatterns: [new URL('https://res.cloudinary.com/**'),new URL('https://images.unsplash.com/**')],
  },
};

export default nextConfig;
