import { getAllBlogs } from '@/actions/blog.action';
import AllBlogsMainWrapper from './_components/all-blogs-main-wrapper';

const page = async () => {
  const response = await getAllBlogs({ enableCache: true });
  return <AllBlogsMainWrapper blogs={response?.data} />;
};

export default page;
