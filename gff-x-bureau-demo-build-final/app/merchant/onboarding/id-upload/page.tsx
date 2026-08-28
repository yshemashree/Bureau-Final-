'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getMerchantSession, logoutMerchant } from '@/lib/auth';
import { getCountryDocumentConfig } from '@/lib/country-documents';
import { useDemoMode } from '@/lib/demo-context';
import { getCountryFlag } from '@/lib/country-flags';
import { DemoModeBadge } from '@/components/demo-mode-badge';
import { DemoModeToggle } from '@/components/demo-mode-toggle';
import { IDCardDocument } from '@/components/id-card-document';
import { getDemoFacePhotos } from '@/lib/demo-face-photos';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { LogOut, ChevronLeft, Upload, X, CheckCircle2, Building2, ScanFace, RotateCcw } from 'lucide-react';
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
  SA: '🇸🇦', AE: '🇦🇪', TR: '🇹🇷', VN: '🇻🇳', IE: '🇮🇪', KW: '🇰🇼',
  CO: '🇨🇴', CY: '🇨🇾', HR: '🇭🇷',
};

interface UploadedFile {
  name: string;
  preview: string;
  size: number;
}

interface UploadZoneProps {
  label: string;
  file: UploadedFile | null;
  onFile: (file: UploadedFile) => void;
  onClear: () => void;
  sampleUrl?: string;
  isFailureMode?: boolean;
  countryCode?: string;
  countryFlag?: string;
  countryName?: string;
  idTypeName?: string;
  side?: 'FRONT' | 'BACK';
  docTypeId?: string;
}

