import z from 'zod';

// Validated once at module load so a missing or malformed var fails loudly at
// startup instead of surfacing as `undefined/blogs` 404s deep in a request.
const envSchema = z.object({
  NEXT_PUBLIC_SERVER_URL: z.url(),
  NEXT_PUBLIC_SITE_URL: z.url().optional(),
});

// Each var is referenced literally: Next inlines `process.env.NEXT_PUBLIC_*`
// only when the full name appears in source, so `process.env[key]` or passing
// `process.env` whole would read undefined in client and edge bundles.
const parsed = envSchema.safeParse({
  NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
  // an empty string in .env means "unset", not an invalid URL
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || undefined,
});

if (!parsed.success) {
  const problems = parsed.error.issues
    .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
    .join('; ');
  throw new Error(`Invalid environment variables — ${problems}`);
}

export const env = parsed.data;
