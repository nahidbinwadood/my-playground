import { singleBlogAction } from '@/actions/blog.action';
import BlogDetailsMainWrapper from './_components/blog-details-main-wrapper';
import { Fragment } from 'react';

const page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;

  const response = await singleBlogAction(slug, true);

  return (
    <Fragment>
      <BlogDetailsMainWrapper blog={response?.data} />
    </Fragment>
  );
};

export default page;
