'use client';

import { navItems } from '@/lib/nav-items';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';
import ThemeToggler from '../common/theme-toggler';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../ui/breadcrumb';
import { SidebarTrigger } from '../ui/sidebar';
import ProfileMenu from './profile-menu';

// Only segments that map to a real nav route become links, so the trail never
// points at a URL that does not resolve.
const linkableRoutes = new Set(navItems.map((item) => item.href));

// "edit-blog" -> "edit blog". Slug segments are only decoded.
const toLabel = (segment: string) =>
  decodeURIComponent(segment).replace(/-/g, ' ');

export default function DashboardHeader() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-line bg-background px-3 sm:px-5">
      {/* Route trail — mono, read as a path */}
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <SidebarTrigger className="size-9 rounded-md border border-line text-muted-foreground hover:text-foreground" />

        <Breadcrumb className="min-w-0">
          <BreadcrumbList className="flex-nowrap gap-1 font-mono text-xs tracking-tight sm:gap-1.5">
            {segments.map((segment, index) => {
              const href = `/${segments.slice(0, index + 1).join('/')}`;
              const isLast = index === segments.length - 1;
              const label = toLabel(segment);

              return (
                <Fragment key={href}>
                  {index > 0 && (
                    <BreadcrumbSeparator
                      className={cn(
                        'text-muted-foreground',
                        // Narrow screens keep only the last two steps
                        index < segments.length - 1 && 'hidden sm:block'
                      )}
                    >
                      /
                    </BreadcrumbSeparator>
                  )}
                  <BreadcrumbItem
                    className={cn(
                      'min-w-0',
                      index < segments.length - 2 && 'hidden sm:inline-flex'
                    )}
                  >
                    {isLast ? (
                      <BreadcrumbPage className="truncate text-foreground">
                        {label}
                      </BreadcrumbPage>
                    ) : linkableRoutes.has(href) ? (
                      <BreadcrumbLink asChild>
                        <Link href={href} className="truncate rounded-sm">
                          {label}
                        </Link>
                      </BreadcrumbLink>
                    ) : (
                      <span className="truncate">{label}</span>
                    )}
                  </BreadcrumbItem>
                </Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Instrument controls */}
      <div className="flex shrink-0 items-center gap-2">
        <ThemeToggler />
        <ProfileMenu />
      </div>
    </header>
  );
}
