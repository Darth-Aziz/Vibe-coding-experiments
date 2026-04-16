import { NavLink } from 'react-router';
import { LayoutDashboard, FileText, GitBranch, Settings, LogOut } from 'lucide-react';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/services', icon: FileText, label: 'Services' },
  { to: '/admin/workflows', icon: GitBranch, label: 'Workflows' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
];

export function AdminSidebar() {
  return (
    <aside className="w-60 min-h-screen flex flex-col" style={{ background: '#0F172A' }}>
      <div className="h-[60px] flex items-center justify-center border-b border-[#1E293B]">
        <NavLink to="/" className="text-white" style={{ fontSize: 20, fontWeight: 700, fontFamily: 'Inter, sans-serif' }}>
          Tasheel
        </NavLink>
      </div>
      <nav className="flex-1 py-4 px-3 flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-md transition-colors ${
                isActive ? 'bg-[#2563EB] text-white' : 'text-[#9CA3AF] hover:bg-[#1E293B] hover:text-white'
              }`
            }
            style={{ fontSize: 14, fontWeight: 500 }}
          >
            <item.icon size={20} strokeWidth={1.5} />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="px-3 pb-4 border-t border-[#1E293B] pt-4">
        <NavLink to="/" className="flex items-center gap-3 px-4 py-2.5 rounded-md text-[#9CA3AF] hover:bg-[#1E293B] hover:text-white transition-colors" style={{ fontSize: 14, fontWeight: 500 }}>
          <LogOut size={20} strokeWidth={1.5} />
          Exit Admin
        </NavLink>
      </div>
    </aside>
  );
}
