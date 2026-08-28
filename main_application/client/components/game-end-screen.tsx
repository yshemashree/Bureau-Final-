/**
 * Shared end-of-game screen.
 *
 * Shown after any game completes. Presents the player's score and rank, then
 * offers a path back to the hub.
 */
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout';
import { EyebrowTag } from '@/components/bureau/eyebrow-tag';
import { StatReadout } from '@/components/bureau/stat-readout';
import { usePlayerSession } from '@/lib/store';
import { cn } from '@/lib/utils';

export type GameKey = 'spot_the_fraud' | 'beat_the_deepfake_system' | 'fraud_detective';

interface Props {
  /** The game that just finished. */
  currentGame: GameKey;
  /** Points scored in this run. */
  points: number;
  /** Server-returned standing (rank, total). May be null if offline. */
  standing?: { rank: number | null; total: number; playedAllThree?: boolean } | null;
  /** Whether this run is a personal best. */
  isPersonalBest?: boolean;
  /** A flawless run ends in a final celebration instead of a replay prompt. */
  highScore?: boolean;
  /** Callback to replay the current game for standard completion screens. */
  onPlayAgain?: () => void;
}

const GAME_LABELS: Record<GameKey, string> = {
  spot_the_fraud: 'Spot the Fraud',
  beat_the_deepfake_system: 'Spoof the System',
  fraud_detective: 'Fraud Detective',
};

export function GameEndScreen({
  currentGame,
  points,
  standing,
  isPersonalBest,
  highScore = false,
  onPlayAgain,
}: Props) {
  const [, setLocation] = useLocation();

  const handleReturnToHub = () => {
    setLocation('/');
  };

  const allPlayed = standing?.playedAllThree ?? false;

  return (
    <Layout title={GAME_LABELS[currentGame] ?? 'Game'}>
      {/* Result summary — white panel with corner-cluster dots for contrast relief. */}
      <div className="relative -mx-4 shrink-0 overflow-hidden bg-white px-4 pb-6 pt-6 text-center">
        <div aria-hidden className="bureau-dots-edge pointer-events-none absolute inset-0" />
        <EyebrowTag tone="dark">{highScore ? 'High Score Achieved' : 'Run Complete'}</EyebrowTag>

        <div className="mt-6 flex justify-center gap-8">
          <StatReadout value={points.toString()} caption="Points" tone="on-light" size="md" />
          {standing?.rank != null && (
            <StatReadout
              value={`#${standing.rank}`}
              caption={isPersonalBest ? 'Rank · PB' : 'Rank'}
              tone="on-light"
              size="md"
            />
          )}
        </div>

        {allPlayed && !highScore && (
          <div className="mt-4 border border-violet-700/30 bg-violet-700/8 px-4 py-2">
            <span className="font-mono text-eyebrow-micro uppercase tracking-[0.03em] text-violet-700">
              All three games complete
            </span>
          </div>
        )}
      </div>

      {/* Actions — pushed to the bottom of the flex column */}
      <div className="mt-auto flex shrink-0 flex-col gap-3 pt-5 pb-4">
        {!highScore && onPlayAgain && (
          <Button variant="light" size="lg" chevron onClick={onPlayAgain} className="w-full">
            Play again
          </Button>
        )}
        <Button variant="outline" size="lg" onClick={handleReturnToHub} className="w-full">
          Return to Hub
        </Button>
      </div>
    </Layout>
  );
}
