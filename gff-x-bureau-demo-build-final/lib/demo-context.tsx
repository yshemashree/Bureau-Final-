'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { getDemoData, type DemoData } from './demo-country-data';
import { isAcceptedCountry } from './document-sample-images';

export interface CaseEntry {
  id: string;
  date: string;
  status: 'approved' | 'rejected' | 'pending';
  resolution: string;
  idType: string;
  name: string;
  country: string;
  countryCode: string;
  faceMatch: string;
  liveness: string;
  risk: string;
  assignedTo: string;
  priority: 'High' | 'Medium' | 'Low';
  demoMode: 'success' | 'failure';
  frontPreview: string | null;
  backPreview: string | null;
  selfiePreview: string | null;
}

interface DemoContextType {
  /** 
   * isSuccessDemo is now computed from selectedCountry.
   * Accepted countries (AU, GB, NZ, US, DE) = success, all others = failure.
   */
  isSuccessDemo: boolean;
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  currentDemoData: DemoData;
  cases: CaseEntry[];
  addCase: (entry: CaseEntry) => void;
  /** @deprecated Use isSuccessDemo instead - kept for backwards compatibility */
  demoMode: 'success' | 'failure';
  /** @deprecated No longer functional - outcome is determined by country */
  setDemoMode: (mode: 'success' | 'failure') => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

// Legacy exports for backwards compatibility (using US defaults)
export const SUCCESS_DATA = getDemoData('US', 'success');
export const FAILURE_DATA = getDemoData('US', 'failure');

// Verification results generator based on country data
export function getVerificationResult(countryCode: string, scenario: 'success' | 'failure') {
  const data = getDemoData(countryCode, scenario);
  
  if (scenario === 'success') {
    return {
      status: 'success' as const,
      title: 'Identity Verified Successfully',
      confidenceScore: data.verificationScore,
      checks: [
        { name: 'Document Authenticity', status: 'passed' as const, detail: 'Document verified as genuine' },
        { name: 'Face Match', status: 'passed' as const, detail: `Face match confidence: ${(data.verificationScore - 1.5).toFixed(1)}%` },
        { name: 'Liveness Check', status: 'passed' as const, detail: 'Liveness confirmed with high confidence' },
        { name: 'Data Consistency', status: 'passed' as const, detail: 'All data points match and are consistent' },
      ],
      riskLevel: data.riskLevel,
      recommendation: 'Approve',
    };
  } else {
    const reasons = data.failureReasons!;
    return {
      status: 'failed' as const,
      title: 'Verification Failed — Manual Review Required',
      confidenceScore: data.verificationScore,
      checks: [
        { name: 'Document Authenticity', status: reasons.documentAuth.status, detail: reasons.documentAuth.detail },
        { name: 'Face Match', status: reasons.faceMatch.status, detail: reasons.faceMatch.detail },
        { name: 'Liveness Check', status: reasons.livenessCheck.status, detail: reasons.livenessCheck.detail },
        { name: 'Data Consistency', status: reasons.dataConsistency.status, detail: reasons.dataConsistency.detail },
      ],
      riskLevel: data.riskLevel,
      recommendation: 'Reject & Flag for Review',
    };
  }
}

// Legacy result exports
export const SUCCESS_RESULT = getVerificationResult('US', 'success');
export const FAILURE_RESULT = getVerificationResult('US', 'failure');

export function DemoProvider({ children }: { children: ReactNode }) {
  const [selectedCountry, setSelectedCountry] = useState<string>('US');
  const [cases, setCases] = useState<CaseEntry[]>([]);

  // Compute isSuccessDemo based on country
  const isSuccessDemo = isAcceptedCountry(selectedCountry);
  const demoMode = isSuccessDemo ? 'success' : 'failure';

  // Persist to localStorage
  useEffect(() => {
    const storedCountry = localStorage.getItem('selected-country');
    if (storedCountry) {
      setSelectedCountry(storedCountry);
    }
    // Load persisted cases
    try {
      const storedCases = localStorage.getItem('bureau-cases');
      if (storedCases) setCases(JSON.parse(storedCases));
    } catch {}
  }, []);

  const handleSetSelectedCountry = (country: string) => {
    setSelectedCountry(country);
    localStorage.setItem('selected-country', country);
  };

  // No-op for backwards compatibility
  const handleSetDemoMode = () => {
    // Outcome is now determined by country, this function does nothing
  };

  const currentDemoData = getDemoData(selectedCountry, demoMode);

  const addCase = (entry: CaseEntry) => {
    setCases(prev => {
      // Deduplicate by id — never add the same case twice
      if (prev.some(c => c.id === entry.id)) return prev;
      const updated = [entry, ...prev];
      try { localStorage.setItem('bureau-cases', JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  return (
    <DemoContext.Provider value={{ 
      demoMode, 
      setDemoMode: handleSetDemoMode, 
      isSuccessDemo,
      selectedCountry,
      setSelectedCountry: handleSetSelectedCountry,
      currentDemoData,
      cases,
      addCase,
    }}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemoMode() {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error('useDemoMode must be used within a DemoProvider');
  }
  return context;
}

// Hook for pages that optionally use demo context (won't throw if not in provider)
export function useDemoModeOptional() {
  const context = useContext(DemoContext);
  return context ?? { demoMode: 'success' as const, setDemoMode: () => {}, isSuccessDemo: true };
}
