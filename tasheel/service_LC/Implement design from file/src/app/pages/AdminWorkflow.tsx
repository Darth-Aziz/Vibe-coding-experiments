import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Handle,
  Position,
  Connection,
  Edge,
  NodeProps,
  Node,
  ReactFlowProvider,
  MarkerType,
  BackgroundVariant,
  useReactFlow
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { 
  ArrowLeft, Check, Save, Search, Play, 
  Split, Mail, User, Settings, Layers, GripVertical, Trash2,
  GitBranch, Zap, Plus, Globe, Database, MessageSquare, Circle,
  X, Settings2, Square, MoreHorizontal, MousePointerClick,
  FileText, Link2, Variable, ChevronDown, ChevronRight, 
  Clock, CheckCircle2, XCircle, AlertTriangle, RotateCcw,
  Braces, Hash, ToggleLeft, ArrowRight, Pause, SkipForward,
  StepForward, History, Eye, Timer, Workflow
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { motion, AnimatePresence } from 'motion/react';

// --- CONFIGURATION ---

const ACTION_TYPES: Record<string, { icon: any, label: string, color: string, bg: string }> = {
  email: { icon: Mail, label: 'Send Email', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500/10' },
  webhook: { icon: Globe, label: 'Webhook POST', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-500/10' },
  update_record: { icon: Database, label: 'Update Record', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
  slack: { icon: MessageSquare, label: 'Slack Alert', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10' },
};

// --- FORM FIELDS (simulated from Form Builder) ---

const AVAILABLE_FORMS = [
  { id: 'form_laptop', name: 'Hardware Refresh (Laptop)', fields: [
    { id: 'f1', name: 'employee_name', label: 'Employee Name', type: 'text' },
    { id: 'f2', name: 'department', label: 'Department', type: 'select' },
    { id: 'f3', name: 'laptop_model', label: 'Laptop Model', type: 'select' },
    { id: 'f4', name: 'justification', label: 'Business Justification', type: 'textarea' },
    { id: 'f5', name: 'budget_amount', label: 'Budget Amount', type: 'number' },
    { id: 'f6', name: 'priority', label: 'Priority', type: 'select' },
    { id: 'f7', name: 'manager_email', label: 'Manager Email', type: 'email' },
  ]},
  { id: 'form_access', name: 'System Access Request', fields: [
    { id: 'f10', name: 'system_name', label: 'System Name', type: 'select' },
    { id: 'f11', name: 'access_level', label: 'Access Level', type: 'select' },
    { id: 'f12', name: 'reason', label: 'Reason', type: 'textarea' },
  ]},
  { id: 'form_leave', name: 'Leave Request', fields: [
    { id: 'f20', name: 'leave_type', label: 'Leave Type', type: 'select' },
    { id: 'f21', name: 'start_date', label: 'Start Date', type: 'date' },
    { id: 'f22', name: 'end_date', label: 'End Date', type: 'date' },
  ]},
];

const SYSTEM_VARIABLES = [
  { id: 'sys_submitter', name: 'sys.submitter_name', label: 'Submitter Name', group: 'System' },
  { id: 'sys_email', name: 'sys.submitter_email', label: 'Submitter Email', group: 'System' },
  { id: 'sys_date', name: 'sys.submission_date', label: 'Submission Date', group: 'System' },
  { id: 'sys_id', name: 'sys.request_id', label: 'Request ID', group: 'System' },
  { id: 'sys_status', name: 'sys.current_status', label: 'Current Status', group: 'System' },
  { id: 'wf_approver', name: 'wf.last_approver', label: 'Last Approver', group: 'Workflow' },
  { id: 'wf_decision', name: 'wf.approval_decision', label: 'Approval Decision', group: 'Workflow' },
  { id: 'wf_comments', name: 'wf.approval_comments', label: 'Approval Comments', group: 'Workflow' },
];

const CONDITION_OPERATORS = [
  { value: 'equals', label: '== equals' },
  { value: 'not_equals', label: '!= not equals' },
  { value: 'contains', label: 'contains' },
  { value: 'gt', label: '> greater than' },
  { value: 'lt', label: '< less than' },
  { value: 'gte', label: '>= greater or equal' },
  { value: 'lte', label: '<= less or equal' },
  { value: 'is_empty', label: 'is empty' },
  { value: 'is_not_empty', label: 'is not empty' },
];

// --- CUSTOM NODES (BPMN Standardized) ---

const StartNode = ({ data, selected }: NodeProps) => {
  const simStatus = data.simStatus as string | undefined;
  const ringClass = simStatus === 'active' ? 'ring-4 ring-emerald-500/40 border-emerald-500 animate-pulse' 
    : simStatus === 'completed' ? 'ring-4 ring-emerald-500/20 border-emerald-500' 
    : selected ? 'ring-4 ring-emerald-500/20 border-emerald-500' 
    : 'border-emerald-600/60 hover:border-emerald-500';
  
  return (
    <div className={`relative rounded-full w-12 h-12 flex items-center justify-center bg-background transition-all ${ringClass} border-[1.5px] shadow-sm`}>
      <Play className="w-4 h-4 text-emerald-600 ml-0.5 opacity-80" />
      <Handle type="source" position={Position.Right} className="w-2 h-2 bg-emerald-500 !border-2 !border-background" />
      <div className="absolute -bottom-6 whitespace-nowrap text-[10px] font-medium text-muted-foreground">
        {data.label as string}
      </div>
      {simStatus === 'completed' && (
        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center shadow-sm">
          <Check className="w-2.5 h-2.5 text-white" />
        </div>
      )}
    </div>
  );
};

const EndNode = ({ data, selected }: NodeProps) => {
  const simStatus = data.simStatus as string | undefined;
  const ringClass = simStatus === 'active' ? 'ring-4 ring-emerald-500/40 border-emerald-500 animate-pulse'
    : simStatus === 'completed' ? 'ring-4 ring-emerald-500/20 border-emerald-500'
    : selected ? 'ring-4 ring-destructive/20 border-destructive' 
    : 'border-destructive/80 hover:border-destructive';

  return (
    <div className={`relative rounded-full w-12 h-12 flex items-center justify-center bg-background transition-all ${ringClass} border-[3.5px] shadow-sm`}>
      <Square className="w-3.5 h-3.5 text-destructive/80 fill-destructive/20" />
      <Handle type="target" position={Position.Left} className="w-2 h-2 bg-destructive !border-2 !border-background" />
      <div className="absolute -bottom-6 whitespace-nowrap text-[10px] font-medium text-muted-foreground">
        {data.label as string}
      </div>
      {simStatus === 'completed' && (
        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center shadow-sm">
          <Check className="w-2.5 h-2.5 text-white" />
        </div>
      )}
    </div>
  );
};

const TaskNode = ({ data, selected }: NodeProps) => {
  const actions = (data.actions as any[]) || [];
  const isApproval = data.taskType === 'approval';
  const simStatus = data.simStatus as string | undefined;
  
  const borderClass = simStatus === 'active' ? 'border-blue-500 ring-2 ring-blue-500/30 shadow-blue-500/10 shadow-lg' 
    : simStatus === 'completed' ? 'border-emerald-500 ring-2 ring-emerald-500/20' 
    : simStatus === 'skipped' ? 'border-muted-foreground/30 opacity-50'
    : selected ? 'border-primary ring-2 ring-primary/20' 
    : 'border-border/80 hover:border-border';
  
  return (
    <div className={`flex flex-col min-w-[220px] max-w-[260px] bg-background rounded-lg border transition-all shadow-sm ${borderClass}`}>
      <Handle type="target" position={Position.Left} className="w-2 h-2 bg-muted-foreground !border-2 !border-background" />
      
      <div className="px-3 py-2 border-b border-border/40 flex items-center justify-between bg-muted/20 rounded-t-lg">
        <div className="flex items-center gap-2">
          {isApproval ? (
            <User className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          ) : (
            <Settings2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          )}
          <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-muted-foreground">
            {isApproval ? 'User Task' : 'Service Task'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {actions.length > 0 && (
            <div className="flex items-center justify-center bg-background border border-border/60 text-[9px] font-mono font-bold text-muted-foreground h-4 px-1.5 rounded-sm shadow-sm">
              {actions.length}
            </div>
          )}
          {simStatus === 'completed' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
          {simStatus === 'active' && <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />}
        </div>
      </div>

      <div className="px-3 py-3 flex flex-col gap-1.5">
        <div className="text-sm font-medium text-foreground leading-tight">{data.label as string}</div>
        {data.assignee && isApproval && (
          <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
            <div className="w-4 h-4 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600 text-[8px] font-bold shrink-0 border border-blue-500/20">
              {(data.assignee as string).substring(0, 2).toUpperCase()}
            </div>
            <span className="truncate">{data.assignee as string}</span>
          </div>
        )}
      </div>

      {actions.length > 0 && (
        <div className="px-1.5 pb-1.5">
          <div className="bg-muted/30 rounded-md border border-border/40 p-1.5 flex flex-wrap gap-1">
            {actions.map((act) => {
              const TypeIcon = ACTION_TYPES[act.type]?.icon || Circle;
              const typeColor = ACTION_TYPES[act.type]?.color || 'text-muted-foreground';
              const typeBg = ACTION_TYPES[act.type]?.bg || 'bg-muted';
              return (
                <div key={act.id} className={`flex items-center justify-center w-5 h-5 rounded ${typeBg} border border-border/20`} title={act.label}>
                  <TypeIcon className={`w-3 h-3 ${typeColor}`} />
                </div>
              );
            })}
          </div>
        </div>
      )}

      <Handle type="source" position={Position.Right} className="w-2 h-2 bg-muted-foreground !border-2 !border-background" />
    </div>
  );
};

const GatewayNode = ({ data, selected }: NodeProps) => {
  const simStatus = data.simStatus as string | undefined;
  const borderClass = simStatus === 'active' ? 'border-amber-500 ring-4 ring-amber-500/30 animate-pulse'
    : simStatus === 'completed' ? 'border-emerald-500 ring-4 ring-emerald-500/20'
    : selected ? 'border-amber-500 ring-4 ring-amber-500/20' 
    : 'border-amber-500/60 hover:border-amber-500';

  return (
    <div className="relative flex items-center justify-center w-12 h-12 group">
      <Handle type="target" position={Position.Left} className="w-2 h-2 bg-amber-500 !border-2 !border-background absolute -left-1 z-10" />
      <div className={`absolute inset-0 bg-background border-[1.5px] transition-all transform rotate-45 rounded-sm ${borderClass} shadow-sm`} />
      <X className="w-5 h-5 text-amber-600/80 z-10 stroke-[3]" />
      <Handle type="source" position={Position.Top} id="top" className="w-2 h-2 bg-amber-500 !border-2 !border-background absolute -top-1 z-10" />
      <Handle type="source" position={Position.Right} id="right" className="w-2 h-2 bg-amber-500 !border-2 !border-background absolute -right-1 z-10" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="w-2 h-2 bg-amber-500 !border-2 !border-background absolute -bottom-1 z-10" />
      <div className="absolute -bottom-6 whitespace-nowrap text-[10px] font-medium text-muted-foreground">
        {data.label as string}
      </div>
      {simStatus === 'completed' && (
        <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center shadow-sm z-20">
          <Check className="w-2.5 h-2.5 text-white" />
        </div>
      )}
    </div>
  );
};

const nodeTypes = {
  start: StartNode,
  end: EndNode,
  task: TaskNode,
  gateway: GatewayNode,
};

// --- INITIAL DATA ---

const initialNodes: Node[] = [
  { id: '1', type: 'start', position: { x: 50, y: 250 }, data: { label: 'Request Submitted' } },
  { 
    id: '2', 
    type: 'task', 
    position: { x: 180, y: 202 }, 
    data: { 
      label: 'Line Manager Approval', 
      taskType: 'approval', 
      assignee: 'Manager',
      actions: [
        { id: 'a1', type: 'email', label: 'Notify Manager via Email', variableMap: { to: '{{form.manager_email}}', subject: 'Approval Required: {{form.employee_name}}', body: 'Please review request {{sys.request_id}}' } },
        { id: 'a2', type: 'update_record', label: 'Set Status: Pending Approval', variableMap: { field: 'status', value: 'pending_approval' } }
      ]
    } 
  },
  { id: '3', type: 'gateway', position: { x: 520, y: 236 }, data: { 
    label: 'Is Approved?',
    conditions: {
      'top': [{ id: 'c1', field: 'wf.approval_decision', operator: 'equals', value: 'approved' }],
      'bottom': [{ id: 'c2', field: 'wf.approval_decision', operator: 'equals', value: 'rejected' }],
    }
  }},
  { 
    id: '4', 
    type: 'task', 
    position: { x: 650, y: 80 }, 
    data: { 
      label: 'IT Fulfillment', 
      taskType: 'task', 
      assignee: 'IT Team',
      actions: [
        { id: 'a3', type: 'webhook', label: 'POST to Jira (Create Issue)', variableMap: { url: 'https://jira.company.com/api/issue', payload: '{"summary": "{{form.laptop_model}} for {{form.employee_name}}", "priority": "{{form.priority}}"}' } },
        { id: 'a4', type: 'slack', label: 'Alert #it-ops channel', variableMap: { channel: '#it-ops', message: 'New fulfillment: {{form.laptop_model}} for {{form.employee_name}} ({{sys.request_id}})' } }
      ]
    } 
  },
  { 
    id: '5', 
    type: 'task', 
    position: { x: 650, y: 340 }, 
    data: { 
      label: 'Notify Rejection', 
      taskType: 'task', 
      assignee: 'System',
      actions: [
        { id: 'a5', type: 'email', label: 'Send Rejection Email', variableMap: { to: '{{sys.submitter_email}}', subject: 'Request {{sys.request_id}} Denied', body: 'Your request was rejected. Comments: {{wf.approval_comments}}' } },
        { id: 'a6', type: 'update_record', label: 'Close Request (Denied)', variableMap: { field: 'status', value: 'rejected' } }
      ]
    } 
  },
  { id: '6', type: 'end', position: { x: 1000, y: 122 }, data: { label: 'Fulfilled' } },
  { id: '7', type: 'end', position: { x: 1000, y: 382 }, data: { label: 'Rejected' } },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed, color: '#9ca3af' }, style: { stroke: '#9ca3af', strokeWidth: 1.5 } },
  { id: 'e2-3', source: '2', target: '3', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed, color: '#9ca3af' }, style: { stroke: '#9ca3af', strokeWidth: 1.5 } },
  { id: 'e3-4', source: '3', target: '4', sourceHandle: 'top', type: 'smoothstep', label: 'Yes', labelStyle: { fill: '#374151', fontSize: 11, fontWeight: 600, fontFamily: 'Inter' }, labelBgStyle: { fill: '#ffffff', fillOpacity: 0.9, stroke: '#e5e7eb', strokeWidth: 1, rx: 4, ry: 4 }, labelBgPadding: [6, 4] as [number, number], markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' }, style: { stroke: '#10b981', strokeWidth: 1.5 }, animated: true },
  { id: 'e3-5', source: '3', target: '5', sourceHandle: 'bottom', type: 'smoothstep', label: 'No', labelStyle: { fill: '#374151', fontSize: 11, fontWeight: 600, fontFamily: 'Inter' }, labelBgStyle: { fill: '#ffffff', fillOpacity: 0.9, stroke: '#e5e7eb', strokeWidth: 1, rx: 4, ry: 4 }, labelBgPadding: [6, 4] as [number, number], markerEnd: { type: MarkerType.ArrowClosed, color: '#ef4444' }, style: { stroke: '#ef4444', strokeWidth: 1.5 } },
  { id: 'e4-6', source: '4', target: '6', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed, color: '#9ca3af' }, style: { stroke: '#9ca3af', strokeWidth: 1.5 } },
  { id: 'e5-7', source: '5', target: '7', type: 'smoothstep', markerEnd: { type: MarkerType.ArrowClosed, color: '#9ca3af' }, style: { stroke: '#9ca3af', strokeWidth: 1.5 } },
];

const nodePalette = [
  { type: 'start', label: 'Start Event', icon: Circle, desc: 'Triggers workflow' },
  { type: 'task', label: 'User Task', icon: User, desc: 'Human approval/input', data: { taskType: 'approval', actions: [] } },
  { type: 'task', label: 'Service Task', icon: Settings2, desc: 'Automated system action', data: { taskType: 'task', actions: [] } },
  { type: 'gateway', label: 'Exclusive Gateway', icon: Split, desc: 'XOR decision branching' },
  { type: 'end', label: 'End Event', icon: Square, desc: 'Terminates process path' },
];

// --- SIMULATION ENGINE ---

interface SimulationStep {
  nodeId: string;
  edgeId?: string;
  label: string;
  type: string;
  status: 'pending' | 'active' | 'completed' | 'skipped';
  timestamp: string;
  duration?: number;
  detail?: string;
}

interface SimulationRun {
  id: string;
  name: string;
  timestamp: string;
  status: 'completed' | 'failed' | 'running';
  path: string[];
  steps: SimulationStep[];
  duration: number;
}

const MOCK_HISTORY: SimulationRun[] = [
  {
    id: 'run_001',
    name: 'Approval Path (Approved)',
    timestamp: '2026-04-16T09:32:00Z',
    status: 'completed',
    path: ['1', '2', '3', '4', '6'],
    steps: [
      { nodeId: '1', label: 'Request Submitted', type: 'start', status: 'completed', timestamp: '09:32:00', duration: 120 },
      { nodeId: '2', label: 'Line Manager Approval', type: 'task', status: 'completed', timestamp: '09:32:02', duration: 3400, detail: 'Approved by Ahmed K.' },
      { nodeId: '3', label: 'Is Approved?', type: 'gateway', status: 'completed', timestamp: '09:32:36', duration: 50, detail: 'Evaluated: Yes path' },
      { nodeId: '4', label: 'IT Fulfillment', type: 'task', status: 'completed', timestamp: '09:32:37', duration: 890, detail: 'Jira ISS-4421 created' },
      { nodeId: '6', label: 'Fulfilled', type: 'end', status: 'completed', timestamp: '09:32:46' },
    ],
    duration: 4460,
  },
  {
    id: 'run_002',
    name: 'Rejection Path',
    timestamp: '2026-04-15T14:12:00Z',
    status: 'completed',
    path: ['1', '2', '3', '5', '7'],
    steps: [
      { nodeId: '1', label: 'Request Submitted', type: 'start', status: 'completed', timestamp: '14:12:00', duration: 90 },
      { nodeId: '2', label: 'Line Manager Approval', type: 'task', status: 'completed', timestamp: '14:12:01', duration: 7200, detail: 'Rejected by Sara M.' },
      { nodeId: '3', label: 'Is Approved?', type: 'gateway', status: 'completed', timestamp: '14:14:01', duration: 45, detail: 'Evaluated: No path' },
      { nodeId: '5', label: 'Notify Rejection', type: 'task', status: 'completed', timestamp: '14:14:02', duration: 340, detail: 'Email sent to requester' },
      { nodeId: '7', label: 'Rejected', type: 'end', status: 'completed', timestamp: '14:14:05' },
    ],
    duration: 7675,
  },
];

// --- VARIABLE PICKER COMPONENT ---

function VariablePicker({ onInsert, linkedFormId }: { onInsert: (variable: string) => void, linkedFormId: string | null }) {
  const [open, setOpen] = useState(false);
  const form = AVAILABLE_FORMS.find(f => f.id === linkedFormId);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-[10px] font-medium text-primary hover:text-primary/80 transition-colors px-1.5 py-0.5 rounded hover:bg-primary/5"
      >
        <Braces className="w-3 h-3" /> Insert Variable
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.12 }}
            className="absolute bottom-full left-0 mb-1 w-[260px] bg-popover border border-border/60 rounded-lg shadow-xl z-50 overflow-hidden"
          >
            <div className="max-h-[280px] overflow-y-auto">
              {form && (
                <div className="p-1.5">
                  <div className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest px-2 py-1.5 flex items-center gap-1.5">
                    <FileText className="w-3 h-3" /> Form Fields
                  </div>
                  {form.fields.map(f => (
                    <button
                      key={f.id}
                      className="w-full flex items-center gap-2 px-2 py-1.5 text-xs hover:bg-muted/60 rounded-md transition-colors text-left"
                      onClick={() => { onInsert(`{{form.${f.name}}}`); setOpen(false); }}
                    >
                      <code className="text-[10px] font-mono text-primary bg-primary/5 px-1.5 py-0.5 rounded border border-primary/10 truncate max-w-[140px]">
                        form.{f.name}
                      </code>
                      <span className="text-muted-foreground truncate">{f.label}</span>
                    </button>
                  ))}
                </div>
              )}
              <div className="p-1.5 border-t border-border/40">
                <div className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest px-2 py-1.5 flex items-center gap-1.5">
                  <Settings className="w-3 h-3" /> System & Workflow
                </div>
                {SYSTEM_VARIABLES.map(v => (
                  <button
                    key={v.id}
                    className="w-full flex items-center gap-2 px-2 py-1.5 text-xs hover:bg-muted/60 rounded-md transition-colors text-left"
                    onClick={() => { onInsert(`{{${v.name}}}`); setOpen(false); }}
                  >
                    <code className="text-[10px] font-mono text-amber-600 bg-amber-500/5 px-1.5 py-0.5 rounded border border-amber-500/10 truncate max-w-[140px]">
                      {v.name}
                    </code>
                    <span className="text-muted-foreground truncate">{v.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- CONDITION ROW COMPONENT ---

function ConditionRow({ condition, onChange, onRemove, linkedFormId }: { 
  condition: { id: string, field: string, operator: string, value: string }, 
  onChange: (key: string, value: string) => void, 
  onRemove: () => void,
  linkedFormId: string | null 
}) {
  const form = AVAILABLE_FORMS.find(f => f.id === linkedFormId);
  const allFields = [
    ...(form?.fields.map(f => ({ value: `form.${f.name}`, label: f.label, group: 'Form' })) || []),
    ...SYSTEM_VARIABLES.map(v => ({ value: v.name, label: v.label, group: v.group })),
  ];

  return (
    <div className="flex items-center gap-1.5 group">
      <Select value={condition.field} onValueChange={(v) => onChange('field', v)}>
        <SelectTrigger className="h-7 text-[11px] flex-1 min-w-0 bg-background shadow-sm border-border/60 font-mono">
          <SelectValue placeholder="Field..." />
        </SelectTrigger>
        <SelectContent>
          {allFields.map(f => (
            <SelectItem key={f.value} value={f.value} className="text-xs font-mono">{f.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={condition.operator} onValueChange={(v) => onChange('operator', v)}>
        <SelectTrigger className="h-7 text-[11px] w-[110px] bg-background shadow-sm border-border/60 font-mono shrink-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {CONDITION_OPERATORS.map(op => (
            <SelectItem key={op.value} value={op.value} className="text-xs font-mono">{op.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      {condition.operator !== 'is_empty' && condition.operator !== 'is_not_empty' && (
        <Input
          value={condition.value}
          onChange={(e) => onChange('value', e.target.value)}
          placeholder="Value..."
          className="h-7 text-[11px] w-[80px] bg-background shadow-sm border-border/60 font-mono shrink-0"
        />
      )}
      <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all" onClick={onRemove}>
        <X className="w-3 h-3" />
      </Button>
    </div>
  );
}

// --- MAIN ---

let id = 100;
const getId = () => `dndnode_${id++}`;

function Designer() {
  const navigate = useNavigate();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [activeTab, setActiveTab] = useState<'settings' | 'actions' | 'conditions' | 'variables'>('settings');
  
  // Form Trigger state
  const [linkedFormId, setLinkedFormId] = useState<string | null>('form_laptop');
  const [triggerEvent, setTriggerEvent] = useState('on_submit');
  const [showTriggerPanel, setShowTriggerPanel] = useState(false);
  
  // Simulation state
  const [simMode, setSimMode] = useState(false);
  const [simRunning, setSimRunning] = useState(false);
  const [simCurrentStep, setSimCurrentStep] = useState(-1);
  const [simPath, setSimPath] = useState<string[]>([]);
  const [simSteps, setSimSteps] = useState<SimulationStep[]>([]);
  const [simDecision, setSimDecision] = useState<'approved' | 'rejected'>('approved');
  const [showHistory, setShowHistory] = useState(false);
  const simTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const linkedForm = AVAILABLE_FORMS.find(f => f.id === linkedFormId);

  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge({ 
    ...params, 
    type: 'smoothstep',
    style: { stroke: '#9ca3af', strokeWidth: 1.5 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#9ca3af' }
  }, eds)), [setEdges]);

  const onDragStart = (event: React.DragEvent, nodeType: string, defaultData?: any) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    if (defaultData) {
      event.dataTransfer.setData('application/reactflow-data', JSON.stringify(defaultData));
    }
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      const dataStr = event.dataTransfer.getData('application/reactflow-data');
      let extraData = {};
      if (dataStr) {
        try { extraData = JSON.parse(dataStr); } catch (e) {}
      }
      if (typeof type === 'undefined' || !type || !reactFlowInstance) return;
      const position = reactFlowInstance.screenToFlowPosition({ x: event.clientX, y: event.clientY });
      const newNode: Node = { id: getId(), type, position, data: { label: `New ${type}`, ...extraData } };
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const onSelectionChange = useCallback(({ nodes: selNodes }: { nodes: Node[] }) => {
    if (selNodes.length > 0) {
      setSelectedNode(selNodes[0]);
      setSelectedEdge(null);
      if (selNodes[0].type === 'gateway') setActiveTab('conditions');
      else if (selNodes[0].type === 'task') setActiveTab('settings');
      else setActiveTab('settings');
    } else {
      setSelectedNode(null);
    }
  }, []);

  const onEdgeClick = useCallback((_: any, edge: Edge) => {
    setSelectedEdge(edge);
    setSelectedNode(null);
  }, []);

  const updateSelectedNode = (key: string, value: any) => {
    if (!selectedNode) return;
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode.id) {
          return { ...node, data: { ...node.data, [key]: value } };
        }
        return node;
      })
    );
    setSelectedNode((prev) => prev ? { ...prev, data: { ...prev.data, [key]: value } } : null);
  };

  const addAction = () => {
    if (!selectedNode) return;
    const currentActions = selectedNode.data.actions as any[] || [];
    const newAction = { id: `act_${Date.now()}`, type: 'email', label: 'New Action', variableMap: {} };
    updateSelectedNode('actions', [...currentActions, newAction]);
  };

  const updateAction = (actionId: string, key: string, value: any) => {
    if (!selectedNode) return;
    const currentActions = selectedNode.data.actions as any[] || [];
    const updatedActions = currentActions.map(a => a.id === actionId ? { ...a, [key]: value } : a);
    updateSelectedNode('actions', updatedActions);
  };

  const updateActionVariable = (actionId: string, varKey: string, varValue: string) => {
    if (!selectedNode) return;
    const currentActions = selectedNode.data.actions as any[] || [];
    const updatedActions = currentActions.map(a => {
      if (a.id === actionId) {
        return { ...a, variableMap: { ...a.variableMap, [varKey]: varValue } };
      }
      return a;
    });
    updateSelectedNode('actions', updatedActions);
  };

  const removeAction = (actionId: string) => {
    if (!selectedNode) return;
    const currentActions = selectedNode.data.actions as any[] || [];
    updateSelectedNode('actions', currentActions.filter(a => a.id !== actionId));
  };

  // Gateway condition helpers
  const getGatewayConditions = (handleId: string): any[] => {
    if (!selectedNode) return [];
    const conditions = (selectedNode.data.conditions as Record<string, any[]>) || {};
    return conditions[handleId] || [];
  };

  const updateGatewayConditions = (handleId: string, conditions: any[]) => {
    if (!selectedNode) return;
    const allConditions = (selectedNode.data.conditions as Record<string, any[]>) || {};
    updateSelectedNode('conditions', { ...allConditions, [handleId]: conditions });
  };

  const addCondition = (handleId: string) => {
    const current = getGatewayConditions(handleId);
    updateGatewayConditions(handleId, [...current, { id: `cond_${Date.now()}`, field: '', operator: 'equals', value: '' }]);
  };

  const updateCondition = (handleId: string, condId: string, key: string, value: string) => {
    const current = getGatewayConditions(handleId);
    updateGatewayConditions(handleId, current.map(c => c.id === condId ? { ...c, [key]: value } : c));
  };

  const removeCondition = (handleId: string, condId: string) => {
    const current = getGatewayConditions(handleId);
    updateGatewayConditions(handleId, current.filter(c => c.id !== condId));
  };

  // Get outgoing edges for gateway
  const getOutgoingEdges = () => {
    if (!selectedNode) return [];
    return edges.filter(e => e.source === selectedNode.id);
  };

  // --- SIMULATION ---
  const startSimulation = () => {
    setSimMode(true);
    setSimRunning(true);
    setSimCurrentStep(0);
    
    const path = simDecision === 'approved' 
      ? ['1', 'e1-2', '2', 'e2-3', '3', 'e3-4', '4', 'e4-6', '6']
      : ['1', 'e1-2', '2', 'e2-3', '3', 'e3-5', '5', 'e5-7', '7'];
    
    const nodeIds = path.filter(p => !p.startsWith('e'));
    const skippedNodes = simDecision === 'approved' ? ['5', '7'] : ['4', '6'];
    
    setSimPath(path);
    
    const steps: SimulationStep[] = nodeIds.map((nId, i) => {
      const node = initialNodes.find(n => n.id === nId);
      return {
        nodeId: nId,
        label: (node?.data.label as string) || nId,
        type: node?.type || 'unknown',
        status: 'pending',
        timestamp: new Date(Date.now() + i * 1200).toLocaleTimeString(),
        duration: Math.floor(Math.random() * 2000) + 200,
        detail: nId === '3' ? `Evaluated: ${simDecision === 'approved' ? 'Yes' : 'No'} path` : undefined,
      };
    });
    setSimSteps(steps);

    // Clear sim status from all nodes first
    setNodes(nds => nds.map(n => ({ ...n, data: { ...n.data, simStatus: skippedNodes.includes(n.id) ? 'skipped' : undefined } })));
    setEdges(eds => eds.map(e => ({
      ...e,
      style: { ...e.style, stroke: '#9ca3af', strokeWidth: 1.5, opacity: (skippedNodes.includes(e.target) ? 0.3 : 1) },
      animated: false,
    })));

    // Animate step by step
    let stepIdx = 0;
    const runStep = () => {
      if (stepIdx >= nodeIds.length) {
        setSimRunning(false);
        return;
      }
      const currentNodeId = nodeIds[stepIdx];
      const currentEdgeId = path.find(p => p.startsWith('e') && path.indexOf(p) === path.indexOf(currentNodeId) - 1);
      
      setSimCurrentStep(stepIdx);
      setSimSteps(prev => prev.map((s, i) => ({
        ...s,
        status: i < stepIdx ? 'completed' : i === stepIdx ? 'active' : 'pending'
      })));
      
      // Highlight current node
      setNodes(nds => nds.map(n => ({
        ...n,
        data: {
          ...n.data,
          simStatus: n.id === currentNodeId ? 'active' 
            : nodeIds.indexOf(n.id) < stepIdx && nodeIds.indexOf(n.id) >= 0 ? 'completed'
            : skippedNodes.includes(n.id) ? 'skipped'
            : n.data.simStatus
        }
      })));

      // Highlight edge
      if (currentEdgeId) {
        setEdges(eds => eds.map(e => ({
          ...e,
          animated: e.id === currentEdgeId,
          style: {
            ...e.style,
            stroke: e.id === currentEdgeId ? '#2563eb' : (path.includes(e.id) && path.indexOf(e.id) < path.indexOf(currentEdgeId) ? '#10b981' : e.style?.stroke || '#9ca3af'),
            strokeWidth: e.id === currentEdgeId ? 2.5 : (e.style?.strokeWidth || 1.5),
            opacity: skippedNodes.includes(e.target) ? 0.3 : 1,
          }
        })));
      }

      stepIdx++;
      simTimerRef.current = setTimeout(runStep, 1200);
    };
    
    runStep();
  };

  const stopSimulation = () => {
    setSimRunning(false);
    if (simTimerRef.current) clearTimeout(simTimerRef.current);
    // Mark all completed
    setSimSteps(prev => prev.map(s => ({ ...s, status: s.status === 'pending' ? 'pending' : 'completed' })));
  };

  const resetSimulation = () => {
    setSimMode(false);
    setSimRunning(false);
    setSimCurrentStep(-1);
    setSimPath([]);
    setSimSteps([]);
    if (simTimerRef.current) clearTimeout(simTimerRef.current);
    // Clear all sim statuses
    setNodes(nds => nds.map(n => ({ ...n, data: { ...n.data, simStatus: undefined } })));
    setEdges(initialEdges);
  };

  useEffect(() => {
    return () => { if (simTimerRef.current) clearTimeout(simTimerRef.current); };
  }, []);

  // Variable mapping fields based on action type
  const getActionFields = (type: string) => {
    switch (type) {
      case 'email': return ['to', 'subject', 'body'];
      case 'webhook': return ['url', 'method', 'payload'];
      case 'update_record': return ['field', 'value'];
      case 'slack': return ['channel', 'message'];
      default: return ['value'];
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#FDFDFD] dark:bg-background font-sans text-foreground selection:bg-primary/10">
      {/* Top Navigation */}
      <header className="flex-none h-14 border-b border-border/40 bg-white/70 dark:bg-background/70 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0" onClick={() => navigate('/admin/services')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="h-4 w-px bg-border/60 mx-1" />
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors">Services</span>
            <span className="text-muted-foreground/40 text-sm">/</span>
            <h1 className="text-sm font-semibold tracking-tight">Hardware Refresh (Laptop)</h1>
            <Badge variant="secondary" className="h-5 px-1.5 text-[10px] uppercase font-mono tracking-wider ml-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 rounded-sm border-0">
              Draft
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Form Trigger Indicator */}
          <button 
            onClick={() => setShowTriggerPanel(!showTriggerPanel)}
            className={`flex items-center gap-1.5 h-8 px-3 rounded-md text-xs font-medium border transition-colors ${linkedFormId ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10' : 'bg-muted/50 border-border/60 text-muted-foreground hover:bg-muted'}`}
          >
            <Link2 className="w-3.5 h-3.5" />
            {linkedFormId ? linkedForm?.name : 'Link Form'}
          </button>
          
          <div className="h-4 w-px bg-border/60" />
          
          <div className="flex items-center text-[11px] font-medium text-muted-foreground mr-1">
            <Check className="w-3.5 h-3.5 mr-1 text-emerald-500" /> Saved
          </div>
          
          {!simMode ? (
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs font-medium border-border/60 shadow-sm" onClick={() => setSimMode(true)}>
              <Play className="w-3.5 h-3.5 text-emerald-600" /> Simulate
            </Button>
          ) : (
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs font-medium border-destructive/30 text-destructive hover:bg-destructive/5 shadow-sm" onClick={resetSimulation}>
              <X className="w-3.5 h-3.5" /> Exit Sim
            </Button>
          )}
          
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs font-medium border-border/60 shadow-sm" onClick={() => setShowHistory(!showHistory)}>
            <History className="w-3.5 h-3.5" /> History
          </Button>
          
          <Button size="sm" className="h-8 gap-1.5 shadow-sm text-xs font-medium bg-primary hover:bg-primary/90 text-primary-foreground">
            <Save className="w-3.5 h-3.5 opacity-80" /> Publish
          </Button>
        </div>
      </header>

      {/* Form Trigger Panel */}
      <AnimatePresence>
        {showTriggerPanel && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-b border-border/40 bg-white/90 dark:bg-card/90 backdrop-blur-xl overflow-hidden z-30"
          >
            <div className="px-6 py-4 flex items-start gap-6">
              <div className="flex items-center gap-2 shrink-0 pt-0.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <Workflow className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <div className="text-xs font-semibold">Workflow Trigger</div>
                  <div className="text-[10px] text-muted-foreground">How this workflow starts</div>
                </div>
              </div>
              
              <div className="flex-1 grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Linked Form</Label>
                  <Select value={linkedFormId || ''} onValueChange={(v) => setLinkedFormId(v || null)}>
                    <SelectTrigger className="h-9 text-xs bg-background shadow-sm border-border/60">
                      <SelectValue placeholder="Select a form..." />
                    </SelectTrigger>
                    <SelectContent>
                      {AVAILABLE_FORMS.map(f => (
                        <SelectItem key={f.id} value={f.id} className="text-xs">
                          <div className="flex items-center gap-2">
                            <FileText className="w-3.5 h-3.5 text-muted-foreground" /> {f.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Trigger Event</Label>
                  <Select value={triggerEvent} onValueChange={setTriggerEvent}>
                    <SelectTrigger className="h-9 text-xs bg-background shadow-sm border-border/60">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="on_submit" className="text-xs">On Form Submission</SelectItem>
                      <SelectItem value="on_update" className="text-xs">On Record Update</SelectItem>
                      <SelectItem value="on_status_change" className="text-xs">On Status Change</SelectItem>
                      <SelectItem value="scheduled" className="text-xs">Scheduled (Cron)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Available Fields</Label>
                  <div className="flex items-center gap-1 flex-wrap">
                    {linkedForm?.fields.slice(0, 4).map(f => (
                      <Badge key={f.id} variant="outline" className="text-[9px] font-mono bg-background h-5 border-border/60">
                        {f.name}
                      </Badge>
                    ))}
                    {(linkedForm?.fields.length || 0) > 4 && (
                      <Badge variant="secondary" className="text-[9px] h-5">+{(linkedForm?.fields.length || 0) - 4}</Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 text-muted-foreground" onClick={() => setShowTriggerPanel(false)}>
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Studio Layout */}
      <div className="flex-1 flex overflow-hidden w-full relative">
        
        {/* Left Sidebar: Nodes Palette / Sim Controls */}
        <aside className="w-[260px] bg-white/50 dark:bg-card/50 backdrop-blur-sm border-r border-border/40 flex flex-col h-full z-10 shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.01)]">
          {!simMode ? (
            <>
              <div className="p-4 pb-2 flex flex-col gap-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                  <Input placeholder="Filter elements..." className="h-9 pl-9 bg-background/50 border-border/60 text-xs shadow-sm focus-visible:bg-background rounded-md" />
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto px-3 pb-6">
                <div className="space-y-6 mt-2">
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-2 flex items-center gap-1.5">
                      <GitBranch className="w-3 h-3" /> BPMN Elements
                    </h4>
                    <div className="grid grid-cols-1 gap-0.5">
                      {nodePalette.map((node, i) => (
                        <div
                          key={i}
                          draggable
                          onDragStart={(e) => onDragStart(e, node.type, node.data)}
                          className="group flex items-center gap-3 px-2 py-2 bg-transparent rounded-md text-sm text-foreground hover:bg-muted/60 transition-all text-left border border-transparent hover:border-border/50 cursor-grab active:cursor-grabbing"
                        >
                          <div className="w-8 h-8 rounded flex flex-col items-center justify-center shrink-0 transition-colors bg-background border border-border/60 shadow-sm group-hover:border-primary/30 group-hover:text-primary text-muted-foreground">
                            <node.icon className="w-4 h-4" strokeWidth={2} />
                          </div>
                          <div className="flex flex-col flex-1 min-w-0">
                            <span className="font-medium text-xs truncate">{node.label}</span>
                            <span className="text-[10px] text-muted-foreground truncate">{node.desc}</span>
                          </div>
                          <GripVertical className="w-3.5 h-3.5 opacity-0 group-hover:opacity-40 text-muted-foreground transition-opacity shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Simulation Controls */
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-border/40 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                    <Play className="w-3 h-3 text-blue-600 ml-0.5" />
                  </div>
                  <span className="text-sm font-semibold">Simulation</span>
                  {simRunning && (
                    <Badge className="ml-auto bg-blue-500/10 text-blue-600 border-0 text-[9px] animate-pulse">Running</Badge>
                  )}
                </div>
                
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Simulated Decision</Label>
                  <Select value={simDecision} onValueChange={(v: any) => setSimDecision(v)} disabled={simRunning}>
                    <SelectTrigger className="h-9 text-xs bg-background shadow-sm border-border/60">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="approved" className="text-xs">
                        <div className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Approved Path</div>
                      </SelectItem>
                      <SelectItem value="rejected" className="text-xs">
                        <div className="flex items-center gap-2"><XCircle className="w-3.5 h-3.5 text-destructive" /> Rejected Path</div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex gap-2">
                  {!simRunning ? (
                    <Button size="sm" className="flex-1 h-8 gap-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white" onClick={startSimulation}>
                      <Play className="w-3.5 h-3.5" /> Run
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" className="flex-1 h-8 gap-1.5 text-xs" onClick={stopSimulation}>
                      <Pause className="w-3.5 h-3.5" /> Pause
                    </Button>
                  )}
                  <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs" onClick={resetSimulation}>
                    <RotateCcw className="w-3.5 h-3.5" /> Reset
                  </Button>
                </div>
              </div>
              
              {/* Step Timeline */}
              <div className="flex-1 overflow-y-auto p-4">
                <h4 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <Layers className="w-3 h-3" /> Execution Steps
                </h4>
                <div className="space-y-0">
                  {simSteps.map((step, i) => (
                    <div key={step.nodeId} className="flex gap-3 relative">
                      {/* Timeline Line */}
                      {i < simSteps.length - 1 && (
                        <div className={`absolute left-[11px] top-6 w-0.5 h-[calc(100%-8px)] ${step.status === 'completed' ? 'bg-emerald-500' : step.status === 'active' ? 'bg-blue-500 animate-pulse' : 'bg-border'}`} />
                      )}
                      {/* Status Dot */}
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 z-10 ${
                        step.status === 'completed' ? 'bg-emerald-500 border-emerald-500' 
                        : step.status === 'active' ? 'bg-blue-500 border-blue-500 animate-pulse'
                        : 'bg-background border-border'
                      }`}>
                        {step.status === 'completed' ? <Check className="w-3 h-3 text-white" /> 
                         : step.status === 'active' ? <div className="w-2 h-2 rounded-full bg-white" /> 
                         : <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />}
                      </div>
                      <div className="flex-1 pb-5">
                        <div className="text-xs font-medium">{step.label}</div>
                        <div className="text-[10px] text-muted-foreground flex items-center gap-2 mt-0.5">
                          <span className="font-mono">{step.timestamp}</span>
                          {step.duration && step.status === 'completed' && (
                            <span className="font-mono text-emerald-600">+{step.duration}ms</span>
                          )}
                        </div>
                        {step.detail && step.status !== 'pending' && (
                          <div className="text-[10px] text-muted-foreground mt-1 bg-muted/50 px-2 py-1 rounded border border-border/40 font-mono">
                            {step.detail}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {simSteps.length === 0 && (
                    <div className="text-xs text-muted-foreground text-center py-6">
                      Configure a path and click Run to start simulation.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* Center: Interactive Canvas */}
        <main className="flex-1 relative bg-muted/10" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onSelectionChange={onSelectionChange}
            onEdgeClick={onEdgeClick}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.15 }}
            proOptions={{ hideAttribution: true }}
            minZoom={0.2}
            maxZoom={1.5}
            defaultEdgeOptions={{
              type: 'smoothstep',
              style: { stroke: '#9ca3af', strokeWidth: 1.5 },
            }}
          >
            <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="var(--color-border)" style={{ opacity: 0.8 }} />
            <Controls className="bg-background border-border/60 shadow-sm fill-foreground rounded-md overflow-hidden" showInteractive={false} />
            <MiniMap 
              className="bg-background border-border/60 shadow-sm rounded-lg overflow-hidden mb-4 mr-4" 
              maskColor="rgba(var(--background), 0.7)"
              nodeColor={(n) => {
                if (n.data?.simStatus === 'active') return '#2563eb';
                if (n.data?.simStatus === 'completed') return '#10b981';
                if (n.type === 'start') return '#10b981';
                if (n.type === 'end') return '#ef4444';
                if (n.type === 'gateway') return '#f59e0b';
                return '#e5e7eb';
              }}
            />
          </ReactFlow>
        </main>

        {/* Right Sidebar: Properties Panel */}
        <aside className="w-[360px] bg-white/80 dark:bg-card/80 backdrop-blur-xl border-l border-border/40 flex flex-col h-full z-10 shrink-0 shadow-[-4px_0_24px_rgba(0,0,0,0.02)]">
          {selectedNode ? (
            <>
              {/* Context Header */}
              <div className="h-14 border-b border-border/40 flex items-center justify-between px-5 bg-transparent shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                    <Settings className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm font-semibold tracking-tight">Properties</span>
                </div>
                <Badge variant="outline" className="text-[9px] font-mono uppercase bg-background shadow-sm border-border/60 text-muted-foreground">
                  {selectedNode.type}
                </Badge>
              </div>

              {/* Tab Navigation */}
              <div className="flex items-center px-4 pt-3 pb-0 border-b border-border/40 gap-4">
                <button 
                  className={`pb-2 text-xs font-medium border-b-2 transition-colors ${activeTab === 'settings' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                  onClick={() => setActiveTab('settings')}
                >
                  General
                </button>
                {selectedNode.type === 'task' && (
                  <>
                    <button 
                      className={`pb-2 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${activeTab === 'actions' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                      onClick={() => setActiveTab('actions')}
                    >
                      Execution
                      <Badge variant="secondary" className="h-4 px-1 text-[9px] bg-muted">{((selectedNode.data.actions as any[]) || []).length}</Badge>
                    </button>
                    <button 
                      className={`pb-2 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${activeTab === 'variables' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                      onClick={() => setActiveTab('variables')}
                    >
                      <Variable className="w-3 h-3" /> Mapping
                    </button>
                  </>
                )}
                {selectedNode.type === 'gateway' && (
                  <button 
                    className={`pb-2 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${activeTab === 'conditions' ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                    onClick={() => setActiveTab('conditions')}
                  >
                    <Split className="w-3 h-3" /> Conditions
                  </button>
                )}
              </div>

              {/* Properties Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-5 space-y-6">
                  
                  {/* General Tab */}
                  {activeTab === 'settings' && (
                    <div className="space-y-5">
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Node Label</Label>
                        <Input
                          value={(selectedNode.data?.label as string) || ''}
                          onChange={(e) => updateSelectedNode('label', e.target.value)}
                          className="font-medium bg-background border-border/60 shadow-sm focus-visible:ring-1 focus-visible:ring-primary h-9 text-sm"
                        />
                      </div>

                      {selectedNode.type === 'task' && (
                        <>
                          <div className="space-y-1.5">
                            <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Task Type</Label>
                            <Select value={(selectedNode.data?.taskType as string) || 'task'} onValueChange={(val) => updateSelectedNode('taskType', val)}>
                              <SelectTrigger className="h-9 bg-background shadow-sm border-border/60 text-xs font-medium">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="approval"><div className="flex items-center gap-2"><User className="w-3.5 h-3.5 text-blue-500" /> User Task (Manual)</div></SelectItem>
                                <SelectItem value="task"><div className="flex items-center gap-2"><Settings2 className="w-3.5 h-3.5 text-amber-500" /> Service Task (Auto)</div></SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {selectedNode.data?.taskType === 'approval' && (
                            <div className="space-y-1.5">
                              <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Assignee / Group</Label>
                              <Select value={(selectedNode.data?.assignee as string) || ''} onValueChange={(val) => updateSelectedNode('assignee', val)}>
                                <SelectTrigger className="h-9 bg-background shadow-sm border-border/60 text-xs">
                                  <SelectValue placeholder="Select assignee..." />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Manager">Line Manager</SelectItem>
                                  <SelectItem value="IT Team">IT Team</SelectItem>
                                  <SelectItem value="HR Team">HR Team</SelectItem>
                                  <SelectItem value="Security">Security Dept</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </>
                      )}

                      {selectedNode.type === 'gateway' && (
                        <div className="space-y-1.5">
                          <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Routing Logic</Label>
                          <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-md text-xs text-amber-700 dark:text-amber-400/80 leading-relaxed flex items-start gap-2 mt-1">
                            <Split className="w-4 h-4 shrink-0 mt-0.5" />
                            This is an Exclusive (XOR) Gateway. Configure conditions in the Conditions tab to define branching logic.
                          </div>
                        </div>
                      )}
                      
                      <Separator className="bg-border/50" />
                      
                      <Button 
                        variant="ghost" 
                        className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 h-8 justify-start px-2.5 -ml-1 text-xs"
                        onClick={() => { setNodes((nds) => nds.filter(n => n.id !== selectedNode.id)); setSelectedNode(null); }}
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-2" />
                        <span className="font-medium">Delete Node</span>
                      </Button>
                    </div>
                  )}

                  {/* Conditions Tab (Gateway) */}
                  {activeTab === 'conditions' && selectedNode.type === 'gateway' && (
                    <div className="space-y-5">
                      <div className="text-[11px] text-muted-foreground leading-relaxed">
                        Define conditions for each outgoing path. The first matching condition determines the route taken at runtime.
                      </div>

                      {getOutgoingEdges().map((edge) => {
                        const handleId = edge.sourceHandle || 'right';
                        const conditions = getGatewayConditions(handleId);
                        const targetNode = nodes.find(n => n.id === edge.target);
                        const edgeLabel = (edge.label as string) || targetNode?.data?.label as string || edge.target;
                        const isYes = (edge.label as string)?.toLowerCase() === 'yes';
                        const isNo = (edge.label as string)?.toLowerCase() === 'no';
                        
                        return (
                          <div key={edge.id} className="space-y-3">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${isYes ? 'bg-emerald-500' : isNo ? 'bg-destructive' : 'bg-amber-500'}`} />
                              <span className="text-xs font-semibold">{edgeLabel}</span>
                              <ArrowRight className="w-3 h-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground truncate">{targetNode?.data?.label as string}</span>
                            </div>
                            
                            <div className="ml-4 space-y-2 border-l-2 border-border/40 pl-3">
                              {conditions.length === 0 && (
                                <div className="text-[10px] text-muted-foreground italic py-1">
                                  No conditions — this will be the default path.
                                </div>
                              )}
                              {conditions.map((cond: any) => (
                                <ConditionRow
                                  key={cond.id}
                                  condition={cond}
                                  linkedFormId={linkedFormId}
                                  onChange={(key, value) => updateCondition(handleId, cond.id, key, value)}
                                  onRemove={() => removeCondition(handleId, cond.id)}
                                />
                              ))}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-[11px] text-muted-foreground hover:text-primary gap-1 px-2"
                                onClick={() => addCondition(handleId)}
                              >
                                <Plus className="w-3 h-3" /> Add Condition
                              </Button>
                            </div>
                          </div>
                        );
                      })}

                      {getOutgoingEdges().length === 0 && (
                        <div className="p-4 bg-muted/30 rounded-lg border border-border/40 text-center">
                          <AlertTriangle className="w-5 h-5 text-amber-500 mx-auto mb-2" />
                          <div className="text-xs font-medium">No outgoing connections</div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">
                            Connect this gateway to downstream nodes to configure conditions.
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions Tab */}
                  {activeTab === 'actions' && selectedNode.type === 'task' && (
                    <div className="space-y-4">
                      <div className="text-[11px] text-muted-foreground leading-relaxed">
                        Configure ordered execution steps that trigger when this task activates.
                      </div>

                      <div className="space-y-2.5">
                        {(selectedNode.data.actions as any[])?.map((act, idx) => {
                          const TypeIcon = ACTION_TYPES[act.type]?.icon || Circle;
                          const typeColor = ACTION_TYPES[act.type]?.color || 'text-muted-foreground';

                          return (
                            <div key={act.id} className="group relative border border-border/60 rounded-md bg-background shadow-sm focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all overflow-hidden">
                              <div className="absolute left-0 top-0 bottom-0 w-6 bg-muted/40 border-r border-border/40 flex flex-col items-center py-2 gap-1 justify-between">
                                <span className="text-[9px] font-mono font-bold text-muted-foreground/60">{idx + 1}</span>
                                <GripVertical className="w-3 h-3 text-muted-foreground/30 cursor-grab hover:text-muted-foreground" />
                              </div>
                              
                              <div className="pl-8 pr-2 py-2 space-y-2">
                                <div className="flex items-center justify-between">
                                  <Select value={act.type} onValueChange={(val) => updateAction(act.id, 'type', val)}>
                                    <SelectTrigger className="h-6 w-[140px] text-[11px] font-medium bg-transparent border-transparent shadow-none p-0 focus:ring-0 hover:bg-muted/50 rounded px-1 transition-colors -ml-1">
                                      <div className="flex items-center gap-1.5">
                                        <TypeIcon className={`w-3.5 h-3.5 ${typeColor}`} />
                                        <SelectValue />
                                      </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                      {Object.entries(ACTION_TYPES).map(([k, v]) => (
                                        <SelectItem key={k} value={k} className="text-xs">
                                          <div className="flex items-center gap-1.5">
                                            <v.icon className={`w-3.5 h-3.5 ${v.color}`} /> {v.label}
                                          </div>
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <Button variant="ghost" size="icon" className="h-5 w-5 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all rounded-sm" onClick={() => removeAction(act.id)}>
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                                <Input
                                  value={act.label}
                                  onChange={(e) => updateAction(act.id, 'label', e.target.value)}
                                  placeholder="Action description..."
                                  className="h-7 text-xs border-border/40 bg-muted/20 shadow-none px-2 focus-visible:ring-1 focus-visible:ring-primary/50 placeholder:text-muted-foreground/50 font-medium rounded-sm"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full border-dashed border-border/60 hover:border-primary/50 hover:bg-primary/5 gap-1.5 h-9 mt-2 text-muted-foreground hover:text-primary transition-colors shadow-none" 
                        onClick={addAction}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span className="text-xs font-semibold">Add Execution Step</span>
                      </Button>
                    </div>
                  )}

                  {/* Variables / Mapping Tab */}
                  {activeTab === 'variables' && selectedNode.type === 'task' && (
                    <div className="space-y-5">
                      <div className="text-[11px] text-muted-foreground leading-relaxed">
                        Map dynamic variables from form fields and system context into each action's parameters.
                      </div>

                      {!linkedFormId && (
                        <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-md text-xs text-amber-700 dark:text-amber-400/80 leading-relaxed flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                          No form linked. Link a form in the trigger panel to access form field variables.
                        </div>
                      )}

                      {(selectedNode.data.actions as any[])?.map((act, idx) => {
                        const TypeIcon = ACTION_TYPES[act.type]?.icon || Circle;
                        const typeColor = ACTION_TYPES[act.type]?.color || 'text-muted-foreground';
                        const fields = getActionFields(act.type);
                        const varMap = act.variableMap || {};

                        return (
                          <div key={act.id} className="space-y-2.5">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center justify-center w-5 h-5 rounded bg-muted border border-border/40">
                                <span className="text-[9px] font-mono font-bold text-muted-foreground">{idx + 1}</span>
                              </div>
                              <TypeIcon className={`w-3.5 h-3.5 ${typeColor}`} />
                              <span className="text-xs font-medium truncate">{act.label}</span>
                            </div>
                            
                            <div className="ml-7 space-y-2 border-l-2 border-border/30 pl-3">
                              {fields.map(fieldKey => (
                                <div key={fieldKey} className="space-y-1">
                                  <div className="flex items-center justify-between">
                                    <Label className="text-[10px] font-mono font-semibold text-muted-foreground">{fieldKey}</Label>
                                    <VariablePicker
                                      linkedFormId={linkedFormId}
                                      onInsert={(v) => updateActionVariable(act.id, fieldKey, (varMap[fieldKey] || '') + v)}
                                    />
                                  </div>
                                  <Input
                                    value={varMap[fieldKey] || ''}
                                    onChange={(e) => updateActionVariable(act.id, fieldKey, e.target.value)}
                                    placeholder={`Enter value or use {{variables}}...`}
                                    className="h-7 text-[11px] font-mono bg-background border-border/40 shadow-sm px-2 focus-visible:ring-1 focus-visible:ring-primary/50 rounded-sm"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}

                      {((selectedNode.data.actions as any[]) || []).length === 0 && (
                        <div className="p-4 bg-muted/30 rounded-lg border border-border/40 text-center">
                          <Variable className="w-5 h-5 text-muted-foreground/50 mx-auto mb-2" />
                          <div className="text-xs font-medium">No actions to map</div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">
                            Add execution steps in the Execution tab first.
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-muted/5">
              <div className="w-16 h-16 rounded-full bg-background border border-border shadow-sm flex items-center justify-center mb-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 opacity-50" />
                <MousePointerClick className="w-6 h-6 text-muted-foreground/50 relative z-10" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">No Selection</h3>
              <p className="text-xs text-muted-foreground max-w-[220px] leading-relaxed">
                Click on any node in the canvas to view and configure its properties.
              </p>
            </div>
          )}
        </aside>

      </div>

      {/* Run History Drawer */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 h-[320px] bg-white dark:bg-card border-t border-border/60 shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-3 border-b border-border/40 shrink-0">
              <div className="flex items-center gap-2.5">
                <History className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-semibold">Simulation History</span>
                <Badge variant="secondary" className="text-[10px]">{MOCK_HISTORY.length} runs</Badge>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowHistory(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border/40 text-muted-foreground">
                    <th className="text-left px-6 py-2.5 font-semibold text-[10px] uppercase tracking-widest">Run</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-[10px] uppercase tracking-widest">Status</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-[10px] uppercase tracking-widest">Path</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-[10px] uppercase tracking-widest">Duration</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-[10px] uppercase tracking-widest">Steps</th>
                    <th className="text-left px-4 py-2.5 font-semibold text-[10px] uppercase tracking-widest">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_HISTORY.map((run) => (
                    <tr key={run.id} className="border-b border-border/20 hover:bg-muted/30 transition-colors cursor-pointer">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <code className="font-mono text-[10px] text-muted-foreground">{run.id}</code>
                          <span className="font-medium">{run.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={`text-[9px] border-0 ${run.status === 'completed' ? 'bg-emerald-500/10 text-emerald-600' : run.status === 'failed' ? 'bg-destructive/10 text-destructive' : 'bg-blue-500/10 text-blue-600'}`}>
                          {run.status === 'completed' ? <CheckCircle2 className="w-3 h-3 mr-1" /> : run.status === 'failed' ? <XCircle className="w-3 h-3 mr-1" /> : <Timer className="w-3 h-3 mr-1" />}
                          {run.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {run.steps.map((step, i) => (
                            <div key={i} className="flex items-center gap-1">
                              <div className={`w-1.5 h-1.5 rounded-full ${step.type === 'start' ? 'bg-emerald-500' : step.type === 'end' ? 'bg-destructive' : step.type === 'gateway' ? 'bg-amber-500' : 'bg-primary'}`} />
                              {i < run.steps.length - 1 && <div className="w-3 h-px bg-border" />}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-muted-foreground">{(run.duration / 1000).toFixed(1)}s</td>
                      <td className="px-4 py-3 font-mono text-muted-foreground">{run.steps.length}</td>
                      <td className="px-4 py-3 text-muted-foreground">{new Date(run.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function AdminWorkflow() {
  return (
    <ReactFlowProvider>
      <Designer />
    </ReactFlowProvider>
  );
}
