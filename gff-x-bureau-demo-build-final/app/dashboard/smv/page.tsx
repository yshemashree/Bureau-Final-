"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Smartphone, CheckCircle, XCircle, ChevronRight, ChevronLeft, AlertTriangle,
  Wifi, WifiOff, Signal as SignalIcon, RotateCcw, ShieldCheck, ShieldAlert,
  Zap, Radio, Globe, Clock, KeyRound, Ban, ServerCrash, Play, Pause,
  MessageSquareOff, Gauge as GaugeIcon, ArrowRight, Lock
} from "lucide-react";
import { DemoShell } from "@/components/demo-shell";

const T = {
  primary: "#253B80", primaryHover: "#1a2d5a",
  violet: "#7C3AED", violetBg: "rgba(124,58,237,0.08)",
  rose: "#E11D48", roseBg: "rgba(225,29,72,0.08)",
  amber: "#D97706", amberBg: "rgba(217,119,6,0.08)",
  emerald: "#059669", emeraldBg: "rgba(5,150,105,0.08)",
  blue: "#2563EB", blueBg: "rgba(37,99,235,0.08)",
  teal: "#0D9488", tealBg: "rgba(13,148,136,0.08)",
  bg: "#f5f7fa", white: "#fff", border: "#e5e7eb", borderLight: "#f3f4f6",
  t900: "#111827", t700: "#374151", t500: "#6b7280", t400: "#9ca3af", t300: "#d1d5db",
  mono: "ui-monospace,SFMono-Regular,'SF Mono',Menlo,monospace",
  sans: "ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif",
};

const DEMO_MSISDN = "9198XXXXXX42";
const DEMO_DISPLAY = "98765 43210";

/* ═══════════════════ SCENARIO MODEL ═══════════════════
   Mirrors AuthenticationStatus from the OTL Android SDK (5.0.12).
   Supported providers: Jio, Airtel, Vodafone Idea. Unsupported: BSNL, MTNL, etc.
   ────────────────────────────────────────────────────── */

type Tone = "success" | "warning" | "destructive" | "info";

interface Scenario {
  id: string;
  status: string;
  hero?: boolean;
  label: string;
  condition: string;
  tone: Tone;
  icon: any;
  network: string | null;      // telco of active data SIM
  operator: string | null;     // telco of entered MSISDN
  bars: number;
  wifi: boolean;
  userTitle: string;
  userBody: string;
  cta: string;
  fallback: boolean;           // does the journey fall back to OTP
  detail: string;              // what the SDK reports
  nextStep: string;
  latency: number | null;      // ms
  failAt: number;              // which handshake step it breaks on (0-3), 3 = completes
}

