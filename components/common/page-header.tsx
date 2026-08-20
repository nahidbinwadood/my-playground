import { cn } from '@/lib/utils';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../ui/breadcrumb';
import React from 'react';
import Link from 'next/link';

interface BreadcrumbItemType {
  label: string;
  href?: string;
}

/**
 * Page header in the spec-sheet voice: mono route trail, mono title, sans
 * description, and an optional action slot that sits right of the title on
 * desktop and drops below it on mobile. Closed by a hairline rule.
 */
const PageHeader = ({
  title,
  subtitle,
  className,
  breadcrumbs,
  eyebrow,
  action,
  children,
}: {
  title: string;
  subtitle: string;
  className?: string;
  breadcrumbs?: BreadcrumbItemType[];
  /** Short route or section label rendered above the title. */
  eyebrow?: string;
  /** Buttons or controls for this page. `children` works as an alias. */
  action?: React.ReactNode;
  children?: React.ReactNode;
}) => {
  const actionSlot = action ?? children;

  return (
    <div className={cn('mb-8 w-full border-b border-line pb-6', className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb className="mb-4">
          <BreadcrumbList className="font-mono text-[0.6875rem] uppercase tracking-[0.18em]">
            {breadcrumbs.map((item, index) => (
              <React.Fragment key={index}>
                {index > 0 && (
                  <BreadcrumbSeparator className="text-muted-foreground">
                    /
                  </BreadcrumbSeparator>
                )}
                <BreadcrumbItem>
                  {item.href ? (
                    <BreadcrumbLink asChild>
                      <Link href={item?.href}>{item.label}</Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          {eyebrow && <p className="label-mono">{eyebrow}</p>}
          <h1 className="text-2xl font-semibold tracking-tight text-balance break-words sm:text-3xl">
            {title}
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {subtitle}
          </p>
        </div>

        {actionSlot ? (
          <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end sm:pb-1">
            {actionSlot}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default PageHeader;
