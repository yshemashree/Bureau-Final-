"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";
import {
  ChevronLeft,
  ChevronRight,
  X,
  ToggleLeft,
  ToggleRight,
  Play,
  Home,
  Wifi,
  Signal as SignalIcon,
} from "lucide-react";
import { DemoRequestModal } from "@/components/demo-request-modal";


const BUREAU_LOGO = "/bureau-logo.png";
const BUREAU_MARK_WHITE = "/bureau-mark-white.png";

const T = {
  primary: "#253B80",
  primaryBg: "rgba(37,59,128,0.06)",
  rose: "#E11D48",
  roseBg: "rgba(225,29,72,0.08)",
  emerald: "#059669",
  emeraldBg: "rgba(5,150,105,0.08)",
  bg: "#f5f7fa",
  white: "#fff",
  border: "#e5e7eb",
  borderLight: "#f3f4f6",
  t900: "#111827",
  t700: "#374151",
  t500: "#6b7280",
  t400: "#9ca3af",
  t300: "#d1d5db",
  mono: "'JetBrains Mono',ui-monospace,monospace",
  sans: "'DM Sans',ui-sans-serif,system-ui,sans-serif",
};

/* ---------- Phone chrome ---------- */
function StatusBar() {
  const [t, sT] = useState("");
  useEffect(() => {
    const u = () =>
      sT(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }));
    u();
    const iv = setInterval(u, 10000);
    return () => clearInterval(iv);
  }, []);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "6px 20px 4px",
        fontSize: 11,
        fontWeight: 600,
        color: "#1a1a1a",
      }}
    >
      <span suppressHydrationWarning style={{ fontWeight: 700 }}>
        {t}
      </span>
      <div style={{ width: 72, height: 22, borderRadius: 16, background: "#1a1a1a" }} />
      <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
        <SignalIcon size={11} />
        <Wifi size={11} />
        <div
          style={{
            width: 18,
            height: 9,
            borderRadius: 2,
            border: "1.5px solid #1a1a1a",
            position: "relative",
            display: "flex",
            alignItems: "center",
            padding: 1,
          }}
        >
          <div style={{ width: "75%", height: "100%", borderRadius: 1, background: "#1a1a1a" }} />
        </div>
      </div>
    </div>
  );
}

