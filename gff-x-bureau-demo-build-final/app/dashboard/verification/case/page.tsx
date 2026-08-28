'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getAnySession, logoutAny } from '@/lib/auth';
import {
  CheckCircle2, XCircle, AlertTriangle, Shield, FileText,
  User, Activity, ChevronDown, ChevronUp, Eye, Clock,
  Fingerprint, Globe, Smartphone, Network, BarChart3, Copy, LogOut
} from 'lucide-react';
import { BehaviouralBiometrics } from '@/components/behavioural-biometrics';
import { BehavioralActionsChart } from '@/components/behavioral-actions-chart';
import { DeviceSensorInsights } from '@/components/device-sensor-insights';
import { GyroscopeChart, MagneticFieldChart, AccelerometerChart } from '@/components/device-sensor-charts';
import { IDCardDocument } from '@/components/id-card-document';
import { getDemoFacePhotos } from '@/lib/demo-face-photos';
import { getCountryDocumentConfig } from '@/lib/country-documents';
import { countryDemoData } from '@/lib/demo-country-data';
import { useDemoMode } from '@/lib/demo-context';

const COUNTRY_NAMES: Record<string, string> = {
  AR: 'Argentina', AU: 'Australia', BR: 'Brazil', CA: 'Canada',
  CN: 'China', FR: 'France', DE: 'Germany', IN: 'India',
  MX: 'Mexico', NZ: 'New Zealand', SG: 'Singapore', ZA: 'South Africa',
  ES: 'Spain', GB: 'United Kingdom', US: 'United States',
};

const CASE_ID = 'CASE-2026-' + Math.floor(10000 + Math.random() * 90000);
const SUBMITTED_AT = new Date().toLocaleString('en-US', {
  month: 'long', day: 'numeric', year: 'numeric',
  hour: '2-digit', minute: '2-digit',
});

type TabId = 'overview' | 'documents' | 'checks' | 'usage';
type CheckSubTab = 'device' | 'footprint' | 'aml' | 'gin';

interface SectionProps { title: string; children: React.ReactNode; defaultOpen?: boolean; }

function CollapsibleSection({ title, children, defaultOpen = true }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 bg-secondary/30 hover:bg-secondary/50 transition-colors"
      >
        <span className="text-sm font-semibold text-foreground">{title}</span>
        {open ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
      </button>
      {open && <div className="px-5 py-4">{children}</div>}
    </div>
  );
}

