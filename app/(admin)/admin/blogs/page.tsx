import { getAllBlogs } from '@/actions/blog.action';
import AdminBlogsMainWrapper from './_components/admin-blogs-main-wrapper';

export default async function BlogPage() {
  const response = await getAllBlogs({});
  return <AdminBlogsMainWrapper blogs={response?.data} />;
}
