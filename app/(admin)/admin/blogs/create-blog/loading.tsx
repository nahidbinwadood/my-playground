import BlogCreateUpdateSkeleton from '../_components/blog-create-update-skeleton';

// Route-level fallback while the category list loads for the picker. The create
// form owns its own header and sticky action bar, so this is the same skeleton
// the edit route shows — authoring looks identical whether you are writing a new
// post or revising one.
export default function Loading() {
  return <BlogCreateUpdateSkeleton />;
}
