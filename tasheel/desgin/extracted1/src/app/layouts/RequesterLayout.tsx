import { Outlet } from 'react-router';
import { RequesterNav } from '../components/RequesterNav';

export function RequesterLayout() {
  return (
    <div className="min-h-screen" style={{ background: '#F8FAFC' }}>
      <RequesterNav />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
