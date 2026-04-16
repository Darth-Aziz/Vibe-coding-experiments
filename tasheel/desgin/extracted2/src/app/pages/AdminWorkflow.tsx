import { ZoomIn, ZoomOut, Undo, Redo, Save } from 'lucide-react';

const steps = [
  { id: 1, label: 'Submit', x: 100, y: 180, type: 'start' },
  { id: 2, label: 'IT Review', x: 300, y: 180, type: 'task' },
  { id: 3, label: 'Manager Approval', x: 500, y: 180, type: 'task' },
  { id: 4, label: 'Procurement', x: 700, y: 180, type: 'task' },
  { id: 5, label: 'Delivered', x: 900, y: 180, type: 'end' },
];

export function AdminWorkflow() {
  return (
    <div className="p-6" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 600, color: '#111827' }}>Workflow Designer</h1>
          <p style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>New Laptop Request</p>
        </div>
        <div className="flex gap-2">
          {[
            { icon: Undo, label: 'Undo' },
            { icon: Redo, label: 'Redo' },
            { icon: ZoomIn, label: 'Zoom In' },
            { icon: ZoomOut, label: 'Zoom Out' },
          ].map((btn) => (
            <button key={btn.label} className="p-2 rounded-lg border border-[#E5E7EB] hover:bg-[#F9FAFB] cursor-pointer" title={btn.label}>
              <btn.icon size={16} className="text-[#6B7280]" />
            </button>
          ))}
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-white cursor-pointer hover:opacity-90" style={{ background: '#2563EB', fontSize: 14, fontWeight: 500 }}>
            <Save size={16} /> Save
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.05)', height: 'calc(100vh - 160px)' }}>
        <svg width="100%" height="100%" style={{ background: 'repeating-conic-gradient(#F3F4F6 0% 25%, transparent 0% 50%) 0 0 / 20px 20px' }}>
          {/* Connections */}
          {steps.slice(0, -1).map((step, i) => (
            <line key={`line-${i}`} x1={step.x + 60} y1={step.y} x2={steps[i + 1].x - 60} y2={steps[i + 1].y} stroke="#D1D5DB" strokeWidth={2} markerEnd="url(#arrow)" />
          ))}
          <defs>
            <marker id="arrow" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill="#D1D5DB" />
            </marker>
          </defs>

          {steps.map((step) => (
            <g key={step.id}>
              {step.type === 'start' ? (
                <circle cx={step.x} cy={step.y} r={20} fill="#D1FAE5" stroke="#059669" strokeWidth={2} />
              ) : step.type === 'end' ? (
                <circle cx={step.x} cy={step.y} r={20} fill="#0F172A" stroke="#0F172A" strokeWidth={2} />
              ) : (
                <rect x={step.x - 60} y={step.y - 25} width={120} height={50} rx={8} fill="white" stroke="#E5E7EB" strokeWidth={1.5} className="cursor-move" />
              )}
              <text x={step.x} y={step.y + (step.type === 'start' || step.type === 'end' ? 45 : 5)} textAnchor="middle" style={{ fontSize: 12, fontWeight: 500, fill: step.type === 'end' ? '#111827' : '#374151' }}>
                {step.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
