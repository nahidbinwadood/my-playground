'use client';

import { deleteCategoryAction } from '@/actions/category.action';
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
import { cn } from '@/lib/utils';
import { ICategory } from '@/types';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { categoriesColumn } from './column';
import CategoryFormDialog from './category-form-dialog';

const CategoriesTableContainer = ({
  categories,
}: {
  categories: ICategory[];
}) => {
  const [formItem, setFormItem] = useState<ICategory | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const [deleteItem, setDeleteItem] = useState<ICategory | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    if (isPending || !deleteItem) return;

    startTransition(async () => {
      try {
        const response = await deleteCategoryAction(deleteItem.id);

        if (response.success) {
          toast.success(response.message || 'Category deleted');
          router.refresh();
        } else {
          toast.error(response.message || 'Failed to delete the category');
        }
      } catch (error: unknown) {
        // the API refuses while blogs or notes still point at the category, and
        // its message names the counts — surface that verbatim
        toast.error(
          error instanceof Error
            ? error.message
            : 'Failed to delete the category'
        );
      } finally {
        setDeleteItem(null);
        setDeleteOpen(false);
      }
    });
  };

  const hasCategories = categories.length > 0;

  return (
    <section>
      <div
        aria-busy={isPending}
        className={cn(
          'transition-opacity duration-200',
          isPending && 'pointer-events-none opacity-60'
        )}
      >
        <DataTable
          columns={categoriesColumn({
            onEdit: (category) => {
              setFormItem(category);
              setFormOpen(true);
            },
            onDelete: (category) => {
              setDeleteItem(category);
              setDeleteOpen(true);
            },
          })}
          data={categories}
          tableTitle="All categories"
          tableDescription="The topic axis for every blog and note. Order is the order the pickers use."
          emptyMessage={
            hasCategories
              ? 'No categories match this view.'
              : 'No categories yet — create the first one.'
          }
        />
      </div>

      <CategoryFormDialog
        category={formItem}
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setFormItem(null);
        }}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-semibold tracking-tight">
              Delete this category?
            </AlertDialogTitle>
            <AlertDialogDescription>
              &quot;{deleteItem?.name}&quot; will be removed for good. The API
              refuses while any blog or note still uses it, so nothing is
              silently detached.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep category</AlertDialogCancel>
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
                'Delete category'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
};

export default CategoriesTableContainer;
