import { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  Type, AlignLeft, Hash, AtSign, ChevronDown, Circle, CheckSquare, 
  Calendar, GripVertical, Trash2, Settings, ArrowLeft, Eye, Save, Plus,
  ListFilter, LayoutTemplate, MoreVertical, ShieldCheck, ToggleRight,
  GripHorizontal, FileText, Check, AlertCircle, Copy, Search
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Checkbox } from '../components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';

interface FormField {
  id: string;
  type: string;
  label: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
  helpText?: string;
  description?: string;
}

const fieldCategories = [
  {
    name: 'Text Inputs',
    items: [
      { type: 'text', label: 'Short Text', icon: Type, desc: 'Single line text' },
      { type: 'textarea', label: 'Long Text', icon: AlignLeft, desc: 'Multi-line text' },
      { type: 'number', label: 'Number', icon: Hash, desc: 'Numeric values' },
      { type: 'email', label: 'Email', icon: AtSign, desc: 'Email address' },
    ]
  },
  {
    name: 'Choices',
    items: [
      { type: 'dropdown', label: 'Dropdown', icon: ChevronDown, desc: 'Select from list' },
      { type: 'radio', label: 'Single Choice', icon: Circle, desc: 'Radio buttons' },
      { type: 'checkbox', label: 'Multiple Choice', icon: CheckSquare, desc: 'Checkboxes' },
    ]
  },
  {
    name: 'Advanced',
    items: [
      { type: 'date', label: 'Date Picker', icon: Calendar, desc: 'Date selection' },
      { type: 'file', label: 'File Upload', icon: FileText, desc: 'Upload documents' },
    ]
  }
];

const initialFields: FormField[] = [
  { id: '1', type: 'text', label: 'Employee Name', required: true, placeholder: 'e.g. Jane Doe' },
  { id: '2', type: 'dropdown', label: 'Department', required: true, options: ['Engineering', 'Marketing', 'Sales', 'Human Resources'] },
  { id: '3', type: 'dropdown', label: 'Laptop Model', required: true, options: ['MacBook Pro 14" (M3)', 'MacBook Pro 16" (M3 Max)', 'ThinkPad X1 Carbon', 'Dell XPS 15'] },
  { id: '4', type: 'textarea', label: 'Business Justification', required: true, placeholder: 'Please explain the business need for this hardware refresh...', helpText: 'Include details about how this impacts your current work.' },
  { id: '5', type: 'radio', label: 'Urgency Level', required: true, options: ['Low - Standard replacement', 'Medium - Current device degraded', 'High - Current device broken'] },
];

