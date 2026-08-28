"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Shield, XCircle, Smartphone, Globe, MapPin, Fingerprint, Bot, Gift, Navigation,
  Clock, Lock, Play, RotateCcw, Monitor, Cpu, Radio, PhoneCall, Layers, Zap,
  AlertOctagon, Activity, Send, DollarSign, Wifi, Battery, Signal as SignalIcon,
  Bell, QrCode, ArrowDownLeft, Car, Code, Table2, ChevronDown, Eye,
  ChevronLeft, ChevronRight
} from "lucide-react";
import { DemoShell } from "@/components/demo-shell";

/* ═══ DESIGN TOKENS (matching live site) ═══ */
const T = {
  primary: "#253B80", primaryHover: "#1a2d5a",
  violet: "#7C3AED", violetBg: "rgba(139,92,246,0.1)",
  rose: "#E11D48", roseBg: "rgba(225,29,72,0.08)",
  amber: "#D97706", amberBg: "rgba(217,119,6,0.08)",
  emerald: "#059669", emeraldBg: "rgba(5,150,105,0.08)",
  blue: "#2563EB", blueBg: "rgba(37,99,235,0.08)",
  bg: "#f5f7fa", white: "#ffffff", border: "#e5e7eb", borderLight: "#f3f4f6",
  t900: "#111827", t700: "#374151", t500: "#6b7280", t400: "#9ca3af", t300: "#d1d5db",
  mono: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace",
  sans: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

/* ═══ GEO-DETECTION ═══ */
function detectRegion() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (/Kolkata|Mumbai|Chennai|Calcutta|Delhi/.test(tz)) return "IN";
    if (/Singapore|Kuala_Lumpur|Jakarta|Bangkok|Manila|Ho_Chi_Minh/.test(tz)) return "SEA";
    if (/Tokyo|Seoul/.test(tz)) return "SEA";
    return "US";
  } catch { return "US"; }
}

function getRegionMeta(r) {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  const tzCity = tz.split("/").pop().replace(/_/g, " ");
  const stateMap = { Denver: "CO", Chicago: "IL", "New York": "NY", "Los Angeles": "CA", Phoenix: "AZ", Houston: "TX", Dallas: "TX", "San Francisco": "CA", Seattle: "WA", Boston: "MA", Miami: "FL", Atlanta: "GA", Detroit: "MI", Minneapolis: "MN", "Kansas City": "MO", Indianapolis: "IN", Boise: "ID", Anchorage: "AK", Honolulu: "HI", Kolkata: "WB", Mumbai: "MH", Chennai: "TN", Delhi: "DL", Bengaluru: "KA", Singapore: "", "Kuala Lumpur": "", Jakarta: "", Bangkok: "", Manila: "", "Ho Chi Minh": "" };
  const cityLabel = tzCity;
  const m = {
    US: { flag: "🇺🇸", country: "United States", city: cityLabel || "United States", currency: "$", tz },
    IN: { flag: "🇮🇳", country: "India", city: cityLabel || "India", currency: "₹", tz },
    SEA: { flag: "🇸🇬", country: "Southeast Asia", city: cityLabel || "Singapore", currency: "S$", tz },
  };
  return m[r] || m.US;
}

/* ═══ REGION DATA PACKS ═══ */
const regionData = {
  US: {
    ato: {
      user: { name: "Marcus Thompson", email: "m.thompson@outlook.com", phone: "+1 (415) 839-2741", loc: "San Francisco, CA" },
      device: { Device: "iPhone 15 Pro", OS: "iOS 18.2", IP: "185.220.101.34", Location: "Lagos, Nigeria", FP: "bf7e2a91" },
      transferTo: "wire-acct-ng@payments.net", amount: "$12,400", balance: "$4,281.50",
      txns: [{ n: "Amazon", a: "-$67.99", t: "Today" }, { n: "John D.", a: "+$250.00", t: "Yesterday" }, { n: "Uber", a: "-$23.40", t: "Apr 21" }],
    },
    bot: {
      user: { name: "Alex Rivera", email: "alex.r.2026@proton.me", phone: "+1 (332) 000-8847", loc: "New York, NY" },
      device: { Device: "iPhone SE (Emulated)", OS: "iOS 17.5", IP: "104.28.45.12", Location: "Ashburn, VA (DC)", FP: "00000000" },
    },
    promo: {
      user: { name: "Jordan Lee", email: "j.lee.new2026@gmail.com", phone: "+1 (628) 555-0199", loc: "Austin, TX" },
      device: { Device: "iPhone 15 Pro", OS: "iOS 18.2", IP: "73.162.48.201", Location: "Austin, TX", FP: "a3f8c201" },
      promoCode: "WELCOME50", subtotal: "$89.99", discount: "-$44.99", total: "$45.00",
    },
    location: {
      user: { name: "Chris Walker", email: "c.walker@yahoo.com", phone: "+1 (512) 774-3382", loc: "Dallas, TX" },
      device: { Device: "iPhone 14", OS: "iOS 17.5", IP: "103.87.56.12", Location: "Dhaka, BD", FP: "d9e1f042" },
      reportedCity: "Dallas, TX", impossibleTravel: "Dallas→LA→NYC→Miami→Chicago",
    },
  },
  IN: {
    ato: {
      user: { name: "Rajesh Sharma", email: "r.sharma@gmail.com", phone: "+91 98765 43210", loc: "Mumbai, MH" },
      device: { Device: "iPhone 15 Pro", OS: "iOS 18.2", IP: "185.220.101.34", Location: "Lagos, Nigeria", FP: "bf7e2a91" },
      transferTo: "wire-acct-ng@payments.net", amount: "₹10,35,000", balance: "₹3,56,420.00",
      txns: [{ n: "Flipkart", a: "-₹5,699", t: "Today" }, { n: "Rahul M.", a: "+₹21,000", t: "Yesterday" }, { n: "Swiggy", a: "-₹840", t: "Apr 21" }],
    },
    bot: {
      user: { name: "Amit Patel", email: "amit.p.2026@proton.me", phone: "+91 70001 88847", loc: "Bengaluru, KA" },
      device: { Device: "iPhone SE (Emulated)", OS: "iOS 17.5", IP: "49.36.128.11", Location: "AWS Mumbai (DC)", FP: "00000000" },
    },
    promo: {
      user: { name: "Priya Gupta", email: "p.gupta.new2026@gmail.com", phone: "+91 62800 55019", loc: "Delhi, DL" },
      device: { Device: "iPhone 15 Pro", OS: "iOS 18.2", IP: "122.172.83.201", Location: "Delhi, DL", FP: "a3f8c201" },
      promoCode: "NEWUSER50", subtotal: "₹1,499", discount: "-₹750", total: "₹749",
    },
    location: {
      user: { name: "Suresh Kumar", email: "s.kumar@yahoo.in", phone: "+91 98100 33382", loc: "Hyderabad, TG" },
      device: { Device: "iPhone 14", OS: "iOS 17.5", IP: "103.87.56.12", Location: "Dhaka, BD", FP: "d9e1f042" },
      reportedCity: "Hyderabad, TG", impossibleTravel: "Hyderabad→Mumbai→Delhi→Chennai→Kolkata",
    },
  },
  SEA: {
    ato: {
      user: { name: "Wei Lin Tan", email: "wl.tan@gmail.com", phone: "+65 9123 4567", loc: "Singapore" },
      device: { Device: "iPhone 15 Pro", OS: "iOS 18.2", IP: "185.220.101.34", Location: "Lagos, Nigeria", FP: "bf7e2a91" },
      transferTo: "wire-acct-ng@payments.net", amount: "S$16,800", balance: "S$5,742.80",
      txns: [{ n: "Shopee", a: "-S$89.90", t: "Today" }, { n: "Chen W.", a: "+S$3,200", t: "Yesterday" }, { n: "Grab", a: "-S$32.50", t: "Apr 21" }],
    },
    bot: {
      user: { name: "Budi Santoso", email: "b.santoso.2026@proton.me", phone: "+62 812 3456 7890", loc: "Jakarta, ID" },
      device: { Device: "iPhone SE (Emulated)", OS: "iOS 17.5", IP: "103.28.45.12", Location: "AWS SG (DC)", FP: "00000000" },
    },
    promo: {
      user: { name: "Maria Santos", email: "m.santos.new2026@gmail.com", phone: "+63 917 123 4567", loc: "Manila, PH" },
      device: { Device: "iPhone 15 Pro", OS: "iOS 18.2", IP: "120.28.48.201", Location: "Manila, PH", FP: "a3f8c201" },
      promoCode: "SEAWELCOME", subtotal: "₱4,999", discount: "-₱2,500", total: "₱2,499",
    },
    location: {
      user: { name: "Nguyen Van", email: "nv.driver@yahoo.com", phone: "+84 903 123 456", loc: "Ho Chi Minh, VN" },
      device: { Device: "iPhone 14", OS: "iOS 17.5", IP: "103.87.56.12", Location: "Dhaka, BD", FP: "d9e1f042" },
      reportedCity: "Ho Chi Minh City", impossibleTravel: "HCMC→Hanoi→Bangkok→KL→Singapore",
    },
  },
};

