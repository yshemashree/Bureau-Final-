'use client';

import { useState } from 'react';
import {
  Shield, FileText, User, Activity, CheckCircle2, XCircle,
  AlertTriangle, Clock, Search, Fingerprint, Globe, BarChart3,
  ArrowLeft, Copy, ChevronDown, ChevronUp, Eye,
} from 'lucide-react';
import { useDemoMode, type CaseEntry } from '@/lib/demo-context';
import { IDCardDocument } from '@/components/id-card-document';
import { getDemoFacePhotos } from '@/lib/demo-face-photos';
import { getCountryDocumentConfig } from '@/lib/country-documents';
import { countryDemoData } from '@/lib/demo-country-data';
import { BehaviouralBiometrics } from '@/components/behavioural-biometrics';
import { BehavioralActionsChart } from '@/components/behavioral-actions-chart';
import { DeviceSensorInsights } from '@/components/device-sensor-insights';
import { GyroscopeChart, MagneticFieldChart, AccelerometerChart } from '@/components/device-sensor-charts';

// ── Static fallback cases ──────────────────────────────────────────────────
const STATIC_CASES: CaseEntry[] = [
  {
    id: 'CASE-2026-81234',
    date: 'March 3, 2026 at 10:14 AM',
    resolution: 'Approved',
    status: 'approved',
    idType: 'Passport',
    name: 'Jarryd Peters',
    country: 'South Africa',
    countryCode: 'ZA',
    faceMatch: '96.80%',
    liveness: '91.50%',
    risk: 'Low Risk',
    assignedTo: 'Ana Reviewer',
    priority: 'Low',
    demoMode: 'success',
    frontPreview: null,
    backPreview: null,
    selfiePreview: null,
  },
  {
    id: 'CASE-2026-74821',
    date: 'March 2, 2026 at 03:45 PM',
    resolution: 'Rejected',
    status: 'rejected',
    idType: "Driver's License",
    name: 'Roberto Gómez',
    country: 'Mexico',
    countryCode: 'MX',
    faceMatch: '18.20%',
    liveness: '22.00%',
    risk: 'High Risk',
    assignedTo: 'Auto — System',
    priority: 'High',
    demoMode: 'failure',
    frontPreview: null,
    backPreview: null,
    selfiePreview: null,
  },
  {
    id: 'CASE-2026-69302',
    date: 'March 1, 2026 at 09:22 AM',
    resolution: 'Approved',
    status: 'approved',
    idType: 'National ID',
    name: 'Priya Sharma',
    country: 'India',
    countryCode: 'IN',
    faceMatch: '88.40%',
    liveness: '85.70%',
    risk: 'Low Risk',
    assignedTo: 'Raj Kumar',
    priority: 'Low',
    demoMode: 'success',
    frontPreview: null,
    backPreview: null,
    selfiePreview: null,
  },
  {
    id: 'CASE-2026-55491',
    date: 'Feb 28, 2026 at 02:30 PM',
    resolution: 'Under Review',
    status: 'pending',
    idType: 'Residence Permit',
    name: 'Liu Wei',
    country: 'China',
    countryCode: 'CN',
    faceMatch: '61.10%',
    liveness: '58.30%',
    risk: 'Medium Risk',
    assignedTo: 'Manual Queue',
    priority: 'Medium',
    demoMode: 'failure',
    frontPreview: null,
    backPreview: null,
    selfiePreview: null,
  },
  {
    id: 'CASE-2026-48730',
    date: 'Feb 27, 2026 at 11:05 AM',
    resolution: 'Rejected',
    status: 'rejected',
    idType: 'National ID',
    name: 'Ivan Petrov',
    country: 'Russia',
    countryCode: 'RU',
    faceMatch: '12.90%',
    liveness: '15.40%',
    risk: 'High Risk',
    assignedTo: 'Auto — System',
    priority: 'High',
    demoMode: 'failure',
    frontPreview: null,
    backPreview: null,
    selfiePreview: null,
  },
];

// ── Badge helpers ──────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const cfg =
    status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' :
    status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' :
    'bg-amber-50 text-amber-700 border-amber-200';
  const label = status === 'approved' ? 'Approved' : status === 'rejected' ? 'Rejected' : 'Pending';
  return <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${cfg}`}>{label}</span>;
}

function RiskBadge({ risk }: { risk: string }) {
  const cfg =
    risk === 'Low Risk' ? 'bg-green-50 text-green-700 border-green-200' :
    risk === 'High Risk' ? 'bg-red-50 text-red-700 border-red-200' :
    'bg-amber-50 text-amber-700 border-amber-200';
  return <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${cfg}`}>{risk}</span>;
}

