import { SidebarInset, SidebarProvider, SidebarTrigger } from '../ui/sidebar';
import AppSidebar from './app-sidebar';
import ProfileMenu from './profile-menu';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      {/* sidebar  */}
      <AppSidebar />

      {/* sidebar main contents */}
      <SidebarInset>
        {/* sidebar header */}
        <header className="flex h-16 shrink-0 items-center gap-2  justify-between border-b px-4">
          <div className="flex items-center gap-3">
            {/* sidebar trigger */}
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
          </div>

          {/* profile menu */}
          <ProfileMenu />
        </header>

        {/* sidebar children pages */}
        <div className="min-h-[calc(100vh-64px)] max-h-[calc(100vh-64px)] overflow-y-auto p-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;
