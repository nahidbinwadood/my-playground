import { getAllBlogs } from '@/actions/blog.action';
import { getAllCategoriesAction } from '@/actions/category.action';
import { ICategory } from '@/types';
import AllBlogsMainWrapper from './_components/all-blogs-main-wrapper';

const page = async () => {
  const response = await getAllBlogs({ enableCache: true });

  // The cards show the category's name and tone; posts store only the id. One
  // public list request, joined locally — the endpoint is unguarded, so this
  // works for signed-out visitors too.
  let categories: ICategory[] = [];

  try {
    const categoryResponse = await getAllCategoriesAction();
    categories = categoryResponse.data ?? [];
  } catch {
    categories = [];
  }

  return (
    <AllBlogsMainWrapper blogs={response?.data} categories={categories} />
  );
};

export default page;
