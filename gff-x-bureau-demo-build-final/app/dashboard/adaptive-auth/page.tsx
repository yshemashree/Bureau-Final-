"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  CheckCircle, ShieldCheck, ShieldAlert, ShieldX, AlertTriangle,
  ChevronRight, Fingerprint, Activity,
  Wifi, MapPin, Cpu, Lock, Gauge, Zap, TrendingUp, Clock,
  ScreenShare, Plane, Bot,
} from "lucide-react";
import { DemoShell } from "@/components/demo-shell";

const T = {
  primary: "#253B80", primaryHover: "#1a2d5a",
  violet: "#7C3AED", violetBg: "rgba(124,58,237,0.08)",
  rose: "#E11D48", roseBg: "rgba(225,29,72,0.08)",
  amber: "#D97706", amberBg: "rgba(217,119,6,0.08)",
  emerald: "#059669", emeraldBg: "rgba(5,150,105,0.08)",
  blue: "#2563EB", blueBg: "rgba(37,99,235,0.08)",
  bg: "#f5f7fa", white: "#fff", border: "#e5e7eb", borderLight: "#f3f4f6",
  t900: "#111827", t700: "#374151", t500: "#6b7280", t400: "#9ca3af", t300: "#d1d5db",
  mono: "ui-monospace,SFMono-Regular,'SF Mono',Menlo,monospace",
  sans: "ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif",
};

/* ══════════════════════════════════════════════════════════════
   SIGNAL MODEL
   Rule names, base scores and additive scores are Bureau SDK
   signals. Scoring follows the production contract:
       single cause    → final = base
       multiple causes → final = max(base) + min(30, Σ additive)
       scale 0–100
   ══════════════════════════════════════════════════════════════ */

type Layer = "device" | "behavioural" | "network" | "location";

interface Signal {
  rule: string;
  base: number;
  add: number;
  layer: Layer;
  desc: string;
}

const LAYERS: { id: Layer; label: string; icon: any; blurb: string }[] = [
  { id: "device", label: "Device", icon: Cpu, blurb: "Integrity, tampering, emulation, screen state" },
  { id: "behavioural", label: "Behavioural", icon: Activity, blurb: "Typing cadence, motion, interaction rhythm" },
  { id: "network", label: "Network", icon: Wifi, blurb: "IP reputation, anonymisation, shared infrastructure" },
  { id: "location", label: "Location", icon: MapPin, blurb: "Geo consistency, travel plausibility, spoofing" },
];

interface Alert {
  title: string;
  body: string;
  level: "Low Risk" | "Medium Risk" | "High Risk";
  time: string;
}

type Decision = "allow" | "stepup" | "block";

interface Scenario {
  id: string;
  hero?: boolean;
  label: string;
  strap: string;
  icon: any;
  narrative: string;
  signals: Signal[];
  alerts: Alert[];
  decision: Decision;
  phoneTitle: string;
  phoneBody: string;
  takeaway: string;
}

/* ── Scoring, exactly as specified ── */
function score(signals: Signal[]) {
  if (signals.length === 0) return 0;
  if (signals.length === 1) return signals[0].base;
  const maxBase = Math.max(...signals.map((s) => s.base));
  const addSum = signals.reduce((n, s) => n + s.add, 0);
  return Math.min(100, maxBase + Math.min(30, addSum));
}

const band = (n: number) =>
  n >= 90 ? { label: "Critical", color: T.rose, bg: T.roseBg }
    : n >= 70 ? { label: "High", color: T.rose, bg: T.roseBg }
      : n >= 40 ? { label: "Medium", color: T.amber, bg: T.amberBg }
        : { label: "Low", color: T.emerald, bg: T.emeraldBg };

const DECISION = {
  allow: { label: "Allow — no friction", icon: ShieldCheck, color: T.emerald, bg: T.emeraldBg, sub: "Session continues silently. Nothing asked of the customer." },
  stepup: { label: "Step up — challenge", icon: ShieldAlert, color: T.amber, bg: T.amberBg, sub: "Additional verification requested, only because risk rose." },
  block: { label: "Block — hold for review", icon: ShieldX, color: T.rose, bg: T.roseBg, sub: "Action halted and routed to the fraud team." },
};

