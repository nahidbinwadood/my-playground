// Lives in a (list) route group so this skeleton wraps /blogs only. Wrapping
// /blogs/[slug] too would stream that page and turn notFound() into a 200.
import BlogSkeleton from '../_components/blog-skeleton';

const Loading = () => {
  return <BlogSkeleton />;
};

export default Loading;
