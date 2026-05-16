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
import { useState } from 'react';
import { deleteBlog } from '@/actions/blog.action';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const AdminBlogsTableContainer = ({ blogs }: { blogs: IBlog[] }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState<IBlog | null>(null);
  const [loading, setLoading] = useState(false);

  //delete handler==>
  const handleDelete = async () => {
    if (loading || !selectedItem) return;

    setLoading(true);
    try {
      const response = await deleteBlog(selectedItem?.id);

      console.log({ response });

      if (response.success) {
        toast.success(response.message || 'Blog deleted successfully');
        setSelectedItem(null);
        setOpen(false);
        setLoading(false);
        router.refresh();
      } else {
        setSelectedItem(null);
        setOpen(false);
        setLoading(false);
        toast.error(response.message || 'Failed to delete the blog');
      }
    } catch (error: any) {
      setSelectedItem(null);
      setOpen(false);
      setLoading(false);
      toast.error(error.message || 'Failed to delete the blog');
    }
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
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
};

export default AdminBlogsTableContainer;
