import { useLocation } from 'wouter';
import { ShieldAlert } from 'lucide-react';
import { IconTile } from '@/components/bureau/icon-tile';
import { Layout, ScreenBody } from '@/components/layout';
import { useSyncState } from '@/hooks/useSyncState';

export default function Landing() {
  const [, setLocation] = useLocation();
  useSyncState({ type: 'landing' });

  return (
    <Layout showHeader={false}>
      <ScreenBody className="cursor-pointer select-none items-center justify-center pb-[10vh]" onClick={() => setLocation('/join')}>
        <IconTile icon={ShieldAlert} size={80} />
        <h1 className="mt-8 font-sans text-display-xl font-normal text-white">
          Bureau Fraud Arena
        </h1>
        <p className="mt-6 font-mono text-body-sm uppercase tracking-[0.05em] text-[var(--text-on-dark-muted)] animate-pulse">
          Tap to enter
        </p>
      </ScreenBody>
    </Layout>
  );
}
