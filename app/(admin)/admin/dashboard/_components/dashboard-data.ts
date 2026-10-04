import { getAllBlogs } from '@/actions/blog.action';
import { getAllCategoriesAction } from '@/actions/category.action';
import { getAllNotes } from '@/actions/note.action';
import {
  getActivity,
  getJournalStats,
  getReminderStatus,
} from '@/lib/journal';
import { IBlog, ICategory, INote } from '@/types';

// Every figure on this page is counted from the API at request time. It used to
// be read out of a seed JSON file (blogs.json viewCount/readTime/category),
// which put invented numbers beside real ones — there is no seed data here now.

export type TDashboardSources = {
  blogs: IBlog[];
  blogsUnavailable: boolean;
  categories: ICategory[];
  categoriesUnavailable: boolean;
  notes: INote[];
  notesUnavailable: boolean;
};

export const loadDashboardSources = async (): Promise<TDashboardSources> => {
  const [blogsRes, categoriesRes, notesRes] = await Promise.allSettled([
    // drafts are real content too — the dashboard tracks both states
    getAllBlogs({ includeDrafts: true }),
    // The topic axis is data now. Cards, tables and coverage all resolve a
    // stored id against this one list; a failure degrades to "no category"
    // rather than taking the page down.
    getAllCategoriesAction(),
    // bodyless: the dashboard counts and lists notes, it never reads them
    getAllNotes({ includeContent: false }),
  ]);

  const blogs =
    blogsRes.status === 'fulfilled'
      ? ((blogsRes.value.data ?? []) as IBlog[])
      : [];
  const blogsUnavailable = blogsRes.status === 'rejected';

  const categories =
    categoriesRes.status === 'fulfilled'
      ? (categoriesRes.value.data ?? [])
      : [];
  const categoriesUnavailable = categoriesRes.status === 'rejected';

  const notes =
    notesRes.status === 'fulfilled' ? (notesRes.value.data ?? []) : [];
  const notesUnavailable = notesRes.status === 'rejected';

  return {
    blogs,
    blogsUnavailable,
    categories,
    categoriesUnavailable,
    notes,
    notesUnavailable,
  };
};

export type TNotesByTopic = { category: ICategory; count: number }[];

// Pure: everything the panels show is derived here from the fetched lists, so
// it can be checked without rendering.
export const deriveDashboardStats = (
  { blogs, categories, notes }: TDashboardSources,
  now: Date
) => {
  // Every tracker figure comes from these two derivations of the note list. No
  // counter is stored anywhere, so the streak and the calendar cannot drift
  // from the notes they describe — including when a note is edited or deleted.
  const journal = getJournalStats(notes);
  const activity = getActivity(notes);
  const reminder = getReminderStatus(journal.loggedToday, now);

  const published = blogs.filter((blog) => blog.isPublished);
  const drafts = blogs.filter((blog) => !blog.isPublished);

  const recentBlogs = [...blogs]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 6);

  // the API already returns notes newest-first
  const recentNotes = notes.slice(0, 6);

  // coverage is counted from what was actually logged, in the order the
  // pickers use
  const categoryById = new Map(
    categories.map((category) => [category.id, category])
  );
  const notesByTopic: TNotesByTopic = [...categories]
    .sort((a, b) => a.order - b.order)
    .map((category) => ({
      category,
      count: notes.filter((note) => note.category === category.id).length,
    }));
  const topicTotal = notesByTopic.reduce((sum, t) => sum + t.count, 0);
  const topicsCovered = notesByTopic.filter((t) => t.count > 0).length;

  const focusCategory = journal.currentFocus
    ? categoryById.get(journal.currentFocus)
    : undefined;

  // the note carries only the blog id — join locally rather than populating
  const blogById = new Map(blogs.map((blog) => [blog.id, blog]));
  const completedCount = notes.filter((n) => n.status === 'COMPLETE').length;
  const draftCount = notes.filter(
    (n) => (n.status ?? 'DRAFT') === 'DRAFT'
  ).length;

  return {
    journal,
    activity,
    reminder,
    published,
    drafts,
    recentBlogs,
    recentNotes,
    categoryById,
    blogById,
    notesByTopic,
    topicTotal,
    topicsCovered,
    focusCategory,
    completedCount,
    draftCount,
  };
};
