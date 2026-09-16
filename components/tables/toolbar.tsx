'use client';

import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ToolbarConfig } from './data-table-types';

export default function Toolbar({
  tabbarClass,
  config,
  onParamsChange,
}: {
  config: ToolbarConfig;
  onParamsChange?: (params: URLSearchParams) => void;
  tabbarClass?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get(config.searchKey || 'search') || ''
  );
  const [, setActiveFilters] = useState<Record<string, string[]>>(
    () => {
      const filters: Record<string, string[]> = {};
      config.filters?.forEach((filter) => {
        const queryKey = filter.queryKey || filter.columnKey;
        const value = searchParams.get(queryKey);
        if (value) {
          filters[filter.columnKey] = value.split(',');
        }
      });
      return filters;
    }
  );

  const updateUrlParams = useCallback(
    (updates: Record<string, string | string[] | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (
          value === null ||
          value === '' ||
          (Array.isArray(value) && value.length === 0)
        ) {
          params.delete(key);
        } else if (Array.isArray(value)) {
          params.delete(key);
          value.forEach((v) => params.append(key, v));
        } else {
          params.set(key, value);
        }
      });

      if (Object.keys(updates).some((key) => key !== 'page')) {
        params.delete('page');
      }

      router.push(`?${params.toString()}`, { scroll: false });
      onParamsChange?.(params);
    },
    [searchParams, router, onParamsChange]
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchTerm(value);
      const searchKey = config.searchKey || 'search';
      updateUrlParams({ [searchKey]: value || null });
    },
    [config.searchKey, updateUrlParams]
  );

  const handleReset = useCallback(() => {
    setSearchTerm('');
    setActiveFilters({});

    const updates: Record<string, null> = {};
    const searchKey = config.searchKey || 'search';
    updates[searchKey] = null;

    config.filters?.forEach((filter) => {
      const queryKey = filter.queryKey || filter.columnKey;
      updates[queryKey] = null;
    });
    config.singleFilters?.forEach((filter) => {
      updates[filter.queryKey] = null;
    });
    config.customFilters?.forEach((filter) => {
      updates[filter.queryKey] = null;
    });
    if (config.enableDateFilter || config.enableRangeDateFilter) {
      updates.date = null;
      updates.startDate = null;
      updates.endDate = null;
    }

    updateUrlParams(updates);
  }, [
    config.searchKey,
    config.filters,
    config.singleFilters,
    config.customFilters,
    config.enableDateFilter,
    config.enableRangeDateFilter,
    updateUrlParams,
  ]);

  const isFiltered = useMemo(() => {
    const searchKey = config.searchKey || 'search';
    if (searchParams.get(searchKey)) return true;

    return (
      config.filters?.some((filter) => {
        const queryKey = filter.queryKey || filter.columnKey;
        return searchParams.get(queryKey);
      }) ||
      config.singleFilters?.some((filter) => {
        return searchParams.get(filter.queryKey);
      }) ||
      config.customFilters?.some((filter) => {
        return searchParams.get(filter.queryKey);
      }) ||
      (config.enableDateFilter && searchParams.get('date')) ||
      (config.enableRangeDateFilter && searchParams.get('startDate')) ||
      (config.enableRangeDateFilter && searchParams.get('endDate')) ||
      false
    );
  }, [
    searchParams,
    config.searchKey,
    config.filters,
    config.singleFilters,
    config.customFilters,
    config.enableDateFilter,
    config.enableRangeDateFilter,
  ]);

  return (
    <div className={cn('w-full', tabbarClass)}>
      {/* Mobile: Horizontal scroll view */}
      <div className="flex lg:hidden items-center gap-2 overflow-x-auto pb-2 pl-1 py-1 scrollbar-hide">
        <div className="flex items-center gap-2 w-[300px] overflow-x-auto hide-scrollbar">
          {config.enableSearch && (
            <Input
              placeholder={config.searchPlaceholder || 'Search...'}
              value={searchTerm}
              onChange={(event) => handleSearchChange(event.target.value)}
              className="h-10 w-[150px] text-sm shrink-0"
            />
          )}

          {config.customFilters?.map((customFilter) => (
            <div key={customFilter.queryKey} className="shrink-0">
              {customFilter.component}
            </div>
          ))}

          {config.enableSingleFilter &&
            config.singleFilters?.map((item, index) => (
              <div key={item.queryKey ?? index} className="shrink-0">
                {/* <SingleSelectSearchOption
                  options={item.options}
                  placeholder={item.placeholder}
                  queryKey={item.queryKey}
                  size="sm"
                  insideIcon={item.insideIcon || null}
                  outsideIcon={item.outsideIcon || null}
                  defaultValue={item?.defaultValue}
                /> */}
              </div>
            ))}

          {config.enableFilters &&
            config.filters?.map((filter) => (
              <div key={filter.columnKey} className="shrink-0">
                {/* <DataTableFacetedFilter
                  column={{
                    getFilterValue: () => activeFilters[filter.columnKey] || [],
                    setFilterValue: (value: string[]) =>
                      handleFilterChange(filter.columnKey, value),
                  }}
                  title={filter.title}
                  options={filter.options}
                /> */}
              </div>
            ))}

          {config.enableDateFilter && (
            <div className="shrink-0">
              {/* <DateFilter size="sm" /> */}
            </div>
          )}

          {config.enableRangeDateFilter && (
            <div className="shrink-0">
              {/* <RangeDateFilter size="sm" /> */}
            </div>
          )}

          {config.enableReset && isFiltered && (
            <Button
              variant="ghost"
              onClick={handleReset}
              className="h-8 px-2 border rounded-full flex justify-center items-center shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Desktop: Normal layout */}
      <div className="hidden lg:flex items-center justify-end gap-3 pl-1 py-1">
        {config.enableSearch && (
          <Input
            placeholder={config.searchPlaceholder || 'Search...'}
            value={searchTerm}
            onChange={(event) => handleSearchChange(event.target.value)}
            className="h-10 w-[250px]"
          />
        )}

        {config.customFilters?.map((customFilter) => (
          <div key={customFilter.queryKey}>{customFilter.component}</div>
        ))}

        {config.enableSingleFilter &&
          config.singleFilters?.map((item, index) => (
            <div key={item.queryKey ?? index}>
              {/* <SingleSelectSearchOption
                key={index}
                options={item.options}
                placeholder={item.placeholder}
                queryKey={item.queryKey}
                size="sm"
                insideIcon={item.insideIcon || null}
                outsideIcon={item.outsideIcon || null}
                defaultValue={item?.defaultValue}
              /> */}
            </div>
          ))}

        {config.enableFilters &&
          config.filters?.map((filter) => (
            <div key={filter.columnKey}>
              {/* <DataTableFacetedFilter
                key={filter.columnKey}
                column={{
                  getFilterValue: () => activeFilters[filter.columnKey] || [],
                  setFilterValue: (value: string[]) =>
                    handleFilterChange(filter.columnKey, value),
                }}
                title={filter.title}
                options={filter.options}
              /> */}
            </div>
          ))}

        {config.enableReset && isFiltered && (
          <Button
            variant="ghost"
            onClick={handleReset}
            className="h-8 px-2 lg:px-3 border rounded-full flex justify-center items-center"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