const SCENARIOS: Scenario[] = [
  {
    id: "trusted", hero: true,
    label: "Trusted session", strap: "Known device, familiar context",
    icon: ShieldCheck,
    narrative: "The customer logs in from a device we've seen before, at a normal hour, from their usual city, and behaves the way they always do. No rule fires. There is nothing to challenge, so nothing is asked.",
    signals: [],
    alerts: [
      { title: "Device Recognised", body: "Device matches previous login patterns", level: "Low Risk", time: "14:32:56" },
      { title: "Location Verified", body: "Login location consistent with user history", level: "Low Risk", time: "14:32:56" },
      { title: "Behavioural Match", body: "Interaction pattern consistent with profile", level: "Low Risk", time: "14:35:10" },
    ],
    decision: "allow",
    phoneTitle: "You're signed in",
    phoneBody: "Welcome back. Nothing else needed.",
    takeaway: "Ninety percent of sessions look like this. Adaptive auth's first job is to leave them alone.",
  },
  {
    id: "remote-access", hero: true,
    label: "Remote-access scam", strap: "Screen share plus live voice call",
    icon: ScreenShare,
    narrative: "The identity is genuine. The credentials are correct. The device is clean. But the screen is being shared and a voice call is running — the signature of a customer being talked through a transfer by a fraudster in real time. Point-in-time identity checks are blind to this. Session-level risk is not.",
    signals: [
      { rule: "SCREEN_SHARING", base: 70, add: 0, layer: "device", desc: "Active screen sharing or mirroring detected" },
      { rule: "VOICE_CALL_DETECTED", base: 30, add: 10, layer: "device", desc: "An active voice call is running during the session" },
    ],
    alerts: [
      { title: "Screen Sharing Active", body: "Session is being mirrored to a third party", level: "High Risk", time: "16:31:04" },
      { title: "Voice Call In Progress", body: "Live call detected alongside a sensitive action", level: "Medium Risk", time: "16:31:04" },
      { title: "Sensitive Action", body: "User attempting to add a new beneficiary", level: "High Risk", time: "16:37:19" },
    ],
    decision: "block",
    phoneTitle: "Transfer paused",
    phoneBody: "For your safety we've paused this. End any call or screen share and try again.",
    takeaway: "A genuine user in a risky episode. Identity was never the problem — context was.",
  },
  {
    id: "unusual-context",
    label: "Unusual context", strap: "Odd hour, shared IP, private mode",
    icon: Clock,
    narrative: "Nothing here is damning on its own. Late-night access, an IP shared by many users, and a private browsing session. Individually noise; together enough to warrant asking one question before proceeding.",
    signals: [
      { rule: "HIGH_USER_COUNT_PER_IP", base: 30, add: 10, layer: "network", desc: "Many users originating from the same IP address" },
      { rule: "UNUSUAL_SESSION_TIME", base: 20, add: 10, layer: "behavioural", desc: "Session occurring late at night, outside the user's norm" },
      { rule: "INCOGNITO_DETECTED", base: 20, add: 10, layer: "network", desc: "Private or incognito browsing mode detected" },
    ],
    alerts: [
      { title: "Unusual Login Time", body: "Login detected outside normal hours", level: "Medium Risk", time: "02:14:08" },
      { title: "Shared Network", body: "High user count observed on this IP", level: "Medium Risk", time: "02:14:08" },
    ],
    decision: "stepup",
    phoneTitle: "Quick check",
    phoneBody: "Confirm it's you with your fingerprint to continue.",
    takeaway: "Step-up fires here and nowhere else. That's the difference between security and friction.",
  },
  {
    id: "new-device-travel",
    label: "New device, impossible travel", strap: "Unseen device in another city",
    icon: Plane,
    narrative: "A device we have never seen for this user, appearing in a location the customer could not physically have reached since their last session, with GPS values that don't hold up. This is the classic account-takeover shape.",
    signals: [
      { rule: "NEW_USER_DEVICE_PAIR", base: 70, add: 0, layer: "device", desc: "User is logging in from a new or unseen device" },
      { rule: "IMPOSSIBLE_TRAVEL", base: 70, add: 0, layer: "location", desc: "Location changed faster than physically possible" },
      { rule: "MOCK_GPS", base: 70, add: 10, layer: "location", desc: "Device location data is being artificially manipulated" },
    ],
    alerts: [
      { title: "New Device Detected", body: "First login from this device fingerprint", level: "High Risk", time: "09:12:41" },
      { title: "Impossible Travel", body: "Location inconsistent with previous session", level: "High Risk", time: "09:12:41" },
      { title: "Location Spoofing", body: "GPS values appear manipulated", level: "High Risk", time: "09:12:42" },
    ],
    decision: "block",
    phoneTitle: "We couldn't verify this",
    phoneBody: "This login has been stopped. Please contact support.",
    takeaway: "Three signals from two different layers converging on the same conclusion.",
  },
  {
    id: "device-compromise",
    label: "Compromised device", strap: "Rooted and tampered application",
    icon: ShieldX,
    narrative: "The device has root access, the application binary has been modified, and runtime methods are being intercepted. Whatever the app reports about itself can no longer be trusted.",
    signals: [
      { rule: "ROOTED", base: 100, add: 0, layer: "device", desc: "Device has root-level access enabled" },
      { rule: "IS_APP_TAMPERED", base: 100, add: 0, layer: "device", desc: "Application has been modified from its original version" },
      { rule: "HOOKING_DETECTED", base: 100, add: 0, layer: "device", desc: "Application methods are being intercepted at runtime" },
    ],
    alerts: [
      { title: "Rooted Device", body: "Root-level access detected on this handset", level: "High Risk", time: "11:48:02" },
      { title: "Application Tampered", body: "Binary does not match the published signature", level: "High Risk", time: "11:48:02" },
      { title: "Runtime Hooking", body: "Method interception detected in the running app", level: "High Risk", time: "11:48:03" },
    ],
    decision: "block",
    phoneTitle: "Access denied",
    phoneBody: "This device doesn't meet our security requirements.",
    takeaway: "Device integrity is a precondition. Nothing downstream is meaningful without it.",
  },
  {
    id: "automation",
    label: "Automated session", strap: "Scripted access, no human signals",
    icon: Bot,
    narrative: "The session reports no click data, the accelerometer has been perfectly still throughout, and the client presents as a headless browser. A human did not do this.",
    signals: [
      { rule: "HEADLESS_BOT_DETECTED", base: 70, add: 0, layer: "device", desc: "Automated activity detected without a visible interface" },
      { rule: "IDLE_SENSOR_ACCELEROMETER", base: 50, add: 0, layer: "behavioural", desc: "Accelerometer shows no movement for an extended period" },
      { rule: "NO_CLICK_DATA", base: 20, add: 10, layer: "behavioural", desc: "No interaction data where activity is expected" },
    ],
    alerts: [
      { title: "Automation Detected", body: "Client presents as a headless browser", level: "High Risk", time: "03:55:17" },
      { title: "No Human Interaction", body: "Session shows no click or motion data", level: "Medium Risk", time: "03:55:17" },
    ],
    decision: "block",
    phoneTitle: "Session blocked",
    phoneBody: "Automated access is not permitted.",
    takeaway: "Behavioural absence is itself a signal. Bots fail by being too clean.",
  },
];

