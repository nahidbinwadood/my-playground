

'use client';

import { useEffect, useState } from 'react';
import { DataTable } from '@/components/tables/data-table';
import { columns } from './columns';
import PageHeader from '@/components/common/page-header';
import { StatsCard } from '@/components/common/stats-card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { IBlogs } from '@/app/(homepage)/blogs/types';
import { BlogsPageSkeleton } from './skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { BlogService } from '../services/blog-service';

export default function BlogPage() {
  const [blogs, setBlogs] = useState<IBlogs[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    slug?: string;
    title?: string;
  }>({ open: false });

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const data = await BlogService.getAllBlogs();
        setBlogs(data);
      } catch (error) {
        console.error('Failed to fetch blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();

    // Listen for delete events from the table
    const handleDelete = (event: Event) => {
      const customEvent = event as CustomEvent;
      setDeleteDialog({
        open: true,
        slug: customEvent.detail.slug,
        title: customEvent.detail.title,
      });
    };

    window.addEventListener('blog-delete', handleDelete);
    return () => window.removeEventListener('blog-delete', handleDelete);
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.slug) return;

    try {
      await BlogService.deleteBlog(deleteDialog.slug);
      setBlogs((prev) => prev.filter((b) => b.slug !== deleteDialog.slug));
      setDeleteDialog({ open: false });
    } catch (error) {
      console.error('Failed to delete blog:', error);
    }
  };

  const stats = {
    total: blogs.length,
    published: blogs.filter((b) => b.status === 'published').length,
    drafts: blogs.filter((b) => b.status === 'draft').length,
    totalViews: blogs.reduce((sum, b) => sum + b.viewCount, 0),
  };

  if (loading) {
    return <BlogsPageSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard
          title="Total Blogs"
          value={stats.total}
          description="All published and draft blogs"
        />
        <StatsCard
          title="Published"
          value={stats.published}
          description="Live blogs"
        />
        <StatsCard
          title="Drafts"
          value={stats.drafts}
          description="Work in progress"
        />
        <StatsCard
          title="Total Views"
          value={stats.totalViews}
          description="Combined views"
        />
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
          <Link href="/admin/blogs/create-blog">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Blog
            </Button>
          </Link>
        </div>

        <DataTable columns={columns} data={blogs} />
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open })}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete Blog</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete &quot;{deleteDialog.title}&quot;? This action cannot be undone.
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
      </AlertDialog>
    </div>
  );
}
