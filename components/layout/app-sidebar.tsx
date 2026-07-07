'use client';

import { INavItem, navItems } from '@/lib/nav-items';
import { ChevronsUpDown, Settings, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '../ui/sidebar';
import LogoutButton from '../common/logoutButton';
import { useAuthContext } from '@/providers/auth-provider';

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
  const { isMobile } = useSidebar();
  const { user } = useAuthContext();

  return (
    <Sidebar collapsible="icon">
      {/* sidebar header */}
      <SidebarHeader className="h-16 border-b px-4 flex flex-row items-center overflow-hidden">
        <div className="flex items-center gap-3">
          {/* Brand tile: emerald gradient */}
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-linear-to-br from-emerald-500 to-teal-600 text-white font-bold">
            A
          </div>
          <span className="text-xl font-bold transition-all duration-300 ease-in-out group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:invisible whitespace-nowrap">
            Admin
          </span>
        </div>
      </SidebarHeader>

      {/* sidebar contents */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-2 mt-2">
            {navItems?.map((item: INavItem) => {
              const Icon = item?.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <SidebarMenuItem
                  key={item?.href}
                  className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center"
                >
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={item?.title}
                  >
                    {/* Active state uses theme tokens so it works in dark mode */}
                    <Link
                      href={item?.href}
                      className="flex flex-1 items-center gap-3 h-10 px-3 transition-all duration-200 ease-linear rounded-lg data-[active=true]:bg-primary! data-[active=true]:text-primary-foreground!
                      group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:h-10!
                      "
                    >
                      <Icon className="size-5! shrink-0" />
                      <span className="font-medium transition-all duration-300 ease-in-out group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:invisible whitespace-nowrap">
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

      {/* sidebar footer */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem className="">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="group-data-[collapsible=icon]:h-12! group-data-[collapsible=icon]:w-12! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:pr-1!"
                >
                  <Avatar className="size-8 rounded-lg shrink-0">
                    <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-medium">
                      {getInitials(user?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight transition-all duration-300 ease-in-out group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:invisible overflow-hidden">
                    <span className="truncate font-medium">
                      {user?.name || 'Admin User'}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user?.email || 'admin@example.com'}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 transition-all duration-300 ease-in-out group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:invisible" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side={isMobile ? 'bottom' : 'right'}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
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
