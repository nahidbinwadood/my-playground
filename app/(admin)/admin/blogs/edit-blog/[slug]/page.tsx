import { Fragment } from 'react';
import EditBlogMainWrapper from './_components/edit-blog-main-wrapper';
import { singleBlogAction } from '@/actions/blog.action';

const UpdateBlogPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const response = await singleBlogAction(slug);

  return (
    <Fragment>
      <EditBlogMainWrapper blogData={response?.data} />
    </Fragment>
  );
};

export default UpdateBlogPage;
