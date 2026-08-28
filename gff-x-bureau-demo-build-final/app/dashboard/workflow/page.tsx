'use client';

import { useState, useCallback, useId } from 'react';
import { useRouter } from 'next/navigation';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  DragOverEvent,
  useDroppable,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Smartphone,
  Mail,
  Globe,
  FileText,
  ScanFace,
  UserCheck,
  ShieldCheck,
  Building2,
  Network,
  Search,
  Plus,
  GripVertical,
  Trash2,
  ChevronDown,
  ChevronUp,
  Play,
  Code2,
  Home,
  ArrowLeft,
  X,
  Copy as CopyIcon,
  Check as CheckIcon,
  Menu,
  QrCode,
  CreditCard,
  IdCard,
  CheckCircle2,
  XCircle,
  Clock,
  Settings2,
} from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────────────

interface Capability {
  id: string;
  name: string;
  icon: React.ReactNode;
  category?: string;
}

interface WorkflowStep extends Capability {
  stepId: string;
}

type ConditionOutcome = 'accept' | 'reject' | 'manual_review';

interface ConditionRow {
  id: string;
  parameter: string;
  operator: string;
  value: string;
}

interface ConditionGroup {
  outcome: ConditionOutcome;
  conditions: ConditionRow[];
}

// ── Capability definitions ───────────────────────────────────────────────────

const DEFAULT_CAPABILITIES: Capability[] = [
  { id: 'device_intelligence',      name: 'Device Intelligence',        icon: <Smartphone  size={18} className="text-primary" />, category: 'Intelligence' },
  { id: 'phone_email_intelligence', name: 'Phone & Email Intelligence',  icon: <Mail        size={18} className="text-primary" />, category: 'Intelligence' },
  { id: 'ip_intelligence',          name: 'IP Intelligence',             icon: <Globe       size={18} className="text-primary" />, category: 'Intelligence' },
  { id: 'kyc_document_check',       name: 'KYC Document Check',          icon: <FileText    size={18} className="text-primary" />, category: 'Identity' },
  { id: 'nric_check',               name: 'NRIC Check',                  icon: <IdCard      size={18} className="text-primary" />, category: 'Identity' },
  { id: 'uen_check',                name: 'UEN Check',                   icon: <Building2   size={18} className="text-primary" />, category: 'Business' },
  { id: 'uen_qr_check',             name: 'UEN QR Check',                icon: <QrCode      size={18} className="text-primary" />, category: 'Business' },
  { id: 'face_liveness',            name: 'Face Liveness',               icon: <ScanFace    size={18} className="text-primary" />, category: 'Biometric' },
  { id: 'face_match',               name: 'Face Match',                  icon: <UserCheck   size={18} className="text-primary" />, category: 'Biometric' },
  { id: 'aml_check',                name: 'AML Check',                   icon: <ShieldCheck size={18} className="text-primary" />, category: 'Compliance' },
  { id: 'government_db_check',      name: 'Government DB Check',         icon: <Building2   size={18} className="text-primary" />, category: 'Compliance' },
  { id: 'kyb_document_ocr',         name: 'KYB Document OCR',            icon: <CreditCard  size={18} className="text-primary" />, category: 'Business' },
  { id: 'gin_check',                name: 'GIN Check',                   icon: <Network     size={18} className="text-primary" />, category: 'Compliance' },
];

// ── Default conditions per capability ────────────────────────────────────────

function defaultConditions(capId: string): ConditionGroup[] {
  const isBiometric = capId === 'face_liveness' || capId === 'face_match';
  if (isBiometric) {
    return [
      { outcome: 'accept',        conditions: [{ id: 'c1', parameter: capId === 'face_liveness' ? 'Liveness Score' : 'Face Match Score', operator: '>=', value: '80' }] },
      { outcome: 'reject',        conditions: [{ id: 'c2', parameter: capId === 'face_liveness' ? 'Liveness Score' : 'Face Match Score', operator: '<',  value: '40' }] },
      { outcome: 'manual_review', conditions: [{ id: 'c3', parameter: capId === 'face_liveness' ? 'Liveness Score' : 'Face Match Score', operator: 'between', value: '40–79' }] },
    ];
  }
  return [
    { outcome: 'accept',        conditions: [{ id: 'c1', parameter: 'Result',     operator: 'is', value: 'Passed' }] },
    { outcome: 'reject',        conditions: [{ id: 'c2', parameter: 'Result',     operator: 'is', value: 'Failed' }] },
    { outcome: 'manual_review', conditions: [{ id: 'c3', parameter: 'Risk Score', operator: '>',  value: '70' }] },
  ];
}

