import type { DraggableAttributes } from '@dnd-kit/core';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import type { ColumnDef, Row, Table } from '@tanstack/react-table';
import type React from 'react';
import { ReactNode } from 'react';

export interface DragHandleProps {
  listeners?: SyntheticListenerMap;
  attributes?: DraggableAttributes;
}

export interface SortableRowProps<TData = unknown> {
  row: Row<TData>;
  isDragging: boolean;
}

export interface PaginationData {
  page?: number;
  limit?: number;
  pageSize?: number;
  totalDocs?: number;
  total?: number;
  totalPages?: number;
}
interface FilterConfig {
  columnKey: string;
  title: string;
  queryKey?: string; // Added queryKey to customize query param name
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
}
interface SingleFilterConfig {
  outsideIcon?: ReactNode;
  insideIcon?: ReactNode;
  placeholder: string;
  options: {
    label: string;
    value: string;
  }[];
  queryKey: string;
  size?: 'sm' | undefined;
  hasDefaultValue?: boolean;
  defaultValue?: string;
}
export interface CustomFilter {
  queryKey: string; // URL param key to track in reset/active filters
  component: React.ReactNode; // Your custom filter component
}
export interface ToolbarConfig {
  enableSearch?: boolean;
  searchPlaceholder?: string;

  enableFilters?: boolean;
  enableSingleFilter?: boolean;
  singleFilters?: SingleFilterConfig[];
  filters?: FilterConfig[];

  customActions?: React.ReactNode;
  enableDateFilter?: boolean;
  enableRangeDateFilter?: boolean;
  searchKey?: string;
  // singleFilters?: Array<{
  //   queryKey: string
  //   outsideIcon?:any
  //   insideIcon?:any
  //   placeholder: string
  //   options: Array<{
  //     label: string
  //     value: string
  //   }>
  // }>
  enableReset?: boolean;
  enableViewOptions?: boolean;
  [key: string]: unknown;
  customFilters?: CustomFilter[];
}

export interface FlexibleDataTableProps<TData, TValue = unknown> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  toolbar?: ToolbarConfig;
  paginationData?: PaginationData;
  enableRowOrdering?: boolean;
  enableRowSelection?: boolean;
  dragEnd?: (newData: TData[]) => void;
  loading?: boolean;
  emptyMessage?: string;
  onParamsChange?: (params: unknown) => void;
  tableTitle?: string;
  tableDescription?: string;
  tableHeaderRenderProps?: React.ReactNode;
  isViewOption?: boolean;
  isEnableTablePopup?: boolean;
  hidePagination?: boolean;
  customHeader?: boolean;
  href?: string;
  onPaginationChange?: (pagination: { page: number; pageSize: number }) => void;
  hideDefaultClassname?: boolean;
  hidePaginationInModal?: boolean;
}

export interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  totalItems: number;
}

export interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}