function UploadZone({ label, file, onFile, onClear, sampleUrl, isFailureMode = false, countryCode = 'US', countryFlag = '', countryName = 'United States', idTypeName = 'ID Document', side = 'FRONT', docTypeId = '' }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [loadingSample, setLoadingSample] = useState(false);
  const [usePlaceholder, setUsePlaceholder] = useState(false);
  const facePhotoUrl = getDemoFacePhotos(countryCode, isFailureMode ? 'failure' : 'success').documentFace;

  const handleFile = useCallback((raw: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      onFile({ name: raw.name, preview: e.target?.result as string, size: raw.size });
    };
    reader.readAsDataURL(raw);
  }, [onFile]);

  const handleClick = useCallback(async () => {
    if (sampleUrl) {
      setLoadingSample(true);
      try {
        const res = await fetch(sampleUrl);
        if (!res.ok) throw new Error('Failed to load sample');
        const blob = await res.blob();
        const filename = sampleUrl.split('/').pop() ?? 'sample.jpg';
        handleFile(new File([blob], filename, { type: blob.type || 'image/jpeg' }));
      } catch {
        setUsePlaceholder(true);
        onFile({ name: `${countryCode}_${side.toLowerCase()}_placeholder.png`, preview: 'placeholder', size: 0 });
      } finally {
        setLoadingSample(false);
      }
    } else {
      setUsePlaceholder(true);
      onFile({ name: `${countryCode}_${side.toLowerCase()}_placeholder.png`, preview: 'placeholder', size: 0 });
    }
  }, [sampleUrl, handleFile, countryCode, side, onFile]);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) { setUsePlaceholder(false); handleFile(dropped); }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0];
    if (picked) { setUsePlaceholder(false); handleFile(picked); }
  };

  const isPlaceholderPreview = file && (file.preview === 'placeholder' || usePlaceholder);

  return (
    <div className="flex-1">
      <p className="text-sm font-medium text-foreground mb-2">{label}</p>
      {file ? (
        <div className="relative border rounded-xl overflow-hidden h-44 flex items-center justify-center border-border bg-secondary/20">
          {isPlaceholderPreview ? (
            <IDCardDocument countryCode={countryCode} scenario={isFailureMode ? 'failure' : 'success'} side={side} facePhotoUrl={facePhotoUrl} docTypeId={docTypeId} className="w-full h-full" />
          ) : (
            <img src={file.preview} alt={label} className="max-h-full max-w-full object-contain" />
          )}
          <button
            onClick={() => { onClear(); setUsePlaceholder(false); }}
            className="absolute top-2 right-2 w-7 h-7 bg-foreground/80 text-background rounded-full flex items-center justify-center hover:bg-foreground transition-colors z-10"
          >
            <X size={14} />
          </button>
          <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded px-2 py-1 bg-background/90">
            <CheckCircle2 size={12} className="text-green-600" />
            <span className="text-xs truncate max-w-32 text-foreground">
              {isPlaceholderPreview ? `${countryName} ${idTypeName}` : file.name}
            </span>
          </div>
        </div>
      ) : (
        <div
          onClick={handleClick}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`border-2 border-dashed rounded-xl h-44 flex flex-col items-center justify-center cursor-pointer transition-colors ${
            dragging ? 'border-amber-500 bg-amber-500/5' : 'border-amber-400/40 bg-amber-500/[0.02] hover:border-amber-500 hover:bg-amber-500/5'
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-3">
            {loadingSample
              ? <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
              : <Upload size={20} className="text-amber-600" />
            }
          </div>
          <p className="text-sm font-medium text-foreground mb-1">
            {loadingSample ? 'Loading sample...' : 'Click to upload or drag and drop'}
          </p>
          {!loadingSample && (
            <p className="text-xs text-muted-foreground">
              {sampleUrl ? 'Sample document will auto-load' : 'Click to load sample ID'}
            </p>
          )}
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/jpg" className="hidden" onChange={onInputChange} />
    </div>
  );
}

interface SelfieFile { name: string; preview: string; }

type MerCamState = 'idle' | 'requesting' | 'tooFar' | 'holdStill' | 'capturing' | 'done';

function SelfieZone({ selfie, onSelfie, onClear, isFailureMode, countryCode }: {
  selfie: SelfieFile | null;
  onSelfie: (f: SelfieFile) => void;
  onClear: () => void;
  isFailureMode: boolean;
  countryCode: string;
}) {
  const [camState, setCamState] = useState<MerCamState>('idle');
  const [countdown, setCountdown] = useState(3);
  const [samplePhotoUrl, setSamplePhotoUrl] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadSamplePhoto = useCallback(async (): Promise<string | null> => {
    const faces = getDemoFacePhotos(countryCode, isFailureMode ? 'failure' : 'success');
    try {
      const res = await fetch(faces.selfieFace);
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      return await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(blob);
      });
    } catch {
      return faces.selfieFace;
    }
  }, [countryCode, isFailureMode]);

  const startCamera = useCallback(async () => {
    setCamState('requesting');
    const photo = await loadSamplePhoto();
    setSamplePhotoUrl(photo);
    timerRef.current = setTimeout(() => {
      setCamState('tooFar');
      timerRef.current = setTimeout(() => {
        setCamState('holdStill');
        setCountdown(3);
        let c = 3;
        countdownRef.current = setInterval(() => {
          c -= 1;
          setCountdown(c);
          if (c <= 0) {
            clearInterval(countdownRef.current!);
            setCamState('capturing');
            timerRef.current = setTimeout(() => {
              setCamState('done');
              if (photo) onSelfie({ name: 'selfie.jpg', preview: photo });
            }, 600);
          }
        }, 1000);
      }, 2200);
    }, 1500);
  }, [loadSamplePhoto, onSelfie]);

  const reset = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    setCamState('idle');
    setCountdown(3);
    onClear();
  }, [onClear]);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
  }, []);

  const isDone = camState === 'done';
  const isActive = !['idle', 'done', 'denied'].includes(camState);
  const isHolding = camState === 'holdStill' || camState === 'capturing';
  const isTooFar = camState === 'tooFar';

  const overlayMsg = isTooFar
    ? 'Too far from camera. Please move closer'
    : camState === 'holdStill'
    ? `Perfect — hold still, capturing in ${countdown}...`
    : camState === 'capturing'
    ? 'Capturing...'
    : null;

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-foreground">Selfie — Liveness Check</p>

      {/* Idle: start button */}
      {camState === 'idle' && (
        <div
          onClick={startCamera}
          className="border-2 border-dashed rounded-xl h-44 flex flex-col items-center justify-center cursor-pointer transition-colors border-amber-400/40 bg-amber-500/[0.02] hover:border-amber-500 hover:bg-amber-500/5"
        >
          <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-3">
            <ScanFace size={22} className="text-amber-600" />
          </div>
          <p className="text-sm font-medium text-foreground">Click to start liveness check</p>
          <p className="text-xs text-muted-foreground mt-1">Camera will open automatically</p>
        </div>
      )}

      {/* Simulated camera — black screen with sample photo fading in */}
      {isActive && (
        <div className="relative rounded-xl overflow-hidden bg-black" style={{ height: 260 }}>

          {/* Sample photo fades in */}
          {samplePhotoUrl && camState !== 'requesting' && (
            <img
              src={samplePhotoUrl}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-contain"
              style={{
                opacity: isHolding || camState === 'tooFar' ? 1 : 0,
                transition: 'opacity 0.8s ease',
              }}
            />
          )}

          {/* Oval overlay */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            <defs>
              <mask id="mer-oval-mask">
                <rect width="100" height="100" fill="white" />
                <ellipse cx="50" cy="44" rx="22" ry="28" fill="black" />
              </mask>
            </defs>
            <rect width="100" height="100" fill="rgba(0,0,0,0.38)" mask="url(#mer-oval-mask)" />
            <ellipse cx="50" cy="44" rx="22" ry="28" fill="none" strokeWidth="0.6"
              stroke={isHolding ? '#22c55e' : 'rgba(255,255,255,0.85)'}
              style={{ transition: 'stroke 0.4s ease' }}
            />
            {isHolding && (
              <line x1="28" x2="72" y1="44" y2="44" stroke="#22c55e" strokeWidth="0.4" opacity="0.7">
                <animateTransform attributeName="transform" type="translate" values="0 -14;0 14;0 -14" dur="1.2s" repeatCount="indefinite" />
              </line>
            )}
          </svg>

          {/* Overlay caption */}
          {overlayMsg && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none">
              <div className="bg-black/70 rounded-xl px-4 py-2 text-center">
                <p className="text-white text-xs font-medium leading-snug">{overlayMsg}</p>
              </div>
            </div>
          )}
          {camState === 'requesting' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      )}

      {/* Done — photo inside oval, same black box */}
      {isDone && selfie && (
        <div className="relative rounded-xl overflow-hidden bg-black" style={{ height: 260 }}>
          {/* Full photo behind oval cutout */}
          <img
            src={selfie.preview}
            alt="Captured selfie"
            className="absolute inset-0 w-full h-full object-contain"
          />

          {/* Retry */}
          <button onClick={reset} className="absolute top-2 right-2 w-7 h-7 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black/80 transition-colors z-10">
            <RotateCcw size={13} />
          </button>
          {/* Badge */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full px-3 py-1 bg-black/70 z-10">
            <CheckCircle2 size={12} className="text-green-400" />
            <span className="text-xs text-white font-medium">Selfie captured</span>
          </div>
        </div>
      )}


    </div>
  );
}

export default function MerchantIdUploadPage() {
  const router = useRouter();
  const [session, setSession] = useState<ReturnType<typeof getMerchantSession>>(null);
  const [mounted, setMounted] = useState(false);
  const [frontFile, setFrontFile] = useState<UploadedFile | null>(null);
  const [backFile, setBackFile] = useState<UploadedFile | null>(null);
  const [selfie, setSelfie] = useState<SelfieFile | null>(null);
  const [registrationNumber, setRegistrationNumber] = useState('806592');
  const [companyName, setCompanyName] = useState('Belong Aesthetics PTE. LTD.');
  const { isSuccessDemo, selectedCountry: countryCode, currentDemoData } = useDemoMode();

  // Singapore-specific state
  const [kybConfig, setKybConfig] = useState<string>('');
  const isSingapore = kybConfig === 'director-kyb-sg';
  const [uenNumber, setUenNumber] = useState('202012345K');
  const [shopImage, setShopImage] = useState<UploadedFile | null>(null);
  const [bankStatement, setBankStatement] = useState<UploadedFile | null>(null);
  const [shopAutoLoading, setShopAutoLoading] = useState(false);
  const [bankAutoLoading, setBankAutoLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    const s = getMerchantSession();
    if (!s) { router.push('/merchant/login'); return; }
    setSession(s);
    const config = sessionStorage.getItem('merchant-kyb-config') ?? '';
    setKybConfig(config);
    if (config === 'director-kyb-sg') {
      // Auto-load shop image
      setShopAutoLoading(true);
      fetch('/samples/sg-shop-image.jpg')
        .then(r => r.blob())
        .then(blob => {
          const reader = new FileReader();
          reader.onload = (e) => {
            setShopImage({ name: 'sg-shop-image.jpg', preview: e.target?.result as string, size: blob.size });
            setShopAutoLoading(false);
          };
          reader.readAsDataURL(blob);
        })
        .catch(() => setShopAutoLoading(false));
    }
  }, [router]);

  const config = getCountryDocumentConfig(countryCode);
  const flag = getCountryFlag(countryCode);

  // Use the ID type from the demo data (locked per country/scenario)
  const selectedDocType = currentDemoData.idType;

  const handleLogout = () => {
    logoutMerchant();
    router.push('/merchant/login');
  };

  const canProceed = selectedDocType && frontFile && backFile && selfie && companyName.trim() &&
    (isSingapore
      ? uenNumber.trim() && bankStatement
      : registrationNumber.trim());

  const handleNext = () => {
    if (canProceed && frontFile && backFile && selfie) {
      sessionStorage.setItem('merchant-id-front-preview', frontFile.preview);
      sessionStorage.setItem('merchant-id-back-preview', backFile.preview);
      sessionStorage.setItem('merchant-selfie-preview', selfie.preview);
      sessionStorage.setItem('merchant-id-type', selectedDocType);
      sessionStorage.setItem('merchant-company-name', companyName.trim());
      if (isSingapore) {
        sessionStorage.setItem('merchant-uen-number', uenNumber.trim());
        if (bankStatement) sessionStorage.setItem('merchant-bank-statement-preview', bankStatement.preview);
        if (shopImage) sessionStorage.setItem('merchant-shop-image-preview', shopImage.preview);
      } else {
        sessionStorage.setItem('merchant-reg-number', registrationNumber.trim());
      }
      router.push('/merchant/onboarding/case');
    }
  };

  if (!mounted) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!session) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/merchant/onboarding" className="flex items-center gap-2 hover:opacity-75 transition-opacity">
            <ChevronLeft size={20} className="text-foreground" />
            <svg height="22" viewBox="0 0 124 33" xmlns="http://www.w3.org/2000/svg" aria-label="PayPal"><path fill="#253B80" d="M46.211 6.749h-6.839a.95.95 0 0 0-.939.802l-2.766 17.537a.57.57 0 0 0 .564.658h3.265a.95.95 0 0 0 .939-.803l.746-4.73a.95.95 0 0 1 .938-.803h2.165c4.505 0 7.105-2.18 7.784-6.496.306-1.89.013-3.375-.872-4.415-.972-1.142-2.696-1.75-4.985-1.75zM47 13.154c-.374 2.454-2.249 2.454-4.062 2.454h-1.032l.724-4.583a.57.57 0 0 1 .563-.481h.473c1.235 0 2.4 0 3.002.704.359.42.468 1.044.332 1.906zM66.654 13.075h-3.275a.57.57 0 0 0-.563.481l-.145.916-.229-.332c-.709-1.029-2.29-1.373-3.868-1.373-3.619 0-6.71 2.741-7.312 6.586-.313 1.918.132 3.752 1.22 5.031.998 1.176 2.426 1.666 4.125 1.666 2.916 0 4.533-1.875 4.533-1.875l-.146.91a.57.57 0 0 0 .562.66h2.95a.95.95 0 0 0 .939-.803l1.77-11.209a.568.568 0 0 0-.561-.658zm-4.565 6.374c-.316 1.871-1.801 3.127-3.695 3.127-.951 0-1.711-.305-2.199-.883-.484-.574-.668-1.391-.514-2.301.295-1.855 1.805-3.152 3.67-3.152.93 0 1.686.309 2.184.892.499.589.697 1.411.554 2.317zM84.096 13.075h-3.291a.954.954 0 0 0-.787.417l-4.539 6.686-1.924-6.425a.953.953 0 0 0-.912-.678h-3.234a.57.57 0 0 0-.541.754l3.625 10.638-3.408 4.811a.57.57 0 0 0 .465.9h3.287a.949.949 0 0 0 .781-.408l10.946-15.8a.57.57 0 0 0-.468-.895z"/><path fill="#179BD7" d="M94.992 6.749h-6.84a.95.95 0 0 0-.938.802l-2.766 17.537a.569.569 0 0 0 .562.658h3.51a.665.665 0 0 0 .656-.562l.785-4.971a.95.95 0 0 1 .938-.803h2.164c4.506 0 7.105-2.18 7.785-6.496.307-1.89.012-3.375-.873-4.415-.971-1.142-2.694-1.75-4.983-1.75zm.789 6.405c-.373 2.454-2.248 2.454-4.062 2.454h-1.031l.725-4.583a.568.568 0 0 1 .562-.481h.473c1.234 0 2.4 0 3.002.704.358.42.467 1.044.331 1.906zM115.434 13.075h-3.273a.567.567 0 0 0-.562.481l-.145.916-.23-.332c-.709-1.029-2.289-1.373-3.867-1.373-3.619 0-6.709 2.741-7.311 6.586-.312 1.918.131 3.752 1.219 5.031 1 1.176 2.426 1.666 4.125 1.666 2.916 0 4.533-1.875 4.533-1.875l-.146.91a.57.57 0 0 0 .564.66h2.949a.95.95 0 0 0 .938-.803l1.771-11.209a.571.571 0 0 0-.565-.658zm-4.565 6.374c-.314 1.871-1.801 3.127-3.695 3.127-.949 0-1.711-.305-2.199-.883-.484-.574-.666-1.391-.514-2.301.297-1.855 1.805-3.152 3.67-3.152.93 0 1.686.309 2.184.892.501.589.699 1.411.554 2.317zM119.295 7.23l-2.807 17.858a.569.569 0 0 0 .562.658h2.822c.469 0 .867-.341.939-.803l2.768-17.536a.57.57 0 0 0-.562-.659h-3.16a.571.571 0 0 0-.562.482z"/><path fill="#253B80" d="M7.266 29.154l.523-3.322-1.165-.027H1.061L4.927 1.292a.316.316 0 0 1 .314-.268h9.38c3.114 0 5.263.648 6.385 1.927.526.6.861 1.227 1.023 1.917.17.724.173 1.589.007 2.644l-.012.077v.676l.526.298a3.69 3.69 0 0 1 1.065.812c.45.513.741 1.165.864 1.938.127.795.085 1.741-.123 2.812-.24 1.232-.628 2.305-1.152 3.183a6.547 6.547 0 0 1-1.825 2.063c-.696.49-1.523.861-2.458 1.099-.906.236-1.939.355-3.072.355h-.73c-.522 0-1.029.188-1.427.525a2.21 2.21 0 0 0-.744 1.328l-.055.299-.924 5.855-.042.215c-.011.068-.03.102-.058.125a.155.155 0 0 1-.096.035H7.266z"/><path fill="#179BD7" d="M23.048 7.667c-.028.179-.06.362-.096.55-1.237 6.351-5.469 8.545-10.874 8.545H9.326c-.661 0-1.218.48-1.321 1.132L6.596 26.83l-.399 2.533a.704.704 0 0 0 .695.814h4.881c.578 0 1.069-.42 1.16-.99l.048-.248.919-5.832.059-.32c.09-.572.582-.992 1.16-.992h.73c4.729 0 8.431-1.92 9.513-7.476.452-2.321.218-4.259-.978-5.622a4.667 4.667 0 0 0-1.336-1.03z"/><path fill="#222D65" d="M21.754 7.151a9.757 9.757 0 0 0-1.203-.267 15.284 15.284 0 0 0-2.426-.177h-7.352a1.172 1.172 0 0 0-1.159.992L8.05 17.605l-.045.289a1.336 1.336 0 0 1 1.321-1.132h2.752c5.405 0 9.637-2.195 10.874-8.545.037-.188.068-.371.096-.55a6.594 6.594 0 0 0-1.017-.448 9.045 9.045 0 0 0-.277-.068z"/><path fill="#253B80" d="M9.614 7.699a1.169 1.169 0 0 1 1.159-.991h7.352c.871 0 1.684.057 2.426.177a9.757 9.757 0 0 1 1.481.353c.365.121.704.264 1.017.448.368-2.347-.003-3.945-1.272-5.392C20.378.682 17.853 0 14.622 0h-9.38c-.66 0-1.223.48-1.325 1.133L.01 25.898a.806.806 0 0 0 .795.932h5.791l1.454-9.225 1.564-9.906z"/></svg>
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{session.user.name}</p>
              <p className="text-xs text-muted-foreground">{session.user.email}</p>
            </div>
            <Button onClick={handleLogout} variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <LogOut size={18} />
            </Button>
          </div>
        </div>
      </header>

      <main className="py-12">
        <div className="max-w-2xl mx-auto px-6">

          {/* Step header */}
          <div className="mb-8">
            {/* Step progress */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full bg-green-500 text-white text-xs font-bold flex items-center justify-center">
                  <CheckCircle2 size={13} />
                </div>
                <span className="text-xs text-muted-foreground">Personal Details</span>
              </div>
              <div className="h-px flex-1 bg-amber-300" />
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center">2</div>
                <span className="text-xs font-semibold text-amber-600">ID & Business</span>
              </div>
              <div className="h-px flex-1 bg-border" />
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full bg-border text-muted-foreground text-xs font-bold flex items-center justify-center">3</div>
                <span className="text-xs text-muted-foreground">Review</span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-1">
              <span className="text-amber-600 font-semibold text-sm tracking-wide">MERCHANT ONBOARDING</span>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <DemoModeBadge />
                <span className="text-base">{COUNTRY_FLAGS[countryCode] ?? ''}</span>
                <span className="font-medium text-foreground">{config.countryName}</span>
                <span className="text-muted-foreground">· Step 2 of 3</span>
              </div>
            </div>
          </div>

          {/* Section 1: ID Upload */}
          <div className="bg-white border border-border rounded-2xl p-8 space-y-6 mb-6">
            <div>
              <h2 className="text-lg font-bold text-foreground mb-1">Identity Documents</h2>
              <p className="text-sm text-muted-foreground">Upload your government-issued ID and take a selfie for biometric verification.</p>
            </div>

            {/* ID Type display - locked to the country's document type */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Document Type</label>
              <div className="flex items-center gap-3 px-4 py-3 bg-secondary/30 border border-border rounded-lg">
                <div className="w-8 h-8 rounded-md bg-amber-500/10 flex items-center justify-center">
                  <Upload size={16} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{isSingapore ? 'NRIC (Singapore Identity Card)' : currentDemoData.idType}</p>
                  <p className="text-xs text-muted-foreground">{isSingapore ? 'Singapore' : config.countryName}</p>
                </div>
              </div>
            </div>

            {/* ID Upload zones */}
            <div className="flex gap-4">
              <UploadZone
                label="Front Side of ID"
                file={frontFile}
                onFile={setFrontFile}
                onClear={() => setFrontFile(null)}
                sampleUrl={isSingapore ? '/samples/sg-nric.png' : config.sampleFront}
                isFailureMode={!isSuccessDemo}
                countryCode={isSingapore ? 'SG' : countryCode}
                countryFlag={isSingapore ? '🇸🇬' : flag}
                countryName={isSingapore ? 'Singapore' : config.countryName}
                idTypeName={isSingapore ? 'NRIC' : currentDemoData.idType}
                docTypeId={isSingapore ? 'NRIC' : selectedDocType}
                side="FRONT"
              />
              <UploadZone
                label="Back Side of ID"
                file={backFile}
                onFile={setBackFile}
                onClear={() => setBackFile(null)}
                sampleUrl={isSingapore ? '/samples/sg-nric.png' : config.sampleBack}
                isFailureMode={!isSuccessDemo}
                countryCode={isSingapore ? 'SG' : countryCode}
                countryFlag={isSingapore ? '🇸🇬' : flag}
                countryName={isSingapore ? 'Singapore' : config.countryName}
                idTypeName={isSingapore ? 'NRIC' : currentDemoData.idType}
                docTypeId={isSingapore ? 'NRIC' : selectedDocType}
                side="BACK"
              />
            </div>

            {/* Selfie */}
            <SelfieZone
              selfie={selfie}
              onSelfie={setSelfie}
              onClear={() => setSelfie(null)}
              isFailureMode={!isSuccessDemo}
              countryCode={countryCode}
            />
          </div>

          {/* Section 2: Business Details */}
          <div className="bg-white border border-border rounded-2xl p-8 space-y-6 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Building2 size={16} className="text-amber-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Business Details</h2>
                <p className="text-sm text-muted-foreground">
                  {isSingapore
                    ? 'Provide your Singapore business information for ACRA KYB verification.'
                    : 'Provide your business registration information for KYB verification.'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Company Name</label>
                <Input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder={isSingapore ? 'Belong Aesthetics Pte. Ltd.' : 'Company name'}
                  className="bg-white border-border text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {isSingapore ? 'UEN Number' : 'Registration Number'}
                </label>
                <Input
                  type="text"
                  value={isSingapore ? uenNumber : registrationNumber}
                  onChange={(e) => isSingapore ? setUenNumber(e.target.value) : setRegistrationNumber(e.target.value)}
                  placeholder={isSingapore ? '202012345K' : 'Registration number'}
                  className="bg-white border-border text-foreground"
                />
                {isSingapore && (
                  <p className="text-xs text-muted-foreground mt-1">Unique Entity Number (ACRA)</p>
                )}
              </div>
            </div>

            {/* Singapore-only: Shop Image (auto-loaded) */}
            {isSingapore && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Shop / Premises Image</label>
                <p className="text-xs text-muted-foreground mb-3">Upload a photo of your business premises. Auto-loaded for this journey.</p>
                {shopAutoLoading ? (
                  <div className="border rounded-xl h-44 flex items-center justify-center bg-secondary/10">
                    <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : shopImage ? (
                  <div className="relative border rounded-xl overflow-hidden h-44 border-border bg-secondary/20">
                    <img src={shopImage.preview} alt="Shop" className="w-full h-full object-cover" />
                    <button
                      onClick={() => setShopImage(null)}
                      className="absolute top-2 right-2 w-7 h-7 bg-foreground/80 text-background rounded-full flex items-center justify-center hover:bg-foreground transition-colors z-10"
                    >
                      <X size={14} />
                    </button>
                    <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded px-2 py-1 bg-background/90">
                      <CheckCircle2 size={12} className="text-green-600" />
                      <span className="text-xs text-foreground">Shop image loaded</span>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      setShopAutoLoading(true);
                      fetch('/samples/sg-shop-image.jpg').then(r => r.blob()).then(blob => {
                        const reader = new FileReader();
                        reader.onload = (e) => { setShopImage({ name: 'sg-shop-image.jpg', preview: e.target?.result as string, size: blob.size }); setShopAutoLoading(false); };
                        reader.readAsDataURL(blob);
                      }).catch(() => setShopAutoLoading(false));
                    }}
                    className="border-2 border-dashed rounded-xl h-44 flex flex-col items-center justify-center cursor-pointer transition-colors border-amber-400/40 bg-amber-500/[0.02] hover:border-amber-500 hover:bg-amber-500/5"
                  >
                    <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-3">
                      <Upload size={20} className="text-amber-600" />
                    </div>
                    <p className="text-sm font-medium text-foreground mb-1">Click to load shop image</p>
                    <p className="text-xs text-muted-foreground">Auto-loads sample for this journey</p>
                  </div>
                )}
              </div>
            )}

            {/* Singapore-only: Bank Statement */}
            {isSingapore && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Bank Statement</label>
                <p className="text-xs text-muted-foreground mb-3">Upload your most recent business bank statement (OCBC, DBS, UOB, etc.).</p>
                {bankAutoLoading ? (
                  <div className="border rounded-xl h-44 flex items-center justify-center bg-secondary/10">
                    <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : bankStatement ? (
                  <div className="relative border rounded-xl overflow-hidden h-44 border-border bg-secondary/20 flex items-center justify-center">
                    <img src={bankStatement.preview} alt="Bank Statement" className="max-h-full max-w-full object-contain" />
                    <button
                      onClick={() => setBankStatement(null)}
                      className="absolute top-2 right-2 w-7 h-7 bg-foreground/80 text-background rounded-full flex items-center justify-center hover:bg-foreground transition-colors z-10"
                    >
                      <X size={14} />
                    </button>
                    <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded px-2 py-1 bg-background/90">
                      <CheckCircle2 size={12} className="text-green-600" />
                      <span className="text-xs text-foreground">Bank statement uploaded</span>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      setBankAutoLoading(true);
                      fetch('/samples/sg-bank-statement.jpg').then(r => r.blob()).then(blob => {
                        const reader = new FileReader();
                        reader.onload = (e) => { setBankStatement({ name: 'sg-bank-statement.jpg', preview: e.target?.result as string, size: blob.size }); setBankAutoLoading(false); };
                        reader.readAsDataURL(blob);
                      }).catch(() => setBankAutoLoading(false));
                    }}
                    className="border-2 border-dashed rounded-xl h-44 flex flex-col items-center justify-center cursor-pointer transition-colors border-amber-400/40 bg-amber-500/[0.02] hover:border-amber-500 hover:bg-amber-500/5"
                  >
                    <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-3">
                      <Upload size={20} className="text-amber-600" />
                    </div>
                    <p className="text-sm font-medium text-foreground mb-1">Click to upload bank statement</p>
                    <p className="text-xs text-muted-foreground">PDF or image — OCBC, DBS, UOB accepted</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex items-center gap-2 border-border"
            >
              <ChevronLeft size={16} />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold disabled:opacity-40"
            >
              Submit for Review
              <span className="ml-1">→</span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
