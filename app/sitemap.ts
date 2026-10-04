import { getAllBlogs } from '@/actions/blog.action';
import { getCompleteNotes } from '@/actions/note.action';
import { SITE_URL } from '@/lib/site';
import { MetadataRoute } from 'next';

export const revalidate = 3600;

// Public pages only: published blogs and COMPLETE notes. The admin and auth
// routes are kept out here and disallowed in robots.ts.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogs, notes] = await Promise.all([
    getAllBlogs()
      .then((res) => res?.data ?? [])
      .catch(() => []),
    getCompleteNotes()
      .then((res) => res?.data ?? [])
      .catch(() => []),
  ]);

  const staticPages = [
    '',
    '/blogs',
    '/notes',
    '/components',
    '/form-playground',
  ];

  return [
    ...staticPages.map((path) => ({ url: `${SITE_URL}${path}` })),
    ...blogs.map((blog) => ({
      url: `${SITE_URL}/blogs/${blog.slug}`,
      lastModified: blog.updatedAt,
    })),
    ...notes.map((note) => ({
      url: `${SITE_URL}/notes/${note.id}`,
      lastModified: note.updatedAt,
    })),
  ];
}