const SCENARIOS: Scenario[] = [
  {
    id: "completed", status: "completed", hero: true,
    label: "Verified", condition: "Jio number on Jio data",
    tone: "success", icon: CheckCircle,
    network: "Jio", operator: "Jio", bars: 4, wifi: false,
    userTitle: "Authentication successful",
    userBody: "Redirecting you to the app…",
    cta: "Verified", fallback: false,
    detail: "Active data network and MSISDN operator match, and both are supported. The request is serviceable and the telco confirms ownership of the number.",
    nextStep: "Fetch the final telco verification status.",
    latency: 1864, failAt: 3,
  },
  {
    id: "wifiDetectedAndNoDataNetwork", status: "wifiDetectedAndNoDataNetwork", hero: true,
    label: "Wi-Fi, no mobile data", condition: "Wi-Fi on, cellular data off",
    tone: "info", icon: Wifi,
    network: null, operator: "Jio", bars: 0, wifi: true,
    userTitle: "Wi-Fi detected",
    userBody: "Turn off Wi-Fi and turn on mobile data to verify instantly.",
    cta: "Retry verification", fallback: true,
    detail: "The device is on Wi-Fi with no active mobile data on the default SIM. Silent verification runs over the cellular data path, so it cannot proceed.",
    nextStep: "Fall back to the OTP method.",
    latency: null, failAt: 0,
  },
  {
    id: "networkAndOperatorMismatch", status: "networkAndOperatorMismatch",
    label: "Network / operator mismatch", condition: "Jio number on Airtel data",
    tone: "warning", icon: AlertTriangle,
    network: "Airtel", operator: "Jio", bars: 4, wifi: false,
    userTitle: "Different network detected",
    userBody: "You're on a different mobile network. Switch to Jio data and try again.",
    cta: "Retry verification", fallback: true,
    detail: "Both telcos are supported, but the active data network differs from the operator of the number being verified, so the telco cannot attest to ownership.",
    nextStep: "Fall back to the OTP method.",
    latency: 1120, failAt: 1,
  },
  {
    id: "networkUnavailable", status: "networkUnavailable",
    label: "No mobile data", condition: "Airplane mode or data off",
    tone: "destructive", icon: WifiOff,
    network: null, operator: "Jio", bars: 0, wifi: false,
    userTitle: "No mobile data detected",
    userBody: "Turn on mobile data to continue.",
    cta: "Retry verification", fallback: true,
    detail: "No mobile data connectivity on the default SIM — airplane mode, data disabled, or an inactive SIM.",
    nextStep: "Fall back to the OTP method.",
    latency: null, failAt: 0,
  },
  {
    id: "operatorNotSupported", status: "operatorNotSupported",
    label: "Operator not supported", condition: "BSNL number on Jio data",
    tone: "warning", icon: Radio,
    network: "Jio", operator: "BSNL", bars: 4, wifi: false,
    userTitle: "Operator not supported",
    userBody: "Your mobile operator isn't supported for instant verification yet.",
    cta: "Continue with OTP", fallback: true,
    detail: "The operator of the entered number is outside the supported set. Jio, Airtel and Vodafone Idea are supported today.",
    nextStep: "Fall back to the OTP method.",
    latency: 890, failAt: 1,
  },
  {
    id: "networkNotSupported", status: "networkNotSupported",
    label: "Network not supported", condition: "Jio number on BSNL data",
    tone: "destructive", icon: Radio,
    network: "BSNL", operator: "Jio", bars: 3, wifi: false,
    userTitle: "Network not supported",
    userBody: "Your current mobile data network isn't supported. Switch to Jio data and retry.",
    cta: "Retry verification", fallback: true,
    detail: "The active mobile data network, determined from the IP address, is not supported for silent verification.",
    nextStep: "Fall back to the OTP method.",
    latency: 940, failAt: 0,
  },
  {
    id: "operatorAndNetworkNotSupported", status: "operatorAndNetworkNotSupported",
    label: "Neither supported", condition: "BSNL number on BSNL data",
    tone: "destructive", icon: Ban,
    network: "BSNL", operator: "BSNL", bars: 3, wifi: false,
    userTitle: "Verification not available",
    userBody: "We can't verify this number automatically right now.",
    cta: "Continue with OTP", fallback: true,
    detail: "Neither the MSISDN operator nor the active data network is supported for silent verification.",
    nextStep: "Fall back to the OTP method.",
    latency: 860, failAt: 0,
  },
  {
    id: "authFailure", status: "authFailure",
    label: "Auth failure", condition: "Timeout or transient error",
    tone: "destructive", icon: ServerCrash,
    network: "Jio", operator: "Jio", bars: 4, wifi: false,
    userTitle: "Verification failed",
    userBody: "Something went wrong while verifying. Please try again.",
    cta: "Try again", fallback: true,
    detail: "A recoverable failure — a catch-all covering server-side transient errors, SDK exceptions, and the configured timeout elapsing before a response arrived.",
    nextStep: "Fall back to the OTP method.",
    latency: 6000, failAt: 2,
  },
  {
    id: "timeout", status: "timeout",
    label: "Timeout", condition: "Provider callback not received",
    tone: "destructive", icon: Clock,
    network: "Jio", operator: "Jio", bars: 4, wifi: false,
    userTitle: "Verification timed out",
    userBody: "That took longer than expected. Please try again.",
    cta: "Try again", fallback: true,
    detail: "The flow did not complete inside the allowed window and was terminated. The partner telco callback never arrived.",
    nextStep: "Fall back to the OTP method.",
    latency: 15000, failAt: 2,
  },
  {
    id: "rateLimitExceeded", status: "rateLimitExceeded",
    label: "Rate limited", condition: "15+ attempts in 60 minutes",
    tone: "destructive", icon: GaugeIcon,
    network: "Jio", operator: "Jio", bars: 4, wifi: false,
    userTitle: "Too many attempts",
    userBody: "Please wait a few minutes before trying again.",
    cta: "Try again shortly", fallback: true,
    detail: "Too many authentication requests for the same number inside the defined time window.",
    nextStep: "Fall back to the OTP method.",
    latency: 210, failAt: 2,
  },
  {
    id: "countryNotSupported", status: "countryNotSupported",
    label: "Country not supported", condition: "Non-India MSISDN",
    tone: "warning", icon: Globe,
    network: "Jio", operator: null, bars: 4, wifi: false,
    userTitle: "Number not supported",
    userBody: "Instant verification isn't available for this country yet.",
    cta: "Continue with OTP", fallback: true,
    detail: "The MSISDN country code is not currently enabled for silent verification.",
    nextStep: "Fall back to the OTP method.",
    latency: 180, failAt: 1,
  },
  {
    id: "authValidationError", status: "authValidationError",
    label: "Validation error", condition: "Malformed MSISDN or missing ID",
    tone: "warning", icon: AlertTriangle,
    network: "Jio", operator: null, bars: 4, wifi: false,
    userTitle: "Please check the number",
    userBody: "Enter a 12-digit mobile number including the country code.",
    cta: "Edit number", fallback: true,
    detail: "Required request parameters are missing or invalid — a malformed MSISDN or an absent correlation ID.",
    nextStep: "Fall back to the OTP method.",
    latency: 95, failAt: 0,
  },
  {
    id: "duplicateCorrelationId", status: "duplicateCorrelationId",
    label: "Duplicate correlation ID", condition: "Same ID reused in window",
    tone: "destructive", icon: KeyRound,
    network: "Jio", operator: "Jio", bars: 4, wifi: false,
    userTitle: "Verification failed",
    userBody: "Something went wrong while verifying. Please try again.",
    cta: "Try again", fallback: true,
    detail: "The correlation ID supplied has already been used in a previous request inside the allowed time window. Each attempt needs a fresh unique ID.",
    nextStep: "Fall back to the OTP method.",
    latency: 130, failAt: 2,
  },
  {
    id: "integrationFailure", status: "integrationFailure",
    label: "Integration failure", condition: "Flow state lost mid-process",
    tone: "destructive", icon: ServerCrash,
    network: "Jio", operator: "Jio", bars: 4, wifi: false,
    userTitle: "Verification failed",
    userBody: "Something went wrong while verifying. Please try again.",
    cta: "Try again", fallback: true,
    detail: "The backend could not associate the request with an active authentication flow — the flow state was lost or expired.",
    nextStep: "Fall back to the OTP method.",
    latency: 340, failAt: 2,
  },
  {
    id: "authStateExpired", status: "authStateExpired",
    label: "State expired", condition: "Finalize called after TTL",
    tone: "destructive", icon: Clock,
    network: "Jio", operator: "Jio", bars: 4, wifi: false,
    userTitle: "Session expired",
    userBody: "Your verification session expired. Please start again.",
    cta: "Start again", fallback: true,
    detail: "The authentication state expired before the verify step completed — the time-to-live was exceeded.",
    nextStep: "Fall back to the OTP method.",
    latency: 260, failAt: 2,
  },
  {
    id: "unauthorized", status: "unauthorized",
    label: "Unauthorized", condition: "Invalid API credentials",
    tone: "destructive", icon: Lock,
    network: "Jio", operator: "Jio", bars: 4, wifi: false,
    userTitle: "Verification unavailable",
    userBody: "We couldn't verify your number right now. Please try another way.",
    cta: "Continue with OTP", fallback: true,
    detail: "API authorization failed due to missing or invalid credentials on the integrating application's side.",
    nextStep: "Fall back to the OTP method.",
    latency: 110, failAt: 2,
  },
  {
    id: "internalServerError", status: "internalServerError",
    label: "Internal server error", condition: "Upstream service outage",
    tone: "destructive", icon: ServerCrash,
    network: "Jio", operator: "Jio", bars: 4, wifi: false,
    userTitle: "Verification failed",
    userBody: "Something went wrong while verifying. Please try again.",
    cta: "Try again", fallback: true,
    detail: "An unexpected server-side error occurred while processing the request.",
    nextStep: "Fall back to the OTP method.",
    latency: 480, failAt: 2,
  },
];

