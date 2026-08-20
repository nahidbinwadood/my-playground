import PageHeader from '@/components/common/page-header';
import blogs from '../../../../(homepage)/blogs/data/blogs.json';
import { Clock, Eye, FileText, LucideIcon, Plus, TrendingUp } from 'lucide-react';
import StatsCard from '@/components/common/stats-card';
import StatusPill from '@/components/common/status-pill';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Hairline panel with a mono header strip naming what the panel shows.
// Local to the dashboard — the shell is the same for every region below the KPIs.
const Panel = ({
  label,
  meta,
  className,
  children,
}: {
  label: string;
  meta?: string;
  className?: string;
  children: React.ReactNode;
}) => (
  <section
    className={cn(
      'flex flex-col overflow-hidden rounded-lg border border-border bg-card',
      className
    )}
  >
    <header className="flex items-center justify-between gap-3 border-b border-line bg-muted/40 px-4 py-2.5">
      <h2 className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-foreground">
        {label}
      </h2>
      {meta && (
        <span className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] tabular-nums text-muted-foreground">
          {meta}
        </span>
      )}
    </header>
    <div className="flex-1 p-2 sm:p-3">{children}</div>
  </section>
);

// Empty regions state what to do next rather than just reporting nothing.
const EmptyRegion = ({ title, hint }: { title: string; hint: string }) => (
  <div className="flex h-full flex-col items-center justify-center gap-2 px-4 py-10 text-center">
    <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
      {title}
    </p>
    <p className="max-w-xs text-sm text-muted-foreground">{hint}</p>
    <Link
      href="/admin/blogs/create-blog"
      className="mt-1 text-sm font-medium text-foreground underline underline-offset-4 hover:text-muted-foreground"
    >
      Write a post
    </Link>
  </div>
);

// ISO date, not a locale string: this is a datasheet and the value must be stable.
const formatDate = (value: string) => new Date(value).toISOString().slice(0, 10);

