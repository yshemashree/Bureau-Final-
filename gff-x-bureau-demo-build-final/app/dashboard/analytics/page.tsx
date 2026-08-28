'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/auth';
import {
  Users, CheckCircle2, XCircle, Clock, ChevronDown,
} from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis,
  AreaChart, Area, ResponsiveContainer, CartesianGrid,
} from 'recharts';

// ── Data sets ─────────────────────────────────────────────────────────────────

const DATA: Record<string, {
  stats: { applicants: number; approvalRate: number; rejectionRate: number; avgTat: number };
  funnel: { label: string; value: number }[];
  pieData: { name: string; value: number; color: string }[];
  rejectionReasons: { label: string; value: number }[];
  platformSplit: { name: string; value: number; color: string }[];
  locations: { name: string; value: number }[];
  riskSignals: { name: string; value: number }[];
  riskDist: { name: string; value: number; color: string }[];
  docAnalysis: { name: string; value: number }[];
  gin: { linkedDevices: number; linkedEmails: number; linkedPhones: number; fraudRings: number };
}> = {
  'Last 3 Months': {
    stats: { applicants: 52334, approvalRate: 60.0, rejectionRate: 31.4, avgTat: 78 },
    funnel: [
      { label: 'Initial', value: 52334 },
      { label: 'Device', value: 49717 },
      { label: 'Phone/Email', value: 47100 },
      { label: 'IP', value: 46053 },
      { label: 'KYC', value: 41867 },
      { label: 'Liveness', value: 39250 },
      { label: 'Face Match', value: 37680 },
      { label: 'AML', value: 35587 },
      { label: 'GIN', value: 34017 },
      { label: 'Approved', value: 31400 },
    ],
    pieData: [
      { name: 'Approved', value: 60, color: '#4ade80' },
      { name: 'Manual Review', value: 9, color: '#fb923c' },
      { name: 'Rejected', value: 31, color: '#f87171' },
    ],
    rejectionReasons: [
      { label: 'Face Match\nFailed', value: 100 },
      { label: 'Document\nTampered', value: 80 },
      { label: 'High Risk\nScore', value: 70 },
      { label: 'AML Hit', value: 55 },
      { label: 'VPN/Proxy\nDetected', value: 38 },
    ],
    platformSplit: [
      { name: 'Android', value: 72, color: '#4ade80' },
      { name: 'Web', value: 18, color: '#60a5fa' },
      { name: 'iOS', value: 10, color: '#94a3b8' },
    ],
    locations: [
      { name: 'USA', value: 15700 }, { name: 'India', value: 12560 },
      { name: 'Philippines', value: 8373 }, { name: 'UK', value: 5233 },
      { name: 'Germany', value: 3140 },
    ],
    riskSignals: [
      { name: 'App Tampered', value: 837 },
      { name: 'Rooted/Jailbroken', value: 1256 },
      { name: 'Emulator', value: 523 },
    ],
    riskDist: [
      { name: 'Low', value: 36000, color: '#4ade80' },
      { name: 'Medium', value: 10000, color: '#fb923c' },
      { name: 'High', value: 6334, color: '#f87171' },
    ],
    docAnalysis: [
      { name: "Drivers License", value: 21000 },
      { name: 'Passport', value: 15000 },
      { name: 'National ID', value: 10000 },
      { name: 'Other', value: 6334 },
    ],
    gin: { linkedDevices: 2.4, linkedEmails: 1.9, linkedPhones: 1.6, fraudRings: 157 },
  },
  'Last 30 Days': {
    stats: { applicants: 46219, approvalRate: 60.0, rejectionRate: 27.7, avgTat: 69 },
    funnel: [
      { label: 'Initial', value: 46219 },
      { label: 'Device', value: 43908 },
      { label: 'Phone/Email', value: 41597 },
      { label: 'IP', value: 40672 },
      { label: 'KYC', value: 36975 },
      { label: 'Liveness', value: 34664 },
      { label: 'Face Match', value: 33277 },
      { label: 'AML', value: 31428 },
      { label: 'GIN', value: 30042 },
      { label: 'Approved', value: 27731 },
    ],
    pieData: [
      { name: 'Approved', value: 60, color: '#4ade80' },
      { name: 'Manual Review', value: 12, color: '#fb923c' },
      { name: 'Rejected', value: 28, color: '#f87171' },
    ],
    rejectionReasons: [
      { label: 'Face Match\nFailed', value: 100 },
      { label: 'Document\nTampered', value: 75 },
      { label: 'High Risk\nScore', value: 65 },
      { label: 'AML Hit', value: 50 },
      { label: 'VPN/Proxy\nDetected', value: 33 },
    ],
    platformSplit: [
      { name: 'Android', value: 70, color: '#4ade80' },
      { name: 'Web', value: 20, color: '#60a5fa' },
      { name: 'iOS', value: 10, color: '#94a3b8' },
    ],
    locations: [
      { name: 'USA', value: 13865 }, { name: 'India', value: 11092 },
      { name: 'Philippines', value: 7395 }, { name: 'UK', value: 4621 },
      { name: 'Germany', value: 2773 },
    ],
    riskSignals: [
      { name: 'App Tampered', value: 739 },
      { name: 'Rooted/Jailbroken', value: 1109 },
      { name: 'Emulator', value: 462 },
    ],
    riskDist: [
      { name: 'Low', value: 32000, color: '#4ade80' },
      { name: 'Medium', value: 8800, color: '#fb923c' },
      { name: 'High', value: 5419, color: '#f87171' },
    ],
    docAnalysis: [
      { name: "Drivers License", value: 19000 },
      { name: 'Passport', value: 13500 },
      { name: 'National ID', value: 8800 },
      { name: 'Other', value: 4919 },
    ],
    gin: { linkedDevices: 2.1, linkedEmails: 1.7, linkedPhones: 1.4, fraudRings: 138 },
  },
};

