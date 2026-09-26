import CreateNoteMainWrapper from './_components/create-note-main-wrapper';

// Thin route shell. The wrapper loads the blog list, owns the page header and
// splits the form and the timeline into two columns — same shape as
// /admin/blogs/create-blog.
const CreateNotePage = () => {
  return <CreateNoteMainWrapper />;
};

export default CreateNotePage;
