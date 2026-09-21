import CategoriesSkeleton from './_components/categories-skeleton';

// Route-level fallback so navigating in and refreshing in place look identical.
export default function Loading() {
  return <CategoriesSkeleton />;
}
