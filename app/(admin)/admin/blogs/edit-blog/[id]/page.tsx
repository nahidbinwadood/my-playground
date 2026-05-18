import { Fragment } from 'react';
import EditBlogMainWrapper from './_components/edit-blog-main-wrapper';
import { singleBlogAction } from '@/actions/blog.action';

const UpdateBlogPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const response = await singleBlogAction(id);

  return (
    <Fragment>
      <EditBlogMainWrapper blogData={response?.data} />
    </Fragment>
  );
};

export default UpdateBlogPage;
