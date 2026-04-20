'use client'

import { useState } from 'react';
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
import {
  LayoutDashboard,
  BookOpen,
  Settings,
  LogOut,
  User,
} from 'lucide-react';
import { usePathname } from 'next/navigation';

const AppSidebar = () => {
  const location = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigationItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      description: 'Overview & analytics',
    },
    {
      label: 'Blogs',
      href: '/blogs',
      icon: BookOpen,
      description: 'Manage your blog posts',
    },
  ];

  // const isActive = (href: string) => location.pathname.startsWith(href);
  const isActive = (href: string) => false;
  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
    >
      {/* Header */}
      <SidebarHeader className="border-b border-slate-200 px-4 py-6 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg">
            <span className="text-lg font-bold">A</span>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              Admin Panel
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Management Suite
            </p>
          </div>
        </div>
      </SidebarHeader>

      {/* Main Navigation */}
      <SidebarContent className="flex-1 px-2 py-4">
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={active}
                    className={`relative px-4 py-3 transition-all duration-200 ${
                      active
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400'
                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                    }`}
                  >
                    <a href={item.href} className="flex items-center gap-3">
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium">
                          {item.label}
                        </span>
                        <span
                          className={`text-xs transition-opacity ${
                            active
                              ? 'text-blue-500 dark:text-blue-300'
                              : 'text-slate-500 dark:text-slate-500'
                          }`}
                        >
                          {item.description}
                        </span>
                      </div>
                    </a>

                    {/* Active indicator */}
                    {active && (
                      <div className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-blue-600 dark:bg-blue-400"></div>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        {/* Divider */}
        <div className="my-4 border-t border-slate-200 dark:border-slate-800"></div>

        {/* Settings Section */}
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="px-4 py-3 text-slate-600 transition-all duration-200 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                <a href="#" className="flex items-center gap-3">
                  <Settings className="h-5 w-5 flex-shrink-0" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium">Settings</span>
                    <span className="text-xs text-slate-500 dark:text-slate-500">
                      Configure app
                    </span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-slate-200 px-2 py-4 dark:border-slate-800">
        <SidebarMenu className="gap-2">
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="px-4 py-3 text-slate-600 transition-all duration-200 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <a href="#" className="flex items-center gap-3">
                <User className="h-5 w-5 flex-shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">Profile</span>
                  <span className="text-xs text-slate-500 dark:text-slate-500">
                    Account settings
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="px-4 py-3 text-slate-600 transition-all duration-200 hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-950 dark:hover:text-red-400"
            >
              <button className="flex w-full items-center gap-3">
                <LogOut className="h-5 w-5 flex-shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">Logout</span>
                  <span className="text-xs text-slate-500 dark:text-slate-500">
                    Sign out
                  </span>
                </div>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
