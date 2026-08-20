import CreateBlogForm from './create-blog-form';

// The form renders its own page header and sticky action bar, so no PageHeader
// is added here — it would duplicate the one inside the form.
const CreateBlogMainWrapper = () => {
  return <CreateBlogForm />;
};

export default CreateBlogMainWrapper;
