import { getAllBlogs } from '@/actions/blog.action';
import { getAllCategoriesAction } from '@/actions/category.action';
import { getAllNotes } from '@/actions/note.action';
import CategoryLabel from '@/components/common/category-label';
import PageHeader from '@/components/common/page-header';
import StatsCard from '@/components/common/stats-card';
import StatusPill from '@/components/common/status-pill';
import { Button } from '@/components/ui/button';
import { getActivity, getJournalStats } from '@/lib/journal';
import { cn } from '@/lib/utils';
import { IBlog, INote, ICategory } from '@/types';
import { Clock, FileText, NotebookPen, Plus, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import ActivityCalendar from './activity-calendar';

// Every figure on this page is counted from the API at request time. It used to
// be read out of a seed JSON file (blogs.json viewCount/readTime/category),
// which put invented numbers beside real ones — there is no seed data here now.

// Fixed in UTC so the server render is deterministic and the numbers do not
// drift between requests.
const dateFmt = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

const formatDate = (value?: string) =>
  value ? dateFmt.format(new Date(value)) : '—';

// Panels are the shell for every region below the KPIs: a title strip in the
// reading voice, with machine values (counts, dates) set in mono.
const Panel = ({
  label,
  meta,
  action,
  className,
  children,
}: {
  label: string;
  meta?: string;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) => (
  <section
    className={cn(
      'flex flex-col overflow-hidden rounded-lg border border-border bg-card',
      className
    )}
  >
    <header className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-5">
      <h2 className="text-sm font-semibold tracking-tight">{label}</h2>
      <div className="flex shrink-0 items-center gap-3">
        {meta ? (
          <span className="font-mono text-xs tabular-nums text-muted-foreground">
            {meta}
          </span>
        ) : null}
        {action}
      </div>
    </header>
    <div className="flex-1">{children}</div>
  </section>
);

// Empty states say what to do next, in the interface's voice.
const EmptyRegion = ({
  title,
  hint,
  href,
  cta,
}: {
  title: string;
  hint: string;
  href?: string;
  cta?: string;
}) => (
  <div className="flex h-full flex-col items-center justify-center gap-1.5 px-5 py-12 text-center">
    <p className="text-sm font-medium">{title}</p>
    <p className="max-w-sm text-sm text-muted-foreground">{hint}</p>
    {href && cta ? (
      <Link
        href={href}
        className="mt-2 text-sm font-medium underline underline-offset-4 hover:text-muted-foreground"
      >
        {cta}
      </Link>
    ) : null}
  </div>
);

// A failed fetch must not take the page down — the other panels still render,
// and the region says so plainly instead of silently showing zero.
const Unavailable = ({ what }: { what: string }) => (
  <div className="px-5 py-10 text-center">
    <p className="text-sm font-medium text-warn-ink">Could not load {what}</p>
    <p className="mt-1 text-sm text-muted-foreground">
      The API did not respond. The figures for this panel are missing, not zero.
    </p>
  </div>
);

const AdminDashboardMainWrapper = async () => {
  let blogs: IBlog[] = [];
  let blogsUnavailable = false;

  try {
    // drafts are real content too — the dashboard tracks both states
    const response = await getAllBlogs({ includeDrafts: true });
    blogs = (response.data ?? []) as IBlog[];
  } catch {
    blogsUnavailable = true;
  }

  // The topic axis is data now. Cards, tables and coverage all resolve a
  // stored id against this one list; a failure degrades to "no category"
  // rather than taking the page down.
  let categories: ICategory[] = [];
  let categoriesUnavailable = false;

  try {
    const response = await getAllCategoriesAction();
    categories = response.data ?? [];
  } catch {
    categoriesUnavailable = true;
  }

  let notes: INote[] = [];
  let notesUnavailable = false;

  try {
    // bodyless: the dashboard counts and lists notes, it never reads them
    const response = await getAllNotes({ includeContent: false });
    notes = response.data ?? [];
  } catch {
    notesUnavailable = true;
  }

  // Every tracker figure comes from these two derivations of the note list. No
  // counter is stored anywhere, so the streak and the calendar cannot drift
  // from the notes they describe — including when a note is edited or deleted.
  const journal = getJournalStats(notes);
  const activity = getActivity(notes);

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
  const notesByTopic = [...categories]
    .sort((a, b) => a.order - b.order)
    .map((category) => ({
      category,
      count: notes.filter((note) => note.category === category.id).length,
    }));
  const peakTopicCount = Math.max(1, ...notesByTopic.map((t) => t.count));
  const topicsCovered = notesByTopic.filter((t) => t.count > 0).length;

  const focusCategory = journal.currentFocus
    ? categoryById.get(journal.currentFocus)
    : undefined;

  // the note carries only the blog id — join locally rather than populating
  const blogById = new Map(blogs.map((blog) => [blog.id, blog]));

  const dashboardStats = [
    {
      title: 'Posts',
      value: blogs.length,
      description: 'Reference material',
      icon: FileText,
    },
    {
      title: 'Published',
      value: published.length,
      description: 'Live on /blogs',
      icon: TrendingUp,
    },
    {
      title: 'Drafts',
      value: drafts.length,
      description: 'Not published yet',
      icon: Clock,
    },
    {
      title: 'Notes',
      value: notes.length,
      description: 'Handwritten takeaways',
      icon: NotebookPen,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="/admin/dashboard"
        title="Overview"
        subtitle="Where the streak stands, what has been logged, and what is still a draft."
        action={
          <Button asChild className="w-full gap-2 sm:w-auto">
            <Link href="/admin/blogs/create-blog">
              <Plus className="size-4" aria-hidden="true" />
              New post
            </Link>
          </Button>
        }
      />

      {/* KPIs — full width, four across on desktop */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((item) => (
          <StatsCard
            key={item.title}
            title={item.title}
            value={item.value}
            description={item.description}
            icon={<item.icon className="size-5" aria-hidden="true" />}
          />
        ))}
      </div>

      {/* Row two: the tracker's own view — the calendar spans two thirds,
          the numbers that go with it take the third */}
      <div className="grid gap-4 xl:grid-cols-3">
        <Panel
          className="xl:col-span-2"
          label="Activity"
          meta={
            notesUnavailable
              ? undefined
              : `${activity.loggedDays} of ${activity.elapsedDays} days`
          }
        >
          {notesUnavailable ? (
            <Unavailable what="notes" />
          ) : journal.totalNotes > 0 ? (
            <ActivityCalendar activity={activity} />
          ) : (
            <EmptyRegion
              title="No activity yet"
              hint="The calendar fills a day at a time. A logged note lights up today."
              href="/admin/notes/create-note"
              cta="Log a note"
            />
          )}
        </Panel>

        <Panel label="Momentum">
          {notesUnavailable ? (
            <Unavailable what="notes" />
          ) : journal.totalNotes > 0 ? (
            <>
              <dl className="space-y-5 px-4 py-4 sm:px-5">
                <div>
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="label-mono">Current streak</dt>
                    <dd className="font-mono text-3xl leading-none font-semibold tabular-nums">
                      {journal.currentStreak}
                      <span className="ml-1.5 text-sm font-normal text-muted-foreground">
                        days
                      </span>
                    </dd>
                  </div>
                  {/* The reminder's day boundary is this one's too — today
                      counts as soon as a single note lands, and stays open
                      until midnight Dhaka. */}
                  <p
                    className={cn(
                      'mt-2 flex items-center gap-1.5 font-mono text-xs',
                      journal.loggedToday ? 'text-signal-ink' : 'text-warn-ink'
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        'size-1.5 shrink-0 rounded-full',
                        journal.loggedToday ? 'bg-signal' : 'bg-warn'
                      )}
                    />
                    {journal.loggedToday
                      ? 'Logged today'
                      : 'Nothing logged today'}
                  </p>
                </div>

                <div className="flex items-baseline justify-between gap-3">
                  <dt className="label-mono">Longest streak</dt>
                  <dd className="font-mono text-sm tabular-nums">
                    {journal.longestStreak}
                    <span className="ml-1 text-muted-foreground">days</span>
                  </dd>
                </div>

                <div className="flex items-baseline justify-between gap-3">
                  <dt className="label-mono">Entries this month</dt>
                  <dd className="font-mono text-sm tabular-nums">
                    {journal.entriesThisMonth}
                    <span className="ml-1 text-muted-foreground">
                      {journal.monthLabel}
                    </span>
                  </dd>
                </div>

                <div className="flex items-baseline justify-between gap-3">
                  <dt className="label-mono">
                    Focus · {journal.focusWindowDays}d
                  </dt>
                  <dd className="text-right font-mono text-sm">
                    {focusCategory?.name ?? '—'}
                    {focusCategory ? (
                      <span className="ml-1.5 text-muted-foreground">
                        {journal.focusNotes}{' '}
                        {journal.focusNotes === 1 ? 'note' : 'notes'}
                      </span>
                    ) : null}
                  </dd>
                </div>
              </dl>

              <footer className="border-t border-line px-4 py-2.5 sm:px-5">
                <p className="font-mono text-[0.625rem] text-muted-foreground">
                  Derived from note timestamps · Asia/Dhaka
                </p>
              </footer>
            </>
          ) : (
            <EmptyRegion
              title="No streak yet"
              hint="Streaks, focus and the calendar all start with the first note."
              href="/admin/notes/create-note"
              cta="Log a note"
            />
          )}
        </Panel>
      </div>

      {/* Row three: posts span two thirds, topic coverage takes the third */}
      <div className="grid gap-4 xl:grid-cols-3">
        <Panel
          className="xl:col-span-2"
          label="Recent posts"
          meta={`${recentBlogs.length} of ${blogs.length}`}
          action={
            <Link
              href="/admin/blogs"
              className="text-xs font-medium underline underline-offset-4 hover:text-muted-foreground"
            >
              View all
            </Link>
          }
        >
          {blogsUnavailable ? (
            <Unavailable what="posts" />
          ) : recentBlogs.length > 0 ? (
            <ul className="divide-y divide-line">
              {recentBlogs.map((blog) => (
                <li
                  key={blog.id}
                  className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 transition-colors hover:bg-accent/40 sm:px-5"
                >
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/admin/blogs/edit-blog/${blog.slug}`}
                      className="block truncate text-sm font-medium hover:underline hover:underline-offset-4"
                    >
                      {blog.title}
                    </Link>
                    <p className="mt-0.5 truncate font-mono text-xs text-muted-foreground">
                      /blogs/{blog.slug}
                    </p>
                  </div>

                  <CategoryLabel
                    className="shrink-0"
                    category={categoryById.get(blog.category)}
                  />

                  <span className="hidden shrink-0 font-mono text-xs tabular-nums text-muted-foreground sm:block">
                    {formatDate(blog.updatedAt)}
                  </span>

                  <StatusPill status={blog.isPublished} className="shrink-0" />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyRegion
              title="No posts yet"
              hint="Nothing has been created. Write the first post and it lands here."
              href="/admin/blogs/create-blog"
              cta="Write a post"
            />
          )}
        </Panel>

        <Panel
          label="Topics"
          meta={`${topicsCovered} of ${categories.length}`}
        >
          {notesUnavailable ? (
            <Unavailable what="notes" />
          ) : categoriesUnavailable ? (
            <Unavailable what="categories" />
          ) : notes.length > 0 ? (
            <dl className="space-y-4 px-4 py-4 sm:px-5">
              {notesByTopic.map((row) => (
                <div key={row.category.id}>
                  <div className="flex items-baseline justify-between gap-3">
                    <dt>
                      <CategoryLabel category={row.category} />
                    </dt>
                    <dd className="shrink-0 font-mono text-xs tabular-nums">
                      {row.count}
                    </dd>
                  </div>
                  {/* The bar repeats the number beside it, so it stays decorative */}
                  <div
                    aria-hidden="true"
                    className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted"
                  >
                    <div
                      className="h-full rounded-full bg-iris"
                      style={{
                        width: `${Math.round((row.count / peakTopicCount) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </dl>
          ) : (
            <EmptyRegion
              title="No topics covered"
              hint="Coverage is counted from notes. Log one and its topic appears here."
              href="/admin/notes/create-note"
              cta="Log a note"
            />
          )}
        </Panel>
      </div>

      {/* Row four: notes span two thirds, drafts take the third */}
      <div className="grid gap-4 xl:grid-cols-3">
        <Panel
          className="xl:col-span-2"
          label="Recent notes"
          meta={`${notes.length} logged`}
          action={
            <Link
              href="/admin/notes/create-note"
              className="text-xs font-medium underline underline-offset-4 hover:text-muted-foreground"
            >
              Log a note
            </Link>
          }
        >
          {notesUnavailable ? (
            <Unavailable what="notes" />
          ) : recentNotes.length > 0 ? (
            <ul className="divide-y divide-line">
              {recentNotes.map((note) => {
                const blog = note.blog ? blogById.get(note.blog) : undefined;

                return (
                  <li
                    key={note.id}
                    className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:px-5"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{note.title}</p>
                      {blog ? (
                        <p className="mt-0.5 truncate font-mono text-xs text-muted-foreground">
                          {blog.title}
                        </p>
                      ) : (
                        <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                          standalone
                        </p>
                      )}
                    </div>

                    <CategoryLabel
                      className="shrink-0"
                      category={categoryById.get(note.category)}
                    />

                    <span className="hidden shrink-0 font-mono text-xs tabular-nums text-muted-foreground sm:block">
                      {formatDate(note.createdAt)}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <EmptyRegion
              title="Nothing logged yet"
              hint="No note has been written. The first one starts the streak and fills this list."
              href="/admin/notes/create-note"
              cta="Log a note"
            />
          )}
        </Panel>

        <Panel label="Drafts" meta={`${drafts.length}`}>
          {blogsUnavailable ? (
            <Unavailable what="posts" />
          ) : drafts.length > 0 ? (
            <ul className="divide-y divide-line">
              {drafts.map((blog) => (
                <li
                  key={blog.id}
                  className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5"
                >
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/admin/blogs/edit-blog/${blog.slug}`}
                      className="block truncate text-sm font-medium hover:underline hover:underline-offset-4"
                    >
                      {blog.title}
                    </Link>
                    <p className="mt-0.5 font-mono text-xs tabular-nums text-muted-foreground">
                      {formatDate(blog.updatedAt)}
                    </p>
                  </div>
                  <StatusPill status={blog.isPublished} className="shrink-0" />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyRegion
              title="Nothing in draft"
              hint="Every post is published. Saving one without publishing it queues it here."
            />
          )}
        </Panel>
      </div>
    </div>
  );
};

export default AdminDashboardMainWrapper;
