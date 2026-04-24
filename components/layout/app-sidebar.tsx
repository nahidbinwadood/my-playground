'use client';

import { INavItem, navItems } from '@/lib/nav-items';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../ui/sidebar';

const AppSidebar = () => {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="bg-white">
      <SidebarHeader className="h-16 border-b px-4 flex flex-row items-center bg-white overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold">
            A
          </div>
          <span className="text-xl font-bold transition-all duration-300 ease-in-out group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:invisible whitespace-nowrap">
            Admin
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-white">
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
      <SidebarFooter className="bg-white">
        {/* <NavUser user={data.user} /> */}
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
