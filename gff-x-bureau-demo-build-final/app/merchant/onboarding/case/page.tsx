'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getMerchantSession, logoutMerchant } from '@/lib/auth';
import {
  CheckCircle2, XCircle, AlertTriangle, Shield, FileText,
  User, Activity, ChevronDown, ChevronUp, Eye, Clock,
  Fingerprint, Globe, BarChart3, Copy, LogOut, Building2, Hash,
  Store, CreditCard, Landmark, BadgeCheck,
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
import { DemoModeToggle } from '@/components/demo-mode-toggle';

const COUNTRY_NAMES: Record<string, string> = {
  AR: 'Argentina', AU: 'Australia', BR: 'Brazil', CA: 'Canada',
  CN: 'China', FR: 'France', DE: 'Germany', IN: 'India',
  MX: 'Mexico', NZ: 'New Zealand', SG: 'Singapore', ZA: 'South Africa',
  ES: 'Spain', GB: 'United Kingdom', US: 'United States',
};

const CASE_ID = 'KYB-2026-' + Math.floor(10000 + Math.random() * 90000);
const SUBMITTED_AT = new Date().toLocaleString('en-US', {
  month: 'long', day: 'numeric', year: 'numeric',
  hour: '2-digit', minute: '2-digit',
});

type TabId = 'overview' | 'documents' | 'checks' | 'usage';
type CheckSubTab = 'kyb' | 'device' | 'footprint' | 'aml' | 'gin';

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

export default function MerchantCasePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [session, setSession] = useState<{ name: string; email: string } | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [checkSubTab, setCheckSubTab] = useState<CheckSubTab>('kyb');

  const { demoMode, selectedCountry, addCase } = useDemoMode();
  const [countryCode, setCountryCode] = useState('AR');
  const [idType, setIdType] = useState('National ID (DNI)');
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const [registrationNumber, setRegistrationNumber] = useState('REG-12345678');
  const [companyName, setCompanyName] = useState('Acme Corp Ltd.');
  const [copied, setCopied] = useState(false);
  const [kybConfig, setKybConfig] = useState('');
  const [uenNumber, setUenNumber] = useState('202012345K');
  const [shopImagePreview, setShopImagePreview] = useState<string | null>(null);
  const [bankStatementPreview, setBankStatementPreview] = useState<string | null>(null);

  useEffect(() => {
    const s = getMerchantSession();
    if (!s) { router.push('/merchant/login'); return; }
    setSession(s);
    if (selectedCountry) setCountryCode(selectedCountry);
    setIdType(sessionStorage.getItem('merchant-id-type') || 'National ID (DNI)');
    setFrontPreview(sessionStorage.getItem('merchant-id-front-preview'));
    setBackPreview(sessionStorage.getItem('merchant-id-back-preview'));
    setSelfiePreview(sessionStorage.getItem('merchant-selfie-preview'));
    const config = sessionStorage.getItem('merchant-kyb-config') ?? '';
    setKybConfig(config);
    if (config === 'director-kyb-sg') {
      setCompanyName('Belong Aesthetics Pte. Ltd.');
      setUenNumber(sessionStorage.getItem('merchant-uen-number') || '202300709Z');
      setShopImagePreview(sessionStorage.getItem('merchant-shop-image-preview'));
      setBankStatementPreview(sessionStorage.getItem('merchant-bank-statement-preview'));
    } else {
      setRegistrationNumber(sessionStorage.getItem('merchant-reg-number') || '806592');
      setCompanyName(sessionStorage.getItem('merchant-company-name') || 'Belong Aesthetics PTE. LTD.');
    }
    // Register this merchant onboarding as a case in the dashboard case management list
    const resolvedCompany = sessionStorage.getItem('merchant-company-name') || 'Belong Aesthetics PTE. LTD.';
    const resolvedCountry = selectedCountry || 'SG';
    const resolvedIdType = sessionStorage.getItem('merchant-id-type') || 'NRIC';
    const isSuccess = demoMode === 'success';
    const merchantCaseId = sessionStorage.getItem('merchant-case-id') || ('MCH-2026-' + Math.floor(10000 + Math.random() * 90000));
    sessionStorage.setItem('merchant-case-id', merchantCaseId);
    addCase({
      id: merchantCaseId,
      date: new Date().toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: isSuccess ? 'approved' : 'rejected',
      resolution: isSuccess ? 'Approved' : 'Rejected',
      idType: resolvedIdType,
      name: resolvedCompany,
      country: resolvedCountry === 'SG' ? 'Singapore' : resolvedCountry,
      countryCode: resolvedCountry,
      faceMatch: isSuccess ? '96.8%' : '59.85%',
      liveness: isSuccess ? '99.2%' : '27.78%',
      risk: isSuccess ? 'Low Risk' : 'High Risk',
      assignedTo: isSuccess ? 'Auto — System' : 'Manual Queue',
      priority: isSuccess ? 'Low' : 'High',
      demoMode,
      frontPreview: sessionStorage.getItem('merchant-id-front-preview'),
      backPreview: sessionStorage.getItem('merchant-id-back-preview'),
      selfiePreview: sessionStorage.getItem('merchant-selfie-preview'),
    });

    setMounted(true);
  }, [router, selectedCountry, demoMode, addCase]);

  const copyCase = useCallback(() => {
    navigator.clipboard.writeText(CASE_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, []);

  if (!mounted) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!session) return null;

  const countryName = COUNTRY_NAMES[countryCode] ?? countryCode;
  const isApproved = demoMode === 'success';
  const isSingapore = kybConfig === 'director-kyb-sg';
  const demoData = countryDemoData[countryCode]?.[demoMode] ?? countryDemoData.AR[demoMode];
  const fullName = `${demoData.firstName}${demoData.middleName ? ' ' + demoData.middleName : ''} ${demoData.lastName}`;

  const docConfig = getCountryDocumentConfig(countryCode);
  const docTypeId = docConfig.documentTypes.find(d => d.label === idType || d.id === idType)?.id ?? docConfig.documentTypes[0]?.id ?? '';
  const faces = getDemoFacePhotos(countryCode, demoMode);

  function DocPreview({ preview, side, className = '' }: { preview: string | null; side: 'FRONT' | 'BACK'; className?: string }) {
    const isReal = preview && preview !== 'placeholder';
    return isReal
      ? <img src={preview} alt={`ID ${side}`} className={`w-full h-full object-contain p-2 ${className}`} />
      : <IDCardDocument countryCode={countryCode} scenario={demoMode} side={side} facePhotoUrl={faces.documentFace} docTypeId={docTypeId} className="w-full h-full" />;
  }

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
      <div className="bg-white border-b border-border px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
              <Building2 size={18} className="text-amber-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base font-bold text-foreground">{companyName}</h1>
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${isApproved ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                  {isApproved ? 'Approved' : 'Rejected'}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-0.5">
                <button onClick={copyCase} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  <span>{CASE_ID}</span>
                  <Copy size={11} />
                  {copied && <span className="text-green-500 text-xs">Copied!</span>}
                </button>
                <span className="text-muted-foreground/40">·</span>
                <span className="text-xs text-muted-foreground">{fullName}</span>
                <span className="hidden sm:inline text-muted-foreground/40">·</span>
                <span className="hidden sm:inline text-xs text-muted-foreground">{countryName}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <DemoModeToggle />
            <div className="hidden sm:block text-right">
              <p className="text-xs text-muted-foreground">Submitted</p>
              <p className="text-xs font-medium text-foreground">{SUBMITTED_AT}</p>
            </div>
            <button
              onClick={() => router.push('/merchant/onboarding')}
              className="text-sm font-medium px-3 sm:px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
            >
              Start New
            </button>
            <button
              onClick={() => { logoutMerchant(); router.push('/merchant/login'); }}
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
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
                activeTab === t.id
                  ? 'text-amber-600 border-b-2 border-amber-500'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.icon}<span className="hidden sm:inline">{t.label}</span>
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

              {/* Business Verification Section (new, unique to merchant) */}
              <div className="bg-white border border-border rounded-xl p-5">
                <h2 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                  <Building2 size={15} className="text-amber-600" /> Business Verification
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Company Name', value: companyName, icon: <Building2 size={14} /> },
                    { label: isSingapore ? 'UEN Number' : 'Registration Number', value: isSingapore ? uenNumber : registrationNumber, icon: <Hash size={14} /> },
                    { label: 'Business Status', value: isSingapore ? 'LIVE COMPANY' : (isApproved ? 'Active & Verified' : 'Verification Failed'), icon: (isSingapore || isApproved) ? <CheckCircle2 size={14} className="text-green-500" /> : <XCircle size={14} className="text-red-500" />, status: 'green' },
                    { label: 'KYB Result', value: 'Passed', icon: <Shield size={14} className="text-green-500" />, status: 'green' },
                    ...(isSingapore ? [
                      { label: 'Issuing Authority', value: 'ACRA', icon: <BadgeCheck size={14} className="text-[#253B80]" /> },
                      { label: 'Incorporation Date', value: '05-01-2023', icon: <Clock size={14} /> },
                    ] : [
                      { label: 'Sanctions Screening', value: 'No Matches Found', icon: <CheckCircle2 size={14} className="text-green-500" />, status: 'green' },
                      { label: 'Country of Incorporation', value: countryName, icon: <Globe size={14} /> },
                    ]),
                  ].map((item: { label: string; value: string; icon: React.ReactNode; status?: string }) => (
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

              {/* Verification Summary */}
              <div className="bg-white border border-border rounded-xl p-5">
                <h2 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                  <Shield size={15} className="text-amber-600" /> Director Identity Verification
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'ID Type', value: isSingapore ? 'NRIC (Singapore)' : idType, icon: <FileText size={14} /> },
                    { label: 'Document Valid', value: 'Verified', icon: <CheckCircle2 size={14} className="text-green-500" />, status: 'green' },
                    { label: 'Face Match', value: isSingapore ? '59.85% Similarity (FACE_DETECTED)' : (isApproved ? '96.8% Match (Passed)' : '23.45% Match (Failed)'), icon: <User size={14} className={isApproved ? 'text-green-400' : 'text-red-400'} />, status: isApproved ? 'green' : 'red' },
                    { label: 'Liveness Check', value: isSingapore ? '27.78% Score (Liveness Check)' : (isApproved ? '99.2% Score (Passed)' : '34.12% Score (Failed)'), icon: <Fingerprint size={14} className={isApproved ? 'text-green-400' : 'text-red-400'} />, status: isApproved ? 'green' : 'red' },
                    { label: 'Risk Assessment', value: isApproved ? 'Low Risk' : 'High Risk', icon: isApproved ? <Shield size={14} className="text-green-500" /> : <AlertTriangle size={14} className="text-red-500" />, status: isApproved ? 'green' : 'red' },
                    { label: 'Country', value: isSingapore ? 'Singapore' : countryName, icon: <Globe size={14} /> },
                  ].map((item: { label: string; value: string; icon: React.ReactNode; status?: string }) => (
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
                    ? <><CheckCircle2 size={15} className="text-green-500" /> Onboarding Passed</>
                    : <><XCircle size={15} className="text-red-500" /> Onboarding Failed</>}
                </h2>
                <p className="text-xs text-muted-foreground mb-4">
                  {isApproved
                    ? 'All KYB and KYC checks completed successfully'
                    : 'Merchant onboarding rejected — KYB passed, director biometric verification failed'}
                </p>
                {isApproved ? (
                  <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-green-700">Merchant Onboarding Approved</p>
                      <p className="text-xs text-green-600 mt-0.5">All KYB and biometric checks passed — business and director verified successfully.</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-100 rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 size={13} className="text-green-600 flex-shrink-0" />
                      <span className="text-xs font-semibold text-green-700">KYB — Passed (Business registration verified)</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 size={13} className="text-green-600 flex-shrink-0" />
                      <span className="text-xs font-semibold text-green-700">{isSingapore ? 'NRIC — Valid (Document verified)' : 'Document — Valid'}</span>
                    </div>
                    <p className="text-xs font-semibold text-red-700 mb-1">Biometric Failure Reasons:</p>
                    <ul className="space-y-1">
                      {[
                        isSingapore ? 'Face liveness score too low (27.78% — threshold: 50%)' : 'Liveness detection failed (Score: 34.12%)',
                        isSingapore ? 'Face similarity below threshold (59.85% — threshold: 70%)' : 'Face does not match document photo',
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
              <CollapsibleSection title="Director Identity Verification Results">
                <div className="space-y-4">
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
                </div>
              </CollapsibleSection>

              {/* Biometric Verification */}
              <CollapsibleSection title="Biometric Verification">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <MetricCard
                      label="Face Match"
                      value={isSingapore ? '59.85%' : (isApproved ? '96.8%' : '23.45%')}
                      sub={isApproved ? 'Match' : 'No Match'}
                      status={isApproved ? 'pass' : 'fail'}
                    />
                    <MetricCard
                      label="Liveness Score"
                      value={isSingapore ? '27.78%' : (isApproved ? '99.2%' : '34.12%')}
                      sub={isApproved ? 'Passed' : 'Failed'}
                      status={isApproved ? 'pass' : 'fail'}
                    />
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

              {/* Singapore-specific sections */}
              {isSingapore && (
                <>
                  {/* Bank Statement Check */}
                  <CollapsibleSection title="Bank Statement Check">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                        <CheckCircle2 size={16} className="text-green-600 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-green-700">Global OCR Bank Statement — Passed</p>
                          <p className="text-xs text-green-600">Confidence: 95% · Detected: SG · Bank: OCBC Bank</p>
                        </div>
                      </div>
                      <div className="divide-y divide-border">
                        {[
                          ['Bank Name', 'OCBC Bank'],
                          ['Bank Branch', 'OCBC Centre Branch'],
                          ['Bank Address', '65 Chulia Street, OCBC Centre Singapore 049513'],
                          ['Account Number', '595185893001'],
                          ['Account Holder', 'BELONG AESTHETICS PTE. LTD.'],
                          ['Account Type', 'BUSINESS GROWTH ACCOUNT'],
                          ['Address', '4 EVERTON PARK #05-50 EVERTON PARK SINGAPORE 080004'],
                          ['Statement Period', '01-01-2025 to 31-01-2025'],
                          ['Currency', 'SGD'],
                          ['Detected Country', 'SG'],
                          ['AI Generated', 'No'],
                          ['Tampered Document', 'No'],
                        ].map(([k, v]) => (
                          <div key={k} className="flex justify-between py-2.5">
                            <span className="text-xs text-muted-foreground">{k}</span>
                            <span className="text-xs font-medium text-foreground">{v}</span>
                          </div>
                        ))}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Quality Checks</p>
                        <div className="grid grid-cols-2 gap-x-6">
                          {[
                            ['Document Fully Visible', true],
                            ['Glare Free', true],
                            ['Readability', true],
                            ['Finger Presence', false],
                          ].map(([k, v]) => (
                            <CheckRow key={k as string} label={k as string} value={v ? 'Pass' : 'Not Detected'} pass={v as boolean} />
                          ))}
                        </div>
                      </div>
                      {bankStatementPreview && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-2">Uploaded Document</p>
                          <div className="border border-border rounded-xl overflow-hidden bg-secondary/10 h-40 flex items-center justify-center">
                            <img src={bankStatementPreview} alt="Bank Statement" className="max-h-full max-w-full object-contain" />
                          </div>
                        </div>
                      )}
                    </div>
                  </CollapsibleSection>

                  {/* Shop Authenticity Check */}
                  <CollapsibleSection title="Shop Authenticity Check">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                        <CheckCircle2 size={16} className="text-green-600 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-green-700">Shop Authenticity Verified — Passed</p>
                          <p className="text-xs text-green-600">Shop Name: Walgreens · MCC: Grocery Stores & Supermarkets (5411)</p>
                        </div>
                      </div>
                      <div className="divide-y divide-border">
                        {[
                          ['Shop Name', 'Walgreens'],
                          ['Shop Name Translated', 'Walgreens'],
                          ['Shop Board Type', 'Permanent Board'],
                          ['MCC Code', '5411 — Grocery Stores, Supermarkets'],
                          ['Is Live Shop', 'Yes'],
                          ['Is Movable', 'No'],
                          ['Shop Name Visible', 'Yes'],
                          ['Cash Counter / Registry', 'Present'],
                          ['Inventory Present', 'No'],
                        ].map(([k, v]) => (
                          <div key={k} className="flex justify-between py-2.5">
                            <span className="text-xs text-muted-foreground">{k}</span>
                            <span className="text-xs font-medium text-foreground">{v}</span>
                          </div>
                        ))}
                      </div>
                      {shopImagePreview && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-2">Uploaded Shop Image</p>
                          <div className="border border-border rounded-xl overflow-hidden bg-secondary/10 h-40 flex items-center justify-center">
                            <img src={shopImagePreview} alt="Shop" className="w-full h-full object-cover" />
                          </div>
                        </div>
                      )}
                    </div>
                  </CollapsibleSection>

                  {/* UEN Verification */}
                  <CollapsibleSection title="UEN Verification (ACRA)">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                        <CheckCircle2 size={16} className="text-green-600 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-green-700">Business Verification using UEN — Passed</p>
                          <p className="text-xs text-green-600">UEN QR Advanced · Source: acratrustbar.gov.sg · Verified: 24-04-2026</p>
                        </div>
                      </div>
                      <div className="divide-y divide-border">
                        {[
                          ['Entity Name', 'BELONG AESTHETICS PTE. LTD.'],
                          ['UEN Number', '202300709Z'],
                          ['Entity Status', 'LIVE COMPANY'],
                          ['Company Type', 'PRIVATE COMPANY LIMITED BY SHARES'],
                          ['Incorporation Date', '05-01-2023'],
                          ['Issuing Authority', 'ACRA'],
                          ['Registered Address', '103 IRRAWADDY ROAD, #02-08, ROYAL SQUARE AT NOVENA, SINGAPORE 329566'],
                          ['Primary Activity', 'BEAUTY SALONS AND SPAS — SSIC 96022'],
                          ['Last Annual Return', '28-03-2025'],
                          ['Last AGM', '28-03-2025'],
                          ['FYE (Last AR)', '31-12-2024'],
                          ['Receipt Number', 'ACRA250728007044'],
                        ].map(([k, v]) => (
                          <div key={k} className="flex justify-between py-2.5 gap-4">
                            <span className="text-xs text-muted-foreground flex-shrink-0 w-44">{k}</span>
                            <span className="text-xs font-medium text-foreground text-right">{v}</span>
                          </div>
                        ))}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Directors & Officers</p>
                        <div className="space-y-2">
                          {[
                            { name: 'TEO TECK WEE, TROY (ZHANG DEWEI, TROY)', role: 'Director', id: 'S8411446D', nationality: 'Singapore Citizen', since: '05-01-2023' },
                            { name: 'WU WENYANG', role: 'Secretary', id: 'S8063879E', nationality: 'Singapore Citizen', since: '01-01-2024' },
                          ].map(o => (
                            <div key={o.id} className="border border-border rounded-lg p-3 flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#253B80]/10 flex items-center justify-center flex-shrink-0">
                                <User size={14} className="text-[#253B80]" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-foreground">{o.name}</p>
                                <p className="text-xs text-muted-foreground">{o.role} · {o.nationality}</p>
                                <p className="text-xs text-muted-foreground">ID: {o.id} · Since: {o.since}</p>
                              </div>
                              <CheckCircle2 size={14} className="text-green-500 flex-shrink-0 mt-0.5" />
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Shareholder</p>
                        <div className="border border-border rounded-lg p-3 flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                            <User size={14} className="text-amber-600" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-foreground">TEO TECK WEE, TROY (ZHANG DEWEI, TROY)</p>
                            <p className="text-xs text-muted-foreground">50,000 Ordinary Shares · SGD 50,000 Paid-up Capital</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CollapsibleSection>

                  {/* NRIC Verification */}
                  <CollapsibleSection title="NRIC Verification">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                        <CheckCircle2 size={16} className="text-green-600 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-green-700">NRIC/FIN Lite — Valid</p>
                          <p className="text-xs text-green-600">Singapore National Identity Card verified successfully</p>
                        </div>
                      </div>
                      <div className="divide-y divide-border">
                        {[
                          ['NRIC Number', 'S8411446D'],
                          ['Is Valid', 'Yes'],
                          ['Document Type', 'National ID (NRIC)'],
                          ['Full Name (OCR)', 'JING DU'],
                          ['Date of Birth', '06-02-1986'],
                          ['Gender', 'F'],
                          ['Race', 'Chinese'],
                          ['Country of Birth', 'China'],
                          ['Issuing Country', 'Singapore'],
                          ['Document Number', 'S8677322H'],
                          ['Tampered', 'No'],
                        ].map(([k, v]) => (
                          <div key={k} className="flex justify-between py-2.5">
                            <span className="text-xs text-muted-foreground">{k}</span>
                            <span className="text-xs font-medium text-foreground">{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CollapsibleSection>
                </>
              )}

              {/* Risk Assessment */}
              <CollapsibleSection title="Risk Assessment">
                <div className="space-y-0">
                  {[
                    { label: 'Overall Assessment', value: isApproved ? 'Accept' : 'Reject', sub: isApproved ? 'Low Risk' : 'High Risk', icon: isApproved ? <CheckCircle2 size={16} className="text-green-500" /> : <AlertTriangle size={16} className="text-red-500" />, red: !isApproved },
                    { label: 'Business Sanctions Screening', value: 'No Watchlist Hits', sub: 'Clear', icon: <CheckCircle2 size={16} className="text-green-500" />, red: false },
                    { label: 'Director AML Check', value: 'No Watchlist Hits', sub: 'Clear', icon: <CheckCircle2 size={16} className="text-green-500" />, red: false },
                    { label: 'Duplicate Business Check', value: 'No Duplicates', sub: 'Clear', icon: <CheckCircle2 size={16} className="text-green-500" />, red: false },
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
              {/* Business Info Widget */}
              <div className="bg-white border border-border rounded-xl p-4 space-y-3">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Building2 size={14} className="text-amber-600" /> Business Info
                </h3>
                {[
                  { label: 'Company', value: companyName },
                  { label: isSingapore ? 'UEN' : 'Reg. Number', value: isSingapore ? uenNumber : registrationNumber },
                  { label: 'KYB Status', value: isApproved ? 'Approved' : 'Rejected', green: isApproved },
                  ...(isSingapore ? [{ label: 'ACRA Status', value: 'Live Company', green: true }] : []),
                  { label: 'AML Screen', value: 'Clear', green: true },
                  { label: 'Sanctions', value: 'Clear', green: true },
                ].map(item => (
                  <div key={item.label} className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className={`font-semibold ${item.green === false ? 'text-red-600' : item.green ? 'text-green-600' : 'text-foreground'}`}>{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="bg-white border border-border rounded-xl p-4">
                <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                  <Eye size={14} className="text-amber-600" /> Uploaded Documents
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
                  { label: 'KYB', value: 'Passed', green: true },
                  { label: isSingapore ? 'NRIC Validity' : 'Document Validity', value: 'Valid', green: true },
                  { label: 'Biometric Verification', value: isApproved ? 'Passed' : 'Failed', green: isApproved },
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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
            <div className="bg-white border border-border rounded-xl overflow-hidden">
              <div className="flex border-b border-border">
                {([
                  { id: 'kyb', label: 'KYB Results' },
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
                        ? 'border-amber-500 text-amber-600 bg-amber-500/5'
                        : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/30'
                    }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            </div>

            {checkSubTab === 'kyb' && (
              <div className="space-y-5">
                {/* Summary header */}
                <div className="rounded-xl border p-5 flex items-start gap-4 bg-green-50 border-green-200">
                  <CheckCircle2 size={22} className="text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-green-700">
                      KYB Verification Passed
                    </p>
                    <p className="text-xs mt-0.5 text-green-600">
                      {isSingapore
                        ? `Belong Aesthetics Pte. Ltd. · UEN ${uenNumber} · ACRA Singapore`
                        : 'Belong Aesthetics PTE. LTD. · Registration No. 806592 · California Secretary of State'}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-xs text-muted-foreground">{isSingapore ? 'Incorporated' : 'Filed'}</p>
                    <p className="text-xs font-semibold text-foreground">{isSingapore ? '05-01-2023' : 'Jan 3, 1977'}</p>
                  </div>
                </div>

                {/* Core registration data */}
                <div className="bg-white border border-border rounded-xl overflow-hidden">
                  <div className="px-5 py-3 border-b border-border bg-secondary/30">
                    <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">Business Registration Details</h3>
                  </div>
                  <div className="divide-y divide-border">
                    {(isSingapore ? [
                      { label: 'Legal Name', value: 'BELONG AESTHETICS PTE. LTD.' },
                      { label: 'UEN Number', value: '202300709Z' },
                      { label: 'Entity Type', value: 'PRIVATE COMPANY LIMITED BY SHARES' },
                      { label: 'Jurisdiction', value: 'Singapore' },
                      { label: 'Status', value: 'LIVE COMPANY', green: true },
                      { label: 'Incorporation Date', value: '05-01-2023' },
                      { label: 'Last Annual Return', value: '28-03-2025' },
                      { label: 'Last AGM', value: '28-03-2025' },
                      { label: 'FYE (Last AR)', value: '31-12-2024' },
                      { label: 'Registered Address', value: '103 IRRAWADDY ROAD, #02-08, ROYAL SQUARE AT NOVENA, SINGAPORE 329566' },
                      { label: 'Primary Activity', value: 'BEAUTY SALONS AND SPAS (SSIC 96022)' },
                      { label: 'Issuing Authority', value: 'ACRA' },
                      { label: 'Document Type', value: 'businessRegistration' },
                      { label: 'Confidence Score', value: '95%' },
                      { label: 'Tampered Document', value: 'No', green: true },
                      { label: 'Receipt Number', value: 'ACRA250728007044' },
                      { label: 'Verified On', value: '24-04-2026', green: true },
                    ] : [
                      { label: 'Legal Name', value: 'BELONG AESTHETICS PTE. LTD.' },
                      { label: 'Registration Number', value: '806592' },
                      { label: 'Entity Type', value: 'Domestic Stock Corporation' },
                      { label: 'Jurisdiction', value: 'California, United States' },
                      { label: 'Status', value: 'Active', green: true },
                      { label: 'Registration Date', value: '03-01-1977' },
                      { label: 'Last Filing', value: '06-02-2024' },
                      { label: 'Registered Agent', value: 'C T CORPORATION SYSTEM, 330 N BRAND BLVD STE #700, GLENDALE, CA 91203' },
                      { label: 'Sos', value: 'Good' },
                      { label: 'Standing Ftb', value: 'Good' },
                      { label: 'Standard Agent', value: 'Good' },
                      { label: 'Standing Vcfcf', value: 'Good' },
                      { label: 'Filing Type', value: 'Foreign' },
                      { label: 'Last Si File Number', value: 'BA20242027201' },
                      { label: 'Business Type', value: 'SOCIAL MEDIA' },
                      { label: 'Initial Filing Date', value: '12/15/2004' },
                      { label: 'Formation Date', value: '12/15/2004' },
                      { label: 'Standing Sos', value: 'Good' },
                      { label: 'Standing Agent', value: 'Good' },
                      { label: 'Place Of Formation', value: 'DELAWARE' },
                      { label: 'Statement Of Info Due Date', value: '12/31/2026' },
                      { label: 'Status Info', value: 'Active', green: true },
                    ]).map(({ label, value, green }) => (
                      <div key={label} className="flex items-start justify-between px-5 py-3 gap-4">
                        <span className="text-xs text-muted-foreground w-52 flex-shrink-0">{label}</span>
                        <span className={`text-xs font-medium text-right ${green ? 'text-green-600' : 'text-foreground'}`}>{value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="px-5 py-3 border-t border-border bg-secondary/20">
                    <p className="text-xs font-semibold text-foreground mb-0.5">Source:</p>
                    <p className="text-xs text-muted-foreground">{isSingapore ? '– ACRA (acratrustbar.gov.sg)' : '– California Secretary of State'}</p>
                  </div>
                </div>

                {/* Match Results — from Global Company Detail response */}
                {!isSingapore && (() => {
                  const matchResults = [
                    { field: 'Name',                      inputValue: 'Shopify Inc.',                                                                    databaseValue: 'shopify inc.',                                                             details: 'MATCH',        score: 100 },
                    { field: 'Company Doing Business As', inputValue: 'Shopify',                                                                          databaseValue: 'shopify tm',                                                               details: 'MATCH',        score: 96.15 },
                    { field: 'Address',                   inputValue: '151 O\'Connor Street, Ground Floor, Ottawa, Ontario, K2P 1L4, CA',                 databaseValue: '151 o\'connor st., ground floor, ottawa ontario k2p2l8, canada',           details: 'MATCH',        score: 83.75 },
                    { field: 'Country of Incorporation',  inputValue: 'CA',                                                                               databaseValue: 'CA',                                                                       details: 'MATCH',        score: 100 },
                    { field: 'Company Industry',          inputValue: 'Technology / E-commerce / SaaS',                                                   databaseValue: 'autres services',                                                          details: 'NO_MATCH',     score: 37.81 },
                    { field: 'Legal Subsidiaries',        inputValue: 'Shopify Payments; Shopify Capital; Shopify Logistics',                             databaseValue: 'shopify tm (établissement principal)',                                      details: 'NO_MATCH',     score: 45.1 },
                    { field: 'Products & Services',       inputValue: 'E-commerce platform providing online store creation and merchant services',         databaseValue: 'autres services',                                                          details: 'NO_MATCH',     score: 20.82 },
                    { field: 'Rep. Job Title',            inputValue: 'Founder and Chief Executive Officer',                                              databaseValue: 'shareholder',                                                              details: 'NO_MATCH',     score: 11.11 },
                    { field: 'Rep. First Name',           inputValue: 'Tobi',                                                                             databaseValue: 'in',                                                                       details: 'NO_MATCH',     score: 0 },
                    { field: 'Rep. Last Name',            inputValue: 'Lütke',                                                                            databaseValue: 'form',                                                                     details: 'NO_MATCH',     score: 0 },
                    { field: 'Registration Number',       inputValue: '—',                                                                                databaseValue: '1169259380',                                                               details: 'EMPTY_INPUT',  score: 0 },
                    { field: 'Website',                   inputValue: 'https://www.shopify.com',                                                          databaseValue: '—',                                                                        details: 'EMPTY_INPUT',  score: 0 },
                    { field: 'Type of Legal Entity',      inputValue: 'Public Corporation',                                                               databaseValue: '—',                                                                        details: 'EMPTY_INPUT',  score: 0 },
                    { field: 'Year of Incorporation',     inputValue: '2004-09-28',                                                                       databaseValue: '—',                                                                        details: 'EMPTY_INPUT',  score: 0 },
                    { field: 'Company Phone',             inputValue: '+1-888-746-7439',                                                                   databaseValue: '—',                                                                        details: 'EMPTY_INPUT',  score: 0 },
                    { field: 'Company LEI',               inputValue: '549300LJC4ZJ92U8EY16',                                                             databaseValue: '—',                                                                        details: 'EMPTY_INPUT',  score: 0 },
                  ];

                  const matchCount   = matchResults.filter(r => r.details === 'MATCH').length;
                  const noMatchCount = matchResults.filter(r => r.details === 'NO_MATCH').length;
                  const emptyCount   = matchResults.filter(r => r.details === 'EMPTY_INPUT').length;

                  const detailsConfig = {
                    MATCH:       { label: 'Match',       bg: 'bg-green-100',  text: 'text-green-700',  dot: 'bg-green-500' },
                    NO_MATCH:    { label: 'No Match',    bg: 'bg-red-100',    text: 'text-red-700',    dot: 'bg-red-500' },
                    EMPTY_INPUT: { label: 'Empty Input', bg: 'bg-amber-100',  text: 'text-amber-700',  dot: 'bg-amber-400' },
                  } as const;

                  return (
                    <div className="bg-white border border-border rounded-xl overflow-hidden">
                      <div className="px-5 py-3 border-b border-border bg-secondary/30 flex items-center justify-between flex-wrap gap-2">
                        <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">Match Results</h3>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1 text-xs text-green-700"><span className="w-2 h-2 rounded-full bg-green-500 inline-block" />{matchCount} Match</span>
                          <span className="flex items-center gap-1 text-xs text-red-700"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" />{noMatchCount} No Match</span>
                          <span className="flex items-center gap-1 text-xs text-amber-700"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />{emptyCount} Empty</span>
                        </div>
                      </div>
                      {/* Column headers */}
                      <div className="grid grid-cols-[180px_1fr_1fr_90px_80px] gap-3 px-5 py-2 bg-secondary/20 border-b border-border">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Field</span>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Input Value</span>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Database Value</span>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Score</span>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Result</span>
                      </div>
                      <div className="divide-y divide-border">
                        {matchResults.map(({ field, inputValue, databaseValue, details, score }) => {
                          const cfg = detailsConfig[details as keyof typeof detailsConfig];
                          return (
                            <div key={field} className="grid grid-cols-[180px_1fr_1fr_90px_80px] gap-3 px-5 py-2.5 items-center hover:bg-secondary/10 transition-colors">
                              <span className="text-xs font-medium text-foreground truncate">{field}</span>
                              <span className="text-xs text-muted-foreground truncate" title={inputValue}>{inputValue || '—'}</span>
                              <span className="text-xs text-muted-foreground truncate" title={databaseValue}>{databaseValue || '—'}</span>
                              <div className="flex items-center gap-1.5">
                                <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${score >= 80 ? 'bg-green-500' : score >= 40 ? 'bg-amber-400' : 'bg-red-400'}`}
                                    style={{ width: `${score}%` }}
                                  />
                                </div>
                                <span className="text-[10px] font-mono text-muted-foreground w-7 text-right flex-shrink-0">{score > 0 ? `${score}` : '—'}</span>
                              </div>
                              <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>
                                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />{cfg.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="px-5 py-3 border-t border-border bg-secondary/20">
                        <p className="text-xs text-muted-foreground">Source: Global Company Detail · Transaction <span className="font-mono">eb286ad2-49aa-48ff-b29d-a97b57fcde0c</span></p>
                      </div>
                    </div>
                  );
                })()}

                {/* Checks grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(isSingapore ? [
                    { label: 'Entity Active', pass: true, value: 'Live Company' },
                    { label: 'UEN Verified', pass: true, value: 'Verified' },
                    { label: 'Name Match', pass: true, value: 'Matched' },
                    { label: 'ACRA Registered', pass: true, value: 'Yes' },
                    { label: 'Bank Statement', pass: true, value: 'Verified' },
                    { label: 'Shop Authenticity', pass: true, value: 'Confirmed' },
                  ] : [
                    { label: 'Entity Active', pass: true, value: 'Active' },
                    { label: 'Name Match', pass: true, value: 'Matched' },
                    { label: 'Reg. Number Verified', pass: true, value: 'Verified' },
                    { label: 'Good Standing', pass: true, value: 'Yes' },
                    { label: 'Publicly Traded', pass: true, value: 'Confirmed' },
                    { label: 'Agent on File', pass: true, value: 'CT Corp' },
                  ]).map(({ label, pass, value }) => (
                    <div key={label} className={`rounded-lg border p-3 ${pass ? 'border-green-200 bg-green-50/50' : 'border-red-200 bg-red-50/50'}`}>
                      <div className="flex items-center gap-1.5 mb-1">
                        {pass
                          ? <CheckCircle2 size={13} className="text-green-500" />
                          : <XCircle size={13} className="text-red-500" />
                        }
                        <span className={`text-xs font-semibold ${pass ? 'text-green-700' : 'text-red-700'}`}>{value}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{label}</p>
                    </div>
                  ))}
                </div>

                {/* Filing history */}
                <div className="bg-white border border-border rounded-xl overflow-hidden">
                  <div className="px-5 py-3 border-b border-border bg-secondary/30 flex items-center justify-between">
                    <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">
                      {isSingapore ? 'Statutory Filings (ACRA)' : 'Filing History'}
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      {isSingapore ? 'Annual Returns & AGM Records' : 'Publicly Traded Corporate Disclosure Statements'}
                    </span>
                  </div>
                  <div className="divide-y divide-border max-h-72 overflow-y-auto">
                    {isSingapore ? (
                      <>
                        {[
                          { date: '28-03-2025', id: 'I250728011238', label: 'Annual Return (FYE 31-12-2024)' },
                          { date: '28-03-2025', id: 'AGM-2025-001', label: 'Annual General Meeting' },
                          { date: '05-03-2026', id: 'SEC-2026-001', label: 'Secretary Appointment — LOW LI HAO' },
                          { date: '05-03-2026', id: 'DIR-2026-001', label: 'Director Appointment — TEO MING CHOON' },
                          { date: '31-01-2023', id: 'ADDR-2023-001', label: 'Registered Address Filed' },
                          { date: '05-01-2023', id: 'ACRA250728007044', label: 'Company Incorporation' },
                        ].map(({ date, id, label }) => (
                          <div key={id} className="flex items-center justify-between px-5 py-2.5">
                            <div className="flex items-center gap-3">
                              <CheckCircle2 size={12} className="text-green-500 flex-shrink-0" />
                              <span className="text-xs text-foreground">{label}</span>
                            </div>
                            <div className="flex items-center gap-4 flex-shrink-0">
                              <span className="text-xs font-mono text-muted-foreground">{id}</span>
                              <span className="text-xs text-muted-foreground">{date}</span>
                            </div>
                          </div>
                        ))}
                      </>
                    ) : (
                      <>
                        {[
                          { date: '06-02-2024', control_id: 'BA20240248991' },
                          { date: '15-02-2023', control_id: 'BA20230330786' },
                          { date: '28-01-2022', control_id: 'LBA22961659' },
                          { date: '03-09-2021', control_id: 'LBA22961657' },
                          { date: '18-02-2020', control_id: 'LBA22961654' },
                          { date: '31-01-2019', control_id: 'LBA22961652' },
                          { date: '02-05-2018', control_id: 'LBA22961651' },
                          { date: '03-02-2017', control_id: 'LBA22961650' },
                          { date: '02-01-2016', control_id: 'LBA22961649' },
                          { date: '20-02-2015', control_id: 'LBA22961648' },
                        ].map(({ date, control_id }) => (
                          <div key={control_id} className="flex items-center justify-between px-5 py-2.5">
                            <div className="flex items-center gap-3">
                              <CheckCircle2 size={12} className="text-green-500 flex-shrink-0" />
                              <span className="text-xs text-foreground">Publicly Traded Corporate Disclosure Statement</span>
                            </div>
                            <div className="flex items-center gap-4 flex-shrink-0">
                              <span className="text-xs font-mono text-muted-foreground">{control_id}</span>
                              <span className="text-xs text-muted-foreground">{date}</span>
                            </div>
                          </div>
                        ))}
                        <div key="soi-2023" className="flex items-center justify-between px-5 py-2.5">
                          <div className="flex items-center gap-3">
                            <CheckCircle2 size={12} className="text-green-500 flex-shrink-0" />
                            <span className="text-xs text-foreground">Statement of Information</span>
                          </div>
                          <div className="flex items-center gap-4 flex-shrink-0">
                            <span className="text-xs font-mono text-muted-foreground">BA20231736595</span>
                            <span className="text-xs text-muted-foreground">14-11-2023</span>
                          </div>
                        </div>
                        <div key="soi-2023b" className="flex items-center justify-between px-5 py-2.5">
                          <div className="flex items-center gap-3">
                            <CheckCircle2 size={12} className="text-green-500 flex-shrink-0" />
                            <span className="text-xs text-foreground">Statement of Information — CRA Changed</span>
                          </div>
                          <div className="flex items-center gap-4 flex-shrink-0">
                            <span className="text-xs font-mono text-muted-foreground">BA20230832015</span>
                            <span className="text-xs text-muted-foreground">22-05-2023</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>



                {/* Officers */}
                <div className="bg-white border border-border rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-base font-bold text-foreground">Officers</h3>
                    <button className="flex items-center gap-1 text-xs border border-border rounded-full px-3 py-1 text-muted-foreground hover:bg-secondary transition-colors">
                      Check AML Risk <span className="text-amber-500">&#9658;</span>
                    </button>
                  </div>
                  <p className="text-sm font-semibold text-foreground mb-4">Management &amp; Board</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(isSingapore ? [
                      { name: 'TEO TECK WEE, TROY (ZHANG DEWEI, TROY)', role: 'Director' },
                      { name: 'LOW LI HAO', role: 'Secretary' },
                      { name: 'WU WENYANG', role: 'Secretary' },
                    ] : [
                      { name: 'JAVIER OLIVAN', role: 'Other' },
                      { name: 'AARON ANDERSON', role: 'Other' },
                      { name: 'DAVID WEHNER', role: 'Other' },
                      { name: 'TODD HEYSSE', role: 'Treasurer' },
                      { name: 'CHRISTOPHER COX', role: 'Other' },
                      { name: 'JENNIFER NEWSTEAD', role: 'Other' },
                      { name: 'ANDREW BOSWORTH', role: 'Other' },
                      { name: 'NICHOLAS CLEGG', role: 'Other' },
                      { name: 'FRANCES ERSKINE', role: 'Vice President' },
                      { name: 'JONATHAN WENDT', role: 'Other' },
                      { name: 'KATHERINE R. KELLY', role: 'Secretary' },
                      { name: 'MARK ZUCKERBERG', role: 'Chief Executive Officer' },
                    ]).map(({ name, role }) => (
                      <div key={name} className="border border-border rounded-xl overflow-hidden">
                        <div className="p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                              <User size={14} className="text-green-600" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-foreground leading-tight">{name}</p>
                              <p className="text-xs text-muted-foreground">{role}</p>
                            </div>
                          </div>
                          <button className="flex items-center gap-1 text-xs border border-border rounded-full px-2 py-0.5 text-muted-foreground hover:bg-secondary transition-colors mt-1">
                            Check AML Risk <span className="text-amber-500 ml-0.5">&#9658;</span>
                          </button>
                        </div>
                        <button className="w-full flex items-center justify-between px-3 py-2 border-t border-border text-xs text-muted-foreground hover:bg-secondary/40 transition-colors">
                          <span>Read more</span>
                          <ChevronDown size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>


              </div>
            )}

            {checkSubTab === 'device' && (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <div className="bg-card border border-border rounded-xl p-5">
                    <BehaviouralBiometrics />
                    <div className="mt-6"><BehavioralActionsChart /></div>
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
              </div>
            )}

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
                          {['Facebook','Google','Twitter','Amazon','Apple','Microsoft','Instagram','GitHub','LinkedIn'].map(p => (
                            <span key={p} className="text-xs px-2 py-1 rounded border border-green-200 bg-green-50 text-green-700 text-center leading-tight">{p}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Phone Intelligence */}
                  <div className="border-t border-border pt-5">
                    <p className="text-xs font-bold text-foreground flex items-center gap-2 mb-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Phone Intelligence
                    </p>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        {[
                          ['Phone Valid', 'Yes', 'green'],
                          ['Phone Type', 'Mobile', ''],
                          ['Carrier', 'AT&T', ''],
                          ['Country Code', '+1', ''],
                          ['Phone Risk', 'Low', 'green'],
                          ['Line Active', 'Yes', 'green'],
                          ['Phone Age', '1,240 days', ''],
                          ['Ported', 'No', 'green'],
                          ['Roaming', 'No', ''],
                          ['Unique Hits', '12', ''],
                        ].map(([k, v, color]) => (
                          <div key={k} className="flex justify-between text-xs border-b border-border last:border-0 py-1.5">
                            <span className="text-muted-foreground">{k}:</span>
                            <span className={`font-medium ${color === 'green' ? 'text-green-600' : 'text-foreground'}`}>{v}</span>
                          </div>
                        ))}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-foreground mb-2">Phone Social Footprint</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                          {['WhatsApp','Telegram','Signal','Viber','WeChat','Truecaller'].map(p => (
                            <span key={p} className="text-xs px-2 py-1 rounded border border-amber-200 bg-amber-50 text-amber-700 text-center leading-tight">{p}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {checkSubTab === 'aml' && (
              <div className="bg-white border border-border rounded-xl p-5">
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <p className="text-xs font-bold text-foreground mb-3">Business Sanctions Screening</p>
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
                      <p className="text-xs font-bold text-foreground mb-3">Director PEP Screening</p>
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
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-green-700">AML Screening Passed</p>
                      <p className="text-xs text-green-600 mt-0.5">No matches found in sanctions lists, PEP databases, or adverse media sources for business or director.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

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
              <span className="text-xs text-muted-foreground">7 events</span>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Timestamp</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Entity</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Verification</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Request</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { time: SUBMITTED_AT, entity: companyName, type: 'Business Registration Check', req: 'REQ-001', status: 'Clear', pass: true },
                  { time: SUBMITTED_AT, entity: companyName, type: 'Business AML Screening', req: 'REQ-002', status: 'Clear', pass: true },
                  { time: SUBMITTED_AT, entity: fullName, type: 'GIN Check', req: 'REQ-003', status: 'Clear', pass: true },
                  { time: SUBMITTED_AT, entity: fullName, type: 'Director AML Screening', req: 'REQ-004', status: 'Clear', pass: true },
                  { time: SUBMITTED_AT, entity: fullName, type: 'Liveness Check', req: 'REQ-005', status: isApproved ? 'Complete' : 'Failed', pass: isApproved },
                  { time: SUBMITTED_AT, entity: fullName, type: 'Face Match', req: 'REQ-006', status: isApproved ? 'Complete' : 'Failed', pass: isApproved },
                  { time: SUBMITTED_AT, entity: fullName, type: 'Document Upload', req: 'REQ-007', status: 'Complete', pass: true },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors">
                    <td className="px-5 py-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5"><Clock size={12} />{row.time}</div>
                    </td>
                    <td className="px-5 py-3 text-xs font-medium text-foreground">{row.entity}</td>
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
