import { getAllBlogs } from '@/actions/blog.action';
import { getAllCategoriesAction } from '@/actions/category.action';
import { ICategory } from '@/types';
import AdminBlogsMainWrapper from './_components/admin-blogs-main-wrapper';

export default async function BlogPage() {
  // the admin table manages drafts too — public listing stays published-only
  const response = await getAllBlogs({ includeDrafts: true });

  // The row shows the category's name and tone, but the blog only stores its id.
  // One list request joined locally beats populating on every call; a failure
  // degrades to "no category shown", which the cell already handles.
  let categories: ICategory[] = [];

  try {
    const categoryResponse = await getAllCategoriesAction();
    categories = categoryResponse.data ?? [];
  } catch {
    categories = [];
  }

  return (
    <AdminBlogsMainWrapper blogs={response?.data} categories={categories} />
  );
}
