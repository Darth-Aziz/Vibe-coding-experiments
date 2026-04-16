import { useNavigate } from 'react-router';
import { FileText, CheckCircle, Clock, Inbox } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';

const stats = [
  { label: 'Total Services', value: 7, icon: FileText, color: '#2563EB', bg: '#DBEAFE' },
  { label: 'Published', value: 5, icon: CheckCircle, color: '#059669', bg: '#D1FAE5' },
  { label: 'Draft', value: 2, icon: Clock, color: '#F59E0B', bg: '#FEF3C7' },
  { label: 'Total Requests', value: 42, icon: Inbox, color: '#0284C7', bg: '#E0F2FE' },
];

const recentRequests = [
  { ticket: 'TSH-2026-0042', service: 'New Laptop Request', status: 'In Review', date: 'Apr 10, 2026', requester: 'Ahmed Al-Rashid' },
  { ticket: 'TSH-2026-0041', service: 'VPN Access', status: 'Approved', date: 'Apr 9, 2026', requester: 'Sara Al-Mahmoud' },
  { ticket: 'TSH-2026-0040', service: 'Leave Request', status: 'Submitted', date: 'Apr 8, 2026', requester: 'Omar Hassan' },
  { ticket: 'TSH-2026-0039', service: 'Software Access', status: 'Completed', date: 'Apr 7, 2026', requester: 'Layla Ibrahim' },
  { ticket: 'TSH-2026-0038', service: 'Meeting Room', status: 'Approved', date: 'Apr 7, 2026', requester: 'Khalid Noor' },
];

export function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-6" style={{ fontFamily: 'Inter, sans-serif' }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, color: '#111827' }}>Dashboard</h1>
      <p style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>Overview of your service management platform</p>

      <div className="grid grid-cols-4 gap-4 mt-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-[#E5E7EB] rounded-xl p-5" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <div className="flex items-center justify-between">
              <span style={{ fontSize: 12, fontWeight: 500, color: '#6B7280' }}>{s.label}</span>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: s.bg }}>
                <s.icon size={16} style={{ color: s.color }} strokeWidth={1.5} />
              </div>
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#111827', marginTop: 8 }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#111827' }}>Recent Requests</h2>
        </div>
        <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          <table className="w-full">
            <thead>
              <tr style={{ background: '#F9FAFB' }}>
                {['Ticket', 'Service', 'Requester', 'Status', 'Date'].map((h) => (
                  <th key={h} className="text-left px-4 py-3" style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentRequests.map((r) => (
                <tr key={r.ticket} className="border-t border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors">
                  <td className="px-4 py-3" style={{ fontSize: 13, fontWeight: 500, fontFamily: 'JetBrains Mono, monospace', color: '#374151' }}>{r.ticket}</td>
                  <td className="px-4 py-3" style={{ fontSize: 14, color: '#374151' }}>{r.service}</td>
                  <td className="px-4 py-3" style={{ fontSize: 14, color: '#374151' }}>{r.requester}</td>
                  <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                  <td className="px-4 py-3" style={{ fontSize: 12, color: '#6B7280' }}>{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button onClick={() => navigate('/admin/services/new')} className="px-5 py-2.5 rounded-lg text-white cursor-pointer hover:opacity-90 transition-opacity" style={{ background: '#2563EB', fontSize: 14, fontWeight: 500 }}>
          Create Service
        </button>
        <button onClick={() => navigate('/admin/services')} className="px-5 py-2.5 rounded-lg border border-[#E5E7EB] cursor-pointer hover:bg-[#F9FAFB] transition-colors" style={{ fontSize: 14, fontWeight: 500, color: '#374151' }}>
          View All Services
        </button>
      </div>
    </div>
  );
}
