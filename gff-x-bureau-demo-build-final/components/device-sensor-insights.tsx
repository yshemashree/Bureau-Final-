'use client';

import { useState } from 'react';
import { Smartphone, Monitor, Wifi, MapPin, User, Package, X } from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────
type Signal = { label: string; flagged?: boolean };

interface InsightCard {
  id: string;
  title: string;
  icon: React.ReactNode;
  riskLevel: 'High' | 'Medium' | 'Low';
  signals: Signal[];
  rawText?: string; // for Apponomics
}

// ── Signal Pill ────────────────────────────────────────────────────────────────
function SignalPill({ label, flagged }: Signal) {
  return (
    <span
      className={`inline-block px-3 py-1.5 rounded-lg text-xs font-medium leading-tight ${
        flagged
          ? 'bg-red-50 text-red-700'
          : 'bg-green-50 text-green-800'
      }`}
    >
      {label}
    </span>
  );
}

// ── Risk Badge ─────────────────────────────────────────────────────────────────
function RiskBadge({ level }: { level: 'High' | 'Medium' | 'Low' }) {
  const styles = {
    High: 'bg-red-50 text-red-600 border border-red-200',
    Medium: 'bg-orange-50 text-orange-600 border border-orange-200',
    Low: 'bg-green-50 text-green-700 border border-green-200',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded text-xs font-semibold ${styles[level]}`}>
      {level}
    </span>
  );
}

// ── Card ───────────────────────────────────────────────────────────────────────
function IntelCard({ card }: { card: InsightCard }) {
  return (
    <div className="bg-white border border-border rounded-xl p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-foreground">{card.icon}</span>
          <span className="text-base font-semibold text-foreground">{card.title}</span>
        </div>
        <div className="flex items-center gap-2">
          <RiskBadge level={card.riskLevel} />
          <button className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
            <X size={12} className="text-white" />
          </button>
        </div>
      </div>

      {/* Signals box */}
      <div className="bg-gray-50 rounded-lg p-3 space-y-2">
        <p className="text-xs font-semibold text-muted-foreground mb-2">Signals</p>
        {card.rawText ? (
          <pre className="text-xs text-foreground whitespace-pre-wrap font-mono leading-5">
            {card.rawText}
          </pre>
        ) : (
          <div className="flex flex-wrap gap-2">
            {card.signals.map((s, i) => (
              <SignalPill key={i} label={s.label} flagged={s.flagged} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export function DeviceSensorInsights() {
  const allInsightsData = {
    GPSLocation: { city: '', country: '', latitude: 0.0, longitude: 0.0, region: '' },
    IP: '2402:e280:3e71:3f5d:f56:3600:8e2e:5a88',
    IPLocation: { city: 'Pune', country: 'India', latitude: 18.519662857055664, longitude: 73.85450744628906, region: 'Maharashtra' },
    IPSecurity: { VPN: false, isCrawler: false, isProxy: false, isTor: false, threatLevel: 'LOW' },
    IPType: 'v6',
    OS: 'android',
    accessibilityEnabled: false,
    adbConnected: false,
    adbEnabled: false,
    appCategoryBreakup: { autoClicker: 0.0, banking: 2.0, betting: 0.0, dating: 0.0, digitalPayment: 4.0, ecommerce: 15.0, food: 7.0, gaming: 1.0, learning: 0.0, lending: 0.0, neoBank: 0.0, news: 0.0, other: 14.0, ott: 4.0, remittance: 0.0, socialMedia: 9.0, suspicious: 0.0, travel: 4.0, unknown: 128.0, utility: 8.0, wealth: 2.0, work: 3.0 },
    appInstallerSource: 'com.google.android.packageinstaller',
    behaviouralRiskLevel: 'UNKNOWN',
    categoryScores: { autoClicker: 0.0, banking: 12.78, betting: 0.0, dating: 0.0, digitalPayment: 37.02, ecommerce: 20.76, food: 55.05, gaming: 0.0, learning: 0.0, lending: 0.0, neoBank: 0.0, news: 0.0, other: 0.0, ott: 42.17, remittance: 0.0, socialMedia: 55.36, suspicious: 0.0, travel: 28.22, unknown: 0.0, utility: 0.0, wealth: 8.53, work: 5.0 },
    confidenceScore: 98.0,
    createdAt: 1772434913176,
    customerRestrictionStatus: { fingerprint: 'default', userId: 'default' },
    debuggable: false,
    developerMode: false,
    deviceRiskLevel: 'MEDIUM',
    deviceRiskScore: 60.0,
    emulator: false,
    factoryResetRisk: 'LOW',
    factoryResetTime: 0.0,
    fingerprint: '3239bd0e-7d34-493b-b519-938d5c3dfc9c',
    firstSeenDays: 0.0,
    googlePlayStoreInstall: false,
    isAppCloned: false,
    isAppTampered: true,
    isHookingDetected: false,
    isSimPresent: true,
    merchantId: 'auth0|623980a33d162b006930a877',
    mitmAttackDetected: false,
    mockgps: false,
    model: 'SM-S931B',
    networkInformation: { ipType: 'OTHERS', isp: 'Tata Play Broadband Private Limited' },
    officialStoreInstall: false,
    package: 'id.bureau.deviceintelligence',
    remoteDesktop: false,
    requestId: '267f93ce-66f0-46be-8c37-9a6ca3f05e71',
    riskCauses: ['NOT_INSTALLED_FROM_OFFICIAL_STORES', 'NOT_INSTALLED_FROM_GOOGLE_PLAY_STORE', 'APP_SIDE_LOADED_NON_OFFICIAL_STORE', 'IS_APP_TAMPERED', 'SIGNATURE_HASH_MISMATCH'],
    riskLevel: 'MEDIUM',
    riskScore: 60.0,
    rooted: false,
    screenSharing: false,
    sessionId: '4462c81-0335-4833-bd21-214095f80ac4',
    statusCode: 200,
    timestamp: 1772434913474,
    totalUniqueUserId: 1.0,
    userId: 'sriram',
    voiceCallDetected: false,
  };

  const cards: InsightCard[] = [
    {
      id: 'app',
      title: 'App',
      icon: <Monitor size={16} />,
      riskLevel: 'High',
      signals: [
        { label: 'Debuggable' },
        { label: 'App Cloned' },
        { label: 'App Tampered', flagged: true },
        { label: 'Playstore Install', flagged: true },
      ],
    },
    {
      id: 'persistence',
      title: 'Persistence',
      icon: <Monitor size={16} />,
      riskLevel: 'Low',
      signals: [
        { label: 'User ID - sriram' },
        { label: 'Fingerprint - 3239bd0e-7d34...' },
        { label: 'Confidence Score - 98' },
        { label: 'Operating System - android' },
        { label: 'Model - SM-S931B' },
      ],
    },
    {
      id: 'device',
      title: 'Device',
      icon: <Smartphone size={16} />,
      riskLevel: 'Low',
      signals: [
        { label: 'Mocked GPS' },
        { label: 'Remote Desktop' },
        { label: 'Developer Mode' },
        { label: 'SIM Present' },
        { label: 'Hooking Detected' },
        { label: 'Rooted' },
        { label: 'Voice call detected' },
        { label: 'Last factory reset - 01/01/1970' },
      ],
    },
    {
      id: 'admin',
      title: 'Admin',
      icon: <User size={16} />,
      riskLevel: 'Low',
      signals: [
        { label: 'Session ID - 4462c81-0335-4833...' },
        { label: 'Request ID - 267f93ce-66f0-46be...' },
        { label: 'MITM Attack Detected' },
      ],
    },
    {
      id: 'network',
      title: 'Network',
      icon: <Wifi size={16} />,
      riskLevel: 'Low',
      signals: [
        { label: 'IP Security:VPN' },
        { label: 'IP Security:TOR' },
        { label: 'IP Security:Proxy' },
        { label: 'IP Security:Crawler' },
        { label: 'ISP - Tata Play Broadband Private Limited' },
        { label: 'IP Address - 2402:e280:3e71:3f5d:f56:360...' },
        { label: 'IP Type - v6' },
        { label: 'IP Location - Pune, Maharashtra' },
        { label: 'IP Latitude, Longitude - 18.51966285705' },
      ],
    },
    {
      id: 'location',
      title: 'Location Intel',
      icon: <MapPin size={16} />,
      riskLevel: 'Low',
      signals: [
        { label: 'GPS Location - , ,' },
        { label: 'GPS Latitude - 0' },
        { label: 'GPS Longitude - 0' },
      ],
    },
    {
      id: 'apponomics',
      title: 'Apponomics info',
      icon: <Package size={16} />,
      riskLevel: 'Low',
      signals: [],
      rawText: `appProfileRisk: 0.0
{
  "appCount": 0.0,
  "autoClicker": 0.0,
  "bank": 0.0,
  "betting": 0.0,
  "ecomm": 0.0,
  "email": 0.0,
  "gaming": 1.0,
  "lending": 0.0,
  "neoBank": 0.0,
  "others": 0.0,
  "payments": 0.0,
  "remittance": 0.0,
  "socialMedia": 9.0,
  "suspicious": 0.0,
  "upi": 0.0,
  "utility": 8.0,
  "wealth": 2.0
}`,
    },
    {
      id: 'rules',
      title: 'Rules',
      icon: <User size={16} />,
      riskLevel: 'Low',
      signals: [
        { label: 'No. of user IDs - 1' },
        { label: 'First Seen Date - 02 Mar 2026' },
        { label: 'Auto Click Detected' },
      ],
    },
  ];

  return (
    <div className="space-y-3">
      {/* Device Risk Level Banner */}
      <div className="bg-red-50 border border-red-100 rounded-xl p-3 flex items-center gap-3">
        <Smartphone size={16} className="text-red-500" />
        <div>
          <p className="text-xs font-semibold text-red-500">Device Risk Level</p>
          <p className="text-sm font-bold text-red-600">Medium</p>
        </div>
      </div>

      {/* Cards */}
      {cards.map((card) => (
        <IntelCard key={card.id} card={card} />
      ))}

      {/* All Insights JSON — untouched */}
      <div className="bg-white border border-border rounded-xl p-4">
        <h3 className="text-xs font-semibold text-foreground mb-3">All Insights</h3>
        <div className="bg-gray-50 rounded-lg p-3 max-h-[480px] overflow-y-auto font-mono text-xs leading-5 whitespace-pre-wrap break-words text-muted-foreground">
          {JSON.stringify({ allInsights: allInsightsData }, null, 2)}
        </div>
      </div>
    </div>
  );
}
