"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { DemoShell } from "@/components/demo-shell";
import {
  Shield, ShieldCheck, ShieldAlert, ShieldOff, XCircle, CheckCircle, AlertTriangle, AlertOctagon,
  Smartphone, Monitor, Lock, Unlock, Key, Fingerprint, Eye, EyeOff, Code, Terminal, Bug,
  Play, RotateCcw, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, ArrowRight, ArrowDownLeft,
  Wifi, Battery, Signal as SignalIcon, Bell, Layers, Zap, Cpu, HardDrive, Package,
  Activity, Clock, User, DollarSign, Send, ToggleLeft, ToggleRight, Radio, Info, FileWarning,
  Skull, Search, Ghost, Bomb, Flame
} from "lucide-react";

const BUREAU_LOGO = "/bureau-logo.png";

const T = {
  primary: "#253B80", primaryHover: "#1a2d5a",
  violet: "#7C3AED", violetBg: "rgba(124,58,237,0.1)",
  rose: "#E11D48", roseBg: "rgba(225,29,72,0.08)",
  amber: "#D97706", amberBg: "rgba(217,119,6,0.08)",
  emerald: "#059669", emeraldBg: "rgba(5,150,105,0.08)",
  blue: "#2563EB", blueBg: "rgba(37,99,235,0.08)",
  teal: "#0D9488", tealBg: "rgba(13,148,136,0.08)",
  bg: "#f5f7fa", white: "#fff", border: "#e5e7eb", borderLight: "#f3f4f6",
  t900: "#111827", t700: "#374151", t500: "#6b7280", t400: "#9ca3af", t300: "#d1d5db",
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

/* ============ PHONE FRAME ============ */
const StatusBar = () => {
  const [t, sT] = useState("");
  useEffect(() => { const u = () => sT(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })); u(); const iv = setInterval(u, 10000); return () => clearInterval(iv); }, []);
  return (<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 20px 4px", fontSize: 11, fontWeight: 600, color: "#1a1a1a" }}>
    <span style={{ fontWeight: 700 }}>{t}</span>
    <div style={{ width: 72, height: 22, borderRadius: 16, background: "#1a1a1a" }} />
    <div style={{ display: "flex", gap: 3, alignItems: "center" }}><SignalIcon size={11} /><Wifi size={11} /><div style={{ width: 18, height: 9, borderRadius: 2, border: "1.5px solid #1a1a1a", position: "relative", display: "flex", alignItems: "center", padding: 1 }}><div style={{ width: "75%", height: "100%", borderRadius: 1, background: "#1a1a1a" }} /></div></div>
  </div>);
};

