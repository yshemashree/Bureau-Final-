/**
 * The LED wall display.
 *
 * Per the doc's LED spec: a 3x5 tile wall at 168x168px/tile gives a fixed
 * 504 (wide) x 840 (tall) pixel canvas, portrait orientation. This route
 * renders exactly that canvas and scales it to fit whatever screen actually
 * drives the wall, so the media player pointed at this URL never has to do
 * its own layout math.
 *
 * This is a passive, unattended display — no navigation, no session gate,
 * and critically: no registration data. Its default/idle screen is the same
 * Arena hub (game list) the tablet shows, so both screens read as one
 * continuous surface; it only switches to mirroring live content once a real
 * tablet session goes active.
 */
import { useEffect } from 'react';
import { useSyncStream } from '@/hooks/useSyncStream';
import { SpotTheFraudSpectator } from '@/components/spectator-spot';
import { FraudDetectiveSpectator } from '@/components/spectator-detective';
import { LifelineSpectator } from '@/components/spectator-lifeline';
import { usePlayerSession } from '@/lib/store';
import Home from '@/pages/home';
import { PlayerGate } from '@/components/player-gate';
import { DisplayContext, Layout, ScreenBody } from '@/components/layout';
import { RulesScreen } from '@/components/rules-screen';
import { EyebrowTag } from '@/components/bureau/eyebrow-tag';
import { Button } from '@/components/ui/button';
import { Wifi, ExternalLink, ShieldAlert } from 'lucide-react';
import { IconTile } from '@/components/bureau/icon-tile';
import LeaderboardPage from '@/pages/leaderboard';
import { GameEndScreen } from '@/components/game-end-screen';
const LED_WIDTH = 504;
const LED_HEIGHT = 840;

export default function LedDisplay() {
  const syncState = useSyncStream();
  const { session, saveSession, clearSession } = usePlayerSession();

  // Sync the LED display's session to match the tablet
  useEffect(() => {
    if (syncState.session && syncState.session.player) {
      if (!session || session.player.firstName !== syncState.session.player.firstName) {
        saveSession(syncState.session);
      }
    } else if (syncState.type === 'hub' && !syncState.session) {
      if (session) clearSession();
    }
  }, [syncState, session, saveSession, clearSession]);

  // Everything that isn't one of these explicit branches falls through to the
  // <Home /> default below (hub, registering, idle, or an unrecognised type) -
  // PrimaryNav needs to read all of those as "/" too, or the Arena tab reads
  // as inactive (grey) the whole time a tablet session is mid-registration.
  const isHubFallback = !['active', 'highscore', 'leaderboard_page', 'gate', 'rules', 'rules_custom'].includes(syncState.type);
  const overrideLocation = syncState.type === 'leaderboard_page' ? '/leaderboard' : isHubFallback ? '/' : undefined;

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-black">
      <div
        style={{
          width: LED_WIDTH,
          height: LED_HEIGHT,
          // Pure-CSS scale-to-fit: whichever axis is the tighter constraint wins.
          transform: `scale(min(calc(100vw / ${LED_WIDTH}), calc(100vh / ${LED_HEIGHT})))`,
          transformOrigin: 'center',
        }}
        className="relative shrink-0 overflow-hidden bg-[#00010f]"
      >
        <DisplayContext.Provider value={{ isLed: true, overrideLocation }}>
          {syncState.type === 'active' ? (
            syncState.gameState === 'lifeline' ? (
              <LifelineSpectator state={syncState} />
            ) : syncState.game === 'spot_the_fraud' ? (
              <SpotTheFraudSpectator state={syncState} />
            ) : syncState.game === 'fraud_detective' ? (
              <FraudDetectiveSpectator state={syncState} />
            ) : null
          ) : syncState.type === 'highscore' ? (
            <GameEndScreen
              currentGame={syncState.game}
              points={syncState.finalResult?.pointsRecorded ?? syncState.score}
              standing={syncState.finalResult?.standing}
              isPersonalBest={syncState.finalResult?.isPersonalBest}
              highScore
            />
          ) : syncState.type === 'leaderboard_page' ? (
            <LeaderboardPage syncedScope={syncState.scope} syncedTab={syncState.activeTab} />
          ) : syncState.type === 'gate' ? (
            <PlayerGate 
              firstName={syncState.session?.player?.firstName || ''} 
              company={syncState.session?.player?.company || ''} 
              gameName={syncState.gameName || ''} 
              onContinue={() => {}} 
              onNewPlayer={() => {}} 
            />
          ) : syncState.type === 'rules' && syncState.rulesProps ? (
            <Layout title={syncState.rulesProps.gameName} back="/">
              <RulesScreen {...syncState.rulesProps} onStart={() => {}} />
            </Layout>
          ) : syncState.type === 'rules_custom' && syncState.game === 'spoof_the_system' ? (
            syncState.screenState === 'not_configured' ? (
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
                    <Button size="lg" variant="outline" className="w-full pointer-events-none">
                      Back to Arena
                    </Button>
                  </div>
                </ScreenBody>
              </Layout>
            ) : syncState.screenState === 'opened' ? (
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
                    <Button size="lg" variant="light" chevron className="w-full pointer-events-none">
                      Open again
                    </Button>
                    <Button size="lg" variant="outline" className="w-full pointer-events-none">
                      Back to Arena
                    </Button>
                  </div>
                </ScreenBody>
              </Layout>
            ) : (
              <Layout title="Spoof the System" back="/">
                  <div className="flex min-h-0 flex-1 flex-col pt-4 pb-6">
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

                    <div className="shrink-0 pt-4">
                      <Button variant="light" size="lg" chevron className="w-full pointer-events-none">
                        Open Spoof the System
                      </Button>
                    </div>
                  </div>
                </Layout>
            )
          ) : (
            // Default/idle: the same Arena hub the tablet shows (registering,
            // an unrecognised sync type, or no tablet connected yet all land
            // here) — never a bespoke attract loop or leaderboard rotation.
            <Home />
          )}
        </DisplayContext.Provider>
      </div>
    </div>
  );
}

