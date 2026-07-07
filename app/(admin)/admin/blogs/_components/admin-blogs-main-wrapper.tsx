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
      {/* Header row: title/breadcrumbs on the left, Add button on the right */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <PageHeader
          title="Blog Management"
          subtitle="Create, edit, and manage your blog posts"
          breadcrumbs={[
            { label: 'Dashboard', href: '/admin/dashboard' },
            { label: 'Blogs' },
          ]}
          className="mb-0"
        />
        <Button className="gap-2 shrink-0" asChild>
          <Link href="/admin/blogs/create-blog">
            <Plus className="h-4 w-4" />
            Add Blog
          </Link>
        </Button>
      </div>

      {/* Stats cards */}
      <AdminBlogsStatsContainer blogs={blogs} />

      {/* Blogs table */}
      <AdminBlogsTableContainer blogs={blogs} />
    </div>
  );
};

export default AdminBlogsMainWrapper;
