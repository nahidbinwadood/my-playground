'use client';

import { flexRender, type Cell, type Row, type Table } from '@tanstack/react-table';
import { Inbox } from 'lucide-react';
import React from 'react';

import { Skeleton } from '../ui/skeleton';
import { TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { CELL_CLASS, ROW_CLASS } from './data-table-classes';

// Header row sits on the recessed surface with a hairline rule beneath it.
export function DataTableHeader<TData>({
  table,
  enableRowOrdering,
}: {
  table: Table<TData>;
  enableRowOrdering: boolean;
}) {
  return (
    <TableHeader className="bg-muted/50 [&_tr]:border-b-0">
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow
          key={headerGroup.id}
          className="border-b-0 hover:bg-transparent"
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
}

// Skeleton mirrors the real row: checkbox, two-line title, data cells, actions.
export function DataTableSkeletonRows({
  columnCount,
  enableRowOrdering,
}: {
  columnCount: number;
  enableRowOrdering: boolean;
}) {
  return Array.from({ length: 5 }).map((_, rowIndex) => (
    <TableRow key={rowIndex} className="border-b-0 hover:bg-transparent">
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
}

export function DataTableEmptyRow({
  colSpan,
  emptyMessage,
}: {
  colSpan: number;
  emptyMessage: string;
}) {
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell
        colSpan={colSpan}
        className="px-4 py-14 text-center whitespace-normal"
      >
        <div className="flex flex-col items-center gap-3">
          <span
            aria-hidden="true"
            className="flex h-10 w-10 items-center justify-center rounded-md bg-muted text-muted-foreground"
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
}

// Plain (non-sortable) body rows, used by the inline table and the popup.
export function DataTableStaticRows<TData>({ rows }: { rows: Row<TData>[] }) {
  return rows.map((row) => (
    <TableRow
      key={row.id}
      data-state={row.getIsSelected() && 'selected'}
      className={ROW_CLASS}
    >
      {row.getVisibleCells().map((cell: Cell<TData, unknown>) => (
        <TableCell key={cell.id} className={CELL_CLASS}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  ));
}

// Title, description and caller-supplied header content, shared by the card
// header variants and the popup.
export function DataTableHeading({
  className,
  tableTitle,
  tableDescription,
  tableHeaderRenderProps,
}: {
  className: string;
  tableTitle?: string;
  tableDescription?: string;
  tableHeaderRenderProps?: React.ReactNode;
}) {
  return (
    <div className={className}>
      {tableTitle && (
        <h2 className="text-base font-semibold tracking-tight text-foreground sm:text-lg">
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
  );
}
