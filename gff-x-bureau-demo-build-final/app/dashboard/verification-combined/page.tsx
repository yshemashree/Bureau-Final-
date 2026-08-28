'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { setMerchantSession } from '@/lib/auth';

export default function VerificationCombinedRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Pre-set the merchant session so the user lands directly on the
    // onboarding form without going through the login screen.
    setMerchantSession();
    router.replace('/merchant/onboarding');
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