export function AdminFormBuilder() {
  const navigate = useNavigate();
  const [fields, setFields] = useState<FormField[]>(initialFields);
  const [selectedId, setSelectedId] = useState<string | null>('1');
  const [isHoveredId, setIsHoveredId] = useState<string | null>(null);

  const selected = fields.find((f) => f.id === selectedId);

  const addField = (type: string) => {
    const newField: FormField = {
      id: Date.now().toString(),
      type,
      label: `New ${type} field`,
      required: false,
      placeholder: '',
      options: ['dropdown', 'radio', 'checkbox'].includes(type) ? ['Option 1', 'Option 2'] : undefined,
    };
    setFields([...fields, newField]);
    setSelectedId(newField.id);
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  const removeField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const duplicateField = (field: FormField) => {
    const newField = { ...field, id: Date.now().toString() };
    const index = fields.findIndex(f => f.id === field.id);
    const newFields = [...fields];
    newFields.splice(index + 1, 0, newField);
    setFields(newFields);
    setSelectedId(newField.id);
  };

  return (
    <div className="flex flex-col h-screen bg-[#FDFDFD] dark:bg-background font-sans text-foreground">
      {/* Premium Top Navigation */}
      <header className="flex-none h-14 border-b border-border/40 bg-white/50 dark:bg-background/50 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0" onClick={() => navigate('/admin/services')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="h-4 w-px bg-border/60 mx-1" />
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors">Services</span>
            <span className="text-muted-foreground/40 text-sm">/</span>
            <h1 className="text-sm font-semibold tracking-tight">Hardware Refresh (Laptop)</h1>
            <Badge variant="secondary" className="h-5 px-1.5 text-[10px] uppercase font-mono tracking-wider ml-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 rounded-sm">
              Draft
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center text-xs text-muted-foreground mr-4">
            <Check className="w-3.5 h-3.5 mr-1" /> Saved 2m ago
          </div>
          <Button variant="outline" size="sm" className="h-8 gap-1.5 shadow-sm border-border/50 text-xs font-medium">
            <Eye className="w-3.5 h-3.5 text-muted-foreground" /> Preview Form
          </Button>
          <Button size="sm" className="h-8 gap-1.5 shadow-sm text-xs font-medium">
            <Save className="w-3.5 h-3.5 opacity-80" /> Publish
          </Button>
        </div>
      </header>

      {/* Main Studio Layout */}
      <div className="flex-1 flex overflow-hidden w-full relative">
        
        {/* Left Sidebar: Components Palette */}
        <aside className="w-[280px] bg-white dark:bg-card border-r border-border/40 flex flex-col h-full z-10 shrink-0">
          <div className="p-4 flex flex-col gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
              <Input placeholder="Search components..." className="h-9 pl-9 bg-muted/30 border-border/50 text-sm shadow-none focus-visible:bg-background" />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto px-3 pb-6">
            <div className="space-y-6">
              {fieldCategories.map((category) => (
                <div key={category.name} className="space-y-2.5">
                  <h4 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest px-1">{category.name}</h4>
                  <div className="grid grid-cols-1 gap-1">
                    {category.items.map((ft) => (
                      <button
                        key={ft.type}
                        onClick={() => addField(ft.type)}
                        className="group flex items-center gap-3 px-3 py-2 bg-transparent rounded-lg text-sm text-foreground hover:bg-muted/60 transition-all text-left border border-transparent hover:border-border/50"
                      >
                        <div className="w-8 h-8 rounded-md bg-muted/50 border border-border/30 flex flex-col items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/5 group-hover:border-primary/20 transition-colors shrink-0">
                          <ft.icon className="w-4 h-4" strokeWidth={2.5} />
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="font-medium text-xs truncate">{ft.label}</span>
                          <span className="text-[10px] text-muted-foreground truncate">{ft.desc}</span>
                        </div>
                        <Plus className="w-4 h-4 opacity-0 group-hover:opacity-100 text-primary transition-opacity shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Center: Canvas Workspace */}
        <main 
          className="flex-1 overflow-y-auto bg-dot-pattern flex justify-center relative"
          style={{
            backgroundImage: `radial-gradient(var(--border) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
            backgroundColor: 'var(--muted)',
            backgroundBlendMode: 'multiply'
          }}
          onClick={() => setSelectedId(null)}
        >
          <div className="max-w-[760px] w-full py-12 px-8 flex flex-col items-center">
            
            {/* The Form Document */}
            <div 
              className="w-full bg-white dark:bg-card shadow-sm border border-border/40 rounded-xl overflow-hidden ring-1 ring-black/5"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Form Header */}
              <div className="px-10 pt-12 pb-8 border-b border-border/20 group relative">
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground hover:text-foreground">
                    <Settings className="w-3.5 h-3.5 mr-1.5" /> Configure Service
                  </Button>
                </div>
                <h2 className="text-3xl font-semibold tracking-tight mb-3 text-foreground">Hardware Refresh (Laptop)</h2>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">
                  Please fill out this form to request a replacement for your existing company laptop. 
                  Approvals are required from your manager and the IT department before hardware is provisioned.
                </p>
              </div>

              {/* Form Body (Fields) */}
              <div className="p-6 space-y-2 min-h-[400px]">
                {fields.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground py-20">
                    <LayoutTemplate className="w-12 h-12 mb-4 opacity-20" />
                    <p className="text-sm font-medium text-foreground">Your form is empty</p>
                    <p className="text-xs mt-1">Drag and drop fields from the left panel.</p>
                  </div>
                ) : (
                  fields.map((field) => {
                    const isSelected = selectedId === field.id;
                    const isHovered = isHoveredId === field.id;
                    
                    return (
                      <div
                        key={field.id}
                        onMouseEnter={() => setIsHoveredId(field.id)}
                        onMouseLeave={() => setIsHoveredId(null)}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedId(field.id);
                        }}
                        className={`relative rounded-xl p-6 transition-all duration-200 cursor-pointer ${
                          isSelected 
                            ? 'bg-primary/[0.03] ring-2 ring-primary/60 shadow-sm z-10' 
                            : 'hover:bg-muted/40 ring-1 ring-transparent hover:ring-border/80'
                        }`}
                      >
                        {/* Drag Handle - Left Absolute */}
                        <div 
                          className={`absolute left-2 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground/40 hover:text-foreground cursor-grab transition-opacity ${
                            isHovered || isSelected ? 'opacity-100' : 'opacity-0'
                          }`}
                        >
                          <GripVertical className="w-4 h-4" />
                        </div>

                        {/* Actions Menu - Top Right */}
                        {(isHovered || isSelected) && (
                          <div className="absolute -top-3 right-4 flex items-center bg-card shadow-md border border-border/60 rounded-md overflow-hidden z-20">
                            <button 
                              className="p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                              title="Duplicate"
                              onClick={(e) => { e.stopPropagation(); duplicateField(field); }}
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <div className="w-px h-4 bg-border/60" />
                            <button 
                              className="p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                              title="Delete"
                              onClick={(e) => { e.stopPropagation(); removeField(field.id); }}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}

                        <div className="pl-4">
                          <div className="flex items-center justify-between mb-3">
                            <Label className="text-base font-medium flex items-center gap-1.5 cursor-pointer text-foreground">
                              {field.label}
                              {field.required && <span className="text-destructive font-bold">*</span>}
                            </Label>
                          </div>
                          
                          {field.description && (
                            <p className="text-sm text-muted-foreground mb-3">{field.description}</p>
                          )}
                          
                          {/* Field Input Mockup (Non-interactive) */}
                          <div className="pointer-events-none w-full max-w-xl">
                            {field.type === 'textarea' ? (
                              <Textarea 
                                placeholder={field.placeholder || "Enter your answer..."} 
                                className="bg-background/50 border-border/50 min-h-[100px] shadow-sm resize-none" 
                                readOnly
                              />
                            ) : field.type === 'dropdown' ? (
                              <div className="h-10 w-full rounded-md border border-border/50 bg-background/50 px-3 py-2 flex items-center justify-between shadow-sm">
                                <span className="text-sm text-muted-foreground">{field.placeholder || "Select an option..."}</span>
                                <ChevronDown className="w-4 h-4 text-muted-foreground opacity-50" />
                              </div>
                            ) : field.type === 'radio' ? (
                              <div className="flex flex-col gap-3">
                                {field.options?.map((opt, i) => (
                                  <div key={i} className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded-full border border-border/80 flex items-center justify-center bg-background shadow-sm" />
                                    <span className="text-sm text-foreground">{opt}</span>
                                  </div>
                                ))}
                              </div>
                            ) : field.type === 'checkbox' ? (
                              <div className="flex flex-col gap-3">
                                {field.options?.map((opt, i) => (
                                  <div key={i} className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded-[4px] border border-border/80 flex items-center justify-center bg-background shadow-sm" />
                                    <span className="text-sm text-foreground">{opt}</span>
                                  </div>
                                ))}
                              </div>
                            ) : field.type === 'date' ? (
                              <div className="relative">
                                <div className="h-10 w-full rounded-md border border-border/50 bg-background/50 pl-10 px-3 py-2 flex items-center shadow-sm">
                                  <span className="text-sm text-muted-foreground">MM/DD/YYYY</span>
                                </div>
                                <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/70" />
                              </div>
                            ) : field.type === 'file' ? (
                              <div className="h-24 w-full rounded-md border-2 border-dashed border-border/60 bg-muted/10 flex flex-col items-center justify-center gap-2">
                                <FileText className="w-6 h-6 text-muted-foreground/40" />
                                <span className="text-sm text-muted-foreground font-medium">Click to upload or drag and drop</span>
                              </div>
                            ) : (
                              <Input 
                                placeholder={field.placeholder || "Enter your answer..."} 
                                className="bg-background/50 border-border/50 shadow-sm" 
                                readOnly
                              />
                            )}
                          </div>
                          
                          {field.helpText && (
                            <p className="text-xs text-muted-foreground mt-2.5 flex items-start gap-1.5">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 opacity-60" />
                              {field.helpText}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}

                {/* Dropzone Footer */}
                <div 
                  className="mt-4 mb-2 rounded-xl border-2 border-dashed border-border/40 bg-transparent flex flex-col items-center justify-center text-muted-foreground hover:bg-primary/5 hover:border-primary/40 hover:text-primary transition-all cursor-pointer h-20 group"
                  onClick={() => setSelectedId(null)}
                >
                  <Plus className="w-5 h-5 mb-1 opacity-50 group-hover:opacity-100 transition-opacity" />
                  <span className="text-[13px] font-medium">Add Field</span>
                </div>

              </div>
            </div>
            
            {/* End of Form Paper */}
            <div className="h-20 w-full" />
          </div>
        </main>

        {/* Right Sidebar: Field Properties */}
        <aside className="w-[340px] bg-white dark:bg-card border-l border-border/40 flex flex-col h-full z-10 shrink-0 shadow-[-4px_0_24px_rgba(0,0,0,0.02)]">
          {selected ? (
            <>
              {/* Properties Header */}
              <div className="h-14 border-b border-border/40 flex items-center justify-between px-5 bg-muted/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center text-primary">
                    <Settings className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm font-semibold tracking-tight">Properties</span>
                </div>
                <Badge variant="outline" className="text-[10px] font-mono uppercase bg-background shadow-sm border-border/50 text-muted-foreground">{selected.type}</Badge>
              </div>

              {/* Properties Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-5 space-y-7">
                  
                  {/* Settings Group */}
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Field Label</Label>
                      <Input
                        value={selected.label}
                        onChange={(e) => updateField(selected.id, { label: e.target.value })}
                        className="font-medium bg-background border-border/60 shadow-sm focus-visible:ring-1 focus-visible:ring-primary h-9"
                      />
                    </div>

                    {['text', 'textarea', 'number', 'email', 'dropdown'].includes(selected.type) && (
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Placeholder Text</Label>
                        <Input
                          value={selected.placeholder || ''}
                          onChange={(e) => updateField(selected.id, { placeholder: e.target.value })}
                          placeholder="e.g. Enter your name"
                          className="bg-background border-border/60 shadow-sm text-sm h-9"
                        />
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Help Text</Label>
                      <Textarea
                        value={selected.helpText || ''}
                        onChange={(e) => updateField(selected.id, { helpText: e.target.value })}
                        placeholder="Hints to help the user answer..."
                        className="bg-background border-border/60 shadow-sm text-sm min-h-[60px] resize-none"
                      />
                    </div>
                  </div>

                  <Separator className="bg-border/50" />

                  {/* Validation Group */}
                  <div className="space-y-4">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest block">Rules & Validation</Label>
                    
                    <div className="flex items-center justify-between p-3 rounded-lg border border-border/60 bg-muted/20">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium text-foreground cursor-pointer" htmlFor="req-switch">Required Field</Label>
                        <p className="text-[11px] text-muted-foreground">User cannot submit without answering</p>
                      </div>
                      <Switch 
                        id="req-switch" 
                        checked={selected.required}
                        onCheckedChange={(checked) => updateField(selected.id, { required: !!checked })}
                      />
                    </div>
                  </div>

                  {/* Options Group */}
                  {selected.options && (
                    <>
                      <Separator className="bg-border/50" />
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Choices</Label>
                        </div>
                        
                        <div className="space-y-2">
                          {selected.options.map((opt, i) => (
                            <div key={i} className="flex items-center gap-2 group/opt bg-background border border-border/50 rounded-md p-1 pl-2 shadow-sm focus-within:ring-1 focus-within:ring-primary/50 focus-within:border-primary/50 transition-all">
                              <GripHorizontal className="w-3.5 h-3.5 text-muted-foreground/30 cursor-grab shrink-0 hover:text-muted-foreground" />
                              <input
                                value={opt}
                                onChange={(e) => {
                                  const newOpts = [...selected.options!];
                                  newOpts[i] = e.target.value;
                                  updateField(selected.id, { options: newOpts });
                                }}
                                className="flex-1 min-w-0 bg-transparent border-0 h-7 text-sm outline-none placeholder:text-muted-foreground/50"
                                placeholder={`Option ${i + 1}`}
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 shrink-0 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 rounded-sm"
                                onClick={() => {
                                  const newOpts = selected.options!.filter((_, index) => index !== i);
                                  updateField(selected.id, { options: newOpts });
                                }}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          ))}
                        </div>
                        
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full h-8 text-xs font-medium bg-muted/50 hover:bg-muted border border-transparent hover:border-border/50"
                          onClick={() => updateField(selected.id, { options: [...selected.options!, `Option ${selected.options!.length + 1}`] })}
                        >
                          <Plus className="w-3.5 h-3.5 mr-1" /> Add Choice
                        </Button>
                      </div>
                    </>
                  )}

                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-muted/5">
              <div className="w-16 h-16 rounded-full bg-background border border-border shadow-sm flex items-center justify-center mb-4">
                <ToggleRight className="w-6 h-6 text-muted-foreground/40" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">No Selection</h3>
              <p className="text-xs text-muted-foreground max-w-[200px]">Click on any field in the center canvas to configure its settings here.</p>
            </div>
          )}
        </aside>

      </div>
    </div>
  );
}
