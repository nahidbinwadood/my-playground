import { singleBlogAction } from '@/actions/blog.action';
import { notFound } from 'next/navigation';
import EditBlogMainWrapper from './_components/edit-blog-main-wrapper';

// Thin route shell: fetch the post, hand it to the wrapper.
const UpdateBlogPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const response = await singleBlogAction(slug, { includeDrafts: true });

  if (!response?.data) {
    notFound();
  }

  return <EditBlogMainWrapper blogData={response.data} />;
};

export default UpdateBlogPage;
