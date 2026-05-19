import { Fragment } from 'react';
import AdminBlogsMainWrapper from './_components/admin-blogs-main-wrapper';
import { getAllBlogs } from '@/actions/blog.action';

export default async function BlogPage() {
  const response = await getAllBlogs({});
  return (
    <Fragment>
      <AdminBlogsMainWrapper blogs={response?.data} />
    </Fragment>
  );
}
