import { getAllBlogs } from '@/actions/blog.action';
import { getAllNotes } from '@/actions/note.action';
import { IBlog, INote } from '@/types';
import { TBlogOption } from '../types';
import NotesTimeline from './notes-timeline';
import QuickNoteForm from './quick-note-form';

// Loads the data both surfaces need: the blog list for the picker (and the
// timeline's backlinks), the notes for the feed. A failure in either must not
// take the page down — a standalone note is still a valid entry, and losing
// the whole page would be the worst possible outcome for a daily logging
// surface. The feed degrades to its own unavailable state instead.
const NotesMainWrapper = async () => {
  let blogs: TBlogOption[] = [];
  let blogsUnavailable = false;

  try {
    // drafts are valid reference material too — a note can be attached to a
    // blog that isn't published yet
    const response = await getAllBlogs({ includeDrafts: true });

    blogs = ((response.data ?? []) as IBlog[]).map((blog) => ({
      id: blog.id,
      title: blog.title,
      type: blog.type,
      slug: blog.slug,
    }));
  } catch {
    blogsUnavailable = true;
  }

  let notes: INote[] = [];
  let timelineUnavailable = false;

  try {
    // bodyless on purpose — the timeline is a momentum surface, not a reading
    // surface; only a future detail view needs the full content
    const response = await getAllNotes({ includeContent: false });

    notes = response.data ?? [];
  } catch {
    timelineUnavailable = true;
  }

  // the note response carries only the blog id — join against the picker list
  // rather than populating on the backend, keeping the API shape unchanged
  const blogById = new Map(blogs.map((blog) => [blog.id, blog]));

  return (
    <div>
      <QuickNoteForm blogs={blogs} blogsUnavailable={blogsUnavailable} />
      <NotesTimeline
        notes={notes}
        blogById={blogById}
        unavailable={timelineUnavailable}
      />
    </div>
  );
};

export default NotesMainWrapper;
