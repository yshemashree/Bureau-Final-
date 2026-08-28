'use client';

import { useDemoMode } from '@/lib/demo-context';
import { CheckCircle2, XCircle } from 'lucide-react';

export function DemoScenarioToggle() {
  const { demoMode, setDemoMode } = useDemoMode();
  const isSuccess = demoMode === 'success';

  return (
    <div className="flex flex-col items-end gap-1">
      <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Demo Scenario</span>
      <div className="flex items-center p-1 bg-secondary/50 rounded-full border border-border">
        <button
          onClick={() => setDemoMode('success')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
            isSuccess 
              ? 'bg-green-500 text-white shadow-sm' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <CheckCircle2 size={12} />
          <span>Approved</span>
        </button>
        <button
          onClick={() => setDemoMode('failure')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
            !isSuccess 
              ? 'bg-red-500 text-white shadow-sm' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <XCircle size={12} />
          <span>Rejected</span>
        </button>
      </div>
    </div>
  );
}
