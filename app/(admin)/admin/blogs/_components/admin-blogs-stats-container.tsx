'use client';

import { IBlog } from '@/types';

const AdminBlogsStatsContainer = ({ blogs }: { blogs: IBlog[] }) => {
  const stats = {
    total: blogs.length,
    published: blogs.filter((b) => b.isPublished).length,
    drafts: blogs.filter((b) => !b.isPublished).length,
  };

  // Counts only — every number here is derived from the rows below it.
  const blogsStats: { label: string; value: number; hint: string }[] = [
    {
      label: 'All posts',
      value: stats.total,
      hint: 'Drafts and published together',
    },
    {
      label: 'Published',
      value: stats.published,
      hint: 'Readable at /blogs',
    },
    {
      label: 'Drafts',
      value: stats.drafts,
      hint: 'Not public yet',
    },
  ];

  return (
    <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {blogsStats?.map((item) => (
        <div key={item?.label} className="rounded-[14px] bg-surface px-5 py-4 sm:py-5">
          <dt className="label-mono">{item?.label}</dt>
          <dd className="mt-2">
            <span className="block font-mono text-3xl font-semibold tracking-tight tabular-nums text-foreground">
              {item?.value}
            </span>
            <span className="mt-1 block text-xs text-muted-foreground">
              {item?.hint}
            </span>
          </dd>
        </div>
      ))}
    </dl>
  );
};

export default AdminBlogsStatsContainer;
