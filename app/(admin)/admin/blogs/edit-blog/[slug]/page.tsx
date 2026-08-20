import { singleBlogAction } from '@/actions/blog.action';
import EditBlogMainWrapper from './_components/edit-blog-main-wrapper';

// Thin route shell: fetch the post, hand it to the wrapper.
const UpdateBlogPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const response = await singleBlogAction(slug);

  return <EditBlogMainWrapper blogData={response?.data} />;
};

export default UpdateBlogPage;
