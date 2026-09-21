import CreateNoteMainWrapper from './_components/create-note-main-wrapper';

// Thin route shell. The wrapper loads the blog list and the form owns the
// layout — same shape as /admin/blogs/create-blog.
const CreateNotePage = () => {
  return <CreateNoteMainWrapper />;
};

export default CreateNotePage;