/* ═══ SIGNAL DEFINITIONS (shared across regions) ═══ */
const signalDefs = {
  ato: [
    { label: "New Device", value: "Never seen on this account", status: "fail", detail: "Zero prior sessions for this fingerprint" },
    { label: "Jailbroken Device", value: "Jailbreak detected", status: "fail", detail: "Cydia installed · checkra1n active" },
    { label: "TOR Network", value: "Exit node detected", status: "fail", detail: "Known TOR relay — anonymized origin" },
    { label: "Impossible Travel", value: "Origin mismatch detected", status: "fail", detail: "Physically impossible in timeframe" },
    { label: "Active Voice Call", value: "Phone call during session", status: "fail", detail: "Social engineering / vishing indicator" },
    { label: "Multi-Account Device", value: "3 other accounts linked", status: "fail", detail: "Multiple identities on same device" },
  ],
  bot: [
    { label: "Emulator", value: "iOS Simulator detected", status: "fail", detail: "Xcode Simulator · virtual GPU drivers" },
    { label: "Sideloaded App", value: "Not from App Store", status: "fail", detail: "Enterprise certificate · unsigned binary" },
    { label: "Input Speed", value: "8ms avg (human: 280ms)", status: "fail", detail: "35x faster than human capability" },
    { label: "No Sensors", value: "Zero accelerometer data", status: "fail", detail: "No gyroscope · no magnetometer" },
    { label: "Session Velocity", value: "47 signups in 24 hours", status: "fail", detail: "Same fingerprint across all sessions" },
    { label: "Click Pattern", value: "Deterministic coordinates", status: "fail", detail: "Zero jitter · pixel-perfect clicks" },
  ],
  promo: [
    { label: "Repeat Device", value: "11 accounts on this device", status: "fail", detail: "Serial abuse pattern detected" },
    { label: "Factory Reset", value: "Reset 2 hours ago", status: "fail", detail: "Identity cycling pattern detected" },
    { label: "App Clone", value: "Parallel space active", status: "fail", detail: "Dual-app environment · cloned instance" },
    { label: "No SIM", value: "WiFi-only device", status: "warn", detail: "Common in promo abuse setups" },
    { label: "Promo Velocity", value: "11 promos claimed", status: "fail", detail: "Welcome offers extracted in 7 days" },
    { label: "Disposable Email", value: "Created 4 min ago", status: "fail", detail: "Throwaway email pattern detected" },
  ],
  location: [
    { label: "Mock GPS", value: "FakeGPS Pro active", status: "fail", detail: "Injected coordinates detected" },
    { label: "Geo Mismatch", value: "GPS ≠ IP location", status: "fail", detail: "Significant distance discrepancy" },
    { label: "VPN Active", value: "NordVPN exit node", status: "fail", detail: "Masking true network origin" },
    { label: "Impossible Travel", value: "5+ cities in 4 hours", status: "fail", detail: "Physically impossible movement" },
    { label: "USB Debug", value: "ADB enabled", status: "warn", detail: "Developer mode · automation risk" },
    { label: "Tampered App", value: "Signature mismatch", status: "fail", detail: "Repackaged binary detected" },
  ],
};

const scores = { ato: 92, bot: 97, promo: 91, location: 88 };
const verdicts = { ato: "BLOCK — Step-Up Authentication Required", bot: "BLOCK — Automated Bot Detected", promo: "DENY PROMO — Flag for Review", location: "BLOCK — Location Fraud Confirmed" };
const stepLabels = { ato: ["Sign In", "Detect Signals", "Block Transaction"], bot: ["Open & Fill Form", "Detect Signals", "Block Signup"], promo: ["Welcome & Sign Up", "Detect & Apply Promo", "Deny Promo"], location: ["Real Location", "Spoof Location", "Detect Signals", "Block Trip"] };
const ucTotalSteps = { ato: 3, bot: 3, promo: 3, location: 4 };

/* ═══ ALL SIGNALS DATA ═══ */
const allSignals = [
  { cat: "Device Identity", signals: [
    { key: "deviceFingerprint", label: "Device Fingerprint", value: "a3f8c201-7b4e-9d12-ef56", status: "ok" },
    { key: "deviceModel", label: "Device Model", value: "iPhone 15 Pro Max", status: "ok" },
    { key: "osVersion", label: "OS Version", value: "iOS 18.2.1", status: "ok" },
    { key: "screenResolution", label: "Screen Resolution", value: "2796 × 1290", status: "ok" },
    { key: "deviceAge", label: "Device First Seen", value: "2024-11-14", status: "ok" },
    { key: "deviceLastSeen", label: "Device Last Seen", value: "Today", status: "ok" },
  ]},
  { cat: "Device Integrity", signals: [
    { key: "rooted", label: "Root / Jailbreak", value: "Not Detected", status: "ok" },
    { key: "emulator", label: "Emulator", value: "Not Detected", status: "ok" },
    { key: "appClone", label: "App Clone / Dual Space", value: "Not Detected", status: "ok" },
    { key: "factoryReset", label: "Factory Reset", value: "No Recent Reset", status: "ok" },
    { key: "devMode", label: "Developer Mode", value: "Disabled", status: "ok" },
    { key: "frida", label: "Frida / Xposed", value: "Not Detected", status: "ok" },
    { key: "appTampering", label: "App Tampering", value: "Original Binary", status: "ok" },
    { key: "sideloaded", label: "Sideloaded App", value: "Installed from App Store", status: "ok" },
  ]},
  { cat: "Network Intelligence", signals: [
    { key: "ipAddress", label: "IP Address", value: "73.162.48.201", status: "ok" },
    { key: "ipGeo", label: "IP Geolocation", value: "Auto-detected", status: "ok" },
    { key: "vpn", label: "VPN Detection", value: "No VPN", status: "ok" },
    { key: "tor", label: "TOR Detection", value: "No TOR", status: "ok" },
    { key: "proxy", label: "Proxy Detection", value: "No Proxy", status: "ok" },
    { key: "networkType", label: "Network Type", value: "WiFi", status: "ok" },
    { key: "datacenter", label: "Data Center IP", value: "No — Residential", status: "ok" },
  ]},
  { cat: "Behavioral Signals", signals: [
    { key: "accelerometer", label: "Accelerometer", value: "Active — Normal Range", status: "ok" },
    { key: "gyroscope", label: "Gyroscope", value: "Active — Normal Range", status: "ok" },
    { key: "inputSpeed", label: "Avg Input Speed", value: "312ms (Normal)", status: "ok" },
    { key: "scrollPattern", label: "Scroll Pattern", value: "Human — Variable", status: "ok" },
    { key: "sessionDuration", label: "Session Duration", value: "4m 23s", status: "ok" },
    { key: "focusBlur", label: "Focus / Blur Events", value: "2 tab switches", status: "ok" },
    { key: "clickCoords", label: "Click Coordinates", value: "Natural Variance", status: "ok" },
    { key: "voiceCall", label: "Voice Call Active", value: "No Active Call", status: "ok" },
  ]},
  { cat: "Location Signals", signals: [
    { key: "gps", label: "GPS Coordinates", value: "Auto-detected", status: "ok" },
    { key: "mockGps", label: "Mock Location", value: "Not Detected", status: "ok" },
    { key: "gpsIpMatch", label: "GPS ↔ IP Match", value: "Match — Same Region", status: "ok" },
    { key: "impossibleTravel", label: "Impossible Travel", value: "No Flags", status: "ok" },
  ]},
  { cat: "Identity Linkage", signals: [
    { key: "multiAccount", label: "Multi-Account", value: "1 Account on Device", status: "ok" },
    { key: "sessionCount", label: "Session Count", value: "47 sessions (90 days)", status: "ok" },
    { key: "simStatus", label: "SIM Status", value: "Active SIM Present", status: "ok" },
  ]},
  { cat: "Risk Assessment", signals: [
    { key: "riskScore", label: "Overall Risk Score", value: "12 / 100", status: "ok" },
    { key: "riskLevel", label: "Risk Level", value: "LOW", status: "ok" },
    { key: "riskCauses", label: "Risk Causes", value: "None", status: "ok" },
    { key: "recommendation", label: "Recommended Action", value: "ALLOW", status: "ok" },
  ]},
];

