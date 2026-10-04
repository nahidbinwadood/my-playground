'use client';

import {
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import type { Row } from '@tanstack/react-table';
import { useCallback, useMemo, useState } from 'react';

// Drag-to-reorder state for DataTable. `currentRows` must be a stable
// reference between renders (DataTable guarantees this with its NO_ROWS
// fallback), otherwise every memo here recomputes on each render.
export function useRowOrdering<TData>({
  currentRows,
  data,
  setData,
  dragEnd,
}: {
  currentRows: Row<TData>[];
  data: TData[];
  setData: (data: TData[]) => void;
  dragEnd?: (newData: TData[]) => void;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 3 },
    })
  );

  const activeRow = useMemo(() => {
    if (!activeId) return null;
    return currentRows.find((row) => row.id === activeId) || null;
  }, [activeId, currentRows]);

  const rowIds = useMemo(() => currentRows.map((row) => row.id), [currentRows]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  // setData is a useState setter (stable), so listing it does not change when
  // this callback is recreated.
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
    [currentRows, data, dragEnd, setData]
  );

  return {
    sensors,
    activeId,
    activeRow,
    rowIds,
    handleDragStart,
    handleDragEnd,
  };
}
