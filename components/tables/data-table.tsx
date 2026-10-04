'use client';

import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table';

const NO_ROWS: never[] = [];

import { TableBody, Table as UITable } from '../ui/table';
import { MoveUpRight } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';

import { cn } from '@/lib/utils';
import { Card, CardContent } from '../ui/card';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';
import { FlexibleDataTableProps } from './data-table-types';

import Toolbar from './toolbar';
import { DataTablePagination } from './data-table-pagination';
import { DataTableViewOptions } from './data-table-view-options';
import Link from 'next/link';
import {
  DataTableEmptyRow,
  DataTableHeader,
  DataTableHeading,
  DataTableSkeletonRows,
  DataTableStaticRows,
} from './data-table-parts';
import { DataTableSortableBody } from './data-table-sortable-body';
import { useRowOrdering } from './use-row-ordering';

export function DataTable<TData, TValue = unknown>({
  columns,
  data: initialData = [],
  toolbar,
  paginationData,
  enableRowOrdering = false,
  enableRowSelection = true,
  dragEnd,
  loading = false,
  emptyMessage = 'No results.',
  onParamsChange,
  tableTitle,
  tableDescription,
  tableHeaderRenderProps,
  isViewOption = false,
  isEnableTablePopup = false,
  hidePagination = false,
  hidePaginationInModal = false,
  customHeader = false,
  href,
  onPaginationChange,
  hideDefaultClassname,
}: FlexibleDataTableProps<TData, TValue>) {
  const dataRef = React.useRef(initialData);
  const paginationDataRef = React.useRef(paginationData);
  const [data, setData] = useState<TData[]>(initialData);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  // Initialize pagination state with optional chaining
  const [pagination, setPagination] = useState({
    pageIndex: paginationData?.page ? paginationData.page - 1 : 0,
    pageSize: paginationData?.limit || paginationData?.pageSize || 10,
  });

  const [isModalOpen, setModalOpen] = useState(false);

  // Sync data and pagination with props using optional chaining
  useEffect(() => {
    if (JSON.stringify(initialData) !== JSON.stringify(dataRef.current)) {
      setData(initialData);
      dataRef.current = initialData;
    }

    if (
      paginationData &&
      JSON.stringify(paginationData) !==
        JSON.stringify(paginationDataRef.current)
    ) {
      setPagination({
        pageIndex: paginationData?.page ? paginationData.page - 1 : 0,
        pageSize: paginationData?.limit || paginationData?.pageSize || 10,
      });
      paginationDataRef.current = paginationData;
    }
  }, [initialData, paginationData]);

  // Calculate pageCount correctly with optional chaining. Fall back to the
  // loaded row count, not 0: tables without server-side pagination (the admin
  // blogs table) still render their rows, and reporting "Total Items 0"
  // beside six visible rows reads as a bug in the data.
  const totalRows =
    paginationData?.totalDocs ?? paginationData?.total ?? data.length;
  const pageCount = useMemo(() => {
    if (paginationData?.totalPages) {
      return paginationData.totalPages;
    }
    return Math.ceil(totalRows / pagination.pageSize);
  }, [paginationData?.totalPages, totalRows, pagination.pageSize]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      pagination,
    },
    enableRowSelection,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === 'function' ? updater(pagination) : updater;

      setPagination(newPagination);

      // Notify parent component about pagination changes
      if (onPaginationChange) {
        onPaginationChange({
          page: newPagination.pageIndex + 1,
          pageSize: newPagination.pageSize,
        });
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: !!paginationData,
    pageCount,
    autoResetPageIndex: false,
  });

  // getRowModel() is memoized by TanStack; only the fallback needs a stable
  // reference, or every memo below would recompute on each render
  const currentRows = table?.getRowModel()?.rows ?? NO_ROWS;

  const {
    sensors,
    activeId,
    activeRow,
    rowIds,
    handleDragStart,
    handleDragEnd,
  } = useRowOrdering({ currentRows, data, setData, dragEnd });

  const tableHeader = (
    <DataTableHeader table={table} enableRowOrdering={enableRowOrdering} />
  );

  const emptyTableBody = (
    <DataTableEmptyRow
      colSpan={columns?.length + (enableRowOrdering ? 1 : 0)}
      emptyMessage={emptyMessage}
    />
  );

  return (
    <>
      <Card
        className={cn(
          'gap-0 overflow-hidden rounded-[14px] border-none bg-surface py-0 shadow-none',
        )}
      >
        <CardContent className="p-3 lg:p-6">
          <div className="space-y-3 sm:space-y-4">
            {customHeader ? (
              <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                <DataTableHeading
                  className="w-full sm:max-w-[50%]"
                  tableTitle={tableTitle}
                  tableDescription={tableDescription}
                  tableHeaderRenderProps={tableHeaderRenderProps}
                />
                {href && (
                  <Link
                    href={href}
                    aria-label="Open the full table"
                    className="ml-auto rounded-md bg-muted/60 p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:ml-0"
                  >
                    <MoveUpRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                <DataTableHeading
                  className="w-full sm:w-auto sm:max-w-[50%]"
                  tableTitle={tableTitle}
                  tableDescription={tableDescription}
                  tableHeaderRenderProps={tableHeaderRenderProps}
                />

                <div className="flex flex-wrap items-center gap-2 overflow-hidden sm:gap-3">
                  {toolbar && (
                    <div className="flex-1">
                      <Toolbar
                        config={toolbar}
                        onParamsChange={onParamsChange}
                        tabbarClass="flex-1 min-w-[300px] overflow-hidden"
                      />
                    </div>
                  )}
                  {isViewOption && (
                    <div className="hidden sm:block">
                      <DataTableViewOptions table={table} />
                    </div>
                  )}
                  {isEnableTablePopup && (
                    <button
                      type="button"
                      onClick={() => setModalOpen(true)}
                      aria-label="Open the table in a larger view"
                      className="rounded-md bg-muted/60 p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <MoveUpRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {loading ? (
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-end gap-2 sm:gap-3">
                  {isViewOption && (
                    <div className="hidden sm:block">
                      <DataTableViewOptions table={table} />
                    </div>
                  )}
                </div>
                <div
                  aria-busy="true"
                  className="overflow-hidden rounded-[14px]"
                >
                  <div className="overflow-x-auto">
                    <UITable className="min-w-full">
                      {tableHeader}
                      <TableBody>
                        <DataTableSkeletonRows
                          columnCount={columns?.length ?? 0}
                          enableRowOrdering={enableRowOrdering}
                        />
                      </TableBody>
                    </UITable>
                  </div>
                </div>
              </div>
            ) : (
              <div className="overflow-hidden rounded-[14px]">
                <div className="overflow-x-auto">
                  {enableRowOrdering ? (
                    <DataTableSortableBody
                      header={tableHeader}
                      emptyRow={emptyTableBody}
                      rows={currentRows}
                      rowIds={rowIds}
                      activeId={activeId}
                      activeRow={activeRow}
                      sensors={sensors}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                    />
                  ) : (
                    <UITable className="min-w-full">
                      {tableHeader}
                      <TableBody>
                        {currentRows?.length === 0 ? (
                          emptyTableBody
                        ) : (
                          <DataTableStaticRows rows={currentRows} />
                        )}
                      </TableBody>
                    </UITable>
                  )}
                </div>
              </div>
            )}

            {!hidePagination && (
              <div className="overflow-x-auto">
                <DataTablePagination table={table} totalItems={totalRows} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Expanded view of the same table */}
      <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="hide-scrollbar max-h-[90vh] overflow-y-auto sm:max-w-[85%]">
          <DialogTitle className="sr-only">
            {tableTitle || 'Table view'}
          </DialogTitle>
          <div className="max-h-[calc(90vh-120px)]">
            <div className="space-y-4">
              <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                <DataTableHeading
                  className="w-full sm:max-w-[50%]"
                  tableTitle={tableTitle}
                  tableDescription={tableDescription}
                  tableHeaderRenderProps={tableHeaderRenderProps}
                />
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  {toolbar && (
                    <Toolbar
                      config={toolbar}
                      onParamsChange={onParamsChange}
                      tabbarClass="flex-1"
                    />
                  )}
                  {isViewOption && <DataTableViewOptions table={table} />}
                </div>
              </div>
              <div className="overflow-hidden rounded-[14px]">
                <div className="overflow-x-auto">
                  <UITable className="min-w-full">
                    {tableHeader}
                    <TableBody>
                      {currentRows?.length === 0 ? (
                        emptyTableBody
                      ) : (
                        <DataTableStaticRows rows={currentRows} />
                      )}
                    </TableBody>
                  </UITable>
                </div>
              </div>
              {!hidePaginationInModal && (
                <div className="overflow-x-auto">
                  <DataTablePagination table={table} totalItems={totalRows} />
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