const HERO = SCENARIOS.filter((s) => s.hero);
const REST = SCENARIOS.filter((s) => !s.hero);

const HANDSHAKE = [
  { label: "Detect active data network", sub: "Reads the default SIM's live data connection" },
  { label: "Resolve number's operator", sub: "Maps the MSISDN to its telco" },
  { label: "Telco handshake", sub: "Silent request to the partner telco endpoint" },
  { label: "Verification status", sub: "Ownership confirmed by the operator" },
];

const toneColor = (t: Tone) =>
  t === "success" ? T.emerald : t === "warning" ? T.amber : t === "info" ? T.blue : T.rose;
const toneBg = (t: Tone) =>
  t === "success" ? T.emeraldBg : t === "warning" ? T.amberBg : t === "info" ? T.blueBg : T.roseBg;

/* ═══════════════════ PHONE CHROME ═══════════════════ */

const StatusBar = ({ sc }: { sc: Scenario | null }) => {
  const [t, sT] = useState("");
  useEffect(() => {
    const u = () =>
      sT(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }));
    u();
    const iv = setInterval(u, 10000);
    return () => clearInterval(iv);
  }, []);
  const bars = sc ? sc.bars : 4;
  const net = sc ? sc.network : "Jio";
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 20px 4px", fontSize: 11, fontWeight: 600, color: "#1a1a1a" }}>
      <span style={{ fontWeight: 700, letterSpacing: 0.3 }}>{t}</span>
      <div style={{ width: 72, height: 22, borderRadius: 16, background: "#1a1a1a" }} />
      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        {sc?.wifi && <Wifi size={11} />}
        {net && <span style={{ fontSize: 8.5, fontWeight: 700 }}>{net}</span>}
        <div style={{ display: "flex", gap: 1.5, alignItems: "flex-end" }}>
          {[3, 5, 7, 9].map((h, i) => (
            <div key={i} style={{ width: 2, height: h, borderRadius: 1, background: i < bars ? "#1a1a1a" : "#d1d5db" }} />
          ))}
        </div>
        <div style={{ width: 18, height: 9, borderRadius: 2, border: "1.5px solid #1a1a1a", position: "relative", display: "flex", alignItems: "center", padding: 1 }}>
          <div style={{ width: "75%", height: "100%", borderRadius: 1, background: "#1a1a1a" }} />
          <div style={{ position: "absolute", right: -3, width: 2, height: 5, borderRadius: "0 1px 1px 0", background: "#1a1a1a" }} />
        </div>
      </div>
    </div>
  );
};

