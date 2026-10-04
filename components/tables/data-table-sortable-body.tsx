'use client';

import {
  closestCenter,
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
  type SensorDescriptor,
  type SensorOptions,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { Row } from '@tanstack/react-table';
import React from 'react';

import { TableBody, Table as UITable } from '../ui/table';
import { DragOverlayRow, SortableRow } from './data-table-sortable-rows';

// The drag-to-reorder variant of the table body: a DndContext around the
// table, sortable rows, and a floating copy of the dragged row.
export function DataTableSortableBody<TData>({
  header,
  emptyRow,
  rows,
  rowIds,
  activeId,
  activeRow,
  sensors,
  onDragStart,
  onDragEnd,
}: {
  header: React.ReactNode;
  emptyRow: React.ReactNode;
  rows: Row<TData>[];
  rowIds: string[];
  activeId: string | null;
  activeRow: Row<TData> | null;
  sensors: SensorDescriptor<SensorOptions>[];
  onDragStart: (event: DragStartEvent) => void;
  onDragEnd: (event: DragEndEvent) => void;
}) {
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <UITable className="min-w-full">
        {header}
        <TableBody>
          {rows?.length === 0 ? (
            emptyRow
          ) : (
            <SortableContext
              items={rowIds}
              strategy={verticalListSortingStrategy}
            >
              {rows.map((row) => (
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
          <div className="table-wrapper overflow-x-auto rounded-[14px] bg-card shadow-lg">
            <table className="w-full min-w-full">
              <tbody>
                <DragOverlayRow row={activeRow} />
              </tbody>
            </table>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
