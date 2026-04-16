import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, Monitor, Laptop, Users, Building, Wallet, Key, Box, Briefcase, Server, ShieldCheck, FileText } from 'lucide-react';
import { useServices } from '../context/ServiceContext';

const categories = ['All', 'IT', 'HR', 'Facilities', 'Finance'];

export function RequesterCatalog() {
  const navigate = useNavigate();
  const { services } = useServices();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  // Map icon strings to actual lucide components
  const getIcon = (iconName: string | undefined) => {
    switch (iconName) {
      case 'monitor': return Monitor;
      case 'laptop': return Laptop;
      case 'briefcase': return Briefcase;
      case 'box': return Box;
      case 'server': return Server;
      case 'users': return Users;
      case 'building': return Building;
      case 'wallet': return Wallet;
      case 'key': return Key;
      case 'shield-check': return ShieldCheck;
      default: return FileText;
    }
  };

  const filtered = services.filter((s) => {
    // Only show published services
    if (s.status !== 'Published') return false;
    if (filter !== 'All' && s.category !== filter) return false;
    if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="flex items-center justify-between mb-4">
        <h1 style={{ fontSize: 24, fontWeight: 600, color: '#111827' }}>Service Catalog</h1>
        <div className="relative w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          <input 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            placeholder="Search services..." 
            className="w-full pl-9 pr-3 py-2 border border-[#D1D5DB] rounded-lg focus:border-[#3B82F6] focus:ring-2 focus:ring-[#DBEAFE] outline-none" 
            style={{ fontSize: 14, height: 36 }} 
          />
        </div>
      </div>

      <div className="flex gap-1 mb-6">
        {categories.map((c) => (
          <button 
            key={c} 
            onClick={() => setFilter(c)} 
            className={`px-4 py-1.5 rounded-full cursor-pointer transition-colors ${filter === c ? 'bg-[#2563EB] text-white' : 'bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]'}`} 
            style={{ fontSize: 13, fontWeight: 500 }}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((s) => {
          const Icon = getIcon(s.icon);
          return (
            <button 
              key={s.id} 
              onClick={() => navigate(`/requester/request/${s.id}`)} 
              className="bg-white border border-[#E5E7EB] rounded-xl p-5 text-left hover:shadow-md hover:border-[#D1D5DB] transition-all cursor-pointer group" 
              style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] flex items-center justify-center">
                  <Icon size={20} className="text-[#2563EB]" strokeWidth={1.5} />
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded-md bg-slate-100 text-slate-600">
                  {s.sla}
                </span>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#111827' }}>{s.name}</h3>
              <p style={{ fontSize: 13, color: '#6B7280', marginTop: 4, lineHeight: 1.5 }}>
                {s.description || `Request ${s.name.toLowerCase()} through this service.`}
              </p>
              <div className="mt-3 flex items-center gap-2" style={{ fontSize: 12, color: '#9CA3AF' }}>
                <span>{s.category}</span>
              </div>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500">
            <p>No services found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}