'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { CountrySelector } from '@/components/country-selector';
import { DraggableProduct } from '@/components/draggable-product';
import { ScanFace, Building2, Smartphone, AlertTriangle, ShieldCheck, ArrowRight, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const PRODUCTS = [
  { id: '1', name: 'Face Selfie', description: 'Biometric verification' },
  { id: '2', name: 'Liveness', description: 'Live face detection' },
  { id: '3', name: 'Dedupe', description: 'Duplicate detection' },
  { id: '4', name: 'OCR', description: 'Document scanning' },
  { id: '5', name: 'Verification KYC', description: 'Know Your Customer' },
  { id: '6', name: 'Verification KYB', description: 'Know Your Business' },
  { id: '7', name: 'Device Output', description: 'Device fingerprinting' },
  { id: '8', name: 'Behavioural Biometric', description: 'Behavioral analysis' },
  { id: '9', name: 'FRM', description: 'Fraud Risk Management' },
  { id: '10', name: 'Alt Data', description: 'Alternative data sources' },
  { id: '11', name: 'Phone Verification', description: 'Phone verification' },
  { id: '12', name: 'Email Verification', description: 'Email verification' },
];

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<ReturnType<typeof getSession> | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const currentSession = getSession();
    setSession(currentSession);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && session === null) {
      router.push('/');
    }
  }, [mounted, session, router]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Main Body Content */}
      <main className="bg-background min-h-screen">
        {/* Hero — white background with network graph */}
        <section className="relative overflow-hidden bg-white border-b border-border" style={{ height: '260px' }}>
          <svg
            aria-hidden="true"
            className="absolute inset-0 w-full h-full pointer-events-none select-none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 400"
            preserveAspectRatio="xMidYMid slice"
          >
            <g stroke="#c7d2fe" strokeWidth="1" fill="none" opacity="0.7">
              <line x1="120" y1="80"  x2="280" y2="150" />
              <line x1="280" y1="150" x2="460" y2="90"  />
              <line x1="460" y1="90"  x2="600" y2="200" />
              <line x1="600" y1="200" x2="780" y2="120" />
              <line x1="780" y1="120" x2="950" y2="230" />
              <line x1="950" y1="230" x2="1100" y2="160"/>
              <line x1="280" y1="150" x2="600" y2="200" />
              <line x1="460" y1="90"  x2="780" y2="120" />
              <line x1="120" y1="80"  x2="460" y2="90"  />
              <line x1="600" y1="200" x2="950" y2="230" />
              <line x1="780" y1="120" x2="1100" y2="160"/>
              <line x1="200" y1="300" x2="460" y2="90"  />
              <line x1="200" y1="300" x2="600" y2="200" />
              <line x1="700" y1="320" x2="780" y2="120" />
              <line x1="700" y1="320" x2="950" y2="230" />
              <line x1="1050" y1="350" x2="1100" y2="160"/>
              <line x1="120" y1="80"  x2="200" y2="300" />
              <line x1="350" y1="260" x2="280" y2="150" />
              <line x1="350" y1="260" x2="600" y2="200" />
              <line x1="870" y1="300" x2="950" y2="230" />
              <line x1="870" y1="300" x2="700" y2="320" />
            </g>
            <g fill="#818cf8" opacity="0.6">
              <circle cx="120"  cy="80"  r="4" />
              <circle cx="280"  cy="150" r="5" />
              <circle cx="460"  cy="90"  r="4" />
              <circle cx="600"  cy="200" r="6" />
              <circle cx="780"  cy="120" r="4" />
              <circle cx="950"  cy="230" r="5" />
              <circle cx="1100" cy="160" r="4" />
              <circle cx="200"  cy="300" r="3.5" />
              <circle cx="350"  cy="260" r="3.5" />
              <circle cx="700"  cy="320" r="4" />
              <circle cx="870"  cy="300" r="3.5" />
              <circle cx="1050" cy="350" r="3.5" />
            </g>
          </svg>

          {/* Headline */}
          <div className="relative z-10 flex flex-col justify-center h-full px-6 sm:px-10 max-w-2xl">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-snug text-balance">
              AI-Powered{' '}
              <span className="text-[#3B5FDB]">Unified Risk Decisioning</span>
              {' '}for the Entire Customer Life Cycle
            </h1>
          </div>

          {/* Stats row — anchored to bottom */}
          <div className="absolute bottom-5 left-0 right-0 z-10 px-6 sm:px-10">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 bg-white border border-border rounded-full px-4 py-1.5 shadow-sm mr-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-foreground text-xs font-medium tracking-wide">Live</span>
              </div>
              {[
                { value: '200+', label: 'Countries' },
                { value: '99.4%', label: 'Accuracy' },
                { value: '<3s',   label: 'Response'  },
              ].map(stat => (
                <div key={stat.label} className="bg-white border border-border rounded-xl px-4 py-2 shadow-sm">
                  <p className="text-foreground font-bold text-base leading-none">{stat.value}</p>
                  <p className="text-muted-foreground text-[10px] mt-1 tracking-widest uppercase">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Part 1: Start Verification - Type Selector */}
        <section className="border-b border-border py-10 sm:py-14 relative overflow-hidden">
          {/* World map low-opacity background */}
          <svg
            aria-hidden="true"
            className="absolute inset-0 w-full h-full pointer-events-none select-none"
            viewBox="0 0 2000 1000"
            preserveAspectRatio="xMidYMid slice"
            opacity="0.06"
          >
            <path
              fill="#2d3e7a"
              d="M250,200 Q300,180 350,200 L370,240 Q340,260 300,250 Q270,240 250,200Z
                 M400,150 Q460,130 500,155 L520,190 Q490,210 450,200 Q420,185 400,150Z
                 M160,280 Q210,265 240,285 L245,320 Q220,335 190,325 Q165,310 160,280Z
                 M520,120 Q580,105 620,125 L630,160 Q600,175 565,165 Q535,150 520,120Z
                 M620,170 Q680,155 720,175 L725,210 Q695,225 660,215 Q630,200 620,170Z
                 M700,130 Q750,118 785,135 L790,168 Q762,180 730,172 Q705,158 700,130Z
                 M800,100 Q855,88 890,105 L895,138 Q867,150 835,143 Q808,130 800,100Z
                 M880,160 Q930,148 965,165 L968,198 Q940,210 910,203 Q883,190 880,160Z
                 M950,120 Q1000,108 1035,125 L1038,158 Q1010,170 980,163 Q953,150 950,120Z
                 M1050,80 Q1100,68 1135,85 L1138,118 Q1110,130 1080,123 Q1053,110 1050,80Z
                 M1140,130 Q1190,118 1220,135 L1222,168 Q1195,180 1167,173 Q1143,160 1140,130Z
                 M1220,90 Q1265,80 1295,96 L1297,128 Q1272,140 1245,133 Q1222,120 1220,90Z
                 M1300,150 Q1345,140 1372,156 L1374,187 Q1349,198 1323,192 Q1302,180 1300,150Z
                 M300,350 Q345,338 372,354 L374,385 Q349,396 323,390 Q302,378 300,350Z
                 M450,400 Q495,388 522,404 L524,435 Q499,446 473,440 Q452,428 450,400Z
                 M600,360 Q645,348 672,364 L674,395 Q649,406 623,400 Q602,388 600,360Z
                 M750,420 Q795,408 822,424 L824,455 Q799,466 773,460 Q752,448 750,420Z
                 M900,380 Q945,368 972,384 L974,415 Q949,426 923,420 Q902,408 900,380Z
                 M1050,440 Q1095,428 1122,444 L1124,475 Q1099,486 1073,480 Q1052,468 1050,440Z
                 M1200,400 Q1245,388 1272,404 L1274,435 Q1249,446 1223,440 Q1202,428 1200,400Z
                 M1350,460 Q1395,448 1422,464 L1424,495 Q1399,506 1373,500 Q1352,488 1350,460Z
                 M1500,420 Q1545,408 1572,424 L1574,455 Q1549,466 1523,460 Q1502,448 1500,420Z
                 M200,480 Q240,470 265,484 L267,512 Q244,522 220,517 Q200,506 200,480Z
                 M350,520 Q390,510 415,524 L417,552 Q394,562 370,557 Q350,546 350,520Z
                 M500,560 Q540,550 565,564 L567,592 Q544,602 520,597 Q500,586 500,560Z
                 M650,500 Q690,490 715,504 L717,532 Q694,542 670,537 Q650,526 650,500Z
                 M800,560 Q840,550 865,564 L867,592 Q844,602 820,597 Q800,586 800,560Z
                 M950,520 Q990,510 1015,524 L1017,552 Q994,562 970,557 Q950,546 950,520Z
                 M1100,580 Q1140,570 1165,584 L1167,612 Q1144,622 1120,617 Q1100,606 1100,580Z
                 M1250,540 Q1290,530 1315,544 L1317,572 Q1294,582 1270,577 Q1250,566 1250,540Z
                 M1400,600 Q1440,590 1465,604 L1467,632 Q1444,642 1420,637 Q1400,626 1400,600Z
                 M1550,560 Q1585,552 1608,564 L1610,590 Q1588,600 1566,595 Q1548,585 1550,560Z
                 M1650,480 Q1685,472 1708,484 L1710,510 Q1688,520 1666,515 Q1648,505 1650,480Z
                 M1720,540 Q1755,532 1778,544 L1780,570 Q1758,580 1736,575 Q1718,565 1720,540Z
                 M1800,500 Q1835,492 1858,504 L1860,530 Q1838,540 1816,535 Q1798,525 1800,500Z"
            />
          </svg>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">Start Verification</h1>
                <p className="text-sm sm:text-base text-muted-foreground">Supporting verifications in 200+ countries</p>
              </div>
              <CountrySelector />
            </div>

            {/* ── Two-column layout: tall journey cards (left) + product list (right) ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">

              {/* Left column — Start Verification tall cards */}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3 px-1">Start Verification</p>
                <div className="flex flex-col gap-3">
                  {[
                    {
                      href: '/dashboard/verification/workflow',
                      icon: <ScanFace size={20} />,
                      iconBg: 'bg-[#253B80]/10',
                      iconColor: 'text-[#253B80]',
                      tag: 'KYC',
                      tagBg: 'bg-[#253B80]/8 text-[#253B80]',
                      tagBorder: 'border border-[#253B80]/20',
                      title: 'Customer Onboarding',
                      desc: 'Document OCR · Liveness · Face match · Risk scoring',
                    },
                    {
                      href: '/dashboard/verification-combined',
                      icon: <Building2 size={20} />,
                      iconBg: 'bg-amber-500/10',
                      iconColor: 'text-amber-600',
                      tag: 'KYC + KYB',
                      tagBg: 'bg-amber-500/10 text-amber-600',
                      tagBorder: 'border border-amber-400/30',
                      title: 'Merchant Onboarding',
                      desc: 'Business registry · Director KYC · Entity risk',
                    },
                  ].map((card) => (
                    <div key={card.href} className="rounded-xl border border-[#e8edf8] bg-[#f0f4fc] p-3.5 flex flex-col gap-2.5">
                      <div className="flex items-start justify-between">
                        <div className={`w-9 h-9 rounded-lg ${card.iconBg} flex items-center justify-center ${card.iconColor}`}>
                          {card.icon}
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${card.tagBg} ${card.tagBorder}`}>
                          {card.tag}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{card.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{card.desc}</p>
                      </div>
                      <Link href={card.href} className="w-full">
                        <button className="w-full bg-[#253B80] hover:bg-[#1a2d5a] text-white text-sm font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
                          Start Journey <ArrowRight size={13} />
                        </button>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right column — Additional Products list rows */}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3 px-1">Access Additional Products</p>
                <div className="rounded-xl border border-[#e8edf8] bg-[#f0f4fc] overflow-hidden divide-y divide-[#e8edf8]">
                  {[
                    {
                      href: '/dashboard/device',
                      icon: <Smartphone size={18} />,
                      iconBg: 'bg-violet-500/10',
                      iconColor: 'text-violet-600',
                      tag: 'Device Signals',
                      tagBg: 'bg-violet-500/10 text-violet-600',
                      tagBorder: 'border border-violet-300/40',
                      title: 'Device Intelligence',
                      desc: 'Fingerprint · Bot detection · VPN signals',
                    },
                    {
                      href: '/dashboard/transactions',
                      icon: <AlertTriangle size={18} />,
                      iconBg: 'bg-rose-500/10',
                      iconColor: 'text-rose-600',
                      tag: 'Fraud Platform',
                      tagBg: 'bg-rose-500/10 text-rose-600',
                      tagBorder: 'border border-rose-300/40',
                      title: 'Transaction Fraud',
                      desc: 'Real-time scoring · Velocity rules · Case mgmt',
                    },
                    {
                      href: '/dashboard/workflow',
                      icon: <ShieldCheck size={18} />,
                      iconBg: 'bg-teal-500/10',
                      iconColor: 'text-teal-600',
                      tag: 'AML',
                      tagBg: 'bg-teal-500/10 text-teal-600',
                      tagBorder: 'border border-teal-300/40',
                      title: 'AML Compliance',
                      desc: 'Sanctions · PEP detection · SAR automation',
                    },
                  ].map((row) => (
                    <Link key={row.href} href={row.href} className="group flex items-center gap-3.5 px-4 py-4 hover:bg-muted/40 transition-colors">
                      <div className={`w-10 h-10 rounded-xl ${row.iconBg} flex items-center justify-center flex-shrink-0 ${row.iconColor}`}>
                        {row.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-foreground">{row.title}</span>
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${row.tagBg} ${row.tagBorder}`}>
                            {row.tag}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{row.desc}</p>
                      </div>
                      <ChevronRight size={15} className="flex-shrink-0 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>

            </div>{/* end 2-col grid */}
          </div>
        </section>

        {/* Part 1.5: Available Products - Auto-scrolling Marquee */}
        <section className="border-b border-border py-8 sm:py-12 bg-secondary/30">
          <div className="overflow-hidden">
            <div className="marquee flex gap-4">
              {[...PRODUCTS, ...PRODUCTS].map((product, index) => (
                <div key={`${product.id}-${index}`} className="flex-shrink-0">
                  <DraggableProduct
                    id={product.id}
                    name={product.name}
                    description={product.description}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="border-b border-border py-10 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8 sm:mb-12">
              <p className="text-sm font-semibold text-primary mb-2">HOW IT WORKS</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">Get Verified in 3 Simple Steps</h2>
              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">Our streamlined process makes identity verification quick and hassle-free for your users.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">1</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Select ID Type</h3>
                <p className="text-muted-foreground">Choose your country and the type of ID document you wish to use.</p>
              </div>

              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">2</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Upload Documents</h3>
                <p className="text-muted-foreground">Securely upload images of your ID and a selfie for liveness check.</p>
              </div>

              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">3</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Get Verified</h3>
                <p className="text-muted-foreground">Our AI-powered system verifies your identity in seconds.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Bureau Section */}
        <section className="border-b border-border py-10 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-8 sm:mb-12">
              <p className="text-sm font-semibold text-primary mb-2">WHY BUREAU</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">Advanced Identity Verification Features</h2>
              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">Experience next-generation identity verification with AI-powered fraud detection, real-time risk assessment, and comprehensive global database checks.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
              <div className="p-6 bg-card border border-border rounded-lg">
                <h3 className="text-xl font-semibold text-foreground mb-3">AI-Powered Security</h3>
                <p className="text-muted-foreground">Advanced machine learning algorithms detect sophisticated fraud attempts and synthetic identities with industry-leading accuracy.</p>
              </div>

              <div className="p-6 bg-card border border-border rounded-lg ring-2 ring-primary">
                <h3 className="text-xl font-semibold text-foreground mb-3">Real-time Processing</h3>
                <p className="text-muted-foreground">Get instant verification results with our high-performance infrastructure that processes millions of verifications daily.</p>
              </div>

              <div className="p-6 bg-card border border-border rounded-lg">
                <h3 className="text-xl font-semibold text-foreground mb-3">Global Coverage</h3>
                <p className="text-muted-foreground">Verify identities from 200+ countries with access to government databases, sanctions lists, and comprehensive risk intelligence.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Trusted Platform Section */}
        <section className="border-b border-border py-10 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <p className="text-sm font-semibold text-primary mb-2">TRUSTED PLATFORM</p>
              <h2 className="text-3xl font-bold text-foreground mb-3">The Complete Trust & Safety Platform</h2>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto">Bureau's comprehensive identity verification platform helps businesses prevent fraud, ensure compliance, and build trust with their customers through cutting-edge technology.</p>
            </div>

            <div className="max-w-2xl mx-auto bg-card border border-border rounded-lg p-8 mb-8">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-1">✓</span>
                  <span className="text-foreground">Real-time risk scoring and fraud detection</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-1">✓</span>
                  <span className="text-foreground">Advanced biometric and liveness detection</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-1">✓</span>
                  <span className="text-foreground">Multi-layered document authentication</span>
                </li>
              </ul>
            </div>

            <div className="text-center">
              <Link href="/dashboard/verification/workflow">
                <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-base rounded-lg font-medium">
                  Start Customer Onboarding
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
