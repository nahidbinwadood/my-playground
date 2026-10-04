'use client';

import { flexRender, type Cell, type Row } from '@tanstack/react-table';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Ellipsis } from 'lucide-react';
import React, { useMemo } from 'react';

import { cn } from '@/lib/utils';
import { TableCell, TableRow } from '../ui/table';
import { CELL_CLASS, ROW_CLASS } from './data-table-classes';
import { DragHandleProps, SortableRowProps } from './data-table-types';

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

export const SortableRow = React.memo(function SortableRow<TData>({
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
  // React.memo drops the generic; restore it so callers keep their row type.
}) as <TData>(props: SortableRowProps<TData>) => React.JSX.Element;

export const DragOverlayRow = React.memo(function DragOverlayRow<TData>({
  row,
}: {
  row: Row<TData>;
}) {
  return (
    <TableRow className="rounded-lg border-0 bg-card shadow-md">
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
}) as <TData>(props: { row: Row<TData> }) => React.JSX.Element;
