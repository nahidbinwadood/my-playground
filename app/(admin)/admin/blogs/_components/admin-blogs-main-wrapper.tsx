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
      {/* Stats Cards */}
      <AdminBlogsStatsContainer blogs={blogs} />

      {/* Page Header */}
      <PageHeader
        title="Blog Management"
        subtitle="Create, edit, and manage your blog posts"
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin/dashboard' },
          { label: 'Blogs' },
        ]}
      />

      {/* Add Blog Button and Table */}
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button className="gap-2" asChild>
            <Link href="/admin/blogs/create-blog">
              <Plus className="h-4 w-4" />
              Add Blog{' '}
            </Link>
          </Button>
        </div>

        {/* Blogs Table */}
        <AdminBlogsTableContainer blogs={blogs} />
      </div>
    </div>
  );
};

export default AdminBlogsMainWrapper;
