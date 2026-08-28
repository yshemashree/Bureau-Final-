'use client';

import { useDemoMode } from '@/lib/demo-context';

export function DemoModeToggle() {
  const { demoMode, setDemoMode } = useDemoMode();
  const isSuccess = demoMode === 'success';

  const toggle = () => setDemoMode(isSuccess ? 'failure' : 'success');

  return (
    <button
      onClick={toggle}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
        isSuccess 
          ? 'bg-green-100 text-green-700 hover:bg-green-200' 
          : 'bg-red-100 text-red-700 hover:bg-red-200'
      }`}
    >
      {/* Toggle switch */}
      <div className={`relative w-8 h-4 rounded-full transition-colors ${
        isSuccess ? 'bg-green-500' : 'bg-red-500'
      }`}>
        <div
          className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform ${
            isSuccess ? 'left-[18px]' : 'left-0.5'
          }`}
        />
      </div>
      <span>{isSuccess ? 'Approved' : 'Rejected'}</span>
    </button>
  );
}
