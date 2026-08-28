'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, LogOut, Shield, Activity, CheckCircle2 } from 'lucide-react';

const TXN_ID = 'TXN-2024-APL-80659';

type ToastStatus = 'hidden' | 'in-progress' | 'completed';

export default function TransactionReviewPage() {
  const router = useRouter();

  // Admin notification 1 — Device Signal (mirrors what fired on verification page)
  const [deviceStatus, setDeviceStatus] = useState<ToastStatus>('hidden');
  // Admin notification 2 — Transaction Monitoring Signal
  const [txnStatus, setTxnStatus]  = useState<ToastStatus>('hidden');

  useEffect(() => {
    // Device Signal: in at 600ms, complete at 2.6s, out at 5.6s
    const t1 = setTimeout(() => setDeviceStatus('in-progress'), 600);
    const t2 = setTimeout(() => setDeviceStatus('completed'),   2600);
    const t3 = setTimeout(() => setDeviceStatus('hidden'),      5600);

    // Transaction Monitoring: in at 4s, complete at 6.5s, out at 9.5s
    const t4 = setTimeout(() => setTxnStatus('in-progress'), 4000);
    const t5 = setTimeout(() => setTxnStatus('completed'),   6500);
    const t6 = setTimeout(() => setTxnStatus('hidden'),      9500);

    return () => [t1, t2, t3, t4, t5, t6].forEach(clearTimeout);
  }, []);

  // Persist this transaction so the admin portal Transactions page can show it
  useEffect(() => {
    const pending = {
      id: TXN_ID,
      date: new Date().toLocaleString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: 'numeric', minute: '2-digit', hour12: true,
      }),
      customer: 'Apple Inc',
      email: 'treasury@apple.com',
      type: 'Payment',
      method: 'Wallet',
      amount: '4,999.00',
      currency: 'USD',
      status: 'Pending',
      reference: 'KYB-2024-806592',
      country: 'United States',
    };
    try {
      // Write into the shared bureau-transactions array so all journeys surface in the admin list
      const existing: typeof pending[] = JSON.parse(localStorage.getItem('bureau-transactions') || '[]');
      if (!existing.find((t) => t.id === pending.id)) {
        localStorage.setItem('bureau-transactions', JSON.stringify([pending, ...existing]));
      }
      // Legacy single-key kept for backward compat
      localStorage.setItem('pending-transaction', JSON.stringify(pending));
    } catch {
      // storage may be unavailable in some contexts
    }
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* ── Admin notification stack (top-right) ── */}
      <div className="fixed right-4 z-[60] flex flex-col gap-2" style={{ top: '70px' }}>

        {/* Notification 1: Device Signal */}
        <div
          aria-live="polite"
          className={`transition-all duration-500 ease-out ${
            deviceStatus !== 'hidden'
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 -translate-y-3 pointer-events-none'
          }`}
        >
          <div className="bg-white border border-border shadow-xl rounded-xl overflow-hidden w-72">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-[#0f1b3d]">
              <Shield size={12} className="text-blue-300 flex-shrink-0" />
              <span className="text-xs font-semibold text-white tracking-wide uppercase">Admin Notification</span>
            </div>
            <div className="px-4 py-3 flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {deviceStatus === 'completed' ? (
                  <CheckCircle2 size={18} className="text-green-500" />
                ) : (
                  <span className="relative flex h-4 w-4 items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-60" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">Device Signal Detected</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {deviceStatus === 'completed' ? (
                    <>
                      <span className="inline-flex h-2 w-2 rounded-full bg-green-500 flex-shrink-0" />
                      <p className="text-xs text-green-700 font-medium">Risk Assessment Completed</p>
                    </>
                  ) : (
                    <>
                      <span className="inline-flex h-2 w-2 rounded-full bg-amber-500 flex-shrink-0 animate-pulse" />
                      <p className="text-xs text-amber-700 font-medium">Risk Assessment in progress...</p>
                    </>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">user@demo.com &middot; just now</p>
              </div>
            </div>
          </div>
        </div>

        {/* Notification 2: Transaction Monitoring Signal */}
        <div
          aria-live="polite"
          className={`transition-all duration-500 ease-out ${
            txnStatus !== 'hidden'
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 -translate-y-3 pointer-events-none'
          }`}
        >
          <div className="bg-white border border-border shadow-xl rounded-xl overflow-hidden w-72">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-[#0f1b3d]">
              <Activity size={12} className="text-blue-300 flex-shrink-0" />
              <span className="text-xs font-semibold text-white tracking-wide uppercase">Admin Notification</span>
            </div>
            <div className="px-4 py-3 flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {txnStatus === 'completed' ? (
                  <CheckCircle2 size={18} className="text-green-500" />
                ) : (
                  <span className="relative flex h-4 w-4 items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-60" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">Transaction Monitoring Signal</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {txnStatus === 'completed' ? (
                    <>
                      <span className="inline-flex h-2 w-2 rounded-full bg-green-500 flex-shrink-0" />
                      <p className="text-xs text-green-700 font-medium">Signal Fetched &amp; Verified</p>
                    </>
                  ) : (
                    <>
                      <span className="inline-flex h-2 w-2 rounded-full bg-amber-500 flex-shrink-0 animate-pulse" />
                      <p className="text-xs text-amber-700 font-medium">Fetching transaction signal...</p>
                    </>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">TXN-2024-APL-80659 &middot; just now</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background">
        <svg height="22" viewBox="0 0 124 33" xmlns="http://www.w3.org/2000/svg" aria-label="PayPal"><path fill="#253B80" d="M46.211 6.749h-6.839a.95.95 0 0 0-.939.802l-2.766 17.537a.57.57 0 0 0 .564.658h3.265a.95.95 0 0 0 .939-.803l.746-4.73a.95.95 0 0 1 .938-.803h2.165c4.505 0 7.105-2.18 7.784-6.496.306-1.89.013-3.375-.872-4.415-.972-1.142-2.696-1.75-4.985-1.75zM47 13.154c-.374 2.454-2.249 2.454-4.062 2.454h-1.032l.724-4.583a.57.57 0 0 1 .563-.481h.473c1.235 0 2.4 0 3.002.704.359.42.468 1.044.332 1.906zM66.654 13.075h-3.275a.57.57 0 0 0-.563.481l-.145.916-.229-.332c-.709-1.029-2.29-1.373-3.868-1.373-3.619 0-6.71 2.741-7.312 6.586-.313 1.918.132 3.752 1.22 5.031.998 1.176 2.426 1.666 4.125 1.666 2.916 0 4.533-1.875 4.533-1.875l-.146.91a.57.57 0 0 0 .562.66h2.95a.95.95 0 0 0 .939-.803l1.77-11.209a.568.568 0 0 0-.561-.658zm-4.565 6.374c-.316 1.871-1.801 3.127-3.695 3.127-.951 0-1.711-.305-2.199-.883-.484-.574-.668-1.391-.514-2.301.295-1.855 1.805-3.152 3.67-3.152.93 0 1.686.309 2.184.892.499.589.697 1.411.554 2.317zM84.096 13.075h-3.291a.954.954 0 0 0-.787.417l-4.539 6.686-1.924-6.425a.953.953 0 0 0-.912-.678h-3.234a.57.57 0 0 0-.541.754l3.625 10.638-3.408 4.811a.57.57 0 0 0 .465.9h3.287a.949.949 0 0 0 .781-.408l10.946-15.8a.57.57 0 0 0-.468-.895z"/><path fill="#179BD7" d="M94.992 6.749h-6.84a.95.95 0 0 0-.938.802l-2.766 17.537a.569.569 0 0 0 .562.658h3.51a.665.665 0 0 0 .656-.562l.785-4.971a.95.95 0 0 1 .938-.803h2.164c4.506 0 7.105-2.18 7.785-6.496.307-1.89.012-3.375-.873-4.415-.971-1.142-2.694-1.75-4.983-1.75zm.789 6.405c-.373 2.454-2.248 2.454-4.062 2.454h-1.031l.725-4.583a.568.568 0 0 1 .562-.481h.473c1.234 0 2.4 0 3.002.704.358.42.467 1.044.331 1.906zM115.434 13.075h-3.273a.567.567 0 0 0-.562.481l-.145.916-.23-.332c-.709-1.029-2.289-1.373-3.867-1.373-3.619 0-6.709 2.741-7.311 6.586-.312 1.918.131 3.752 1.219 5.031 1 1.176 2.426 1.666 4.125 1.666 2.916 0 4.533-1.875 4.533-1.875l-.146.91a.57.57 0 0 0 .564.66h2.949a.95.95 0 0 0 .938-.803l1.771-11.209a.571.571 0 0 0-.565-.658zm-4.565 6.374c-.314 1.871-1.801 3.127-3.695 3.127-.949 0-1.711-.305-2.199-.883-.484-.574-.666-1.391-.514-2.301.297-1.855 1.805-3.152 3.67-3.152.93 0 1.686.309 2.184.892.501.589.699 1.411.554 2.317zM119.295 7.23l-2.807 17.858a.569.569 0 0 0 .562.658h2.822c.469 0 .867-.341.939-.803l2.768-17.536a.57.57 0 0 0-.562-.659h-3.16a.571.571 0 0 0-.562.482z"/><path fill="#253B80" d="M7.266 29.154l.523-3.322-1.165-.027H1.061L4.927 1.292a.316.316 0 0 1 .314-.268h9.38c3.114 0 5.263.648 6.385 1.927.526.6.861 1.227 1.023 1.917.17.724.173 1.589.007 2.644l-.012.077v.676l.526.298a3.69 3.69 0 0 1 1.065.812c.45.513.741 1.165.864 1.938.127.795.085 1.741-.123 2.812-.24 1.232-.628 2.305-1.152 3.183a6.547 6.547 0 0 1-1.825 2.063c-.696.49-1.523.861-2.458 1.099-.906.236-1.939.355-3.072.355h-.73c-.522 0-1.029.188-1.427.525a2.21 2.21 0 0 0-.744 1.328l-.055.299-.924 5.855-.042.215c-.011.068-.03.102-.058.125a.155.155 0 0 1-.096.035H7.266z"/><path fill="#179BD7" d="M23.048 7.667c-.028.179-.06.362-.096.55-1.237 6.351-5.469 8.545-10.874 8.545H9.326c-.661 0-1.218.48-1.321 1.132L6.596 26.83l-.399 2.533a.704.704 0 0 0 .695.814h4.881c.578 0 1.069-.42 1.16-.99l.048-.248.919-5.832.059-.32c.09-.572.582-.992 1.16-.992h.73c4.729 0 8.431-1.92 9.513-7.476.452-2.321.218-4.259-.978-5.622a4.667 4.667 0 0 0-1.336-1.03z"/><path fill="#222D65" d="M21.754 7.151a9.757 9.757 0 0 0-1.203-.267 15.284 15.284 0 0 0-2.426-.177h-7.352a1.172 1.172 0 0 0-1.159.992L8.05 17.605l-.045.289a1.336 1.336 0 0 1 1.321-1.132h2.752c5.405 0 9.637-2.195 10.874-8.545.037-.188.068-.371.096-.55a6.594 6.594 0 0 0-1.017-.448 9.045 9.045 0 0 0-.277-.068z"/><path fill="#253B80" d="M9.614 7.699a1.169 1.169 0 0 1 1.159-.991h7.352c.871 0 1.684.057 2.426.177a9.757 9.757 0 0 1 1.481.353c.365.121.704.264 1.017.448.368-2.347-.003-3.945-1.272-5.392C20.378.682 17.853 0 14.622 0h-9.38c-.66 0-1.223.48-1.325 1.133L.01 25.898a.806.806 0 0 0 .795.932h5.791l1.454-9.225 1.564-9.906z"/></svg>
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <LogOut size={13} />
          <span>Back to Dashboard</span>
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
      <div className="flex flex-col items-center text-center max-w-sm w-full space-y-6">

        {/* Animated icon */}
        <div className="relative w-20 h-20">
          {/* Outer pulse ring */}
          <span className="absolute inset-0 rounded-full bg-amber-100 animate-ping opacity-60" />
          <div className="relative w-20 h-20 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center">
            <Clock size={32} className="text-amber-500 animate-pulse" />
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Transaction Under Review</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your payment of <span className="font-semibold text-foreground">$4,999.00</span> has been submitted and is currently under review by our compliance team.
          </p>
        </div>

        {/* Transaction ID pill */}
        <div className="w-full rounded-xl border border-border bg-secondary/30 px-5 py-3 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Transaction ID</span>
          <span className="font-mono font-semibold text-foreground">{TXN_ID}</span>
        </div>

      </div>
      </div>
    </div>
  );
}
