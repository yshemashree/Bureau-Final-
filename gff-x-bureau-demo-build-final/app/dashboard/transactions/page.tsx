'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/auth';
import {
  CreditCard, ArrowUpRight, ArrowDownLeft, Search,
  Download, CheckCircle2, XCircle, Clock,
  RefreshCw, MoreHorizontal, ChevronLeft, ChevronRight,
  Plus, Building2, User, MapPin, Shield, Zap, X,
  ArrowRight, Landmark, Globe, Lock, AlertCircle,
} from 'lucide-react';

type TxStatus = 'Completed' | 'Failed' | 'Pending' | 'Refunded';
type TxType = 'Payment' | 'Transfer' | 'Withdrawal' | 'Deposit' | 'Refund';

interface Transaction {
  id: string;
  date: string;
  customer: string;
  email: string;
  type: TxType;
  method: string;
  amount: string;
  currency: string;
  status: TxStatus;
  reference: string;
  country: string;
}

const STATUS_CONFIG: Record<TxStatus, { label: string; className: string; icon: React.ReactNode }> = {
  Completed: { label: 'Completed', className: 'bg-green-50 text-green-700 border-green-200', icon: <CheckCircle2 size={11} /> },
  Failed:    { label: 'Failed',    className: 'bg-red-50 text-red-700 border-red-200',       icon: <XCircle size={11} /> },
  Pending:   { label: 'Pending',   className: 'bg-amber-50 text-amber-700 border-amber-200', icon: <Clock size={11} /> },
  Refunded:  { label: 'Refunded',  className: 'bg-blue-50 text-blue-700 border-blue-200',    icon: <RefreshCw size={11} /> },
};

const TYPE_ICON: Record<TxType, React.ReactNode> = {
  Payment:    <ArrowUpRight size={14} className="text-red-500" />,
  Transfer:   <ArrowUpRight size={14} className="text-orange-500" />,
  Withdrawal: <ArrowUpRight size={14} className="text-red-600" />,
  Deposit:    <ArrowDownLeft size={14} className="text-green-500" />,
  Refund:     <ArrowDownLeft size={14} className="text-blue-500" />,
};

const STATIC_TRANSACTIONS: Transaction[] = [
  { id: 'TXN-84921', date: 'Mar 9, 2026, 10:42 AM', customer: 'James Harrington', email: 'j.harrington@email.com', type: 'Payment', method: 'Visa ••4829', amount: '2,450.00', currency: 'USD', status: 'Completed', reference: 'INV-2026-0091', country: 'United States' },
  { id: 'TXN-84920', date: 'Mar 9, 2026, 09:18 AM', customer: 'Priya Nair', email: 'priya.nair@email.com', type: 'Transfer', method: 'Bank Transfer', amount: '8,200.00', currency: 'AED', status: 'Pending', reference: 'TRF-2026-0144', country: 'UAE' },
  { id: 'TXN-84919', date: 'Mar 9, 2026, 08:55 AM', customer: 'Carlos Mendez', email: 'cmendez@corp.co', type: 'Payment', method: 'Mastercard ••3317', amount: '540.00', currency: 'USD', status: 'Failed', reference: 'INV-2026-0090', country: 'Colombia' },
  { id: 'TXN-84918', date: 'Mar 8, 2026, 05:30 PM', customer: 'Sophie Leclair', email: 'sophie.l@mail.fr', type: 'Deposit', method: 'SEPA', amount: '15,000.00', currency: 'EUR', status: 'Completed', reference: 'DEP-2026-0033', country: 'France' },
  { id: 'TXN-84917', date: 'Mar 8, 2026, 04:12 PM', customer: 'Amir Al-Rashid', email: 'amir.rashid@biz.sa', type: 'Withdrawal', method: 'Bank Transfer', amount: '3,750.00', currency: 'SAR', status: 'Completed', reference: 'WDL-2026-0021', country: 'Saudi Arabia' },
  { id: 'TXN-84916', date: 'Mar 8, 2026, 02:48 PM', customer: 'Mei Lin', email: 'meilin@fin.sg', type: 'Refund', method: 'Visa ••7734', amount: '220.00', currency: 'SGD', status: 'Refunded', reference: 'RFD-2026-0009', country: 'Singapore' },
  { id: 'TXN-84915', date: 'Mar 8, 2026, 11:05 AM', customer: 'David Okonkwo', email: 'd.okonkwo@tech.ng', type: 'Payment', method: 'Mastercard ••5521', amount: '1,100.00', currency: 'USD', status: 'Completed', reference: 'INV-2026-0089', country: 'Nigeria' },
  { id: 'TXN-84914', date: 'Mar 7, 2026, 06:22 PM', customer: 'Elena Vasquez', email: 'evasquez@corp.ar', type: 'Transfer', method: 'Bank Transfer', amount: '4,800.00', currency: 'ARS', status: 'Failed', reference: 'TRF-2026-0143', country: 'Argentina' },
  { id: 'TXN-84913', date: 'Mar 7, 2026, 03:40 PM', customer: 'Yusuf Kemal', email: 'ykemal@tur.co', type: 'Payment', method: 'Amex ••0012', amount: '670.00', currency: 'TRY', status: 'Pending', reference: 'INV-2026-0088', country: 'Turkey' },
  { id: 'TXN-84912', date: 'Mar 7, 2026, 01:15 PM', customer: 'Fatima Al-Zahraa', email: 'f.alzahraa@kw.net', type: 'Deposit', method: 'Wire Transfer', amount: '25,000.00', currency: 'KWD', status: 'Completed', reference: 'DEP-2026-0032', country: 'Kuwait' },
  { id: 'TXN-84911', date: 'Mar 6, 2026, 10:30 AM', customer: "Liam O'Brien", email: 'liam.ob@ire.ie', type: 'Payment', method: 'Visa ••8890', amount: '310.00', currency: 'EUR', status: 'Completed', reference: 'INV-2026-0087', country: 'Ireland' },
  { id: 'TXN-84910', date: 'Mar 6, 2026, 08:50 AM', customer: 'Nguyen Thi Hoa', email: 'n.hoa@vn.com', type: 'Transfer', method: 'Bank Transfer', amount: '12,500,000', currency: 'VND', status: 'Completed', reference: 'TRF-2026-0142', country: 'Vietnam' },
];

