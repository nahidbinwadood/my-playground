import { SidebarInset, SidebarProvider, SidebarTrigger } from '../ui/sidebar';
import AppSidebar from './app-sidebar';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2  justify-between border-b px-4">
          <SidebarTrigger className="-ml-1" />

          <div>Dashboard</div>
        </header>

        <div className="min-h-[calc(100vh-64px)] max-h-[calc(100vh-64px)] overflow-y-auto p-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;
