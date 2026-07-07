// Admin shell: sidebar + top header + scrollable content.
// Sidebar, header, and content all share the page background (--background)
// for a seamless unified surface; regions are divided by thin borders only.
import ThemeToggler from '../common/theme-toggler';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '../ui/sidebar';
import AppSidebar from './app-sidebar';
import ProfileMenu from './profile-menu';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      {/* sidebar */}
      <AppSidebar />

      {/* Fill the viewport height so the content area owns the only scrollbar */}
      <SidebarInset className="h-svh overflow-hidden">
        {/* Header: fixed height, never scrolls */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b px-4">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggler />
            <ProfileMenu />
          </div>
        </header>

        {/* Single scroll container for all page content -> one scrollbar */}
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;
