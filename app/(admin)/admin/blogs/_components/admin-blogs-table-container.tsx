'use client';

import { DataTable } from '@/components/tables/data-table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { IBlog } from '@/types';
import { adminBlogsColumn } from './column';
import { useState, useTransition } from 'react';
import { deleteBlog } from '@/actions/blog.action';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const AdminBlogsTableContainer = ({ blogs }: { blogs: IBlog[] }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState<IBlog | null>(null);
  const [isPending, startTransition] = useTransition();

  //delete handler==>
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
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete the blog');
      } finally {
        setSelectedItem(null);
        setOpen(false);
      }
    });
  };

  return (
    <section>
      <DataTable
        columns={adminBlogsColumn({ setSelectedItem, setOpen })}
        data={blogs}
      />

      {/* Delete Modal */}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete Blog</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete &quot;{selectedItem?.title}&quot;?
            This action cannot be undone.
          </AlertDialogDescription>
          <div className="flex justify-end gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin" />
                  Deleting...
                </span>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
};

export default AdminBlogsTableContainer;
