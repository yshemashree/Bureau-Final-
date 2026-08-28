"use client";
import { useState, useEffect, useRef } from "react";
import { DemoShell } from "@/components/demo-shell";
import {
  Shield, ShieldCheck, ShieldAlert, XCircle, CheckCircle, AlertTriangle, AlertOctagon,
  Upload, Camera, Image as ImageIcon, User, FileText, Eye, EyeOff, Scan,
  Play, RotateCcw, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, ArrowRight,
  Wifi, Battery, Signal as SignalIcon, Sparkles, Zap, Layers,
  Activity, Clock, Search, Info, ToggleLeft, ToggleRight, FileWarning,
  Cpu, Grid3x3, Target, Brain, Fingerprint, Palette, Ghost, Loader,
  MessageSquare, Download, Copy
} from "lucide-react";

const BUREAU_LOGO = "/bureau-logo.png";
const FACE_SWAP_HEATMAP = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gemini_Generated_Image_4ekq5v4ekq5v4ekq-clSi3r6z72wTrpQa4nNoPhzEfNNeNi.png";
const GENERIC_AI_HEATMAP = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/a97295a1-68aa-449c-be32-4f0f1fab37e6-0zdMnTWQktEAvhzjme9tCOgCLAsjU7.jpeg";

const T = {
  primary: "#253B80", primaryHover: "#1a2d5a",
  violet: "#7C3AED", violetBg: "rgba(124,58,237,0.1)",
  rose: "#E11D48", roseBg: "rgba(225,29,72,0.08)",
  amber: "#D97706", amberBg: "rgba(217,119,6,0.08)",
  emerald: "#059669", emeraldBg: "rgba(5,150,105,0.08)",
  blue: "#2563EB", blueBg: "rgba(37,99,235,0.08)",
  teal: "#0D9488", tealBg: "rgba(13,148,136,0.08)",
  pink: "#EC4899", pinkBg: "rgba(236,72,153,0.08)",
  bg: "#f5f7fa", white: "#fff", border: "#e5e7eb", borderLight: "#f3f4f6",
  t900: "#111827", t700: "#374151", t500: "#6b7280", t400: "#9ca3af", t300: "#d1d5db",
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
  US: { flag: "🇺🇸", country: "United States" },
  IN: { flag: "🇮🇳", country: "India" },
  SEA: { flag: "🇸🇬", country: "Singapore" }
};

/* ============ PHONE ============ */
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

/* ============ REAL IMAGES ============
   Using photo URLs from public CDNs (Unsplash) for genuine images
   and images that show clear AI/deepfake characteristics for fraud cases
   All images are real photos, no synthetic SVG placeholders
*/

// Real photo URLs — Unsplash is a free public CDN, all images are properly licensed
const IMAGES = {
  face: {
    genuine: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=500&fit=crop&crop=faces&auto=format&q=80",
    // AI-generated / deepfake looking portrait (uncanny smoothness, unusual lighting)
    fake: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=500&fit=crop&crop=faces&auto=format&q=80"
  },
  id: {
    genuine: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=380&fit=crop&auto=format&q=80",
    fake: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=380&fit=crop&auto=format&q=80"
  },
  scene: {
    genuine: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=440&fit=crop&auto=format&q=80",
    // AI-generated scene (Midjourney/SDXL style landscape)
    fake: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&h=440&fit=crop&auto=format&q=80"
  }
};

const FaceImage = ({ genuine = true }) => (
  <div style={{ width: "100%", height: "100%", position: "relative", background: "#e5e7eb", overflow: "hidden" }}>
    <img
      src={genuine ? IMAGES.face.genuine : IMAGES.face.fake}
      alt={genuine ? "Portrait" : "Deepfake portrait"}
      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      loading="eager"
      referrerPolicy="no-referrer"
    />
  </div>
);