const PERIODS = ['Last 3 Months', 'Last 30 Days'] as const;
type Period = typeof PERIODS[number];

function StatCard({ label, value, delta, icon, iconColor }: {
  label: string; value: string; delta: string; icon: React.ReactNode; iconColor: string;
}) {
  const up = delta.startsWith('+');
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex-1 min-w-0">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <span className={`w-7 h-7 rounded-full flex items-center justify-center ${iconColor}`}>{icon}</span>
      </div>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      <p className={`text-xs font-medium ${up ? 'text-green-600' : 'text-orange-500'}`}>
        {up ? '↗' : '↘'} {delta} from last month
      </p>
    </div>
  );
}

export default function AnalyticsDashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [period, setPeriod] = useState<Period>('Last 3 Months');
  const [showPeriodMenu, setShowPeriodMenu] = useState(false);

  useEffect(() => {
    const s = getSession();
    if (!s) { router.push('/'); return; }
    setMounted(true);
  }, [router]);

  if (!mounted) return null;

  const d = DATA[period];
  const maxFunnel = d.funnel[0].value;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Your verification analytics overview.</p>
        </div>
        <div className="relative self-start">
          <button
            onClick={() => setShowPeriodMenu(v => !v)}
            className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {period}
            <ChevronDown size={14} />
          </button>
          {showPeriodMenu && (
            <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1">
              {PERIODS.map(p => (
                <button
                  key={p}
                  onClick={() => { setPeriod(p); setShowPeriodMenu(false); }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${p === period ? 'bg-gray-100 font-medium text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <StatCard label="Total Applicants" value={d.stats.applicants.toLocaleString()} delta="+5.2%" icon={<Users size={14} />} iconColor="bg-blue-50 text-blue-500" />
        <StatCard label="Approval Rate" value={`${d.stats.approvalRate}%`} delta="-0.8%" icon={<CheckCircle2 size={14} />} iconColor="bg-green-50 text-green-500" />
        <StatCard label="Rejection Rate" value={`${d.stats.rejectionRate}%`} delta="+1.2%" icon={<XCircle size={14} />} iconColor="bg-red-50 text-red-500" />
        <StatCard label="Average TAT" value={`${d.stats.avgTat}s`} delta="-5s" icon={<Clock size={14} />} iconColor="bg-blue-50 text-blue-500" />
      </div>

      {/* Row 2: Funnel | Verification Status | Top Rejection Reasons */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-4">
        {/* Funnel */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-sm font-bold text-gray-900 mb-0.5">User Journey Funnel</h2>
          <p className="text-xs text-gray-400 mb-4">Conversion at each verification stage.</p>
          <div className="space-y-2.5">
            {d.funnel.map(row => (
              <div key={row.label} className="flex items-center gap-3">
                <p className="text-xs text-gray-500 w-24 flex-shrink-0">{row.label}</p>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-400"
                    style={{ width: `${(row.value / maxFunnel) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 font-medium w-14 text-right">{row.value.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Verification Status */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-sm font-bold text-gray-900 mb-4">Verification Status</h2>
          <div className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={d.pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" startAngle={90} endAngle={-270}>
                  {d.pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
              {d.pieData.map(p => (
                <div key={p.name} className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
                  <span className="text-xs text-gray-500">{p.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Rejection Reasons */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 md:col-span-2 xl:col-span-1">
          <h2 className="text-sm font-bold text-gray-900 mb-4">Top Rejection Reasons</h2>
          <div className="space-y-3">
            {d.rejectionReasons.map(r => (
              <div key={r.label} className="flex items-center gap-3">
                <p className="text-xs text-gray-500 w-24 flex-shrink-0 leading-tight">{r.label.replace('\\n', '\n')}</p>
                <div className="flex-1 h-5 bg-red-100 rounded overflow-hidden">
                  <div className="h-full bg-red-400 rounded" style={{ width: `${r.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Device Intelligence */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded bg-blue-50 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18" strokeLinecap="round" strokeWidth="3"/></svg>
          </div>
          <h2 className="text-sm font-bold text-gray-900">Device Intelligence</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Platform Split */}
          <div>
            <p className="text-xs font-semibold text-gray-500 text-center mb-3">Platform Split</p>
            <ResponsiveContainer width="100%" height={120}>
              <PieChart>
                <Pie data={d.platformSplit} cx="50%" cy="50%" outerRadius={50} dataKey="value">
                  {d.platformSplit.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-1">
              {d.platformSplit.map(p => (
                <div key={p.name} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                  <span className="text-xs text-gray-500">{p.name}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Top Locations */}
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-3">Top Locations</p>
            <div className="space-y-2">
              {d.locations.map(l => (
                <div key={l.name} className="flex justify-between text-xs">
                  <span className="text-gray-600">{l.name}</span>
                  <span className="text-gray-800 font-medium">{l.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Top Risk Signals */}
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-3">Top Risk Signals</p>
            <div className="space-y-2">
              {d.riskSignals.map(r => (
                <div key={r.name} className="flex justify-between text-xs">
                  <span className="text-gray-600">{r.name}</span>
                  <span className="text-red-500 font-semibold">{r.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Risk Score Distribution | Document Analysis | GIN Insights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* Risk Score Distribution */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded bg-orange-50 flex items-center justify-center">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <h2 className="text-sm font-bold text-gray-900">Risk Score Distribution</h2>
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={d.riskDist} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="value" radius={[3, 3, 0, 0]}>
                {d.riskDist.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Document Analysis */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded bg-purple-50 flex items-center justify-center">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <h2 className="text-sm font-bold text-gray-900">Document Analysis</h2>
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={d.docAnalysis} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 9 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#818cf8" fill="#c7d2fe" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* GIN Insights */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 sm:col-span-2 xl:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded bg-blue-50 flex items-center justify-center">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4"/><circle cx="17" cy="17" r="4"/><path d="M21 21v-1a4 4 0 0 0-4-4h0"/></svg>
            </div>
            <h2 className="text-sm font-bold text-gray-900">GIN Insights</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500 mb-1">Avg. Linked Devices</p>
              <p className="text-2xl font-bold text-gray-900">{d.gin.linkedDevices}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500 mb-1">Avg. Linked Emails</p>
              <p className="text-2xl font-bold text-gray-900">{d.gin.linkedEmails}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500 mb-1">Avg. Linked Phones</p>
              <p className="text-2xl font-bold text-gray-900">{d.gin.linkedPhones}</p>
            </div>
            <div className="bg-red-50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500 mb-1">Fraud Rings</p>
              <p className="text-2xl font-bold text-red-500">{d.gin.fraudRings}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
