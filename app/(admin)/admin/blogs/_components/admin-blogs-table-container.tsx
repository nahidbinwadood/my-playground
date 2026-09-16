'use client';

import { toggleBlogStatus } from '@/actions/blog.action';
import { DataTable } from '@/components/tables/data-table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { IBlog } from '@/types';
import { FileText, Loader2, Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { deleteBlog } from '@/actions/blog.action';
import { adminBlogsColumn } from './column';

const AdminBlogsTableContainer = ({ blogs }: { blogs: IBlog[] }) => {
  const [open, setOpen] = useState(false);
  const [toggleOpen, setToggleOpen] = useState(false);
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState<IBlog | null>(null);
  const [toggleItem, setToggleItem] = useState<IBlog | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (isPending || !selectedItem) return;

    startTransition(async () => {
      try {
        const response = await deleteBlog(selectedItem?.id);
        if (response.success) {
          toast.success(response.message || 'Blog deleted successfully');
          router.refresh();
        } else {
          toast.error(response.message || 'Failed to delete the blog');
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to delete the blog';
        toast.error(message);
      } finally {
        setSelectedItem(null);
        setOpen(false);
      }
    });
  };

  const handleToggleStatus = () => {
    if (isPending || !toggleItem) return;

    const newStatus = toggleItem.isPublished ? 'DRAFT' : 'PUBLISHED';

    startTransition(async () => {
      try {
        const response = await toggleBlogStatus(toggleItem.id, newStatus);
        if (response.success) {
          toast.success(response.message || `Blog ${newStatus === 'PUBLISHED' ? 'published' : 'unpublished'} successfully`);
          router.refresh();
        } else {
          toast.error(response.message || 'Failed to update blog status');
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to update blog status';
        toast.error(message);
      } finally {
        setToggleItem(null);
        setToggleOpen(false);
      }
    });
  };

  const hasBlogs = blogs?.length > 0;

  return (
    <section>
      {hasBlogs ? (
        <div
          aria-busy={isPending}
          className={cn(
            'transition-opacity duration-200',
            isPending && 'pointer-events-none opacity-60'
          )}
        >
          <DataTable
            columns={adminBlogsColumn({ setSelectedItem, setOpen, setToggleItem, setToggleOpen })}
            data={blogs}
            tableTitle="All posts"
            tableDescription="Sort by any column header. Drafts stay out of the public list until you publish them."
            emptyMessage="No posts match this view."
          />
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-card">
          <div className="flex flex-col items-center gap-4 px-5 py-16 text-center sm:px-8">
            <span
              aria-hidden="true"
              className="flex h-11 w-11 items-center justify-center rounded-md border border-line bg-surface text-muted-foreground"
            >
              <FileText className="h-5 w-5" />
            </span>
            <div className="space-y-1.5">
              <h2 className="font-mono text-lg font-semibold tracking-tight text-foreground">
                No posts yet
              </h2>
              <p className="mx-auto max-w-sm text-sm leading-relaxed text-muted-foreground">
                Nothing has been written here. Posts you publish appear at
                /blogs; drafts stay private until then.
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/admin/blogs/create-blog">
                <Plus className="h-4 w-4" aria-hidden="true" />
                Write a post
              </Link>
            </Button>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-mono text-lg font-semibold tracking-tight">
              Delete this post?
            </AlertDialogTitle>
            <AlertDialogDescription>
              &quot;{selectedItem?.title}&quot; will be removed for good. There
              is no undo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep post</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-fail text-background hover:bg-fail/90"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Deleting
                </span>
              ) : (
                'Delete post'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Publish / unpublish confirmation */}
      <AlertDialog open={toggleOpen} onOpenChange={setToggleOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-mono text-lg font-semibold tracking-tight">
              {toggleItem?.isPublished ? 'Unpublish this post?' : 'Publish this post?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {toggleItem?.isPublished
                ? `\u201c${toggleItem?.title}\u201d will be moved back to drafts and will no longer be visible at /blogs.`
                : `\u201c${toggleItem?.title}\u201d will be published and become visible at /blogs.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleToggleStatus}
              disabled={isPending}
              className={toggleItem?.isPublished ? 'bg-warn text-background hover:bg-warn/90' : 'bg-signal text-background hover:bg-signal/90'}
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Updating
                </span>
              ) : toggleItem?.isPublished ? (
                'Unpublish'
              ) : (
                'Publish'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
};

export default AdminBlogsTableContainer;