// ── Collapsible section ────────────────────────────────────────────────────
function CollapsibleSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-sm font-bold text-foreground hover:bg-secondary/20 transition-colors"
      >
        <span>{title}</span>
        {open ? <ChevronUp size={15} className="text-muted-foreground" /> : <ChevronDown size={15} className="text-muted-foreground" />}
      </button>
      {open && <div className="px-5 pb-5">{children}</div>}
    </div>
  );
}

function MetricCard({ label, value, sub, status }: { label: string; value: string; sub: string; status: 'pass' | 'fail' | 'neutral' }) {
  return (
    <div className={`border rounded-xl p-4 flex flex-col gap-1 ${status === 'pass' ? 'border-green-100 bg-green-50/40' : status === 'fail' ? 'border-red-100 bg-red-50/40' : 'border-border'}`}>
      <span className={`text-2xl font-bold ${status === 'pass' ? 'text-green-700' : status === 'fail' ? 'text-red-600' : 'text-foreground'}`}>{value}</span>
      <span className="text-sm font-semibold text-foreground">{label}</span>
      <span className={`text-xs font-medium ${status === 'pass' ? 'text-green-600' : status === 'fail' ? 'text-red-500' : 'text-muted-foreground'}`}>{sub}</span>
    </div>
  );
}

// ── Full case detail ───────────────────────────────────────────────────────
type CheckSubTab = 'device' | 'footprint' | 'aml' | 'gin';

