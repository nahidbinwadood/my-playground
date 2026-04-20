import { SidebarProvider, SidebarTrigger } from '../ui/sidebar';
import AppSidebar from './app-sidebar';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
};

export default AdminLayout;