/* ═══ TABS ═══ */
const tabs = [
  { id: "ato", label: "Account Takeover", subtitle: "New device, jailbreak & impossible travel", icon: Fingerprint, color: T.rose },
  { id: "bot", label: "Bot Detection", subtitle: "Emulators, scripts & automated signups", icon: Bot, color: T.violet },
  { id: "promo", label: "Promo Abuse", subtitle: "Repeat devices claiming welcome offers", icon: Gift, color: T.amber },
  { id: "location", label: "Location Spoofing", subtitle: "Mock GPS & impossible travel patterns", icon: Navigation, color: T.blue },
  { id: "all", label: "All Signals", subtitle: "Full signal payload from a clean session", icon: Layers, color: T.emerald },
];

/* ═══ SVG PAYPAL LOGO ═══ */
const PPLogo = ({ size = 80, white = false }) => (
  <svg viewBox="0 0 124 33" width={size} height={size * 0.27}>
    <path d="M46.211 6.749h-6.839a.95.95 0 0 0-.939.802l-2.766 17.537a.57.57 0 0 0 .564.658h3.265a.95.95 0 0 0 .939-.803l.746-4.73a.95.95 0 0 1 .938-.803h2.165c4.505 0 7.105-2.18 7.784-6.5.306-1.89.013-3.375-.872-4.415-.972-1.142-2.696-1.746-4.985-1.746zM47 13.154c-.374 2.454-2.249 2.454-4.062 2.454h-1.032l.724-4.583a.57.57 0 0 1 .563-.481h.473c1.235 0 2.4 0 3.002.704.359.42.469 1.044.332 1.906zM66.654 13.075h-3.275a.57.57 0 0 0-.563.481l-.145.916-.229-.332c-.709-1.029-2.29-1.373-3.868-1.373-3.619 0-6.71 2.741-7.312 6.586-.313 1.918.132 3.752 1.22 5.031.998 1.176 2.426 1.666 4.125 1.666 2.916 0 4.533-1.875 4.533-1.875l-.146.91a.57.57 0 0 0 .562.66h2.95a.95.95 0 0 0 .939-.804l1.77-11.209a.568.568 0 0 0-.561-.657zm-4.565 6.374c-.316 1.871-1.801 3.127-3.695 3.127-.951 0-1.711-.305-2.199-.883-.484-.574-.668-1.392-.514-2.301.295-1.855 1.805-3.152 3.67-3.152.93 0 1.686.309 2.184.892.499.589.697 1.411.554 2.317zM84.096 13.075h-3.291a.954.954 0 0 0-.787.417l-4.539 6.686-1.924-6.425a.953.953 0 0 0-.912-.678h-3.234a.57.57 0 0 0-.541.754l3.625 10.638-3.408 4.811a.57.57 0 0 0 .465.9h3.287a.949.949 0 0 0 .781-.408l10.946-15.8a.57.57 0 0 0-.468-.895z" fill={white ? "#fff" : "#253B80"} />
    <path d="M94.992 6.749h-6.84a.95.95 0 0 0-.938.802l-2.766 17.537a.569.569 0 0 0 .562.658h3.51a.665.665 0 0 0 .656-.562l.785-4.971a.95.95 0 0 1 .938-.803h2.164c4.506 0 7.105-2.18 7.785-6.5.307-1.89.012-3.375-.873-4.415-.971-1.142-2.694-1.746-4.983-1.746zm.789 6.405c-.373 2.454-2.248 2.454-4.062 2.454h-1.031l.725-4.583a.568.568 0 0 1 .562-.481h.473c1.234 0 2.4 0 3.002.704.359.42.468 1.044.331 1.906zM115.434 13.075h-3.273a.567.567 0 0 0-.562.481l-.145.916-.23-.332c-.709-1.029-2.289-1.373-3.867-1.373-3.619 0-6.709 2.741-7.311 6.586-.312 1.918.131 3.752 1.219 5.031 1 1.176 2.426 1.666 4.125 1.666 2.916 0 4.533-1.875 4.533-1.875l-.146.91a.57.57 0 0 0 .564.66h2.949a.95.95 0 0 0 .938-.804l1.771-11.209a.571.571 0 0 0-.565-.657zm-4.565 6.374c-.314 1.871-1.801 3.127-3.695 3.127-.949 0-1.711-.305-2.199-.883-.484-.574-.666-1.392-.514-2.301.297-1.855 1.805-3.152 3.67-3.152.931 0 1.686.309 2.184.892.501.589.699 1.411.554 2.317zM119.295 7.23l-2.807 17.858a.569.569 0 0 0 .562.658h2.822a.949.949 0 0 0 .939-.803l2.768-17.536a.57.57 0 0 0-.562-.659h-3.16a.571.571 0 0 0-.562.482z" fill={white ? "rgba(255,255,255,0.7)" : "#179BD7"} />
    <path d="M7.266 29.154l.523-3.322-1.165-.027H1.061L4.927 1.292a.316.316 0 0 1 .314-.268h9.38c3.114 0 5.263.648 6.385 1.927.526.6.861 1.227 1.023 1.917.17.724.173 1.589.007 2.644l-.012.077v.676l.526.298a3.69 3.69 0 0 1 1.065.812c.45.513.741 1.165.864 1.938.127.795.085 1.741-.123 2.812-.24 1.232-.628 2.305-1.152 3.183a6.547 6.547 0 0 1-1.825 2c-.696.494-1.523.869-2.458 1.109-.906.236-1.939.355-3.072.355h-.73a2.21 2.21 0 0 0-2.183 1.866l-.055.299-.924 5.855-.042.215c-.011.068-.03.102-.058.125a.155.155 0 0 1-.096.035H7.266z" fill={white ? "#fff" : "#253B80"} />
    <path d="M23.048 7.667c-.028.179-.06.362-.096.55-1.237 6.351-5.469 8.545-10.874 8.545H9.326c-.661 0-1.218.48-1.321 1.132L6.596 26.83l-.399 2.533a.704.704 0 0 0 .695.814h4.881c.578 0 1.069-.42 1.159-.99l.048-.248.919-5.832.059-.32c.09-.572.582-.992 1.16-.992h.73c4.729 0 8.431-1.92 9.513-7.476.452-2.321.218-4.259-.978-5.622a4.667 4.667 0 0 0-1.336-1.03z" fill={white ? "rgba(255,255,255,0.7)" : "#179BD7"} />
    <path d="M21.754 7.151a9.757 9.757 0 0 0-1.203-.267 15.284 15.284 0 0 0-2.426-.177H11.41a1.16 1.16 0 0 0-1.16.992L8.703 17.231l-.05.316a1.348 1.348 0 0 1 1.321-1.132h2.752c5.405 0 9.637-2.195 10.874-8.545.037-.188.068-.371.096-.55a6.344 6.344 0 0 0-.942-.409 9.036 9.036 0 0 0-1-.26z" fill={white ? "rgba(255,255,255,0.5)" : "#222D65"} />
  </svg>
);

