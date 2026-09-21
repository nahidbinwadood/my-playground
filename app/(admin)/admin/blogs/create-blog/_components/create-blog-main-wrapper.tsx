import { getAllCategoriesAction } from '@/actions/category.action';
import { ICategory } from '@/types';
import CreateBlogForm from './create-blog-form';

// The form renders its own page header and sticky action bar, so no PageHeader
// is added here — it would duplicate the one inside the form.
//
// Categories come from the public list endpoint. A failure must not take the
// authoring page down; the select just has nothing to offer and says so.
const CreateBlogMainWrapper = async () => {
  let categories: ICategory[] = [];
  let categoriesUnavailable = false;

  try {
    const response = await getAllCategoriesAction();
    categories = response.data ?? [];
  } catch {
    categoriesUnavailable = true;
  }

  return (
    <CreateBlogForm
      categories={categories}
      categoriesUnavailable={categoriesUnavailable}
    />
  );
};

export default CreateBlogMainWrapper;