export function PhoneFrame({ children, maxHeight = 544 }: { children: ReactNode; maxHeight?: number }) {
  return (
    <div
      className="ds-phone-frame"
      style={{
        position: "relative",
        height: `min(100%, ${maxHeight}px)`,
        aspectRatio: "264 / 544",
        flexShrink: 0,
        minWidth: 0,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 36,
          background: "linear-gradient(145deg,#2a2a2a,#1a1a1a 50%,#2a2a2a)",
          padding: 3,
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
        }}
      >
        <div style={{ width: "100%", height: "100%", borderRadius: 33, background: "#000", padding: 2 }}>
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 31,
              background: "#fff",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <StatusBar />
            <div style={{ flex: 1, overflow: "hidden" }}>{children}</div>
            <div style={{ padding: "5px 0 7px", display: "flex", justifyContent: "center", background: "#fff" }}>
              <div style={{ width: 100, height: 4, borderRadius: 2, background: "#d1d5db" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Shell ---------- */
export interface DemoShellProps {
  /** Header pill label, e.g. "Mule Score" */
  badge: string;
  /** Overview screen heading, e.g. "Bureau Mule Score" */
  overviewTitle: string;
  /** When true, skips rendering the overviewTitle heading in its default top position (use when the page places the heading itself inside `overview`) */
  hideOverviewTitle?: boolean;
  /** Overview screen body (paragraphs / signal lists) */
  overview: ReactNode;
  /** Ordered journey step labels shown as non-interactive tabs */
  journeySteps: string[];
  /** Index of the active journey step */
  currentStep: number;
  /** Inner phone screen content (fills the white device area) */
  phone: ReactNode;
  /** Stage layout: "phone" wraps content in a device frame (default); "dashboard" renders content full-bleed */
  variant?: "phone" | "dashboard";
  /** Short descriptive copy shown under the Bureau Intelligence bubble (dashboard variant) */
  bubbleCopy?: ReactNode;
  /** Results / Bureau Intelligence content shown in the floating popup */
  results?: ReactNode;
  /** Whether the floating Bureau bubble is available */
  hasResults?: boolean;
  /** Label for the primary next button (defaults to "Next") */
  nextLabel?: string;
  /** Hide the next button entirely */
  hideNext?: boolean;
  /** Disable the next button */
  nextDisabled?: boolean;
  /** When true the primary button opens the Request-a-Demo modal instead of calling onNext */
  nextIsRequestDemo?: boolean;
  /** Advance the journey */
  onNext?: () => void;
  /** Step back within the journey (called when currentStep > 0) */
  onBack?: () => void;
  /** Reset demo state when returning to the overview screen */
  onReset?: () => void;
  /** Fires when the demo is started from the overview screen */
  onStart?: () => void;
  /** Optional fraud/genuine toggle in the header */
  fraud?: boolean;
  onToggleFraud?: () => void;
  /** Optional region indicator, e.g. { flag: "🇺🇸", country: "United States" } */
  region?: { flag: string; country: string };
}

export function DemoShell({
  badge,
  overviewTitle,
  hideOverviewTitle = false,
  overview,
  journeySteps,
  currentStep,
  phone,
  variant = "phone",
  bubbleCopy,
  results,
  hasResults = false,
  nextLabel = "Next",
  hideNext = false,
  nextDisabled = false,
  nextIsRequestDemo = false,
  onNext,
  onBack,
  onReset,
  onStart,
  fraud,
  onToggleFraud,
  region,
}: DemoShellProps) {
  const [stage, setStage] = useState<"overview" | "journey">("overview");
  const [resultsOpen, setResultsOpen] = useState(false);
  const [requestDemoOpen, setRequestDemoOpen] = useState(false);
  const journeyTabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const activeTab = journeyTabsRef.current?.children[currentStep] as HTMLElement | undefined;
    activeTab?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [currentStep]);

  const startDemo = () => {
    onStart?.();
    setStage("journey");
  };
  /** Start the demo in an explicit genuine/fraud mode (used by the session-type picker) */
  const startWithMode = (wantFraud: boolean) => {
    if (!!fraud !== wantFraud) onToggleFraud?.();
    onStart?.();
    setStage("journey");
  };
  const handleBack = () => {
    if (currentStep === 0) {
      setResultsOpen(false);
      onReset?.();
      setStage("overview");
    } else {
      onBack?.();
    }
  };
  const handleNext = () => {
    if (nextIsRequestDemo) {
      setRequestDemoOpen(true);
      return;
    }
    onNext?.();
  };

  return (
    <div
      className="ds-root"
      style={{
        fontFamily: T.sans,
        background: T.white,
        height: "100dvh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      {/* Header */}
      <header
        style={{
          flexShrink: 0,
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(8px)",
          borderBottom: `1px solid ${T.borderLight}`,
          padding: "8px 14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          minHeight: 52,
        }}
      >
        <a href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", flexShrink: 0 }}>
          <img src={BUREAU_LOGO || "/placeholder.svg"} alt="Bureau" style={{ height: 28 }} />
        </a>
        <span
          style={{
            fontSize: 8,
            fontWeight: 700,
            color: T.primary,
            textTransform: "uppercase",
            letterSpacing: 0.8,
            padding: "4px 10px",
            borderRadius: 12,
            background: T.primaryBg,
            whiteSpace: "normal",
            lineHeight: 1.35,
            minWidth: 0,
            flexShrink: 1,
            textAlign: "center",
          }}
        >
          {badge}
        </span>
      </header>

      {stage === "overview" ? (
        /* ---------- Screen 1: Overview ---------- */
        <>
          <div style={{ flex: 1, overflowY: "auto", padding: "11px 16px" }}>
            <div style={{ maxWidth: 640, margin: "0 auto" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: T.primary,
                    textTransform: "uppercase",
                    letterSpacing: 1.2,
                  }}
                >
                  Demo Overview
                </span>
              </div>
              {!hideOverviewTitle && (
                <h1 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 16px", color: T.t900, lineHeight: 1.15 }}>
                  {overviewTitle}
                </h1>
              )}
              {overview}
            </div>
          </div>
          <div
            style={{
              flexShrink: 0,
              borderTop: `1px solid ${T.borderLight}`,
              padding: "12px 16px",
              background: T.white,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {onToggleFraud && (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: T.primary,
                  textTransform: "uppercase",
                  letterSpacing: 1.2,
                }}
              >
                Choose a session type
              </span>
            )}
            <div style={{ display: "flex", gap: 8, width: "100%", maxWidth: 640, margin: "0 auto" }}>
              <button
                onClick={() => { window.location.href = "/"; }}
                aria-label="Go home"
                style={{
                  width: 42,
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 99,
                  padding: "10px 0",
                  background: T.white,
                  color: T.t700,
                  border: `1px solid ${T.border}`,
                  cursor: "pointer",
                }}
              >
                <Home size={16} />
              </button>
              {onToggleFraud ? (
                <>
                  <button
                    onClick={() => startWithMode(false)}
                    style={{
                      flex: 1,
                      minWidth: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      borderRadius: 99,
                      padding: "13px 0",
                      background: T.emerald,
                      color: "#fff",
                      border: "none",
                      cursor: "pointer",
                      fontSize: 14,
                      fontWeight: 700,
                      fontFamily: "inherit",
                      boxShadow: `0 4px 12px ${T.emerald}40`,
                    }}
                  >
                    <ToggleLeft size={16} color="#fff" />
                    Genuine
                  </button>
                  <button
                    onClick={() => startWithMode(true)}
                    style={{
                      flex: 1,
                      minWidth: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      borderRadius: 99,
                      padding: "13px 0",
                      background: T.rose,
                      color: "#fff",
                      border: "none",
                      cursor: "pointer",
                      fontSize: 14,
                      fontWeight: 700,
                      fontFamily: "inherit",
                      boxShadow: `0 4px 12px ${T.rose}40`,
                    }}
                  >
                    <ToggleRight size={16} color="#fff" />
                    Fraud
                  </button>
                </>
              ) : (
                <button
                  onClick={startDemo}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    width: "auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    borderRadius: 99,
                    padding: "14px 0",
                    background: "linear-gradient(135deg,#253B80,#1e3a6e)",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 15,
                    fontWeight: 700,
                    fontFamily: "inherit",
                    boxShadow: "0 4px 12px rgba(37,59,128,0.3)",
                  }}
                >
                  <Play size={16} fill="#fff" />
                  Start Demo
                </button>
              )}
            </div>
          </div>
        </>
      ) : (
        /* ---------- Screen 2: Journey ---------- */
        <>
          {/* Journey tabs (non-interactive) */}
          <div style={{ flexShrink: 0, padding: "12px 14px 10px", borderBottom: `1px solid ${T.borderLight}` }}>
            <div
              ref={journeyTabsRef}
              className="ds-journey-tabs"
              style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 2, scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {journeySteps.map((s, i) => {
                const active = i === currentStep;
                const done = i < currentStep;
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      flexShrink: 0,
                      padding: "6px 12px",
                      borderRadius: 99,
                      background: active ? T.primary : done ? T.emeraldBg : T.bg,
                      border: `1px solid ${active ? T.primary : done ? T.emerald + "30" : T.border}`,
                    }}
                  >
                    <div
                      style={{
                        width: 15,
                        height: 15,
                        borderRadius: "50%",
                        fontSize: 8,
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: active ? "#fff" : done ? T.emerald : T.t300,
                        color: active ? T.primary : "#fff",
                      }}
                    >
                      {done ? "✓" : i + 1}
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: active ? 700 : 500,
                        color: active ? "#fff" : done ? T.emerald : T.t500,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {s}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Phone stage */}
          <div
            style={{
              flex: 1,
              minHeight: 0,
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: variant === "dashboard" ? "12px" : "16px 12px",
              background: "linear-gradient(135deg,#f0f4ff 0%,#e8ecf8 50%,#f5f7fa 100%)",
            }}
          >
            {variant === "dashboard" ? (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  maxWidth: 1000,
                  margin: "0 auto",
                  minHeight: 0,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {phone}
              </div>
            ) : (
              <PhoneFrame>{phone}</PhoneFrame>
            )}

            {/* Floating Bureau Intelligence bubble (+ optional copy underneath) */}
            {hasResults && !resultsOpen && (
              <div
                key={`bureau-intel-${currentStep}`}
                style={{
                  position: "absolute",
                  right: 16,
                  bottom: 16,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: 8,
                  maxWidth: "min(280px, calc(100% - 32px))",
                  animation: "dsBubbleIn 0.4s ease",
                }}
              >
                <button
                  onClick={() => setResultsOpen(true)}
                  aria-label="Open Bureau Intelligence results"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 35,
                    height: 35,
                    padding: 0,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg,#253B80,#1e3a6e)",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 8px 24px rgba(37,59,128,0.4)",
                    fontFamily: "inherit",
                    animation: "dsPulse 2.4s ease-in-out infinite 0.6s",
                    flexShrink: 0,
                  }}
                >
                  <img src={BUREAU_MARK_WHITE || "/placeholder.svg"} alt="" style={{ width: 16, height: 16 }} />
                </button>
              </div>
            )}

            {/* Results overlay */}
            {resultsOpen && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 40,
                  display: "flex",
                  flexDirection: "column",
                  background: "rgba(17,24,39,0.35)",
                  backdropFilter: "blur(2px)",
                }}
                onClick={() => setResultsOpen(false)}
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    marginTop: "auto",
                    height: "92%",
                    background: T.white,
                    borderRadius: "20px 20px 0 0",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "0 -12px 40px rgba(0,0,0,0.25)",
                    animation: "dsSheetUp 0.32s cubic-bezier(0.22,1,0.36,1)",
                  }}
                >
                  <div
                    style={{
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 10,
                      padding: "12px 16px",
                      borderBottom: `1px solid ${T.borderLight}`,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                      <span
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          background: "linear-gradient(135deg,#253B80,#1e3a6e)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <img src={BUREAU_MARK_WHITE || "/placeholder.svg"} alt="" style={{ width: 18, height: 18 }} />
                      </span>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: 14, fontWeight: 800, color: T.t900, lineHeight: 1.1 }}>
                          Bureau Intelligence
                        </p>
                        <p style={{ fontSize: 10, color: T.t400 }}>Real-time risk assessment</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setResultsOpen(false)}
                      aria-label="Close results"
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: T.bg,
                        border: `1px solid ${T.border}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        flexShrink: 0,
                      }}
                    >
                      <X size={16} color={T.t500} />
                    </button>
                  </div>
                  <div style={{ flex: 1, overflowY: "auto", padding: "16px", background: T.white }}>{results}</div>
                </div>
              </div>
            )}
          </div>

          {/* Nav buttons */}
          <div
            style={{
              flexShrink: 0,
              display: "flex",
              gap: 10,
              padding: "12px 16px",
              borderTop: `1px solid ${T.borderLight}`,
              background: T.white,
            }}
          >
            <button
              onClick={() => { window.location.href = "/"; }}
              aria-label="Go home"
              style={{
                width: 42,
                flexShrink: 0,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 99,
                padding: "10px 0",
                background: T.white,
                color: T.t700,
                border: `1px solid ${T.border}`,
                cursor: "pointer",
              }}
            >
              <Home size={16} />
            </button>
            <button
              onClick={handleBack}
              style={{
                flex: 1,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
                borderRadius: 99,
                padding: "12px 0",
                background: T.white,
                color: T.t700,
                border: `1px solid ${T.border}`,
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "inherit",
              }}
            >
              <ChevronLeft size={16} />
              Back
            </button>
            {!hideNext && (
              <button
                onClick={handleNext}
                disabled={nextDisabled}
                style={{
                  flex: 1,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                  borderRadius: 99,
                  padding: "12px 0",
                  background: nextDisabled ? T.t300 : "linear-gradient(135deg,#253B80,#1e3a6e)",
                  color: "#fff",
                  border: "none",
                  cursor: nextDisabled ? "not-allowed" : "pointer",
                  fontSize: 13,
                  fontWeight: 700,
                  fontFamily: "inherit",
                  whiteSpace: "nowrap",
                  boxShadow: nextDisabled ? "none" : "0 4px 12px rgba(37,59,128,0.3)",
                }}
              >
                {nextLabel}
                <ChevronRight size={16} />
              </button>
            )}
          </div>
        </>
      )}

      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&family=JetBrains+Mono:wght@400;500;600&display=swap');
@keyframes spin{to{transform:rotate(360deg);}}
@keyframes scaleIn{from{transform:scale(0);opacity:0;}to{transform:scale(1);opacity:1;}}
@keyframes dsBubbleIn{0%{transform:translateY(0) scale(0.6);opacity:0;}55%{transform:translateY(-7px) scale(1.03);opacity:1;}75%{transform:translateY(2px) scale(0.99);}100%{transform:translateY(0) scale(1);opacity:1;}}
@keyframes dsPulse{0%,100%{box-shadow:0 8px 24px rgba(37,59,128,0.4);}50%{box-shadow:0 8px 30px rgba(37,59,128,0.65);}}
@keyframes dsSheetUp{from{transform:translateY(100%);}to{transform:translateY(0);}}
.ds-root *{box-sizing:border-box;}
  .ds-root ::-webkit-scrollbar{width:5px;height:5px;}
  .ds-root ::-webkit-scrollbar-thumb{background:${T.border};border-radius:3px;}
  .ds-root .ds-journey-tabs::-webkit-scrollbar{display:none;}`}</style>
      <DemoRequestModal isOpen={requestDemoOpen} onClose={() => setRequestDemoOpen(false)} />
    </div>
  );
}
