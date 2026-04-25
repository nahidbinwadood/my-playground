'use client';

import PageHeader from '@/components/common/page-header';
import StatsCard from '@/components/common/stats-card';
import { DataTable } from '@/components/tables/data-table';
import { Button } from '@/components/ui/button';
import {
    BarChart,
    Eye,
    FileText,
    LucideIcon,
    Plus,
    TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import blogs from '../../../../(homepage)/blogs/data/blogs.json';
import { columns } from './column';

const AdminBlogsMainWrapper = () => {
  const stats = {
    total: blogs.length,
    published: blogs.filter((b) => b.status === 'published').length,
    drafts: blogs.filter((b) => b.status === 'draft').length,
    totalViews: blogs.reduce((sum, b) => sum + b.viewCount, 0),
  };

  const blogsStats: {
    title: string;
    value: number;
    description: string;
    icon: LucideIcon;
  }[] = [
    {
      title: 'Total Blogs',
      value: stats.total,
      description: 'All published and draft blogs',
      icon: FileText,
    },
    {
      title: 'Published',
      value: stats.published,
      description: 'Live blogs',
      icon: TrendingUp,
    },
    {
      title: 'Drafts',
      value: stats.drafts,
      description: 'Work in progress',
      icon: BarChart,
    },
    {
      title: 'Total Views',
      value: stats.totalViews,
      description: 'Combined views',
      icon: Eye,
    },
  ];
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {blogsStats?.map((item) => (
          <StatsCard
            key={item?.title}
            title={item?.title}
            value={item?.value}
            description={item?.description}
            icon={<item.icon className="h-4 w-4" />}
          />
        ))}
      </div>

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

        <DataTable columns={columns} data={blogs} />
      </div>

      {/* Delete Confirmation Dialog */}
      {/* <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open })}
      >
        <AlertDialogContent>
          <AlertDialogTitle>Delete Blog</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete &quot;{deleteDialog.title}&quot;?
            This action cannot be undone.
          </AlertDialogDescription>
          <div className="flex justify-end gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog> */}
    </div>
  );
};

export default AdminBlogsMainWrapper;
