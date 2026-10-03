'use client';

import PageHeader from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { useRefreshContext } from '@/providers/refresh-provider';
import { ICategory } from '@/types';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import CategoriesTableContainer from './categories-table-container';
import CategoryFormDialog from './category-form-dialog';
import CategoriesSkeleton from './categories-skeleton';

const CategoriesMainWrapper = ({
  categories,
  unavailable,
}: {
  categories: ICategory[];
  unavailable: boolean;
}) => {
  const [createOpen, setCreateOpen] = useState(false);
  const { isRefreshing } = useRefreshContext();

  // Renaming a category changes every label on this table, so the save refetches
  // it. The skeleton covers that window rather than leaving the old names up.
  if (isRefreshing) {
    return <CategoriesSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header row: title/breadcrumbs on the left, the one signal action on the right */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <PageHeader
          title="Categories"
          subtitle="The topic axis for blogs and notes. Rename one here and every card, table and tracker follows."
          breadcrumbs={[
            { label: 'Dashboard', href: '/admin/dashboard' },
            { label: 'Categories' },
          ]}
          className="mb-0"
        />
        <Button className="shrink-0" onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          New category
        </Button>
      </div>

      {unavailable ? (
        // Unknown is not zero — an empty table would read as "you have none".
        <div className="rounded-[14px] bg-surface px-5 py-10 text-center">
          <p className="text-sm font-medium text-warn-ink">
            Could not load categories
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            The API did not respond, so this table is empty because the data is
            missing, not because nothing exists.
          </p>
        </div>
      ) : (
        <CategoriesTableContainer categories={categories} />
      )}

      <CategoryFormDialog
        category={null}
        open={createOpen}
        onOpenChange={setCreateOpen}
      />
    </div>
  );
};

export default CategoriesMainWrapper;
