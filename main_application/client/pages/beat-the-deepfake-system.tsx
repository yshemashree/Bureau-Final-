/**
 * Game 2 - Spoof the System.
 *
 * Per the offline event spec this game is deliberately thin: it does not run
 * a detector, take an upload, or score anything on our side. It only opens
 * the client's live game at a URL the host configures from the Admin Panel,
 * and records that the attendee played it (points always 0) so the booth's
 * "games played" tracking and the Fraud Fighter (all-three) bonus still see
 * this game as completed.
 */
import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { v4 as uuidv4 } from 'uuid';
import { usePlayerSession } from '@/lib/store';
import { useSyncState } from '@/hooks/useSyncState';
import { Layout, ScreenBody } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { EyebrowTag } from '@/components/bureau/eyebrow-tag';
import { IconTile } from '@/components/bureau/icon-tile';
import { useSubmitRun, type RunInput } from '@shared/api-client-react';
import { fetchSpoofLiveUrl } from '@/lib/settings';
import { ExternalLink, ShieldAlert, Wifi } from 'lucide-react';

type ScreenState = 'loading' | 'ready' | 'not_configured' | 'opened';

export default function BeatTheDeepfakeSystem() {
  const { session } = usePlayerSession();
  const [, setLocation] = useLocation();
  const submitRun = useSubmitRun();

  const [liveUrl, setLiveUrl] = useState<string | null>(null);
  const [state, setState] = useState<ScreenState>('loading');

  useSyncState({
    type: 'rules_custom',
    game: 'spoof_the_system',
    screenState: state
  });

  useEffect(() => {
    let cancelled = false;
    fetchSpoofLiveUrl().then((url) => {
      if (cancelled) return;
      setLiveUrl(url);
      setState(url ? 'ready' : 'not_configured');
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const recordCompletion = () => {
    if (!session) return;
    const payload: RunInput = {
      playerId: session.player.id,
      game: 'spoof_the_system',
      points: 0,
      source: new URLSearchParams(window.location.search).get('src') === 'qr' ? 'phone' : 'kiosk',
      idempotencyKey: uuidv4(),
      detail: { redirected: true, url: liveUrl },
    };
    submitRun.mutate({ data: payload });
  };

  const openLiveGame = () => {
    if (!liveUrl) return;
    recordCompletion();
    window.open(liveUrl, '_blank', 'noopener,noreferrer');
    setState('opened');
  };

  if (state === 'loading') {
    return (
      <Layout title="Spoof the System" back="/">
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <span className="font-mono text-eyebrow-micro uppercase tracking-[0.03em] text-[var(--text-on-dark-muted)]">
            Loading…
          </span>
        </div>
      </Layout>
    );
  }

  if (state === 'not_configured') {
    return (
      <Layout title="Spoof the System" back="/">
        <ScreenBody>
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 text-center">
            <IconTile icon={ShieldAlert} size={60} />
            <h1 className="mt-6 font-sans text-display-xl font-normal text-white">Not set up yet</h1>
            <p className="mt-3 max-w-[32ch] text-body-lg text-[var(--text-on-dark-muted)]">
              The host hasn't configured the live link for this game. Ask a Bureau team member to set it in the Admin Panel.
            </p>
          </div>
          <div className="mt-auto shrink-0 py-4">
            <Button size="lg" variant="outline" onClick={() => setLocation('/')} className="w-full">
              Back to Arena
            </Button>
          </div>
        </ScreenBody>
      </Layout>
    );
  }

  if (state === 'opened') {
    return (
      <Layout title="Spoof the System" back="/">
        <ScreenBody>
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 text-center">
            <IconTile icon={ExternalLink} size={60} />
            <h1 className="mt-6 font-sans text-display-xl font-normal text-white">Opened in a new tab</h1>
            <p className="mt-3 max-w-[32ch] text-body-lg text-[var(--text-on-dark-muted)]">
              Spoof the System runs on Bureau's live platform. If it didn't open, use the button below.
            </p>
          </div>
          <div className="mt-auto flex shrink-0 flex-col gap-3 py-4">
            <Button size="lg" variant="light" chevron onClick={openLiveGame} className="w-full">
              Open again
            </Button>
            <Button size="lg" variant="outline" onClick={() => setLocation('/')} className="w-full">
              Back to Arena
            </Button>
          </div>
        </ScreenBody>
      </Layout>
    );
  }

  return (
    <Layout title="Spoof the System" back="/">
      <div className="flex min-h-0 flex-1 flex-col pt-4">
        <div className="shrink-0">
          <EyebrowTag>Briefing</EyebrowTag>
          <h1 className="mt-3 font-sans text-display-lg font-normal text-white">Spoof the System</h1>
          <p className="mt-2 text-body-md text-[var(--text-on-dark-muted)]">
            This game runs on Bureau's live platform, outside this app. Tap below to open it — you'll need an internet connection for this one game only.
          </p>
        </div>

        <div className="stagger-in mt-4 min-h-0 flex-1 overflow-y-auto border-t border-ink-800">
          <div className="flex items-start gap-3 border-b border-ink-800 py-3">
            <Wifi className="mt-0.5 size-5 shrink-0 text-violet-500" strokeWidth={1.5} />
            <div className="min-w-0">
              <h2 className="font-mono text-eyebrow-micro font-medium uppercase tracking-[0.03em] text-white">
                Online only
              </h2>
              <p className="mt-1 text-body-sm text-[var(--text-on-dark-muted)]">
                Every other game in the Arena works fully offline. This is the one exception.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 border-b border-ink-800 py-3">
            <ExternalLink className="mt-0.5 size-5 shrink-0 text-violet-500" strokeWidth={1.5} />
            <div className="min-w-0">
              <h2 className="font-mono text-eyebrow-micro font-medium uppercase tracking-[0.03em] text-white">
                Opens in a new tab
              </h2>
              <p className="mt-1 text-body-sm text-[var(--text-on-dark-muted)]">
                Your Arena session stays open here — come back for the other games any time.
              </p>
            </div>
          </div>
        </div>

        <div className="shrink-0 py-4">
          <Button variant="light" size="lg" chevron onClick={openLiveGame} className="w-full">
            Open Spoof the System
          </Button>
        </div>
      </div>
    </Layout>
  );
}
