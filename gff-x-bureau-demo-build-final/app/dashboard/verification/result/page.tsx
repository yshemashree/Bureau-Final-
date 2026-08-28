'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAnySession, logoutAny, getSession } from '@/lib/auth';
import { useDemoMode, getVerificationResult, type CaseEntry } from '@/lib/demo-context';
import { DemoModeBadge } from '@/components/demo-mode-badge';
import { IDCardDocument } from '@/components/id-card-document';
import { getDemoFacePhotos } from '@/lib/demo-face-photos';
import { getCountryDocumentConfig } from '@/lib/country-documents';
import { Button } from '@/components/ui/button';
import { LogOut, ChevronLeft, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

const COUNTRY_FLAGS: Record<string, string> = {
  AR: '🇦🇷', AU: '🇦🇺', AT: '🇦🇹', BE: '🇧🇪', BR: '🇧🇷',
  KH: '🇰🇭', CA: '🇨🇦', CL: '🇨🇱', CN: '🇨🇳', CZ: '🇨🇿',
  DK: '🇩🇰', FI: '🇫🇮', FR: '🇫🇷', DE: '🇩🇪', GR: '🇬🇷',
  HK: '🇭🇰', ID: '🇮🇩', IN: '🇮🇳', IT: '🇮🇹', KE: '🇰🇪',
  MY: '🇲🇾', MX: '🇲🇽', MA: '🇲🇦', NL: '🇳🇱', NZ: '🇳🇿',
  NG: '🇳🇬', PE: '🇵🇪', PH: '🇵🇭', PL: '🇵🇱', SG: '🇸🇬',
  SK: '🇸🇰', ZA: '🇿🇦', ES: '🇪🇸', SE: '🇸🇪', CH: '🇨🇭',
  TH: '🇹🇭', GB: '🇬🇧', US: '🇺🇸',
};

const COUNTRY_NAMES: Record<string, string> = {
  AR: 'Argentina', AU: 'Australia', AT: 'Austria', BE: 'Belgium', BR: 'Brazil',
  KH: 'Cambodia', CA: 'Canada', CL: 'Chile', CN: 'China', CZ: 'Czech Republic',
  DK: 'Denmark', FI: 'Finland', FR: 'France', DE: 'Germany', GR: 'Greece',
  HK: 'Hong Kong', ID: 'Indonesia', IN: 'India', IT: 'Italy', KE: 'Kenya',
  MY: 'Malaysia', MX: 'Mexico', MA: 'Morocco', NL: 'Netherlands', NZ: 'New Zealand',
  NG: 'Nigeria', PE: 'Peru', PH: 'Philippines', PL: 'Poland', SG: 'Singapore',
  SK: 'Slovakia', ZA: 'South Africa', ES: 'Spain', SE: 'Sweden', CH: 'Switzerland',
  TH: 'Thailand', GB: 'United Kingdom', US: 'United States',
};

export default function ReviewPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [session, setSession] = useState<{ name: string; email: string } | null>(null);
  const [idType, setIdType] = useState('');
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showOutcome, setShowOutcome] = useState(false);
  const [showProcessing, setShowProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const { isSuccessDemo, selectedCountry, demoMode, currentDemoData, addCase } = useDemoMode();
  
  // Use selectedCountry from context - this persists across all steps
  const countryCode = selectedCountry;
  const flag = COUNTRY_FLAGS[countryCode] || '🏳️';
  const countryName = COUNTRY_NAMES[countryCode] || 'Unknown';
  const result = getVerificationResult(countryCode, demoMode);

  useEffect(() => {
    setMounted(true);
    const s = getAnySession();
    if (!s) { router.push('/'); return; }
    setSession(s);

    setIdType(sessionStorage.getItem('id-type') ?? currentDemoData.idType);
    setFrontPreview(sessionStorage.getItem('id-front-preview'));
    setBackPreview(sessionStorage.getItem('id-back-preview'));
    setSelfiePreview(sessionStorage.getItem('selfie-preview'));
  }, [router, currentDemoData.idType]);

  const handleLogout = () => { router.push(logoutAny()); };

  const handleSubmit = async () => {
    setSubmitting(true);
    setShowProcessing(true);
    setProcessingStep(0);
    
    // Animate through processing steps
    for (let i = 0; i < 4; i++) {
      await new Promise((r) => setTimeout(r, 750));
      setProcessingStep(i + 1);
    }
    
    setSubmitting(false);
    setShowProcessing(false);
    setShowOutcome(true);

    // Register a new case entry in the global store
    const isSuccess = demoMode === 'success';
    const caseId = 'CASE-2026-' + Math.floor(10000 + Math.random() * 90000);
    const newCase: CaseEntry = {
      id: caseId,
      date: new Date().toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: isSuccess ? 'approved' : 'rejected',
      resolution: isSuccess ? 'Approved' : 'Rejected',
      idType: idType || currentDemoData.idType,
      name: `${currentDemoData.firstName} ${currentDemoData.lastName}`,
      country: countryName,
      countryCode: countryCode,
      faceMatch: isSuccess ? '96.8%' : '23.45%',
      liveness: isSuccess ? '99.2%' : '34.12%',
      risk: isSuccess ? 'Low Risk' : 'High Risk',
      assignedTo: isSuccess ? 'Auto — System' : 'Manual Queue',
      priority: isSuccess ? 'Low' : 'High',
      demoMode,
      frontPreview: frontPreview ?? null,
      backPreview: backPreview ?? null,
      selfiePreview: selfiePreview ?? null,
    };
    addCase(newCase);

    // Surface this verification as a transaction entry in the admin transactions list.
    // KYC entries start as 'Pending' (under review) — they are never auto-completed here.
    // Only the payment transaction flips to 'Completed' after explicit admin approval.
    try {
      const txEntry = {
        id: 'TXN-KYC-' + Math.floor(10000 + Math.random() * 90000),
        date: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        customer: `${currentDemoData.firstName} ${currentDemoData.lastName}`,
        email: currentDemoData.email ?? 'user@demo.com',
        type: 'KYC Verification',
        method: 'Identity Check',
        amount: '0.00',
        currency: 'USD',
        status: isSuccess ? 'Pending' : 'Failed',
        reference: caseId,
        country: countryName,
      };
      const existing = JSON.parse(localStorage.getItem('bureau-transactions') || '[]');
      localStorage.setItem('bureau-transactions', JSON.stringify([txEntry, ...existing]));
    } catch { /* ignore */ }
  };

  if (!mounted) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!session) return null;

  const allPresent = frontPreview && backPreview && selfiePreview;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard/verification/selfie" className="flex items-center gap-2 hover:opacity-75 transition-opacity">
            <ChevronLeft size={20} className="text-foreground" />
            <svg height="22" viewBox="0 0 124 33" xmlns="http://www.w3.org/2000/svg" aria-label="PayPal"><path fill="#253B80" d="M46.211 6.749h-6.839a.95.95 0 0 0-.939.802l-2.766 17.537a.57.57 0 0 0 .564.658h3.265a.95.95 0 0 0 .939-.803l.746-4.73a.95.95 0 0 1 .938-.803h2.165c4.505 0 7.105-2.18 7.784-6.496.306-1.89.013-3.375-.872-4.415-.972-1.142-2.696-1.75-4.985-1.75zM47 13.154c-.374 2.454-2.249 2.454-4.062 2.454h-1.032l.724-4.583a.57.57 0 0 1 .563-.481h.473c1.235 0 2.4 0 3.002.704.359.42.468 1.044.332 1.906zM66.654 13.075h-3.275a.57.57 0 0 0-.563.481l-.145.916-.229-.332c-.709-1.029-2.29-1.373-3.868-1.373-3.619 0-6.71 2.741-7.312 6.586-.313 1.918.132 3.752 1.22 5.031.998 1.176 2.426 1.666 4.125 1.666 2.916 0 4.533-1.875 4.533-1.875l-.146.91a.57.57 0 0 0 .562.66h2.95a.95.95 0 0 0 .939-.803l1.77-11.209a.568.568 0 0 0-.561-.658zm-4.565 6.374c-.316 1.871-1.801 3.127-3.695 3.127-.951 0-1.711-.305-2.199-.883-.484-.574-.668-1.391-.514-2.301.295-1.855 1.805-3.152 3.67-3.152.93 0 1.686.309 2.184.892.499.589.697 1.411.554 2.317zM84.096 13.075h-3.291a.954.954 0 0 0-.787.417l-4.539 6.686-1.924-6.425a.953.953 0 0 0-.912-.678h-3.234a.57.57 0 0 0-.541.754l3.625 10.638-3.408 4.811a.57.57 0 0 0 .465.9h3.287a.949.949 0 0 0 .781-.408l10.946-15.8a.57.57 0 0 0-.468-.895z"/><path fill="#179BD7" d="M94.992 6.749h-6.84a.95.95 0 0 0-.938.802l-2.766 17.537a.569.569 0 0 0 .562.658h3.51a.665.665 0 0 0 .656-.562l.785-4.971a.95.95 0 0 1 .938-.803h2.164c4.506 0 7.105-2.18 7.785-6.496.307-1.89.012-3.375-.873-4.415-.971-1.142-2.694-1.75-4.983-1.75zm.789 6.405c-.373 2.454-2.248 2.454-4.062 2.454h-1.031l.725-4.583a.568.568 0 0 1 .562-.481h.473c1.234 0 2.4 0 3.002.704.358.42.467 1.044.331 1.906zM115.434 13.075h-3.273a.567.567 0 0 0-.562.481l-.145.916-.23-.332c-.709-1.029-2.289-1.373-3.867-1.373-3.619 0-6.709 2.741-7.311 6.586-.312 1.918.131 3.752 1.219 5.031 1 1.176 2.426 1.666 4.125 1.666 2.916 0 4.533-1.875 4.533-1.875l-.146.91a.57.57 0 0 0 .564.66h2.949a.95.95 0 0 0 .938-.803l1.771-11.209a.571.571 0 0 0-.565-.658zm-4.565 6.374c-.314 1.871-1.801 3.127-3.695 3.127-.949 0-1.711-.305-2.199-.883-.484-.574-.666-1.391-.514-2.301.297-1.855 1.805-3.152 3.67-3.152.93 0 1.686.309 2.184.892.501.589.699 1.411.554 2.317zM119.295 7.23l-2.807 17.858a.569.569 0 0 0 .562.658h2.822c.469 0 .867-.341.939-.803l2.768-17.536a.57.57 0 0 0-.562-.659h-3.16a.571.571 0 0 0-.562.482z"/><path fill="#253B80" d="M7.266 29.154l.523-3.322-1.165-.027H1.061L4.927 1.292a.316.316 0 0 1 .314-.268h9.38c3.114 0 5.263.648 6.385 1.927.526.6.861 1.227 1.023 1.917.17.724.173 1.589.007 2.644l-.012.077v.676l.526.298a3.69 3.69 0 0 1 1.065.812c.45.513.741 1.165.864 1.938.127.795.085 1.741-.123 2.812-.24 1.232-.628 2.305-1.152 3.183a6.547 6.547 0 0 1-1.825 2.063c-.696.49-1.523.861-2.458 1.099-.906.236-1.939.355-3.072.355h-.73c-.522 0-1.029.188-1.427.525a2.21 2.21 0 0 0-.744 1.328l-.055.299-.924 5.855-.042.215c-.011.068-.03.102-.058.125a.155.155 0 0 1-.096.035H7.266z"/><path fill="#179BD7" d="M23.048 7.667c-.028.179-.06.362-.096.55-1.237 6.351-5.469 8.545-10.874 8.545H9.326c-.661 0-1.218.48-1.321 1.132L6.596 26.83l-.399 2.533a.704.704 0 0 0 .695.814h4.881c.578 0 1.069-.42 1.16-.99l.048-.248.919-5.832.059-.32c.09-.572.582-.992 1.16-.992h.73c4.729 0 8.431-1.92 9.513-7.476.452-2.321.218-4.259-.978-5.622a4.667 4.667 0 0 0-1.336-1.03z"/><path fill="#222D65" d="M21.754 7.151a9.757 9.757 0 0 0-1.203-.267 15.284 15.284 0 0 0-2.426-.177h-7.352a1.172 1.172 0 0 0-1.159.992L8.05 17.605l-.045.289a1.336 1.336 0 0 1 1.321-1.132h2.752c5.405 0 9.637-2.195 10.874-8.545.037-.188.068-.371.096-.55a6.594 6.594 0 0 0-1.017-.448 9.045 9.045 0 0 0-.277-.068z"/><path fill="#253B80" d="M9.614 7.699a1.169 1.169 0 0 1 1.159-.991h7.352c.871 0 1.684.057 2.426.177a9.757 9.757 0 0 1 1.481.353c.365.121.704.264 1.017.448.368-2.347-.003-3.945-1.272-5.392C20.378.682 17.853 0 14.622 0h-9.38c-.66 0-1.223.48-1.325 1.133L.01 25.898a.806.806 0 0 0 .795.932h5.791l1.454-9.225 1.564-9.906z"/></svg>
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{session.name}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="bg-card border border-border rounded-2xl overflow-hidden">

          {/* Step header */}
          <div className="px-8 pt-8 pb-6 border-b border-border">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-3">
                <div className="w-8 h-0.5 bg-primary" />
                <span className="text-xs font-bold tracking-widest text-primary uppercase">Identity Verification</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <DemoModeBadge />
                <span>{flag}</span>
                <span>{countryName}</span>
                <span className="font-medium text-foreground">Step 3 of 3</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2 ml-11">Review your information and submit for verification</p>
          </div>

          {/* Body */}
          <div className="px-8 py-10 space-y-8">
            {/* Title */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-1">Review and Submit</h2>
              <p className="text-sm text-muted-foreground">Please review your information before submitting</p>
            </div>

            {/* Metadata row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-foreground mb-2">ID Type</p>
                <div className="border border-border rounded-xl px-4 py-3 bg-secondary/20">
                  <p className="text-sm text-foreground">{idType || '—'}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Verification Status</p>
                <div className={`border rounded-xl px-4 py-3 ${
                  allPresent 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-border bg-secondary/20'
                }`}>
                  <p className={`text-sm font-medium ${
                    allPresent 
                      ? 'text-green-700' 
                      : 'text-foreground'
                  }`}>
                    {allPresent ? 'Ready for submission' : 'Missing documents'}
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Data Section */}
            <div className="border border-border rounded-xl overflow-hidden">
              <div className="bg-secondary/30 px-4 py-2 border-b border-border">
                <p className="text-sm font-semibold text-foreground">Applicant Information</p>
              </div>
              <div className="p-4 grid grid-cols-2 gap-4">
                {[
                  { label: 'Full Name', value: `${currentDemoData.firstName} ${currentDemoData.middleName ? currentDemoData.middleName + ' ' : ''}${currentDemoData.lastName}` },
                  { label: 'Email', value: currentDemoData.email },
                  { label: 'Phone', value: currentDemoData.phone },
                  { label: 'Date of Birth', value: currentDemoData.dob },
                  { label: 'ID Number', value: currentDemoData.idNumber },
                  { label: 'Address', value: `${currentDemoData.address}, ${currentDemoData.city}` },
                ].map((field, idx) => (
                  <div key={idx} className="px-3 py-2 rounded-lg bg-secondary/20">
                    <p className="text-xs text-muted-foreground mb-0.5">{field.label}</p>
                    <p className="text-sm font-medium text-foreground">{field.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Document previews */}
            <div className="grid grid-cols-3 gap-4">
              {/* Front */}
              <div>
                <p className="text-sm font-medium text-foreground mb-2">ID Front</p>
                <div className="border rounded-xl overflow-hidden h-44 border-border">
                  {frontPreview && frontPreview !== 'placeholder' ? (
                    <img src={frontPreview} alt="ID Front" className="w-full h-full object-contain p-2" />
                  ) : (
                    <IDCardDocument countryCode={countryCode} scenario={demoMode} side="FRONT" facePhotoUrl={getDemoFacePhotos(countryCode, demoMode).documentFace} docTypeId={getCountryDocumentConfig(countryCode).documentTypes.find(d => d.label === idType || d.id === idType)?.id ?? getCountryDocumentConfig(countryCode).documentTypes[0]?.id} className="w-full h-full" />
                  )}
                </div>
              </div>
              {/* Back */}
              <div>
                <p className="text-sm font-medium text-foreground mb-2">ID Back</p>
                <div className="border rounded-xl overflow-hidden h-44 border-border">
                  {backPreview && backPreview !== 'placeholder' ? (
                    <img src={backPreview} alt="ID Back" className="w-full h-full object-contain p-2" />
                  ) : (
                    <IDCardDocument countryCode={countryCode} scenario={demoMode} side="BACK" facePhotoUrl={getDemoFacePhotos(countryCode, demoMode).documentFace} docTypeId={getCountryDocumentConfig(countryCode).documentTypes.find(d => d.label === idType || d.id === idType)?.id ?? getCountryDocumentConfig(countryCode).documentTypes[0]?.id} className="w-full h-full" />
                  )}
                </div>
              </div>
              {/* Selfie */}
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Selfie</p>
                <div className="border rounded-xl overflow-hidden h-44 border-border bg-secondary/10 flex items-center justify-center">
                  {(() => {
                    const faces = getDemoFacePhotos(countryCode, demoMode);
                    const src = selfiePreview && selfiePreview !== 'placeholder' ? selfiePreview : faces.selfieFace;
                    return <img src={src} alt="Selfie" className="w-full h-full object-cover object-top" />;
                  })()}
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl px-6 py-5">
              <p className="text-sm text-primary leading-relaxed">
                By submitting, you confirm that all information provided is accurate and belongs to you. Your identity will be verified against government databases using Bureau's advanced verification technology.
              </p>
            </div>
          </div>

          {/* Footer nav */}
          <div className="px-8 pb-8 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard/verification/selfie')}
              className="flex items-center gap-2 border-border"
            >
              <ChevronLeft size={16} /> Back
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!allPresent || submitting}
              className="flex items-center gap-2 bg-foreground text-background hover:bg-foreground/90 px-8 disabled:opacity-40 min-w-28 justify-center"
            >
              {submitting
                ? <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                : 'Submit'
              }
            </Button>
          </div>

        </div>
      </main>

      {/* Processing Animation Modal */}
      {showProcessing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-1">Verifying Identity...</h2>
              <p className="text-sm text-muted-foreground">Please wait while we process your information</p>
            </div>
            
            <div className="space-y-3">
              {[
                { label: 'Getting things ready', step: 0 },
                { label: 'This will only take a moment', step: 1 },
                { label: 'Processing your information', step: 2 },
                { label: 'Finishing up', step: 3 },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                  <div className="w-5 h-5 flex items-center justify-center">
                    {processingStep > item.step ? (
                      <CheckCircle2 size={18} className="text-green-600" />
                    ) : processingStep === item.step ? (
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30" />
                    )}
                  </div>
                  <span className={`text-sm font-medium ${
                    processingStep > item.step 
                      ? 'text-green-700' 
                      : processingStep === item.step 
                        ? 'text-foreground' 
                        : 'text-muted-foreground'
                  }`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Verification Outcome Modal */}
      {showOutcome && (() => {
        const isOperator = !!getSession();
        const isSuccess = result.status === 'success';
        const riskPct = isSuccess ? 15 : 82;
        const checks = [
          { label: 'Document Authenticity', detail: 'Document verified as genuine', pass: true },
          { label: 'Face Match', detail: isSuccess ? `Face match confidence: ${isSuccess ? '97.2%' : '23.4%'}` : 'Face match failed: 23.4%', pass: isSuccess },
          { label: 'Liveness Check', detail: isSuccess ? 'Liveness confirmed with high confidence' : 'Liveness detection failed', pass: isSuccess },
          { label: 'Data Consistency', detail: isSuccess ? 'All data points match and are consistent' : 'Data inconsistencies detected', pass: isSuccess },
        ];

        return (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">

              {/* Header — operator uses the standard green/red header; end-user gets their own full layout below */}
              {isOperator && (
                <div className={`p-8 text-center ${isSuccess ? 'bg-green-50' : 'bg-red-50'}`}>
                  <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${
                    isSuccess ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {isSuccess
                      ? <CheckCircle2 size={40} className="text-green-600" />
                      : <XCircle size={40} className="text-red-600" />}
                  </div>
                  <h2 className={`text-2xl font-bold ${isSuccess ? 'text-green-800' : 'text-red-800'}`}>
                    {result.title}
                  </h2>
                </div>
              )}

              {isOperator ? (
                <>
                  {/* Risk Score — operator only */}
                  <div className="px-8 pt-6 pb-2 border-b border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">Risk Score</span>
                      <span className={`text-sm font-bold uppercase tracking-wide ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
                        {isSuccess ? 'Low Risk' : 'High Risk'}
                      </span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${isSuccess ? 'bg-green-500' : 'bg-red-500'}`}
                        style={{ width: `${riskPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Verification Checks — operator only */}
                  <div className="px-8 py-6">
                    <p className="text-xs font-bold uppercase tracking-widest text-foreground mb-4">Verification Checks</p>
                    <div className="space-y-1">
                      {checks.map((check) => (
                        <div key={check.label} className="flex items-start gap-3 py-3 border-b border-border last:border-0">
                          {check.pass
                            ? <CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                            : <XCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />}
                          <div>
                            <p className="text-sm font-semibold text-foreground">{check.label}</p>
                            <p className={`text-sm ${check.pass ? 'text-green-600' : 'text-red-500'}`}>{check.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommended Action — operator only */}
                  <div className="px-8 pb-6">
                    <div className={`rounded-xl border px-5 py-4 ${isSuccess ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                      <p className="text-xs text-muted-foreground mb-1">Recommended Action</p>
                      <p className={`text-base font-bold ${isSuccess ? 'text-green-700' : 'text-red-700'}`}>
                        {isSuccess ? 'Approve' : 'Reject'}
                      </p>
                    </div>
                  </div>
                </>
              ) : isSuccess ? (
                /* Onboarding Complete screen — end-user, approved */
                <div className="flex flex-col items-center text-center px-8 pt-10 pb-8">
                  <div className="relative mb-6">
                    <div className="w-28 h-28 rounded-full bg-green-100 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-green-200 flex items-center justify-center">
                        <CheckCircle2 size={48} className="text-green-600" strokeWidth={1.75} />
                      </div>
                    </div>
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-green-400 opacity-40 animate-ping" />
                    <span className="absolute bottom-2 left-0 w-3 h-3 rounded-full bg-green-300 opacity-50 animate-ping [animation-delay:0.4s]" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 text-balance">Onboarding Complete</h2>
                  <p className="text-base text-gray-500 mb-1 text-balance">Your account is ready.</p>
                  <p className="text-base font-medium text-gray-700 mb-8 text-balance">Start your first transaction now.</p>
                  <Button
                    className="w-full bg-[#0f1b3d] hover:bg-[#1a2d5a] text-white text-base font-semibold py-6 rounded-xl mb-4"
                    onClick={() => router.push(`/dashboard/payment/credentials?name=${encodeURIComponent(session?.name ?? '')}`)}
                  >
                    Continue to Login
                  </Button>
                  <p className="text-xs text-gray-400">You can now access all features.</p>
                </div>
              ) : (
                /* Verification Failed screen — end-user, rejected */
                <div className="flex flex-col items-center text-center px-8 pt-10 pb-8">
                  <div className="relative mb-6">
                    <div className="w-28 h-28 rounded-full bg-red-100 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-red-200 flex items-center justify-center">
                        <XCircle size={48} className="text-red-600" strokeWidth={1.75} />
                      </div>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 text-balance">Verification Failed</h2>
                  <p className="text-base text-gray-500 mb-1 text-balance">We could not verify your identity.</p>
                  <p className="text-base font-medium text-gray-700 mb-8 text-balance">Please review the issues and try again.</p>
                  <Button
                    className="w-full bg-[#0f1b3d] hover:bg-[#1a2d5a] text-white text-base font-semibold py-6 rounded-xl mb-3"
                    onClick={() => router.push('/dashboard/verification/workflow')}
                  >
                    Try Again
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full text-base font-semibold py-6 rounded-xl"
                    onClick={() => router.push('/dashboard')}
                  >
                    Back to Dashboard
                  </Button>
                </div>
              )}

              {/* Footer Actions — operator only */}
              {isOperator && (
                <div className="px-8 pb-8 flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => { setShowOutcome(false); router.push('/dashboard'); }}
                  >
                    Back to Dashboard
                  </Button>
                </div>
              )}

            </div>
          </div>
        );
      })()}
    </div>
  );
}