// Pre-filled form data from JSON
const PREFILL = {
  eventType: 'FT',
  eventSubtype: 'TRANSFER',
  channel: 'ACCOUNT',
  transactionId: 'TXN-2024-APL-80659',
  reference: 'CARD-TXN-80659',
  customerId: 'cust_apple_001',
  customerName: 'Apple Inc',
  customerPhone: '14089961010',
  customerStatus: 'ACTIVE',
  amount: '4,999',
  currency: 'USD',
  country: 'United States',
  paymentMethod: 'CARD',
  // Originator
  origBankName: 'JP Morgan Chase',
  origBankCode: 'CHASUS33',
  origAccountNumber: '000000806592',
  origAccountType: 'CORPORATE',
  origHolderName: 'Apple Inc',
  origHolderEmail: 'treasury@apple.com',
  origCity: 'Ahmedabad',
  origState: 'Gujarat',
  origCountry: 'India',
  origPostal: '380001',
  origIp: '49.36.128.45',
  origMerchantName: 'Tata Motors Finance',
  origMerchantId: 'merch_bank_789',
  origMerchantCategory: '6012',
  origMerchantCity: 'Mumbai',
  origMerchantState: 'Maharashtra',
  // Beneficiary
  destBankName: 'HDFC Bank',
  destBankCode: 'HDFC0005678',
  destAccountNumber: '26301012345678',
  destAccountType: 'CURRENT',
  destHolderName: 'Tata Motors Finance Ltd',
  destHolderEmail: 'collections@tatamotorsfinance.com',
  destHolderPhone: '912266658282',
  destCountry: 'India',
};

type ModalStep = 'form' | 'processing' | 'flagged' | 'done';
type EvalTab = 'summary' | 'flagged' | 'all';

const PROCESSING_STEPS = [
  { label: 'Validating transaction details',   icon: <Shield size={16} />,       duration: 700,  pauseAfter: false },
  { label: 'Verifying originator account',     icon: <User size={16} />,         duration: 900,  pauseAfter: false },
  { label: 'Running Risk Assessment on User',  icon: <Zap size={16} />,          duration: 1100, pauseAfter: true  },
  { label: 'Confirming beneficiary account',   icon: <Landmark size={16} />,     duration: 800,  pauseAfter: false },
  { label: 'Settling funds via NEFT',          icon: <ArrowRight size={16} />,   duration: 700,  pauseAfter: false },
  { label: 'Transaction complete',             icon: <CheckCircle2 size={16} />, duration: 400,  pauseAfter: false },
];

