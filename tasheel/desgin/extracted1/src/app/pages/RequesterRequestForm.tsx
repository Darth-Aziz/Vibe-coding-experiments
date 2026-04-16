import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const serviceInfo: Record<string, { name: string; category: string; sla: string }> = {
  '1': { name: 'New Laptop', category: 'IT', sla: '4 hours' },
  '2': { name: 'Software Access', category: 'IT', sla: '2 hours' },
  '3': { name: 'VPN Access', category: 'IT', sla: '1 hour' },
  '4': { name: 'Employee Onboarding', category: 'HR', sla: '24 hours' },
  '5': { name: 'Leave Request', category: 'HR', sla: '4 hours' },
  '6': { name: 'Meeting Room', category: 'Facilities', sla: '1 hour' },
  '7': { name: 'Expense Reimbursement', category: 'Finance', sla: '48 hours' },
};

export function RequesterRequestForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const info = serviceInfo[id || '1'] || serviceInfo['1'];
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success('Request submitted successfully!');
    setTimeout(() => navigate('/requester/requests'), 1500);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
      <button onClick={() => navigate('/requester')} className="flex items-center gap-1.5 text-[#6B7280] hover:text-[#374151] cursor-pointer mb-4" style={{ fontSize: 14, fontWeight: 500 }}>
        <ArrowLeft size={16} /> Back to Catalog
      </button>

      <div className="bg-[#EFF6FF] border border-[#DBEAFE] rounded-xl p-4 mb-6">
        <h2 style={{ fontSize: 18, fontWeight: 600, color: '#111827' }}>{info.name}</h2>
        <div className="flex gap-3 mt-1" style={{ fontSize: 13, color: '#6B7280' }}>
          <span>{info.category}</span><span>-</span><span>SLA: {info.sla}</span>
        </div>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-xl p-6" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#111827', marginBottom: 20 }}>Submit Request</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label style={{ fontSize: 14, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>Full Name <span className="text-[#DC2626]">*</span></label>
            <input required className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg focus:border-[#3B82F6] focus:ring-2 focus:ring-[#DBEAFE] outline-none" style={{ fontSize: 14, height: 36 }} />
          </div>
          <div>
            <label style={{ fontSize: 14, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>Department <span className="text-[#DC2626]">*</span></label>
            <select required className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg focus:border-[#3B82F6] outline-none bg-white" style={{ fontSize: 14, height: 36 }}>
              <option value="">Select...</option>
              <option>Engineering</option>
              <option>Marketing</option>
              <option>Sales</option>
              <option>HR</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 14, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>Description <span className="text-[#DC2626]">*</span></label>
            <textarea required rows={4} className="w-full px-3 py-2 border border-[#D1D5DB] rounded-lg focus:border-[#3B82F6] focus:ring-2 focus:ring-[#DBEAFE] outline-none resize-none" style={{ fontSize: 14 }} />
          </div>
          <div>
            <label style={{ fontSize: 14, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>Urgency <span className="text-[#DC2626]">*</span></label>
            <div className="flex gap-4">
              {['Low', 'Medium', 'High'].map((u) => (
                <label key={u} className="flex items-center gap-1.5 cursor-pointer" style={{ fontSize: 14, color: '#374151', fontWeight: 400 }}>
                  <input type="radio" name="urgency" value={u} required className="accent-[#2563EB]" /> {u}
                </label>
              ))}
            </div>
          </div>
          <button type="submit" disabled={submitted} className="mt-2 px-5 py-2.5 rounded-lg text-white cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50" style={{ background: '#2563EB', fontSize: 14, fontWeight: 500 }}>
            {submitted ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>
    </div>
  );
}
