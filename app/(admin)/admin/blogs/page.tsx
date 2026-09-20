import { getAllBlogs } from '@/actions/blog.action';
import AdminBlogsMainWrapper from './_components/admin-blogs-main-wrapper';

export default async function BlogPage() {
  // the admin table manages drafts too — public listing stays published-only
  const response = await getAllBlogs({ includeDrafts: true });
  return <AdminBlogsMainWrapper blogs={response?.data} />;
}
