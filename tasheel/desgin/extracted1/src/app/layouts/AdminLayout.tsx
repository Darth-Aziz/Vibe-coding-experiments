import { Outlet } from 'react-router';
import { AdminSidebar } from '../components/AdminSidebar';

export function AdminLayout() {
  return (
    <div className="flex min-h-screen" style={{ background: '#F1F5F9' }}>
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
