"use client";
import { useState, useEffect, useRef } from "react";
import { DemoShell, PhoneFrame } from "@/components/demo-shell";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Shield, ShieldCheck, ShieldAlert, ShieldOff, XCircle, CheckCircle, AlertTriangle, AlertOctagon,
  Smartphone, Monitor, Lock, Unlock, Key, Fingerprint, Eye, EyeOff, Code2, Terminal, Bug,
  Play, Pause, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, ArrowRight, ArrowDownLeft,
  Battery, Bell, Layers, Zap, Cpu, HardDrive, Package,
  Activity, Clock, User, DollarSign, Send, ToggleLeft, ToggleRight, Radio, Info, FileWarning,
  Search, Ghost, Upload, FileArchive, Download, Settings, ChevronsRight, Circle,
  MousePointerClick, Fingerprint as FingerprintIcon, MapPin, Globe, Database, Server, Home,
  ClipboardList, LayoutDashboard, Users, LogOut, TrendingUp, ArrowUpRight, ExternalLink, Loader
} from "lucide-react";

const BUREAU_LOGO = "/bureau-logo.png";

const T = {
  primary: "#253B80", primaryHover: "#1a2d5a", primaryBg: "rgba(37,59,128,0.06)",
  violet: "#7C3AED", violetBg: "rgba(124,58,237,0.1)", violetLight: "#8B5CF6",
  rose: "#E11D48", roseBg: "rgba(225,29,72,0.08)",
  amber: "#D97706", amberBg: "rgba(217,119,6,0.08)",
  emerald: "#059669", emeraldBg: "rgba(5,150,105,0.08)",
  blue: "#2563EB", blueBg: "rgba(37,99,235,0.08)",
  teal: "#0D9488", tealBg: "rgba(13,148,136,0.08)",
  bg: "#f5f7fa", white: "#fff", border: "#e5e7eb", borderLight: "#f3f4f6",
  t900: "#111827", t800: "#1f2937", t700: "#374151", t600: "#4b5563", t500: "#6b7280", t400: "#9ca3af", t300: "#d1d5db", t200: "#e5e7eb",
  terminal: "#0d1117", terminalText: "#c9d1d9", terminalGreen: "#7ee787", terminalRed: "#ff7b72", terminalYellow: "#f2cc60", terminalBlue: "#79c0ff",
  mono: "'JetBrains Mono',ui-monospace,monospace",
  sans: "'DM Sans',ui-sans-serif,system-ui,sans-serif"
};

function detectRegion() {
  try {
    const z = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (/Kolkata|Mumbai|Chennai|Delhi/.test(z)) return "IN";
    if (/Singapore|Kuala_Lumpur|Jakarta|Bangkok|Manila/.test(z)) return "SEA";
    return "US";
  } catch { return "US"; }
}

const RI = {
  US: { flag: "🇺🇸", country: "United States", bank: "First National Bank", user: "James Anderson", balance: "$28,450.12", currency: "$" },
  IN: { flag: "🇮🇳", country: "India", bank: "HDFC Bank", user: "Rajesh Kumar", balance: "₹18,45,320", currency: "₹" },
  SEA: { flag: "🇸🇬", country: "Singapore", bank: "DBS Bank", user: "Wei Lin Tan", balance: "S$32,180.50", currency: "S$" }
};


/* ============ POLICY CATALOG ============ */
// Based on the deck's Policy Control slide
const POLICY_GROUPS = [
  {
    key: "app_integrity",
    title: "App Integrity & Code Protection",
    subtitle: "Application Protection",
    color: T.violet,
    icon: Code2,
    checks: [
      { id: "code_resource", label: "Code & Resource Protection", desc: "Prevents credential harvesting & logic theft", risk: "Hackers can easily read code" },
      { id: "obfuscation", label: "Obfuscation", desc: "String & control-flow obfuscation", risk: "Business logic visible as plaintext" },
      { id: "code_injection", label: "Code Injection Prevention", desc: "Blocks runtime code injection", risk: "External intervention possible" },
      { id: "repackaging", label: "App Repackaging & Tampering Protection", desc: "Signature integrity checks", risk: "APK modification possible" },
      { id: "reverse_eng", label: "Reverse Engineering Protection", desc: "VM-based code protection (industry first)", risk: "Exposure of logic, API keys, IP" }
    ]
  },
  {
    key: "network",
    title: "Network & Data Channel Security",
    subtitle: "Network Protection",
    color: T.blue,
    icon: Globe,
    actionMode: true,
    checks: [
      { id: "vpn", label: "VPN", defaultMode: "Monitor", desc: "Detects VPN/proxy tunneling" },
      { id: "geo_spoofing", label: "Geo Spoofing", defaultMode: "Warning", desc: "GPS manipulation detection" },
      { id: "packet_sniffing", label: "Packet Sniffing", defaultMode: "Warning", desc: "MITM & interception detection" },
      { id: "http_proxy", label: "HTTP Proxy", defaultMode: "Block", desc: "L2 alternate for VPN bypass" }
    ]
  },
  {
    key: "runtime",
    title: "Runtime & Environment Threat Detection",
    subtitle: "Device Protection",
    color: T.rose,
    icon: Cpu,
    actionMode: true,
    checks: [
      { id: "rooted", label: "Rooted", defaultMode: "Monitor", desc: "Detects Magisk & advanced root" },
      { id: "emulator", label: "Emulator", defaultMode: "Monitor", desc: "QEMU/redroid detection" },
      { id: "app_tampering", label: "App Tampering", defaultMode: "Warning", desc: "Runtime binary tamper checks" },
      { id: "app_lib_integrity", label: "App Lib Integrity", defaultMode: "Monitor", desc: "Native library hash validation" },
      { id: "java_debug", label: "Java Debugging", defaultMode: "Warning", desc: "JDWP debugger detection" },
      { id: "memory_scan", label: "Memory Scanning", defaultMode: "Block", desc: "Frida/Xposed detection" },
      { id: "hooking", label: "Hooking", defaultMode: "Warning", desc: "Function hook detection" },
      { id: "screen_sharing", label: "Screen Sharing", defaultMode: "Warning", desc: "Screen recording/sharing" }
    ]
  }
];

const MODES = ["Monitor", "Warning", "Block"];

/* ============ ATTACK STORY ============ */
// Live app scenario — a mule attacker uses a rooted device to try banking fraud
const JOURNEY_STEPS_BAD = [
  { key: "splash", title: "App Launch", duration: 2000 },
  { key: "integrity_check", title: "Runtime Integrity Check", duration: 2500 },
  { key: "login", title: "Login Screen", duration: 2500 },
  { key: "attack_detect", title: "Attack Detected", duration: 3000 },
  { key: "blocked", title: "Session Terminated", duration: 999999 }
];

const JOURNEY_STEPS_GOOD = [
  { key: "splash", title: "App Launch", duration: 2000 },
  { key: "integrity_check", title: "Runtime Integrity Check", duration: 2500 },
  { key: "login", title: "Login Screen", duration: 2500 },
  { key: "auth", title: "Authenticating", duration: 3000 },
  { key: "home", title: "Dashboard", duration: 999999 }
];

const ATTACK_TIMELINE = [
  {
    t: "00:00.142", type: "info", layer: "system",
    txt: "App launch detected — pkg: com.bankco.mobile v3.4.2"
  },
  {
    t: "00:00.287", type: "check", layer: "code",
    txt: "Bureau XVM engine initialized · VM-obfuscated modules loaded"
  },
  {
    t: "00:00.421", type: "check", layer: "code",
    txt: "Code integrity: SIGNED · Hash: 3f:a1:b2:c4:8e:d1 · Match ✓"
  },
  {
    t: "00:00.512", type: "warn", layer: "runtime",
    txt: "⚠ Root indicator: Magisk 27.0 detected (hidden mode)"
  },
  {
    t: "00:00.548", type: "warn", layer: "runtime",
    txt: "⚠ SU binary path found at /system/xbin/su"
  },
  {
    t: "00:00.612", type: "warn", layer: "runtime",
    txt: "⚠ Custom ROM signal: LineageOS 21.0 · SELinux: Permissive"
  },
  {
    t: "00:00.687", type: "check", layer: "network",
    txt: "Network scan · No VPN · IP: 103.212.47.19 (India)"
  },
  {
    t: "00:00.842", type: "warn", layer: "network",
    txt: "⚠ Geo spoofing detected · GPS: San Francisco · IP: India"
  },
  {
    t: "00:01.104", type: "danger", layer: "runtime",
    txt: "🚨 Frida server detected on port 27042"
  },
  {
    t: "00:01.187", type: "danger", layer: "runtime",
    txt: "🚨 27 function hooks injected (target: sendPayment, auth.verify)"
  },
  {
    t: "00:01.245", type: "danger", layer: "runtime",
    txt: "🚨 Memory scan: Frida-agent-64.so mapped into process"
  },
  {
    t: "00:01.312", type: "block", layer: "policy",
    txt: "▶ Policy triggered: Memory Scanning = BLOCK · Terminating session"
  },
  {
    t: "00:01.398", type: "block", layer: "policy",
    txt: "▶ Session sig_a4f8c921 killed · Event logged to Bureau backend"
  },
  {
    t: "00:01.412", type: "success", layer: "system",
    txt: "✓ Attack neutralized — no transaction submitted"
  }
];

