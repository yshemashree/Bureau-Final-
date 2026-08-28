"use client"

import { useState } from "react"
import Image from "next/image"
import { BureauLogo } from "@/components/bureau-logo"
import { DemoRequestModal } from "@/components/demo-request-modal"
import {
  ScanFace,
  Building2,
  Smartphone,
  AlertTriangle,
  ShieldCheck,
  ArrowRight,
  LayoutDashboard,
  CheckCircle2,
} from "lucide-react"

export default function Home() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false)
  const [showLiveDemo, setShowLiveDemo] = useState(false)
  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── Nav ── */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200/40 bg-white/80 backdrop-blur-2xl shadow-sm">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 md:px-6 gap-2">
          <div className="flex items-center gap-1.5 md:gap-3 min-w-0">
            <BureauLogo className="h-6 md:h-10 w-auto text-foreground shrink-0" />
            <span className="text-xs md:text-lg font-semibold text-gray-300 shrink-0" aria-hidden="true">×</span>
            <Image
              src="/images/gff-logo.webp"
              alt="Global Fintech Fest 2026"
              width={220}
              height={128}
              className="h-6 md:h-10 w-auto object-contain shrink-0"
              priority
            />
          </div>
          <div className="!hidden w-px h-6 md:h-8 bg-gradient-to-b from-gray-200 via-gray-300 to-gray-200 shrink-0" aria-hidden="true" />
          <a href="/dashboard/platform" className="!hidden inline-flex items-center gap-2 rounded-full bg-[#253B80] px-3 md:px-6 py-1.5 md:py-2.5 text-[11px] md:text-sm font-semibold text-white hover:bg-[#1a2d5a] transition-all shadow-md hover:shadow-lg md:hover:scale-[1.02] shrink-0">
            Platform
          </a>
        </div>
      </header>

      {/* ── Use Cases ── */}
      <section id="products" className="pt-10 pb-4 md:py-16 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/80 via-white to-white" />
        
        <div className="mx-auto max-w-7xl px-4 md:px-6 relative">
          <div className="text-center mb-6 md:mb-12">
            <h2 className="text-[24px] md:text-4xl font-bold text-gray-900 leading-tight tracking-tight text-balance mb-[18px] md:mb-4">
              Protect every stage of your customer journey
            </h2>
            <p className="text-xs md:text-lg text-gray-500 leading-relaxed text-pretty max-w-2xl mx-auto">
              Combine device, behavior, identity, network, and transaction data into one platform for real-time risk decisions across every digital touchpoint.
            </p>
          </div>

          {/* 4 Category Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5 md:gap-5">
            {/* Identity Card */}
            <div className="group relative rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500" />
              <div className="absolute inset-[1px] bg-white rounded-2xl" />
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500" />
              <div className="relative p-2 md:p-4">
                <div className="flex items-center gap-1.5 mb-1 md:gap-2 md:mb-2.5">
                  <div className="w-5 h-5 md:w-9 md:h-9 rounded-lg md:rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-sm md:shadow-lg shadow-orange-500/25 shrink-0">
                    <ScanFace className="w-3 h-3 md:w-5 md:h-5 text-white" strokeWidth={2} />
                  </div>
                  <h3 className="text-[13px] md:text-lg font-bold text-gray-900 leading-tight">Identity</h3>
                </div>
                <div className="space-y-0">
                  <a href="/dashboard/mule" className="flex items-center gap-1.5 text-[12px] md:text-sm text-gray-700 hover:text-orange-600 py-1 md:py-1.5 px-1 md:px-3 rounded-lg hover:bg-orange-50 transition-all duration-200 group/link leading-5">
                    <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-orange-500 shrink-0 group-hover/link:ring-4 group-hover/link:ring-orange-500/20 transition-all" />
                    Mule Detection
                  </a>
                  <a href="/dashboard/kyc" className="flex items-center gap-1.5 text-[12px] md:text-sm text-gray-700 hover:text-orange-600 py-1 md:py-1.5 px-1 md:px-3 rounded-lg hover:bg-orange-50 transition-all duration-200 group/link leading-5">
                    <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-orange-500 shrink-0 group-hover/link:ring-4 group-hover/link:ring-orange-500/20 transition-all" />
                    Customer Verification
                  </a>
                  <a href="/dashboard/kyb" className="flex items-center gap-1.5 text-[12px] md:text-sm text-gray-700 hover:text-orange-600 py-1 md:py-1.5 px-1 md:px-3 rounded-lg hover:bg-orange-50 transition-all duration-200 group/link leading-5">
                    <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-orange-500 shrink-0 group-hover/link:ring-4 group-hover/link:ring-orange-500/20 transition-all" />
                    Merchant Verification
                  </a>
                  <a href="/dashboard/deepfake" className="flex items-center gap-1.5 text-[12px] md:text-sm text-gray-700 hover:text-orange-600 py-1 md:py-1.5 px-1 md:px-3 rounded-lg hover:bg-orange-50 transition-all duration-200 group/link leading-5">
                    <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-orange-500 shrink-0 group-hover/link:ring-4 group-hover/link:ring-orange-500/20 transition-all" />
                    Deepfake Detection
                  </a>
                  <a href="/dashboard/credit" className="flex items-center gap-1.5 text-[12px] md:text-sm text-gray-700 hover:text-orange-600 py-1 md:py-1.5 px-1 md:px-3 rounded-lg hover:bg-orange-50 transition-all duration-200 group/link leading-5">
                    <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-orange-500 shrink-0 group-hover/link:ring-4 group-hover/link:ring-orange-500/20 transition-all" />
                    Alternate Risk Score
                  </a>
                </div>
              </div>
            </div>

            {/* Security Card */}
            <div className="group relative rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-600 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500" />
              <div className="absolute inset-[1px] bg-white rounded-2xl" />
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-600" />
              <div className="relative p-2 md:p-4">
                <div className="flex items-center gap-1.5 mb-1 md:gap-2 md:mb-2.5">
                  <div className="w-5 h-5 md:w-9 md:h-9 rounded-lg md:rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm md:shadow-lg shadow-purple-500/25 shrink-0">
                    <ShieldCheck className="w-3 h-3 md:w-5 md:h-5 text-white" strokeWidth={2} />
                  </div>
                  <h3 className="text-[13px] md:text-lg font-bold text-gray-900 leading-tight">Security</h3>
                </div>
                <div className="space-y-0">
                  <a href="/dashboard/rasp?scenario=reverse" className="flex items-center gap-1.5 text-[12px] md:text-sm text-gray-700 hover:text-purple-600 py-1 md:py-1.5 px-1 md:px-3 rounded-lg hover:bg-purple-50 transition-all duration-200 group/link leading-5">
                    <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-purple-500 shrink-0 group-hover/link:ring-4 group-hover/link:ring-purple-500/20 transition-all" />
                    Code Protection
                  </a>
                  <a href="/dashboard/rasp?scenario=runtime" className="flex items-center gap-1.5 text-[12px] md:text-sm text-gray-700 hover:text-purple-600 py-1 md:py-1.5 px-1 md:px-3 rounded-lg hover:bg-purple-50 transition-all duration-200 group/link leading-5">
                    <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-purple-500 shrink-0 group-hover/link:ring-4 group-hover/link:ring-purple-500/20 transition-all" />
                    Runtime Protection
                  </a>
                  <a href="/dashboard/rasp?scenario=tampering" className="flex items-center gap-1.5 text-[12px] md:text-sm text-gray-700 hover:text-purple-600 py-1 md:py-1.5 px-1 md:px-3 rounded-lg hover:bg-purple-50 transition-all duration-200 group/link leading-5">
                    <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-purple-500 shrink-0 group-hover/link:ring-4 group-hover/link:ring-purple-500/20 transition-all" />
                    Anti-Tampering
                  </a>
                  <a href="/dashboard/rasp?scenario=emulator" className="flex items-center gap-1.5 text-[12px] md:text-sm text-gray-700 hover:text-purple-600 py-1 md:py-1.5 px-1 md:px-3 rounded-lg hover:bg-purple-50 transition-all duration-200 group/link leading-5">
                    <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-purple-500 shrink-0 group-hover/link:ring-4 group-hover/link:ring-purple-500/20 transition-all" />
                    Emulator Detection
                  </a>
                  <a href="/dashboard/rasp-build" className="flex items-center gap-1.5 text-[12px] md:text-sm text-gray-700 hover:text-purple-600 py-1 md:py-1.5 px-1 md:px-3 rounded-lg hover:bg-purple-50 transition-all duration-200 group/link leading-5">
                    <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-purple-500 shrink-0 group-hover/link:ring-4 group-hover/link:ring-purple-500/20 transition-all" />
                    RASP Dashboard
                  </a>
                </div>
              </div>
            </div>

            {/* Fraud Card */}
            <div className="group relative rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-600 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500" />
              <div className="absolute inset-[1px] bg-white rounded-2xl" />
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-600" />
              <div className="relative p-2 md:p-4">
                <div className="flex items-center gap-1.5 mb-1 md:gap-2 md:mb-2.5">
                  <div className="w-5 h-5 md:w-9 md:h-9 rounded-lg md:rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm md:shadow-lg shadow-indigo-500/25 shrink-0">
                    <AlertTriangle className="w-3 h-3 md:w-5 md:h-5 text-white" strokeWidth={2} />
                  </div>
                  <h3 className="text-[13px] md:text-lg font-bold text-gray-900 leading-tight">Fraud</h3>
                </div>
                <div className="space-y-0">
                  <a href="/dashboard/device?tab=ato" className="flex items-center gap-1.5 text-[12px] md:text-sm text-gray-700 hover:text-indigo-600 py-1 md:py-1.5 px-1 md:px-3 rounded-lg hover:bg-indigo-50 transition-all duration-200 group/link leading-5">
                    <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-indigo-500 shrink-0 group-hover/link:ring-4 group-hover/link:ring-indigo-500/20 transition-all" />
                    Account Takeover
                  </a>
                  <a href="/dashboard/device?tab=bot" className="flex items-center gap-1.5 text-[12px] md:text-sm text-gray-700 hover:text-indigo-600 py-1 md:py-1.5 px-1 md:px-3 rounded-lg hover:bg-indigo-50 transition-all duration-200 group/link leading-5">
                    <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-indigo-500 shrink-0 group-hover/link:ring-4 group-hover/link:ring-indigo-500/20 transition-all" />
                    Bot Detection
                  </a>
                  <a href="/dashboard/device?tab=promo" className="flex items-center gap-1.5 text-[12px] md:text-sm text-gray-700 hover:text-indigo-600 py-1 md:py-1.5 px-1 md:px-3 rounded-lg hover:bg-indigo-50 transition-all duration-200 group/link leading-5">
                    <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-indigo-500 shrink-0 group-hover/link:ring-4 group-hover/link:ring-indigo-500/20 transition-all" />
                    Promo Abuse
                  </a>
                  <a href="/dashboard/device?tab=location" className="flex items-center gap-1.5 text-[12px] md:text-sm text-gray-700 hover:text-indigo-600 py-1 md:py-1.5 px-1 md:px-3 rounded-lg hover:bg-indigo-50 transition-all duration-200 group/link leading-5">
                    <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-indigo-500 shrink-0 group-hover/link:ring-4 group-hover/link:ring-indigo-500/20 transition-all" />
                    Location Spoofing
                  </a>
                  <a href="/dashboard/adaptive-auth" className="flex items-center gap-1.5 text-[12px] md:text-sm text-gray-700 hover:text-indigo-600 py-1 md:py-1.5 px-1 md:px-3 rounded-lg hover:bg-indigo-50 transition-all duration-200 group/link leading-5">
                    <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-indigo-500 shrink-0 group-hover/link:ring-4 group-hover/link:ring-indigo-500/20 transition-all" />
                    Adaptive Authentication
                  </a>
                </div>
              </div>
            </div>

            {/* Monitor Card */}
            <div className="group relative rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500" />
              <div className="absolute inset-[1px] bg-white rounded-2xl" />
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
              <div className="relative p-2 md:p-4">
                <div className="flex items-center gap-1.5 mb-1 md:gap-2 md:mb-2.5">
                  <div className="w-5 h-5 md:w-9 md:h-9 rounded-lg md:rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-sm md:shadow-lg shadow-teal-500/25 shrink-0">
                    <LayoutDashboard className="w-3 h-3 md:w-5 md:h-5 text-white" strokeWidth={2} />
                  </div>
                  <h3 className="text-[13px] md:text-lg font-bold text-gray-900 leading-tight">Monitor</h3>
                </div>
                <div className="space-y-0">
                  <a href="/dashboard/frm" className="flex items-center gap-1.5 text-[12px] md:text-sm text-gray-700 hover:text-teal-600 py-1 md:py-1.5 px-1 md:px-3 rounded-lg hover:bg-teal-50 transition-all duration-200 group/link leading-5">
                    <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-teal-500 shrink-0 group-hover/link:ring-4 group-hover/link:ring-teal-500/20 transition-all" />
                    Transaction Monitoring
                  </a>
                  <a href="/dashboard/aml" className="flex items-center gap-1.5 text-[12px] md:text-sm text-gray-700 hover:text-teal-600 py-1 md:py-1.5 px-1 md:px-3 rounded-lg hover:bg-teal-50 transition-all duration-200 group/link leading-5">
                    <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-teal-500 shrink-0 group-hover/link:ring-4 group-hover/link:ring-teal-500/20 transition-all" />
                    AML Screening
                  </a>
                  <a href="/dashboard/smv" className="flex items-center gap-1.5 text-[12px] md:text-sm text-gray-700 hover:text-teal-600 py-1 md:py-1.5 px-1 md:px-3 rounded-lg hover:bg-teal-50 transition-all duration-200 group/link leading-5">
                    <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-teal-500 shrink-0 group-hover/link:ring-4 group-hover/link:ring-teal-500/20 transition-all" />
                    Silent Mobile Verification
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Demo Portal Cards ── */}
      {showLiveDemo && (
      <section className="py-20 md:py-24 bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiLz48Y2lyY2xlIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iLjAyIiBjeD0iMjAiIGN5PSIyMCIgcj0iMSIvPjwvZz48L3N2Zz4=')] opacity-60" />
        <div className="mx-auto max-w-7xl px-6 relative">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#253B80] bg-[#253B80]/5 px-4 py-2 rounded-full mb-4">Live Demos</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Experience Bureau in Action</h2>
            <p className="mt-3 text-base text-gray-500">Pick a portal and explore our platform firsthand</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                href: "/login/admin",
                gradient: "from-[#253B80] to-[#3b5998]",
                title: "Bureau Platform",
                desc: "Configure workflows, review transactions, manage cases and analytics — the full operator view.",
                cta: "Enter Platform",
              },
              {
                href: "/login",
                gradient: "from-emerald-500 to-teal-500",
                title: "Customer Onboarding",
                desc: "See how your end users get verified — document upload, liveness check, identity match.",
                cta: "Try Demo",
              },
              {
                href: "/merchant/login",
                gradient: "from-amber-500 to-orange-500",
                title: "Merchant Onboarding",
                desc: "Full KYC + KYB in one flow — verify business owners and their company simultaneously.",
                cta: "Try Demo",
              },
            ].map((card) => (
              <a
                key={card.href}
                href={card.href}
                className="group relative flex flex-col gap-4 rounded-3xl border border-gray-100 bg-white p-7 shadow-lg shadow-gray-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.gradient}`} />
                <div className="relative flex-1">
                  <p className={`font-bold text-lg bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}>{card.title}</p>
                  <p className="mt-2 text-sm text-gray-500 leading-relaxed">{card.desc}</p>
                </div>
                <div className={`relative flex items-center gap-2 text-sm font-semibold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent group-hover:gap-3 transition-all`}>
                  {card.cta} <ArrowRight size={14} className="text-current" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Demo Request Modal */}
      <DemoRequestModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />

    </div>
  )
}
