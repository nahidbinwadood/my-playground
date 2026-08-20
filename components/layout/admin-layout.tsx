// Admin shell: sidebar + top header + scrollable content.
// Sidebar, header, and content all share the page background (--background)
// for a seamless unified surface; regions are divided by hairline rules only.
import { SidebarInset, SidebarProvider } from '../ui/sidebar';
import AppSidebar from './app-sidebar';
import DashboardHeader from './dashboard-header';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      {/* sidebar — off-canvas sheet under md, icon rail above it */}
      <AppSidebar />

      {/* Fill the viewport height so the content area owns the only scrollbar */}
      <SidebarInset className="h-svh overflow-hidden">
        {/* Header: fixed height, never scrolls */}
        <DashboardHeader />

        {/* Single scroll container for all page content -> one scrollbar */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;
