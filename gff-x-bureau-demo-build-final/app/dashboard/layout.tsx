'use client';

import { SidebarNav } from '@/components/sidebar-nav';
import { DemoProvider } from '@/lib/demo-context';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getSession } from '@/lib/auth';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [isOperator, setIsOperator] = useState(false);
  const pathname = usePathname();
  // /dashboard/verification/workflow is an admin config page — keep the sidebar
  const isVerificationRoute = pathname?.startsWith('/dashboard/verification')
    && !pathname?.startsWith('/dashboard/verification/workflow');
  const isPaymentRoute = pathname?.startsWith('/dashboard/payment');
  const isUserJourneyRoute = isVerificationRoute || isPaymentRoute
    || pathname?.startsWith('/dashboard/device')
    || pathname?.startsWith('/dashboard/verification-type')
    || pathname?.startsWith('/dashboard/aml')
    || pathname?.startsWith('/dashboard/frm')
    || pathname?.startsWith('/dashboard/platform')
    || pathname?.startsWith('/dashboard/kyc')
    || pathname?.startsWith('/dashboard/kyb')
    || pathname?.startsWith('/dashboard/mule')
    || pathname?.startsWith('/dashboard/rasp')
    || pathname?.startsWith('/dashboard/deepfake')
    || pathname?.startsWith('/dashboard/smv')
    || pathname?.startsWith('/dashboard/adaptive-auth')
    || pathname?.startsWith('/dashboard/credit');

  useEffect(() => {
    // Check once on mount whether an operator session exists
    setIsOperator(!!getSession());
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      setSidebarCollapsed((e as CustomEvent<boolean>).detail);
    };
    window.addEventListener('sidebar-collapse', handler);
    return () => window.removeEventListener('sidebar-collapse', handler);
  }, []);

  // User/customer journey routes: never show the admin sidebar
  if (isUserJourneyRoute) {
    return (
      <DemoProvider>
        <div className="portrait-demo min-h-[100dvh] w-full overflow-x-hidden">
          {children}
        </div>
      </DemoProvider>
    );
  }

  return (
    <DemoProvider>
      <div className="portrait-demo flex min-h-[100dvh] overflow-x-hidden">
        <SidebarNav />
        <div
          className={`flex-1 min-w-0 transition-all duration-200 pt-14 sm:pt-0 ${
            sidebarCollapsed ? 'ml-0 sm:ml-16' : 'ml-0 sm:ml-60'
          }`}
        >
          {children}
        </div>
      </div>
    </DemoProvider>
  );
}