const Phone = ({ children, sc }: { children: any; sc: Scenario | null }) => (
  <div style={{ position: "relative", width: 266, height: 546, flexShrink: 0 }}>
    <div style={{ position: "absolute", right: -2.5, top: 130, width: 3, height: 40, borderRadius: "0 2px 2px 0", background: "#2a2a2a" }} />
    <div style={{ position: "absolute", left: -2.5, top: 110, width: 3, height: 28, borderRadius: "2px 0 0 2px", background: "#2a2a2a" }} />
    <div style={{ position: "absolute", left: -2.5, top: 148, width: 3, height: 28, borderRadius: "2px 0 0 2px", background: "#2a2a2a" }} />
    <div style={{ width: 260, height: 540, borderRadius: 36, background: "linear-gradient(145deg,#2a2a2a,#1a1a1a 50%,#2a2a2a)", padding: 3, boxShadow: "0 20px 60px rgba(0,0,0,0.25),inset 0 1px 1px rgba(255,255,255,0.05)", margin: "0 auto" }}>
      <div style={{ width: "100%", height: "100%", borderRadius: 33, background: "#000", padding: 2 }}>
        <div style={{ width: "100%", height: "100%", borderRadius: 31, background: "#fff", overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <StatusBar sc={sc} />
          <div style={{ flex: 1, overflow: "hidden" }}>{children}</div>
          <div style={{ padding: "5px 0 7px", display: "flex", justifyContent: "center", background: "#fff" }}>
            <div style={{ width: 100, height: 4, borderRadius: 2, background: "#d1d5db" }} />
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* ═══════════════════ MAIN ═══════════════════ */

export default function BureauSMV() {
  // 0 = intro, 1 = number entry, 2 = scenario picker, 3 = verifying/result
  const [step, setStep] = useState(0);
  const [sc, setSc] = useState<Scenario | null>(null);
  const [trace, setTrace] = useState(-1);   // handshake step currently lit
  const [done, setDone] = useState(false);
  const [showAll, setShowAll] = useState(true);
  const timers = useRef<any[]>([]);

  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  useEffect(() => () => clearTimers(), []);

  const reset = useCallback(() => {
    clearTimers();
    setStep(0); setSc(null); setTrace(-1); setDone(false); setShowAll(true);
  }, []);

  const run = useCallback((s: Scenario) => {
    clearTimers();
    setSc(s); setStep(3); setTrace(-1); setDone(false);
    const stop = s.failAt;
    for (let i = 0; i <= stop; i++) {
      timers.current.push(setTimeout(() => setTrace(i), 420 + i * 460));
    }
    timers.current.push(setTimeout(() => setDone(true), 420 + (stop + 1) * 460 + 240));
  }, []);

  const stepLabels = ["Enter number", "Pick a condition", "Silent verification"];
  const atEnd = step === 3 && done;
  const color = sc ? toneColor(sc.tone) : T.blue;
  const bgc = sc ? toneBg(sc.tone) : T.blueBg;

  /* ─── Phone screens ─── */
  const phoneContent = () => {
    const BtnStyle: any = { padding: 12, borderRadius: 24, background: T.primary, color: "#fff", textAlign: "center", fontSize: 13, fontWeight: 700, cursor: "pointer", width: "100%" };

    if (step === 0)
      return (
        <div style={{ background: "#fff", height: "100%", display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <img src="/bureau-logo.png" alt="Bureau" style={{ width: 132, height: "auto", marginBottom: 14, objectFit: "contain" }} />
            <p style={{ fontSize: 9, color: T.t400, letterSpacing: 3, textTransform: "uppercase", fontWeight: 600 }}>Secure Login</p>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 22 }}>
              <Smartphone size={20} color={T.t300} />
            </div>
            <p style={{ fontSize: 11, color: T.t500, marginTop: 10 }}>Silent Mobile Verification</p>
            <p style={{ fontSize: 9.5, color: T.t400, marginTop: 3 }}>No OTP. No typing. No wait.</p>
          </div>
          <div style={{ padding: "0 16px 14px" }}><div onClick={() => setStep(1)} style={BtnStyle}>Start Demo →</div></div>
        </div>
      );

    if (step === 1)
      return (
        <div style={{ background: "#fff", height: "100%", display: "flex", flexDirection: "column", padding: "22px 18px 14px" }}>
<img src="/bureau-logo.png" alt="Bureau" style={{ height: 26, width: "auto", marginBottom: 24, objectFit: "contain" }} />
<h2 style={{ fontSize: 19, fontWeight: 700, color: T.t900, marginBottom: 4 }}>Welcome back</h2>
          <p style={{ fontSize: 11.5, color: T.t500, marginBottom: 22 }}>Enter your phone number to continue</p>
          <label style={{ fontSize: 10, fontWeight: 600, color: T.t700, marginBottom: 6 }}>Phone Number</label>
          <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
            <div style={{ width: 46, padding: "9px 0", border: `1px solid ${T.border}`, borderRadius: 8, background: T.bg, textAlign: "center", fontSize: 12, fontWeight: 600, color: T.t700 }}>+91</div>
            <div style={{ flex: 1, padding: "9px 11px", border: `1.5px solid ${step === 2 ? T.primary : T.border}`, borderRadius: 8, fontSize: 13, fontWeight: 600, color: T.t900, letterSpacing: 0.4 }}>{DEMO_DISPLAY}</div>
          </div>
          <div onClick={() => setStep(2)} style={{ ...BtnStyle, marginTop: 6, opacity: step === 2 ? 0.5 : 1 }}>Continue</div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 14, color: T.t400 }}>
            <ShieldCheck size={11} /><span style={{ fontSize: 9.5 }}>Secured with instant verification</span>
          </div>
          <div style={{ flex: 1 }} />
        </div>
      );

    if (step === 2)
      return (
        <div style={{ background: "#fff", height: "100%", display: "flex", flexDirection: "column", padding: "18px 14px 14px", overflowY: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
            <Radio size={13} color={T.blue} />
            <span style={{ fontSize: 9, fontWeight: 700, color: T.blue, textTransform: "uppercase", letterSpacing: 1.2 }}>Network Condition</span>
          </div>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: T.t900, margin: "0 0 3px" }}>Pick a condition</h2>
          <p style={{ fontSize: 10.5, color: T.t500, marginBottom: 14 }}>Every state the SDK can return is modelled here.</p>
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            {HERO.map((s) => {
              const c = toneColor(s.tone);
              return (
                <div key={s.id} onClick={() => run(s)} style={{ flex: 1, minWidth: 0, background: T.bg, borderRadius: 8, padding: "8px 10px", border: `1px solid ${T.border}`, borderLeft: `3px solid ${c}`, cursor: "pointer" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 2 }}>
                    <s.icon size={11} color={c} />
                    <span style={{ fontSize: 10, fontWeight: 600, color: T.t900 }}>{s.label}</span>
                  </div>
                  <p style={{ fontSize: 8.5, color: T.t400 }}>{s.condition}</p>
                </div>
              );
            })}
          </div>
          <button onClick={() => setShowAll((v) => !v)} style={{ display: "flex", alignItems: "center", gap: 5, background: "transparent", border: "none", cursor: "pointer", padding: 0, marginBottom: 10, fontFamily: "inherit" }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: T.t400, textTransform: "uppercase", letterSpacing: 1.2 }}>All SDK states · {SCENARIOS.length}</span>
            <ChevronRight size={12} color={T.t400} style={{ transform: showAll ? "rotate(90deg)" : "none", transition: "transform 0.2s" }} />
          </button>
          {showAll && (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {REST.map((s) => {
                const c = toneColor(s.tone);
                return (
                  <div key={s.id} onClick={() => run(s)} style={{ background: T.bg, borderRadius: 8, padding: "8px 10px", border: `1px solid ${T.border}`, borderLeft: `3px solid ${c}`, cursor: "pointer" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 2 }}>
                      <s.icon size={11} color={c} />
                      <span style={{ fontSize: 10, fontWeight: 600, color: T.t900 }}>{s.label}</span>
                    </div>
                    <p style={{ fontSize: 8.5, color: T.t400 }}>{s.condition}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      );

    // step 3 — verifying then result
    if (!sc) return null;
    const finished = done;
    const ok = sc.tone === "success";
    return (
      <div style={{ background: "#fff", height: "100%", display: "flex", flexDirection: "column", padding: "22px 18px 14px" }}>
        <img src="/bureau-logo.png" alt="Bureau" style={{ height: 26, marginBottom: 24 }} />
        <h2 style={{ fontSize: 19, fontWeight: 700, color: T.t900, marginBottom: 4 }}>Welcome back</h2>
        <p style={{ fontSize: 11.5, color: T.t500, marginBottom: 22 }}>Enter your phone number to continue</p>
        <label style={{ fontSize: 10, fontWeight: 600, color: T.t700, marginBottom: 6 }}>Phone Number</label>
        <div style={{ display: "flex", gap: 6, marginBottom: 5 }}>
          <div style={{ width: 46, padding: "9px 0", border: `1px solid ${T.border}`, borderRadius: 8, background: T.bg, textAlign: "center", fontSize: 12, fontWeight: 600, color: T.t700 }}>+91</div>
          <div style={{ flex: 1, padding: "9px 11px", border: `1.5px solid ${finished ? color : T.border}`, borderRadius: 8, fontSize: 13, fontWeight: 600, color: T.t500, letterSpacing: 0.4, background: T.bg }}>{DEMO_DISPLAY}</div>
        </div>
        <p style={{ fontSize: 9.5, color: T.t400, marginBottom: 16, minHeight: 13 }}>
          {sc.wifi ? "Wi-Fi connected · Mobile data off"
            : sc.network ? `Detected: ${sc.network} network${sc.operator && sc.operator !== sc.network ? ` · Number: ${sc.operator}` : ""}`
              : "No mobile data"}
        </p>

        {!finished ? (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "11px 0" }}>
              <div style={{ width: 15, height: 15, borderRadius: "50%", border: `2px solid ${T.border}`, borderTopColor: T.primary, animation: "spin 0.8s linear infinite" }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: T.t500 }}>Verifying…</span>
            </div>
            <p style={{ fontSize: 9.5, color: T.t400, textAlign: "center" }}>No SMS sent. Nothing to type.</p>
          </>
        ) : (
          <>
            <div style={{ padding: "11px 12px", borderRadius: 10, background: bgc, border: `1px solid ${color}20`, display: "flex", gap: 8 }}>
              {ok ? <CheckCircle size={15} color={color} style={{ flexShrink: 0, marginTop: 1 }} /> : <sc.icon size={15} color={color} style={{ flexShrink: 0, marginTop: 1 }} />}
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color }}>{sc.userTitle}</p>
                <p style={{ fontSize: 10, color, opacity: 0.85, marginTop: 2, lineHeight: 1.45 }}>{sc.userBody}</p>
              </div>
            </div>
            {sc.fallback && (
              <div style={{ marginTop: 10, padding: "10px 12px", borderRadius: 24, border: `1.5px solid ${T.border}`, textAlign: "center", fontSize: 12, fontWeight: 600, color: T.t700, cursor: "pointer" }}>
                Continue with OTP instead
              </div>
            )}
            {ok && sc.latency && (
              <p style={{ fontSize: 9.5, color: T.emerald, textAlign: "center", marginTop: 12, fontWeight: 600 }}>
                Verified in {(sc.latency / 1000).toFixed(1)}s · no OTP sent
              </p>
            )}
          </>
        )}
        <div style={{ flex: 1 }} />
      </div>
    );
  };

  /* ─── Right panel ─── */
  const overviewBody = (
        <div>
          <div style={{ background: T.bg, borderRadius: 12, padding: 16, border: `1px solid ${T.border}`, lineHeight: 1.7 }}>
            <p style={{ fontSize: 12, color: T.t500, marginBottom: 10 }}>
              Bureau verifies a customer's phone number <strong>directly with their mobile operator</strong> - no OTP, no SMS, nothing for the user to type. The number is confirmed in around <strong>two seconds</strong> while the customer simply waits on the screen.
            </p>
            <p style={{ fontSize: 12, color: T.t500, marginBottom: 10 }}>
              The SDK reads the device's <strong>active data network</strong>, resolves the <strong>operator of the number</strong> being verified, and performs a silent handshake with the telco over the cellular data path. Ownership is attested by the operator itself, not by possession of a code.
            </p>
            <p style={{ fontSize: 12, color: T.t500 }}>
              Supported today across <strong>Jio, Airtel and Vodafone Idea</strong>.
            </p>
          </div>
          <p style={{ fontSize: 10, fontWeight: 700, color: T.t400, textTransform: "uppercase", letterSpacing: 1.2, marginTop: 16, marginBottom: 8 }}>What You'll See</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, columnGap: 20 }}>
            {[
              { icon: Smartphone, label: "Customer Journey", desc: "Number entry inside a live app" },
              { icon: Zap, label: "Silent Handshake", desc: "Telco checks running underneath" },
              { icon: ShieldCheck, label: "Verified Outcome", desc: "Confirmed without an OTP" },
              { icon: ShieldAlert, label: "Graceful Fallback", desc: "Clean OTP path when not serviceable" },
            ].map((f, i) => (
              <div key={i} style={{ background: T.bg, borderRadius: 8, padding: 12, border: `1px solid ${T.border}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <f.icon size={14} color={T.blue} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: T.t900 }}>{f.label}</span>
                </div>
                <p style={{ fontSize: 10, color: T.t500 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
  );

  const rightPanel = () => {
    if (step !== 3 || !sc) return null;
    const stop = sc.failAt;
    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
          <Zap size={14} color={T.blue} />
          <span style={{ fontSize: 10, fontWeight: 700, color: T.blue, textTransform: "uppercase", letterSpacing: 1.2 }}>Under the hood</span>
        </div>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: T.t900, margin: "0 0 14px" }}>What the customer never sees</h2>

        <div style={{ background: T.bg, borderRadius: 10, padding: 12, marginBottom: 14, border: `1px solid ${T.border}`, display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
          {[
            { k: "Data network", v: sc.wifi ? "Wi-Fi" : sc.network || "None" },
            { k: "Number operator", v: sc.operator || "—" },
            { k: "Channel", v: "Cellular" },
            { k: "OTP sent", v: "No" },
          ].map((m, i) => (
            <div key={i}>
              <p style={{ fontSize: 9, fontWeight: 600, color: T.t400, textTransform: "uppercase" }}>{m.k}</p>
              <p style={{ fontSize: 10.5, fontWeight: 700, color: T.t900 }}>{m.v}</p>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 9, fontWeight: 700, color: T.t400, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 7 }}>Verification sequence</p>
        <div style={{ marginBottom: 14 }}>
          {HANDSHAKE.map((h, i) => {
            const lit = trace >= i;
            const broke = done && i === stop && sc.tone !== "success";
            const passed = lit && !broke;
            const dim = !lit;
            return (
              <div key={i} style={{ display: "flex", gap: 9, padding: "8px 11px", borderRadius: 8, background: dim ? "transparent" : broke ? toneBg(sc.tone) : T.bg, border: `1px solid ${dim ? "transparent" : broke ? `${color}25` : T.border}`, marginBottom: 5, opacity: dim ? 0.35 : 1, transition: "all 0.35s" }}>
                <div style={{ width: 17, height: 17, borderRadius: "50%", flexShrink: 0, marginTop: 1, display: "flex", alignItems: "center", justifyContent: "center", background: broke ? color : passed ? T.emerald : T.t300, color: "#fff", fontSize: 9, fontWeight: 700 }}>
                  {broke ? "!" : passed ? "✓" : i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: broke ? color : T.t900 }}>{h.label}</p>
                  <p style={{ fontSize: 9.5, color: T.t400 }}>{h.sub}</p>
                </div>
                {passed && i === 3 && sc.latency && (
                  <span style={{ fontSize: 9, color: T.emerald, fontFamily: T.mono, fontWeight: 700 }}>{sc.latency} ms</span>
                )}
              </div>
            );
          })}
        </div>

        {done && (
          <div style={{ animation: "fadeSlideIn 0.4s ease" }}>
            <div style={{ background: T.bg, borderRadius: 12, border: `1px solid ${T.border}`, overflow: "hidden", marginBottom: 12 }}>
              <div style={{ background: T.t900, padding: "9px 13px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Smartphone size={13} color={T.blue} />
                  <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>SDK Response</span>
                </div>
                <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: color, color: "#fff", fontFamily: T.mono }}>{sc.status}</span>
              </div>
              <div style={{ padding: 13 }}>
                <p style={{ fontSize: 11.5, color: T.t700, lineHeight: 1.65, marginBottom: 10 }}>{sc.detail}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 12px", borderRadius: 8, background: bgc }}>
                  {sc.tone === "success" ? <CheckCircle size={15} color={color} /> : <ArrowRight size={15} color={color} />}
                  <span style={{ fontSize: 11.5, fontWeight: 700, color }}>{sc.nextStep}</span>
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {[
                { k: "Outcome", v: sc.tone === "success" ? "Verified" : "Not serviceable", c: color },
                { k: "Customer effort", v: sc.tone === "success" ? "None" : "OTP fallback", c: T.t900 },
                { k: "Elapsed", v: sc.latency ? `${(sc.latency / 1000).toFixed(2)}s` : "—", c: T.t900 },
              ].map((m, i) => (
                <div key={i} style={{ background: T.bg, borderRadius: 8, padding: 11, border: `1px solid ${T.border}` }}>
                  <p style={{ fontSize: 9, fontWeight: 600, color: T.t400, textTransform: "uppercase" }}>{m.k}</p>
                  <p style={{ fontSize: 12, fontWeight: 700, color: m.c, marginTop: 2 }}>{m.v}</p>
                </div>
              ))}
            </div>

            <p style={{ fontSize: 9, color: T.t400, textAlign: "center", marginTop: 12 }}>Bureau · Silent Mobile Verification · OTL SDK 5.0.12</p>
          </div>
        )}
      </div>
    );
  };

  const goBack = () => { if (step === 3) { clearTimers(); setSc(null); setTrace(-1); setDone(false); setStep(2); } else if (step > 1) setStep(step - 1); };

  return (
    <DemoShell
      badge="Silent Mobile Verification"
      overviewTitle="Silent Mobile Verification"
      overview={overviewBody}
      journeySteps={stepLabels}
      currentStep={Math.min(Math.max(step - 1, 0), stepLabels.length - 1)}
      phone={phoneContent()}
      results={rightPanel()}
      hasResults={step === 3}
      nextLabel={atEnd ? "Request Demo" : "Continue"}
      nextDisabled={step === 3 && !done}
      hideNext={step === 2}
      nextIsRequestDemo={atEnd}
      onStart={() => setStep(1)}
      onNext={() => { if (step === 1) setStep(2); }}
      onBack={goBack}
      onReset={reset}
    />
  );
}
