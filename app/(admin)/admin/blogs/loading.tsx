import AdminBlogsSkeleton from './_components/admin-blogs-skeleton';

// Route-level fallback: renders the same skeleton the client wrapper uses, so
// navigating in and refreshing in place look identical.
export default function Loading() {
  return <AdminBlogsSkeleton />;
}
