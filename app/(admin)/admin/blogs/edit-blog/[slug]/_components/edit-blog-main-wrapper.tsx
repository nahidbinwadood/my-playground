import CreateBlogForm from '../../../create-blog/_components/create-blog-form';
import { IBlog } from '@/types';

// The form renders its own sticky header (title + actions), so no PageHeader here.
const EditBlogMainWrapper = ({ blogData }: { blogData: IBlog }) => {
  return <CreateBlogForm blogData={blogData} />;
};

export default EditBlogMainWrapper;
