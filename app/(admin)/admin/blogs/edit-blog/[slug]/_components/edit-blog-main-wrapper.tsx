import { getAllCategoriesAction } from '@/actions/category.action';
import { IBlog, ICategory } from '@/types';
import CreateBlogForm from '../../../create-blog/_components/create-blog-form';

// Same authoring form as /create-blog; passing blogData switches it to edit
// mode (breadcrumb, heading and submit label all follow from that). Categories
// are fetched here as well so the picker stays prefilled with the post's own
// category while offering every other option.
const EditBlogMainWrapper = async ({ blogData }: { blogData: IBlog }) => {
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
      blogData={blogData}
      categories={categories}
      categoriesUnavailable={categoriesUnavailable}
    />
  );
};

export default EditBlogMainWrapper;
