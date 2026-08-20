import { IBlog } from '@/types';
import CreateBlogForm from '../../../create-blog/_components/create-blog-form';

// Same authoring form as /create-blog; passing blogData switches it to edit
// mode (breadcrumb, heading and submit label all follow from that).
const EditBlogMainWrapper = ({ blogData }: { blogData: IBlog }) => {
  return <CreateBlogForm blogData={blogData} />;
};

export default EditBlogMainWrapper;
