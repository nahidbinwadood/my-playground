import { getAllBlogs } from '@/actions/blog.action';
import { getAllCategoriesAction } from '@/actions/category.action';
import { getAllNotes } from '@/actions/note.action';
import PageHeader from '@/components/common/page-header';
import RefetchSkeleton from '@/components/common/refetch-skeleton';
import { IBlog, INote, ICategory } from '@/types';
import { TBlogOption } from '../../types';
import NotesTimeline from './notes-timeline';
import QuickNoteForm from './quick-note-form';
import { TimelineSkeleton } from './notes-skeleton';

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
      category: blog.category,
      slug: blog.slug,
    }));
  } catch {
    blogsUnavailable = true;
  }

  // The category picker (and the timeline's tags) read from the same public
  // list. A failure here must not block logging — the note form says so.
  let categories: ICategory[] = [];
  let categoriesUnavailable = false;

  try {
    const response = await getAllCategoriesAction();
    categories = response.data ?? [];
  } catch {
    categoriesUnavailable = true;
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
      <PageHeader
        title="New note"
        subtitle="Write what you actually understood. Link it to a blog of reference material, or keep it standalone."
        eyebrow="/admin/notes/create-note"
        // the middle crumb links back to the notes index this page hangs off
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin/dashboard' },
          { label: 'Notes', href: '/admin/notes' },
          { label: 'New note' },
        ]}
      />

      {/* The form is a tall stack of fields, the timeline a narrow feed, so on
          desktop they sit side by side: the field column takes the room it
          needs and the timeline fills the rest without ever crowding it. The
          timeline sticks and scrolls on its own once the form scrolls away. */}
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] xl:grid-cols-[minmax(0,1fr)_26rem] xl:gap-8">
        <QuickNoteForm
          blogs={blogs}
          blogsUnavailable={blogsUnavailable}
          categories={categories}
          categoriesUnavailable={categoriesUnavailable}
        />

        <div className="lg:sticky lg:top-6 lg:max-h-[calc(100svh-8rem)] lg:overflow-y-auto lg:pr-1">
          {/* Saving refetches the feed. The skeleton covers the timeline only —
              the form beside it is the point of this page and must stay usable,
              ready for the next entry. */}
          <RefetchSkeleton skeleton={<TimelineSkeleton />}>
            <NotesTimeline
              notes={notes}
              blogById={blogById}
              categoryById={new Map(
                categories.map((category) => [category.id, category])
              )}
              unavailable={timelineUnavailable}
            />
          </RefetchSkeleton>
        </div>
      </div>
    </div>
  );
};

export default NotesMainWrapper;
