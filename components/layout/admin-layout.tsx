// Admin shell: sidebar sits on the page ground, content lives in one rounded card panel (shadcn's inset variant).
import { SidebarInset, SidebarProvider } from '../ui/sidebar';
import AppSidebar from './app-sidebar';
import DashboardHeader from './dashboard-header';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      {/* sidebar — off-canvas sheet under md, icon rail above it */}
      <AppSidebar />

      {/* Fill the viewport height so the content area owns the only scrollbar */}
      <SidebarInset className="h-svh overflow-hidden bg-card md:h-[calc(100svh-1rem)] md:border md:border-line md:shadow-none">
        {/* Header: fixed height, never scrolls */}
        <DashboardHeader />

        {/* Single scroll container for all page content -> one scrollbar */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;
