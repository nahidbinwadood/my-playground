import BlogCreateUpdateSkeleton from './_components/blog-create-update-skeleton';

// Route-level fallback while the blog is fetched for editing.
const Loading = () => {
  return <BlogCreateUpdateSkeleton />;
};

export default Loading;
