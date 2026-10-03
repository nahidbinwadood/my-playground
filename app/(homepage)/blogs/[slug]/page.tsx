import { getAllBlogs, singleBlogAction } from '@/actions/blog.action';
import { getAllCategoriesAction } from '@/actions/category.action';
import { ICategory } from '@/types';
import BlogDetailsMainWrapper from './_components/blog-details-main-wrapper';

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const res = await getAllBlogs();
    const blogs = res?.data ?? [];
    return blogs.map((b) => ({ slug: b.slug }));
  } catch {
    return [];
  }
}

const page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;

  const response = await singleBlogAction(slug);

  // resolve the post's category to its name and tone — the details page shows
  // nothing rather than a bare id when the list cannot be loaded
  let category: ICategory | undefined;

  try {
    const categoryResponse = await getAllCategoriesAction();
    category = (categoryResponse.data ?? []).find(
      (item) => item.id === response?.data?.category
    );
  } catch {
    category = undefined;
  }

  return (
    <BlogDetailsMainWrapper blog={response?.data} category={category} />
  );
};

export default page;