/* ═══ PP ICON ONLY ═══ */
const PPIcon = ({ size = 24, white = false }) => (
  <svg viewBox="0 0 24 28" width={size} height={size * 1.17}>
    <path d="M20.067 8.478c.492.876.706 1.981.557 3.316-.82 4.215-3.9 6.132-8.432 6.132h-.902a1.44 1.44 0 0 0-1.422 1.218l-.932 5.908-.264 1.672a.62.62 0 0 0 .612.716h4.19c.622 0 1.15-.452 1.248-1.064l.051-.264.988-6.264.064-.346c.098-.612.626-1.064 1.248-1.064h.786c5.084 0 9.068-2.066 10.23-8.04.486-2.494.234-4.577-1.052-6.042a5.025 5.025 0 0 0-1.438-1.108c-.294 1.754-.96 3.196-2.01 4.33A8.685 8.685 0 0 1 20.067 8.478z" fill={white ? "rgba(255,255,255,0.5)" : "#179BD7"} transform="scale(0.7) translate(-2, 2)" />
    <path d="M7.686 0.122h9.994c3.312 0 5.6.69 6.792 2.05a4.847 4.847 0 0 1 1.09 2.04c.18.77.184 1.69.008 2.812-.02.132-.042.27-.068.412a6.344 6.344 0 0 0-.942-.41 9.036 9.036 0 0 0-1-.26 15.284 15.284 0 0 0-2.426-.176H14.42a1.16 1.16 0 0 0-1.16.992L11.712 14.6l-.984 6.242-.054.324a1.348 1.348 0 0 1-1.321 1.132H4.462L7.372.39A.34.34 0 0 1 7.686.122z" fill={white ? "#fff" : "#253B80"} transform="scale(0.7) translate(-2, 2)" />
  </svg>
);