/* Good-case timeline: user is on a trusted device, everything passes cleanly */
const GOOD_TIMELINE = [
  { t: "00:00.142", type: "info", layer: "system", txt: "App launch detected — pkg: com.securebank.mobile v3.4.2" },
  { t: "00:00.287", type: "check", layer: "code", txt: "Bureau XVM engine initialized · VM-obfuscated modules loaded" },
  { t: "00:00.421", type: "check", layer: "code", txt: "Code integrity: SIGNED · Hash: 3f:a1:b2:c4:8e:d1 · Match ✓" },
  { t: "00:00.487", type: "check", layer: "code", txt: "App signature verified · Bureau build cert · Valid ✓" },
  { t: "00:00.512", type: "check", layer: "runtime", txt: "Device: OnePlus CPH2649 · Android 16 · Stock ROM ✓" },
  { t: "00:00.548", type: "check", layer: "runtime", txt: "Root check: PASS · No SU binary · No Magisk ✓" },
  { t: "00:00.612", type: "check", layer: "runtime", txt: "SELinux: Enforcing · Play Integrity: DEVICE_INTEGRITY ✓" },
  { t: "00:00.687", type: "check", layer: "network", txt: "Network: WiFi · No VPN · IP: 103.87.12.4 (Mumbai)" },
  { t: "00:00.742", type: "check", layer: "network", txt: "TLS pinning: Valid · Certificate chain verified ✓" },
  { t: "00:00.842", type: "check", layer: "runtime", txt: "GPS matches IP location · No geo spoofing ✓" },
  { t: "00:01.104", type: "check", layer: "runtime", txt: "Memory scan: Clean · No Frida/Xposed/hooks detected ✓" },
  { t: "00:01.187", type: "check", layer: "runtime", txt: "Emulator check: PASS · Real hardware · Sensors active ✓" },
  { t: "00:01.245", type: "check", layer: "runtime", txt: "Screen sharing: None · Accessibility: Normal ✓" },
  { t: "00:01.312", type: "success", layer: "policy", txt: "▶ All policy checks PASSED · Trust score: 98/100" },
  { t: "00:01.398", type: "success", layer: "policy", txt: "▶ Session sig_b8c2f491 issued · User granted access" },
  { t: "00:01.512", type: "success", layer: "system", txt: "✓ Login successful — welcome, " + "User" }
];

