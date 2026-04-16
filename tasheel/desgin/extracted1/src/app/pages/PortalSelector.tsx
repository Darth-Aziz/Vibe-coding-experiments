import { useNavigate } from 'react-router';
import { Shield, User, ArrowRight } from 'lucide-react';

export function PortalSelector() {
  const navigate = useNavigate();

  const portals = [
    {
      icon: Shield,
      title: 'Admin Portal',
      desc: 'Manage services, workflows & forms',
      path: '/admin',
      color: '#0F172A',
    },
    {
      icon: User,
      title: 'Requester Portal',
      desc: 'Browse services, submit requests',
      path: '/requester',
      color: '#2563EB',
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#F8FAFC', fontFamily: 'Inter, sans-serif' }}>
      <div className="text-center">
        <h1 style={{ fontSize: 30, fontWeight: 700, color: '#0F172A', lineHeight: 1.2 }}>Tasheel</h1>
        <p style={{ fontSize: 14, color: '#6B7280', marginTop: 8 }}>Service Management Platform</p>

        <div className="flex gap-6 mt-10">
          {portals.map((p) => (
            <button
              key={p.path}
              onClick={() => navigate(p.path)}
              className="bg-white border border-[#E5E7EB] rounded-xl p-6 w-64 text-left hover:shadow-md hover:border-[#D1D5DB] transition-all cursor-pointer group"
              style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ background: p.color }}>
                <p.icon size={20} className="text-white" strokeWidth={1.5} />
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#111827' }}>{p.title}</h3>
              <p style={{ fontSize: 14, color: '#6B7280', marginTop: 4, lineHeight: 1.5 }}>{p.desc}</p>
              <div className="mt-4 flex items-center gap-1.5 text-[#2563EB] group-hover:gap-2.5 transition-all" style={{ fontSize: 14, fontWeight: 500 }}>
                Enter <ArrowRight size={16} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
