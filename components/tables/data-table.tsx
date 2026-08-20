'use client';

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type Cell,
  type Row,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table';

import {
  closestCenter,
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';

import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { Skeleton } from '../ui/skeleton';
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Table as UITable,
} from '../ui/table';
import { CSS } from '@dnd-kit/utilities';
import { Ellipsis, Inbox, MoveUpRight } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { cn } from '@/lib/utils';
import { Card, CardContent } from '../ui/card';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';
import {
  DragHandleProps,
  FlexibleDataTableProps,
  SortableRowProps,
} from './data-table-types';

import Toolbar from './toolbar';
import { DataTablePagination } from './data-table-pagination';
import { DataTableViewOptions } from './data-table-view-options';
import Link from 'next/link';

/** Shared cell rhythm: generous padding so rows read as data, not as chips. */
const CELL_CLASS = 'px-4 py-3.5 align-middle text-sm';
/** Hairlines do the separating — no shadows, no zebra striping. */
const ROW_CLASS = 'border-b border-line last:border-0 hover:bg-accent/50';

function DragHandle({ listeners, attributes }: DragHandleProps) {
  return (
    <div
      className="flex h-full w-full min-w-10 cursor-grab items-center justify-center bg-transparent"
      {...listeners}
      {...attributes}
    >
      <button
        type="button"
        aria-label="Reorder row"
        className="cursor-grab rounded-md p-2 text-muted-foreground transition-colors hover:text-foreground"
      >
        <Ellipsis className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

const SortableRow = React.memo(function SortableRow<TData>({
  row,
  isDragging,
}: SortableRowProps<TData>) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: row.id });

  const style = useMemo(
    () => ({
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
      position: 'relative' as const,
      zIndex: isDragging ? 1 : 0,
    }),
    [transform, transition, isDragging]
  );

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      data-state={
        (row.getIsSelected() && 'selected') ||
        (isDragging && 'dragging') ||
        undefined
      }
      className={cn(ROW_CLASS, isDragging && 'bg-surface')}
    >
      <TableCell className="w-4 p-0 text-muted-foreground">
        <DragHandle listeners={listeners} attributes={attributes} />
      </TableCell>
      {row.getVisibleCells().map((cell: Cell<TData, unknown>) => (
        <TableCell key={cell.id} className={CELL_CLASS}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
});

const DragOverlayRow = React.memo(function DragOverlayRow<TData>({
  row,
}: {
  row: Row<TData>;
}) {
  return (
    <TableRow className="rounded-lg border border-line bg-card">
      <TableCell className="w-4 text-muted-foreground">
        <button
          type="button"
          aria-label="Reorder row"
          className="cursor-grabbing p-2"
        >
          <Ellipsis className="h-4 w-4" aria-hidden="true" />
        </button>
      </TableCell>
      {row.getVisibleCells().map((cell: Cell<TData, unknown>) => (
        <TableCell key={cell.id} className={CELL_CLASS}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
});

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
  isViewOption = true,
  isEnableTablePopup = true,
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

  const [activeId, setActiveId] = useState<string | null>(null);
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

  // Calculate pageCount correctly with optional chaining
  const totalRows = paginationData?.totalDocs ?? paginationData?.total ?? 0;
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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 3 },
    })
  );

  const currentRows = table?.getRowModel()?.rows ?? [];

  const activeRow = useMemo(() => {
    if (!activeId) return null;
    return currentRows.find((row) => row.id === activeId) || null;
  }, [activeId, currentRows]);

  const rowIds = useMemo(() => currentRows.map((row) => row.id), [currentRows]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);

      if (!over || active.id === over.id) return;

      const oldIndex = currentRows.findIndex((row) => row.id === active.id);
      const newIndex = currentRows.findIndex((row) => row.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newData = arrayMove([...data], oldIndex, newIndex);
        setData(newData);
        dragEnd?.(newData);
      }
    },
    [currentRows, data, dragEnd]
  );

  // Header row sits on the recessed surface with a hairline rule beneath it.
  const tableHeader = (
    <TableHeader className="bg-surface">
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow
          key={headerGroup.id}
          className="border-line hover:bg-transparent"
        >
          {enableRowOrdering && <TableHead className="w-4" />}
          {headerGroup.headers.map((header) => {
            const sorted = header.column.getIsSorted();
            return (
              <TableHead
                key={header.id}
                aria-sort={
                  header.column.getCanSort()
                    ? sorted === 'asc'
                      ? 'ascending'
                      : sorted === 'desc'
                        ? 'descending'
                        : 'none'
                    : undefined
                }
                className="label-mono h-auto px-4 py-3 whitespace-nowrap text-muted-foreground"
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableHead>
            );
          })}
        </TableRow>
      ))}
    </TableHeader>
  );

  // Skeleton mirrors the real row: checkbox, two-line title, data cells, actions.
  const renderSkeletonRows = () => {
    const columnCount = columns?.length ?? 0;

    return Array.from({ length: 5 }).map((_, rowIndex) => (
      <TableRow
        key={rowIndex}
        className="border-b border-line last:border-0 hover:bg-transparent"
      >
        {enableRowOrdering && (
          <TableCell className="w-4 px-4 py-3.5">
            <Skeleton className="h-4 w-4" />
          </TableCell>
        )}
        {Array.from({ length: columnCount }).map((__, colIndex) => (
          <TableCell key={colIndex} className={CELL_CLASS}>
            {colIndex === 0 ? (
              <Skeleton className="h-4 w-4 rounded-sm" />
            ) : colIndex === 1 ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-28" />
              </div>
            ) : colIndex === columnCount - 1 ? (
              <div className="flex justify-end gap-1.5">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
            ) : (
              <Skeleton className="h-4 w-24" />
            )}
          </TableCell>
        ))}
      </TableRow>
    ));
  };

  const emptyTableBody = (
    <TableRow className="hover:bg-transparent">
      <TableCell
        colSpan={columns?.length + (enableRowOrdering ? 1 : 0)}
        className="px-4 py-14 text-center whitespace-normal"
      >
        <div className="flex flex-col items-center gap-3">
          <span
            aria-hidden="true"
            className="flex h-10 w-10 items-center justify-center rounded-md border border-line bg-surface text-muted-foreground"
          >
            <Inbox className="h-4 w-4" />
          </span>
          <p className="font-mono text-sm tracking-tight text-foreground">
            {emptyMessage}
          </p>
        </div>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      <Card
        className={cn(
          'gap-0 overflow-hidden rounded-lg border-border bg-card py-0 shadow-none',
          hideDefaultClassname && 'border-none'
        )}
      >
        <CardContent className="p-3 lg:p-6">
          <div className="space-y-3 sm:space-y-4">
            {customHeader ? (
              <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                <div className="w-full sm:max-w-[50%]">
                  {tableTitle && (
                    <h2 className="font-mono text-base font-semibold tracking-tight text-foreground sm:text-lg">
                      {tableTitle}
                    </h2>
                  )}
                  {tableDescription && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {tableDescription}
                    </p>
                  )}
                  {tableHeaderRenderProps && tableHeaderRenderProps}
                </div>
                {href && (
                  <Link
                    href={href}
                    aria-label="Open the full table"
                    className="ml-auto rounded-md border border-line p-2 text-muted-foreground transition-colors hover:border-border hover:text-foreground sm:ml-0"
                  >
                    <MoveUpRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                <div className="w-full sm:w-auto sm:max-w-[50%]">
                  {tableTitle && (
                    <h2 className="font-mono text-base font-semibold tracking-tight text-foreground sm:text-lg">
                      {tableTitle}
                    </h2>
                  )}
                  {tableDescription && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {tableDescription}
                    </p>
                  )}
                  {tableHeaderRenderProps && tableHeaderRenderProps}
                </div>

                <div className="flex flex-wrap items-center gap-2 overflow-hidden sm:gap-3">
                  {toolbar && (
                    <div className="flex-1">
                      <Toolbar
                        table={table}
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
                      className="rounded-md border border-line p-2 text-muted-foreground transition-colors hover:border-border hover:text-foreground"
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
                  className="overflow-hidden rounded-lg border border-line"
                >
                  <div className="overflow-x-auto">
                    <UITable className="min-w-full">
                      {tableHeader}
                      <TableBody>{renderSkeletonRows()}</TableBody>
                    </UITable>
                  </div>
                </div>
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg border border-line">
                <div className="overflow-x-auto">
                  {enableRowOrdering ? (
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                    >
                      <UITable className="min-w-full">
                        {tableHeader}
                        <TableBody>
                          {currentRows?.length === 0 ? (
                            emptyTableBody
                          ) : (
                            <SortableContext
                              items={rowIds}
                              strategy={verticalListSortingStrategy}
                            >
                              {currentRows.map((row) => (
                                <SortableRow
                                  key={row.id}
                                  row={row}
                                  isDragging={activeId === row.id}
                                />
                              ))}
                            </SortableContext>
                          )}
                        </TableBody>
                      </UITable>
                      <DragOverlay>
                        {activeRow ? (
                          <div className="table-wrapper overflow-x-auto rounded-lg border border-line bg-card">
                            <table className="w-full min-w-full">
                              <tbody>
                                <DragOverlayRow row={activeRow} />
                              </tbody>
                            </table>
                          </div>
                        ) : null}
                      </DragOverlay>
                    </DndContext>
                  ) : (
                    <UITable className="min-w-full">
                      {tableHeader}
                      <TableBody>
                        {currentRows?.length === 0
                          ? emptyTableBody
                          : currentRows.map((row) => (
                              <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && 'selected'}
                                className={ROW_CLASS}
                              >
                                {row
                                  .getVisibleCells()
                                  .map((cell: Cell<TData, unknown>) => (
                                    <TableCell
                                      key={cell.id}
                                      className={CELL_CLASS}
                                    >
                                      {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                      )}
                                    </TableCell>
                                  ))}
                              </TableRow>
                            ))}
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
                <div className="w-full sm:max-w-[50%]">
                  {tableTitle && (
                    <h2 className="font-mono text-base font-semibold tracking-tight text-foreground sm:text-lg">
                      {tableTitle}
                    </h2>
                  )}
                  {tableDescription && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {tableDescription}
                    </p>
                  )}
                  {tableHeaderRenderProps && tableHeaderRenderProps}
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  {toolbar && (
                    <Toolbar
                      table={table}
                      config={toolbar}
                      onParamsChange={onParamsChange}
                      tabbarClass="flex-1"
                    />
                  )}
                  {isViewOption && <DataTableViewOptions table={table} />}
                </div>
              </div>
              <div className="overflow-hidden rounded-lg border border-line">
                <div className="overflow-x-auto">
                  <UITable className="min-w-full">
                    {tableHeader}
                    <TableBody>
                      {currentRows?.length === 0
                        ? emptyTableBody
                        : currentRows.map((row) => (
                            <TableRow
                              key={row.id}
                              data-state={row.getIsSelected() && 'selected'}
                              className={ROW_CLASS}
                            >
                              {row
                                .getVisibleCells()
                                .map((cell: Cell<TData, unknown>) => (
                                  <TableCell
                                    key={cell.id}
                                    className={CELL_CLASS}
                                  >
                                    {flexRender(
                                      cell.column.columnDef.cell,
                                      cell.getContext()
                                    )}
                                  </TableCell>
                                ))}
                            </TableRow>
                          ))}
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
