import BlogCreateUpdateSkeleton from '../../_components/blog-create-update-skeleton';

// Route-level fallback while the blog is fetched for editing. The skeleton is
// shared with /admin/blogs/create-blog, which shows the same authoring layout.
const Loading = () => {
  return <BlogCreateUpdateSkeleton />;
};

export default Loading;
