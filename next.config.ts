import type { NextConfig } from 'next';

// Applied to every route. Content-Security-Policy is deliberately limited to
// `frame-ancestors`: a full script/style CSP would block Next's inline
// bootstrap and hydration scripts unless every request carried a nonce, which
// would force all pages dynamic. Clickjacking protection is the part we need.
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  { key: 'Content-Security-Policy', value: "frame-ancestors 'none'" },
];

const nextConfig: NextConfig = {
  experimental: {
    // In dev, Next keeps a second cache for Server Component fetches across HMR —
    // separate from the data cache, and applied even to requests that ask not to
    // be cached. A tag invalidation cannot clear it, so a just-deleted blog can
    // still come back while developing. Off, so dev behaves like production.
    serverComponentsHmrCache: false,
  },
  images: {
    remotePatterns: [
      new URL('https://res.cloudinary.com/**'),
      new URL('https://images.unsplash.com/**'),
    ],
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;
