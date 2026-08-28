'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getAnySession, logoutAny } from '@/lib/auth';
import { useDemoMode } from '@/lib/demo-context';
import { getDemoFacePhotos } from '@/lib/demo-face-photos';
import { DemoModeBadge } from '@/components/demo-mode-badge';
import { Button } from '@/components/ui/button';
import { LogOut, ChevronLeft, CheckCircle2, RotateCcw, Sun, Glasses, ImageOff, HardHat } from 'lucide-react';
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

type CameraState = 'idle' | 'requesting' | 'tooFar' | 'holdStill' | 'capturing' | 'done';

const TIPS = [
  { icon: Sun,      label: 'Ensure Good Lighting in Background' },
  { icon: Glasses,  label: 'Avoid Wearing Glasses' },
  { icon: ImageOff, label: 'Avoid Background Objects' },
  { icon: HardHat,  label: 'Avoid Wearing Hats' },
];

export default function SelfiePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [session, setSession] = useState<{ name: string; email: string } | null>(null);
  const [samplePhotoUrl, setSamplePhotoUrl] = useState<string | null>(null);
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null);
  const [cameraState, setCameraState] = useState<CameraState>('idle');
  const [countdown, setCountdown] = useState(3);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { isSuccessDemo, selectedCountry: countryCode } = useDemoMode();
  const flag = COUNTRY_FLAGS[countryCode] || '🏳️';
  const countryName = COUNTRY_NAMES[countryCode] ?? countryCode;

  const loadSamplePhoto = useCallback(async (): Promise<string> => {
    const faces = getDemoFacePhotos(countryCode, isSuccessDemo ? 'success' : 'failure');
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
  }, [countryCode, isSuccessDemo]);

  const startCamera = useCallback(async () => {
    setCameraState('requesting');
    const photo = await loadSamplePhoto();
    setSamplePhotoUrl(photo);
    // Simulate: "too far" after 1.2s
    timerRef.current = setTimeout(() => {
      setCameraState('tooFar');
      // then "hold still" + countdown
      timerRef.current = setTimeout(() => {
        setCameraState('holdStill');
        setCountdown(3);
        let c = 3;
        countdownRef.current = setInterval(() => {
          c -= 1;
          setCountdown(c);
          if (c <= 0) {
            clearInterval(countdownRef.current!);
            setCameraState('capturing');
            timerRef.current = setTimeout(() => {
              setCapturedPreview(photo);
              setCameraState('done');
            }, 600);
          }
        }, 1000);
      }, 2200);
    }, 1500);
  }, [loadSamplePhoto]);

  const reset = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    setCapturedPreview(null);
    setCountdown(3);
    setSamplePhotoUrl(null);
    setCameraState('idle');
  }, []);

  useEffect(() => {
    setMounted(true);
    const s = getAnySession();
    if (!s) { router.push('/'); return; }
    setSession(s);
  }, [router]);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
  }, []);

  const handleLogout = () => { router.push(logoutAny()); };

  if (!mounted) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!session) return null;

  const isDone = cameraState === 'done';
  const isActive = !['idle', 'done', 'denied'].includes(cameraState);
  const isHolding = cameraState === 'holdStill' || cameraState === 'capturing';
  const isTooFar = cameraState === 'tooFar';

  const overlayMessage = isTooFar
    ? 'Too far from camera. Please move closer'
    : cameraState === 'holdStill'
    ? `Perfect — hold still, capturing in ${countdown}...`
    : cameraState === 'capturing'
    ? 'Capturing...'
    : null;

  return (
    <div className="min-h-screen bg-[#f0f2f7] flex flex-col">

      {/* Header */}
      <header className="bg-white border-b border-border">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/verification/id-upload" className="text-muted-foreground hover:text-foreground transition-colors">
              <ChevronLeft size={20} />
            </Link>
            <div>
              <p className="text-xs font-bold text-foreground uppercase tracking-widest leading-none">Identity Verification</p>
              <p className="text-xs text-muted-foreground mt-0.5">Take a selfie for facial verification</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <DemoModeBadge />
            <span className="text-xs text-muted-foreground">{flag} {countryName}</span>
            <span className="text-xs font-semibold text-foreground">Step 2 of 3</span>
            <button onClick={handleLogout} className="text-muted-foreground hover:text-foreground transition-colors ml-1">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-8 flex flex-col gap-6">

        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Take a Selfie</h1>
          <p className="text-sm text-muted-foreground mt-1">Please ensure your face is clearly visible and well-lit</p>
        </div>

        {/* Camera / result box */}
        <div className="bg-white rounded-2xl overflow-hidden border border-border shadow-sm">
          {isDone ? (
            /* Captured result — photo inside oval on black, same as capture view */
            <div className="relative overflow-hidden bg-black" style={{ height: 340 }}>
              {capturedPreview && (
                <img
                  src={capturedPreview}
                  alt="Captured selfie"
                  className="absolute inset-0 w-full h-full object-contain"
                />
              )}

              {/* Retake */}
              <button onClick={reset} className="absolute top-3 right-3 w-8 h-8 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black/80 transition-colors z-10">
                <RotateCcw size={14} />
              </button>
              {/* Badge */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full px-4 py-1.5 bg-black/70 z-10">
                <CheckCircle2 size={13} className="text-green-400" />
                <span className="text-xs text-white font-medium">Selfie captured</span>
              </div>
            </div>
          ) : cameraState === 'idle' ? (
            /* Pre-camera idle state */
            <div className="flex flex-col items-center gap-5 p-10">
              <div className="w-44 h-44 rounded-full bg-secondary/30 border-2 border-dashed border-border flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-muted-foreground" aria-hidden="true">
                    <circle cx="12" cy="8" r="4" /><path d="M6 20c0-3.314 2.686-6 6-6s6 2.686 6 6" />
                  </svg>
                </div>
              </div>
              <button
                onClick={startCamera}
                className="flex items-center gap-2 text-sm font-semibold px-6 py-2.5 rounded-xl bg-foreground text-background hover:bg-foreground/80 transition-colors"
              >
                Start Liveness Check
              </button>
            </div>
          ) : (
            /* Simulated camera — black box with sample photo */
            <div className="relative overflow-hidden rounded-2xl bg-black" style={{ height: 340 }}>

              {/* Sample face fades in once loaded */}
              {samplePhotoUrl && cameraState !== 'requesting' && (
                <img
                  src={samplePhotoUrl}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-contain"
                  style={{
                    opacity: isHolding || cameraState === 'tooFar' ? 1 : 0,
                    transition: 'opacity 0.8s ease',
                  }}
                />
              )}

              {/* Oval overlay with cutout */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 100 100"
                preserveAspectRatio="xMidYMid meet"
                aria-hidden="true"
              >
                <defs>
                  <mask id="oval-mask-s">
                    <rect width="100" height="100" fill="white" />
                    <ellipse cx="50" cy="46" rx="24" ry="30" fill="black" />
                  </mask>
                </defs>
                <rect width="100" height="100" fill="rgba(0,0,0,0.38)" mask="url(#oval-mask-s)" />
                <ellipse
                  cx="50" cy="46" rx="24" ry="30"
                  fill="none" strokeWidth="0.6"
                  stroke={isHolding ? '#22c55e' : 'rgba(255,255,255,0.85)'}
                  style={{ transition: 'stroke 0.4s ease' }}
                />
                {isHolding && (
                  <line x1="26" x2="74" y1="46" y2="46" stroke="#22c55e" strokeWidth="0.35" opacity="0.75">
                    <animateTransform attributeName="transform" type="translate" values="0 -16;0 16;0 -16" dur="1.2s" repeatCount="indefinite" />
                  </line>
                )}
              </svg>

              {/* Overlay caption */}
              {overlayMessage && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none w-max max-w-[85%]">
                  <div className="bg-black/72 rounded-xl px-4 py-2 text-center">
                    <p className="text-white text-xs font-medium leading-snug">{overlayMessage}</p>
                  </div>
                </div>
              )}

              {cameraState === 'requesting' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                  <div className="w-7 h-7 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tips — always visible below camera */}
        {!isDone && (
          <div className="bg-white rounded-2xl border border-border shadow-sm p-5 space-y-3">
            <p className="text-sm font-semibold text-foreground">Tips for a good selfie:</p>
            <div className="grid grid-cols-1 gap-2">
              {TIPS.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                  <div className="w-8 h-8 rounded-full bg-secondary/40 flex items-center justify-center flex-shrink-0">
                    <Icon size={15} className="text-muted-foreground" />
                  </div>
                  <span className="text-sm text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom nav */}
        <div className="flex items-center justify-between pt-2">
          <Button variant="outline" onClick={() => router.push('/dashboard/verification/id-upload')} className="flex items-center gap-2">
            <ChevronLeft size={16} /> Back
          </Button>
          <Button
            onClick={() => {
              if (capturedPreview) {
                sessionStorage.setItem('selfie-preview', capturedPreview);
                router.push('/dashboard/verification/result');
              }
            }}
            disabled={!isDone || !capturedPreview}
            className="flex items-center gap-2 bg-foreground text-background hover:bg-foreground/90 px-6 disabled:opacity-40"
          >
            Next <span>→</span>
          </Button>
        </div>

      </main>
    </div>
  );
}
