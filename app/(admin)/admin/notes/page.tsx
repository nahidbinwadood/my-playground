import { getAllBlogs } from '@/actions/blog.action';
import { getAllCategoriesAction } from '@/actions/category.action';
import { getAllNotes } from '@/actions/note.action';
import { IBlog, INote, ICategory } from '@/types';
import { TBlogOption } from './types';
import NotesListMainWrapper from './_components/notes-list-main-wrapper';

// The notes index — every entry in one table, the same shape as /admin/blogs.
//
// Unlike the logging page, this fetches bodies: the view dialog renders a note's
// content and the edit dialog opens prefilled with it, so one request carrying
// `content` beats a round trip every time a row is opened.
const NotesPage = async () => {
  let notes: INote[] = [];
  let notesUnavailable = false;

  try {
    const response = await getAllNotes();
    notes = response.data ?? [];
  } catch {
    notesUnavailable = true;
  }

  let blogs: TBlogOption[] = [];
  let blogsUnavailable = false;

  try {
    // drafts included — a note can be attached to reference material that is
    // not published yet
    const response = await getAllBlogs({ includeDrafts: true });

    blogs = ((response.data ?? []) as IBlog[]).map((blog) => ({
      id: blog.id,
      title: blog.title,
      category: blog.category,
      slug: blog.slug,
    }));
  } catch {
    blogsUnavailable = true;
  }

  // The table's category column, the view dialog and the edit picker all need
  // the same list. A failure degrades to "no category shown", never a blank
  // table.
  let categories: ICategory[] = [];
  let categoriesUnavailable = false;

  try {
    const response = await getAllCategoriesAction();
    categories = response.data ?? [];
  } catch {
    categoriesUnavailable = true;
  }

  return (
    <NotesListMainWrapper
      notes={notes}
      blogs={blogs}
      categories={categories}
      notesUnavailable={notesUnavailable}
      blogsUnavailable={blogsUnavailable}
      categoriesUnavailable={categoriesUnavailable}
    />
  );
};

export default NotesPage;
