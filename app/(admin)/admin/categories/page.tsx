import { getAllCategoriesAction } from '@/actions/category.action';
import { ICategory } from '@/types';
import CategoriesMainWrapper from './_components/categories-main-wrapper';

// The category list is a public read at the API level (the public blog pages and
// every picker need it), so this page uses the unauthenticated action — and it
// still degrades instead of putting the page down when the API is away.
const CategoriesPage = async () => {
  let categories: ICategory[] = [];
  let unavailable = false;

  try {
    const response = await getAllCategoriesAction();
    categories = response.data ?? [];
  } catch {
    unavailable = true;
  }

  return (
    <CategoriesMainWrapper categories={categories} unavailable={unavailable} />
  );
};

export default CategoriesPage;