/* ═══ PHONE COMPONENTS ═══ */
const StatusBar = () => {
  const [time, setTime] = useState("");
  useEffect(() => { const u = () => setTime(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })); u(); const iv = setInterval(u, 10000); return () => clearInterval(iv); }, []);
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 20px 4px", fontSize: 11, fontWeight: 600, color: "#1a1a1a" }}>
      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.3 }}>{time}</span>
      <div style={{ width: 72, height: 22, borderRadius: 16, background: "#1a1a1a" }} />
      <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
        <SignalIcon size={11} /><Wifi size={11} />
        <div style={{ width: 18, height: 9, borderRadius: 2, border: "1.5px solid #1a1a1a", position: "relative", display: "flex", alignItems: "center", padding: 1 }}>
          <div style={{ width: "75%", height: "100%", borderRadius: 1, background: "#1a1a1a" }} />
          <div style={{ position: "absolute", right: -3, width: 2, height: 5, borderRadius: "0 1px 1px 0", background: "#1a1a1a" }} />
        </div>
      </div>
    </div>
  );
};
const BottomNav = ({ active = "home" }) => (
  <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", padding: "6px 0 2px", borderTop: `1px solid ${T.border}`, background: "#fff" }}>
    {[{ id: "home", icon: "⌂", label: "Home" }, { id: "send", icon: "↗", label: "Send" }, { id: "wallet", icon: "◫", label: "Wallet" }, { id: "activity", icon: "◷", label: "Activity" }].map(n => (
      <div key={n.id} style={{ textAlign: "center", opacity: active === n.id ? 1 : 0.4, fontSize: 14 }}>
        <span>{n.icon}</span>
        <p style={{ fontSize: 8, fontWeight: active === n.id ? 700 : 500, color: active === n.id ? T.primary : T.t400, marginTop: 1 }}>{n.label}</p>
      </div>
    ))}
  </div>
);
const Phone = ({ children }) => (
  <div style={{ position: "relative", width: 266, height: 546, flexShrink: 0 }}>
    {/* Power button — right side */}
    <div style={{ position: "absolute", right: -2.5, top: 130, width: 3, height: 40, borderRadius: "0 2px 2px 0", background: "#2a2a2a", boxShadow: "1px 0 2px rgba(0,0,0,0.3)" }} />
    {/* Volume up — left side */}
    <div style={{ position: "absolute", left: -2.5, top: 110, width: 3, height: 28, borderRadius: "2px 0 0 2px", background: "#2a2a2a", boxShadow: "-1px 0 2px rgba(0,0,0,0.3)" }} />
    {/* Volume down — left side */}
    <div style={{ position: "absolute", left: -2.5, top: 148, width: 3, height: 28, borderRadius: "2px 0 0 2px", background: "#2a2a2a", boxShadow: "-1px 0 2px rgba(0,0,0,0.3)" }} />
    {/* Silent switch — left side */}
    <div style={{ position: "absolute", left: -2.5, top: 80, width: 3, height: 14, borderRadius: "2px 0 0 2px", background: "#2a2a2a", boxShadow: "-1px 0 2px rgba(0,0,0,0.3)" }} />
    {/* Phone body */}
    <div style={{ width: 260, height: 540, borderRadius: 36, background: "linear-gradient(145deg, #2a2a2a 0%, #1a1a1a 50%, #2a2a2a 100%)", padding: 3, boxShadow: "0 20px 60px rgba(0,0,0,0.25), 0 0 0 0.5px rgba(255,255,255,0.12) inset, inset 0 1px 1px rgba(255,255,255,0.05)", margin: "0 auto" }}>
      {/* Inner bezel */}
      <div style={{ width: "100%", height: "100%", borderRadius: 33, background: "#000", padding: 2 }}>
        {/* Screen */}
        <div style={{ width: "100%", height: "100%", borderRadius: 31, background: "#fff", overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <StatusBar />
          <div style={{ flex: 1, overflow: "hidden" }}>{children}</div>
          {/* Home indicator */}
          <div style={{ padding: "5px 0 7px", display: "flex", justifyContent: "center", background: "#fff" }}>
            <div style={{ width: 100, height: 4, borderRadius: 2, background: "#d1d5db" }} />
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* ─── PHONE SCREENS ─── */
const LoginScreen = ({ s, rd }) => (
  <div style={{ background: "#fff", height: "100%", display: "flex", flexDirection: "column" }}>
    <div style={{ flex: 1, padding: "0 20px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <PPLogo size={100} />
        <p style={{ fontSize: 11, color: T.t500, marginTop: 10 }}>Log in to your account</p>
      </div>
      <div style={{ marginBottom: 14 }}>
        <label style={{ fontSize: 10, fontWeight: 600, color: T.t700, display: "block", marginBottom: 4 }}>Email or mobile number</label>
        <div style={{ padding: "10px 12px", borderRadius: 8, border: `1.5px solid ${s >= 1 ? "#009CDE" : T.border}`, fontSize: 12, color: T.t900, background: s >= 1 ? "#f0f9ff" : "#fff", transition: "all 0.4s", minHeight: 16, letterSpacing: -0.2 }}>{s >= 1 ? rd.user.email : ""}</div>
      </div>
      <div style={{ marginBottom: 18 }}>
        <label style={{ fontSize: 10, fontWeight: 600, color: T.t700, display: "block", marginBottom: 4 }}>Password</label>
        <div style={{ padding: "10px 12px", borderRadius: 8, border: `1.5px solid ${s >= 2 ? "#009CDE" : T.border}`, fontSize: 12, color: T.t900, background: s >= 2 ? "#f0f9ff" : "#fff", transition: "all 0.4s", minHeight: 16, letterSpacing: 2 }}>{s >= 2 ? "••••••••••" : ""}</div>
      </div>
      <div style={{ padding: 12, borderRadius: 24, background: s >= 3 ? T.primary : "#009CDE", color: "#fff", textAlign: "center", fontSize: 14, fontWeight: 700, transition: "all 0.3s", cursor: "pointer" }}>Log In</div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "16px 0" }}>
        <div style={{ flex: 1, height: 1, background: T.border }} /><span style={{ fontSize: 10, color: T.t400 }}>or</span><div style={{ flex: 1, height: 1, background: T.border }} />
      </div>
      <div style={{ padding: 10, borderRadius: 24, border: `1.5px solid ${T.primary}`, color: T.primary, textAlign: "center", fontSize: 13, fontWeight: 600 }}>Sign Up</div>
    </div>
    <p style={{ fontSize: 9, color: T.t400, textAlign: "center", padding: "8px 0" }}>Forgot email or password?</p>
  </div>
);
const DashScreen = ({ rd }) => (
  <div style={{ background: "#fff", height: "100%", display: "flex", flexDirection: "column" }}>
    <div style={{ background: T.primary, padding: "12px 16px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <PPLogo size={72} white />
        <Bell size={18} color="#fff" />
      </div>
      <p style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", marginBottom: 2 }}>Your balance</p>
      <p style={{ fontSize: 28, fontWeight: 800, color: "#fff", letterSpacing: -1 }}>{rd.balance}</p>
    </div>
    <div style={{ display: "flex", justifyContent: "space-around", padding: "14px 10px", borderBottom: `1px solid ${T.borderLight}` }}>
      {[{ i: Send, t: "Send", c: "#009CDE" }, { i: ArrowDownLeft, t: "Request", c: T.primary }, { i: QrCode, t: "Scan", c: "#00457C" }].map((b, j) => (
        <div key={j} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: b.c + "12", display: "flex", alignItems: "center", justifyContent: "center" }}><b.i size={18} color={b.c} /></div>
          <span style={{ fontSize: 10, fontWeight: 600, color: T.t700 }}>{b.t}</span>
        </div>
      ))}
    </div>
    <div style={{ flex: 1, padding: "10px 16px", overflowY: "auto" }}>
      <p style={{ fontSize: 12, fontWeight: 700, color: T.t900, marginBottom: 8 }}>Recent Activity</p>
      {rd.txns.map((tx, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${T.borderLight}` }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: `hsl(${i * 80 + 200}, 40%, 94%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: `hsl(${i * 80 + 200}, 50%, 40%)` }}>{tx.n.charAt(0)}</div>
            <div><p style={{ fontSize: 12, fontWeight: 600, color: T.t900 }}>{tx.n}</p><p style={{ fontSize: 9, color: T.t400 }}>{tx.t}</p></div>
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: tx.a.startsWith("+") ? T.emerald : T.t900 }}>{tx.a}</span>
        </div>
      ))}
    </div>
    <BottomNav active="home" />
  </div>
);
const TransferScreen = ({ rd, blocked }) => (
  <div style={{ background: "#fff", height: "100%", display: "flex", flexDirection: "column" }}>
    <div style={{ background: T.primary, padding: "10px 16px", display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 18 }}>‹</span>
      <span style={{ color: "#fff", fontSize: 14, fontWeight: 700, flex: 1 }}>Send Money</span>
      <PPIcon size={18} white />
    </div>
    <div style={{ flex: 1, padding: 16 }}>
      <div style={{ background: T.bg, borderRadius: 12, padding: 14, marginBottom: 12, border: `1px solid ${T.border}` }}>
        <p style={{ fontSize: 9, color: T.t400, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Recipient</p>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: blocked ? T.roseBg : "#FFE0E0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: blocked ? T.rose : "#C53030" }}>N</div>
          <div>
            <p style={{ fontSize: 12, fontWeight: 700 }}>New Beneficiary</p>
            <p style={{ fontSize: 9, color: T.t400, fontFamily: T.mono }}>{rd.transferTo}</p>
          </div>
        </div>
      </div>
      <div style={{ textAlign: "center", padding: "20px 0", marginBottom: 12 }}>
        <p style={{ fontSize: 9, color: T.t400, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Amount</p>
        <p style={{ fontSize: 36, fontWeight: 800, color: T.t900, letterSpacing: -1 }}>{rd.amount}</p>
        <p style={{ fontSize: 10, color: T.t400 }}>Wire Transfer</p>
      </div>
      <div style={{ padding: 13, borderRadius: 24, background: blocked ? T.rose : "#009CDE", color: "#fff", textAlign: "center", fontSize: 14, fontWeight: 700, transition: "all 0.4s" }}>
        {blocked ? "⚠ Transaction Blocked" : `Send ${rd.amount}`}
      </div>
      {blocked && <p style={{ fontSize: 9, color: T.rose, textAlign: "center", marginTop: 8 }}>Bureau flagged this session as high risk</p>}
    </div>
  </div>
);
const SignupScreen = ({ s, blocked }) => (
  <div style={{ background: "#fff", height: "100%", display: "flex", flexDirection: "column" }}>
    <div style={{ padding: "16px 20px 0", textAlign: "center" }}>
      <PPLogo size={80} />
      <p style={{ fontSize: 11, color: T.t500, marginTop: 6, marginBottom: 14 }}>Create your account</p>
    </div>
    <div style={{ flex: 1, padding: "0 20px", overflowY: "auto" }}>
      {[{ l: "Email address", v: s >= 1 ? "alex.r.2026@proton.me" : "" }, { l: "Full name", v: s >= 1 ? "Alex Rivera" : "" }, { l: "Mobile number", v: s >= 1 ? "+1 (332) 000-8847" : "" }, { l: "Password", v: s >= 1 ? "••••••••" : "" }].map((f, i) => (
        <div key={i} style={{ marginBottom: 10 }}>
          <label style={{ fontSize: 9, fontWeight: 600, color: T.t500, display: "block", marginBottom: 3 }}>{f.l}</label>
          <div style={{ padding: "9px 11px", borderRadius: 8, border: `1.5px solid ${f.v ? "#009CDE" : T.border}`, fontSize: 11, color: T.t900, background: f.v ? "#f0f9ff" : "#fff", transition: "all 0.3s", minHeight: 14 }}>{f.v}</div>
        </div>
      ))}
      {s >= 1 && <div style={{ fontSize: 9, color: T.rose, textAlign: "center", fontFamily: T.mono, padding: "4px 8px", background: T.roseBg, borderRadius: 6, marginBottom: 6 }}>⚡ All fields completed in 1.2 seconds</div>}
      <div style={{ padding: 12, borderRadius: 24, background: blocked ? T.rose : "#009CDE", color: "#fff", textAlign: "center", fontSize: 13, fontWeight: 700, transition: "all 0.3s", marginTop: 6 }}>
        {blocked ? "⚠ Signup Blocked" : "Agree & Create Account"}
      </div>
      <p style={{ fontSize: 8, color: T.t400, textAlign: "center", lineHeight: 1.4, marginTop: 8 }}>By signing up, you agree to PayPal's User Agreement, Privacy Statement, and Cookie Policy.</p>
    </div>
  </div>
);
const PromoWelcomeScreen = () => (
  <div style={{ background: `linear-gradient(180deg, #003087 0%, #0070BA 50%, #009CDE 100%)`, height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 24, position: "relative" }}>
    <div style={{ position: "absolute", top: 16, right: 16, opacity: 0.15 }}>
      <PPIcon size={60} white />
    </div>
    <PPLogo size={110} white />
    <div style={{ marginTop: 24, textAlign: "center" }}>
      <p style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", marginBottom: 6, fontWeight: 500 }}>Welcome! New users get</p>
      <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "10px 24px", marginBottom: 6 }}>
        <p style={{ fontSize: 28, fontWeight: 800, color: "#FFC43A", letterSpacing: -0.5 }}>50% OFF</p>
      </div>
      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>on your first purchase</p>
    </div>
    <div style={{ padding: "12px 32px", borderRadius: 24, background: "#FFC43A", color: "#003087", fontSize: 14, fontWeight: 700, marginTop: 24, cursor: "pointer" }}>Get Started</div>
    <div style={{ marginTop: 14, padding: "4px 12px", borderRadius: 6, background: "rgba(255,255,255,0.1)" }}>
      <p style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", fontFamily: T.mono }}>Code: WELCOME50</p>
    </div>
  </div>
);
const CheckoutScreen = ({ rd, blocked }) => (
  <div style={{ background: "#fff", height: "100%", display: "flex", flexDirection: "column" }}>
    <div style={{ background: T.primary, padding: "10px 16px", display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 18 }}>‹</span>
      <span style={{ color: "#fff", fontSize: 14, fontWeight: 700, flex: 1 }}>Checkout</span>
      <PPIcon size={18} white />
    </div>
    <div style={{ flex: 1, padding: 16 }}>
      <div style={{ background: T.bg, borderRadius: 12, padding: 14, marginBottom: 14, border: `1px solid ${T.border}` }}>
        <p style={{ fontSize: 9, color: T.t400, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Order Summary</p>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><span style={{ fontSize: 12, color: T.t500 }}>Subtotal</span><span style={{ fontSize: 12, fontWeight: 600 }}>{rd.subtotal}</span></div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, padding: "4px 8px", background: T.emeraldBg, borderRadius: 6 }}>
          <span style={{ fontSize: 11, color: T.emerald, fontWeight: 600 }}>🏷 {rd.promoCode}</span><span style={{ fontSize: 11, fontWeight: 700, color: T.emerald }}>{rd.discount}</span>
        </div>
        <div style={{ borderTop: `1.5px solid ${T.border}`, paddingTop: 8, display: "flex", justifyContent: "space-between", marginTop: 4 }}>
          <span style={{ fontSize: 14, fontWeight: 800 }}>Total</span><span style={{ fontSize: 14, fontWeight: 800 }}>{rd.total}</span>
        </div>
      </div>
      <div style={{ background: T.bg, borderRadius: 12, padding: 12, marginBottom: 14, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 10 }}>
        <PPIcon size={20} /><div><p style={{ fontSize: 11, fontWeight: 600 }}>Pay with PayPal</p><p style={{ fontSize: 9, color: T.t400 }}>Balance: sufficient</p></div>
      </div>
      <div style={{ padding: 13, borderRadius: 24, background: blocked ? T.amber : "#FFC43A", color: blocked ? "#fff" : "#003087", textAlign: "center", fontSize: 14, fontWeight: 700, transition: "all 0.3s" }}>
        {blocked ? "⚠ Promo Denied" : `Pay ${rd.total}`}
      </div>
      {blocked && <p style={{ fontSize: 9, color: T.amber, textAlign: "center", marginTop: 8 }}>Promo abuse detected — coupon invalidated</p>}
    </div>
  </div>
);
const MapScreen = ({ rd, blocked, spoofed = false }) => (
  <div style={{ background: "#dbeafe", height: "100%", position: "relative" }}>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(135deg,#cfe2f3 0%,#dbeafe 30%,#bfdbfe 60%,#dbeafe 100%)" }}>
      {Array.from({ length: 8 }).map((_, i) => <div key={`h${i}`} style={{ position: "absolute", top: i * 52, left: 0, right: 0, height: 1, background: "rgba(0,0,0,0.04)" }} />)}
      {Array.from({ length: 6 }).map((_, i) => <div key={`v${i}`} style={{ position: "absolute", left: i * 50, top: 0, bottom: 0, width: 1, background: "rgba(0,0,0,0.04)" }} />)}
      <div style={{ position: "absolute", top: "30%", left: "20%", width: "60%", height: 3, background: "rgba(0,0,0,0.08)", borderRadius: 2, transform: "rotate(25deg)" }} />
      <div style={{ position: "absolute", top: "50%", left: "10%", width: "50%", height: 3, background: "rgba(0,0,0,0.08)", borderRadius: 2, transform: "rotate(-15deg)" }} />
      {/* Real location pin */}
      {!spoofed && <div style={{ position: "absolute", top: "36%", left: "48%", transform: "translate(-50%,-50%)", textAlign: "center" }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(37,59,128,0.15)", display: "flex", alignItems: "center", justifyContent: "center", animation: "pulse 2s infinite" }}>
          <MapPin size={20} color={T.primary} fill={T.primary} />
        </div>
        <div style={{ background: "#fff", padding: "2px 8px", borderRadius: 4, marginTop: 3, boxShadow: "0 1px 4px rgba(0,0,0,0.1)", display: "inline-block" }}>
          <p style={{ fontSize: 8, fontWeight: 700, color: T.t900, whiteSpace: "nowrap" }}>{rd.reportedCity}</p>
        </div>
      </div>}
      {/* Spoofed: show both real (dimmed) and fake (bright) */}
      {spoofed && <>
        <div style={{ position: "absolute", top: "55%", left: "30%", transform: "translate(-50%,-50%)", textAlign: "center", opacity: 0.35 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(37,59,128,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <MapPin size={14} color={T.t400} />
          </div>
          <div style={{ background: "#fff", padding: "1px 5px", borderRadius: 3, marginTop: 2, display: "inline-block" }}>
            <p style={{ fontSize: 7, color: T.t400, whiteSpace: "nowrap" }}>Real: {rd.reportedCity}</p>
          </div>
        </div>
        <div style={{ position: "absolute", top: "32%", left: "60%", transform: "translate(-50%,-50%)", textAlign: "center" }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: blocked ? "rgba(225,29,72,0.2)" : "rgba(217,119,6,0.2)", display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${blocked ? "rgba(225,29,72,0.3)" : "rgba(217,119,6,0.3)"}` }}>
            <MapPin size={20} color={blocked ? T.rose : T.amber} fill={blocked ? T.rose : T.amber} />
          </div>
          <div style={{ background: "#fff", padding: "2px 8px", borderRadius: 4, marginTop: 3, boxShadow: "0 1px 4px rgba(0,0,0,0.1)", display: "inline-block" }}>
            <p style={{ fontSize: 8, fontWeight: 700, color: blocked ? T.rose : T.amber, whiteSpace: "nowrap" }}>{blocked ? "⚠ Spoofed" : "📍 Fake GPS"}</p>
          </div>
        </div>
        <div style={{ position: "absolute", top: "44%", left: "44%", width: 50, height: 1, background: T.amber, transform: "rotate(-35deg)", borderTop: "1px dashed " + T.amber }} />
      </>}
    </div>
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "#fff", borderRadius: "16px 16px 0 0", padding: 14, boxShadow: "0 -4px 20px rgba(0,0,0,0.08)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: blocked ? T.roseBg : spoofed ? T.amberBg : T.primary + "10", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Car size={18} color={blocked ? T.rose : spoofed ? T.amber : T.primary} />
        </div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: blocked ? T.rose : spoofed ? T.amber : T.t900 }}>{blocked ? "Location Flagged" : spoofed ? "Spoofing Detected" : "Delivery in Progress"}</p>
          <p style={{ fontSize: 10, color: T.t400 }}>{blocked ? "GPS coordinates spoofed" : spoofed ? "FakeGPS Pro active on device" : "2.3 km to destination"}</p>
        </div>
      </div>
      <div style={{ padding: 11, borderRadius: 24, background: blocked ? T.rose : spoofed ? T.amber : T.emerald, color: "#fff", textAlign: "center", fontSize: 13, fontWeight: 700 }}>{blocked ? "⚠ Trip Blocked" : spoofed ? "⚠ Mock GPS Detected" : "Mark as Arrived"}</div>
    </div>
  </div>
);
const SplashScreen = ({ loaded, running }) => (
  <div style={{ background: `linear-gradient(180deg, #003087 0%, #001C4E 100%)`, height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 24, position: "relative" }}>
    <div style={{ position: "absolute", top: "15%", opacity: 0.06 }}><PPIcon size={120} white /></div>
    <PPLogo size={110} white />
    <p style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 6, marginBottom: 36, letterSpacing: 2, textTransform: "uppercase", fontWeight: 600 }}>Secure Payments</p>
    {!running && !loaded ? (
      <>
        <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Shield size={22} color="rgba(255,255,255,0.3)" />
        </div>
        <p style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 16 }}>Waiting for Bureau SDK…</p>
      </>
    ) : !loaded ? (
      <>
        <div style={{ width: 44, height: 44, borderRadius: "50%", border: "2.5px solid rgba(255,255,255,0.15)", borderTopColor: "#009CDE", animation: "spin 0.8s linear infinite" }} />
        <p style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", marginTop: 16 }}>Initializing Bureau SDK…</p>
      </>
    ) : (
      <>
        <div style={{ width: 44, height: 44, borderRadius: "50%", background: T.emerald, display: "flex", alignItems: "center", justifyContent: "center", animation: "scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1)", boxShadow: "0 0 20px rgba(5,150,105,0.4)" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
        </div>
        <p style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", marginTop: 16, fontWeight: 600 }}>SDK Initialized · Signals Loaded</p>
      </>
    )}
  </div>
);

/* ═══ SIGNAL CARD ═══ */
const SigCard = ({ s, show }) => {
  const fail = s.status === "fail";
  return (
    <div style={{ opacity: show ? 1 : 0, transform: show ? "translateX(0)" : "translateX(12px)", transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)", background: fail ? T.roseBg : T.amberBg, borderLeft: `3px solid ${fail ? T.rose : T.amber}`, borderRadius: 8, padding: "9px 11px", marginBottom: 5 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 1 }}>
        <span style={{ fontSize: 11.5, fontWeight: 600, color: T.t900 }}>{s.label}</span>
        <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 3, background: fail ? T.rose : T.amber, color: "#fff", textTransform: "uppercase" }}>{fail ? "FAIL" : "WARN"}</span>
      </div>
      <div style={{ fontSize: 11, fontWeight: 600, color: fail ? T.rose : T.amber }}>{s.value}</div>
      <div style={{ fontSize: 10, color: T.t500, marginTop: 1 }}>{s.detail}</div>
    </div>
  );
};

/* ═══ GAUGE ═══ */
const Gauge = ({ score, go }) => {
  const [n, setN] = useState(0);
  useEffect(() => { if (!go) { setN(0); return; } let c = 0; const iv = setInterval(() => { c++; if (c >= score) { clearInterval(iv); setN(score); } else setN(c); }, 20); return () => clearInterval(iv); }, [score, go]);
  const col = n >= 80 ? T.rose : n >= 50 ? T.amber : T.emerald;
  const circ = 2 * Math.PI * 44;
  return (
    <div style={{ textAlign: "center" }}>
      <svg width="100" height="100" viewBox="0 0 96 96"><circle cx="48" cy="48" r="44" fill="none" stroke={T.border} strokeWidth="5" /><circle cx="48" cy="48" r="44" fill="none" stroke={col} strokeWidth="5" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ - (n / 100) * circ} transform="rotate(-90 48 48)" style={{ transition: "all 0.2s" }} /><text x="48" y="45" textAnchor="middle" style={{ fontSize: 22, fontWeight: 700, fill: col }}>{n}</text><text x="48" y="59" textAnchor="middle" style={{ fontSize: 9, fill: T.t400 }}>/ 100</text></svg>
      <p style={{ fontSize: 9, fontWeight: 700, color: col, textTransform: "uppercase", letterSpacing: 1.2, marginTop: 2 }}>{n >= 80 ? "Critical" : "Low"}</p>
    </div>
  );
};

/* ═══════════════════════════════════════
   MAIN EXPORT
   ═���══════════════════════════���═════════���������� */
function BureauDeviceIntelDemoInner() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const validTabs = ["ato", "bot", "promo", "location", "all"];
  const initialTab = tabParam && validTabs.includes(tabParam) ? tabParam : "ato";

  const [region, setRegion] = useState("US");
  const [regMeta, setRegMeta] = useState(getRegionMeta("US"));
  const [uc, setUc] = useState(initialTab);
  const [mStep, setMStep] = useState(0); // manual step: 0=idle, 1..N=journey
  const [showG, setShowG] = useState(false);
  const [showV, setShowV] = useState(false);
  const [allView, setAllView] = useState("table");
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [running, setRunning] = useState(false);

  useEffect(() => { const r = detectRegion(); setRegion(r); setRegMeta(getRegionMeta(r)); }, []);

  const rd = regionData[region]?.[uc] || regionData.US.ato;
  const sigs = signalDefs[uc] || [];
  const totalSteps = uc === "all" ? 2 : (ucTotalSteps[uc] || 3);

  // Which step shows signals and which shows verdict for each use case
  const signalStep = { ato: 2, bot: 2, promo: 2, location: 3 };
  const verdictStep = { ato: 3, bot: 3, promo: 3, location: 4 };

  const reset = useCallback(() => {
    setMStep(0); setShowG(false); setShowV(false); setSdkLoaded(false); setRunning(false);
  }, []);
  useEffect(() => { reset(); }, [uc, reset]);

  const goNext = useCallback(() => {
    if (mStep >= totalSteps) return;
    const next = mStep + 1;
    setMStep(next);
    if (uc === "all") {
      if (next === 1) setRunning(true);
      if (next === 2) setSdkLoaded(true);
      return;
    }
    setRunning(true);
    if (next === verdictStep[uc]) { setShowG(true); setTimeout(() => setShowV(true), 600); }
  }, [mStep, totalSteps, uc]);

  const goBack = useCallback(() => {
    if (mStep <= 0) return;
    const prev = mStep - 1;
    if (prev === 0) { reset(); return; }
    setMStep(prev);
    if (uc === "all") {
      if (prev === 1) { setRunning(true); setSdkLoaded(false); }
      return;
    }
    if (prev < verdictStep[uc]) { setShowG(false); setShowV(false); }
  }, [mStep, uc, reset]);

  /* Phone screen per use case and step */
  const phone = () => {
    if (uc === "all") return <SplashScreen loaded={sdkLoaded} running={running} />;
    const r = regionData[region]?.[uc] || regionData.US[uc];

    if (uc === "ato") {
      if (mStep === 0) return <LoginScreen s={0} rd={r} />;
      if (mStep === 1) return <LoginScreen s={3} rd={r} />;
      if (mStep === 2) return <DashScreen rd={r} />;
      return <TransferScreen rd={r} blocked={showV} />;
    }
    if (uc === "bot") {
      if (mStep === 0) return <SignupScreen s={0} blocked={false} />;
      if (mStep === 1) return <SignupScreen s={1} blocked={false} />;
      if (mStep === 2) return <SignupScreen s={1} blocked={false} />;
      return <SignupScreen s={1} blocked={true} />;
    }
    if (uc === "promo") {
      if (mStep === 0) return <PromoWelcomeScreen />;
      if (mStep === 1) return <CheckoutScreen rd={r} blocked={false} />;
      if (mStep === 2) return <CheckoutScreen rd={r} blocked={false} />;
      return <CheckoutScreen rd={r} blocked={true} />;
    }
    if (uc === "location") {
      if (mStep === 0) return <MapScreen rd={r} blocked={false} spoofed={false} />;
      if (mStep === 1) return <MapScreen rd={r} blocked={false} spoofed={false} />;
      if (mStep === 2) return <MapScreen rd={r} blocked={false} spoofed={true} />;
      if (mStep === 3) return <MapScreen rd={r} blocked={false} spoofed={true} />;
      return <MapScreen rd={r} blocked={true} spoofed={true} />;
    }
    return null;
  };

  // Whether to show signals on right
  const showSignals = uc !== "all" && mStep >= signalStep[uc];
  const showVerdict = uc !== "all" && mStep >= verdictStep[uc];

  /* Build JSON for all signals */
  const allSignalsJson = {};
  allSignals.forEach(cat => { cat.signals.forEach(s => { allSignalsJson[s.key] = s.value; }); });


  const journeySteps = uc === "all" ? ["Invoke SDK", "All Signals"] : (stepLabels[uc] || []);
  const currentStep = Math.min(Math.max(mStep - 1, 0), Math.max(journeySteps.length - 1, 0));
  const atEnd = mStep >= totalSteps;
  const hasResults = uc === "all" ? sdkLoaded : showSignals;
  const ucDesc = {
    ato: "Bureau's Device Intelligence SDK detects 100+ signals in real time to catch account takeover before damage occurs - new device fingerprints, jailbreak, TOR usage, impossible travel, and active voice calls signaling social engineering.",
    bot: "Bureau catches automated bot activity at the device level, before bots reach your app logic - flagging emulated environments, inhuman input speeds, deterministic click patterns, and missing sensor data in real time.",
    promo: "Bureau stops promo abuse by fingerprinting devices across accounts. Serial abusers cycle through factory resets, app clones, and disposable emails - Bureau's persistent fingerprint catches repeat offenders even when everything else changes.",
    location: "Bureau detects GPS spoofing and location fraud in real time - critical for ride-hailing and delivery. It cross-validates GPS against IP geolocation, cell tower, and Wi-Fi signals to catch fake-GPS apps instantly.",
    all: "Explore the complete Bureau SDK response for a clean session — every device, network, behavioral, and location signal Bureau collects, with the full JSON payload and final risk assessment.",
  };

  const overviewBody = (
    <div>
      <p style={{ fontSize: 10, fontWeight: 700, color: T.t400, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 8 }}>Choose a Scenario</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 16 }}>
        {tabs.map(t => {
          const active = uc === t.id;
          return (
            <div key={t.id} onClick={() => setUc(t.id)} style={{ background: active ? t.color + "10" : T.white, borderRadius: 8, padding: 10, border: `1px solid ${active ? t.color + "40" : T.border}`, cursor: "pointer", transition: "all 0.15s", display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 22, height: 22, borderRadius: 5, background: t.color + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <t.icon size={12} color={t.color} />
              </div>
              <p style={{ fontSize: 11, fontWeight: 700, color: T.t900 }}>{t.label}</p>
            </div>
          );
        })}
      </div>
      <div style={{ background: T.bg, borderRadius: 12, padding: 16, border: `1px solid ${T.border}`, lineHeight: 1.7, marginBottom: 16 }}>
        <p style={{ fontSize: 11, color: T.t500 }}>{ucDesc[uc]}</p>
        {uc !== "all" && <p style={{ fontSize: 11, color: T.t500, marginTop: 10 }}>One SDK. Sub-second detection. Zero friction for genuine users - for iOS, Android, Web, or Bureau's White-Label UI Platform.</p>}
      </div>
    </div>
  );

  const resultsBody = uc === "all" ? (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, gap: 8 }}>
        <div>
          <p style={{ fontSize: 15, fontWeight: 800, color: T.t900, margin: 0 }}>Bureau SDK Response</p>
          <p style={{ fontSize: 11, color: T.t500, marginTop: 2 }}>Complete signal payload from a clean session</p>
        </div>
        <div style={{ display: "flex", background: T.bg, borderRadius: 6, border: `1px solid ${T.border}`, overflow: "hidden", flexShrink: 0 }}>
          <button onClick={() => setAllView("table")} style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 12px", fontSize: 11, fontWeight: 600, border: "none", cursor: "pointer", fontFamily: "inherit", background: allView === "table" ? T.primary : "transparent", color: allView === "table" ? "#fff" : T.t500 }}><Table2 size={13} />Table</button>
          <button onClick={() => setAllView("json")} style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 12px", fontSize: 11, fontWeight: 600, border: "none", cursor: "pointer", fontFamily: "inherit", background: allView === "json" ? T.primary : "transparent", color: allView === "json" ? "#fff" : T.t500 }}><Code size={13} />JSON</button>
        </div>
      </div>
      {allView === "table" ? (
        <div>{allSignals.map((cat, ci) => (<div key={ci} style={{ marginBottom: 16 }}><p style={{ fontSize: 10, fontWeight: 700, color: T.t400, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 6, paddingBottom: 4, borderBottom: `1px solid ${T.border}` }}>{cat.cat}</p><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, columnGap: 20 }}>{cat.signals.map((s, si) => (<div key={si} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", borderRadius: 6, background: T.bg, border: `1px solid ${T.borderLight}` }}><span style={{ fontSize: 11, color: T.t500 }}>{s.label}</span><span style={{ fontSize: 10, fontWeight: 600, color: s.status === "ok" ? T.emerald : T.rose, fontFamily: T.mono }}>{s.value}</span></div>))}</div></div>))}</div>
      ) : (
        <div style={{ background: T.t900, borderRadius: 10, padding: 18, overflow: "auto" }}>
          <pre style={{ fontFamily: T.mono, fontSize: 11, color: "#a5f3fc", lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap" }}>{`{
  "statusCode": 200, "riskScore": 12, "riskLevel": "LOW", "recommendation": "ALLOW",
  "sessionId": "s_clean_session",
  "latency": "187ms",
  "deviceIdentity": { "fingerprint": "a3f8c201", "model": "iPhone 15 Pro Max", "os": "iOS 18.2.1" },
  "deviceIntegrity": { "rooted": false, "emulator": false, "appClone": false, "factoryReset": false },
  "network": { "vpnDetected": false, "torDetected": false, "proxyDetected": false },
  "behavioral": { "accelerometer": "active", "inputSpeed": "312ms", "voiceCallActive": false },
  "location": { "mockLocation": false, "gpsIpMatch": true, "impossibleTravel": false },
  "identity": { "multiAccount": false, "accountsOnDevice": 1 }, "riskCauses": []
}`}</pre>
        </div>
      )}
    </div>
  ) : (
    <div>
      <div style={{ background: T.bg, borderRadius: 10, padding: 12, marginBottom: 12, border: `1px solid ${T.border}`, display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8 }}>
        {Object.entries(rd.device || {}).map(([k, v]) => (
          <div key={k}><p style={{ fontSize: 9, fontWeight: 600, color: T.t400, textTransform: "uppercase" }}>{k}</p><p style={{ fontSize: 10, fontWeight: 600, color: T.t900, fontFamily: T.mono }}>{v}</p></div>
        ))}
      </div>
      <p style={{ fontSize: 9, fontWeight: 700, color: T.t400, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 6 }}>Flagged Signals</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, columnGap: 20, marginBottom: 14 }}>
        {sigs.map((s, i) => <SigCard key={i} s={s} show={true} />)}
      </div>
      <div style={{ display: "flex", gap: 14, opacity: showG ? 1 : 0, transform: showG ? "translateY(0)" : "translateY(10px)", transition: "all 0.5s" }}>
        <div style={{ background: T.bg, borderRadius: 12, padding: 14, border: `1px solid ${T.border}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: "0 0 130px" }}>
          <Gauge score={scores[uc]} go={showG} />
        </div>
        <div style={{ flex: 1, background: T.bg, borderRadius: 12, padding: 14, border: `1px solid ${T.rose}20`, opacity: showV ? 1 : 0, transform: showV ? "translateY(0)" : "translateY(6px)", transition: "all 0.4s" }}>
          <p style={{ fontSize: 9, fontWeight: 700, color: T.t400, textTransform: "uppercase", letterSpacing: 1.2, marginBottom: 6 }}>Bureau Decision</p>
          <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 12px", borderRadius: 8, background: T.roseBg, border: `1px solid ${T.rose}18`, marginBottom: 8 }}>
            <XCircle size={16} color={T.rose} /><span style={{ fontSize: 12, fontWeight: 700, color: T.rose }}>{verdicts[uc]}</span>
          </div>
          <div style={{ padding: "9px 11px", borderRadius: 6, background: T.white, fontFamily: T.mono, fontSize: 10, color: T.t500, lineHeight: 1.7, border: `1px solid ${T.border}` }}>
            <span style={{ color: T.t400 }}>{"// API response"}</span><br />
            {`{ "riskScore": ${scores[uc]}, "riskLevel": "VERY_HIGH",`}<br />
            {`  "action": "BLOCK", "latency": "210ms" }`}
          </div>
        </div>
      </div>
    </div>
  );

  const phoneWithFx = (
    <>
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}@keyframes scaleIn{from{transform:scale(0);opacity:0;}to{transform:scale(1);opacity:1;}}@keyframes fadeIn{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}`}</style>
      {phone()}
    </>
  );

  return (
    <DemoShell
      badge="Device Intelligence"
      overviewTitle="Device Intelligence"
      overview={overviewBody}
      journeySteps={journeySteps}
      currentStep={currentStep}
      phone={phoneWithFx}
      results={resultsBody}
      hasResults={hasResults}
      region={{ flag: regMeta.flag, country: regMeta.country }}
      nextLabel={atEnd ? "Request Demo" : "Next"}
      nextIsRequestDemo={atEnd}
      onStart={goNext}
      onNext={goNext}
      onBack={goBack}
      onReset={reset}
    />
  );
}

export default function BureauDeviceIntelDemo() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ width: 32, height: 32, border: "3px solid #e2e8f0", borderTopColor: "#253B80", borderRadius: "50%", animation: "spin 1s linear infinite" }} /></div>}>
      <BureauDeviceIntelDemoInner />
    </Suspense>
  );
}