/* ══════════════════ MAIN ══════════════════ */

export default function AdaptiveAuth() {
  // Journey step: 0 sign in · 1 choose session · 2 risk decision
  const [jstep, setJstep] = useState(0);
  const [sc, setSc] = useState<Scenario | null>(null);
  const [layerLit, setLayerLit] = useState(-1);
  const [scored, setScored] = useState(false);
  const [decided, setDecided] = useState(false);
  const timers = useRef<any[]>([]);

  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  useEffect(() => () => clearTimers(), []);

  const clearAssessment = useCallback(() => {
    clearTimers();
    setSc(null); setLayerLit(-1); setScored(false); setDecided(false);
  }, []);

  const run = useCallback((s: Scenario) => {
    clearTimers();
    setSc(s); setJstep(2); setLayerLit(-1); setScored(false); setDecided(false);
    for (let i = 0; i < LAYERS.length; i++) {
      timers.current.push(setTimeout(() => setLayerLit(i), 380 + i * 400));
    }
    timers.current.push(setTimeout(() => setScored(true), 380 + LAYERS.length * 400 + 260));
    timers.current.push(setTimeout(() => setDecided(true), 380 + LAYERS.length * 400 + 900));
  }, []);

  const total = sc ? score(sc.signals) : 0;
  const b = band(total);
  const dec = sc ? DECISION[sc.decision] : null;

  const journeySteps = ["Sign in", "Choose session", "Risk decision"];

  /* ─── Phone screens ─── */
  const Btn: any = { padding: 12, borderRadius: 24, background: T.primary, color: "#fff", textAlign: "center", fontSize: 13, fontWeight: 700, cursor: "pointer", width: "100%" };

  const phone = () => {
    /* Sign in */
    if (jstep === 0)
      return (
        <div style={{ background: "#fff", height: "100%", display: "flex", flexDirection: "column", padding: "22px 18px 14px" }}>
          <h2 style={{ fontSize: 19, fontWeight: 700, color: T.t900, marginBottom: 4 }}>Sign in</h2>
          <p style={{ fontSize: 11.5, color: T.t500, marginBottom: 20 }}>Access your accounts securely</p>
          <label style={{ fontSize: 10, fontWeight: 600, color: T.t700, marginBottom: 5 }}>Customer ID</label>
          <div style={{ padding: "9px 11px", border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 12.5, color: T.t900, marginBottom: 12, background: T.bg }}>••••••2841</div>
          <label style={{ fontSize: 10, fontWeight: 600, color: T.t700, marginBottom: 5 }}>Password</label>
          <div style={{ padding: "9px 11px", border: `1.5px solid ${T.primary}`, borderRadius: 8, fontSize: 12.5, color: T.t900, marginBottom: 16, letterSpacing: 2 }}>••••••••</div>
          <div onClick={() => setJstep(1)} style={Btn}>Login</div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 14, color: T.t400 }}>
            <Lock size={11} /><span style={{ fontSize: 9.5 }}>Session continuously assessed</span>
          </div>
        </div>
      );

    /* Choose session */
    if (jstep === 1)
      return (
        <div style={{ background: "#fff", height: "100%", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "18px 16px 10px", flexShrink: 0 }}>
            <img src="/bureau-logo.png" alt="Bureau" style={{ width: 90, height: "auto", objectFit: "contain", marginBottom: 12 }} />
            <h2 style={{ fontSize: 15.5, fontWeight: 700, color: T.t900, marginBottom: 3 }}>Choose a session</h2>
            <p style={{ fontSize: 10.5, color: T.t500, lineHeight: 1.5 }}>Same login, same customer. Only the context differs — tap one to assess.</p>
          </div>
          <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "2px 14px 14px", display: "flex", flexDirection: "column", gap: 7 }}>
            {SCENARIOS.map((s) => {
              const c = DECISION[s.decision].color;
              return (
                <button key={s.id} onClick={() => run(s)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left", padding: "10px 11px", borderRadius: 11, background: T.white, border: `1px solid ${T.border}`, borderLeft: `3px solid ${c}`, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: DECISION[s.decision].bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <s.icon size={16} color={c} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: T.t900, lineHeight: 1.2 }}>{s.label}</p>
                  </div>
                  <ChevronRight size={15} color={T.t300} style={{ flexShrink: 0 }} />
                </button>
              );
            })}
          </div>
        </div>
      );

    /* Risk decision (customer-facing outcome) */
    if (!sc || !dec) return null;
    return (
      <div style={{ background: "#fff", height: "100%", display: "flex", flexDirection: "column", padding: "22px 18px 14px" }}>
        <img src="/bureau-logo.png" alt="Bureau" style={{ width: 104, height: "auto", objectFit: "contain", marginBottom: 22 }} />
        {!decided ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", border: `2.5px solid ${T.border}`, borderTopColor: T.violet, animation: "spin 0.8s linear infinite" }} />
            <p style={{ fontSize: 12, fontWeight: 600, color: T.t500 }}>Signing you in…</p>
            <p style={{ fontSize: 9.5, color: T.t400, textAlign: "center", maxWidth: 170 }}>The customer sees this. Everything else happens behind it.</p>
          </div>
        ) : (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", animation: "fadeSlideIn 0.4s ease" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, paddingTop: 14 }}>
              <div style={{ width: 54, height: 54, borderRadius: "50%", background: dec.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <dec.icon size={26} color={dec.color} />
              </div>
              <p style={{ fontSize: 15, fontWeight: 700, color: T.t900, textAlign: "center" }}>{sc.phoneTitle}</p>
              <p style={{ fontSize: 11, color: T.t500, textAlign: "center", lineHeight: 1.55, padding: "0 6px" }}>{sc.phoneBody}</p>
            </div>
            {sc.decision === "stepup" && (
              <div style={{ marginTop: 18, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div style={{ width: 62, height: 62, borderRadius: "50%", border: `2px dashed ${T.amber}55`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Fingerprint size={28} color={T.amber} />
                </div>
                <p style={{ fontSize: 10, color: T.amber, fontWeight: 600 }}>Touch to confirm</p>
              </div>
            )}
            {sc.decision === "allow" && (
              <div style={{ marginTop: 20, padding: "10px 12px", borderRadius: 10, background: T.emeraldBg, border: `1px solid ${T.emerald}20`, textAlign: "center" }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: T.emerald }}>No OTP · No challenge · No wait</p>
              </div>
            )}
            <div style={{ flex: 1 }} />
            <p style={{ fontSize: 9, color: T.t400, textAlign: "center" }}>Tap the Bureau mark to see the live assessment →</p>
          </div>
        )}
      </div>
    );
  };

  /* ─── Demo Overview ─── */
  const overview = (
    <div>
      <div style={{ background: T.bg, borderRadius: 12, padding: 16, border: `1px solid ${T.border}`, lineHeight: 1.7, marginBottom: 16 }}>
        <p style={{ fontSize: 12, color: T.t500, marginBottom: 10 }}>
          Static checks like OTPs confirm <strong>possession, not intent</strong>. They can't tell a returning customer from a fraudster holding the same code, and they charge every genuine user the same toll.
        </p>
        <p style={{ fontSize: 12, color: T.t500, marginBottom: 10 }}>
          Bureau scores <strong>every session in real time</strong> across device, behavioural, network and location intelligence, then decides whether to <strong>allow, challenge or block</strong> — continuously, not once at the door.
        </p>
        <p style={{ fontSize: 12, color: T.t500 }}>
          The result is friction where it's earned and none where it isn't. Step-up fires when risk actually rises, so genuine customers pass through untouched.
        </p>
      </div>
      <p style={{ fontSize: 10, fontWeight: 700, color: T.t400, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 8 }}>Four Intelligence Layers</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, columnGap: 12 }}>
        {LAYERS.map((l, i) => (
          <div key={i} style={{ background: T.bg, borderRadius: 8, padding: 12, border: `1px solid ${T.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <l.icon size={14} color={T.violet} />
              <span style={{ fontSize: 11, fontWeight: 600, color: T.t900 }}>{l.label}</span>
            </div>
            <p style={{ fontSize: 10, color: T.t500 }}>{l.blurb}</p>
          </div>
        ))}
      </div>
    </div>
  );

  /* ─── Bureau Intelligence popup: Live Session Assessment ─── */
  const results = (!sc || !dec) ? null : (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
        <Zap size={14} color={T.violet} />
        <span style={{ fontSize: 10, fontWeight: 700, color: T.violet, textTransform: "uppercase", letterSpacing: 1.2 }}>Live Session Assessment</span>
      </div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: T.t900, margin: "0 0 4px" }}>{sc.label}</h2>
      <p style={{ fontSize: 11.5, color: T.t500, marginBottom: 14, lineHeight: 1.6 }}>{sc.narrative}</p>

      {/* Intelligence layers */}
      <p style={{ fontSize: 9, fontWeight: 700, color: T.t400, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 7 }}>Intelligence layers</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 14 }}>
        {LAYERS.map((l, i) => {
          const lit = layerLit >= i;
          const hits = sc.signals.filter((s) => s.layer === l.id);
          const flagged = lit && hits.length > 0;
          return (
            <div key={l.id} style={{ padding: "10px 9px", borderRadius: 9, background: !lit ? "transparent" : flagged ? T.roseBg : T.emeraldBg, border: `1px solid ${!lit ? T.border : flagged ? `${T.rose}25` : `${T.emerald}25`}`, opacity: lit ? 1 : 0.35, transition: "all 0.35s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }}>
                <l.icon size={12} color={!lit ? T.t400 : flagged ? T.rose : T.emerald} />
                <span style={{ fontSize: 10, fontWeight: 700, color: T.t900 }}>{l.label}</span>
              </div>
              <p style={{ fontSize: 9, fontWeight: 600, color: !lit ? T.t400 : flagged ? T.rose : T.emerald }}>
                {!lit ? "…" : flagged ? `${hits.length} flagged` : "Clear"}
              </p>
            </div>
          );
        })}
      </div>

      {/* Fired signals */}
      {scored && (
        <div style={{ animation: "fadeSlideIn 0.35s ease", marginBottom: 14 }}>
          <p style={{ fontSize: 9, fontWeight: 700, color: T.t400, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 7 }}>
            Signals fired · {sc.signals.length}
          </p>
          {sc.signals.length === 0 ? (
            <div style={{ padding: "12px 13px", borderRadius: 9, background: T.emeraldBg, border: `1px solid ${T.emerald}20`, display: "flex", gap: 8, alignItems: "center" }}>
              <CheckCircle size={16} color={T.emerald} />
              <span style={{ fontSize: 11.5, fontWeight: 600, color: T.emerald }}>No rules fired. Every layer returned clear.</span>
            </div>
          ) : (
            sc.signals.map((s) => (
              <div key={s.rule} style={{ display: "flex", gap: 9, padding: "9px 12px", borderRadius: 8, background: T.bg, border: `1px solid ${T.border}`, borderLeft: `3px solid ${T.rose}`, marginBottom: 5 }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 10.5, fontWeight: 700, color: T.t900, fontFamily: T.mono }}>{s.rule}</p>
                  <p style={{ fontSize: 9.5, color: T.t500, marginTop: 1 }}>{s.desc}</p>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: T.rose, fontFamily: T.mono }}>{s.base}</p>
                  {s.add > 0 && <p style={{ fontSize: 8.5, color: T.t400, fontFamily: T.mono }}>+{s.add}</p>}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Score + decision */}
      {decided && (
        <div style={{ animation: "fadeSlideIn 0.4s ease" }}>
          <div style={{ background: T.bg, borderRadius: 12, border: `1px solid ${T.border}`, overflow: "hidden", marginBottom: 12 }}>
            <div style={{ background: T.t900, padding: "9px 13px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <TrendingUp size={13} color={T.violet} />
                <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>Risk Score</span>
              </div>
              <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: b.color, color: "#fff" }}>{b.label}</span>
            </div>
            <div style={{ padding: 13 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 9 }}>
                <span style={{ fontSize: 30, fontWeight: 800, color: b.color, lineHeight: 1 }}>{total}</span>
                <span style={{ fontSize: 13, color: T.t400, fontWeight: 600 }}>/ 100</span>
              </div>
              <div style={{ height: 6, borderRadius: 3, background: T.border, overflow: "hidden", marginBottom: 8 }}>
                <div style={{ height: "100%", width: `${total}%`, background: b.color, borderRadius: 3, transition: "width 0.7s ease" }} />
              </div>
              <p style={{ fontSize: 9.5, color: T.t400, fontFamily: T.mono }}>
                {sc.signals.length === 0 ? "no causes → 0"
                  : sc.signals.length === 1 ? `single cause → base ${sc.signals[0].base}`
                    : `max(base) ${Math.max(...sc.signals.map(s => s.base))} + min(30, Σadd ${sc.signals.reduce((n, s) => n + s.add, 0)}) = ${total}`}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "13px 14px", borderRadius: 11, background: dec.bg, border: `1px solid ${dec.color}25`, marginBottom: 12 }}>
            <dec.icon size={19} color={dec.color} style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: dec.color }}>{dec.label}</p>
              <p style={{ fontSize: 10.5, color: dec.color, opacity: 0.85, marginTop: 2 }}>{dec.sub}</p>
            </div>
          </div>

          {/* Security alerts — the add-on layer */}
          <p style={{ fontSize: 9, fontWeight: 700, color: T.t400, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 7 }}>Security alerts</p>
          <div style={{ marginBottom: 12 }}>
            {sc.alerts.map((a, i) => {
              const c = a.level === "High Risk" ? T.rose : a.level === "Medium Risk" ? T.amber : T.emerald;
              const bgA = a.level === "High Risk" ? T.roseBg : a.level === "Medium Risk" ? T.amberBg : T.emeraldBg;
              return (
                <div key={i} style={{ padding: "10px 12px", borderRadius: 9, background: bgA, border: `1px solid ${c}20`, marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                    {a.level === "Low Risk" ? <CheckCircle size={12} color={c} /> : <AlertTriangle size={12} color={c} />}
                    <span style={{ fontSize: 11.5, fontWeight: 700, color: c }}>{a.title}</span>
                  </div>
                  <p style={{ fontSize: 10, color: c, opacity: 0.85, marginBottom: 5 }}>{a.body}</p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 8.5, fontWeight: 700, padding: "2px 7px", borderRadius: 99, background: `${c}18`, color: c }}>{a.level}</span>
                    <span style={{ fontSize: 8.5, color: c, opacity: 0.7, fontFamily: T.mono }}>{a.time}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ padding: "11px 13px", borderRadius: 9, background: T.violetBg, border: `1px solid ${T.violet}20`, marginBottom: 10 }}>
            <p style={{ fontSize: 11, color: T.violet, fontWeight: 600, lineHeight: 1.6 }}>{sc.takeaway}</p>
          </div>
        </div>
      )}
    </div>
  );

  const onBack = () => {
    if (jstep === 2) { clearAssessment(); setJstep(1); }
    else if (jstep === 1) setJstep(0);
  };
  const onReset = () => { clearAssessment(); setJstep(0); };

  return (
    <>
      <DemoShell
        badge="Adaptive Authentication"
        overviewTitle="Adaptive Authentication"
        overview={overview}
        journeySteps={journeySteps}
        currentStep={jstep}
        phone={phone()}
        results={results}
        hasResults={jstep === 2 && !!sc}
        nextLabel={jstep === 0 ? "Continue" : "Request a Demo"}
        hideNext={jstep === 1 || (jstep === 2 && !decided)}
        nextIsRequestDemo={jstep === 2 && decided}
        onNext={() => { if (jstep === 0) setJstep(1); }}
        onBack={onBack}
        onReset={onReset}
        onStart={onReset}
      />
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}@keyframes fadeSlideIn{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}`}</style>
    </>
  );
}
