'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft, ChevronUp, AlertTriangle, CheckCircle2, X, Eye, ArrowUpRight, Shield,
} from 'lucide-react';

type DetailTab = 'Transaction' | 'Origin' | 'Geographic' | 'User Info' | 'Profile Updates' | 'Security' | 'Banking';
type ActionModal = 'escalate' | 'investigate' | 'fraud' | 'falsepositive' | null;

const DETAIL_TABS: DetailTab[] = ['Transaction', 'Origin', 'Geographic', 'User Info', 'Profile Updates', 'Security', 'Banking'];

function Row({ label, value, highlight }: { label: string; value: string; highlight?: 'red' | 'green' | 'blue' }) {
  const valueClass =
    highlight === 'red' ? 'text-red-500 font-bold' :
    highlight === 'green' ? 'text-green-600 font-bold' :
    highlight === 'blue' ? '' :
    'text-foreground font-semibold';
  return (
    <div className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      {highlight === 'blue' ? (
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-600 text-white">{value}</span>
      ) : (
        <span className={`text-sm ${valueClass}`}>{value}</span>
      )}
    </div>
  );
}

export default function AlertDetailsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<DetailTab>('Transaction');
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [modal, setModal] = useState<ActionModal>(null);

  // Investigate modal state
  const [assignee, setAssignee] = useState('No assignment');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Low');

  // Escalate modal state
  const [supervisor, setSupervisor] = useState('');
  const [escalateReason, setEscalateReason] = useState('');

  // Fraud modal state
  const [fraudReason, setFraudReason] = useState('');

  return (
    <div className="min-h-screen bg-[#f7f8fa] font-sans">
      {/* Top bar */}
      <div className="bg-white border-b border-border px-6 py-3 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft size={16} />
          Back
        </button>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm font-medium text-foreground">Alert Details</span>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-5">

        {/* Header card */}
        <div className="bg-white rounded-xl border border-border p-6">
          {/* Top row */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-foreground">HV1D</h1>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-sm text-muted-foreground">Alert ID: 43</span>
                <span className="text-muted-foreground text-sm">•</span>
                <span className="text-sm text-muted-foreground">31 min ago</span>
                <span className="text-muted-foreground text-sm">•</span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-500 text-white">Active</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Description: No description available</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold px-3 py-1 rounded-full border border-green-400 text-green-700 bg-green-50">Low Risk</span>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Transaction ID</p>
                <p className="text-xs font-mono font-medium text-foreground">ee5f410c-2d63-4b6f-aab6-e2b72836953e</p>
              </div>
            </div>
          </div>

          {/* Meta grid */}
          <div className="grid grid-cols-3 gap-x-8 gap-y-4 border-t border-border pt-4">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Transaction Amount</p>
              <p className="text-base font-bold text-red-500">$250K</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Priority</p>
              <p className="text-base font-bold text-foreground">LOW</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Score</p>
              <p className="text-base font-bold text-foreground">150</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Customer</p>
              <p className="text-base font-semibold text-foreground">Priya Patel</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Merchant</p>
              <p className="text-base font-semibold text-foreground">Tata Motors Finance</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Group</p>
              <p className="text-base font-bold text-foreground">RISK OFFICERS</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Assigned To</p>
              <p className="text-base font-semibold text-foreground">Aarti Borse</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Assigned By</p>
              <p className="text-base font-semibold text-foreground">Aarti Borse</p>
            </div>
          </div>

          {/* Action buttons top-right */}
          <div className="flex justify-end gap-3 mt-4 border-t border-border pt-4">
            <button
              onClick={() => setModal('falsepositive')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-semibold text-muted-foreground hover:border-amber-300 hover:text-amber-600 hover:bg-amber-50 transition-colors"
            >
              <AlertTriangle size={14} />
              False Positive
            </button>
            <button
              onClick={() => setModal('fraud')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-semibold text-muted-foreground hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50 transition-colors"
            >
              <CheckCircle2 size={14} />
              Confirm Fraud
            </button>
          </div>
        </div>

        {/* Transaction Details */}
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          {/* Section header */}
          <button
            onClick={() => setDetailsOpen(v => !v)}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-secondary/30 transition-colors"
          >
            <span className="text-base font-bold text-foreground">Transaction Details</span>
            <ChevronUp size={18} className={`text-muted-foreground transition-transform ${detailsOpen ? '' : 'rotate-180'}`} />
          </button>

          {detailsOpen && (
            <>
              {/* Tabs */}
              <div className="border-t border-border">
                <div className="flex">
                  {DETAIL_TABS.map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-3 text-xs font-semibold text-center transition-colors border-b-2 ${
                        activeTab === tab
                          ? 'border-foreground text-foreground bg-white'
                          : 'border-transparent text-muted-foreground bg-secondary/30 hover:text-foreground'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab content */}
              <div className="px-6 py-2">

                {activeTab === 'Transaction' && (
                  <>
                    <Row label="Transaction ID" value="txn_bank_56789" />
                    <Row label="Date & Time" value="2025-10-16T10:15:00Z" />
                    <Row label="Amount" value="$250K" highlight="green" />
                    <Row label="Currency" value="INR" />
                    <Row label="Event Type" value="FT" />
                    <Row label="Event Subtype" value="TRANSFER" />
                    <Row label="Channel" value="ACCOUNT" />
                    <Row label="Transaction Status" value="COMPLETED" />
                    <Row label="Reference" value="NEFT_REF_ABC456" />
                    <Row label="Risk Assessment" value="Low" highlight="blue" />
                  </>
                )}

                {activeTab === 'Origin' && (
                  <>
                    <Row label="Payment Method" value="BANK" />
                    <Row label="Authenticated" value="false" />
                    <Row label="Authorized" value="false" />
                    <Row label="Tokenized" value="false" />
                    <Row label="Card Present" value="false" />
                    <Row label="Merchant Name" value="Tata Motors Finance" />
                    <Row label="Merchant ID" value="merch_bank_789" />
                    <Row label="Merchant Country" value="IND" />
                    <Row label="Category Code" value="6012" />
                    <Row label="Device Risk Score" value="N/A" />
                    <Row label="SIM Swap Detected" value="false" />
                    <Row label="Behavioral Biometrics Score" value="N/A" />
                  </>
                )}

                {activeTab === 'Geographic' && (
                  <>
                    <Row label="Origin IP" value="49.36.128.45" />
                    <Row label="Origin City (IP)" value="Ahmedabad" />
                    <Row label="Origin State (IP)" value="Gujarat" />
                    <Row label="Origin Country (IP)" value="IND" />
                    <Row label="Origin GPS Latitude" value="23.0225" />
                    <Row label="Origin GPS Longitude" value="72.5714" />
                    <Row label="Origin City (GPS)" value="Ahmedabad" />
                    <Row label="Dest GPS Latitude" value="N/A" />
                    <Row label="Dest GPS Longitude" value="N/A" />
                  </>
                )}

                {activeTab === 'User Info' && (
                  <>
                    <Row label="Customer ID" value="cust_bank_002" />
                    <Row label="Customer Name" value="Priya Patel" />
                    <Row label="Phone Number" value="919823456789" />
                    <Row label="Customer Status" value="ACTIVE" />
                    <Row label="Bank Holder Name" value="Priya Patel" />
                    <Row label="Bank Holder Email" value="priya.patel@example.com" />
                    <Row label="Social Profile Risk Score" value="N/A" />
                  </>
                )}

                {activeTab === 'Profile Updates' && (
                  <>
                    <Row label="Mobile Number Changed" value="false" />
                    <Row label="Password Changed" value="false" />
                    <Row label="Address Changed" value="false" />
                    <Row label="Primary Email Changed" value="false" />
                  </>
                )}

                {activeTab === 'Security' && (
                  <>
                    <Row label="Origin 3DS Status" value="false" />
                    <Row label="Origin Card Masked" value="false" />
                    <Row label="Origin Mock GPS" value="false" />
                    <Row label="Origin App Cloned" value="false" />
                    <Row label="Origin VPN Active" value="false" />
                  </>
                )}

                {activeTab === 'Banking' && (
                  <>
                    <Row label="Origin Bank Name" value="State Bank of India" />
                    <Row label="Origin Bank Code" value="SBIN0001234" />
                    <Row label="Origin Bank Account Number" value="30987654321" />
                    <Row label="Origin Bank Account Type" value="SAVINGS" />
                    <Row label="Origin Bank Holder Name" value="Priya Patel" />
                    <Row label="Origin Bank Holder Email" value="priya.patel@example.com" />
                    <Row label="Origin Bank Holder Phone" value="919823456789" />
                    <Row label="Origin Merchant Acquiring Bank" value="State Bank of India" />
                    <Row label="Origin Merchant Acquiring Bank Country" value="IND" />
                    <Row label="Destination Bank Name" value="HDFC Bank" />
                    <Row label="Destination Bank Code" value="HDFC0005678" />
                    <Row label="Destination Bank Account Number" value="26301012345678" />
                    <Row label="Destination Bank Account Type" value="CURRENT" />
                    <Row label="Destination Bank Balance" value="$12M" highlight="green" />
                    <Row label="Destination Bank Holder Name" value="Tata Motors Finance Ltd" />
                    <Row label="Destination Bank Holder Email" value="collections@tatamotorsfinance.com" />
                    <Row label="Destination Bank Holder Phone" value="912266658282" />
                    <Row label="Destination Bank Holder Nationality" value="IND" />
                    <Row label="Destination Bank Transit Number" value="HDFC0005678" />
                    <Row label="Destination Bank Country" value="IND" />
                  </>
                )}
              </div>

              {/* Bottom action bar (Escalate / Investigate) */}
              <div className="border-t border-border grid grid-cols-2">
                <button
                  onClick={() => setModal('escalate')}
                  className="flex items-center justify-center gap-2 py-4 text-sm font-semibold text-foreground hover:bg-secondary/40 transition-colors border-r border-border"
                >
                  <ArrowUpRight size={15} />
                  Escalate
                </button>
                <button
                  onClick={() => setModal('investigate')}
                  className="flex items-center justify-center gap-2 py-4 text-sm font-semibold text-foreground hover:bg-secondary/40 transition-colors"
                >
                  <Eye size={15} />
                  Investigate
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── MODALS ── */}
      {modal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>

            {/* INVESTIGATE MODAL */}
            {modal === 'investigate' && (
              <div className="p-6">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h2 className="text-lg font-bold text-indigo-600">Investigate Alert</h2>
                    <p className="text-sm text-muted-foreground mt-1">Begin detailed investigation process for this alert.</p>
                  </div>
                  <button onClick={() => setModal(null)} className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary transition-colors"><X size={15} /></button>
                </div>

                <label className="block text-sm font-semibold text-foreground mb-2">Assign to User</label>
                <select
                  value={assignee}
                  onChange={e => setAssignee(e.target.value)}
                  className="w-full border-2 border-foreground rounded-xl px-4 py-3 text-sm font-medium text-foreground bg-white mb-5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option>No assignment</option>
                  <option>Aarti Borse</option>
                  <option>Raj Sharma</option>
                  <option>Meera Iyer</option>
                </select>

                <label className="block text-sm font-semibold text-foreground mb-3">Investigation Priority</label>
                <div className="flex items-center gap-6 mb-5">
                  {(['High', 'Medium', 'Low'] as const).map(p => (
                    <label key={p} className="flex items-center gap-2 cursor-pointer">
                      <div
                        onClick={() => setPriority(p)}
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center cursor-pointer transition-colors ${priority === p ? 'border-indigo-600' : 'border-gray-400'}`}
                      >
                        {priority === p && <div className="w-2 h-2 rounded-full bg-indigo-600" />}
                      </div>
                      <span className="text-sm text-foreground">{p}</span>
                    </label>
                  ))}
                </div>

                <div className="flex items-start gap-3 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 mb-6">
                  <Eye size={16} className="text-indigo-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-indigo-600 font-medium">Transaction data loaded and will be included as evidence</p>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-secondary transition-colors">Cancel</button>
                  <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors">Start Investigation</button>
                </div>
              </div>
            )}

            {/* ESCALATE MODAL */}
            {modal === 'escalate' && (
              <div className="p-6">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h2 className="text-lg font-bold text-foreground">Escalate Alert</h2>
                    <p className="text-sm text-muted-foreground mt-1">Escalate this alert to a supervisor for review.</p>
                  </div>
                  <button onClick={() => setModal(null)} className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary transition-colors"><X size={15} /></button>
                </div>

                <label className="block text-sm font-semibold text-foreground mb-2">Escalate to Supervisor</label>
                <select
                  value={supervisor}
                  onChange={e => setSupervisor(e.target.value)}
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm text-foreground bg-white mb-5 focus:outline-none focus:ring-2 focus:ring-foreground"
                >
                  <option value="">Select a supervisor...</option>
                  <option>Ravi Menon</option>
                  <option>Sunita Kapoor</option>
                  <option>Kiran Das</option>
                </select>

                <label className="block text-sm font-semibold text-foreground mb-2">Escalation Reason</label>
                <textarea
                  value={escalateReason}
                  onChange={e => setEscalateReason(e.target.value)}
                  rows={4}
                  placeholder="Enter reason for escalation..."
                  className="w-full border-2 border-foreground rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground bg-white resize-none focus:outline-none focus:ring-2 focus:ring-foreground mb-6"
                />

                <div className="flex gap-3">
                  <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-secondary transition-colors">Cancel</button>
                  <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors">Escalate Alert</button>
                </div>
              </div>
            )}

            {/* CONFIRM FRAUD MODAL */}
            {modal === 'fraud' && (
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-orange-600">Confirm as Fraudulent</h2>
                    <p className="text-sm text-muted-foreground mt-1">Please provide a comment explaining the evidence or reasoning that confirms this is fraudulent activity.</p>
                  </div>
                  <button onClick={() => setModal(null)} className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary transition-colors"><X size={15} /></button>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-bold text-foreground mb-2">Alert details:</p>
                  <p className="text-sm text-foreground"><span className="font-bold">ID:</span> 43</p>
                  <p className="text-sm text-foreground"><span className="font-bold">Title:</span> HV1D</p>
                  <p className="text-sm text-foreground"><span className="font-bold">Amount:</span> $250K</p>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 mb-5">
                  <p className="text-sm font-bold text-orange-600 mb-2">Actions that will be taken:</p>
                  <ul className="space-y-1">
                    {['Alert will be marked as confirmed fraud', 'Customer account may be flagged for review', 'Additional monitoring will be enabled'].map(a => (
                      <li key={a} className="flex items-center gap-2 text-sm text-orange-600">
                        <span className="w-1 h-1 rounded-full bg-orange-500 flex-shrink-0" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>

                <label className="block text-sm font-bold text-foreground mb-1">
                  Evidence/Reasoning <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={fraudReason}
                  onChange={e => setFraudReason(e.target.value)}
                  rows={4}
                  placeholder="Describe the evidence or reasoning that confirms this is fraudulent activity (e.g., pattern analysis, customer complaint, suspicious behavior, etc.)"
                  className="w-full border-2 border-foreground rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground bg-white resize-none focus:outline-none focus:ring-2 focus:ring-orange-400 mb-6"
                />

                <div className="flex gap-3">
                  <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-secondary transition-colors">Cancel</button>
                  <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl bg-orange-400 text-white text-sm font-bold hover:bg-orange-500 transition-colors">Confirm as Fraud</button>
                </div>
              </div>
            )}

            {/* FALSE POSITIVE MODAL */}
            {modal === 'falsepositive' && (
              <div className="p-6">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h2 className="text-lg font-bold text-amber-600">Mark as False Positive</h2>
                    <p className="text-sm text-muted-foreground mt-1">Confirm this alert is a false positive and provide your reasoning.</p>
                  </div>
                  <button onClick={() => setModal(null)} className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary transition-colors"><X size={15} /></button>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5">
                  <div className="flex items-center gap-2 mb-1">
                    <Shield size={15} className="text-amber-600" />
                    <p className="text-sm font-bold text-amber-700">Alert ID: 43 — HV1D</p>
                  </div>
                  <p className="text-xs text-amber-600">Marking as false positive will dismiss this alert and update risk model feedback.</p>
                </div>

                <label className="block text-sm font-bold text-foreground mb-1">
                  Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe why this alert is a false positive..."
                  className="w-full border-2 border-foreground rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground bg-white resize-none focus:outline-none focus:ring-2 focus:ring-amber-400 mb-6"
                />

                <div className="flex gap-3">
                  <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-secondary transition-colors">Cancel</button>
                  <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl bg-amber-500 text-white text-sm font-bold hover:bg-amber-600 transition-colors">Confirm False Positive</button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