function CaseFullDetail({ c, onClose }: { c: CaseEntry; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'checks' | 'usage'>('overview');
  const [checkSubTab, setCheckSubTab] = useState<CheckSubTab>('device');
  const [copied, setCopied] = useState(false);

  const isApproved = c.demoMode === 'success' || c.status === 'approved';
  const scenario = isApproved ? 'success' : 'failure';

  const demoData = countryDemoData[c.countryCode]?.[scenario] ?? countryDemoData['AR'][scenario];
  const fullName = c.name;
  const faces = getDemoFacePhotos(c.countryCode, scenario);
  const docConfig = getCountryDocumentConfig(c.countryCode);
  const docTypeId = docConfig.documentTypes[0]?.id ?? 'national_id';

  function DocPreview({ preview, side }: { preview: string | null; side: 'FRONT' | 'BACK' }) {
    const isReal = preview && preview !== 'placeholder';
    return isReal
      ? <img src={preview} alt={`ID ${side}`} className="w-full h-full object-contain p-2" />
      : <IDCardDocument countryCode={c.countryCode} scenario={scenario} side={side} facePhotoUrl={faces.documentFace} docTypeId={docTypeId} className="w-full h-full" />;
  }

  function SelfiePreviewEl({ preview }: { preview: string | null }) {
    const src = preview && preview !== 'placeholder' ? preview : faces.selfieFace;
    return src
      ? <img src={src} alt="Selfie" className="w-full h-full object-cover object-top" />
      : <p className="text-xs text-muted-foreground">Not captured</p>;
  }

  const copyCase = () => {
    navigator.clipboard.writeText(c.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: <BarChart3 size={14} /> },
    { id: 'documents' as const, label: 'Documents', icon: <FileText size={14} /> },
    { id: 'checks' as const, label: 'Checks & Regulations', icon: <Shield size={14} /> },
    { id: 'usage' as const, label: 'Usage Logs', icon: <Activity size={14} /> },
  ];

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      {/* Header */}
      <div className="bg-white border-b border-border px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/30 transition-colors flex-shrink-0"
            >
              <ArrowLeft size={16} />
            </button>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <User size={18} className="text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base font-bold text-foreground">{fullName}</h1>
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${isApproved ? 'bg-green-100 text-green-700 border-green-200' : c.status === 'pending' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                  {isApproved ? 'Approved' : c.status === 'pending' ? 'Pending' : 'Rejected'}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-0.5">
                <button onClick={copyCase} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  <span>{c.id}</span><Copy size={11} />
                  {copied && <span className="text-green-500">Copied!</span>}
                </button>
                <span className="hidden sm:inline text-muted-foreground/40">·</span>
                <span className="hidden sm:inline text-xs text-muted-foreground">{c.country}</span>
                <span className="hidden sm:inline text-muted-foreground/40">·</span>
                <span className="hidden sm:inline text-xs text-muted-foreground">{c.idType}</span>
              </div>
            </div>
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-xs text-muted-foreground">Submitted</p>
            <p className="text-xs font-medium text-foreground">{c.date}</p>
          </div>
        </div>
        {/* Tabs */}
        <div className="max-w-7xl mx-auto mt-4 flex gap-1 overflow-x-auto">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === t.id ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.icon}{t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

        {/* ── OVERVIEW ── */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

            {/* Left — main content (2 cols) */}
            <div className="xl:col-span-2 space-y-5">

              {/* Verification Summary */}
              <div className="bg-white border border-border rounded-xl p-5">
                <h2 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                  <Shield size={15} className="text-primary" /> Verification Summary
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'ID Type', value: c.idType, icon: <FileText size={14} /> },
                    { label: 'Status', value: isApproved ? 'Approved' : c.status === 'pending' ? 'Pending Review' : 'Rejected', icon: isApproved ? <CheckCircle2 size={14} className="text-green-500" /> : <XCircle size={14} className="text-red-500" />, status: isApproved ? 'green' : 'red' },
                    { label: 'Face Match', value: `${c.faceMatch} (${isApproved ? 'Passed' : 'Failed'})`, icon: <User size={14} className={isApproved ? 'text-green-400' : 'text-red-400'} />, status: isApproved ? 'green' : 'red' },
                    { label: 'Liveness Check', value: `${c.liveness} (${isApproved ? 'Passed' : 'Failed'})`, icon: <Fingerprint size={14} className={isApproved ? 'text-green-400' : 'text-red-400'} />, status: isApproved ? 'green' : 'red' },
                    { label: 'Risk Assessment', value: c.risk, icon: isApproved ? <Shield size={14} className="text-green-500" /> : <AlertTriangle size={14} className="text-red-500" />, status: isApproved ? 'green' : 'red' },
                    { label: 'Country', value: c.country, icon: <Globe size={14} /> },
                  ].map(item => (
                    <div key={item.label} className={`rounded-lg border p-3 flex items-start gap-3 ${item.status === 'red' ? 'border-red-100 bg-red-50/40' : item.status === 'green' ? 'border-green-100 bg-green-50/40' : 'border-border bg-secondary/20'}`}>
                      <div className="mt-0.5 text-muted-foreground">{item.icon}</div>
                      <div>
                        <p className="text-xs text-muted-foreground">{item.label}</p>
                        <p className={`text-sm font-semibold ${item.status === 'red' ? 'text-red-600' : item.status === 'green' ? 'text-green-600' : 'text-foreground'}`}>{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verification result banner */}
              <div className="bg-white border border-border rounded-xl p-5">
                <h2 className="text-sm font-bold text-foreground mb-1 flex items-center gap-2">
                  {isApproved
                    ? <><CheckCircle2 size={15} className="text-green-500" /> Verification Passed</>
                    : c.status === 'pending'
                      ? <><Clock size={15} className="text-amber-500" /> Under Review</>
                      : <><XCircle size={15} className="text-red-500" /> Verification Failed</>}
                </h2>
                <p className="text-xs text-muted-foreground mb-4">
                  {isApproved ? 'All verification checks completed successfully' : c.status === 'pending' ? 'Awaiting manual review' : 'Verification rejected due to failed checks'}
                </p>
                {isApproved ? (
                  <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-green-700">Verification Approved</p>
                      <p className="text-xs text-green-600 mt-0.5">All checks passed — identity verified successfully with high confidence.</p>
                    </div>
                  </div>
                ) : c.status === 'pending' ? (
                  <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 flex items-start gap-3">
                    <Clock size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-amber-700">Pending Manual Review</p>
                      <p className="text-xs text-amber-600 mt-0.5">This case has been escalated for manual compliance review.</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                    <p className="text-xs font-semibold text-red-700 mb-2">Rejection Reasons:</p>
                    <ul className="space-y-1">
                      {[
                        `Liveness detection failed (Score: ${c.liveness})`,
                        'Face appears to be from a static image',
                        'Face does not match document photo',
                      ].map(r => (
                        <li key={r} className="flex items-start gap-2 text-xs text-red-600">
                          <span className="mt-1 w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />{r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Identity Verification Results */}
              <CollapsibleSection title="Identity Verification Results">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">OCR Results</p>
                    <div className="space-y-0">
                      {[
                        ['ID Number', demoData?.idNumber ?? '—'],
                        ['Full Name', fullName],
                        ['Date of Birth', demoData?.dob ? new Date(demoData.dob).toLocaleDateString('en-GB') : '—'],
                        ['Address', demoData ? `${demoData.address}, ${demoData.city}` : '—'],
                        ['Issue Date', isApproved ? '15/03/2022' : '18/03/2018'],
                        ['Expiry Date', isApproved ? '15/03/2032' : '18/03/2025'],
                        ['Nationality', c.country],
                      ].map(([k, v]) => (
                        <div key={k} className="flex justify-between py-2 border-b border-border last:border-0">
                          <span className="text-xs text-muted-foreground">{k}</span>
                          <span className="text-xs font-medium text-foreground">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Document Classification &amp; Tampering</p>
                    <div className="grid grid-cols-2 gap-x-6">
                      {[
                        ['Blur Detection', true], ['Glare Detection', true],
                        ['Intact Corners', true], ['Photo Present', true],
                        ['Photo Manipulation', true], ['Synthetic ID', true],
                        ['Text Manipulation', true], ['Overall Authenticity', true],
                      ].map(([k, v]) => (
                        <div key={k as string} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                          <span className="text-xs text-muted-foreground">{k as string}</span>
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 size={13} className="text-green-500" />
                            <span className="text-xs font-medium text-green-600">{v ? 'Pass' : 'Detected'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Government Database Verification</p>
                    {[
                      ['Status', 'ID Found', true],
                      ['Full Name', 'Full Match', true],
                      ['Date of Birth', 'Full Match', true],
                      ['ID Number', 'Full Match', true],
                    ].map(([k, v, p]) => (
                      <div key={k as string} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
                        <span className="text-xs text-muted-foreground">{k as string}</span>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 size={13} className="text-green-500" />
                          <span className="text-xs font-medium text-green-600">{v as string}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CollapsibleSection>

              {/* Biometric Verification */}
              <CollapsibleSection title="Biometric Verification">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <MetricCard label="Face Match" value={c.faceMatch} sub={isApproved ? 'Match' : 'No Match'} status={isApproved ? 'pass' : 'fail'} />
                    <MetricCard label="Liveness Score" value={c.liveness} sub={isApproved ? 'Passed' : 'Failed'} status={isApproved ? 'pass' : 'fail'} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">ID Photo</p>
                      <div className="border border-border rounded-lg overflow-hidden h-36 bg-secondary/10 flex items-center justify-center">
                        <DocPreview preview={c.frontPreview} side="FRONT" />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Selfie</p>
                      <div className="border border-border rounded-lg overflow-hidden h-36 bg-secondary/10 flex items-center justify-center">
                        <SelfiePreviewEl preview={c.selfiePreview} />
                      </div>
                    </div>
                  </div>
                </div>
              </CollapsibleSection>

              {/* Risk Assessment */}
              <CollapsibleSection title="Risk Assessment">
                <div className="space-y-0">
                  {[
                    { label: 'Overall Assessment', value: isApproved ? 'Accept' : 'Reject', sub: isApproved ? 'Low Risk' : 'High Risk', icon: isApproved ? <CheckCircle2 size={16} className="text-green-500" /> : <AlertTriangle size={16} className="text-red-500" />, red: !isApproved },
                    { label: 'Sanctions & PEP Screening', value: 'No Watchlist Hits', sub: 'Clear', icon: <CheckCircle2 size={16} className="text-green-500" />, red: false },
                    { label: 'Duplicate Check', value: 'No Duplicates', sub: 'Clear', icon: <CheckCircle2 size={16} className="text-green-500" />, red: false },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <div>
                          <p className="text-sm font-medium text-foreground">{item.value}</p>
                          <p className="text-xs text-muted-foreground">{item.label}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${item.red ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                        {item.sub}
                      </span>
                    </div>
                  ))}
                </div>
              </CollapsibleSection>

            </div>

      {/* Right sidebar */}
      <div className="xl:col-span-1 space-y-4">

              {/* Uploaded Documents */}
              <div className="bg-white border border-border rounded-xl p-4">
                <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                  <Eye size={14} className="text-primary" /> Uploaded Documents
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'Front Side', content: <DocPreview preview={c.frontPreview} side="FRONT" /> },
                    { label: 'Back Side', content: <DocPreview preview={c.backPreview} side="BACK" /> },
                    { label: 'Selfie', content: <SelfiePreviewEl preview={c.selfiePreview} /> },
                  ].map(doc => (
                    <div key={doc.label}>
                      <p className="text-xs text-muted-foreground mb-1">{doc.label}</p>
                      <div className="border border-border rounded-lg overflow-hidden bg-secondary/10 h-28 flex items-center justify-center">
                        {doc.content}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Case Status */}
              <div className="bg-white border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-sm font-bold text-foreground">Case Status</h3>
                {[
                  { label: 'Verification', value: isApproved ? 'Passed' : c.status === 'pending' ? 'Pending' : 'Failed', green: isApproved },
                  { label: 'Risk Level', value: c.risk.replace(' Risk', ''), green: c.risk === 'Low Risk' },
                  { label: 'Decision', value: c.resolution, green: isApproved },
                  { label: 'AML Screen', value: 'Clear', green: true },
                  { label: 'Duplicates', value: 'None', green: true },
                ].map(item => (
                  <div key={item.label} className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className={`font-semibold ${item.green ? 'text-green-600' : 'text-red-600'}`}>{item.value}</span>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

        {/* ── DOCUMENTS ── */}
        {activeTab === 'documents' && (
          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-2 space-y-5">
              <div className="bg-white border border-border rounded-xl p-5">
                <h2 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                  <FileText size={15} className="text-primary" /> Document Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">OCR Results</p>
                    <div className="space-y-0">
                      {[
                        ['ID Number', demoData?.idNumber ?? '—'],
                        ['Full Name', fullName],
                        ['Date of Birth', demoData?.dob ? new Date(demoData.dob).toLocaleDateString('en-GB') : '—'],
                        ['Address', demoData ? `${demoData.address}, ${demoData.city}` : '—'],
                        ['Issue Date', isApproved ? '15/03/2022' : '18/03/2018'],
                        ['Expiry Date', isApproved ? '15/03/2032' : '18/03/2025'],
                        ['Nationality', c.country],
                      ].map(([k, v]) => (
                        <div key={k} className="flex justify-between py-2.5 border-b border-border last:border-0">
                          <span className="text-xs text-muted-foreground">{k}</span>
                          <span className="text-xs font-medium text-foreground">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-1 space-y-4">
              <div className="bg-white border border-border rounded-xl p-4">
                <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                  <Eye size={14} className="text-primary" /> Uploaded Documents
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'Front Side', content: <DocPreview preview={c.frontPreview} side="FRONT" /> },
                    { label: 'Back Side', content: <DocPreview preview={c.backPreview} side="BACK" /> },
                    { label: 'Selfie', content: <SelfiePreviewEl preview={c.selfiePreview} /> },
                  ].map(doc => (
                    <div key={doc.label}>
                      <p className="text-xs text-muted-foreground mb-1">{doc.label}</p>
                      <div className="border border-border rounded-lg overflow-hidden bg-secondary/10 h-28 flex items-center justify-center">
                        {doc.content}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── CHECKS ── */}
        {activeTab === 'checks' && (
          <div className="space-y-5">

            {/* Sub-navigation — labels only, no numbering */}
            <div className="bg-white border border-border rounded-xl overflow-hidden">
              <div className="flex border-b border-border">
                {([
                  { id: 'device', label: 'Device & Behavioral' },
                  { id: 'footprint', label: 'Digital Footprint' },
                  { id: 'aml', label: 'AML & Sanctions' },
                  { id: 'gin', label: 'GIN' },
                ] as { id: CheckSubTab; label: string }[]).map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => setCheckSubTab(sub.id)}
                    className={`flex-1 px-4 py-3 text-xs font-semibold transition-colors border-b-2 ${
                      checkSubTab === sub.id
                        ? 'border-primary text-primary bg-primary/5'
                        : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/30'
                    }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Device & Behavioral */}
            {checkSubTab === 'device' && (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <div className="bg-card border border-border rounded-xl p-5">
                    <BehaviouralBiometrics scenario={scenario} />
                    <div className="mt-6">
                      <BehavioralActionsChart scenario={scenario} />
                    </div>
                  </div>
                  <div className="bg-card border border-border rounded-xl p-5 space-y-6">
                    <h2 className="text-sm font-bold text-foreground">Device Intelligence Results</h2>
                    <DeviceSensorInsights scenario={scenario} />
                    <div className="space-y-4">
                      <h3 className="text-xs font-semibold text-foreground">Device Sensor Data</h3>
                      <GyroscopeChart />
                      <MagneticFieldChart />
                      <AccelerometerChart />
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-border rounded-xl p-5">
                  <p className="text-sm font-semibold text-foreground mb-4">Apponomics</p>
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { label: 'Social Media', count: 23, color: 'bg-blue-50 text-blue-600' },
                      { label: 'Productivity', count: 18, color: 'bg-green-50 text-green-600' },
                      { label: 'Entertainment', count: 31, color: 'bg-purple-50 text-purple-600' },
                      { label: 'Finance', count: 12, color: 'bg-orange-50 text-orange-500' },
                      { label: 'Shopping', count: 8, color: 'bg-red-50 text-red-500' },
                      { label: 'Travel', count: 15, color: 'bg-yellow-50 text-yellow-600' },
                      { label: 'Health', count: 7, color: 'bg-indigo-50 text-indigo-600' },
                      { label: 'Others', count: 42, color: 'bg-gray-50 text-gray-600' },
                    ].map(item => (
                      <div key={item.label} className={`rounded-xl border border-border ${item.color.split(' ')[0]} p-3 flex flex-col items-center gap-1`}>
                        <span className={`text-xl font-bold ${item.color.split(' ')[1]}`}>{item.count}</span>
                        <span className={`text-xs font-medium ${item.color.split(' ')[1]}`}>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Digital Footprint */}
            {checkSubTab === 'footprint' && (
              <div className="bg-white border border-border rounded-xl p-5">
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Digital Footprint Score</span>
                    <span className="text-sm font-bold text-green-600">25/100</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div className="h-2 bg-green-500 rounded-full" style={{ width: '25%' }} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground flex items-center gap-2 mb-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" /> Email Intelligence
                    </p>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        {[
                          ['Domain Valid', 'Yes', 'green'], ['Email Valid', 'Yes', 'green'],
                          ['Domain Age', '2,156 days', ''], ['Domain Risk', 'Low', 'green'],
                          ['Email Deliverable', 'Yes', 'green'], ['Corporate Email', 'Yes', 'green'],
                          ['Digital Age', '1,847 days', ''], ['Unique Hits', '47', ''],
                        ].map(([k, v, color]) => (
                          <div key={k} className="flex justify-between text-xs border-b border-border last:border-0 py-1.5">
                            <span className="text-muted-foreground">{k}:</span>
                            <span className={`font-medium ${color === 'green' ? 'text-green-600' : 'text-foreground'}`}>{v}</span>
                          </div>
                        ))}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-foreground mb-2">Email Social Footprint</p>
                        <div className="grid grid-cols-4 gap-1.5 mb-3">
                          {['Facebook','Google','Twitter','Amazon','Apple','Microsoft','Instagram','GitHub','LinkedIn','Adobe','Airbnb','Netflix','Spotify','Pinterest','Tumblr'].map(p => (
                            <span key={p} className="text-xs px-2 py-1 rounded border border-green-200 bg-green-50 text-green-700 text-center leading-tight">{p}</span>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">Not Found On:</p>
                        <div className="grid grid-cols-4 gap-1.5">
                          {['Discord','TikTok','Snapchat','WhatsApp','Telegram','Viber','WeChat','Skype','Zoom','Slack','Twitch','Reddit','YouTube','Vimeo','Flickr'].map(p => (
                            <span key={p} className="text-xs px-2 py-1 rounded border border-border bg-secondary/30 text-muted-foreground text-center leading-tight">{p}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-border pt-4">
                    <p className="text-xs font-bold text-foreground flex items-center gap-2 mb-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Phone Intelligence
                    </p>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        {[
                          ['Phone Type', 'Mobile'], ['Carrier', 'Movistar Argentina'],
                          ['Blocklisting', 'False', 'green'], ['State', 'Buenos Aires'],
                          ['Country', 'AR'], ['City', 'Buenos Aires'],
                          ['Status', 'Active', 'green'], ['Time Zone', 'GMT'],
                        ].map(([k, v, color]) => (
                          <div key={k} className="flex justify-between text-xs border-b border-border last:border-0 py-1.5">
                            <span className="text-muted-foreground">{k}:</span>
                            <span className={`font-medium ${color === 'green' ? 'text-green-600' : 'text-foreground'}`}>{v}</span>
                          </div>
                        ))}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-foreground mb-2">Phone Social Footprint</p>
                        <div className="grid grid-cols-4 gap-1.5 mb-3">
                          {['Facebook','Google','Twitter','WhatsApp','Instagram','Microsoft','Telegram'].map(p => (
                            <span key={p} className="text-xs px-2 py-1 rounded border border-green-200 bg-green-50 text-green-700 text-center leading-tight">{p}</span>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">Not Found On:</p>
                        <div className="grid grid-cols-4 gap-1.5">
                          {['Amazon','Snapchat','TikTok','Skype','Viber','WeChat','Line','Kakao','Zalo','Paytm','Grab','Swiggy','Flipkart','Bukalapak','JioMart'].map(p => (
                            <span key={p} className="text-xs px-2 py-1 rounded border border-border bg-secondary/30 text-muted-foreground text-center leading-tight">{p}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* AML & Sanctions */}
            {checkSubTab === 'aml' && (
              <div className="bg-white border border-border rounded-xl p-5">
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <p className="text-xs font-bold text-foreground mb-3">Sanctions Screening</p>
                      {[
                        ['OFAC SDN List', 'Clear'], ['EU Sanctions List', 'Clear'],
                        ['UN Sanctions List', 'Clear'], ['HMT Sanctions List', 'Clear'],
                        ['AMLC Philippines', 'Clear'],
                      ].map(([k, v]) => (
                        <div key={k} className="flex justify-between items-center py-2.5 border-b border-border last:border-0">
                          <span className="text-sm text-muted-foreground">{k}</span>
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full border border-green-200 bg-green-50 text-green-700">{v}</span>
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground mb-3">PEP Screening</p>
                      {[
                        ['Politically Exposed Person', 'Not Found'],
                        ['Government Officials', 'Not Found'],
                        ['Family Members', 'Not Found'],
                        ['Close Associates', 'Not Found'],
                      ].map(([k, v]) => (
                        <div key={k} className="flex justify-between items-center py-2.5 border-b border-border last:border-0">
                          <span className="text-sm text-muted-foreground">{k}</span>
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full border border-green-200 bg-green-50 text-green-700">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground mb-3">Adverse Media Screening</p>
                    <div className="grid grid-cols-3 gap-x-6">
                      {[
                        ['Criminal Activity', 'Not Found'], ['Financial Crime', 'Not Found'],
                        ['Terrorism', 'Not Found'], ['Fraud', 'Not Found'],
                        ['Money Laundering', 'Not Found'], ['Corruption', 'Not Found'],
                      ].map(([k, v]) => (
                        <div key={k} className="flex justify-between items-center py-2.5 border-b border-border last:border-0">
                          <span className="text-sm text-muted-foreground">{k}</span>
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full border border-green-200 bg-green-50 text-green-700">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-green-700">AML Screening Passed</p>
                      <p className="text-xs text-green-600 mt-0.5">No matches found in sanctions lists, PEP databases, or adverse media sources.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* GIN */}
            {checkSubTab === 'gin' && (
              <div className="bg-white border border-border rounded-xl p-5">
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Graph Risk Score</span>
                    <span className="text-sm font-bold text-green-600">56/1000</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div className="h-2 bg-green-500 rounded-full" style={{ width: '5.6%' }} />
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-bold text-foreground mb-3">Network Connections</p>
                        {[
                          ['Primary Device', 'iPhone 15 Pro'],
                          ['Secondary Device', 'MacBook Pro'],
                          ['Email Addresses', '4 linked'],
                          ['Phone Numbers', '2 linked'],
                        ].map(([k, v]) => (
                          <div key={k} className="flex justify-between text-xs py-2 border-b border-border last:border-0">
                            <span className="text-muted-foreground">{k}:</span>
                            <span className="text-foreground font-medium">{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="relative w-56 h-56">
                        <div className="absolute inset-0 rounded-full bg-blue-50/50 border border-blue-100" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-blue-600 text-white flex flex-col items-center justify-center text-[9px] font-bold leading-tight z-10">
                          <span>+5411</span><span>***5678</span>
                        </div>
                        {[
                          { label: 'sam***', color: 'bg-red-400', top: '8%', left: '20%' },
                          { label: 'sample', color: 'bg-red-400', top: '8%', right: '10%' },
                          { label: '1541*', color: 'bg-orange-400', top: '45%', left: '2%' },
                          { label: 's***@', color: 'bg-red-400', top: '45%', right: '4%' },
                          { label: 'iPhone', color: 'bg-green-500', bottom: '10%', left: '15%' },
                          { label: 'MacBoo', color: 'bg-green-500', bottom: '10%', right: '8%' },
                        ].map((n, i) => (
                          <div key={i} className={`absolute w-11 h-11 rounded-full ${n.color} text-white flex items-center justify-center text-[9px] font-semibold z-10`}
                            style={{ top: n.top, bottom: n.bottom, left: n.left, right: n.right }}>
                            {n.label}
                          </div>
                        ))}
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 224 224">
                          {[[112,112,50,30],[112,112,185,30],[112,112,16,108],[112,112,208,108],[112,112,50,194],[112,112,185,194]].map(([x1,y1,x2,y2],i) => (
                            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#93c5fd" strokeWidth="1.5" strokeDasharray="4 3" />
                          ))}
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-green-700">Graph Analysis Complete</p>
                      <p className="text-xs text-green-600 mt-0.5">Identity network shows consistent patterns with legitimate personal and work connections.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ── USAGE LOGS ── */}
        {activeTab === 'usage' && (() => {
          const usageLogs = [
            { type: 'Document Upload', req: `REQ-${c.id.slice(-3)}1`, pass: true, detail: `${c.idType} uploaded` },
            { type: 'OCR Extraction', req: `REQ-${c.id.slice(-3)}2`, pass: true, detail: 'Fields extracted successfully' },
            { type: 'GIN Check', req: `REQ-${c.id.slice(-3)}3`, pass: true, detail: 'Government database verified' },
            { type: 'Face Match', req: `REQ-${c.id.slice(-3)}4`, pass: isApproved, detail: `Score: ${c.faceMatch}` },
            { type: 'Liveness Check', req: `REQ-${c.id.slice(-3)}5`, pass: isApproved, detail: `Score: ${c.liveness}` },
            { type: 'AML Screening', req: `REQ-${c.id.slice(-3)}6`, pass: true, detail: 'No watchlist hits' },
            { type: 'Risk Assessment', req: `REQ-${c.id.slice(-3)}7`, pass: c.risk !== 'High Risk', detail: c.risk },
            { type: 'Case Created', req: `REQ-${c.id.slice(-3)}8`, pass: true, detail: `Assigned to ${c.assignedTo}` },
          ];
          return (
            <div className="bg-white border border-border rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <h2 className="text-sm font-bold text-foreground">Usage Logs</h2>
                <span className="text-xs text-muted-foreground">{usageLogs.length} events · {c.id}</span>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/30">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Timestamp</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">User</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Verification</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Detail</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Request ID</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {usageLogs.map((row, i) => (
                    <tr key={i} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors">
                      <td className="px-5 py-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5"><Clock size={12} />{c.date}</div>
                      </td>
                      <td className="px-5 py-3 text-xs font-medium text-foreground">{fullName}</td>
                      <td className="px-5 py-3 text-xs text-foreground font-medium">{row.type}</td>
                      <td className="px-5 py-3 text-xs text-muted-foreground">{row.detail}</td>
                      <td className="px-5 py-3 text-xs font-mono text-muted-foreground">{row.req}</td>
                      <td className="px-5 py-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${row.pass ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                          {row.pass ? 'Complete' : 'Failed'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────
export default function CasesPage() {
  const { cases: dynamicCases } = useDemoMode();
  const [selectedCase, setSelectedCase] = useState<CaseEntry | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'approved' | 'rejected' | 'pending'>('all');

  // Dynamic cases (most recent first) on top, then static fallbacks
  const allCases = [...dynamicCases, ...STATIC_CASES];

  const filtered = allCases.filter(c => {
    const matchesSearch =
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.country.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || c.status === filter;
    return matchesSearch && matchesFilter;
  });

  // If a case is selected show the full-screen detail
  if (selectedCase) {
    return <CaseFullDetail c={selectedCase} onClose={() => setSelectedCase(null)} />;
  }

  return (
    <div className="min-h-screen bg-secondary/20">
      {/* Page header */}
      <header className="bg-white border-b border-border sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold text-foreground">Case Management</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{allCases.length} total cases · {dynamicCases.length} from this session</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${dynamicCases.length > 0 ? 'bg-primary/10 text-primary border-primary/20' : 'bg-secondary text-muted-foreground border-border'}`}>
            {dynamicCases.length} new
          </span>
        </div>
      </header>

      <div className="px-6 py-5 space-y-4">
        {/* Search + filter bar */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, ID, or country..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="flex gap-1">
            {(['all', 'approved', 'rejected', 'pending'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                  filter === f ? 'bg-primary text-white' : 'bg-white border border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-secondary/30 border-b border-border">
              <tr>
                {['Case ID', 'Submitted', 'Name', 'Country', 'ID Type', 'Face Match', 'Liveness', 'Risk', 'Status', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-4 py-10 text-center text-sm text-muted-foreground">No cases found</td>
                </tr>
              )}
              {filtered.map((c, i) => (
                <tr
                  key={c.id}
                  onClick={() => setSelectedCase(c)}
                  className={`hover:bg-primary/5 cursor-pointer transition-colors ${i < dynamicCases.length ? 'bg-primary/[0.02]' : ''}`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {i < dynamicCases.length && (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" title="New from this session" />
                      )}
                      <span className="font-mono text-xs font-bold text-primary">{c.id}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{c.date}</td>
                  <td className="px-4 py-3 text-sm font-medium text-foreground">{c.name}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{c.country}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{c.idType}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold ${parseFloat(c.faceMatch) >= 70 ? 'text-green-600' : 'text-red-500'}`}>{c.faceMatch}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold ${parseFloat(c.liveness) >= 70 ? 'text-green-600' : 'text-red-500'}`}>{c.liveness}</span>
                  </td>
                  <td className="px-4 py-3"><RiskBadge risk={c.risk} /></td>
                  <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                  <td className="px-4 py-3">
                    <button className="text-xs font-medium text-primary hover:underline">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
