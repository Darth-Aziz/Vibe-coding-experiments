import { NavLink } from 'react-router';
import { User } from 'lucide-react';

export function RequesterNav() {
  return (
    <header className="h-14 bg-white border-b border-[#E5E7EB] flex items-center px-6 justify-between sticky top-0 z-10">
      <div className="flex items-center gap-8">
        <NavLink to="/" style={{ fontSize: 18, fontWeight: 700, fontFamily: 'Inter, sans-serif', color: '#0F172A' }}>
          Tasheel
        </NavLink>
        <nav className="flex items-center gap-1">
          {[
            { to: '/requester', label: 'Service Catalog', end: true },
            { to: '/requester/requests', label: 'My Requests' },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-md transition-colors ${
                  isActive ? 'text-[#2563EB]' : 'text-[#6B7280] hover:text-[#374151]'
                }`
              }
              style={{ fontSize: 14, fontWeight: 500 }}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center">
        <User size={16} className="text-white" />
      </div>
    </header>
  );
}
