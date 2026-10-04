import { getAllBlogs, singleBlogAction } from '@/actions/blog.action';
import { getAllCategoriesAction } from '@/actions/category.action';
import { ICategory } from '@/types';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogDetailsMainWrapper from './_components/blog-details-main-wrapper';

export const revalidate = 3600;
export const dynamicParams = true;

type TParams = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  try {
    const res = await getAllBlogs();
    const blogs = res?.data ?? [];
    return blogs.map((b) => ({ slug: b.slug }));
  } catch {
    return [];
  }
}

// per-post title, description and social card; shares the fetch with the page
// through the data cache
export async function generateMetadata({ params }: TParams): Promise<Metadata> {
  const { slug } = await params;
  const blog = (await singleBlogAction(slug))?.data;

  if (!blog) {
    return { title: 'Post not found — DevPlayground' };
  }

  return {
    title: `${blog.title} — DevPlayground`,
    description: blog.excerpt,
    alternates: { canonical: `/blogs/${blog.slug}` },
    openGraph: {
      type: 'article',
      title: blog.title,
      description: blog.excerpt,
      publishedTime: blog.createdAt,
      images: blog.coverImage ? [blog.coverImage] : undefined,
    },
  };
}

const page = async ({ params }: TParams) => {
  const { slug } = await params;

  const response = await singleBlogAction(slug);

  // unknown slug or unpublished post: a real 404, not a crashed page
  if (!response?.data) {
    notFound();
  }

  // resolve the post's category to its name and tone — the details page shows
  // nothing rather than a bare id when the list cannot be loaded
  let category: ICategory | undefined;

  try {
    const categoryResponse = await getAllCategoriesAction();
    category = (categoryResponse.data ?? []).find(
      (item) => item.id === response.data.category
    );
  } catch {
    category = undefined;
  }

  return <BlogDetailsMainWrapper blog={response.data} category={category} />;
};

export default page;