const PhoneFrame = ({ children }) => (
  <div style={{ position: "relative", width: 266, height: 546, flexShrink: 0 }}>
    <div style={{ position: "absolute", right: -2.5, top: 130, width: 3, height: 40, borderRadius: "0 2px 2px 0", background: "#2a2a2a" }} />
    <div style={{ position: "absolute", left: -2.5, top: 110, width: 3, height: 28, borderRadius: "2px 0 0 2px", background: "#2a2a2a" }} />
    <div style={{ position: "absolute", left: -2.5, top: 148, width: 3, height: 28, borderRadius: "2px 0 0 2px", background: "#2a2a2a" }} />
    <div style={{ width: 260, height: 540, borderRadius: 36, background: "linear-gradient(145deg,#2a2a2a,#1a1a1a 50%,#2a2a2a)", padding: 3, boxShadow: "0 20px 60px rgba(0,0,0,0.25)", margin: "0 auto" }}>
      <div style={{ width: "100%", height: "100%", borderRadius: 33, background: "#000", padding: 2 }}>
        <div style={{ width: "100%", height: "100%", borderRadius: 31, background: "#fff", overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <StatusBar />
          <div style={{ flex: 1, overflow: "hidden" }}>{children}</div>
          <div style={{ padding: "5px 0 7px", display: "flex", justifyContent: "center", background: "#fff" }}><div style={{ width: 100, height: 4, borderRadius: 2, background: "#d1d5db" }} /></div>
        </div>
      </div>
    </div>
  </div>
);

/* ============ SCENARIOS ============ */
// Each scenario tells a story: attacker attempts something → RASP blocks it
// 4 layers: 1) Code Protection (reverse engineering), 2) Runtime Protection (root/jailbreak/hooks), 3) Anti-Tampering (repackaging), 4) Threat Intel (real-time signals)

const SCENARIOS = {
  reverse: {
    id: "reverse",
    title: "Reverse Engineering Attack",
    subtitle: "The attacker extracts the app and decompiles it with tools like Ghidra or IDA Pro to read the source-level logic, pulling out API keys and business logic for reuse or exploitation. ",
    protection: "Bureau's VM-based code protection scrambles critical logic into a private instruction format - the decompiler crashes or returns garbage instead of readable code, while the real app keeps running normally.",
    layer: "Code Protection",
    layerNum: 1,
    icon: Code,
    color: T.violet,
    steps: [
      { label: "Extract APK", desc: "Attacker pulls .apk from rooted device", terminal: [{ txt: "$ adb pull /data/app/com.bank.mobile/base.apk", c: "text" }, { txt: "  4,672,891 bytes extracted", c: "text" }, { txt: "✓ APK extracted successfully", c: "green" }] },
      { label: "Unzip Bundle", desc: "Unpacks native libraries", terminal: [{ txt: "$ unzip base.apk -d ./analysis", c: "text" }, { txt: "  extracting: lib/arm64-v8a/libnative-auth.so", c: "text" }, { txt: "  extracting: lib/arm64-v8a/libpayments.so", c: "text" }, { txt: "✓ 47 files extracted", c: "green" }] },
      { label: "Decompile with Ghidra", desc: "NSA reverse-engineering tool", terminal: [{ txt: "$ ghidra libnative-auth.so", c: "text" }, { txt: "  Loading binary...", c: "text" }, { txt: "  Analyzing instructions...", c: "text" }, { txt: "  Building control flow graph...", c: "yellow" }] },
      { label: "🛡️ Bureau RASP Blocks", desc: "VM-based code protection engaged", terminal: [
        { txt: "  [FATAL] Ghidra crashed", c: "red" },
        { txt: "  Exception: Bad instruction at 0x4a2f81", c: "red" },
        { txt: "  Cannot disassemble VM-obfuscated code", c: "red" },
        { txt: "", c: "text" },
        { txt: "✓ Bureau RASP: Reverse engineering prevented", c: "green" },
        { txt: "✓ Virtual machine layer intact", c: "green" },
        { txt: "✓ No source code, keys, or logic exposed", c: "green" }
      ]},
    ],
    rightSummary: {
      title: "Code Protection Layer",
      color: T.violet,
      checks: [
        { l: "Virtual Machine Obfuscation", v: "Active", p: true, d: "Only Bureau in market" },
        { l: "Ghidra Decompilation", v: "Blocked", p: true, d: "Tool crashed on analysis" },
        { l: "IDA Pro Decompilation", v: "Blocked", p: true, d: "Bad instructions returned" },
        { l: "Function Names", v: "Encrypted", p: true, d: "Symbols removed" },
        { l: "String Encryption", v: "Enabled", p: true, d: "API keys hidden" },
        { l: "Control Flow", v: "Obfuscated", p: true, d: "Logic paths scrambled" },
        { l: "Anti-Debugging", v: "Active", p: true, d: "GDB/LLDB blocked" },
      ],
      insight: "Bureau is the only RASP vendor in the market employing virtual machine-based code protection. When attackers try to decompile protected libraries, tools like Ghidra crash or return 'bad instructions' — while the app runs normally on real devices."
    }
  },
  runtime: {
    id: "runtime",
    title: "Runtime Instrumentation Attack",
    subtitle: "The attacker attaches a hooking framework like Frida to the running app, intercepting function calls to bypass checks or manipulate transactions in real time.",
    protection: "Bureau detects the injected hook and instrumentation framework at runtime and terminates the session before any transaction can be altered.",
    layer: "Runtime Protection",
    layerNum: 2,
    icon: Cpu,
    color: T.rose,
    steps: [
      { label: "Root Device", desc: "Custom OS with root privileges", terminal: [{ txt: "$ su", c: "text" }, { txt: "# id", c: "text" }, { txt: "  uid=0(root) gid=0(root)", c: "green" }, { txt: "✓ Root access acquired", c: "green" }] },
      { label: "Launch Frida Server", desc: "Dynamic instrumentation toolkit", terminal: [{ txt: "$ ./frida-server &", c: "text" }, { txt: "  Frida 16.5.0 listening on port 27042", c: "text" }, { txt: "✓ Server running", c: "green" }] },
      { label: "Hook Payment Function", desc: "Modify transaction amount at runtime", terminal: [
        { txt: "$ frida -U -f com.bank.mobile -l hook.js", c: "text" },
        { txt: "  Loading script hook.js...", c: "text" },
        { txt: "  Intercepting sendPayment()...", c: "yellow" },
        { txt: "  Modifying amount: $100 → $10", c: "yellow" }
      ]},
      { label: "🛡️ Bureau RASP Blocks", desc: "Runtime protection detects attack", terminal: [
        { txt: "  [BUREAU RASP] Threat Detected", c: "red" },
        { txt: "  ├─ Root access: DETECTED (Magisk 27.0)", c: "red" },
        { txt: "  ├─ Frida hooks: DETECTED (27 injections)", c: "red" },
        { txt: "  ├─ Native library tampered", c: "red" },
        { txt: "  └─ Response: SESSION_TERMINATED", c: "red" },
        { txt: "", c: "text" },
        { txt: "✓ App killed, no transaction submitted", c: "green" },
        { txt: "✓ Bureau backend notified in real-time", c: "green" }
      ]},
    ],
    rightSummary: {
      title: "Runtime Protection Layer",
      color: T.rose,
      checks: [
        { l: "Root Detection", v: "Detected", p: false, d: "Magisk 27.0 hidden root" },
        { l: "Jailbreak Detection", v: "N/A (Android)", p: true, d: "iOS-only signal" },
        { l: "Frida/Xposed Hooks", v: "Detected", p: false, d: "27 injection points" },
        { l: "Magisk Modules", v: "Detected", p: false, d: "Root hiding active" },
        { l: "Debugger Attached", v: "Not detected", p: true, d: "No lldb/gdb found" },
        { l: "Custom ROM", v: "Detected", p: false, d: "LineageOS 21" },
        { l: "SELinux Mode", v: "Permissive", p: false, d: "Should be enforcing" },
        { l: "Action Taken", v: "App terminated", p: true, d: "Session killed instantly" },
      ],
      insight: "Runtime instrumentation is the #1 vector for account takeover in banking apps. Bureau detects Frida, Xposed, Magisk, and 40+ hooking frameworks — including hidden root variants that bypass Google Play Integrity API."
    }
  },
  tampering: {
    id: "tampering",
    title: "App Repackaging Attack",
    subtitle: "The attacker modifies the compiled app - stripping license checks or injecting malicious code - re-signs it, and distributes the cloned app through third-party app stores.",
    protection: "Bureau's integrity checks detect any change to the signed binary and block the tampered app from running.",
    layer: "Anti-Tampering",
    layerNum: 3,
    icon: Package,
    color: T.amber,
    steps: [
      { label: "Decompile APK", desc: "Reverse to smali code", terminal: [{ txt: "$ apktool d base.apk -o modified/", c: "text" }, { txt: "  Baksmaling classes.dex...", c: "text" }, { txt: "  Copying resources...", c: "text" }, { txt: "✓ App decompiled", c: "green" }] },
      { label: "Inject Malicious Code", desc: "Add credential stealer", terminal: [
        { txt: "$ nano modified/smali/LoginActivity.smali", c: "text" },
        { txt: "  + invoke-static {v3}, Lcom/evil/Logger;->", c: "yellow" },
        { txt: "    steal(Ljava/lang/String;)V", c: "yellow" },
        { txt: "✓ Credential stealer injected", c: "yellow" }
      ]},
      { label: "Rebuild & Re-sign", desc: "Create new package with attacker's key", terminal: [
        { txt: "$ apktool b modified/ -o tampered.apk", c: "text" },
        { txt: "$ apksigner sign --ks evil.keystore tampered.apk", c: "text" },
        { txt: "✓ Repackaged app ready for distribution", c: "yellow" }
      ]},
      { label: "🛡️ Bureau RASP Blocks", desc: "Integrity check fails on launch", terminal: [
        { txt: "  [BUREAU RASP] Integrity Verification", c: "red" },
        { txt: "  ├─ Package signature: MISMATCH", c: "red" },
        { txt: "  ├─ Expected: 3f:a1:b2:...  ", c: "red" },
        { txt: "  ├─ Actual:   e7:c9:d4:...  ", c: "red" },
        { txt: "  ├─ DEX checksums: 3 modified", c: "red" },
        { txt: "  ├─ Native lib hashes: MODIFIED", c: "red" },
        { txt: "  └─ Response: APP_TAMPERED", c: "red" },
        { txt: "", c: "text" },
        { txt: "✓ App refuses to launch", c: "green" },
        { txt: "✓ User warned of malicious version", c: "green" }
      ]},
    ],
    rightSummary: {
      title: "Anti-Tampering Layer",
      color: T.amber,
      checks: [
        { l: "Package Signature", v: "Mismatch", p: false, d: "Re-signed with attacker key" },
        { l: "DEX Integrity", v: "3 files modified", p: false, d: "Bytecode tampering" },
        { l: "Native Lib Hashes", v: "Modified", p: false, d: "SO files altered" },
        { l: "Resource Integrity", v: "Modified", p: false, d: "Strings changed" },
        { l: "Installation Source", v: "Unknown", p: false, d: "Not Play Store/App Store" },
        { l: "Play Integrity", v: "Failed", p: false, d: "Google verdict: FAIL" },
        { l: "Cert Pinning", v: "Bypass attempted", p: false, d: "SSL kill switch found" },
        { l: "Action Taken", v: "App blocked", p: true, d: "Launch prevented" },
      ],
      insight: "Repackaged apps distributed via third-party stores are the primary vector for banking trojans. Bureau checks package signature, DEX/native library integrity, and installation source — even when attackers bypass Google Play Integrity API."
    }
  },
  emulator: {
    id: "emulator",
    title: "Emulator Farm Attack",
    subtitle: "The attacker spins up thousands of app instances on emulators to automate fake signups, bonus abuse, or account fraud at scale.",
    protection: "Bureau fingerprints emulated hardware and virtualized environments, blocking execution the moment a non-genuine device is detected.",
    layer: "Environment Detection",
    layerNum: 4,
    icon: Ghost,
    color: T.blue,
    steps: [
      { label: "Spin Up Emulators", desc: "1,000 Android instances", terminal: [
        { txt: "$ docker-compose up --scale android=1000", c: "text" },
        { txt: "  Starting redroid containers...", c: "text" },
        { txt: "  1000 emulators online", c: "yellow" },
        { txt: "✓ Farm ready", c: "yellow" }
      ]},
      { label: "Randomize Fingerprints", desc: "Spoof device identifiers", terminal: [
        { txt: "$ ./fingerprint-randomizer.sh", c: "text" },
        { txt: "  Randomized IMEI, Android ID, Build props", c: "text" },
        { txt: "  Rotated MAC addresses", c: "text" },
        { txt: "✓ Each emulator appears unique", c: "yellow" }
      ]},
      { label: "Automate App Actions", desc: "Simulate human behavior", terminal: [
        { txt: "$ appium --plugin behavioral-mimic", c: "text" },
        { txt: "  Signing up 1000 accounts...", c: "text" },
        { txt: "  Randomizing tap patterns...", c: "yellow" }
      ]},
      { label: "🛡️ Bureau RASP Blocks", desc: "Multi-signal environment detection", terminal: [
        { txt: "  [BUREAU RASP] Environment Analysis", c: "red" },
        { txt: "  ├─ CPU: Emulated ARM (redroid)", c: "red" },
        { txt: "  ├─ Sensors: Missing gyroscope data", c: "red" },
        { txt: "  ├─ QEMU artifacts: Detected", c: "red" },
        { txt: "  ├─ Build props: Tampered", c: "red" },
        { txt: "  ├─ Behavioral: Non-human tap velocity", c: "red" },
        { txt: "  ├─ Graph: Linked to 47 other flagged devices", c: "red" },
        { txt: "  └─ Response: BLOCK_SIGNUP", c: "red" },
        { txt: "", c: "text" },
        { txt: "✓ 1,000 fake signups blocked", c: "green" },
        { txt: "✓ Fingerprints added to Bureau Graph", c: "green" }
      ]},
    ],
    rightSummary: {
      title: "Environment Detection Layer",
      color: T.blue,
      checks: [
        { l: "Emulator Detection", v: "Redroid/Docker", p: false, d: "Container-based emulator" },
        { l: "CPU Architecture", v: "Emulated ARM", p: false, d: "QEMU artifacts present" },
        { l: "Sensor Presence", v: "Missing", p: false, d: "No gyroscope/accelerometer" },
        { l: "Build Props Spoofing", v: "Detected", p: false, d: "Ro.build.tags mismatch" },
        { l: "Behavioral Signals", v: "Bot-like", p: false, d: "Perfect tap velocity" },
        { l: "Bureau Graph Score", v: "847/1000", p: false, d: "Linked to 47 flagged devices" },
        { l: "Play Integrity", v: "Basic (failed)", p: false, d: "No hardware attestation" },
        { l: "Action Taken", v: "Signup blocked", p: true, d: "Fingerprints logged" },
      ],
      insight: "Bureau's RASP integrates with Device Intelligence + Bureau Graph Network to detect emulator farms not just from device signals, but from cross-platform behavioral patterns. One SDK. Full-stack protection."
    }
  }
};

/* ============ MAIN COMPONENT ============ */
function BureauRASPDemoInner() {
  const searchParams = useSearchParams();
  const scenarioParam = searchParams.get("scenario");
  const initialScenario = scenarioParam && SCENARIOS[scenarioParam] ? scenarioParam : "reverse";

  const [reg] = useState(() => detectRegion());
  const ri = RI[reg] || RI.US;
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [time, setTime] = useState("");
  useEffect(() => { const u = () => setTime(new Date().toLocaleTimeString("en-US", { hour12: false, timeZone: tz })); u(); const iv = setInterval(u, 10000); return () => clearInterval(iv); }, [tz]);

  const [activeScenario, setActiveScenario] = useState(initialScenario);
  const [step, setStep] = useState(0); // 0 = intro, 1-4 = steps
  const [autoPlay, setAutoPlay] = useState(false);
  const [exp, setExp] = useState({});
  const scenario = SCENARIOS[activeScenario];

  const togExp = (k) => setExp(p => ({ ...p, [k]: !p[k] }));

  // Auto-advance
  useEffect(() => {
    if (!autoPlay || step >= 4) return;
    const t = setTimeout(() => setStep(s => Math.min(s + 1, 4)), 2500);
    return () => clearTimeout(t);
  }, [autoPlay, step]);

  // Reset on scenario change
  useEffect(() => {
    setStep(0);
    setAutoPlay(false);
  }, [activeScenario]);

  const goNext = () => { if (step < 4) setStep(s => s + 1); };
  const goBack = () => { if (step > 1) setStep(s => s - 1); else reset(); };
  const reset = () => { setStep(0); setAutoPlay(false); };
  const startDemo = () => { setStep(1); setAutoPlay(false); };

  const ESection = ({ title, icon: Icon, color, children, defaultOpen = true }) => {
    const open = exp[title] === undefined ? defaultOpen : exp[title];
    return (<div style={{ background: T.white, borderRadius: 10, border: `1px solid ${T.border}`, marginBottom: 8, overflow: "hidden" }}>
      <div onClick={() => togExp(title)} style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
        <div style={{ width: 28, height: 28, borderRadius: 6, background: color + "14", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Icon size={14} color={color} /></div>
        <span style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>{title}</span>
        {open ? <ChevronUp size={14} color={T.t400} /> : <ChevronDown size={14} color={T.t400} />}
      </div>
      {open && <div style={{ padding: "0 14px 14px", borderTop: `1px solid ${T.borderLight}` }}>{children}</div>}
    </div>);
  };

  /* ============ PHONE SCREEN (LEFT) ============ */
  const phoneScreen = () => {
    if (step === 0) {
      // Home / bank app safe state
      return (<div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#f9fafb" }}>
        <div style={{ background: T.primary, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ color: "#fff", fontSize: 10, opacity: 0.7 }}>Welcome back</p>
            <p style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>{ri.user}</p>
          </div>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ShieldCheck size={16} color="#fff" />
          </div>
        </div>
        <div style={{ padding: "16px 14px", background: T.primary }}>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 10 }}>Available Balance</p>
          <p style={{ color: "#fff", fontSize: 22, fontWeight: 800, marginTop: 2 }}>{ri.balance}</p>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 9, marginTop: 2 }}>Account •••• 4821</p>
        </div>
        <div style={{ flex: 1, padding: 14, background: "#fff", borderRadius: "16px 16px 0 0", marginTop: -8 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
            {[{ i: Send, l: "Send" }, { i: ArrowDownLeft, l: "Receive" }, { i: DollarSign, l: "Pay" }, { i: Radio, l: "More" }].map((a, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: T.primaryHover + "18", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 4px" }}><a.i size={16} color={T.primary} /></div>
                <p style={{ fontSize: 9, color: T.t700 }}>{a.l}</p>
              </div>
            ))}
          </div>
          <div style={{ padding: "10px 12px", background: T.emeraldBg, borderRadius: 8, display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <ShieldCheck size={16} color={T.emerald} />
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: T.emerald }}>App Protected by Bureau</p>
              <p style={{ fontSize: 9, color: T.emerald, opacity: 0.8 }}>Runtime security active · All systems normal</p>
            </div>
          </div>
          <p style={{ fontSize: 10, fontWeight: 700, color: T.t400, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Recent Activity</p>
          {[{ n: "Amazon", a: "-$67.99", t: "Today, 2:14 PM" }, { n: "Salary", a: `+${ri.currency}5,200`, t: "Yesterday" }, { n: "Netflix", a: "-$14.99", t: "Apr 20" }].map((tx, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: i < 2 ? `1px solid ${T.borderLight}` : "none" }}>
              <div><p style={{ fontSize: 10, fontWeight: 600 }}>{tx.n}</p><p style={{ fontSize: 8, color: T.t400 }}>{tx.t}</p></div>
              <p style={{ fontSize: 10, fontWeight: 700, color: tx.a.startsWith("+") ? T.emerald : T.t900 }}>{tx.a}</p>
            </div>
          ))}
        </div>
      </div>);
    }

    if (step < 4) {
      // Attack in progress — show alarming state
      const alerts = [
        { icon: Search, title: "Suspicious Activity", desc: "Someone is analyzing your app..." },
        { icon: Bug, title: "Debugger Detected", desc: "Runtime instrumentation in progress" },
        { icon: FileWarning, title: "Integrity Compromised", desc: "App has been modified" }
      ];
      const a = alerts[step - 1];
      return (<div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#0d1117" }}>
        <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#161b22", borderBottom: `1px solid #30363d` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <ShieldAlert size={14} color={T.amber} />
            <p style={{ color: T.amber, fontSize: 10, fontWeight: 700 }}>MONITORING</p>
          </div>
          <div style={{ display: "flex", gap: 3 }}>{[0,1,2].map(i => (<div key={i} style={{ width: 4, height: 4, borderRadius: 2, background: i < step ? T.amber : "#30363d" }}/>))}</div>
        </div>
        <div style={{ flex: 1, padding: 16, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: T.amberBg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, animation: "pulseAlert 1.5s infinite" }}>
            <a.icon size={28} color={T.amber} />
          </div>
          <p style={{ color: "#fff", fontSize: 14, fontWeight: 700, marginBottom: 6 }}>{a.title}</p>
          <p style={{ color: "#8b949e", fontSize: 11, marginBottom: 20, maxWidth: 200 }}>{a.desc}</p>
          <div style={{ padding: "8px 14px", background: "rgba(217,119,6,0.15)", borderRadius: 8, border: `1px solid rgba(217,119,6,0.3)`, display: "flex", alignItems: "center", gap: 6 }}>
            <Activity size={12} color={T.amber} />
            <p style={{ color: T.amber, fontSize: 10, fontWeight: 600 }}>Bureau RASP investigating...</p>
          </div>
        </div>
        <div style={{ padding: "10px 14px", background: "#161b22", borderTop: `1px solid #30363d`, fontFamily: T.mono }}>
          <p style={{ fontSize: 8, color: "#8b949e" }}>Step {step}/3 · {scenario.steps[step - 1].label}</p>
        </div>
      </div>);
    }

    // Step 4: BLOCKED
    return (<div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#0d1117" }}>
      <div style={{ padding: "12px 16px", background: T.rose, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <ShieldOff size={14} color="#fff" />
          <p style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>BLOCKED</p>
        </div>
        <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 9 }}>Bureau RASP</p>
      </div>
      <div style={{ flex: 1, padding: 16, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
        <div style={{ width: 76, height: 76, borderRadius: "50%", background: T.roseBg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, animation: "scaleIn 0.5s ease" }}>
          <ShieldOff size={36} color={T.rose} />
        </div>
        <p style={{ color: "#fff", fontSize: 15, fontWeight: 800, marginBottom: 4 }}>Attack Blocked</p>
        <p style={{ color: "#8b949e", fontSize: 10, marginBottom: 16, maxWidth: 210 }}>{scenario.title} prevented. Session terminated.</p>
        <div style={{ padding: "10px 12px", background: "rgba(225,29,72,0.1)", borderRadius: 8, border: `1px solid rgba(225,29,72,0.3)`, marginBottom: 8, width: "100%" }}>
          <p style={{ fontSize: 9, color: "#8b949e", marginBottom: 4 }}>Threat Type</p>
          <p style={{ fontSize: 11, color: "#fff", fontWeight: 700 }}>{scenario.title}</p>
        </div>
        <div style={{ padding: "10px 12px", background: "rgba(37,59,128,0.15)", borderRadius: 8, border: `1px solid rgba(37,59,128,0.3)`, width: "100%" }}>
          <p style={{ fontSize: 9, color: "#8b949e", marginBottom: 4 }}>Bureau RASP Layer</p>
          <p style={{ fontSize: 11, color: "#79c0ff", fontWeight: 700 }}>Layer {scenario.layerNum}: {scenario.layer}</p>
        </div>
      </div>
      <div style={{ padding: "10px 14px", background: "#161b22", borderTop: `1px solid #30363d`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ fontSize: 8, color: "#8b949e", fontFamily: T.mono }}>Session ID: rasp_a4f8...c921</p>
        <p style={{ fontSize: 8, color: T.emerald, fontWeight: 700 }}>◉ Reported to backend</p>
      </div>
    </div>);
  };

  /* ============ OVERVIEW BODY ============ */
  const overviewBody = (<div>
        <p style={{ fontSize: 10, fontWeight: 700, color: T.t400, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 8 }}>The 4 Layers of Bureau RASP</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 16 }}>
          {Object.values(SCENARIOS).map((s) => (
            <div key={s.id} onClick={() => setActiveScenario(s.id)} style={{ background: activeScenario === s.id ? s.color + "10" : T.white, borderRadius: 8, padding: 10, border: `1px solid ${activeScenario === s.id ? s.color + "40" : T.border}`, cursor: "pointer", transition: "all 0.15s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <div style={{ width: 22, height: 22, borderRadius: 5, background: s.color + "18", display: "flex", alignItems: "center", justifyContent: "center" }}><s.icon size={12} color={s.color} /></div>
                <span style={{ fontSize: 9, fontWeight: 700, color: s.color }}>LAYER {s.layerNum}</span>
              </div>
  <p style={{ fontSize: 11, fontWeight: 700, color: T.t900 }}>{s.layer}</p>
  </div>
  ))}
        </div>

    <div style={{ background: T.bg, borderRadius: 12, padding: 16, border: `1px solid ${T.border}`, lineHeight: 1.7, marginBottom: 16 }}>
  <p style={{ fontSize: 12, fontWeight: 700, color: T.t900, marginBottom: 8 }}>{scenario.title}</p>
  <p style={{ fontSize: 12, color: T.t500 }}>{scenario.subtitle}</p>
  {scenario.protection && <p style={{ fontSize: 12, color: T.t500, marginTop: 8 }}>{scenario.protection}</p>}
  </div>

        <div style={{ background: T.violet + "10", borderRadius: 10, padding: 14, border: `1px solid ${T.violet}30`, marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <Zap size={14} color={T.violet} />
            <span style={{ fontSize: 11, fontWeight: 700, color: T.violet }}>Bureau's Key Differentiator</span>
          </div>
          <p style={{ fontSize: 11, color: T.t700, lineHeight: 1.5 }}>Virtual Machine-based code protection is unique to Bureau. When attackers decompile a protected library with Ghidra or IDA Pro, the tools crash or return bad instructions - while the app runs normally on real devices.</p>
        </div>
      </div>);

  /* ============ RESULTS PANEL (attack terminal) ============ */
  const rightPanel = () => {
    // Steps 1-4: show terminal + progress
    const s = scenario.steps[step - 1];
    if (!s) return null;
    return (<div>
      <div style={{ background: T.bg, borderRadius: 10, padding: 12, marginBottom: 12, border: `1px solid ${T.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <div style={{ display: "flex", gap: 4 }}>
            {[1, 2, 3, 4].map(n => (
              <div key={n} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: step >= n ? (n === 4 ? T.emerald : scenario.color) : T.t300, color: "#fff", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{n === 4 ? "🛡" : n}</div>
                {n < 4 && <div style={{ width: 24, height: 2, background: step > n ? scenario.color : T.t300 }} />}
              </div>
            ))}
          </div>
        </div>
        <p style={{ fontSize: 13, fontWeight: 700, color: T.t900, marginTop: 8 }}>{s.label}</p>
        <p style={{ fontSize: 11, color: T.t500, marginTop: 2 }}>{s.desc}</p>
      </div>

      {/* Terminal */}
      <div style={{ background: T.terminal, borderRadius: 10, padding: 14, marginBottom: 12, border: `1px solid #30363d`, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10, paddingBottom: 8, borderBottom: `1px solid #30363d` }}>
          <div style={{ display: "flex", gap: 5 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f56" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ffbd2e" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#27c93f" }} />
          </div>
          <span style={{ color: "#8b949e", fontSize: 10, fontFamily: T.mono, marginLeft: 6 }}>attacker@kali:~</span>
        </div>
        <div style={{ fontFamily: T.mono, fontSize: 11, lineHeight: 1.7 }}>
          {s.terminal.map((line, i) => (
            <div key={i} style={{ color: line.c === "green" ? T.terminalGreen : line.c === "red" ? T.terminalRed : line.c === "yellow" ? T.terminalYellow : line.c === "blue" ? T.terminalBlue : T.terminalText, animation: `fadeInText 0.3s ease ${i * 0.15}s both`, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
              {line.txt || "\u00A0"}
            </div>
          ))}
        </div>
      </div>

      {/* Summary appears at step 4 */}
      {step === 4 && (
        <>
          <div style={{ background: T.emeraldBg, borderRadius: 10, padding: 12, marginBottom: 10, border: `1px solid ${T.emerald}30`, display: "flex", alignItems: "center", gap: 10 }}>
            <ShieldCheck size={22} color={T.emerald} />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: T.emerald }}>Attack Neutralized</p>
              <p style={{ fontSize: 10, color: T.emerald, opacity: 0.85 }}>Bureau RASP blocked the attack in real time</p>
            </div>
          </div>
          <ESection title={scenario.rightSummary.title} icon={scenario.icon} color={scenario.rightSummary.color}>
            <div style={{ paddingTop: 8 }}>
              {scenario.rightSummary.checks.map((c, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "6px 0", borderBottom: i < scenario.rightSummary.checks.length - 1 ? `1px solid ${T.borderLight}` : "none" }}>
                  <div>
                    <p style={{ fontSize: 11, color: T.t700 }}>{c.l}</p>
                    {c.d && <p style={{ fontSize: 9, color: T.t400, marginTop: 1 }}>{c.d}</p>}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                    <span style={{ fontSize: 10, fontWeight: 600, color: c.p ? T.emerald : T.rose }}>{c.v}</span>
                    {c.p ? <CheckCircle size={12} color={T.emerald} /> : <XCircle size={12} color={T.rose} />}
                  </div>
                </div>
              ))}
            </div>
          </ESection>
          <div style={{ background: T.violet + "0d", borderRadius: 10, padding: 12, border: `1px solid ${T.violet}20`, marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <Info size={12} color={T.violet} />
              <span style={{ fontSize: 10, fontWeight: 700, color: T.violet, textTransform: "uppercase", letterSpacing: 1 }}>Bureau Insight</span>
            </div>
            <p style={{ fontSize: 11, color: T.t700, lineHeight: 1.6 }}>{scenario.rightSummary.insight}</p>
          </div>
        </>
      )}
    </div>);
  };

  const atEnd = step >= 4;
  const journeySteps = scenario.steps.map(s => s.label);
  const journeyIdx = Math.max(0, Math.min(step - 1, journeySteps.length - 1));

  const phoneWithFx = (
    <>
      <style>{`@keyframes pulseAlert{0%,100%{transform:scale(1);opacity:1;}50%{transform:scale(1.05);opacity:0.85;}}@keyframes fadeInText{from{opacity:0;transform:translateX(-4px);}to{opacity:1;transform:translateX(0);}}`}</style>
      {phoneScreen()}
    </>
  );

  return (
    <DemoShell
      badge="Real-Time App Security"
      overviewTitle={scenario.title}
      hideOverviewTitle
      overview={overviewBody}
      journeySteps={journeySteps}
      currentStep={journeyIdx}
      phone={phoneWithFx}
      results={rightPanel()}
      hasResults={step >= 1}
      bubbleCopy={atEnd ? "Attack blocked — open for the full RASP layer breakdown." : "Follow the attacker's terminal step by step."}
      region={{ flag: ri.flag, country: ri.country }}
      nextLabel={atEnd ? "Request Demo" : "Next"}
      nextIsRequestDemo={atEnd}
      onStart={startDemo}
      onNext={goNext}
      onBack={goBack}
      onReset={reset}
    />
  );
}

export default function BureauRASPDemo() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ width: 32, height: 32, border: "3px solid #e2e8f0", borderTopColor: "#253B80", borderRadius: "50%", animation: "spin 1s linear infinite" }} /></div>}>
      <BureauRASPDemoInner />
    </Suspense>
  );
}
