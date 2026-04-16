import { useNavigate } from 'react-router';
import { StatusBadge } from '../components/StatusBadge';

const requests = [
  { id: '42', ticket: 'TSH-2026-0042', service: 'New Laptop Request', status: 'In Review', submitted: 'Apr 10, 2026' },
  { id: '41', ticket: 'TSH-2026-0041', service: 'VPN Access', status: 'Approved', submitted: 'Apr 9, 2026' },
  { id: '40', ticket: 'TSH-2026-0040', service: 'Leave Request', status: 'Submitted', submitted: 'Apr 8, 2026' },
  { id: '39', ticket: 'TSH-2026-0039', service: 'Software Access', status: 'Completed', submitted: 'Apr 7, 2026' },
  { id: '38', ticket: 'TSH-2026-0038', service: 'Meeting Room', status: 'Approved', submitted: 'Apr 7, 2026' },
  { id: '37', ticket: 'TSH-2026-0037', service: 'Expense Reimbursement', status: 'Rejected', submitted: 'Apr 5, 2026' },
];

export function RequesterRequests() {
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-5xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, color: '#111827' }}>My Requests</h1>
      <p style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>Track and manage your submitted requests</p>

      <div className="mt-6 bg-white border border-[#E5E7EB] rounded-xl overflow-hidden" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: '#F9FAFB' }}>
              {['Ticket', 'Service', 'Status', 'Submitted'].map((h) => (
                <th key={h} className="text-left px-4 py-3" style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.id} onClick={() => navigate(`/requester/requests/${r.id}`)} className="border-t border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors cursor-pointer">
                <td className="px-4 py-3" style={{ fontSize: 13, fontWeight: 500, fontFamily: 'JetBrains Mono, monospace', color: '#374151' }}>{r.ticket}</td>
                <td className="px-4 py-3" style={{ fontSize: 14, color: '#374151' }}>{r.service}</td>
                <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                <td className="px-4 py-3" style={{ fontSize: 12, color: '#6B7280' }}>{r.submitted}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
