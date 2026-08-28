'use client';

import { useDemoMode } from '@/lib/demo-context';
import { CheckCircle2, XCircle } from 'lucide-react';

export function DemoModeBadge() {
  const { isSuccessDemo } = useDemoMode();

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
      isSuccessDemo 
        ? 'bg-green-100 text-green-700 border border-green-200' 
        : 'bg-red-100 text-red-700 border border-red-200'
    }`}>
      {isSuccessDemo ? (
        <>
          <CheckCircle2 size={12} />
          <span>Approved Demo</span>
        </>
      ) : (
        <>
          <XCircle size={12} />
          <span>Rejected Demo</span>
        </>
      )}
    </div>
  );
}