function StatusBadge({ status }: { status: 'pass' | 'fail' | 'warn' | 'clear' }) {
  const map = {
    pass: 'bg-green-50 text-green-700 border-green-200',
    fail: 'bg-red-50 text-red-700 border-red-200',
    warn: 'bg-amber-50 text-amber-700 border-amber-200',
    clear: 'bg-green-50 text-green-700 border-green-200',
  };
  const labels = { pass: 'Pass', fail: 'Failed', warn: 'Warning', clear: 'Clear' };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${map[status]}`}>
      {labels[status]}
    </span>
  );
}

function MetricCard({ label, value, sub, status }: { label: string; value: string; sub: string; status: 'fail' | 'pass' }) {
  return (
    <div className={`rounded-xl border p-4 flex flex-col gap-1 ${status === 'fail' ? 'border-red-200 bg-red-50/50' : 'border-green-200 bg-green-50/50'}`}>
      <p className={`text-2xl font-bold ${status === 'fail' ? 'text-red-600' : 'text-green-600'}`}>{value}</p>
      <p className="text-sm font-medium text-foreground">{label}</p>
      <p className={`text-xs font-medium ${status === 'fail' ? 'text-red-500' : 'text-green-500'}`}>{sub}</p>
    </div>
  );
}

function CheckRow({ label, value, pass }: { label: string; value: string; pass: boolean }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        {pass
          ? <CheckCircle2 size={14} className="text-green-500" />
          : <XCircle size={14} className="text-red-500" />
        }
        <span className={`text-sm font-medium ${pass ? 'text-green-600' : 'text-red-600'}`}>{value}</span>
      </div>
    </div>
  );
}

export default function CasePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [session, setSession] = useState<{ name: string; email: string } | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [checkSubTab, setCheckSubTab] = useState<CheckSubTab>('device');

  const { demoMode, selectedCountry } = useDemoMode();
  const [countryCode, setCountryCode] = useState('AR');
  const [idType, setIdType] = useState('National ID (DNI)');
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const s = getAnySession();
    if (!s) { router.push('/'); return; }
    setSession(s);
    // Use selectedCountry from context, fallback to localStorage
    if (selectedCountry) setCountryCode(selectedCountry);
    setIdType(sessionStorage.getItem('id-type') || 'National ID (DNI)');
    setFrontPreview(sessionStorage.getItem('id-front-preview'));
    setBackPreview(sessionStorage.getItem('id-back-preview'));
    setSelfiePreview(sessionStorage.getItem('selfie-preview'));
    setMounted(true);
  }, [router, selectedCountry]);

  const copyCase = useCallback(() => {
    navigator.clipboard.writeText(CASE_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, []);

  if (!mounted) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!session) return null;

  const countryName = COUNTRY_NAMES[countryCode] ?? countryCode;
  const isApproved = demoMode === 'success';
  const demoData = countryDemoData[countryCode]?.[demoMode] ?? countryDemoData.AR[demoMode];
  const fullName = `${demoData.firstName}${demoData.middleName ? ' ' + demoData.middleName : ''} ${demoData.lastName}`;

  // Resolve docTypeId and face photos for ID card rendering
  const docConfig = getCountryDocumentConfig(countryCode);
  const docTypeId = docConfig.documentTypes.find(d => d.label === idType || d.id === idType)?.id ?? docConfig.documentTypes[0]?.id ?? '';
  const faces = getDemoFacePhotos(countryCode, demoMode);

  // Renders the real uploaded preview, or falls back to IDCardDocument sample
  function DocPreview({ preview, side, className = '' }: { preview: string | null; side: 'FRONT' | 'BACK'; className?: string }) {
    const isReal = preview && preview !== 'placeholder';
    return isReal
      ? <img src={preview} alt={`ID ${side}`} className={`w-full h-full object-contain p-2 ${className}`} />
      : <IDCardDocument countryCode={countryCode} scenario={demoMode} side={side} facePhotoUrl={faces.documentFace} docTypeId={docTypeId} className="w-full h-full" />;
  }

  // Renders the real selfie or the demo face
  function SelfiePreviewEl({ preview, className = '' }: { preview: string | null; className?: string }) {
    const src = preview && preview !== 'placeholder' ? preview : faces.selfieFace;
    return src
      ? <img src={src} alt="Selfie" className={`w-full h-full object-cover object-top ${className}`} />
      : <p className="text-xs text-muted-foreground">Not captured</p>;
  }

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 size={15} /> },
    { id: 'documents', label: 'Documents', icon: <FileText size={15} /> },
    { id: 'checks', label: 'Checks & Regulations', icon: <Shield size={15} /> },
    { id: 'usage', label: 'Usage Logs', icon: <Activity size={15} /> },
  ];

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      {/* Case Header */}
      <div className="bg-white border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User size={18} className="text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-foreground">{fullName}</h1>
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${isApproved ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                  {isApproved ? 'Approved' : 'Rejected'}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-0.5">
                <button onClick={copyCase} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  <span>{CASE_ID}</span>
                  <Copy size={11} />
                  {copied && <span className="text-green-500 text-xs">Copied!</span>}
                </button>
                <span className="text-muted-foreground/40">·</span>
                <span className="text-xs text-muted-foreground">{countryName}</span>
                <span className="text-muted-foreground/40">·</span>
                <span className="text-xs text-muted-foreground">{idType}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Submitted</p>
              <p className="text-xs font-medium text-foreground">{SUBMITTED_AT}</p>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="text-sm font-medium px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Back to Home
            </button>
            <button
              onClick={() => { router.push(logoutAny()); }}
              className="flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg border border-border text-muted-foreground hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors"
              title="Sign out"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto mt-4 flex gap-1 overflow-x-auto">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === t.id
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.icon}{t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="min-w-0">

        {/* ── OVERVIEW ── */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            {/* Main content */}
            <div className="xl:col-span-2 space-y-5">

              {/* Verification Summary */}
              <div className="bg-white border border-border rounded-xl p-5">
                <h2 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                  <Shield size={15} className="text-primary" /> Verification Summary
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'ID Type', value: idType, icon: <FileText size={14} /> },
                    { label: 'Status', value: isApproved ? 'Approved' : 'Rejected', icon: isApproved ? <CheckCircle2 size={14} className="text-green-500" /> : <XCircle size={14} className="text-red-500" />, status: isApproved ? 'green' : 'red' },
                    { label: 'Face Match', value: isApproved ? '96.8% Match (Passed)' : '23.45% Match (Failed)', icon: <User size={14} className={isApproved ? 'text-green-400' : 'text-red-400'} />, status: isApproved ? 'green' : 'red' },
                    { label: 'Liveness Check', value: isApproved ? '99.2% Score (Passed)' : '34.12% Score (Failed)', icon: <Fingerprint size={14} className={isApproved ? 'text-green-400' : 'text-red-400'} />, status: isApproved ? 'green' : 'red' },
                    { label: 'Risk Assessment', value: isApproved ? 'Low Risk' : 'High Risk', icon: isApproved ? <Shield size={14} className="text-green-500" /> : <AlertTriangle size={14} className="text-red-500" />, status: isApproved ? 'green' : 'red' },
                    { label: 'Country', value: countryName, icon: <Globe size={14} /> },
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

              {/* Verification Details */}
              <div className="bg-white border border-border rounded-xl p-5">
                <h2 className="text-sm font-bold text-foreground mb-1 flex items-center gap-2">
                  {isApproved
                    ? <><CheckCircle2 size={15} className="text-green-500" /> Verification Passed</>
                    : <><XCircle size={15} className="text-red-500" /> Verification Failed</>}
                </h2>
                <p className="text-xs text-muted-foreground mb-4">
                  {isApproved ? 'All verification checks completed successfully' : 'Verification rejected due to failed liveness detection'}
                </p>
                {isApproved ? (
                  <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-green-700">Verification Approved</p>
                      <p className="text-xs text-green-600 mt-0.5">All checks passed — identity verified successfully with high confidence.</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                    <p className="text-xs font-semibold text-red-700 mb-2">Rejection Reasons:</p>
                    <ul className="space-y-1">
                      {[
                        'Liveness detection failed (Score: 34.12%)',
                        'Face appears to be from a static image',
                        'Face does not match document photo',
                      ].map(r => (
                        <li key={r} className="flex items-start gap-2 text-xs text-red-600">
                          <span className="mt-1 w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Identity Verification Results */}
              <CollapsibleSection title="Identity Verification Results">
                <div className="space-y-4">
                  {/* OCR Results */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">OCR Results</p>
                    <div className="space-y-0">
                      {[
                        ['ID Number', demoData.idNumber],
                        ['Full Name', fullName],
                        ['Date of Birth', new Date(demoData.dob).toLocaleDateString('en-GB')],
                        ['Address', `${demoData.address}, ${demoData.city}`],
                        ['Issue Date', isApproved ? '15/03/2022' : '18/03/2018'],
                        ['Expiry Date', isApproved ? '15/03/2032' : '18/03/2025'],
                        ['Nationality', countryName],
                      ].map(([k, v]) => (
                        <div key={k} className="flex justify-between py-2 border-b border-border last:border-0">
                          <span className="text-xs text-muted-foreground">{k}</span>
                          <span className="text-xs font-medium text-foreground">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Document Tampering */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Document Classification & Tampering</p>
                    <div className="grid grid-cols-2 gap-x-6">
                      {[
                        ['Blur Detection', true], ['Glare Detection', true],
                        ['Intact Corners', true], ['Photo Present', true],
                        ['Photo Manipulation', true], ['Synthetic ID', true],
                        ['Text Manipulation', true], ['Overall Authenticity', true],
                      ].map(([k, v]) => (
                        <CheckRow key={k as string} label={k as string} value={v ? 'Pass' : 'Detected'} pass={v as boolean} />
                      ))}
                    </div>
                  </div>

                  {/* Govt DB */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Government Database Verification</p>
                    {[
                      ['Status', 'ID Found', true],
                      ['Full Name', 'Full Match', true],
                      ['Date of Birth', 'Full Match', true],
                      ['ID Number', 'Full Match', true],
                    ].map(([k, v, p]) => (
                      <CheckRow key={k as string} label={k as string} value={v as string} pass={p as boolean} />
                    ))}
                  </div>
                </div>
              </CollapsibleSection>

              {/* Biometric Verification */}
              <CollapsibleSection title="Biometric Verification">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <MetricCard label="Face Match" value={isApproved ? '96.8%' : '23.45%'} sub={isApproved ? 'Match' : 'No Match'} status={isApproved ? 'pass' : 'fail'} />
                    <MetricCard label="Liveness Score" value={isApproved ? '99.2%' : '34.12%'} sub={isApproved ? 'Passed' : 'Failed'} status={isApproved ? 'pass' : 'fail'} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">ID Photo</p>
                      <div className="border border-border rounded-lg overflow-hidden h-36 bg-secondary/10 flex items-center justify-center">
                        <DocPreview preview={frontPreview} side="FRONT" />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Selfie</p>
                      <div className="border border-border rounded-lg overflow-hidden h-36 bg-secondary/10 flex items-center justify-center">
                        <SelfiePreviewEl preview={selfiePreview} />
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

            {/* Right sidebar — documents */}
            <div className="xl:col-span-1 space-y-4">
              <div className="bg-white border border-border rounded-xl p-4">
                <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                  <Eye size={14} className="text-primary" /> Uploaded Documents
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Front Side</p>
                    <div className="border border-border rounded-lg overflow-hidden bg-secondary/10 h-28 flex items-center justify-center">
                      <DocPreview preview={frontPreview} side="FRONT" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Back Side</p>
                    <div className="border border-border rounded-lg overflow-hidden bg-secondary/10 h-28 flex items-center justify-center">
                      <DocPreview preview={backPreview} side="BACK" />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Selfie</p>
                    <div className="border border-border rounded-lg overflow-hidden bg-secondary/10 h-28 flex items-center justify-center">
                      <SelfiePreviewEl preview={selfiePreview} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Case Status Widget */}
              <div className="bg-white border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-sm font-bold text-foreground">Case Status</h3>
                {[
                  { label: 'Verification', value: isApproved ? 'Passed' : 'Failed', green: isApproved },
                  { label: 'Risk Level', value: isApproved ? 'Low' : 'High', green: isApproved },
                  { label: 'Decision', value: isApproved ? 'Approved' : 'Rejected', green: isApproved },
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
          <div className="space-y-5">
            <div className="bg-white border border-border rounded-xl p-6">
              <h2 className="text-sm font-bold text-foreground mb-4">Submitted Documents</h2>
              <div className="grid grid-cols-3 gap-6">
                {[
                  { label: 'ID Front', type: 'Front Side of Document', content: <DocPreview preview={frontPreview} side="FRONT" /> },
                  { label: 'ID Back', type: 'Back Side of Document', content: <DocPreview preview={backPreview} side="BACK" /> },
                  { label: 'Selfie', type: 'Biometric Selfie', content: <SelfiePreviewEl preview={selfiePreview} /> },
                ].map(doc => (
                  <div key={doc.label} className="space-y-2">
                    <p className="text-sm font-semibold text-foreground">{doc.label}</p>
                    <p className="text-xs text-muted-foreground">{doc.type}</p>
                    <div className="border border-border rounded-xl overflow-hidden bg-secondary/10 h-52 flex items-center justify-center">
                      {doc.content}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CheckCircle2 size={12} className="text-green-500" />
                      <span>Uploaded successfully</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <CollapsibleSection title="OCR Extracted Data">
              <div className="grid grid-cols-2 gap-x-10">
                {[
                  ['ID Number', demoData.idNumber], ['Full Name', fullName],
                  ['Date of Birth', new Date(demoData.dob).toLocaleDateString('en-GB')], ['Nationality', countryName],
                  ['Issue Date', isApproved ? '15/03/2022' : '18/03/2018'], ['Expiry Date', isApproved ? '15/03/2032' : '18/03/2025'],
                  ['Address', `${demoData.address}, ${demoData.city}`], ['Phone', demoData.phone],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-2.5 border-b border-border last:border-0">
                    <span className="text-xs text-muted-foreground">{k}</span>
                    <span className="text-xs font-semibold text-foreground">{v}</span>
                  </div>
                ))}
              </div>
            </CollapsibleSection>
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
                    <BehaviouralBiometrics />
                    <div className="mt-6">
                      <BehavioralActionsChart />
                    </div>
                  </div>
                  <div className="bg-card border border-border rounded-xl p-5 space-y-6">
                    <h2 className="text-sm font-bold text-foreground">Device Intelligence Results</h2>
                    <DeviceSensorInsights />
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
                    <div className="grid grid-cols-3 gap-x-6 gap-y-0">
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
              <div className="bg-white border border-border rounded-xl p-5 space-y-5">
                {/* Score header */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Graph Risk Score</span>
                  <span className="text-sm font-bold text-amber-600">600/1000</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-2 bg-amber-500 rounded-full" style={{ width: '60%' }} />
                </div>

                {/* Risk Model screenshot */}
                <div className="rounded-xl overflow-hidden border border-border">
                  <img
                    src="/samples/gin-risk-model.png"
                    alt="GIN Risk Model — node graph showing Mobile, Full Name, Email, Device Fingerprint and IP Address connections"
                    className="w-full object-contain"
                  />
                </div>

                {/* Sidebar metrics from the screenshot */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-0 divide-y divide-border border border-border rounded-xl overflow-hidden">
                  {[
                    ['Email L1 Confidence', '1'],
                    ['Email L1 Count', '1'],
                    ['Email Fraud', 'No'],
                    ['Mobile L1 Confidence', '0.55'],
                    ['Mobile L1 Count', '5'],
                    ['Mobile Fraud', 'No'],
                    ['Common Phone Count 28 Days', '7'],
                    ['Common Email Count 28 Days', '7'],
                    ['Common Phone Sequence 5Digits 28 Days', '7'],
                  ].map(([k, v]) => (
                    <div key={k} className="col-span-2 flex items-center justify-between px-4 py-2.5 odd:bg-secondary/20">
                      <span className="text-xs text-muted-foreground">{k}</span>
                      <span className={`text-xs font-bold ${v === 'No' ? 'text-green-600' : 'text-foreground'}`}>{v}</span>
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-4">
                  {[
                    { color: 'bg-[#3b4fa8]', label: 'Mobile' },
                    { color: 'bg-[#f0c040]', label: 'Full Name' },
                    { color: 'bg-[#7ec8e3]', label: 'Email' },
                    { color: 'bg-[#4db6ac]', label: 'Device Fingerprint' },
                    { color: 'bg-[#66bb6a]', label: 'Ip Address' },
                  ].map(({ color, label }) => (
                    <div key={label} className="flex items-center gap-1.5">
                      <span className={`w-3 h-3 rounded-sm flex-shrink-0 ${color}`} />
                      <span className="text-xs text-muted-foreground">{label}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-amber-700">Medium Risk — Review Required</p>
                    <p className="text-xs text-amber-600 mt-0.5">Identity network shows elevated connections across mobile numbers and email addresses. Score of 600/1000 indicates moderate risk requiring manual review.</p>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ── USAGE LOGS ── */}
        {activeTab === 'usage' && (
          <div className="bg-white border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <h2 className="text-sm font-bold text-foreground">Usage Logs</h2>
              <span className="text-xs text-muted-foreground">6 events</span>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Timestamp</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">User</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Verification</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Request</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { time: SUBMITTED_AT, user: fullName, type: 'GIN Check', req: 'REQ-001', status: 'Clear', pass: true },
                  { time: SUBMITTED_AT, user: fullName, type: 'AML Screening', req: 'REQ-002', status: 'Clear', pass: true },
                  { time: SUBMITTED_AT, user: fullName, type: 'Liveness Check', req: 'REQ-003', status: isApproved ? 'Complete' : 'Failed', pass: isApproved },
                  { time: SUBMITTED_AT, user: fullName, type: 'Face Match', req: 'REQ-004', status: isApproved ? 'Complete' : 'Failed', pass: isApproved },
                  { time: SUBMITTED_AT, user: fullName, type: 'OCR Extraction', req: 'REQ-005', status: 'Complete', pass: true },
                  { time: SUBMITTED_AT, user: fullName, type: 'Document Upload', req: 'REQ-006', status: 'Complete', pass: true },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors">
                    <td className="px-5 py-3 text-xs text-muted-foreground flex items-center gap-1.5">
                      <Clock size={12} />{row.time}
                    </td>
                    <td className="px-5 py-3 text-xs font-medium text-foreground">{row.user}</td>
                    <td className="px-5 py-3 text-xs text-foreground">{row.type}</td>
                    <td className="px-5 py-3 text-xs font-mono text-muted-foreground">{row.req}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${row.pass ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
