import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import {
  useGetLeaderboard,
  LeaderboardScope,
  GameKey,
  getGetLeaderboardQueryKey,
} from '@shared/api-client-react';
import { Layout } from '@/components/layout';
import { usePlayerSession } from '@/lib/store';
import { cn } from '@/lib/utils';
import { PrimaryNav } from '@/components/bureau/primary-nav';
import { ArenaHeader } from '@/components/bureau/arena-header';
import { useSyncState } from '@/hooks/useSyncState';

type Tab = 'combined' | GameKey;

/* Spoof the System has no meaningful score of its own (it only redirects to
 * the client's live link), so the board sticks to the two games that are
 * actually scored: All games, Spot the Fraud, Fraud Detective. */
const TABS: { key: Tab; label: string }[] = [
  { key: 'combined', label: 'All' },
  { key: 'spot_the_fraud', label: 'Spot' },
  { key: 'fraud_detective', label: 'Detect' },
];

/**
 * The standings.
 *
 * The board must fit the column exactly, so the rows share the leftover height
 * between them rather than stacking to a fixed size. Ten rows plus a pinned
 * self-row is the most the API returns, which lands comfortably above the 44px
 * floor on the shortest handset we target.
 */
export default function LeaderboardPage({
  syncedScope,
  syncedTab,
}: {
  syncedScope?: LeaderboardScope;
  syncedTab?: Tab;
} = {}) {
  const { session } = usePlayerSession();
  const [, setLocation] = useLocation();
  const [scope, setScope] = useState<LeaderboardScope>('today');
  const [activeTab, setActiveTab] = useState<Tab>('combined');
  const [mounted, setMounted] = useState(false);

  const currentScope = syncedScope ?? scope;
  const currentTab = syncedTab ?? activeTab;

  useSyncState({
    type: 'leaderboard_page',
    scope: currentScope,
    activeTab: currentTab,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !session) {
      setLocation('/join', { replace: true });
    }
  }, [mounted, session, setLocation]);

  const leaderboardParams = {
    scope: currentScope,
    game: currentTab === 'combined' ? undefined : currentTab,
    limit: 10,
    playerId: session?.player.id,
  };

  const { data: leaderboard } = useGetLeaderboard(leaderboardParams, {
    query: {
      refetchInterval: 10000,
      queryKey: getGetLeaderboardQueryKey(leaderboardParams),
      enabled: mounted && !!session,
    },
  });

  // Don't render the leaderboard if we're not logged in
  if (!mounted || !session) return null;

  const rows = leaderboard?.rows ?? [];
  const showPinned =
    leaderboard?.pinned && !rows.find((r) => r.playerId === leaderboard.pinned?.playerId);

  return (
    <Layout showHeader={false}>
      <ArenaHeader />
      <PrimaryNav className="mt-4" />

      {/* Scope: a square segmented control, hairlines, no pills. */}
      <div className="mt-3 flex shrink-0 border border-ink-800">
        {(['today', 'cumulative'] as LeaderboardScope[]).map((s) => (
          <button
            key={s}
            onClick={() => setScope(s)}
            className={cn(
              'tap flex-1 py-2.5 font-mono text-eyebrow-micro font-medium uppercase tracking-[0.03em]',
              currentScope === s ? 'bg-violet-700 text-white' : 'text-[var(--text-on-dark-muted)]',
            )}
          >
            {s === 'today' ? 'Today' : 'All days'}
          </button>
        ))}
      </div>

      {/* Game filter: underline tabs, the technical register. */}
      <div className="flex shrink-0 border-b border-ink-800">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={cn(
              'tap flex-1 border-b-2 py-3 font-mono text-eyebrow-micro font-medium uppercase tracking-[0.03em]',
              currentTab === t.key
                ? 'border-violet-700 text-white'
                : 'border-transparent text-[var(--text-on-dark-muted)]',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Board fills all remaining height; rows share it equally via flex-1. */}
      <div className="stagger-in mt-3 flex min-h-0 flex-1 flex-col overflow-hidden">
        {rows.map((row) => (
          <LeaderboardRow
            key={row.playerId}
            row={row}
            isCurrentUser={row.playerId === session?.player.id}
            activeTab={currentTab}
          />
        ))}

        {rows.length === 0 && (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-white">
            <p className="font-mono text-eyebrow-micro uppercase tracking-[0.03em] text-[var(--text-faint)]">
              No scores recorded
            </p>
            <p className="text-body-md text-[var(--text-muted)]">Be the first on the board.</p>
          </div>
        )}

        {showPinned && leaderboard?.pinned && (
          <LeaderboardRow row={leaderboard.pinned} isCurrentUser activeTab={currentTab} />
        )}
      </div>

      <div className="shrink-0 py-2">
        <span className="font-mono text-eyebrow-micro uppercase tracking-[0.03em] text-[var(--text-on-dark-faint)]">
          {currentScope === 'today' ? 'Today at the booth' : 'All days'}
        </span>
      </div>
    </Layout>
  );
}

function LeaderboardRow({ row, isCurrentUser, activeTab }: { row: any; isCurrentUser: boolean, activeTab?: Tab }) {
  const displayScore = activeTab === 'spot_the_fraud' ? row.spotTheFraud 
                     : activeTab === 'spoof_the_system' ? row.spoofTheSystem 
                     : activeTab === 'fraud_detective' ? row.fraudDetective
                     : row.total;

  return (
    <div
      className={cn(
        // Rows share the leftover height so a full board fills the screen,
        // but they stop growing once they are comfortable — otherwise the
        // first player of the day is one row stretched down the whole screen.
        'flex min-h-[44px] max-h-[86px] min-w-0 flex-1 items-center gap-3 border-b border-ice-300 bg-white px-3 text-russian',
        isCurrentUser && 'bg-ice-100',
      )}
    >
      <span
        className={cn(
          'inline-flex size-7 shrink-0 items-center justify-center font-mono text-body-sm font-medium tabular-nums',
          row.rank === 1 ? 'bg-violet-700 text-white' : 'text-[var(--text-muted)]',
        )}
      >
        {row.rank}
      </span>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate font-sans text-body-md font-medium text-russian">
            {row.displayName}
          </span>
          {isCurrentUser && (
            <span className="shrink-0 bg-violet-700 px-1.5 py-0.5 font-mono text-eyebrow-micro font-medium uppercase tracking-[0.03em] text-white">
              You
            </span>
          )}
        </div>
        <span className="truncate font-mono text-eyebrow-micro uppercase tracking-[0.03em] text-[var(--text-muted)]">
          {row.company}
        </span>
      </div>

      <span
        className={cn(
          'shrink-0 font-sans text-card-title font-medium tabular-nums',
          row.rank <= 3 ? 'text-violet-700' : 'text-russian',
        )}
      >
        {displayScore}
      </span>
    </div>
  );
}
