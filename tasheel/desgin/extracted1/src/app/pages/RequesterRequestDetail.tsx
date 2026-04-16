import { useNavigate } from 'react-router';
import { ArrowLeft, CheckCircle, Circle } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';

const workflowSteps = [
  { label: 'Submitted', date: 'Apr 10', done: true },
  { label: 'IT Review', date: 'Apr 11', done: true },
  { label: 'Manager Approval', date: '', done: false, current: true },
  { label: 'Procurement', date: '', done: false },
  { label: 'Delivered', date: '', done: false },
];

const history = [
  { date: 'Apr 11, 10:30 AM', text: 'IT team started review', done: true },
  { date: 'Apr 10, 2:15 PM', text: 'Request submitted by Ahmed Al-Rashid', done: true },
];

const details = [
  { label: 'Employee', value: 'Ahmed Al-Rashid' },
  { label: 'Department', value: 'Engineering' },
  { label: 'Laptop Type', value: 'MacBook Pro 16"' },
  { label: 'Urgency', value: 'High' },
  { label: 'Justification', value: 'Current laptop is 4 years old and experiencing hardware failures.' },
];

export function RequesterRequestDetail() {
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-5xl mx-auto" style={{ fontFamily: 'Inter, sans-serif' }}>
      <button onClick={() => navigate('/requester/requests')} className="flex items-center gap-1.5 text-[#6B7280] hover:text-[#374151] cursor-pointer mb-4" style={{ fontSize: 14, fontWeight: 500 }}>
        <ArrowLeft size={16} /> Back to My Requests
      </button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <span style={{ fontSize: 13, fontWeight: 500, fontFamily: 'JetBrains Mono, monospace', color: '#6B7280' }}>TSH-2026-0042</span>
          <h1 style={{ fontSize: 24, fontWeight: 600, color: '#111827', marginTop: 4 }}>New Laptop Request</h1>
        </div>
        <StatusBadge status="In Review" />
      </div>

      {/* Workflow Progress */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 mb-6" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#111827', marginBottom: 20 }}>Workflow Progress</h2>
        <div className="flex items-center">
          {workflowSteps.map((step, i) => (
            <div key={step.label} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step.done ? 'bg-[#059669]' : step.current ? 'bg-[#2563EB]' : 'bg-[#E5E7EB]'}`}>
                  {step.done ? <CheckCircle size={16} className="text-white" /> : <Circle size={16} className={step.current ? 'text-white' : 'text-[#9CA3AF]'} />}
                </div>
                <span style={{ fontSize: 12, fontWeight: 500, color: step.done || step.current ? '#111827' : '#9CA3AF', marginTop: 8 }}>{step.label}</span>
                {step.date && <span style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{step.date}</span>}
                {step.current && <span style={{ fontSize: 11, color: '#2563EB', marginTop: 2 }}>Current</span>}
              </div>
              {i < workflowSteps.length - 1 && (
                <div className={`h-0.5 flex-1 -mt-6 ${step.done ? 'bg-[#059669]' : 'bg-[#E5E7EB]'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Request Details */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-6" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#111827', marginBottom: 16 }}>Request Details</h2>
          <div className="flex flex-col gap-3">
            {details.map((d) => (
              <div key={d.label}>
                <span style={{ fontSize: 12, fontWeight: 500, color: '#6B7280' }}>{d.label}</span>
                <p style={{ fontSize: 14, color: '#111827', marginTop: 2 }}>{d.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* History */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-6" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#111827', marginBottom: 16 }}>History</h2>
          <div className="flex flex-col gap-4">
            {history.map((h, i) => (
              <div key={i} className="flex gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 ${i === 0 ? 'bg-[#2563EB]' : 'bg-[#059669]'}`} />
                <div>
                  <span style={{ fontSize: 12, color: '#6B7280' }}>{h.date}</span>
                  <p style={{ fontSize: 14, color: '#374151', marginTop: 2 }}>{h.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
