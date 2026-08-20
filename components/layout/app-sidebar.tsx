'use client';

import { INavItem, navItems } from '@/lib/nav-items';
import { useAuthContext } from '@/providers/auth-provider';
import { ChevronsUpDown, Code2, Settings, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoutButton from '../common/logoutButton';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '../ui/sidebar';

// Build initials from a name, e.g. "Nahid Wadood" -> "NW". Falls back to "A".
const getInitials = (name?: string) =>
  name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'A';

const AppSidebar = () => {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();
  const { user } = useAuthContext();

  return (
    <Sidebar collapsible="icon">
      {/* Wordmark: same mono logotype as the public header. Collapsed state
          keeps the mark and drops the text, so the rail stays 4rem wide. */}
      <SidebarHeader className="h-14 shrink-0 flex-row items-center overflow-hidden border-b border-line px-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
        <Link
          href="/"
          aria-label="DevPlayground home"
          className="flex items-center gap-2.5 rounded-md"
        >
          <span
            aria-hidden="true"
            className="flex size-7 shrink-0 items-center justify-center rounded-md border border-line bg-surface"
          >
            <Code2 className="size-4" />
          </span>
          <span className="whitespace-nowrap font-mono text-sm font-semibold tracking-[-0.03em] group-data-[collapsible=icon]:hidden">
            DevPlayground
          </span>
        </Link>
      </SidebarHeader>

      {/* Nav — driven by lib/nav-items.ts */}
      <SidebarContent>
        <SidebarGroup className="px-2 py-3">
          {/* Section heading names the real route this group maps to */}
          <SidebarGroupLabel className="label-mono mb-1 h-6 px-2 text-[0.6875rem] text-muted-foreground">
            /admin
          </SidebarGroupLabel>

          <SidebarMenu className="gap-0.5">
            {navItems?.map((item: INavItem) => {
              const Icon = item?.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <SidebarMenuItem
                  key={item?.href}
                  className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center"
                >
                  {/* Active marker: a signal left-rule, not a filled pill */}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute top-1/2 left-0 z-10 h-4 w-[2px] -translate-y-1/2 rounded-full bg-signal group-data-[collapsible=icon]:hidden"
                    />
                  )}
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={item?.title}
                    className="h-9 gap-2.5 rounded-md px-2.5 font-mono text-[0.8125rem] tracking-tight text-muted-foreground hover:bg-accent hover:text-foreground data-[active=true]:bg-accent data-[active=true]:font-medium data-[active=true]:text-foreground"
                  >
                    <Link
                      href={item?.href}
                      onClick={() => isMobile && setOpenMobile(false)}
                    >
                      <Icon
                        aria-hidden="true"
                        className="size-4 shrink-0 text-muted-foreground"
                      />
                      <span className="group-data-[collapsible=icon]:hidden">
                        {item?.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Signed-in account */}
      <SidebarFooter className="border-t border-line p-2">
        <SidebarMenu>
          <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="h-12 gap-2.5 rounded-md px-2 hover:bg-accent data-[state=open]:bg-accent"
                >
                  <Avatar className="size-8 shrink-0 rounded-md border border-line">
                    <AvatarFallback className="rounded-md bg-surface font-mono text-[0.6875rem] font-medium tracking-tight text-foreground">
                      {getInitials(user?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid min-w-0 flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate text-[0.8125rem] font-medium">
                      {user?.name || 'Admin'}
                    </span>
                    <span className="truncate font-mono text-[0.6875rem] text-muted-foreground">
                      {user?.email || 'Not signed in'}
                    </span>
                  </div>
                  <ChevronsUpDown
                    aria-hidden="true"
                    className="ml-auto size-3.5 shrink-0 text-muted-foreground group-data-[collapsible=icon]:hidden"
                  />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side={isMobile ? 'bottom' : 'right'}
                align="end"
                sideOffset={4}
              >
                <div className="grid gap-1 px-2 py-1.5">
                  <p className="truncate text-sm leading-none font-medium">
                    {user?.name || 'Admin'}
                  </p>
                  <p className="truncate font-mono text-[0.6875rem] leading-none text-muted-foreground">
                    {user?.email || 'Not signed in'}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="font-mono text-xs tracking-tight">
                  <User aria-hidden="true" className="size-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="font-mono text-xs tracking-tight">
                  <Settings aria-hidden="true" className="size-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <LogoutButton />
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