function parametersForCap(capId: string): string[] {
  switch (capId) {
    case 'face_liveness':            return ['Liveness Score', 'Liveness Status', 'Confidence'];
    case 'face_match':               return ['Face Match Score', 'Match Status', 'Similarity'];
    case 'nric_check':               return ['NRIC Valid', 'Expiry Status', 'Name Match'];
    case 'uen_check':                return ['UEN Valid', 'Business Status', 'Entity Type'];
    case 'uen_qr_check':             return ['QR Code Valid', 'UEN Match', 'Merchant Registered'];
    case 'aml_check':                return ['AML Status', 'Risk Level', 'Watchlist Hit'];
    case 'kyc_document_check':       return ['Document Valid', 'Expiry Status', 'OCR Confidence'];
    case 'kyb_document_ocr':         return ['Document Valid', 'Registration Status', 'OCR Confidence'];
    case 'government_db_check':      return ['DB Match', 'Verification Status', 'Data Consistency'];
    case 'device_intelligence':      return ['Device Risk Score', 'Device Type', 'VPN Detected'];
    case 'phone_email_intelligence': return ['Phone Valid', 'Email Valid', 'Risk Score'];
    case 'ip_intelligence':          return ['IP Risk Score', 'Country Match', 'Proxy Detected'];
    case 'gin_check':                return ['GIN Match', 'Entity Status', 'Risk Level'];
    default:                         return ['Result', 'Status', 'Risk Score'];
  }
}

// ── Conditions panel ─────────────────────────────────────────────────────────

const OUTCOME_CONFIG = {
  accept:        { label: 'Accept',        bg: 'bg-green-50',  border: 'border-green-200', headerBg: 'bg-green-50', iconBg: 'bg-green-100', text: 'text-green-700',  icon: CheckCircle2 },
  reject:        { label: 'Reject',        bg: 'bg-red-50',    border: 'border-red-200',   headerBg: 'bg-red-50',   iconBg: 'bg-red-100',   text: 'text-red-700',    icon: XCircle },
  manual_review: { label: 'Manual Review', bg: 'bg-indigo-50', border: 'border-indigo-200',headerBg: 'bg-indigo-50',iconBg: 'bg-indigo-100',text: 'text-indigo-700', icon: Clock },
} as const;

