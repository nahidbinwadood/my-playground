'use client';

import PageHeader from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { IBlog } from '@/types';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useTransition } from 'react';
import AdminBlogsSkeleton from './admin-blogs-skeleton';
import AdminBlogsStatsContainer from './admin-blogs-stats-container';
import AdminBlogsTableContainer from './admin-blogs-table-container';

const AdminBlogsMainWrapper = ({ blogs }: { blogs: IBlog[] }) => {
  const [isPending, startTransition] = useTransition();

  if (isPending) {
    return <AdminBlogsSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header row: title/breadcrumbs on the left, the one signal action on the right */}
      <div className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
        <PageHeader
          title="Blog posts"
          subtitle="Write, edit, and publish posts. Drafts stay out of the public list."
          breadcrumbs={[
            { label: 'Dashboard', href: '/admin/dashboard' },
            { label: 'Blogs' },
          ]}
          className="mb-0"
        />
        <Button className="shrink-0" asChild>
          <Link href="/admin/blogs/create-blog">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Write a post
          </Link>
        </Button>
      </div>

      {/* Counts derived from the rows below */}
      <AdminBlogsStatsContainer blogs={blogs} />

      {/* Blogs table */}
      <AdminBlogsTableContainer blogs={blogs} />
    </div>
  );
};

export default AdminBlogsMainWrapper;