const AdminDashboardMainWrapper = () => {
  const stats = {
    totalBlogs: blogs.length,
    publishedBlogs: blogs.filter((b) => b.status === 'published').length,
    totalViews: blogs.reduce((sum, b) => sum + b.viewCount, 0),
    draftBlogs: blogs.filter((b) => b.status === 'draft').length,
  };

  const dashboardStats: {
    title: string;
    value: number;
    description: string;
    icon: LucideIcon;
  }[] = [
    {
      title: 'Posts',
      value: stats.totalBlogs,
      description: 'Drafts and published',
      icon: FileText,
    },
    {
      title: 'Published',
      value: stats.publishedBlogs,
      description: 'Live on /blogs',
      icon: TrendingUp,
    },
    {
      title: 'Drafts',
      value: stats.draftBlogs,
      description: 'Not published yet',
      icon: Clock,
    },
    {
      title: 'Views',
      value: stats.totalViews,
      description: 'Across all posts',
      icon: Eye,
    },
  ];

  const recentBlogs = [...blogs]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  const topBlogs = [...blogs].sort((a, b) => b.viewCount - a.viewCount).slice(0, 5);

  const draftBlogs = blogs.filter((b) => b.status === 'draft');

  // Views summed per category — read off the same seed data as the counters above.
  const viewsByCategory = Object.entries(
    blogs.reduce<Record<string, number>>((acc, blog) => {
      acc[blog.category] = (acc[blog.category] ?? 0) + blog.viewCount;
      return acc;
    }, {})
  )
    .map(([category, views]) => ({ category, views }))
    .sort((a, b) => b.views - a.views);

  const peakCategoryViews = Math.max(1, ...viewsByCategory.map((c) => c.views));

  return (
    <section className="space-y-8">
      {/* Header row: route label + title on the left, the one primary action on the right */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="label-mono mb-2">/admin/dashboard</p>
          <PageHeader
            title="Content overview"
            subtitle="What is published, what is still a draft, and what gets read."
            className="mb-0"
          />
        </div>
        <Button className="w-full gap-2 sm:w-auto" asChild>
          <Link href="/admin/blogs/create-blog">
            <Plus className="h-4 w-4" aria-hidden="true" />
            New post
          </Link>
        </Button>
      </div>

      {/* Counters */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((item) => (
          <StatsCard
            key={item.title}
            title={item.title}
            value={item.value}
            description={item.description}
            icon={<item.icon className="h-5 w-5" aria-hidden="true" />}
          />
        ))}
      </div>

      {/* Panels */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel
          label="Recently created"
          meta={`${recentBlogs.length} of ${stats.totalBlogs}`}
        >
          {recentBlogs.length > 0 ? (
            <ul className="divide-y divide-line">
              {recentBlogs.map((blog) => (
                <li
                  key={blog.id}
                  className="flex items-center justify-between gap-3 px-2 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{blog.title}</p>
                    <p className="mt-1 font-mono text-xs tabular-nums text-muted-foreground">
                      <time dateTime={blog.createdAt}>
                        {formatDate(blog.createdAt)}
                      </time>
                      <span aria-hidden="true"> · </span>
                      {blog.category}
                    </p>
                  </div>
                  <StatusPill status={blog.status} className="shrink-0" />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyRegion
              title="No posts"
              hint="Nothing has been created yet. Write the first post and it lands here."
            />
          )}
        </Panel>

        <Panel label="Most read" meta="Views">
          {topBlogs.length > 0 ? (
            <ul className="divide-y divide-line">
              {topBlogs.map((blog, i) => (
                <li key={blog.id} className="flex items-center gap-3 px-2 py-3">
                  <span
                    aria-hidden="true"
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded border border-line bg-surface font-mono text-[0.6875rem] tabular-nums text-muted-foreground"
                  >
                    {i + 1}
                  </span>
                  <p className="min-w-0 flex-1 truncate text-sm font-medium">
                    {blog.title}
                  </p>
                  <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
                    {blog.viewCount}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyRegion
              title="No reads"
              hint="View counts appear once a post is published and opened."
            />
          )}
        </Panel>

        <Panel label="Views by category" meta={`${viewsByCategory.length} groups`}>
          {viewsByCategory.length > 0 ? (
            <dl className="space-y-4 px-2 py-2">
              {viewsByCategory.map((row) => (
                <div key={row.category}>
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="truncate font-mono text-xs uppercase tracking-[0.14em]">
                      {row.category}
                    </dt>
                    <dd className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
                      {row.views} views
                    </dd>
                  </div>
                  {/* Bar repeats the number beside it, so it stays decorative. */}
                  <div
                    aria-hidden="true"
                    className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted"
                  >
                    <div
                      className="h-full rounded-full bg-chart-5"
                      style={{
                        width: `${Math.max(
                          4,
                          Math.round((row.views / peakCategoryViews) * 100)
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </dl>
          ) : (
            <EmptyRegion
              title="No categories"
              hint="Categories appear once a post is filed under one."
            />
          )}
        </Panel>

        <Panel label="Drafts" meta={`${draftBlogs.length} waiting`}>
          {draftBlogs.length > 0 ? (
            <ul className="divide-y divide-line">
              {draftBlogs.map((blog) => (
                <li
                  key={blog.id}
                  className="flex items-center justify-between gap-3 px-2 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{blog.title}</p>
                    <p className="mt-1 font-mono text-xs tabular-nums text-muted-foreground">
                      <time dateTime={blog.updatedAt}>
                        {formatDate(blog.updatedAt)}
                      </time>
                      <span aria-hidden="true"> · </span>
                      {blog.readTime} min read
                    </p>
                  </div>
                  <StatusPill status={blog.status} className="shrink-0" />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyRegion
              title="Nothing in draft"
              hint="Every post is published. Save a post without publishing it and it queues up here."
            />
          )}
        </Panel>
      </div>
    </section>
  );
};

export default AdminDashboardMainWrapper;
