'use client';

import { INavItem, navItems } from '@/lib/nav-items';
import { ChevronsUpDown, LogOut, Settings, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
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

const AppSidebar = () => {
  const pathname = usePathname();

  const { isMobile } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      {/* sidebar header */}
      <SidebarHeader className="h-16 border-b px-4 flex flex-row items-center overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold">
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
                    <Link
                      href={item?.href}
                      className="flex flex-1 items-center gap-3 h-10 px-3 transition-all duration-200 ease-linear rounded-lg data-[active=true]:text-white! data-[active=true]:bg-black!
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
                <SidebarMenuButton size="lg" className="group-data-[collapsible=icon]:h-12! group-data-[collapsible=icon]:w-12! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:pr-1!">
                  <Avatar className="size-8 rounded-lg shrink-0">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight transition-all duration-300 ease-in-out group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:invisible overflow-hidden">
                    <span className="truncate font-medium">Admin User</span>
                    <span className="truncate text-xs"> admin@example.com</span>
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
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