/* ============ MAIN ============ */
export default function BureauRASPDemoV2() {
  const isMobile = useIsMobile();
  const [reg] = useState(() => detectRegion());
  const ri = RI[reg] || RI.US;
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [time, setTime] = useState("");
  useEffect(() => { const u = () => setTime(new Date().toLocaleTimeString("en-US", { hour12: false, timeZone: tz })); u(); const iv = setInterval(u, 10000); return () => clearInterval(iv); }, [tz]);

  /* Phase state:
     'upload' | 'configure' | 'build' | 'live' | 'attack'
     Live has its own sub-journey */
  const [phase, setPhase] = useState("upload");
  const [scenario, setScenario] = useState("bad"); // 'good' | 'bad' — for live phase
  const [platform, setPlatform] = useState("android"); // 'android' | 'ios'
  const [project, setProject] = useState("securebank_prod");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [buildProgress, setBuildProgress] = useState(0);
  const [buildLogIdx, setBuildLogIdx] = useState(0);
  const [journeyStep, setJourneyStep] = useState(0); // 0-4
  const [timelineIdx, setTimelineIdx] = useState(0);
  const [expandedTimeline, setExpandedTimeline] = useState(true);

  // Policy checkbox state
  const [enabledChecks, setEnabledChecks] = useState(() => {
    const s = {};
    POLICY_GROUPS.forEach(g => g.checks.forEach(c => { s[c.id] = true; }));
    return s;
  });
  const [modes, setModes] = useState(() => {
    const s = {};
    POLICY_GROUPS.forEach(g => {
      if (g.actionMode) g.checks.forEach(c => { s[c.id] = c.defaultMode || "Monitor"; });
    });
    return s;
  });

  const enabledCount = Object.values(enabledChecks).filter(v => v).length;

  /* -------- Phase 1: Upload animation -------- */
  useEffect(() => {
    if (phase !== "upload") return;
    if (uploadProgress >= 100) return;
    const iv = setInterval(() => {
      setUploadProgress(p => {
        const next = Math.min(100, p + Math.random() * 8 + 3);
        return next;
      });
    }, 180);
    return () => clearInterval(iv);
  }, [phase, uploadProgress]);

  /* -------- Phase 3: Build animation -------- */
  useEffect(() => {
    if (phase !== "build") return;
    if (buildProgress >= 100) return;
    const iv = setInterval(() => {
      setBuildProgress(p => Math.min(100, p + Math.random() * 4 + 2));
    }, 200);
    return () => clearInterval(iv);
  }, [phase, buildProgress]);
  useEffect(() => {
    if (phase !== "build") return;
    const iv = setInterval(() => setBuildLogIdx(i => Math.min(BUILD_LOG.length, i + 1)), 400);
    return () => clearInterval(iv);
  }, [phase]);

  /* -------- Phase 4: Live app journey -------- */
  useEffect(() => {
    if (phase !== "live") return;
    if (journeyStep >= 3) return; // stop at attack detection step; user clicks to continue
    const JOURNEY_STEPS = scenario === "good" ? JOURNEY_STEPS_GOOD : JOURNEY_STEPS_BAD;
    const step = JOURNEY_STEPS[journeyStep];
    const t = setTimeout(() => setJourneyStep(s => s + 1), step.duration);
    return () => clearTimeout(t);
  }, [phase, journeyStep]);

  /* -------- Phase 5: Timeline stream (good or bad) -------- */
  const activeTimeline = scenario === "good" ? GOOD_TIMELINE : ATTACK_TIMELINE;
  useEffect(() => {
    if (phase !== "live" || journeyStep < 3) return;
    if (timelineIdx >= activeTimeline.length) return;
    const t = setTimeout(() => setTimelineIdx(i => i + 1), 220);
    return () => clearTimeout(t);
  }, [phase, journeyStep, timelineIdx, activeTimeline]);
  // when timeline finishes, advance journey to final state
  useEffect(() => {
    if (phase === "live" && timelineIdx >= activeTimeline.length && journeyStep === 3) {
      const t = setTimeout(() => setJourneyStep(4), 600);
      return () => clearTimeout(t);
    }
  }, [phase, timelineIdx, journeyStep, activeTimeline]);

  const goUpload = () => { setPhase("upload"); setUploadProgress(0); setBuildProgress(0); setBuildLogIdx(0); setJourneyStep(0); setTimelineIdx(0); };
  const goConfigure = () => setPhase("configure");
  const goBuild = () => { setPhase("build"); setBuildProgress(0); setBuildLogIdx(0); };
  const goLive = () => { setPhase("live"); setJourneyStep(0); setTimelineIdx(0); };

  const toggleCheck = (id) => setEnabledChecks(s => ({ ...s, [id]: !s[id] }));
  const setMode = (id, m) => setModes(s => ({ ...s, [id]: m }));

  /* ================================================================
     RENDER PIECES
     ================================================================ */

  /* -------- LEFT PANEL: platform dashboard OR live phone -------- */
  const renderLeft = () => {
    if (phase === "live") return renderLivePhone();
    return renderDashboard();
  };

  /* -------- Bureau dashboard (upload / configure / build phases) -------- */
  const renderDashboard = () => (
    <div style={{ width: "100%", height: "100%", maxWidth: "100%", background: T.white, borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column", border: `1px solid ${T.border}`, boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
      {/* Fake browser chrome */}
      <div style={{ padding: "8px 10px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 8, background: T.bg, minWidth: 0 }}>
        <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
          <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#ff5f56" }} />
          <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#ffbd2e" }} />
          <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#27c93f" }} />
        </div>
        <div style={{ flex: 1, minWidth: 0, background: T.white, borderRadius: 6, padding: "3px 8px", fontSize: 9, color: T.t500, fontFamily: T.mono, border: `1px solid ${T.border}`, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>bureau.id/dashboard/build-security</div>
      </div>

      <div style={{ display: "flex", flex: 1, minHeight: 0, minWidth: 0 }}>
        {/* Sidebar */}
        <div style={{ width: isMobile ? 44 : 130, background: "#fafbfc", borderRight: `1px solid ${T.border}`, padding: "10px 0", display: "flex", flexDirection: "column", flexShrink: 0 }}>
          <div style={{ padding: isMobile ? "0 0 10px" : "0 12px 12px", borderBottom: `1px solid ${T.borderLight}`, marginBottom: 8, display: "flex", justifyContent: "center" }}>
            {isMobile ? <span style={{ fontSize: 14, fontWeight: 800, color: T.primary }}>B</span> : <img src={BUREAU_LOGO} alt="Bureau" style={{ height: 18 }} />}
          </div>
          {[
            { i: LayoutDashboard, l: "Dashboard" },
            { i: Smartphone, l: "Devices" },
            { i: Settings, l: "Configuration" },
            { i: Lock, l: "Build Security", active: true },
            { i: Bell, l: "Alerts" },
            { i: Users, l: "User Management" }
          ].map((item, i) => (
            <div key={i} title={item.l} style={{ padding: isMobile ? "8px 0" : "8px 12px", display: "flex", alignItems: "center", justifyContent: isMobile ? "center" : "flex-start", gap: 8, cursor: "pointer", background: item.active ? T.primary : "transparent", color: item.active ? "#fff" : T.t600, fontSize: 11, fontWeight: item.active ? 600 : 500, borderRadius: item.active ? (isMobile ? 6 : "0 6px 6px 0") : 0, margin: item.active ? (isMobile ? "0 6px" : "0 12px 0 0") : 0 }}>
              <item.i size={13} />{!isMobile && item.l}
            </div>
          ))}
          <div style={{ flex: 1 }} />
          <div style={{ padding: isMobile ? "0 6px" : "0 12px" }}>
            <div title="Settings" style={{ padding: "8px 0", display: "flex", alignItems: "center", justifyContent: isMobile ? "center" : "flex-start", gap: 8, fontSize: 11, color: T.t500 }}><Settings size={13} />{!isMobile && "Settings"}</div>
            <div title="Logout" style={{ padding: "8px 0", display: "flex", alignItems: "center", justifyContent: isMobile ? "center" : "flex-start", gap: 8, fontSize: 11, color: T.t500 }}><LogOut size={13} />{!isMobile && "Logout"}</div>
          </div>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, minWidth: 0, overflowX: "hidden", overflowY: "auto", padding: isMobile ? 12 : 16 }}>
          {phase === "upload" && renderUploadForm()}
          {phase === "configure" && renderConfigure()}
          {phase === "build" && renderBuild()}
        </div>
      </div>
    </div>
  );

  /* Phase 1: Upload */
  const renderUploadForm = () => (
    <div>
      <div style={{ marginBottom: 14 }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: T.t900 }}>Upload Your Mobile App</p>
        <p style={{ fontSize: 10, color: T.t500, marginTop: 3 }}>Upload and analyze your mobile app builds for security insights</p>
      </div>

      {/* App Information */}
      <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 8, padding: 12, marginBottom: 12 }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: T.primary, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>App Information</p>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr", gap: 10 }}>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 9, color: T.t500, marginBottom: 3 }}>Application Name</p>
            <p style={{ fontSize: 11, color: T.t900, fontWeight: 600, wordBreak: "break-word" }}>SecureBank Mobile</p>
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 9, color: T.t500, marginBottom: 3 }}>License Key</p>
            <p style={{ fontSize: 11, color: T.t900, fontFamily: T.mono, wordBreak: "break-all" }}>RgKNV12#da</p>
          </div>
          <div style={{ minWidth: 0, gridColumn: isMobile ? "1 / -1" : "auto" }}>
            <p style={{ fontSize: 9, color: T.t500, marginBottom: 3 }}>Package Name</p>
            <p style={{ fontSize: 11, color: T.t900, fontFamily: T.mono, wordBreak: "break-all" }}>com.securebank.mobile</p>
          </div>
        </div>
      </div>

      {/* Platform toggle */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {["android", "ios"].map(p => (
          <div key={p} onClick={() => setPlatform(p)} style={{ flex: 1, padding: "10px 12px", borderRadius: 8, border: `1px solid ${platform === p ? T.primary : T.border}`, background: platform === p ? T.primaryBg : T.white, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 22, height: 22, borderRadius: 5, background: platform === p ? T.primary : T.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Smartphone size={12} color={platform === p ? "#fff" : T.t500} />
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: T.t900 }}>{p === "android" ? "Android" : "iOS"}</p>
              <p style={{ fontSize: 9, color: T.t500 }}>{p === "android" ? "APK / AAB" : "IPA"}</p>
            </div>
            {platform === p && <CheckCircle size={12} color={T.primary} style={{ marginLeft: "auto" }} />}
          </div>
        ))}
      </div>

      {/* File upload */}
      <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 8, padding: 12, marginBottom: 12 }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: T.primary, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>File Upload</p>
        <div style={{ padding: "10px 12px", border: `1px dashed ${T.border}`, borderRadius: 6, background: T.bg, display: "flex", alignItems: "center", gap: 10, marginBottom: 8, minWidth: 0 }}>
          <FileArchive size={20} color={T.primary} style={{ flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: T.t900, wordBreak: "break-all" }}>securebank_v3.4.2_release.apk</p>
            <p style={{ fontSize: 9, color: T.t500 }}>17.4 MB · {platform === "android" ? "APK" : "IPA"} · {uploadProgress >= 100 ? "Ready to build" : `${Math.round(uploadProgress)}% uploaded`}</p>
          </div>
          {uploadProgress >= 100 ? <CheckCircle size={16} color={T.emerald} style={{ flexShrink: 0 }} /> : <Loader size={14} color={T.primary} style={{ animation: "spin 1s linear infinite", flexShrink: 0 }} />}
        </div>
        {/* Progress bar */}
        <div style={{ height: 5, background: T.borderLight, borderRadius: 3, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${uploadProgress}%`, background: `linear-gradient(90deg, ${T.primary}, ${T.violetLight})`, transition: "width 0.2s" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
          <span style={{ fontSize: 9, color: T.t500 }}>{uploadProgress >= 100 ? "Upload complete" : "Uploading..."}</span>
          <span style={{ fontSize: 9, color: T.primary, fontWeight: 600, fontFamily: T.mono }}>{Math.round(uploadProgress)}%</span>
        </div>
      </div>

      {/* Recent uploads table */}
      <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 8, padding: 12, marginBottom: 12 }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: T.primary, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Recent Uploads</p>
        {isMobile ? (
          <div>
            {[
              { name: "onboarding_demo_build.aab", sdk: "35 rdr-r182514", fmt: "APK", status: "Failed", color: T.rose },
              { name: "walletapp_production_build.aab", sdk: "39 rdr-r182080", fmt: "AAB", status: "In Progress", color: T.amber },
              { name: "securechat_beta_1.5.0.aab", sdk: "160 (0.0.8)", fmt: "AAB", status: "Success", color: T.emerald },
              { name: "com.shopsecure.android.3.7.apk", sdk: "39 rdr-r181290", fmt: "APK", status: "In Queue", color: T.t500 }
            ].map((r, i) => (
              <div key={i} style={{ padding: "8px 0", borderBottom: i < 3 ? `1px solid ${T.borderLight}` : "none", minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, minWidth: 0 }}>
                  <span style={{ fontSize: 10, color: T.t700, wordBreak: "break-all", minWidth: 0 }}>{r.name}</span>
                  <span style={{ fontSize: 9, color: r.color, fontWeight: 600, flexShrink: 0, whiteSpace: "nowrap" }}>● {r.status}</span>
                </div>
                <span style={{ fontSize: 9, color: T.t500 }}>{r.fmt} · <span style={{ fontFamily: T.mono }}>{r.sdk}</span></span>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 90px 60px 80px", padding: "6px 8px", background: T.bg, borderRadius: 5, marginBottom: 4 }}>
              {["File Name", "SDK Version", "Format", "Status"].map((h, i) => <span key={i} style={{ fontSize: 9, fontWeight: 700, color: T.t500, textTransform: "uppercase" }}>{h}</span>)}
            </div>
            {[
              { name: "onboarding_demo_build.aab", sdk: "35 rdr-r182514", fmt: "APK", status: "Failed", color: T.rose },
              { name: "walletapp_production_build.aab", sdk: "39 rdr-r182080", fmt: "AAB", status: "In Progress", color: T.amber },
              { name: "securechat_beta_1.5.0.aab", sdk: "160 (0.0.8)", fmt: "AAB", status: "Success", color: T.emerald },
              { name: "com.shopsecure.android.3.7.apk", sdk: "39 rdr-r181290", fmt: "APK", status: "In Queue", color: T.t500 }
            ].map((r, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 90px 60px 80px", padding: "6px 8px", borderBottom: i < 3 ? `1px solid ${T.borderLight}` : "none", fontSize: 10, alignItems: "center" }}>
                <span style={{ color: T.t700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.name}</span>
                <span style={{ color: T.t500, fontFamily: T.mono, fontSize: 9 }}>{r.sdk}</span>
                <span style={{ color: T.t500 }}>{r.fmt}</span>
                <span style={{ color: r.color, fontWeight: 600 }}>● {r.status}</span>
              </div>
            ))}
          </>
        )}
      </div>

      <button
        onClick={goConfigure}
        disabled={uploadProgress < 100}
        style={{
          width: "100%", padding: "10px 12px", borderRadius: 8,
          background: uploadProgress >= 100 ? T.primary : T.t300,
          color: "#fff", border: "none",
          cursor: uploadProgress >= 100 ? "pointer" : "not-allowed",
          fontSize: 12, fontWeight: 700, fontFamily: "inherit",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6
        }}
      >
        Next: Configure Security Policy <ArrowRight size={13} />
      </button>
    </div>
  );

  /* Phase 2: Configure */
  const renderConfigure = () => (
    <div>
      <div style={{ marginBottom: 14, display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3, flexWrap: "wrap" }}>
            <span style={{ fontSize: 10, color: T.t500 }}>Project:</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: T.primary, padding: "2px 8px", borderRadius: 4, background: T.primaryBg, fontFamily: T.mono }}>securebank_prod</span>
            <ChevronDown size={11} color={T.primary} />
          </div>
          <p style={{ fontSize: 14, fontWeight: 700, color: T.t900 }}>Configure Security Policy</p>
          <p style={{ fontSize: 10, color: T.t500, marginTop: 3 }}>Select the protections and enforcement actions for this build · {enabledCount} of 17 enabled</p>
        </div>
        {!isMobile && (
          <button onClick={goBuild} style={{ padding: "8px 14px", borderRadius: 8, background: T.primary, color: "#fff", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, fontFamily: "inherit", display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
            Build Secure App <ChevronsRight size={12} />
          </button>
        )}
      </div>

      {POLICY_GROUPS.map(group => (
        <div key={group.key} style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 8, padding: 12, marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, paddingBottom: 8, borderBottom: `1px solid ${T.borderLight}` }}>
            <div style={{ width: 26, height: 26, borderRadius: 6, background: group.color + "15", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <group.icon size={13} color={group.color} />
            </div>
            <div style={{ flex: 1 }}>
  <p style={{ fontSize: 12, fontWeight: 700, color: T.t900 }}>{group.title}</p>
            </div>
            <span style={{ fontSize: 9, color: T.t500, fontWeight: 600 }}>
              {group.checks.filter(c => enabledChecks[c.id]).length}/{group.checks.length} enabled
            </span>
          </div>

          {group.actionMode ? (
            /* Action mode rows: toggle + Monitor/Warning/Block */
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 6 }}>
              {group.checks.map(c => (
                <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", background: enabledChecks[c.id] ? T.bg : "transparent", borderRadius: 6, opacity: enabledChecks[c.id] ? 1 : 0.55, minWidth: 0, flexWrap: isMobile ? "wrap" : "nowrap" }}>
                  <div onClick={() => toggleCheck(c.id)} style={{ width: 24, height: 14, borderRadius: 7, background: enabledChecks[c.id] ? T.primary : T.t300, position: "relative", cursor: "pointer", flexShrink: 0, transition: "all 0.15s" }}>
                    <div style={{ position: "absolute", top: 1, left: enabledChecks[c.id] ? 12 : 1, width: 12, height: 12, borderRadius: "50%", background: "#fff", transition: "left 0.15s" }} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: T.t900, flex: 1, minWidth: 0 }}>{c.label}</span>
                  {/* Mode toggle */}
                  <div style={{ display: "flex", background: T.white, borderRadius: 5, overflow: "hidden", border: `1px solid ${T.border}`, flexShrink: 0 }}>
                    {MODES.map(m => (
                      <div key={m} onClick={() => enabledChecks[c.id] && setMode(c.id, m)} style={{
                        padding: "3px 7px", fontSize: 9, fontWeight: 600,
                        background: modes[c.id] === m ? T.primary : "transparent",
                        color: modes[c.id] === m ? "#fff" : T.t500,
                        cursor: enabledChecks[c.id] ? "pointer" : "not-allowed",
                        transition: "all 0.1s"
                      }}>{m}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Checkbox mode (App Integrity) */
            <div>
              {group.checks.map(c => (
                <div key={c.id} onClick={() => toggleCheck(c.id)} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "6px 0", cursor: "pointer", borderBottom: `1px solid ${T.borderLight}` }}>
                  <div style={{ width: 14, height: 14, borderRadius: 3, border: `1.5px solid ${enabledChecks[c.id] ? T.primary : T.t300}`, background: enabledChecks[c.id] ? T.primary : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                    {enabledChecks[c.id] && <CheckCircle size={9} color="#fff" strokeWidth={3} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 11, fontWeight: 600, color: T.t900 }}>{c.label}</p>
                    <p style={{ fontSize: 9, color: T.t500, marginTop: 1 }}>{c.desc}</p>
                  </div>
                  {c.risk && !enabledChecks[c.id] && <span style={{ fontSize: 9, color: T.rose, marginTop: 2, flexShrink: 0, whiteSpace: "nowrap" }}>{c.risk}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <button onClick={goBuild} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, background: T.primary, color: "#fff", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 6 }}>
        <Lock size={13} /> Build Secure App with {enabledCount} Protections
      </button>
    </div>
  );

  /* Phase 3: Build */
  const renderBuild = () => (
    <div>
      <p style={{ fontSize: 14, fontWeight: 700, color: T.t900, marginBottom: 3 }}>Building Secure App</p>
      <p style={{ fontSize: 10, color: T.t500, marginBottom: 14 }}>SDK integration in progress · No code changes required</p>

      <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 8, padding: 14, marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, minWidth: 0 }}>
          <FileArchive size={20} color={T.primary} style={{ flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: T.t900, wordBreak: "break-all" }}>securebank_v3.4.2_release.apk</p>
            <p style={{ fontSize: 9, color: T.t500 }}>17.4 MB → 17.9 MB (SDK+VM) · {buildProgress >= 100 ? "Build complete" : `${Math.round(buildProgress)}% built`}</p>
          </div>
          {buildProgress >= 100 ? <CheckCircle size={18} color={T.emerald} style={{ flexShrink: 0 }} /> : <Loader size={16} color={T.primary} style={{ animation: "spin 1s linear infinite", flexShrink: 0 }} />}
        </div>
        <div style={{ height: 6, background: T.borderLight, borderRadius: 3, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${buildProgress}%`, background: `linear-gradient(90deg, ${T.primary}, ${T.violetLight})`, transition: "width 0.2s" }} />
        </div>
      </div>

      {/* Build log */}
      <div style={{ background: T.terminal, borderRadius: 8, padding: 12, marginBottom: 12, maxHeight: 200, overflow: "auto", border: `1px solid #30363d` }}>
        <div style={{ fontFamily: T.mono, fontSize: 10, lineHeight: 1.65 }}>
          {BUILD_LOG.slice(0, buildLogIdx).map((line, i) => (
            <div key={i} style={{ color: line.c === "green" ? T.terminalGreen : line.c === "red" ? T.terminalRed : line.c === "yellow" ? T.terminalYellow : line.c === "blue" ? T.terminalBlue : T.terminalText, whiteSpace: "pre-wrap" }}>
              {line.txt || "\u00A0"}
            </div>
          ))}
          {buildLogIdx < BUILD_LOG.length && <span style={{ color: T.terminalGreen, animation: "blink 1s infinite" }}>▊</span>}
        </div>
      </div>

      {buildProgress >= 100 && (
        <>
          <div style={{ background: T.emeraldBg, border: `1px solid ${T.emerald}30`, borderRadius: 8, padding: 12, marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
            <ShieldCheck size={22} color={T.emerald} />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: T.emerald }}>Secure App Ready</p>
              <p style={{ fontSize: 10, color: T.emerald, opacity: 0.85 }}>{enabledCount} protections active · Build time: 2m 14s · Ready for distribution</p>
            </div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
            <button style={{ flex: "1 1 120px", padding: "10px 12px", borderRadius: 8, background: T.white, color: T.primary, border: `1px solid ${T.primary}`, cursor: "pointer", fontSize: 11, fontWeight: 700, fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
              <Download size={12} /> Download APK
            </button>
            <button onClick={goLive} style={{ flex: "1 1 120px", padding: "10px 12px", borderRadius: 8, background: T.primary, color: "#fff", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
              <Play size={12} /> Launch Live App
            </button>
          </div>
        </>
      )}
    </div>
  );

  /* -------- Phase 4: LIVE APP -------- */
  const renderLivePhone = () => {
    const j = journeyStep;
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "100%", minHeight: 0, width: "100%", overflowY: "auto" }}>
        <div style={{ flexShrink: 0, marginTop: 4, marginBottom: 10, textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: scenario === "good" ? T.emerald : T.rose, padding: "2px 8px", borderRadius: 99, background: scenario === "good" ? T.emeraldBg : T.roseBg, textTransform: "uppercase", letterSpacing: 1, display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: scenario === "good" ? T.emerald : T.rose, animation: "pulseAlert 1.5s infinite" }} />
              LIVE
            </span>
            <span style={{ fontSize: 10, color: T.t500 }}>
              {scenario === "good" ? "Legitimate user · Trusted device" : "Suspicious user · Compromised device"}
            </span>
          </div>
        </div>

        {/* Phone stage — same responsive frame element used in /dashboard/mule */}
        <div style={{ flex: "1 1 auto", minHeight: 0, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          <PhoneFrame maxHeight={760}>{renderPhoneScreen(j)}</PhoneFrame>
        </div>

        {/* Journey navigator */}
        <div style={{ flexShrink: 0, marginTop: 16, display: "flex", gap: 4, alignItems: "center" }}>
          {(scenario === "good" ? JOURNEY_STEPS_GOOD : JOURNEY_STEPS_BAD).map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 18, height: 18, borderRadius: "50%", background: j >= i ? (scenario === "good" ? (i === 4 ? T.emerald : T.primary) : (i === 4 ? T.rose : i === 3 ? T.amber : T.primary)) : T.t300, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "#fff" }}>{j > i ? "✓" : i + 1}</div>
              {i < 4 && <div style={{ width: 20, height: 2, background: j > i ? (scenario === "good" ? T.emerald : T.primary) : T.t300 }} />}
            </div>
          ))}
        </div>
        <p style={{ flexShrink: 0, fontSize: 9, color: T.t500, marginTop: 6, marginBottom: 4 }}>{(scenario === "good" ? JOURNEY_STEPS_GOOD : JOURNEY_STEPS_BAD)[j]?.title}</p>
      </div>
    );
  };

  /* Phone screen states */
  const renderPhoneScreen = (j) => {
    if (j === 0) {
      // Splash
      return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: `linear-gradient(180deg, ${T.primary}, ${T.primaryHover})` }}>
          <div style={{ width: 72, height: 72, borderRadius: 18, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, animation: "scaleIn 0.6s ease" }}>
            <img src={BUREAU_LOGO} alt="Bureau" style={{ height: 40, filter: "brightness(0) invert(1)" }} />
          </div>
          <p style={{ color: "#fff", fontSize: 18, fontWeight: 800 }}>SecureBank</p>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 10, marginTop: 4 }}>Banking · Made Secure</p>
          <div style={{ marginTop: 30, display: "flex", alignItems: "center", gap: 6 }}>
            <Loader size={12} color="rgba(255,255,255,0.7)" style={{ animation: "spin 1s linear infinite" }} />
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 10 }}>Initializing...</p>
          </div>
        </div>
      );
    }

    if (j === 1) {
      // Integrity check
      return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#0d1117" }}>
          <div style={{ padding: "10px 16px", background: "#161b22", borderBottom: `1px solid #30363d`, display: "flex", alignItems: "center", gap: 6 }}>
            <Shield size={13} color={T.violet} />
            <p style={{ color: T.violet, fontSize: 10, fontWeight: 700 }}>RUNTIME INTEGRITY CHECK</p>
          </div>
          <div style={{ flex: 1, padding: 14, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ width: 60, height: 60, borderRadius: "50%", background: T.violetBg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px", animation: "pulseAlert 1.5s infinite" }}>
                <Shield size={26} color={T.violet} />
              </div>
              <p style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>Verifying environment...</p>
            </div>
            {[
              { l: "App signature", ok: true },
              { l: "Code integrity", ok: true },
              { l: "Runtime environment", ok: true },
              { l: "Network security", ok: true }
            ].map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 10px", background: "rgba(255,255,255,0.04)", borderRadius: 5, marginBottom: 4, animation: `fadeInText 0.3s ease ${i * 0.25}s both` }}>
                <CheckCircle size={11} color={T.emerald} />
                <span style={{ fontSize: 10, color: "#c9d1d9", flex: 1 }}>{c.l}</span>
                <span style={{ fontSize: 9, color: T.emerald, fontWeight: 600 }}>PASS</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (j === 2) {
      // Login screen
      return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#fafbfc" }}>
          <div style={{ padding: "14px 16px", background: T.primary }}>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 9 }}>Welcome to</p>
            <p style={{ color: "#fff", fontSize: 16, fontWeight: 800, marginTop: 2 }}>SecureBank</p>
          </div>
          <div style={{ flex: 1, padding: 16 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: T.t900, marginBottom: 4 }}>Sign In</p>
            <p style={{ fontSize: 9, color: T.t500, marginBottom: 14 }}>Enter your credentials to continue</p>

            <div style={{ marginBottom: 10 }}>
              <p style={{ fontSize: 9, fontWeight: 600, color: T.t500, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>User ID</p>
              <div style={{ padding: "8px 10px", background: "#fff", borderRadius: 6, border: `1px solid ${T.border}`, fontSize: 11, color: T.t900, fontFamily: T.mono }}>{ri.user.toLowerCase().replace(" ", ".")}</div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: 9, fontWeight: 600, color: T.t500, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>Password</p>
              <div style={{ padding: "8px 10px", background: "#fff", borderRadius: 6, border: `1px solid ${T.border}`, fontSize: 11, color: T.t900, fontFamily: T.mono, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>••••••••••••</span>
                <Eye size={11} color={T.t400} />
              </div>
            </div>

            <div style={{ padding: 10, background: T.primary, borderRadius: 6, textAlign: "center", marginBottom: 10 }}>
              <p style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>Continue</p>
            </div>

            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 6, padding: "6px 10px", background: T.emeraldBg, borderRadius: 6, border: `1px solid ${T.emerald}20` }}>
              <ShieldCheck size={11} color={T.emerald} />
              <p style={{ fontSize: 9, color: T.emerald, fontWeight: 600 }}>Protected by Bureau RASP</p>
            </div>
          </div>
        </div>
      );
    }

    if (j === 3) {
      // === GOOD CASE: Authenticating ===
      if (scenario === "good") {
        return (
          <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#fafbfc" }}>
            <div style={{ padding: "14px 16px", background: T.primary }}>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 9 }}>Authenticating</p>
              <p style={{ color: "#fff", fontSize: 16, fontWeight: 800, marginTop: 2 }}>SecureBank</p>
            </div>
            <div style={{ flex: 1, padding: 16, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 60, height: 60, borderRadius: "50%", background: T.emeraldBg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, animation: "pulseAlert 1.5s infinite" }}>
                <ShieldCheck size={28} color={T.emerald} />
              </div>
              <p style={{ fontSize: 13, fontWeight: 700, color: T.t900, marginBottom: 4 }}>Verifying your identity</p>
              <p style={{ fontSize: 10, color: T.t500, textAlign: "center", marginBottom: 14 }}>All security checks passed. Signing you in securely...</p>
              <div style={{ width: "100%" }}>
                {[
                  { l: "Device verified", ok: true },
                  { l: "Location matched", ok: true },
                  { l: "Runtime clean", ok: true },
                  { l: "Session established", ok: true }
                ].map((c, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 10px", background: T.emeraldBg, borderRadius: 5, marginBottom: 4, animation: `fadeInText 0.3s ease ${i * 0.3}s both`, border: `1px solid ${T.emerald}20` }}>
                    <CheckCircle size={11} color={T.emerald} />
                    <span style={{ fontSize: 10, color: T.t900, flex: 1, fontWeight: 500 }}>{c.l}</span>
                    <span style={{ fontSize: 9, color: T.emerald, fontWeight: 700 }}>PASS</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }
      // === BAD CASE: Attack detected — device compromised ===
      return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#0d1117" }}>
          <div style={{ padding: "10px 16px", background: T.rose, display: "flex", alignItems: "center", gap: 6 }}>
            <AlertOctagon size={13} color="#fff" />
            <p style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>THREAT DETECTED</p>
          </div>
          <div style={{ flex: 1, padding: 14, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <div style={{ width: 62, height: 62, borderRadius: "50%", background: "rgba(225,29,72,0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12, animation: "pulseAlert 1s infinite" }}>
              <Bug size={28} color={T.rose} />
            </div>
            <p style={{ color: "#fff", fontSize: 13, fontWeight: 700, textAlign: "center", marginBottom: 4 }}>Bureau RASP scanning...</p>
            <p style={{ color: "#8b949e", fontSize: 10, textAlign: "center", marginBottom: 14 }}>Suspicious runtime behavior detected</p>

            <div style={{ width: "100%", padding: "8px 10px", background: "rgba(217,119,6,0.1)", border: `1px solid ${T.amber}30`, borderRadius: 6, marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
              <AlertTriangle size={11} color={T.amber} />
              <span style={{ fontSize: 9, color: T.amber }}>Root detected · Magisk 27.0</span>
            </div>
            <div style={{ width: "100%", padding: "8px 10px", background: "rgba(217,119,6,0.1)", border: `1px solid ${T.amber}30`, borderRadius: 6, marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
              <AlertTriangle size={11} color={T.amber} />
              <span style={{ fontSize: 9, color: T.amber }}>Geo spoofing · IP ≠ GPS</span>
            </div>
            <div style={{ width: "100%", padding: "8px 10px", background: "rgba(225,29,72,0.15)", border: `1px solid ${T.rose}40`, borderRadius: 6, display: "flex", alignItems: "center", gap: 6 }}>
              <AlertOctagon size={11} color={T.rose} />
              <span style={{ fontSize: 9, color: T.rose, fontWeight: 600 }}>Frida hooks detected · 27 injections</span>
            </div>
          </div>
        </div>
      );
    }

    // === GOOD CASE step 4: Successful home / dashboard ===
    if (scenario === "good") {
      return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#fafbfc" }}>
          <div style={{ padding: "12px 16px", background: T.primary, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 9 }}>Welcome back</p>
              <p style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>{ri.user}</p>
            </div>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ShieldCheck size={15} color="#fff" />
            </div>
          </div>
          <div style={{ padding: "12px 14px", background: T.primary }}>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 9 }}>Available Balance</p>
            <p style={{ color: "#fff", fontSize: 20, fontWeight: 800, marginTop: 2 }}>{ri.balance}</p>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 8, marginTop: 2 }}>Account •••• 4821</p>
          </div>
          <div style={{ flex: 1, padding: 12, background: "#fff", borderRadius: "16px 16px 0 0", marginTop: -8, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 6, marginBottom: 12 }}>
              {[{ i: Send, l: "Send" }, { i: ArrowDownLeft, l: "Receive" }, { i: DollarSign, l: "Pay" }, { i: Radio, l: "More" }].map((a, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: T.primaryBg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 4px" }}><a.i size={14} color={T.primary} /></div>
                  <p style={{ fontSize: 8, color: T.t700 }}>{a.l}</p>
                </div>
              ))}
            </div>
            <div style={{ padding: "8px 10px", background: T.emeraldBg, borderRadius: 6, display: "flex", alignItems: "center", gap: 6, marginBottom: 10, border: `1px solid ${T.emerald}20` }}>
              <ShieldCheck size={13} color={T.emerald} />
              <div>
                <p style={{ fontSize: 9, fontWeight: 700, color: T.emerald }}>Protected by Bureau RASP</p>
                <p style={{ fontSize: 8, color: T.emerald, opacity: 0.8 }}>All systems normal · Trust score 98/100</p>
              </div>
            </div>
            <p style={{ fontSize: 8, fontWeight: 700, color: T.t400, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Recent Activity</p>
            {[{ n: "Amazon", a: "-$67.99", t: "Today, 2:14 PM" }, { n: "Salary", a: `+${ri.currency}5,200`, t: "Yesterday" }, { n: "Netflix", a: "-$14.99", t: "Apr 20" }].map((tx, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: i < 2 ? `1px solid ${T.borderLight}` : "none" }}>
                <div><p style={{ fontSize: 9, fontWeight: 600 }}>{tx.n}</p><p style={{ fontSize: 7, color: T.t400 }}>{tx.t}</p></div>
                <p style={{ fontSize: 9, fontWeight: 700, color: tx.a.startsWith("+") ? T.emerald : T.t900 }}>{tx.a}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }
    // === BAD CASE step 4: Blocked ===
    return (
      <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#0d1117" }}>
        <div style={{ padding: "10px 16px", background: T.rose, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <ShieldOff size={13} color="#fff" />
            <p style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>SESSION BLOCKED</p>
          </div>
          <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 9 }}>Bureau RASP</span>
        </div>
        <div style={{ flex: 1, padding: 14, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(225,29,72,0.12)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, animation: "scaleIn 0.5s ease" }}>
            <ShieldOff size={34} color={T.rose} />
          </div>
          <p style={{ color: "#fff", fontSize: 14, fontWeight: 800, marginBottom: 4 }}>Access Denied</p>
          <p style={{ color: "#8b949e", fontSize: 10, marginBottom: 12, maxWidth: 200 }}>Your device does not meet security requirements. This session has been terminated.</p>
          <div style={{ width: "100%", padding: "8px 10px", background: "rgba(225,29,72,0.1)", borderRadius: 6, border: `1px solid ${T.rose}30`, marginBottom: 6 }}>
            <p style={{ fontSize: 9, color: "#8b949e", marginBottom: 2 }}>Reason</p>
            <p style={{ fontSize: 10, color: "#fff", fontWeight: 600 }}>Runtime hooking detected (policy: BLOCK)</p>
          </div>
          <div style={{ width: "100%", padding: "8px 10px", background: "rgba(37,59,128,0.15)", borderRadius: 6, border: `1px solid ${T.primary}40` }}>
            <p style={{ fontSize: 9, color: "#8b949e", marginBottom: 2 }}>Session</p>
            <p style={{ fontSize: 10, color: "#79c0ff", fontFamily: T.mono }}>sig_a4f8c921 · terminated</p>
          </div>
        </div>
        <div style={{ padding: "8px 14px", background: "#161b22", borderTop: `1px solid #30363d`, textAlign: "center" }}>
          <p style={{ fontSize: 8, color: T.emerald, fontWeight: 700 }}>◉ Event logged to Bureau backend · Analytics updated</p>
        </div>
      </div>
    );
  };

  /* ================================================================
     RIGHT PANEL
     ================================================================ */
  const renderRight = () => {
    if (phase === "upload") return renderRightOverview();
    if (phase === "configure") return renderRightConfigure();
    if (phase === "build") return renderRightBuild();
    if (phase === "live") return renderRightLive();
    return null;
  };

  const renderRightOverview = () => (
    <div>
          {/* Value stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
        {[
          { v: "<200ms", l: "Response time", c: T.primary },
          { v: "<5%", l: "Load impact", c: T.emerald },
          { v: "<2 min", l: "Integration time", c: T.violet },
          { v: "Zero", l: "Code changes", c: T.blue }
        ].map((s, i) => (
          <div key={i} style={{ background: T.white, borderRadius: 8, padding: 10, border: `1px solid ${T.border}` }}>
            <p style={{ fontSize: 16, fontWeight: 800, color: s.c }}>{s.v}</p>
            <p style={{ fontSize: 9, color: T.t500, marginTop: 2 }}>{s.l}</p>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 10, fontWeight: 700, color: T.t400, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 8 }}>Zero Trust Framework · 4 Layers</p>
      <div style={{ marginBottom: 14 }}>
        {[
          { i: Code2, c: T.violet, l: "App Integrity & Code Protection", d: "Blocks tampering, logic theft, exploit patching" },
          { i: Cpu, c: T.rose, l: "Runtime & Environment Threat Detection", d: "Confirms trusted device, runtime & location" },
          { i: Globe, c: T.blue, l: "Network & Data Channel Protection", d: "Blocks interception, sniffing, session hijack" },
          { i: LayoutDashboard, c: T.emerald, l: "Visibility & Policy Control", d: "Core enforcement layer for threat response" }
        ].map((layer, i) => (
          <div key={i} style={{ background: T.white, borderRadius: 8, padding: 10, marginBottom: 5, border: `1px solid ${T.border}`, display: "flex", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 7, background: layer.c + "15", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <layer.i size={15} color={layer.c} />
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: T.t900 }}>{layer.l}</p>
              <p style={{ fontSize: 10, color: T.t500, marginTop: 2 }}>{layer.d}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: 12, background: T.violet + "0d", borderRadius: 10, border: `1px solid ${T.violet}30`, marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
          <Zap size={13} color={T.violet} />
          <span style={{ fontSize: 11, fontWeight: 700, color: T.violet }}>XVM: Industry-First Virtualized Runtime Engine</span>
        </div>
        <p style={{ fontSize: 11, color: T.t700, lineHeight: 1.5 }}>Decompilers like Ghidra crash on protected logic - the app runs normally.</p>
      </div>

    </div>
  );

  const renderRightConfigure = () => (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
        <Settings size={14} color={T.violet} />
        <span style={{ fontSize: 10, fontWeight: 700, color: T.violet, textTransform: "uppercase", letterSpacing: 1.2 }}>Policy Configuration</span>
      </div>
      <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 4px" }}>Enforcement Modes</h2>
      <p style={{ fontSize: 11, color: T.t500, marginBottom: 14 }}>Configure how Bureau RASP responds when each threat is detected. Modes convert detection into real prevention instead of passive alerts.</p>

      {/* Mode explainer */}
      <div style={{ marginBottom: 14 }}>
        {[
          { m: "Monitor", c: T.blue, d: "Detect and log · No user impact · Ideal for baseline discovery", ic: Eye },
          { m: "Warning", c: T.amber, d: "Detect, log, and warn user · Allow session to continue with reduced trust", ic: AlertTriangle },
          { m: "Block", c: T.rose, d: "Detect, log, and terminate the session immediately · Highest enforcement", ic: ShieldOff }
        ].map((mode, i) => (
          <div key={i} style={{ background: T.white, borderRadius: 8, padding: 10, marginBottom: 5, border: `1px solid ${T.border}`, display: "flex", gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 6, background: mode.c + "15", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <mode.ic size={14} color={mode.c} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: mode.c }}>{mode.m}</p>
              <p style={{ fontSize: 10, color: T.t500, marginTop: 2, lineHeight: 1.4 }}>{mode.d}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: 12, background: T.primaryBg, borderRadius: 10, border: `1px solid ${T.primary}20`, marginBottom: 10 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: T.primary, marginBottom: 6 }}>Recommended Baseline</p>
        <p style={{ fontSize: 10, color: T.t700, lineHeight: 1.5, marginBottom: 6 }}>For a banking app in production:</p>
        <div style={{ fontSize: 10, color: T.t700, lineHeight: 1.7 }}>
          <div>• App Integrity → <strong style={{ color: T.rose }}>Block</strong> (all)</div>
          <div>• Rooted / Emulator → <strong style={{ color: T.amber }}>Warning</strong></div>
          <div>• Frida / Memory Scan → <strong style={{ color: T.rose }}>Block</strong></div>
          <div>• Geo Spoofing → <strong style={{ color: T.amber }}>Warning</strong></div>
          <div>• VPN → <strong style={{ color: T.blue }}>Monitor</strong></div>
        </div>
      </div>

      {/* Enabled summary */}
      <div style={{ background: T.white, borderRadius: 10, padding: 12, border: `1px solid ${T.border}` }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: T.t900, marginBottom: 8 }}>Current Configuration</p>
        {POLICY_GROUPS.map(g => {
          const enabled = g.checks.filter(c => enabledChecks[c.id]).length;
          return (
            <div key={g.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", borderBottom: `1px solid ${T.borderLight}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: g.color }} />
                <span style={{ fontSize: 10, color: T.t700 }}>{g.title}</span>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, color: g.color, fontFamily: T.mono }}>{enabled}/{g.checks.length}</span>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderRightBuild = () => (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
        <Lock size={14} color={T.primary} />
        <span style={{ fontSize: 10, fontWeight: 700, color: T.primary, textTransform: "uppercase", letterSpacing: 1.2 }}>Build Pipeline</span>
      </div>
      <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 4px" }}>Injecting Bureau RASP SDK</h2>
      <p style={{ fontSize: 11, color: T.t500, marginBottom: 14 }}>Bureau's build engine is instrumenting your APK with the configured protections. No developer effort required.</p>

      <p style={{ fontSize: 10, fontWeight: 700, color: T.t400, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 8 }}>What's Being Added</p>
      {[
        { i: Code2, c: T.violet, l: "Bureau XVM Runtime", d: "Virtualized instruction engine · +180 KB", status: buildProgress > 20 ? "done" : "pending" },
        { i: Shield, c: T.rose, l: "Runtime Introspection Engine", d: "Continuous device/env scanning", status: buildProgress > 40 ? "done" : "pending" },
        { i: Globe, c: T.blue, l: "Network Protection Layer", d: "TLS pinning + VPN detection", status: buildProgress > 60 ? "done" : "pending" },
        { i: LayoutDashboard, c: T.emerald, l: "Policy Engine", d: `${enabledCount} rules baked in`, status: buildProgress > 80 ? "done" : "pending" },
        { i: Package, c: T.primary, l: "Re-package & Sign", d: "Bureau-signed release artifact", status: buildProgress >= 100 ? "done" : "pending" }
      ].map((step, i) => (
        <div key={i} style={{ background: T.white, borderRadius: 8, padding: 10, marginBottom: 5, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 6, background: step.c + "15", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <step.i size={14} color={step.c} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: T.t900 }}>{step.l}</p>
            <p style={{ fontSize: 9, color: T.t500 }}>{step.d}</p>
          </div>
          {step.status === "done" ? <CheckCircle size={14} color={T.emerald} /> : <Loader size={13} color={T.t400} style={{ animation: "spin 1s linear infinite" }} />}
        </div>
      ))}

      <div style={{ padding: 12, background: T.emeraldBg, borderRadius: 10, border: `1px solid ${T.emerald}30`, marginTop: 10 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: T.emerald, marginBottom: 4 }}>No Code Changes Required</p>
        <p style={{ fontSize: 10, color: T.emerald, opacity: 0.85 }}>Bureau's build engine injects protections at the binary level. Developer effort: zero. Integration time: under 2 minutes. Ready to publish to Play Store / App Store or ship to your CI/CD.</p>
      </div>
    </div>
  );

  /* Phase 4 right panel — live threat analytics */
  const renderRightLive = () => {
    const isBad = scenario === "bad";
    const timeline = isBad ? ATTACK_TIMELINE : GOOD_TIMELINE;
    const streamed = timeline.slice(0, timelineIdx);
    const warns = isBad ? streamed.filter(l => l.type === "warn").length : 0;
    const dangers = isBad ? streamed.filter(l => l.type === "danger").length : 0;
    const blocks = isBad ? streamed.filter(l => l.type === "block").length : 0;
    const passes = !isBad ? streamed.filter(l => l.type === "check" || l.type === "success").length : 0;
    const accentColor = isBad ? T.rose : T.emerald;
    const sessionId = isBad ? "sig_a4f8c921" : "sig_b8c2f491";

    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Activity size={14} color={accentColor} />
            <span style={{ fontSize: 10, fontWeight: 700, color: accentColor, textTransform: "uppercase", letterSpacing: 1.2 }}>Realtime Threat Analytics</span>
          </div>
          <span style={{ fontSize: 9, color: T.t400, fontFamily: T.mono }}>{ri.flag} {time}</span>
        </div>
        <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 12px" }}>Live Session · {sessionId}</h2>

        {/* Top metrics */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 6, marginBottom: 12 }}>
          {[
            { l: "Total Sessions", v: "46M", c: T.primary, icon: Users },
            { l: "Total Devices", v: "1.4M", c: T.blue, icon: Smartphone, sub: "Android 96.8% · iOS 3.2%" },
            { l: "Risky Devices", v: "41k", c: T.amber, icon: AlertTriangle, sub: "Warning 2.5% · Blocked 1.2%" },
            isBad
              ? { l: "Threats This Session", v: journeyStep >= 3 ? warns + dangers : "0", c: T.rose, icon: Bug }
              : { l: "Trust Score", v: journeyStep >= 3 ? "98/100" : "—", c: T.emerald, icon: ShieldCheck, sub: "Clean device · No threats" }
          ].map((m, i) => (
            <div key={i} style={{ background: T.white, borderRadius: 8, padding: 10, border: `1px solid ${T.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
                <m.icon size={11} color={m.c} />
                <p style={{ fontSize: 9, color: T.t500, fontWeight: 600 }}>{m.l}</p>
              </div>
              <p style={{ fontSize: 15, fontWeight: 800, color: m.c }}>{m.v}</p>
              {m.sub && <p style={{ fontSize: 8, color: T.t400, marginTop: 2 }}>{m.sub}</p>}
            </div>
          ))}
        </div>

        {/* Current session details */}
        <div style={{ background: T.white, borderRadius: 10, padding: 12, border: `1px solid ${T.border}`, marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: T.t900 }}>Session Threat Assessment</p>
            <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: (isBad && journeyStep >= 3) ? T.roseBg : T.emeraldBg, color: (isBad && journeyStep >= 3) ? T.rose : T.emerald }}>
              {isBad ? (journeyStep >= 3 ? "COMPROMISED" : "MONITORING") : (journeyStep >= 3 ? "TRUSTED" : "MONITORING")}
            </span>
          </div>

          {/* Device details */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10, paddingBottom: 10, borderBottom: `1px solid ${T.borderLight}` }}>
            {[
              { l: "Device Brand", v: "OnePlus" },
              { l: "Device Model", v: "CPH2649" },
              { l: "OS Version", v: "Android 16" },
              { l: "SDK Version", v: "1.39.5" },
              { l: "IdentX ID", v: "019cb1aa-9906-...", mono: true },
              { l: "Last Seen", v: "just now" }
            ].map((f, i) => (
              <div key={i}>
                <p style={{ fontSize: 9, color: T.t500 }}>{f.l}</p>
                <p style={{ fontSize: 10, fontWeight: 600, color: T.t900, fontFamily: f.mono ? T.mono : "inherit" }}>{f.v}</p>
              </div>
            ))}
          </div>

          {/* Threat categories with counts */}
          <p style={{ fontSize: 10, fontWeight: 700, color: T.t500, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Threat Categorization</p>
          <div style={{ maxHeight: 140, overflow: "auto" }}>
            {(isBad ? [
              { cat: "Rooted", inc: journeyStep >= 3 ? 1 : 0, warn: journeyStep >= 3 ? 1 : 0, blk: 0, c: T.violet },
              { cat: "Frida Hooking", inc: journeyStep >= 3 && timelineIdx > 8 ? 27 : 0, warn: 0, blk: journeyStep >= 3 && timelineIdx > 11 ? 1 : 0, c: T.rose },
              { cat: "Memory Scanning", inc: journeyStep >= 3 && timelineIdx > 10 ? 1 : 0, warn: 0, blk: journeyStep >= 3 && timelineIdx > 11 ? 1 : 0, c: T.rose },
              { cat: "Geo Spoofing", inc: journeyStep >= 3 && timelineIdx > 7 ? 1 : 0, warn: journeyStep >= 3 && timelineIdx > 7 ? 1 : 0, blk: 0, c: T.amber },
              { cat: "USB Debugging", inc: 5, warn: 1, blk: 4, c: T.amber },
              { cat: "Emulator", inc: 4, warn: 0, blk: 4, c: T.amber },
              { cat: "App Tampering", inc: 0, warn: 0, blk: 0, c: T.t400 },
              { cat: "App Cloned", inc: 0, warn: 0, blk: 0, c: T.t400 },
              { cat: "Jail Broken", inc: 0, warn: 0, blk: 0, c: T.t400 },
              { cat: "Screen Sharing", inc: 0, warn: 0, blk: 0, c: T.t400 }
            ] : [
              { cat: "Rooted", inc: 0, warn: 0, blk: 0, c: T.t400 },
              { cat: "Frida Hooking", inc: 0, warn: 0, blk: 0, c: T.t400 },
              { cat: "Memory Scanning", inc: 0, warn: 0, blk: 0, c: T.t400 },
              { cat: "Geo Spoofing", inc: 0, warn: 0, blk: 0, c: T.t400 },
              { cat: "USB Debugging", inc: 0, warn: 0, blk: 0, c: T.t400 },
              { cat: "Emulator", inc: 0, warn: 0, blk: 0, c: T.t400 },
              { cat: "App Tampering", inc: 0, warn: 0, blk: 0, c: T.t400 },
              { cat: "App Cloned", inc: 0, warn: 0, blk: 0, c: T.t400 },
              { cat: "Jail Broken", inc: 0, warn: 0, blk: 0, c: T.t400 },
              { cat: "Screen Sharing", inc: 0, warn: 0, blk: 0, c: T.t400 }
            ]).map((t, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 40px 50px 50px", padding: "4px 0", fontSize: 10, alignItems: "center", borderBottom: i < 9 ? `1px solid ${T.borderLight}` : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: t.c }} />
                  <span style={{ color: T.t700 }}>{t.cat}</span>
                </div>
                <span style={{ color: t.inc > 0 ? T.t900 : T.t400, fontFamily: T.mono, fontSize: 10 }}>{t.inc}</span>
                <span style={{ color: t.warn > 0 ? T.amber : T.t400, fontFamily: T.mono, fontSize: 10, fontWeight: t.warn > 0 ? 600 : 400 }}>W {t.warn}</span>
                <span style={{ color: t.blk > 0 ? T.rose : T.t400, fontFamily: T.mono, fontSize: 10, fontWeight: t.blk > 0 ? 600 : 400 }}>B {t.blk}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Live event stream */}
        <div style={{ background: T.white, borderRadius: 10, border: `1px solid ${T.border}`, overflow: "hidden" }}>
          <div onClick={() => setExpandedTimeline(!expandedTimeline)} style={{ padding: "10px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", borderBottom: expandedTimeline ? `1px solid ${T.borderLight}` : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Terminal size={13} color={T.primary} />
              <p style={{ fontSize: 11, fontWeight: 700, color: T.t900 }}>Live Event Stream</p>
              {journeyStep >= 3 && <span style={{ fontSize: 8, fontWeight: 700, padding: "1px 6px", borderRadius: 99, background: accentColor, color: "#fff", animation: "pulseAlert 1s infinite" }}>LIVE</span>}
            </div>
            <span style={{ fontSize: 9, color: T.t500, fontFamily: T.mono }}>{streamed.length} events</span>
          </div>
          {expandedTimeline && (
            <div style={{ background: T.terminal, padding: 10, maxHeight: 240, overflow: "auto", fontFamily: T.mono, fontSize: 9, lineHeight: 1.6 }}>
              {streamed.length === 0 ? (
                <p style={{ color: "#8b949e", fontStyle: "italic" }}>Waiting for events...</p>
              ) : streamed.map((line, i) => {
                const c = line.type === "success" ? T.terminalGreen :
                          line.type === "danger" ? T.terminalRed :
                          line.type === "warn" ? T.terminalYellow :
                          line.type === "block" ? "#ff7b72" :
                          line.type === "check" ? T.terminalBlue :
                          T.terminalText;
                return (
                  <div key={i} style={{ display: "flex", gap: 6, animation: `fadeInText 0.2s ease` }}>
                    <span style={{ color: "#6e7681", flexShrink: 0 }}>{line.t}</span>
                    <span style={{ color: c, wordBreak: "break-word" }}>{line.txt}</span>
                  </div>
                );
              })}
              {timelineIdx < timeline.length && journeyStep >= 3 && (
                <span style={{ color: T.terminalGreen, animation: "blink 1s infinite" }}>▊</span>
              )}
            </div>
          )}
        </div>

        {/* Final outcome — differs by scenario */}
        {journeyStep >= 4 && (
          isBad ? (
            <div style={{ background: T.roseBg, borderRadius: 10, padding: 12, border: `1px solid ${T.rose}30`, marginTop: 10, display: "flex", gap: 10, animation: "fadeInText 0.4s ease" }}>
              <ShieldOff size={22} color={T.rose} />
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: T.rose }}>Session Terminated</p>
                <p style={{ fontSize: 10, color: T.t700, marginTop: 3, lineHeight: 1.4 }}>Bureau RASP blocked the attack in <strong style={{ color: T.rose, fontFamily: T.mono }}>1.412 seconds</strong> from app launch. No transaction was submitted. Full audit trail logged with device attributes, session context, and enforcement decision.</p>
              </div>
            </div>
          ) : (
            <div style={{ background: T.emeraldBg, borderRadius: 10, padding: 12, border: `1px solid ${T.emerald}30`, marginTop: 10, display: "flex", gap: 10, animation: "fadeInText 0.4s ease" }}>
              <ShieldCheck size={22} color={T.emerald} />
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: T.emerald }}>Session Trusted</p>
                <p style={{ fontSize: 10, color: T.t700, marginTop: 3, lineHeight: 1.4 }}>All security checks passed in <strong style={{ color: T.emerald, fontFamily: T.mono }}>1.512 seconds</strong>. User granted access with a trust score of <strong>98/100</strong>. Legitimate user experience is seamless — RASP runs silently in the background with no friction. This is the 96.8% of your traffic that should never notice you exist.</p>
              </div>
            </div>
          )
        )}
      </div>
    );
  };

  /* ================================================================
     LAYOUT
     ================================================================ */
  const phaseLabels = {
    upload: "1. Upload App",
    configure: "2. Configure Policy",
    build: "3. Build Secure App",
    live: "4. Live Runtime Protection"
  };

  const phaseOrder = ["upload", "configure", "build", "live"];
  const currentStep = Math.max(phaseOrder.indexOf(phase), 0);
  const atEnd = phase === "live";
  const journeyLabels = ["Upload", "Configure", "Build", "Live"];

  const goNext = () => {
    if (phase === "upload") goConfigure();
    else if (phase === "configure") goBuild();
    else if (phase === "build") goLive();
  };
  const goBackPhase = () => {
    if (phase === "configure") goUpload();
    else if (phase === "build") goConfigure();
    else if (phase === "live") goBuild();
  };
  const toggleScenario = () => {
    const ns = scenario === "good" ? "bad" : "good";
    setScenario(ns);
    if (phase === "live") { setJourneyStep(0); setTimelineIdx(0); }
  };

  /* Compact Bureau summary rendered inline beneath the dashboard stage */
  const inlineBureau = (() => {
    if (phase === "configure") {
      return (
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, color: T.violet, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 8 }}>Policy Summary</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {POLICY_GROUPS.map(g => {
              const enabled = g.checks.filter(c => enabledChecks[c.id]).length;
              return (
                <div key={g.key} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 10px", borderRadius: 99, background: T.bg, border: `1px solid ${T.border}` }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: g.color }} />
                  <span style={{ fontSize: 10, color: T.t700 }}>{g.title}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: g.color, fontFamily: T.mono }}>{enabled}/{g.checks.length}</span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    if (phase === "build") {
      return (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: T.primary, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 4 }}>Build Pipeline</p>
            <p style={{ fontSize: 11, color: T.t600 }}>{buildProgress >= 100 ? `${enabledCount} protections baked in · Ready to publish` : `Injecting Bureau RASP SDK… ${Math.round(buildProgress)}%`}</p>
          </div>
          <span style={{ fontSize: 9, fontWeight: 700, padding: "3px 10px", borderRadius: 99, background: buildProgress >= 100 ? T.emeraldBg : T.primaryBg, color: buildProgress >= 100 ? T.emerald : T.primary }}>{buildProgress >= 100 ? "COMPLETE" : "BUILDING"}</span>
        </div>
      );
    }
    if (phase === "live") {
      const isBad = scenario === "bad";
      const status = isBad ? (journeyStep >= 3 ? "COMPROMISED" : "MONITORING") : (journeyStep >= 3 ? "TRUSTED" : "MONITORING");
      const statusBad = isBad && journeyStep >= 3;
      return (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: isBad ? T.rose : T.emerald, textTransform: "uppercase", letterSpacing: 1.2 }}>Session Assessment</p>
            <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: statusBad ? T.roseBg : T.emeraldBg, color: statusBad ? T.rose : T.emerald }}>{status}</span>
          </div>
          <p style={{ fontSize: 11, color: T.t700, lineHeight: 1.5 }}>
            {journeyStep >= 4
              ? (isBad ? "Session terminated — Bureau RASP blocked the attack in 1.412s. Tap Bureau Intelligence for the full threat breakdown." : "Session trusted — trust score 98/100 in 1.512s. Tap Bureau Intelligence for the full analytics.")
              : (isBad ? "Suspicious device detected. RASP is scanning the runtime for threats…" : "Clean device. RASP is verifying the runtime silently…")}
          </p>
        </div>
      );
    }
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: T.primary, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 4 }}>App Upload</p>
          <p style={{ fontSize: 11, color: T.t600, wordBreak: "break-all" }}>securebank_v3.4.2_release.{platform === "android" ? "apk" : "ipa"} · {uploadProgress >= 100 ? "Ready to build" : `${Math.round(uploadProgress)}% uploaded`}</p>
        </div>
        <span style={{ fontSize: 9, fontWeight: 700, padding: "3px 10px", borderRadius: 99, background: T.primaryBg, color: T.primary, flexShrink: 0 }}>{platform === "android" ? "ANDROID" : "iOS"}</span>
      </div>
    );
  })();

  const raspKeyframes = `@keyframes spin{to{transform:rotate(360deg);}}@keyframes scaleIn{from{transform:scale(0.7);opacity:0;}to{transform:scale(1);opacity:1;}}@keyframes fadeInText{from{opacity:0;transform:translateY(4px);}to{opacity:1;transform:translateY(0);}}@keyframes pulseAlert{0%,100%{transform:scale(1);opacity:1;}50%{transform:scale(1.08);opacity:0.85;}}@keyframes blink{50%{opacity:0;}}`;

  const stageNode = (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0, minWidth: 0, width: "100%", maxWidth: "100%", gap: 10 }}>
      <style>{raspKeyframes}</style>
      <div style={{ flex: 1, minHeight: 0, minWidth: 0, display: "flex", flexDirection: "column" }}>
        {renderLeft()}
      </div>
      {phase !== "live" && (
        <div style={{ flexShrink: 0, maxHeight: "36%", minWidth: 0, overflowX: "hidden", overflowY: "auto", background: T.white, border: `1px solid ${T.border}`, borderRadius: 12, padding: 12, boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
          {inlineBureau}
        </div>
      )}
    </div>
  );

  const bubbleCopy = phase === "live"
    ? (scenario === "bad" ? "Live attack in progress — see the full threat analytics." : "Clean session — see the full trust analytics.")
    : phase === "build"
      ? "See the full build pipeline and live build log."
      : "See enforcement modes and the recommended baseline.";

  return (
    <DemoShell
      badge="RASP Build"
      overviewTitle="Build-Time App Security"
      overview={renderRightOverview()}
      journeySteps={journeyLabels}
      currentStep={currentStep}
      variant="dashboard"
      phone={stageNode}
      results={renderRight()}
      hasResults={phase !== "upload"}
      bubbleCopy={bubbleCopy}
      region={{ flag: ri.flag, country: ri.country }}
      fraud={scenario === "bad"}
      onToggleFraud={toggleScenario}
      nextLabel={atEnd ? "Request Demo" : "Next"}
      nextIsRequestDemo={atEnd}
      onStart={goUpload}
      onNext={goNext}
      onBack={goBackPhase}
      onReset={goUpload}
    />
  );
}

/* ============ BUILD LOG DATA ============ */
const BUILD_LOG = [
  { txt: "[bureau-build] Starting secure build pipeline...", c: "blue" },
  { txt: "[bureau-build] Analyzing APK structure...", c: "text" },
  { txt: "  → 47 classes.dex files detected", c: "text" },
  { txt: "  → 12 native libraries (arm64-v8a, armeabi-v7a)", c: "text" },
  { txt: "[bureau-build] Extracting AndroidManifest.xml...", c: "text" },
  { txt: "  ✓ Package: com.securebank.mobile", c: "green" },
  { txt: "  ✓ SDK target: 34 · min: 24", c: "green" },
  { txt: "[xvm-engine] Loading Bureau Virtualized Runtime Engine...", c: "blue" },
  { txt: "[xvm-engine] Converting critical functions to private instruction format:", c: "text" },
  { txt: "  → auth.verify() → xvm://f2a4c8e1", c: "yellow" },
  { txt: "  → payments.send() → xvm://d891bb37", c: "yellow" },
  { txt: "  → session.init() → xvm://a4b2f19d", c: "yellow" },
  { txt: "  ✓ 47 functions virtualized", c: "green" },
  { txt: "[obfuscator] Applying string encryption...", c: "text" },
  { txt: "  ✓ 1,247 strings encrypted", c: "green" },
  { txt: "[obfuscator] Applying control-flow flattening...", c: "text" },
  { txt: "  ✓ Symbol table stripped", c: "green" },
  { txt: "[injector] Adding runtime introspection SDK...", c: "blue" },
  { txt: "  → libbureau_rasp.so (+ 180 KB)", c: "text" },
  { txt: "  → 17 policy rules injected", c: "text" },
  { txt: "[injector] Installing anti-debug + anti-hooking hooks...", c: "text" },
  { txt: "  ✓ Frida detection armed", c: "green" },
  { txt: "  ✓ Xposed detection armed", c: "green" },
  { txt: "  ✓ Magisk detection armed", c: "green" },
  { txt: "[packager] Re-packaging APK...", c: "blue" },
  { txt: "[packager] Signing with Bureau build certificate...", c: "text" },
  { txt: "  ✓ APK signed: 3f:a1:b2:c4:8e:d1:...", c: "green" },
  { txt: "[verify] Running post-build verification...", c: "text" },
  { txt: "  ✓ APK structure valid", c: "green" },
  { txt: "  ✓ All protections active", c: "green" },
  { txt: "  ✓ Play Integrity ready", c: "green" },
  { txt: "", c: "text" },
  { txt: "✅ Build complete · 17.9 MB · securebank_v3.4.2_release_bureau.apk", c: "green" },
  { txt: "Build time: 2m 14s · Ready to publish", c: "green" }
];