const ALL_RULES = [
  { id: 9,  title: 'A sum of transaction amount greater than $3,999 in a day', expression: '', flagged: true,  priority: null,   executed: true  },
  { id: 6,  title: 'credit card transaction greater than 50000',                 expression: "orig_payment_method == 'CARD' && orig_card_type == 'CREDIT' && orig_transaction_amount > 50000.0", flagged: false, priority: 'High', executed: false },
  { id: 13, title: 'failed logins and count of failed logins is more than 2',   expression: "event_type == 'NFT' && event_subtype == 'LOGIN' && transaction_state == 'FAILED' && customer_id != '' && count_transaction_id_1d > 2.0", flagged: false, priority: null, executed: true },
  { id: 7,  title: 'transaction is occurring from an IP in Blacklisted IPs blacklist', expression: "in_list(orig_device_ip, 'Blacklisted IPs')", flagged: false, priority: null, executed: true },
  { id: 4,  title: 'transaction is occurring from a country in blacklisted country blacklist', expression: "in_list(orig_transaction_country, 'Blacklisted country')", flagged: false, priority: null, executed: true },
];

const PAGE_SIZE = 8;

export default function TransactionsPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<TxStatus | 'All'>('All');
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Transaction | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState<ModalStep>('form');
  const [processingIdx, setProcessingIdx] = useState(-1);
  const [evalTab, setEvalTab] = useState<EvalTab>('summary');
  const [transactions, setTransactions] = useState<Transaction[]>(STATIC_TRANSACTIONS);
  const [overridden, setOverridden] = useState(false);

  // Sync all journey transactions — reads from the shared array (all journeys) + legacy single key
  const syncPending = () => {
    try {
      // Collect from array (new) and legacy single key (backward compat)
      const fromArray: Transaction[] = JSON.parse(localStorage.getItem('bureau-transactions') || '[]');
      const legacyRaw = localStorage.getItem('pending-transaction');
      const legacy: Transaction[] = legacyRaw ? [JSON.parse(legacyRaw)] : [];

      // Merge: prefer array entries, fall back to legacy if not already present
      const merged = [...fromArray];
      for (const t of legacy) {
        if (!merged.find(m => m.id === t.id)) merged.push(t);
      }

      // Only show individual payment-initiated transactions — exclude KYC Verification entries
      const paymentOnly = merged.filter(t => t.type !== 'KYC Verification');

      if (paymentOnly.length === 0) return;

      setTransactions(prev => {
        let next = [...prev];
        for (const incoming of paymentOnly) {
          const idx = next.findIndex(t => t.id === incoming.id);
          if (idx === -1) {
            next = [incoming, ...next];
          } else if (next[idx].status !== incoming.status) {
            next = next.map(t => t.id === incoming.id ? { ...t, status: incoming.status } : t);
          }
        }
        return next;
      });
    } catch { /* ignore */ }
  };

  useEffect(() => {
    const s = getSession();
    if (!s) { router.push('/'); return; }

    // Permanently scrub KYC Verification entries from localStorage so they never show again
    try {
      const stored: Transaction[] = JSON.parse(localStorage.getItem('bureau-transactions') || '[]');
      const cleaned = stored.filter((t: Transaction) => t.type !== 'KYC Verification');
      localStorage.setItem('bureau-transactions', JSON.stringify(cleaned));
      // Also clear legacy key if it was a KYC entry
      const legacyRaw = localStorage.getItem('pending-transaction');
      if (legacyRaw) {
        const legacy: Transaction = JSON.parse(legacyRaw);
        if (legacy.type === 'KYC Verification') localStorage.removeItem('pending-transaction');
      }
    } catch { /* ignore */ }

    syncPending();
    setMounted(true);

    // Re-sync whenever this tab regains focus (customer may have just paid)
    const onFocus = () => syncPending();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [router]); // eslint-disable-line react-hooks/exhaustive-deps

  // Processing animation — pauses after risk assessment step (unless already overridden)
  useEffect(() => {
    if (modalStep !== 'processing') return;
    // Only auto-start from index 0 when processingIdx is -1 (fresh start)
    if (processingIdx !== -1) return;
    setProcessingIdx(0);
    let idx = 0;
    const run = () => {
      // Pause after the risk assessment step (index 2) — but skip if already overridden
      if (PROCESSING_STEPS[idx].pauseAfter && !overridden) {
        setTimeout(() => setModalStep('flagged'), 800);
        return;
      }
      if (idx >= PROCESSING_STEPS.length - 1) {
        setTimeout(() => setModalStep('done'), 400);
        return;
      }
      idx++;
      setProcessingIdx(idx);
      setTimeout(run, PROCESSING_STEPS[idx].duration);
    };
    setTimeout(run, PROCESSING_STEPS[0].duration);
  }, [modalStep, overridden]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = () => {
    setOverridden(false);
    setModalStep('processing');
    setProcessingIdx(-1);
    setEvalTab('summary');
  };

  // After reviewing flagged evaluation, resume processing from step 3 (beneficiary)
  const handleContinueAfterFlag = () => {
    setOverridden(true);
    setModalStep('processing');
    setProcessingIdx(3); // resume at "Confirming beneficiary account"
    let idx = 3;
    const run = () => {
      if (idx >= PROCESSING_STEPS.length - 1) {
        setTimeout(() => setModalStep('done'), 400);
        return;
      }
      idx++;
      setProcessingIdx(idx);
      setTimeout(run, PROCESSING_STEPS[idx].duration);
    };
    setTimeout(run, PROCESSING_STEPS[3].duration);
  };

  const handleDone = () => {
    const now = new Date();
    const newTx: Transaction = {
      id: 'TXN-' + Math.floor(85000 + Math.random() * 999),
      date: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      customer: PREFILL.customerName,
      email: PREFILL.origHolderEmail,
      type: 'Transfer',
      method: 'Card',
      amount: '4,999',
      currency: 'USD',
      status: 'Completed',
      reference: PREFILL.reference,
      country: 'India',
    };
    // Add new operator transfer — do NOT touch the user's pending payment entry
    setTransactions(prev => [newTx, ...prev.filter(t => t.id !== newTx.id)]);
    setShowModal(false);
    setModalStep('form');
    setProcessingIdx(-1);
  };

  if (!mounted) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const filtered = transactions.filter(tx => {
    if (tx.type === 'KYC Verification') return false; // never show KYC entries
    const matchSearch = search === '' || [tx.id, tx.customer, tx.email, tx.reference, tx.country].some(v => v.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === 'All' || tx.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const pages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const summary = [
    { label: 'Total Volume', value: '$84,230', sub: '+12.4% this month', up: true },
    { label: 'Completed', value: String(transactions.filter(t => t.status === 'Completed').length), sub: `${Math.round(transactions.filter(t => t.status === 'Completed').length / transactions.length * 100)}% success rate`, up: true },
    { label: 'Failed', value: String(transactions.filter(t => t.status === 'Failed').length), sub: `${Math.round(transactions.filter(t => t.status === 'Failed').length / transactions.length * 100)}% failure rate`, up: false },
    { label: 'Pending', value: String(transactions.filter(t => t.status === 'Pending').length), sub: 'Awaiting settlement', up: null },
  ];

  return (
    <div className="min-h-screen bg-[#f7f8fa] p-4 sm:p-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
            <CreditCard size={20} className="text-primary" />
            Transaction Monitoring
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Monitor, evaluate and review all customer payment activity</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border border-border bg-white text-sm font-medium text-foreground hover:bg-secondary/40 transition-colors">
            <Download size={14} />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
          <button
            onClick={() => { setShowModal(true); setModalStep('form'); }}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-foreground text-background text-sm font-semibold hover:bg-foreground/90 transition-colors"
          >
            <Plus size={15} />
            <span className="hidden sm:inline">Initiate Transaction</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {summary.map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-border p-4">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-2xl font-bold text-foreground mt-1">{s.value}</p>
            <p className={`text-xs mt-1 ${s.up === true ? 'text-green-600' : s.up === false ? 'text-red-500' : 'text-muted-foreground'}`}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Filters + Table */}
      <div className="bg-white rounded-xl border border-border mb-4">
        <div className="flex items-center gap-3 p-4 border-b border-border flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, ID, reference..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(0); }}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-secondary/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {(['All', 'Completed', 'Pending', 'Failed', 'Refunded'] as const).map(s => (
              <button
                key={s}
                onClick={() => { setStatusFilter(s); setPage(0); }}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${statusFilter === s ? 'bg-foreground text-background border-foreground' : 'bg-white text-muted-foreground border-border hover:border-foreground/30'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {['Transaction ID', 'Date', 'Customer', 'Type', 'Method', 'Amount', 'Status', ''].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12 text-sm text-muted-foreground">No transactions match your filters.</td></tr>
              ) : paginated.map((tx, i) => {
                const st = STATUS_CONFIG[tx.status];
                const isFlagged = tx.status === 'Pending' || tx.status === 'Failed';
                const handleRowClick = () => {
                  if (isFlagged) {
                    setShowModal(true);
                    setModalStep('flagged');
                    setEvalTab('summary');
                  } else {
                    setSelected(tx);
                  }
                };
                return (
                  <tr key={tx.id} onClick={handleRowClick} className={`border-b border-border last:border-0 hover:bg-secondary/30 cursor-pointer transition-colors ${i % 2 !== 0 ? 'bg-secondary/10' : ''} ${isFlagged ? 'border-l-2 border-l-amber-400' : ''}`}>
                    <td className="px-4 py-3"><span className="text-xs font-mono font-semibold text-foreground">{tx.id}</span></td>
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{tx.date}</td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-foreground whitespace-nowrap">{tx.customer}</p>
                      <p className="text-xs text-muted-foreground">{tx.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5 text-xs font-medium text-foreground whitespace-nowrap">
                        {TYPE_ICON[tx.type]} {tx.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{tx.method}</td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-bold text-foreground whitespace-nowrap">{tx.amount}</span>
                      <span className="text-xs text-muted-foreground ml-1">{tx.currency}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-semibold ${st.className}`}>
                        {st.icon} {st.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {isFlagged ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-300">
                          <AlertCircle size={10} /> Review
                        </span>
                      ) : (
                        <button className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
                          <MoreHorizontal size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-xs text-muted-foreground">Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length} transactions</p>
          <div className="flex items-center gap-2">
            <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-secondary disabled:opacity-40 transition-colors"><ChevronLeft size={14} /></button>
            {Array.from({ length: pages }, (_, i) => (
              <button key={i} onClick={() => setPage(i)} className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold border transition-colors ${page === i ? 'bg-foreground text-background border-foreground' : 'border-border text-muted-foreground hover:bg-secondary'}`}>{i + 1}</button>
            ))}
            <button disabled={page >= pages - 1} onClick={() => setPage(p => p + 1)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-secondary disabled:opacity-40 transition-colors"><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>

      {/* Transaction Detail Slide-over */}
      {selected && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="w-full max-w-md bg-white shadow-2xl flex flex-col h-full">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div>
                <p className="text-xs text-muted-foreground font-mono">{selected.id}</p>
                <h2 className="text-base font-bold text-foreground mt-0.5">Transaction Detail</h2>
              </div>
              <button onClick={() => setSelected(null)} className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary transition-colors text-lg font-light"><X size={16} /></button>
            </div>
            <div className={`mx-5 mt-4 rounded-xl border p-4 flex items-center gap-3 ${STATUS_CONFIG[selected.status].className}`}>
              {STATUS_CONFIG[selected.status].icon}
              <div>
                <p className="text-sm font-bold">{selected.status}</p>
                <p className="text-xs opacity-80">{selected.date}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-xl font-bold">{selected.amount}</p>
                <p className="text-xs opacity-80">{selected.currency}</p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
              <Section title="Customer">
                <Row label="Name" value={selected.customer} />
                <Row label="Email" value={selected.email} />
                <Row label="Country" value={selected.country} />
              </Section>
              <Section title="Transaction">
                <Row label="Reference" value={selected.reference} mono />
                <Row label="Type" value={selected.type} />
                <Row label="Method" value={selected.method} />
                <Row label="Amount" value={`${selected.amount} ${selected.currency}`} bold />
              </Section>
              <Section title="Risk Indicators">
                <Row label="AML Check" value="Clear" green />
                <Row label="Fraud Score" value={selected.status === 'Failed' ? 'High (78/100)' : 'Low (12/100)'} red={selected.status === 'Failed'} />
                <Row label="Velocity Check" value="Normal" green />
                <Row label="Device Verified" value="Yes" green />
              </Section>
            </div>
            <div className="px-5 py-4 border-t border-border flex gap-3">
              <button className="flex-1 py-2.5 rounded-lg bg-foreground text-background text-sm font-semibold hover:bg-foreground/90 transition-colors">Flag for Review</button>
              <button className="flex-1 py-2.5 rounded-lg border border-border text-sm font-semibold text-foreground hover:bg-secondary transition-colors">Download Receipt</button>
            </div>
          </div>
        </div>
      )}

      {/* Initiate Transaction Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => { if (modalStep === 'form') { setShowModal(false); } }} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden">

            {/* ── STEP 1: FORM ── */}
            {modalStep === 'form' && (
              <>
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                  <div>
                    <h2 className="text-lg font-bold text-foreground">Initiate Transaction</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">Fund Transfer · NEFT · Account Channel</p>
                  </div>
                  <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary transition-colors"><X size={16} /></button>
                </div>

                <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">
                  {/* Transaction Meta */}
                  <FormSection icon={<CreditCard size={15} />} title="Transaction Details">
                    <div className="grid grid-cols-2 gap-3">
                      <FormField label="Transaction ID" value={PREFILL.transactionId} mono />
                      <FormField label="Reference" value={PREFILL.reference} mono />
                      <FormField label="Event Type" value={`${PREFILL.eventType} — ${PREFILL.eventSubtype}`} />
                      <FormField label="Channel" value={PREFILL.channel} />
                      <FormField label="Amount" value="$ 4,999.00" bold />
                      <FormField label="Currency" value={PREFILL.currency} />
                    </div>
                  </FormSection>

                  {/* Customer */}
                  <FormSection icon={<User size={15} />} title="Customer (Originator)">
                    <div className="grid grid-cols-2 gap-3">
                      <FormField label="Customer ID" value={PREFILL.customerId} mono />
                      <FormField label="Status" value={PREFILL.customerStatus} green />
                      <FormField label="Full Name" value={PREFILL.customerName} />
                      <FormField label="Phone" value={PREFILL.customerPhone} />
                      <FormField label="Email" value={PREFILL.origHolderEmail} full />
                    </div>
                  </FormSection>

                  {/* Originator Bank */}
                  <FormSection icon={<Building2 size={15} />} title="Originator Bank Account">
                    <div className="grid grid-cols-2 gap-3">
                      <FormField label="Bank Name" value={PREFILL.origBankName} />
                      <FormField label="IFSC Code" value={PREFILL.origBankCode} mono />
                      <FormField label="Account Number" value={PREFILL.origAccountNumber} mono />
                      <FormField label="Account Type" value={PREFILL.origAccountType} />
                      <FormField label="Account Holder" value={PREFILL.origHolderName} />
                    </div>
                  </FormSection>

                  {/* Device & Location */}
                  <FormSection icon={<MapPin size={15} />} title="Device & Location">
                    <div className="grid grid-cols-2 gap-3">
                      <FormField label="City" value={PREFILL.origCity} />
                      <FormField label="State" value={PREFILL.origState} />
                      <FormField label="Country" value={PREFILL.origCountry} />
                      <FormField label="Postal Code" value={PREFILL.origPostal} />
                      <FormField label="IP Address" value={PREFILL.origIp} mono />
                      <FormField label="Mock GPS" value="No" green />
                      <FormField label="VPN Active" value="No" green />
                      <FormField label="App Cloned" value="No" green />
                    </div>
                  </FormSection>

                  {/* Merchant */}
                  <FormSection icon={<Globe size={15} />} title="Merchant">
                    <div className="grid grid-cols-2 gap-3">
                      <FormField label="Merchant ID" value={PREFILL.origMerchantId} mono />
                      <FormField label="Name" value={PREFILL.origMerchantName} />
                      <FormField label="MCC Code" value={PREFILL.origMerchantCategory} mono />
                      <FormField label="City" value={PREFILL.origMerchantCity} />
                      <FormField label="State" value={PREFILL.origMerchantState} />
                      <FormField label="Country" value={PREFILL.origCountry} />
                    </div>
                  </FormSection>

                  {/* Beneficiary */}
                  <FormSection icon={<Landmark size={15} />} title="Beneficiary (Destination)">
                    <div className="grid grid-cols-2 gap-3">
                      <FormField label="Bank Name" value={PREFILL.destBankName} />
                      <FormField label="IFSC Code" value={PREFILL.destBankCode} mono />
                      <FormField label="Account Number" value={PREFILL.destAccountNumber} mono />
                      <FormField label="Account Type" value={PREFILL.destAccountType} />
                      <FormField label="Holder Name" value={PREFILL.destHolderName} />
                      <FormField label="Phone" value={PREFILL.destHolderPhone} />
                      <FormField label="Email" value={PREFILL.destHolderEmail} full />
                    </div>
                  </FormSection>
                </div>

                <div className="px-6 py-4 border-t border-border flex items-center justify-between gap-3 bg-secondary/10">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Lock size={12} />
                    All fields pre-verified · Encrypted channel
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors">Cancel</button>
                    <button onClick={handleSubmit} className="px-6 py-2.5 rounded-lg bg-foreground text-background text-sm font-bold hover:bg-foreground/90 transition-colors flex items-center gap-2">
                      <Zap size={14} /> Submit Transaction
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* ── STEP 2: PROCESSING ── */}
            {modalStep === 'processing' && (
              <div className="flex flex-col items-center justify-center px-8 py-16 gap-8">
                {/* Pulsing ring */}
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-24 h-24 rounded-full border-4 border-primary/20 animate-ping" style={{ animationDuration: '1.5s' }} />
                  <div className="absolute w-20 h-20 rounded-full border-4 border-primary/30 animate-ping" style={{ animationDuration: '1.2s', animationDelay: '0.2s' }} />
                  <div className="w-16 h-16 rounded-full bg-primary/10 border-4 border-primary flex items-center justify-center">
                    <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" style={{ borderWidth: 3 }} />
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="text-xl font-bold text-foreground">Processing Transaction</h3>
                  <p className="text-sm text-muted-foreground mt-1">Please wait while we process your fund transfer</p>
                </div>

                <div className="w-full max-w-sm space-y-3">
                  {PROCESSING_STEPS.map((step, i) => {
                    const done = i < processingIdx;
                    const active = i === processingIdx;
                    return (
                      <div key={step.label} className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-500 ${done ? 'bg-green-50 border-green-200' : active ? 'bg-primary/5 border-primary/30 shadow-sm' : 'bg-secondary/30 border-border opacity-40'}`}>
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${done ? 'bg-green-500 text-white' : active ? 'bg-primary text-white' : 'bg-secondary text-muted-foreground'}`}>
                          {done ? <CheckCircle2 size={14} /> : active ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : step.icon}
                        </div>
                        <span className={`text-sm font-medium transition-colors duration-300 ${done ? 'text-green-700' : active ? 'text-foreground' : 'text-muted-foreground'}`}>{step.label}</span>
                        {done && <CheckCircle2 size={14} className="ml-auto text-green-500" />}
                        {active && <div className="ml-auto flex gap-0.5">{[0,1,2].map(d => <div key={d} className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: `${d * 0.15}s` }} />)}</div>}
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Lock size={12} />
                  Secured by Bureau Financial Compliance Engine
                </div>
              </div>
            )}

            {/* ── STEP 3: FLAGGED — EVALUATION RESULTS ── */}
            {modalStep === 'flagged' && (
              <div className="flex flex-col h-full max-h-[92vh]">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                      <AlertCircle size={16} className="text-amber-600" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-foreground">Evaluation Results</h2>
                      <p className="text-xs text-muted-foreground">Transaction paused — rule flagged during Risk Assessment</p>
                    </div>
                  </div>
                  <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary transition-colors"><X size={16} /></button>
                </div>

                {/* Tabs */}
                <div className="px-6 pt-4 flex-shrink-0">
                  <div className="flex rounded-xl bg-secondary/40 border border-border p-1 gap-1">
                    {(['summary', 'flagged', 'all'] as EvalTab[]).map(tab => (
                      <button
                        key={tab}
                        onClick={() => setEvalTab(tab)}
                        className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors capitalize ${evalTab === tab ? 'bg-white shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                      >
                        {tab === 'flagged' ? 'Flagged Rules' : tab === 'all' ? 'All Rules' : 'Summary'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab content */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">

                  {/* SUMMARY TAB */}
                  {evalTab === 'summary' && (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl border border-border bg-white p-4">
                          <p className="text-xs text-muted-foreground mb-1">Transaction ID</p>
                          <p className="text-sm font-mono font-semibold text-foreground break-all">ee5f410c-2d63-4b6f-aab6-e...</p>
                        </div>
                        <div className="rounded-xl border border-border bg-white p-4">
                          <p className="text-xs text-muted-foreground mb-1">Rules Flagged</p>
                          <p className="text-2xl font-bold text-foreground">1 <span className="text-base font-normal text-muted-foreground">/ 5</span></p>
                        </div>
                      </div>

                      {/* Risk Assessment */}
                      <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Shield size={16} className="text-green-600" />
                          <p className="text-sm font-bold text-foreground">Risk Assessment</p>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-foreground">Risk Category:</span>
                            <span className="text-sm font-bold text-green-700 border border-green-400 rounded-full px-3 py-0.5">Low Risk</span>
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-foreground">Risk Score</span>
                              <span className="text-sm font-bold text-foreground">150/1000</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                              <div className="h-full rounded-full bg-green-500" style={{ width: '15%' }} />
                            </div>
                          </div>
                          <div className="border-t border-green-200 pt-3 flex items-center justify-between">
                            <span className="text-sm font-medium text-foreground">Suggested Action:</span>
                            <span className="text-sm font-bold text-green-700 border border-green-400 rounded-full px-3 py-0.5 uppercase tracking-wide">APPROVE</span>
                          </div>
                        </div>
                      </div>

                      {/* Flagged notice */}
                      <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex items-start gap-3">
                        <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-bold text-red-600">Transaction Flagged</p>
                          <p className="text-xs text-red-500 mt-0.5">This transaction was flagged by 1 rule.</p>
                        </div>
                      </div>
                    </>
                  )}

                  {/* FLAGGED RULES TAB */}
                  {evalTab === 'flagged' && (
                    <div className="rounded-xl border-2 border-red-400 bg-white p-5">
                      <p className="text-sm font-bold text-foreground mb-1">A sum of transaction amount greater than $3,999 in a day</p>
                      <p className="text-xs text-primary mt-1">ID: 9</p>
                    </div>
                  )}

                  {/* ALL RULES TAB */}
                  {evalTab === 'all' && (
                    <div className="space-y-3">
                      {ALL_RULES.map(rule => (
                        <div key={rule.id} className={`rounded-xl border bg-white p-5 ${rule.flagged ? 'border-red-300' : 'border-border'}`}>
                          <div className="flex items-start justify-between gap-3 mb-1">
                            <p className="text-sm font-bold text-foreground leading-snug">{rule.title}</p>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {rule.priority && (
                                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full border border-amber-400 text-amber-600">{rule.priority} Priority</span>
                              )}
                              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${rule.executed ? 'bg-primary text-white' : 'border border-border text-muted-foreground'}`}>
                                {rule.executed ? 'Executed' : 'Not Executed'}
                              </span>
                            </div>
                          </div>
                          <p className="text-xs text-primary mb-2">ID: {rule.id}</p>
                          {rule.expression && (
                            <>
                              <p className="text-xs text-muted-foreground mb-1.5">Expression:</p>
                              <div className="bg-secondary/40 rounded-lg px-3 py-2 font-mono text-xs text-foreground leading-relaxed break-all">
                                {rule.expression}
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer actions */}
                <div className="px-6 py-4 border-t border-border flex gap-3 flex-shrink-0">
                  <button
                    onClick={() => { setShowModal(false); router.push('/dashboard/transactions/alert'); }}
                    className="flex-1 py-2.5 rounded-xl border border-red-200 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Go to Alert
                  </button>
                  <button
                    onClick={handleContinueAfterFlag}
                    className="flex-1 py-2.5 rounded-xl bg-foreground text-background text-sm font-bold hover:bg-foreground/90 transition-colors"
                  >
                    Override &amp; Continue
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 4: DONE ── */}
            {modalStep === 'done' && (
              <div className="flex flex-col items-center justify-center px-8 py-12 gap-6 text-center">
                {/* Success ring */}
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-28 h-28 rounded-full bg-green-100 animate-pulse" />
                  <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-200">
                    <CheckCircle2 size={36} className="text-white" />
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-foreground">Transaction Successful</h3>
                  <p className="text-sm text-muted-foreground mt-1">Your fund transfer has been processed and settled</p>
                </div>

                <div className="w-full max-w-sm bg-secondary/30 rounded-2xl border border-border p-5 text-left space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Transaction ID</span>
                    <span className="font-mono font-bold text-foreground text-xs">{PREFILL.transactionId}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Reference</span>
                    <span className="font-mono font-semibold text-foreground text-xs">{PREFILL.reference}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">From</span>
                    <span className="font-semibold text-foreground text-xs">{PREFILL.customerName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">To</span>
                    <span className="font-semibold text-foreground text-xs">{PREFILL.destHolderName}</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between">
                    <span className="text-sm text-muted-foreground">Amount</span>
                    <span className="text-xl font-bold text-green-600">$ 4,999.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <span className="inline-flex items-center gap-1 text-green-700 font-bold text-xs">
                      <CheckCircle2 size={12} /> COMPLETED
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Settlement</span>
                    <span className="text-foreground font-semibold text-xs">Same day</span>
                  </div>
                </div>

                <div className="flex gap-3 w-full max-w-sm">
                  <button onClick={handleDone} className="flex-1 py-3 rounded-xl bg-foreground text-background text-sm font-bold hover:bg-foreground/90 transition-colors">Done</button>
                  <button className="flex-1 py-3 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-secondary transition-colors">Download Receipt</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{title}</p>
      <div className="bg-secondary/20 rounded-xl border border-border divide-y divide-border">{children}</div>
    </div>
  );
}

function Row({ label, value, mono, bold, green, red }: { label: string; value: string; mono?: boolean; bold?: boolean; green?: boolean; red?: boolean }) {
  return (
    <div className="flex justify-between items-center px-4 py-2.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={`text-xs ${mono ? 'font-mono' : ''} ${bold ? 'font-bold text-foreground' : ''} ${green ? 'text-green-600 font-semibold' : ''} ${red ? 'text-red-600 font-semibold' : ''} ${!bold && !green && !red ? 'font-medium text-foreground' : ''}`}>{value}</span>
    </div>
  );
}

function FormSection({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-md bg-foreground/5 flex items-center justify-center text-foreground/60">{icon}</div>
        <p className="text-sm font-bold text-foreground">{title}</p>
      </div>
      <div className="bg-secondary/20 rounded-xl border border-border p-4">{children}</div>
    </div>
  );
}

function FormField({ label, value, mono, bold, green, full }: { label: string; value: string; mono?: boolean; bold?: boolean; green?: boolean; full?: boolean }) {
  return (
    <div className={full ? 'col-span-2' : ''}>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <div className={`px-3 py-2 rounded-lg border bg-white text-sm ${green ? 'border-green-200 bg-green-50' : 'border-border'}`}>
        <span className={`${mono ? 'font-mono text-xs' : ''} ${bold ? 'font-bold' : 'font-medium'} ${green ? 'text-green-700' : 'text-foreground'}`}>{value}</span>
      </div>
    </div>
  );
}
