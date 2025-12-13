'use client';

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type Cell,
  type ColumnDef,
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

import { Skeleton } from "../ui/skeleton";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Table as UITable,
} from '../ui/table';
import { CSS } from '@dnd-kit/utilities';
import { Ellipsis, MoveUpRight } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Card, CardContent } from '../ui/card';
import { Dialog, DialogContent } from '../ui/dialog';
import {
  DragHandleProps,
  FlexibleDataTableProps,
  SortableRowProps,
} from './data-table-types';
 

import Toolbar from './toolbar';
import { DataTablePagination } from './data-table-pagination';
import { DataTableViewOptions } from './data-table-view-options';
import Link from 'next/link';

function DragHandle({ listeners, attributes }: DragHandleProps) {
  return (
    <div
      className="flex h-full w-full cursor-grab items-center justify-center bg-transparent min-w-20"
      {...listeners}
      {...attributes}
    >
      <button type="button" className="cursor-pointer p-2">
        <Ellipsis />
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
      className={isDragging ? 'bg-muted' : ''}
    >
      <TableCell className="w-4 p-0 text-gray-400">
        <DragHandle listeners={listeners} attributes={attributes} />
      </TableCell>
      {row.getVisibleCells().map((cell: Cell<TData, unknown>) => (
        <TableCell key={cell.id}>
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
    <TableRow className="border bg-background shadow-md">
      <TableCell className="w-4">
        <button type="button" className="cursor-pointer p-2">
          <Ellipsis />
        </button>
      </TableCell>
      {row.getVisibleCells().map((cell: Cell<TData, unknown>) => (
        <TableCell key={cell.id}>
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

  const tableHeader = (
    <TableHeader className="bg-[#F7F7F7] border-none">
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {enableRowOrdering && <TableHead className="w-4" />}
          {headerGroup.headers.map((header) => (
            <TableHead key={header.id}>
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
            </TableHead>
          ))}
        </TableRow>
      ))}
    </TableHeader>
  );

  const renderSkeletonRows = () => {
    const skeletonRows = Array.from({ length: 5 });

    return skeletonRows.map((_, rowIndex) => (
      <TableRow key={rowIndex}>
        {enableRowOrdering && (
          <TableCell className="w-4">
            <Skeleton className="h-10 w-5" />
          </TableCell>
        )}
        {columns.map((column: ColumnDef<TData, TValue>, colIndex: number) => (
          <TableCell key={colIndex}>
            <Skeleton className="h-10 w-full" />
          </TableCell>
        ))}
      </TableRow>
    ));
  };

  const emptyTableBody = (
    <TableRow>
      <TableCell
        colSpan={columns?.length + (enableRowOrdering ? 1 : 0)}
        className="h-24 text-center"
      >
        {emptyMessage}
      </TableCell>
    </TableRow>
  );

  return (
    <>
      <Card className={` ${hideDefaultClassname && 'shadow-none border-none'}`}>
        <CardContent className='p-2 lg:p-6'>
          <div className="space-y-3 sm:space-y-4">
            {customHeader ? (
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <div className="w-full sm:max-w-[50%]">
                  {tableTitle && (
                    <h1 className="text-lg sm:text-xl font-semibold text-foreground">
                      {tableTitle}
                    </h1>
                  )}
                  {tableDescription && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {tableDescription}
                    </p>
                  )}
                  {tableHeaderRenderProps && tableHeaderRenderProps}
                </div>
                {href && (
                  <Link
                    href={href}
                    className="border rounded-full p-1.5 sm:p-2 ml-auto sm:ml-0"
                  >
                    <MoveUpRight className="h-5 w-5 sm:h-6 sm:w-6 text-foreground" />
                  </Link>
                )}
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <div className="w-full sm:w-auto sm:max-w-[50%]">
                  {tableTitle && (
                    <h1 className="text-lg sm:text-xl font-semibold text-foreground">
                      {tableTitle}
                    </h1>
                  )}
                  {tableDescription && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {tableDescription}
                    </p>
                  )}
                  {tableHeaderRenderProps && tableHeaderRenderProps}
                </div>

                <div className="flex flex-wrap items-center overflow-hidden gap-2 sm:gap-3">
                  {toolbar && (
                    <div className="flex-1  ">
                      <Toolbar
                        table={table}
                        config={toolbar}
                        onParamsChange={onParamsChange}
                        tabbarClass="flex-1  min-w-[300px] overflow-hidden"
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
                      onClick={() => setModalOpen(true)}
                      className="border rounded-full p-1.5 sm:p-2"
                    >
                      <MoveUpRight className="h-5 w-5 sm:h-6 sm:w-6 text-foreground" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {loading ? (
              <div className="space-y-3 sm:space-y-4">
                <div className="flex gap-2 sm:gap-3 items-center justify-end">
                  {isViewOption && (
                    <div className="hidden sm:block">
                      <DataTableViewOptions table={table} />
                    </div>
                  )}
                </div>
                <div className="rounded-md border overflow-hidden">
                  <div className="overflow-x-auto">
                    <UITable>
                      {tableHeader}
                      <TableBody>{renderSkeletonRows()}</TableBody>
                    </UITable>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-md border overflow-hidden">
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
                          <div className="table-wrapper overflow-x-auto">
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
                      <TableBody className="border-t-none">
                        {currentRows?.length === 0
                          ? emptyTableBody
                          : currentRows.map((row) => (
                              <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && 'selected'}
                                className="border-none"
                              >
                                {row
                                  .getVisibleCells()
                                  .map((cell: Cell<TData, unknown>) => (
                                    <TableCell
                                      key={cell.id}
                                      className="px-2 py-3 sm:px-4 sm:py-4 text-sm"
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

      {/* Modal component */}
      <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[85%] max-h-[90vh] overflow-y-scroll hide-scroll">
          {/* <DialogTitle /> */}
          <div className="o  max-h-[calc(90vh-120px)]">
            <div className="space-y-4 p-4">
              {/* Modal content similar to main table */}
              <div className="flex gap-3 items-center justify-end">
                <div className="max-w-4/12">
                  {tableTitle && (
                    <h1 className="text-xl font-semibold text-foreground">
                      {tableTitle}
                    </h1>
                  )}
                  {tableDescription && <p>{tableDescription}</p>}
                  {tableHeaderRenderProps && tableHeaderRenderProps}
                </div>
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
              <div className="rounded-md border overflow-hidden">
                <UITable>
                  {tableHeader}
                  <TableBody>
                    {currentRows?.length === 0
                      ? emptyTableBody
                      : currentRows.map((row) => (
                          <TableRow
                            key={row.id}
                            data-state={row.getIsSelected() && 'selected'}
                            className="border-none"
                          >
                            {row
                              .getVisibleCells()
                              .map((cell: Cell<TData, unknown>) => (
                                <TableCell key={cell.id}>
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
              {!hidePaginationInModal && (
                <DataTablePagination table={table} totalItems={totalRows} />
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
