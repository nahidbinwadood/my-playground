import { singleBlogAction } from '@/actions/blog.action';
import BlogDetailsMainWrapper from './_components/blog-details-main-wrapper';

const page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;

  const response = await singleBlogAction(slug, true);

  return <BlogDetailsMainWrapper blog={response?.data} />;
};

export default page;