function ConditionsPanel({ step, groups, onChange, onClose }: {
  step: WorkflowStep; groups: ConditionGroup[];
  onChange: (groups: ConditionGroup[]) => void; onClose: () => void;
}) {
  const [expanded, setExpanded] = useState<ConditionOutcome[]>(['accept', 'reject', 'manual_review']);
  const params = parametersForCap(step.id);
  const isBiometric = step.id === 'face_liveness' || step.id === 'face_match';

  const toggleExpanded = (o: ConditionOutcome) =>
    setExpanded(prev => prev.includes(o) ? prev.filter(x => x !== o) : [...prev, o]);

  const addCondition = (outcome: ConditionOutcome) =>
    onChange(groups.map(g => g.outcome === outcome
      ? { ...g, conditions: [...g.conditions, { id: `c${Date.now()}`, parameter: params[0], operator: isBiometric ? '>=' : 'is', value: isBiometric ? '80' : '' }] }
      : g));

  const removeCondition = (outcome: ConditionOutcome, condId: string) =>
    onChange(groups.map(g => g.outcome === outcome ? { ...g, conditions: g.conditions.filter(c => c.id !== condId) } : g));

  const updateCondition = (outcome: ConditionOutcome, condId: string, field: keyof ConditionRow, val: string) =>
    onChange(groups.map(g => g.outcome === outcome ? { ...g, conditions: g.conditions.map(c => c.id === condId ? { ...c, [field]: val } : c) } : g));

  return (
    <aside className="w-full h-full flex flex-col bg-white border-l border-border overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">{step.icon}</div>
          <div>
            <p className="text-sm font-bold text-foreground">{step.name}</p>
            <p className="text-xs text-muted-foreground">Step conditions</p>
          </div>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors"><X size={16} /></button>
      </div>

      <div className="flex items-center gap-2 px-5 py-3 border-b border-border flex-shrink-0 flex-wrap">
        {(['accept', 'reject', 'manual_review'] as ConditionOutcome[]).map(o => {
          const cfg = OUTCOME_CONFIG[o]; const Icon = cfg.icon;
          const count = groups.find(g => g.outcome === o)?.conditions.length ?? 0;
          return (
            <button key={o} onClick={() => setExpanded(prev => prev.includes(o) ? prev : [...prev, o])}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${cfg.bg} ${cfg.border} ${cfg.text}`}>
              <Icon size={12} />{cfg.label}
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${cfg.iconBg} ${cfg.text}`}>{count}</span>
            </button>
          );
        })}
      </div>

      {isBiometric && (
        <div className="mx-5 mt-3 px-3 py-2 bg-primary/5 border border-primary/20 rounded-lg flex-shrink-0">
          <p className="text-xs text-primary font-medium">{step.id === 'face_liveness' ? 'Face Liveness score threshold (%)' : 'Face Match similarity threshold (%)'}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Set % thresholds for Accept / Reject / Manual Review ranges.</p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {groups.map(group => {
          const cfg = OUTCOME_CONFIG[group.outcome]; const Icon = cfg.icon;
          const isOpen = expanded.includes(group.outcome);
          return (
            <div key={group.outcome} className={`rounded-xl border ${cfg.border} overflow-hidden`}>
              <button onClick={() => toggleExpanded(group.outcome)}
                className={`w-full flex items-center gap-3 px-4 py-3 ${cfg.headerBg} hover:opacity-90 transition-opacity`}>
                <div className={`w-6 h-6 rounded-full ${cfg.iconBg} flex items-center justify-center flex-shrink-0`}><Icon size={13} className={cfg.text} /></div>
                <span className={`text-sm font-bold ${cfg.text} flex-1 text-left`}>{cfg.label}</span>
                <span className="text-xs text-muted-foreground mr-2 hidden sm:inline">
                  Transactions matching below conditions will be <span className={`font-semibold ${cfg.text}`}>{cfg.label === 'Manual Review' ? 'queued for review' : cfg.label + 'ed'}</span>
                </span>
                {isOpen ? <ChevronUp size={14} className="text-muted-foreground flex-shrink-0" /> : <ChevronDown size={14} className="text-muted-foreground flex-shrink-0" />}
              </button>
              {isOpen && (
                <div className="bg-white px-4 py-3 space-y-2">
                  {group.conditions.map((cond, ci) => (
                    <div key={cond.id}>
                      {ci > 0 && (
                        <div className="flex items-center gap-2 my-2 pl-2">
                          <div className="w-px h-4 bg-border ml-2" />
                          <span className="text-[10px] font-bold text-muted-foreground border border-border rounded-full px-2 py-0.5 bg-secondary">AND</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <select value={cond.parameter} onChange={e => updateCondition(group.outcome, cond.id, 'parameter', e.target.value)}
                          className="flex-1 border border-border rounded-lg px-2.5 py-2 text-xs text-foreground bg-white focus:outline-none focus:ring-1 focus:ring-primary/40">
                          {params.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                        <select value={cond.operator} onChange={e => updateCondition(group.outcome, cond.id, 'operator', e.target.value)}
                          className="w-20 border border-border rounded-lg px-2 py-2 text-xs text-foreground bg-white focus:outline-none focus:ring-1 focus:ring-primary/40">
                          {(isBiometric ? ['>=','<=','>','<','=','between'] : ['is','is not','>','<','>=','<=']).map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                        {isBiometric ? (
                          <div className="flex items-center gap-1 border border-border rounded-lg px-2.5 py-1.5 bg-white w-20">
                            <input type="number" min={0} max={100} value={cond.value.split('–')[0]}
                              onChange={e => updateCondition(group.outcome, cond.id, 'value', e.target.value)}
                              className="w-full text-xs text-foreground bg-transparent focus:outline-none" placeholder="0–100" />
                            <span className="text-xs text-muted-foreground">%</span>
                          </div>
                        ) : (
                          <input type="text" value={cond.value} onChange={e => updateCondition(group.outcome, cond.id, 'value', e.target.value)}
                            className="w-20 border border-border rounded-lg px-2.5 py-2 text-xs text-foreground bg-white focus:outline-none focus:ring-1 focus:ring-primary/40" placeholder="value" />
                        )}
                        <button onClick={() => removeCondition(group.outcome, cond.id)} className="text-muted-foreground/40 hover:text-red-400 transition-colors flex-shrink-0"><X size={13} /></button>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => addCondition(group.outcome)} className={`flex items-center gap-1.5 text-xs font-semibold mt-2 ${cfg.text} hover:opacity-70 transition-opacity`}>
                    <Plus size={12} />Add Condition
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="px-5 py-3 border-t border-border flex-shrink-0">
        <button onClick={onClose} className="w-full bg-foreground text-background text-sm font-semibold py-2.5 rounded-xl hover:bg-foreground/80 transition-colors">Save Conditions</button>
      </div>
    </aside>
  );
}

const SAMPLE_CAPABILITY = {
  name: 'Comply Advantage AML Global Check',
  orgId: 'org_x869hE43-fR7Bbx',
  curl: `curl -X POST https://api.complyadvantage.com/v1/searches \\\n  -H "Authorization: Bearer YOUR_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{\n    "search_term": "John Doe",\n    "filters": {\n      "country_codes": ["US", "GB"],\n      "types": ["WATCHLIST", "PEP"]\n    }\n  }'`,
};

const DEFAULT_STEPS: WorkflowStep[] = DEFAULT_CAPABILITIES.map((c, i) => ({
  ...c,
  stepId: `${c.id}_default_${i}`,
}));

const CAPABILITIES = DEFAULT_CAPABILITIES;

// ── Drag overlay card (ghost shown while dragging) ───────────────────────────

function DragOverlayCard({ name, icon }: { name: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white border-2 border-primary rounded-xl flex items-center gap-3 px-4 py-4 shadow-xl w-full">
      <GripVertical size={16} className="text-muted-foreground/40" />
      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1">
        <p className="font-semibold text-foreground text-sm">{name}</p>
      </div>
      <span className="text-xs font-medium text-green-700 border border-green-300 bg-green-50 rounded-full px-3 py-0.5">
        Active
      </span>
    </div>
  );
}

// ── Capability list item (draggable from sidebar) ────────────────────────────

function CapabilityItem({
  cap,
  onAdd,
}: {
  cap: Capability;
  onAdd: (cap: Capability) => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useSortable({
    id: `cap_${cap.id}`,
    data: { type: 'capability', cap },
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex items-center justify-between px-4 py-3 mx-2 rounded-lg hover:bg-secondary/60 transition-colors group border-b border-border/40 last:border-0 ${isDragging ? 'opacity-40' : ''}`}
    >
      <div className="flex items-center gap-3">
        {/* Drag handle for sidebar item */}
        <button
          {...attributes}
          {...listeners}
          className="text-muted-foreground/30 hover:text-muted-foreground cursor-grab active:cursor-grabbing"
          aria-label="Drag to add"
        >
          <GripVertical size={14} />
        </button>
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          {cap.icon}
        </div>
        <div>
          <span className="text-sm font-medium text-foreground">{cap.name}</span>
          {cap.category && <p className="text-[10px] text-muted-foreground">{cap.category}</p>}
        </div>
      </div>
      <button
        onClick={() => onAdd(cap)}
        className="w-6 h-6 rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
        aria-label={`Add ${cap.name}`}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

// ── Sortable step card (in canvas) ───────────────────────────────────────────

function SortableStepCard({
  step,
  index,
  onRemove,
  onSelect,
  isSelected,
  conditionCount,
}: {
  step: WorkflowStep;
  index: number;
  onRemove: (stepId: string) => void;
  onSelect: (step: WorkflowStep) => void;
  isSelected: boolean;
  conditionCount: number;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: step.stepId, data: { type: 'step' } });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div
        ref={setNodeRef}
        style={style}
        onClick={() => onSelect(step)}
        className={`w-full bg-white border rounded-xl flex items-center gap-3 px-4 py-4 shadow-sm transition-all cursor-pointer
          ${isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/40'}`}
      >
        <button
          {...attributes}
          {...listeners}
          onPointerDown={(e) => e.stopPropagation()}
          className="text-muted-foreground/40 hover:text-muted-foreground cursor-grab active:cursor-grabbing flex-shrink-0"
          aria-label="Drag to reorder"
        >
          <GripVertical size={16} />
        </button>
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          {step.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground text-sm">{step.name}</p>
          <p className="text-xs text-muted-foreground">Step {index + 1}</p>
        </div>
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); onSelect(step); }}
          className="flex items-center gap-1 text-xs font-medium text-muted-foreground border border-border rounded-full px-2 py-0.5 hover:border-primary/40 hover:text-primary transition-colors flex-shrink-0"
          aria-label="Edit conditions"
        >
          <Settings2 size={10} />
          {conditionCount} rule{conditionCount !== 1 ? 's' : ''}
        </button>
        <span className="text-xs font-medium text-green-700 border border-green-300 bg-green-50 rounded-full px-3 py-0.5 flex-shrink-0">
          Active
        </span>
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); onRemove(step.stepId); }}
          className="ml-1 text-muted-foreground/40 hover:text-red-500 transition-colors flex-shrink-0"
          aria-label="Remove step"
        >
          <Trash2 size={15} />
        </button>
      </div>
      <div className="py-1">
        <ChevronDown size={18} className="text-muted-foreground/40" />
      </div>
    </div>
  );
}

// ── Canvas drop zone (shown when canvas is empty) ─────────────��──────────────

function EmptyDropZone() {
  const { setNodeRef, isOver } = useDroppable({ id: 'canvas-empty' });
  return (
    <div
      ref={setNodeRef}
      className={`border-2 border-dashed rounded-xl py-14 flex flex-col items-center transition-colors ${
        isOver ? 'border-primary bg-primary/5' : 'border-primary/25'
      }`}
    >
      <Plus size={28} className="mb-2 text-primary/40" />
      <p className="text-sm text-muted-foreground">Drag capabilities here or click the + button</p>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function WorkflowPage() {
  const router = useRouter();
  const [steps, setSteps] = useState<WorkflowStep[]>(DEFAULT_STEPS);
  const [capabilities, setCapabilities] = useState<Capability[]>(DEFAULT_CAPABILITIES);
  const [search, setSearch] = useState('');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overStepId, setOverStepId] = useState<string | null>(null);

  // Conditions map: stepId → ConditionGroup[]
  const [conditionsMap, setConditionsMap] = useState<Record<string, ConditionGroup[]>>(() => {
    const m: Record<string, ConditionGroup[]> = {};
    DEFAULT_STEPS.forEach(s => { m[s.stepId] = defaultConditions(s.id); });
    return m;
  });

  // Selected step for conditions panel
  const [selectedStep, setSelectedStep] = useState<WorkflowStep | null>(null);

  // Integrate modal
  const [showIntegrateModal, setShowIntegrateModal] = useState(false);
  const [showCapsPanel, setShowCapsPanel] = useState(false);
  const WORKFLOW_ID = 'e9212fe4-f78f-4f59-a51b-7a64844e7422';
  const ORG_ID = 'org_5YRLY6WnJxt1l6n';
  const curlCommand = `curl --location --request POST 'https://api.bureau.id/transactions' \\
  --header 'x-bureau-auth-org-id: ${ORG_ID}' \\
  --header 'Authorization: Bearer eyJhbGciOiJSUzI1NiIsImtpZZCI6...' \\
  --header 'Content-Type: application/json' \\
  --data-raw '{
      "worklowId": "${WORKFLOW_ID}"
  }'`;
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  };

  // Add Capability modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [capName, setCapName] = useState('');
  const [capOrgId, setCapOrgId] = useState('');
  const [capCurl, setCapCurl] = useState('');

  const openAddModal = () => {
    setCapName(''); setCapOrgId(''); setCapCurl('');
    setShowAddModal(true);
  };
  const loadSample = () => {
    setCapName(SAMPLE_CAPABILITY.name);
    setCapOrgId(SAMPLE_CAPABILITY.orgId);
    setCapCurl(SAMPLE_CAPABILITY.curl);
  };
  const saveCapability = () => {
    if (!capName.trim()) return;
    const newCap: Capability = {
      id: `custom_${Date.now()}`,
      name: capName.trim(),
      icon: <Code2 size={18} className="text-primary" />,
    };
    setCapabilities(prev => [...prev, newCap]);
    setShowAddModal(false);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  // Find the active item for the overlay
  const activeCapability = activeId?.startsWith('cap_')
    ? CAPABILITIES.find((c) => `cap_${c.id}` === activeId) ?? null
    : null;
  const activeStep = !activeId?.startsWith('cap_')
    ? steps.find((s) => s.stepId === activeId) ?? null
    : null;

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  }, []);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const overId = event.over?.id;
    if (overId && !String(overId).startsWith('cap_')) {
      setOverStepId(String(overId));
    } else {
      setOverStepId(null);
    }
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);
      setOverStepId(null);

      if (!over) return;

      const activeIdStr = String(active.id);
      const overIdStr = String(over.id);

      // Dragging from capabilities panel → drop onto canvas
      if (activeIdStr.startsWith('cap_')) {
        const capId = activeIdStr.replace('cap_', '');
        const cap = capabilities.find((c) => c.id === capId);
        if (!cap) return;

        const newStep: WorkflowStep = { ...cap, stepId: `${cap.id}_${Date.now()}` };
        setConditionsMap(prev => ({ ...prev, [newStep.stepId]: defaultConditions(cap.id) }));

        setSteps((prev) => {
          if (overIdStr === 'canvas-empty' || prev.length === 0) {
            return [...prev, newStep];
          }
          const overIndex = prev.findIndex((s) => s.stepId === overIdStr);
          if (overIndex === -1) return [...prev, newStep];
          const newSteps = [...prev];
          newSteps.splice(overIndex + 1, 0, newStep);
          return newSteps;
        });
        return;
      }

      // Reordering within canvas
      if (activeIdStr !== overIdStr) {
        setSteps((prev) => {
          const oldIndex = prev.findIndex((s) => s.stepId === activeIdStr);
          const newIndex = prev.findIndex((s) => s.stepId === overIdStr);
          if (oldIndex === -1 || newIndex === -1) return prev;
          return arrayMove(prev, oldIndex, newIndex);
        });
      }
    },
    [],
  );

  const addCapability = useCallback((cap: Capability) => {
    const newStep: WorkflowStep = { ...cap, stepId: `${cap.id}_${Date.now()}` };
    setConditionsMap(prev => ({ ...prev, [newStep.stepId]: defaultConditions(cap.id) }));
    setSteps((prev) => [...prev, newStep]);
  }, []);

  const removeStep = useCallback((stepId: string) => {
    setSteps((prev) => prev.filter((s) => s.stepId !== stepId));
    setSelectedStep(prev => prev?.stepId === stepId ? null : prev);
  }, []);

  const handleSelectStep = useCallback((step: WorkflowStep) => {
    setSelectedStep(prev => prev?.stepId === step.stepId ? null : step);
  }, []);

  const totalConditions = (stepId: string) =>
    (conditionsMap[stepId] ?? []).reduce((sum, g) => sum + g.conditions.length, 0);

  const filteredCaps = capabilities.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  // All sortable IDs: capability IDs + step IDs
  const allSortableIds = [
    ...capabilities.map((c) => `cap_${c.id}`),
    ...steps.map((s) => s.stepId),
  ];

  return (
    <div className="flex h-screen bg-[#f6f8fb] overflow-hidden">

      {/* ── Mobile capabilities overlay ─────────────────────────────────── */}
      {showCapsPanel && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/40"
          onClick={() => setShowCapsPanel(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Left capabilities panel ─────────────────────────────────────── */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-80 flex-shrink-0 border-r border-border bg-white flex flex-col transition-transform duration-200 ${showCapsPanel ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-base font-bold text-foreground">Capabilities</h2>
          <button
            onClick={openAddModal}
            className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
            aria-label="Add new capability"
          >
            <Plus size={15} className="text-primary" />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b border-border">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search capabilities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-secondary/50 border border-border rounded-lg pl-8 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto py-2">
          {filteredCaps.map((cap) => (
            <CapabilityItem key={cap.id} cap={cap} onAdd={addCapability} />
          ))}
        </div>
      </aside>

      {/* ── Workflow canvas ──────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Top bar */}
        <header className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-border bg-white flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowCapsPanel(v => !v)}
              className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors"
              aria-label="Toggle capabilities panel"
            >
              <Menu size={18} />
            </button>
            <button
              onClick={() => router.back()}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-secondary transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-foreground leading-tight">Onboarding Workflow</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Click a step to configure Accept / Reject / Manual Review conditions.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowIntegrateModal(true)}
              className="flex items-center gap-2 border border-border rounded-lg px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
            >
              <Code2 size={14} />
              Integrate
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 bg-foreground text-background rounded-lg px-4 py-2 text-sm font-semibold hover:bg-foreground/90 transition-colors"
            >
              <Home size={14} />
              Home
            </button>
          </div>
        </header>

        {/* Canvas + conditions side-by-side */}
        <div className="flex flex-1 overflow-hidden">

          {/* Step canvas */}
          <main className="flex-1 overflow-y-auto py-8 px-6">
            <div className="max-w-xl mx-auto">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
              >
                {/* Start node */}
                <div className="flex flex-col items-center mb-0">
                  <div className="w-full bg-white border border-border rounded-xl flex items-center gap-4 px-5 py-4 shadow-sm">
                    <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Play size={16} className="text-green-600 fill-green-600" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-sm">Start Workflow</p>
                      <p className="text-xs text-muted-foreground">This is the entry point of your workflow.</p>
                    </div>
                  </div>
                  <div className="py-1">
                    <ChevronDown size={18} className="text-muted-foreground/40" />
                  </div>
                </div>

                <SortableContext items={allSortableIds} strategy={verticalListSortingStrategy}>
                  {steps.length === 0 ? (
                    <EmptyDropZone />
                  ) : (
                    steps.map((step, index) => (
                      <SortableStepCard
                        key={step.stepId}
                        step={step}
                        index={index}
                        onRemove={removeStep}
                        onSelect={handleSelectStep}
                        isSelected={selectedStep?.stepId === step.stepId}
                        conditionCount={totalConditions(step.stepId)}
                      />
                    ))
                  )}
                </SortableContext>

                <DragOverlay dropAnimation={{ duration: 180, easing: 'ease' }}>
                  {activeCapability && <div className="w-[420px]"><DragOverlayCard name={activeCapability.name} icon={activeCapability.icon} /></div>}
                  {activeStep && <div className="w-[420px]"><DragOverlayCard name={activeStep.name} icon={activeStep.icon} /></div>}
                </DragOverlay>
              </DndContext>
            </div>
          </main>

          {/* Conditions panel */}
          {selectedStep && (
            <div className="w-96 flex-shrink-0 border-l border-border overflow-hidden">
              <ConditionsPanel
                step={selectedStep}
                groups={conditionsMap[selectedStep.stepId] ?? defaultConditions(selectedStep.id)}
                onChange={(groups) => setConditionsMap(prev => ({ ...prev, [selectedStep.stepId]: groups }))}
                onClose={() => setSelectedStep(null)}
              />
            </div>
          )}
        </div>
      </div>

      {/* ── Integrate Workflow Modal ─────────────────────────────────────── */}
      {showIntegrateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
            {/* Header */}
            <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-border">
              <div>
                <h2 className="text-lg font-bold text-foreground">Integrate Workflow</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Use these details to integrate the workflow into your application.</p>
              </div>
              <button onClick={() => setShowIntegrateModal(false)} className="text-muted-foreground hover:text-foreground transition-colors mt-0.5">
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-5">
              {/* ID row */}
              <div className="grid grid-cols-2 gap-4">
                {/* Workflow ID */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Workflow ID</label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 border-2 border-primary rounded-xl px-3 py-2.5 text-sm font-mono text-foreground bg-white truncate">
                      {WORKFLOW_ID}
                    </div>
                    <button
                      onClick={() => copyToClipboard(WORKFLOW_ID, 'wid')}
                      className="w-9 h-9 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors flex-shrink-0"
                      title="Copy"
                    >
                      {copiedField === 'wid'
                        ? <CheckIcon size={14} className="text-green-600" />
                        : <CopyIcon size={14} />}
                    </button>
                  </div>
                </div>
                {/* Org ID */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Organization ID</label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 border border-border rounded-xl px-3 py-2.5 text-sm font-mono text-foreground bg-white truncate">
                      {ORG_ID}
                    </div>
                    <button
                      onClick={() => copyToClipboard(ORG_ID, 'oid')}
                      className="w-9 h-9 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors flex-shrink-0"
                      title="Copy"
                    >
                      {copiedField === 'oid'
                        ? <CheckIcon size={14} className="text-green-600" />
                        : <CopyIcon size={14} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* cURL */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">cURL Command</label>
                <div className="relative bg-[#0f172a] rounded-xl p-4">
                  <pre className="text-xs font-mono text-green-300 leading-relaxed whitespace-pre-wrap break-all pr-8">{curlCommand}</pre>
                  <button
                    onClick={() => copyToClipboard(curlCommand, 'curl')}
                    className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-md bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors"
                    title="Copy cURL"
                  >
                    {copiedField === 'curl'
                      ? <CheckIcon size={13} className="text-green-400" />
                      : <CopyIcon size={13} />}
                  </button>
                </div>
              </div>

              {/* Close button */}
              <div className="flex justify-end pt-1">
                <button
                  onClick={() => setShowIntegrateModal(false)}
                  className="bg-foreground text-background rounded-xl px-6 py-2.5 text-sm font-semibold hover:bg-foreground/90 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Add New Capability Modal ─────────────────────────────────────── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            {/* Header */}
            <div className="flex items-start justify-between px-6 pt-6 pb-4">
              <div>
                <h2 className="text-lg font-bold text-foreground">Add New Capability</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Add a custom capability to integrate with your workflow.</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-muted-foreground hover:text-foreground transition-colors mt-0.5"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-6 pb-6 space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Name of the Capability</label>
                <input
                  type="text"
                  value={capName}
                  onChange={e => setCapName(e.target.value)}
                  placeholder="e.g., AML Check"
                  className="w-full border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              {/* Org ID */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Organization ID</label>
                <input
                  type="text"
                  value={capOrgId}
                  onChange={e => setCapOrgId(e.target.value)}
                  placeholder="org_..."
                  className="w-full border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              {/* cURL */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">cURL Command</label>
                <textarea
                  value={capCurl}
                  onChange={e => setCapCurl(e.target.value)}
                  placeholder="curl ..."
                  rows={7}
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y"
                />
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={loadSample}
                  className="border border-border rounded-xl px-4 py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                >
                  Load Sample
                </button>
                <div className="flex-1" />
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveCapability}
                  disabled={!capName.trim()}
                  className="bg-foreground text-background rounded-xl px-5 py-2.5 text-sm font-semibold hover:bg-foreground/90 transition-colors disabled:opacity-40"
                >
                  Save Capability
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