const IDCardImage = ({ genuine = true }) => (
  <div style={{ width: "100%", height: "100%", position: "relative", background: "#f0f4f8", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
    {/* Realistic ID card mockup rendered as HTML/CSS for consistency */}
    <div style={{ width: "94%", height: "88%", background: genuine ? "linear-gradient(135deg, #e6ecf5, #cad4e5)" : "linear-gradient(135deg, #e6ecf5, #cad4e5)", borderRadius: 12, position: "relative", padding: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.15)", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <div>
          <p style={{ fontSize: 7, color: "#253B80", fontWeight: 700, letterSpacing: 1 }}>NEW YORK</p>
          <p style={{ fontSize: 9, color: "#253B80", fontWeight: 800 }}>DRIVER LICENSE</p>
        </div>
        <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#253B80", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 8, fontWeight: 700 }}>NY</div>
      </div>
      {/* Body */}
      <div style={{ flex: 1, display: "flex", gap: 8 }}>
        {/* Photo — use actual portrait */}
        <div style={{ width: 50, height: 65, borderRadius: 4, overflow: "hidden", flexShrink: 0, background: "#c9d1d9", border: "1px solid rgba(0,0,0,0.1)" }}>
          <img
            src={genuine ? IMAGES.face.genuine : IMAGES.face.fake}
            alt="ID photo"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: genuine ? "none" : "contrast(1.05) saturate(0.95)" }}
            loading="eager"
            referrerPolicy="no-referrer"
          />
        </div>
        {/* Text fields */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
          <div>
            <p style={{ fontSize: 6, color: "#6b7280" }}>NAME</p>
            <p style={{ fontSize: 8, color: "#111827", fontWeight: 700, fontFamily: "monospace" }}>{genuine ? "SARAH J MARTINEZ" : "JOHN X SMITH"}</p>
          </div>
          <div>
            <p style={{ fontSize: 6, color: "#6b7280" }}>DOB</p>
            <p style={{ fontSize: 8, color: "#111827", fontWeight: 700, fontFamily: "monospace" }}>{genuine ? "06/20/1990" : "01/01/1985"}</p>
          </div>
          <div>
            <p style={{ fontSize: 6, color: "#6b7280" }}>DL NUMBER</p>
            <p style={{ fontSize: 8, color: "#111827", fontWeight: 700, fontFamily: "monospace" }}>{genuine ? "874-291-4703" : "000-000-000X"}</p>
          </div>
          <div>
            <p style={{ fontSize: 6, color: "#6b7280" }}>EXPIRES</p>
            <p style={{ fontSize: 8, color: "#111827", fontWeight: 700, fontFamily: "monospace" }}>06/20/2032</p>
          </div>
        </div>
      </div>
      {/* Footer */}
      <div style={{ marginTop: 4, paddingTop: 4, borderTop: "1px solid rgba(37,59,128,0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 6, color: "#253B80", fontFamily: "monospace" }}>◈◈◈◈◈◈◈◈◈◈</div>
        <div style={{ fontSize: 6, color: "#253B80", fontFamily: "monospace" }}>{"<<USA<<"}</div>
      </div>
    </div>
  </div>
);

const SceneImage = ({ genuine = true }) => (
  <div style={{ width: "100%", height: "100%", position: "relative", background: "#e5e7eb", overflow: "hidden" }}>
    <img
      src={genuine ? IMAGES.scene.genuine : IMAGES.scene.fake}
      alt={genuine ? "Landscape" : "AI generated scene"}
      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      loading="eager"
      referrerPolicy="no-referrer"
    />
  </div>
);

/* ============ HEATMAP OVERLAY ============ */
// Renders SVG blobs positioned over the image showing manipulation areas
  const HeatmapOverlay = ({ type, isFake, aspectRatio = 1 }) => {
  if (!isFake) return null;
  const suppliedHeatmap = type === "face" ? FACE_SWAP_HEATMAP : type === "generic" ? GENERIC_AI_HEATMAP : null;
  if (suppliedHeatmap) return <img src={suppliedHeatmap} alt="Bureau Intelligence heatmap" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }} />;
  // hotspots per image type - coordinates match real photo compositions
  const spots = {
    face: [
      // Eyes area - typical location in portrait photos (upper-third)
      { cx: 40, cy: 38, r: 10, intensity: 0.95, label: "Eye artifacts" },
      { cx: 60, cy: 38, r: 10, intensity: 0.92, label: "Eye asymmetry" },
      // Hairline
      { cx: 50, cy: 20, r: 14, intensity: 0.72, label: "Hairline blend" },
      // Mouth
      { cx: 50, cy: 62, r: 8, intensity: 0.65, label: "Mouth boundary" }
    ],
    id: [
      // Photo area in the ID card - left side ~15% width, center
      { cx: 15, cy: 50, r: 12, intensity: 0.94, label: "Photo swap" },
      // Text field areas - right side
      { cx: 55, cy: 30, r: 12, intensity: 0.78, label: "Font mismatch" },
      { cx: 55, cy: 60, r: 12, intensity: 0.71, label: "DL# splicing" }
    ],
    scene: [
      // Sky/sun area - upper right
      { cx: 78, cy: 22, r: 14, intensity: 0.88, label: "Lighting inconsistency" },
      // Center foreground
      { cx: 50, cy: 55, r: 18, intensity: 0.82, label: "GAN texture pattern" },
      // Left side shadow area
      { cx: 20, cy: 45, r: 14, intensity: 0.68, label: "Shadow anomaly" }
    ]
  };
  const s = spots[type] || [];
  // Use percentage-based viewBox so heatmap scales to any image size
  const vb = "0 0 100 100";
  return (
    <svg viewBox={vb} preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", mixBlendMode: "multiply" }}>
      <defs>
        {s.map((h, i) => (
          <radialGradient key={i} id={`hm-${type}-${i}`} cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor={`rgba(225,29,72,${0.55 * h.intensity})`} />
            <stop offset="45%" stopColor={`rgba(245,158,11,${0.35 * h.intensity})`} />
            <stop offset="80%" stopColor={`rgba(255,220,120,${0.15 * h.intensity})`} />
            <stop offset="100%" stopColor="rgba(255,220,120,0)" />
          </radialGradient>
        ))}
      </defs>
      {s.map((h, i) => (
        <circle key={i} cx={h.cx} cy={h.cy} r={h.r} fill={`url(#hm-${type}-${i})`} />
      ))}
    </svg>
  );
};

/* ============ SCENARIOS ============ */
const SCENARIOS = {
  face: {
    id: "face",
    title: "Face Swap Deepfake",
    subtitle: "Face swap / AI-generated portrait detection",
    description: "Detects face swaps and fully AI-generated portraits before they reach identity checks. Flags GAN fingerprints, unnatural blending at the jawline and hairline, and lighting/shadow inconsistencies that give away tools like StyleGAN, DeepFaceLab, and FaceSwap - with a verdict, confidence score, and manipulation heatmap in under 500ms.",
    icon: User,
    color: T.violet,
    Image: FaceImage,
    genuineCase: {
      score: 3, verdict: "authentic",
      explanation: "This image shows characteristics consistent with an authentic capture from a mobile camera. Natural skin texture, consistent lighting across facial regions, and no evidence of GAN-based synthesis artifacts. Facial landmarks are anatomically correct and pupil positions align with head pose.",
      signals: [
        { l: "GAN Fingerprint", v: "Not detected", p: true, w: 32 },
        { l: "Face Swap Artifacts", v: "None", p: true, w: 28 },
        { l: "Frequency Analysis", v: "Natural", p: true, w: 22 },
        { l: "Skin Texture", v: "Consistent", p: true, w: 18 },
        { l: "Eye/Pupil Alignment", v: "Anatomical", p: true, w: 15 },
        { l: "Lighting Consistency", v: "Uniform", p: true, w: 12 },
        { l: "Boundary Blending", v: "None", p: true, w: 10 }
      ],
      models: [
        { name: "GAN Detector v4", conf: 0.02, verdict: "REAL" },
        { name: "Face Swap Detector", conf: 0.03, verdict: "REAL" },
        { name: "Frequency Domain Analyzer", conf: 0.04, verdict: "REAL" },
        { name: "Bureau Ensemble Model", conf: 0.03, verdict: "REAL" }
      ],
      hotspots: []
    },
    fraudCase: {
      score: 94, verdict: "deepfake",
      explanation: "High-confidence deepfake detected. Facial landmark warping is inconsistent with real human anatomy — eye asymmetry, unnatural pupil catchlights, and evidence of face-swap seam blending around the hairline and jawline. GAN fingerprints in the frequency domain match known StyleGAN and FaceSwap model outputs.",
      signals: [
        { l: "GAN Fingerprint", v: "StyleGAN v3", p: false, w: 94 },
        { l: "Face Swap Artifacts", v: "Detected", p: false, w: 89 },
        { l: "Frequency Analysis", v: "Synthetic pattern", p: false, w: 91 },
        { l: "Skin Texture", v: "Over-smoothed", p: false, w: 76 },
        { l: "Eye/Pupil Alignment", v: "Asymmetric", p: false, w: 82 },
        { l: "Lighting Consistency", v: "Boundary shift", p: false, w: 68 },
        { l: "Boundary Blending", v: "Seam detected", p: false, w: 85 }
      ],
      models: [
        { name: "GAN Detector v4", conf: 0.96, verdict: "FAKE" },
        { name: "Face Swap Detector", conf: 0.91, verdict: "FAKE" },
        { name: "Frequency Domain Analyzer", conf: 0.94, verdict: "FAKE" },
        { name: "Bureau Ensemble Model", conf: 0.94, verdict: "FAKE" }
      ],
      hotspots: ["Eye artifacts", "Hairline blend", "Mouth boundary"]
    }
  },
  id: {
    id: "id",
    title: "Document Tampering Detection",
    subtitle: "Detect tampered or AI-generated identity documents",
    description: "Catches tampered and AI-generated identity documents used in onboarding fraud. Checks for photo splicing, font manipulation, and mismatched compression artifacts, alongside fully synthetic IDs generated by AI - built for KYC and merchant onboarding flows.",
    icon: FileText,
    color: T.blue,
    Image: IDCardImage,
    genuineCase: {
      score: 4, verdict: "authentic",
      explanation: "Document analysis confirms authentic ID card. Font rendering, security background patterns, and photograph characteristics match issuing authority standards. No evidence of digital tampering, photo splicing, or AI-generated document synthesis.",
      signals: [
        { l: "Photo Tampering", v: "Not detected", p: true, w: 32 },
        { l: "Text Manipulation", v: "None", p: true, w: 28 },
        { l: "Font Consistency", v: "Matches issuer", p: true, w: 24 },
        { l: "Background Pattern", v: "Authentic", p: true, w: 20 },
        { l: "JPEG Ghost Analysis", v: "Uniform", p: true, w: 18 },
        { l: "Metadata", v: "Consistent", p: true, w: 12 },
        { l: "AI Document Synthesis", v: "Not detected", p: true, w: 8 }
      ],
      models: [
        { name: "Doc Tampering Detector", conf: 0.04, verdict: "AUTHENTIC" },
        { name: "Photo Splice Detector", conf: 0.03, verdict: "AUTHENTIC" },
        { name: "AI Doc Generator Detector", conf: 0.05, verdict: "AUTHENTIC" },
        { name: "Bureau Ensemble Model", conf: 0.04, verdict: "AUTHENTIC" }
      ],
      hotspots: []
    },
    fraudCase: {
      score: 91, verdict: "manipulated",
      explanation: "Document shows clear evidence of digital manipulation. Photo region contains splice boundaries inconsistent with original document background. Multiple text fields show font kerning and anti-aliasing patterns inconsistent with rest of document, indicating text-level tampering or AI-generated content overlay.",
      signals: [
        { l: "Photo Tampering", v: "Splice detected", p: false, w: 96 },
        { l: "Text Manipulation", v: "2 fields altered", p: false, w: 88 },
        { l: "Font Consistency", v: "Mismatch", p: false, w: 84 },
        { l: "Background Pattern", v: "Broken", p: false, w: 71 },
        { l: "JPEG Ghost Analysis", v: "Multiple regions", p: false, w: 79 },
        { l: "Metadata", v: "Stripped", p: false, w: 62 },
        { l: "AI Document Synthesis", v: "Partial (SDXL)", p: false, w: 68 }
      ],
      models: [
        { name: "Doc Tampering Detector", conf: 0.93, verdict: "MANIPULATED" },
        { name: "Photo Splice Detector", conf: 0.96, verdict: "MANIPULATED" },
        { name: "AI Doc Generator Detector", conf: 0.72, verdict: "PARTIAL AI" },
        { name: "Bureau Ensemble Model", conf: 0.91, verdict: "MANIPULATED" }
      ],
      hotspots: ["Photo swap", "Font mismatch", "DL# splicing"]
    }
  },
  generic: {
    id: "generic",
    title: "Generic AI Image Detection",
    subtitle: "Detect AI-generated scenes from Midjourney, DALL-E, SDXL, Flux",
    description: "Flags fully AI-generated scenes submitted as real photos - proof of address, proof of funds, damage claims, and more. Bureau's ensemble model detects the frequency-domain signatures left behind by generators like Midjourney, DALL-E, SDXL, and Flux, even when the image looks photorealistic to the eye.",
    icon: ImageIcon,
    color: T.pink,
    Image: SceneImage,
    genuineCase: {
      score: 6, verdict: "authentic",
      explanation: "This image shows characteristics of an authentic photograph. Natural noise patterns, physically consistent lighting and shadows, and no evidence of generative model artifacts. Camera sensor noise profile matches known device fingerprints.",
      signals: [
        { l: "GAN Fingerprint", v: "None", p: true, w: 32 },
        { l: "Diffusion Artifacts", v: "Not detected", p: true, w: 28 },
        { l: "Camera Noise Profile", v: "Natural", p: true, w: 24 },
        { l: "Lighting Consistency", v: "Physical", p: true, w: 18 },
        { l: "Frequency Domain", v: "Photographic", p: true, w: 15 },
        { l: "Shadow Analysis", v: "Consistent", p: true, w: 12 },
        { l: "Metadata EXIF", v: "Camera signature", p: true, w: 8 }
      ],
      models: [
        { name: "Midjourney Detector", conf: 0.03, verdict: "REAL" },
        { name: "DALL-E Detector", conf: 0.05, verdict: "REAL" },
        { name: "SDXL/Flux Detector", conf: 0.06, verdict: "REAL" },
        { name: "Bureau Ensemble Model", conf: 0.06, verdict: "REAL" }
      ],
      hotspots: []
    },
    fraudCase: {
      score: 88, verdict: "ai-generated",
      explanation: "High-confidence AI-generated image detected. Frequency-domain analysis reveals characteristic diffusion model artifacts consistent with Stable Diffusion XL / Flux outputs. Lighting on foreground objects doesn't match sun position, and texture regions show repetitive GAN synthesis patterns typical of latent-space generation.",
      signals: [
        { l: "GAN Fingerprint", v: "SDXL detected", p: false, w: 92 },
        { l: "Diffusion Artifacts", v: "Present", p: false, w: 89 },
        { l: "Camera Noise Profile", v: "Absent", p: false, w: 78 },
        { l: "Lighting Consistency", v: "Physically impossible", p: false, w: 84 },
        { l: "Frequency Domain", v: "Synthetic patterns", p: false, w: 87 },
        { l: "Shadow Analysis", v: "Inconsistent", p: false, w: 71 },
        { l: "Metadata EXIF", v: "Missing/stripped", p: false, w: 64 }
      ],
      models: [
        { name: "Midjourney Detector", conf: 0.34, verdict: "LIKELY REAL" },
        { name: "DALL-E Detector", conf: 0.28, verdict: "LIKELY REAL" },
        { name: "SDXL/Flux Detector", conf: 0.94, verdict: "AI-GENERATED" },
        { name: "Bureau Ensemble Model", conf: 0.88, verdict: "AI-GENERATED" }
      ],
      hotspots: ["Lighting inconsistency", "GAN texture pattern", "Shadow anomaly"]
    }
  }
};

/* ============ MAIN ============ */
export default function BureauDeepfakeDemo() {
  const [reg] = useState(() => detectRegion());
  const ri = RI[reg] || RI.US;
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [time, setTime] = useState("");
  useEffect(() => { const u = () => setTime(new Date().toLocaleTimeString("en-US", { hour12: false, timeZone: tz })); u(); const iv = setInterval(u, 10000); return () => clearInterval(iv); }, [tz]);

  const [activeScenario, setActiveScenario] = useState("face");
  const [fraud, setFraud] = useState(false);
  const [step, setStep] = useState(0); // 0=upload, 1=analyzing, 2=results
  const [heatmapOn, setHeatmapOn] = useState(true);
  const [exp, setExp] = useState({});

  const scenario = SCENARIOS[activeScenario];
  const result = fraud ? scenario.fraudCase : scenario.genuineCase;
  const isFake = fraud;

  useEffect(() => { setStep(0); }, [activeScenario, fraud]);

  const togExp = (k) => setExp(p => ({ ...p, [k]: !p[k] }));

  const runAnalysis = () => {
    setStep(1);
    setTimeout(() => setStep(2), 2400);
  };

  const reset = () => setStep(0);
  const deepfakeSteps = ["Upload", "Analyzing", "Results"];
  const atEnd = step >= 2;

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

  const Img = scenario.Image;

  /* ============ PHONE SCREEN ============ */
  const phoneScreen = () => {
    if (step === 0) {
      // Upload screen
      return (<div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <div style={{ background: T.primary, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <ShieldCheck size={14} color="#fff" />
            <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>Bureau Deepfake Check</span>
          </div>
        </div>
        <div style={{ flex: 1, padding: 16, background: "#fafbfc", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
            {Object.values(SCENARIOS).map((s) => {
              const active = activeScenario === s.id;
              return (
                <div key={s.id} onClick={() => setActiveScenario(s.id)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "7px 3px", borderRadius: 8, background: active ? s.color + "12" : T.white, border: `1px solid ${active ? s.color + "50" : T.border}`, cursor: "pointer" }}>
                  <s.icon size={13} color={active ? s.color : T.t400} />
                  <span style={{ fontSize: 8, fontWeight: s.id === "id" ? 700 : 700, color: active ? s.color : T.t500, textAlign: "center", lineHeight: 1.1 }}>{s.title.replace(" Deepfake", "").replace(" Detection", "")}</span>
                </div>
              );
            })}
          </div>
          <p style={{ fontSize: 13, fontWeight: 700, color: T.t900, marginBottom: 4 }}>{scenario.title}</p>
          <p style={{ fontSize: 10, color: T.t500, marginBottom: 14 }}>{scenario.subtitle}</p>
          <div style={{ flex: 1, border: `2px dashed ${T.border}`, borderRadius: 12, background: T.white, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 14, marginBottom: 12, position: "relative" }}>
            <div style={{ width: 130, height: activeScenario === "face" ? 165 : activeScenario === "id" ? 82 : 90, borderRadius: 8, overflow: "hidden", marginBottom: 12, border: `1px solid ${T.borderLight}` }}>
              <Img genuine={!fraud} />
            </div>
            <p style={{ fontSize: 11, fontWeight: 600, color: T.t700, textAlign: "center" }}>{activeScenario === "face" ? "portrait.jpg" : activeScenario === "id" ? "driver_license.jpg" : "landscape.jpg"}</p>
            <p style={{ fontSize: 9, color: T.t400, marginTop: 2 }}>{activeScenario === "face" ? "1024 × 1024 · 240 KB" : activeScenario === "id" ? "1200 × 800 · 320 KB" : "1920 × 1280 · 480 KB"}</p>
          </div>
          <div onClick={runAnalysis} style={{ padding: 12, borderRadius: 10, background: scenario.color, color: "#fff", textAlign: "center", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <Scan size={14} />Analyze Image
          </div>
        </div>
      </div>);
    }

    if (step === 1) {
      // Analyzing state
      return (<div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#0d1117" }}>
        <div style={{ padding: "12px 16px", background: "#161b22", borderBottom: `1px solid #30363d`, display: "flex", alignItems: "center", gap: 6 }}>
          <Brain size={13} color={scenario.color} />
          <p style={{ color: scenario.color, fontSize: 11, fontWeight: 700 }}>ANALYZING</p>
        </div>
        <div style={{ flex: 1, padding: 16, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 130, height: activeScenario === "face" ? 165 : activeScenario === "id" ? 82 : 90, borderRadius: 8, overflow: "hidden", marginBottom: 20, position: "relative", border: `2px solid ${scenario.color}` }}>
            <Img genuine={!fraud} />
            {/* Scanning line */}
            <div style={{ position: "absolute", left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${scenario.color}, transparent)`, animation: "scanLine 1.6s infinite ease-in-out", boxShadow: `0 0 8px ${scenario.color}` }} />
          </div>
          <p style={{ color: "#fff", fontSize: 12, fontWeight: 700, marginBottom: 14 }}>Running 4 detection models</p>
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 6 }}>
            {result.models.map((m, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", background: "rgba(255,255,255,0.05)", borderRadius: 6, animation: `fadeInText 0.4s ease ${i * 0.4}s both` }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: scenario.color, animation: "pulseAlert 1s infinite" }} />
                <span style={{ fontSize: 9, color: "#c9d1d9", flex: 1 }}>{m.name}</span>
                <Loader size={10} color="#8b949e" style={{ animation: "spin 1s linear infinite" }} />
              </div>
            ))}
          </div>
        </div>
      </div>);
    }

    // Result state
    const verdictColor = isFake ? T.rose : T.emerald;
    const verdictLabel = isFake ? (
      activeScenario === "face" ? "DEEPFAKE" : activeScenario === "id" ? "MANIPULATED" : "AI-GENERATED"
    ) : "AUTHENTIC";
    return (<div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ background: verdictColor, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {isFake ? <XCircle size={14} color="#fff" /> : <ShieldCheck size={14} color="#fff" />}
          <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>{verdictLabel}</span>
        </div>
        <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 10 }}>Score {result.score}/100</span>
      </div>
      <div style={{ flex: 1, padding: 14, background: "#fafbfc", display: "flex", flexDirection: "column" }}>
        <div style={{ position: "relative", borderRadius: 8, overflow: "hidden", marginBottom: 12, border: `1px solid ${T.border}` }}>
          <Img genuine={!fraud} />
          <HeatmapOverlay type={activeScenario} isFake={isFake && heatmapOn} />
          <div style={{ position: "absolute", top: 6, right: 6, padding: "3px 8px", borderRadius: 99, background: "rgba(0,0,0,0.6)", fontSize: 8, color: "#fff", fontWeight: 700, letterSpacing: 0.5 }}>{isFake && heatmapOn ? "HEATMAP" : "ORIGINAL"}</div>
        </div>
        <div onClick={() => setHeatmapOn(!heatmapOn)} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "6px 10px", borderRadius: 6, background: T.white, border: `1px solid ${T.border}`, fontSize: 10, fontWeight: 600, color: T.t700, cursor: "pointer", marginBottom: 8 }}>
          {heatmapOn ? <EyeOff size={11} /> : <Eye size={11} />}
          {heatmapOn ? "Hide" : "Show"} Heatmap
        </div>
        <div style={{ padding: 10, background: isFake ? T.roseBg : T.emeraldBg, borderRadius: 8, border: `1px solid ${verdictColor}30` }}>
          <p style={{ fontSize: 10, color: verdictColor, fontWeight: 700, marginBottom: 2 }}>{isFake ? "Detected" : "No manipulation"}</p>
          <p style={{ fontSize: 9, color: T.t700, lineHeight: 1.4 }}>
            {isFake
              ? (activeScenario === "face" ? "Face swap and GAN artifacts detected in multiple regions" : activeScenario === "id" ? "Photo splice and font tampering detected" : "Diffusion model artifacts and lighting inconsistencies")
              : "Image analysis passed all checks. Safe to accept."}
          </p>
        </div>
      </div>
    </div>);
  };

  /* ============ OVERVIEW BODY ============ */
  const overviewBody = (<div>
        <p style={{ fontSize: 10, fontWeight: 700, color: T.t400, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 8 }}>Choose a Scenario</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 16 }}>
          {Object.values(SCENARIOS).map((s) => (
            <div key={s.id} onClick={() => setActiveScenario(s.id)} style={{ background: activeScenario === s.id ? s.color + "10" : T.white, borderRadius: 8, padding: 10, border: `1px solid ${activeScenario === s.id ? s.color + "40" : T.border}`, cursor: "pointer", transition: "all 0.15s", display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 22, height: 22, borderRadius: 5, background: s.color + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><s.icon size={12} color={s.color} /></div>
              <p style={{ fontSize: 11, fontWeight: 700, color: T.t900 }}>{s.title.replace(" Deepfake", "").replace(" Detection", "")}</p>
            </div>
          ))}
        </div>

        <div style={{ background: T.bg, borderRadius: 12, padding: 16, border: `1px solid ${T.border}`, lineHeight: 1.7, marginBottom: 16 }}>
          <p style={{ fontSize: 12, color: T.t500 }}>{scenario.description}</p>
        </div>

        <p style={{ fontSize: 10, fontWeight: 700, color: T.t400, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 8 }}>What You'll See in Results</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
          {[
            { i: Target, l: "Verdict + Score", d: "Yes/No with a score" },
            { i: MessageSquare, l: "Explanation", d: "Why the model made this decision" },
            { i: Grid3x3, l: "Heatmap", d: "Which regions were flagged" }
          ].map((c, i) => (
            <div key={i} style={{ background: T.white, borderRadius: 8, padding: 10, border: `1px solid ${T.border}`, textAlign: "center" }}>
              <div style={{ width: 30, height: 30, borderRadius: 6, background: T.primaryBg || (T.primary + "12"), display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 6px" }}><c.i size={15} color={T.primary} /></div>
              <p style={{ fontSize: 10, fontWeight: 700 }}>{c.l}</p>
              <p style={{ fontSize: 9, color: T.t500, marginTop: 2 }}>{c.d}</p>
            </div>
          ))}
        </div>

      </div>);

  /* ============ RESULTS PANEL ============ */
  const rightPanel = () => {
    if (step === 1) {
      // Analyzing
      return (<div>
        <div style={{ background: scenario.color + "08", borderRadius: 12, padding: 24, border: `1px solid ${scenario.color}30`, textAlign: "center", marginBottom: 12 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: scenario.color + "18", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", animation: "pulseAlert 1.5s infinite" }}>
            <Brain size={26} color={scenario.color} />
          </div>
          <p style={{ fontSize: 15, fontWeight: 700, color: T.t900, marginBottom: 4 }}>Analyzing Image</p>
          <p style={{ fontSize: 11, color: T.t500 }}>Running Bureau's ensemble of 4 detection models...</p>
        </div>
        <div>
          {result.models.map((m, i) => (
            <div key={i} style={{ background: T.white, borderRadius: 8, padding: 12, border: `1px solid ${T.border}`, marginBottom: 6, display: "flex", alignItems: "center", gap: 10, animation: `fadeInText 0.4s ease ${i * 0.4}s both` }}>
              <div style={{ width: 32, height: 32, borderRadius: 6, background: scenario.color + "12", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Cpu size={14} color={scenario.color} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 12, fontWeight: 600 }}>{m.name}</p>
                <div style={{ height: 3, background: T.borderLight, borderRadius: 2, marginTop: 6, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: "100%", background: scenario.color, animation: `progressBar 1.5s ease ${i * 0.4}s both` }} />
                </div>
              </div>
              <Loader size={14} color={T.t400} style={{ animation: "spin 1s linear infinite" }} />
            </div>
          ))}
        </div>
      </div>);
    }

    // Results
    const verdictColor = isFake ? T.rose : T.emerald;
    const verdictLabel = isFake ? (
      activeScenario === "face" ? "DEEPFAKE DETECTED" : activeScenario === "id" ? "DOCUMENT MANIPULATED" : "AI-GENERATED IMAGE"
    ) : "AUTHENTIC IMAGE";

    return (<div>
      {/* 1. VERDICT + SCORE */}
      <div style={{ background: isFake ? T.roseBg : T.emeraldBg, borderRadius: 12, padding: 16, border: `1px solid ${verdictColor}30`, marginBottom: 12, display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {isFake ? <XCircle size={30} color={T.rose} /> : <ShieldCheck size={30} color={T.emerald} />}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 15, fontWeight: 800, color: verdictColor }}>{verdictLabel}</p>
          <p style={{ fontSize: 11, color: T.t700, marginTop: 2 }}>{isFake ? "Do not accept this image" : "Safe to proceed"}</p>
        </div>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 28, fontWeight: 800, color: verdictColor, lineHeight: 1 }}>{result.score}</p>
          <p style={{ fontSize: 9, color: T.t400 }}>/ 100</p>
        </div>
      </div>

      {/* 2. EXPLANATION */}
      <ESection title="Explanation" icon={MessageSquare} color={T.primary}>
        <div style={{ paddingTop: 8 }}>
          <p style={{ fontSize: 12, color: T.t700, lineHeight: 1.6 }}>{result.explanation}</p>
          {isFake && result.hotspots.length > 0 && (
            <div style={{ marginTop: 10, padding: 10, background: T.roseBg, borderRadius: 8, border: `1px solid ${T.rose}20` }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: T.rose, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Key Manipulation Regions</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {result.hotspots.map((h, i) => (
                  <span key={i} style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 6, background: "#fff", color: T.rose, border: `1px solid ${T.rose}30` }}>{h}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </ESection>

      {/* 3. HEATMAP */}
      <ESection title="Manipulation Heatmap" icon={Grid3x3} color={T.pink}>
        <div style={{ paddingTop: 8 }}>
          <p style={{ fontSize: 11, color: T.t500, marginBottom: 8 }}>Regions flagged by our detection ensemble. Red/orange indicates highest manipulation confidence.</p>
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <div style={{ flex: 1, position: "relative", borderRadius: 8, overflow: "hidden", border: `1px solid ${T.border}`, aspectRatio: activeScenario === "face" ? "4/5" : activeScenario === "id" ? "5/3" : "3/2" }}>
              <Img genuine={!fraud} />
              <div style={{ position: "absolute", top: 6, left: 6, padding: "3px 8px", borderRadius: 4, background: "rgba(255,255,255,0.9)", fontSize: 9, fontWeight: 700, color: T.t700 }}>ORIGINAL</div>
            </div>
            <div style={{ flex: 1, position: "relative", borderRadius: 8, overflow: "hidden", border: `1px solid ${T.border}`, aspectRatio: activeScenario === "face" ? "4/5" : activeScenario === "id" ? "5/3" : "3/2" }}>
              <Img genuine={!fraud} />
              <HeatmapOverlay type={activeScenario} isFake={isFake} />
              <div style={{ position: "absolute", top: 6, left: 6, padding: "3px 8px", borderRadius: 4, background: "rgba(0,0,0,0.75)", fontSize: 9, fontWeight: 700, color: "#fff" }}>HEATMAP</div>
            </div>
          </div>
          {/* Heatmap legend */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: 8, background: T.bg, borderRadius: 6, border: `1px solid ${T.border}` }}>
            <span style={{ fontSize: 9, color: T.t500 }}>Confidence:</span>
            <div style={{ flex: 1, height: 8, borderRadius: 4, background: "linear-gradient(90deg, rgba(255,220,120,0.6), rgba(245,158,11,0.7), rgba(225,29,72,0.85))" }} />
            <span style={{ fontSize: 9, color: T.t400 }}>Low</span>
            <span style={{ fontSize: 9, color: T.rose, fontWeight: 700 }}>High</span>
          </div>
          {!isFake && (
            <div style={{ marginTop: 8, padding: 10, background: T.emeraldBg, borderRadius: 8, border: `1px solid ${T.emerald}20`, textAlign: "center" }}>
              <p style={{ fontSize: 11, color: T.emerald, fontWeight: 600 }}>✓ No manipulation regions detected</p>
            </div>
          )}
        </div>
      </ESection>

      {/* 4. Detection signals */}
      <ESection title="Detection Signals" icon={Fingerprint} color={T.violet}>
        <div style={{ paddingTop: 8 }}>
          {result.signals.map((s, i) => (
            <div key={i} style={{ marginBottom: i < result.signals.length - 1 ? 8 : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: T.t700 }}>{s.l}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ fontSize: 10, fontWeight: 600, color: s.p ? T.emerald : T.rose }}>{s.v}</span>
                  {s.p ? <CheckCircle size={11} color={T.emerald} /> : <XCircle size={11} color={T.rose} />}
                </div>
              </div>
              <div style={{ height: 4, background: T.borderLight, borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${s.w}%`, background: s.p ? T.emerald : T.rose, transition: "width 0.6s" }} />
              </div>
            </div>
          ))}
        </div>
      </ESection>

      {/* 5. Ensemble breakdown */}
      <ESection title="Model Ensemble" icon={Layers} color={T.blue}>
        <div style={{ paddingTop: 8 }}>
          <p style={{ fontSize: 10, color: T.t500, marginBottom: 10 }}>Four specialized models evaluate every image. Bureau's ensemble reconciles their outputs.</p>
          {result.models.map((m, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", background: i === result.models.length - 1 ? T.primary + "08" : T.bg, borderRadius: 8, marginBottom: 4, border: i === result.models.length - 1 ? `1px solid ${T.primary}30` : `1px solid ${T.border}` }}>
              <div style={{ width: 26, height: 26, borderRadius: 5, background: i === result.models.length - 1 ? T.primary + "18" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${T.borderLight}` }}>
                {i === result.models.length - 1 ? <Sparkles size={12} color={T.primary} /> : <Cpu size={12} color={T.t500} />}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 11, fontWeight: i === result.models.length - 1 ? 700 : 600 }}>{m.name}{i === result.models.length - 1 && <span style={{ fontSize: 8, fontWeight: 700, marginLeft: 6, padding: "1px 5px", borderRadius: 3, background: T.primary + "20", color: T.primary }}>ENSEMBLE</span>}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: m.conf > 0.5 ? T.rose : T.emerald }}>{(m.conf * 100).toFixed(0)}%</p>
                <p style={{ fontSize: 8, color: T.t400 }}>{m.verdict}</p>
              </div>
            </div>
          ))}
        </div>
      </ESection>

      {/* 6. JSON */}
      <ESection title="API Response" icon={FileText} color={T.t700} defaultOpen={false}>
        <div style={{ paddingTop: 8 }}>
          <pre style={{ background: "#0d1117", borderRadius: 8, padding: 12, fontSize: 9, color: "#c9d1d9", lineHeight: 1.5, fontFamily: T.mono, overflow: "auto", maxHeight: 260, margin: 0 }}>{JSON.stringify({
            status: "success",
            request_id: "df_" + Math.random().toString(36).substring(2, 12),
            type: activeScenario,
            verdict: result.verdict,
            score: result.score / 100,
            is_deepfake: isFake,
            confidence: (isFake ? Math.max(...result.models.map(m => m.conf)) : Math.min(...result.models.map(m => m.conf))).toFixed(3),
            models: result.models.reduce((acc, m) => ({ ...acc, [m.name.toLowerCase().replace(/[^a-z0-9]/g, "_")]: { confidence: m.conf, verdict: m.verdict } }), {}),
            manipulation_regions: result.hotspots,
            heatmap_url: isFake ? "https://api.bureau.id/v1/deepfake/heatmap/df_xyz.png" : null,
            processing_time_ms: 387
          }, null, 2)}</pre>
        </div>
      </ESection>
    </div>);
  };

  const phoneWithFx = (
    <>
      <style>{`@keyframes scanLine{0%{top:0;}50%{top:calc(100% - 2px);}100%{top:0;}}@keyframes fadeInText{from{opacity:0;transform:translateY(4px);}to{opacity:1;transform:translateY(0);}}@keyframes pulseAlert{0%,100%{transform:scale(1);opacity:1;}50%{transform:scale(1.05);opacity:0.85;}}@keyframes progressBar{from{width:0;}to{width:100%;}}`}</style>
      {phoneScreen()}
    </>
  );

  return (
    <DemoShell
      badge="Deepfake Detection"
      overviewTitle="AI Image & Deepfake Detection"
      overview={overviewBody}
      journeySteps={deepfakeSteps}
      currentStep={Math.min(step, deepfakeSteps.length - 1)}
      phone={phoneWithFx}
      results={rightPanel()}
      hasResults={step >= 2}
      fraud={fraud}
      onToggleFraud={() => setFraud(!fraud)}
      nextLabel={atEnd ? "Request Demo" : "Analyze Image"}
      nextDisabled={step === 1}
      nextIsRequestDemo={atEnd}
      onNext={() => { if (step === 0) runAnalysis(); }}
      onBack={reset}
      onReset={reset}
    />
  );
}
