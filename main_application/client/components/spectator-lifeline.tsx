import { Layout } from '@/components/layout';
import { EyebrowTag } from '@/components/bureau/eyebrow-tag';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { LifelineQuestion } from '@/data/lifeline';

export function LifelineSpectator({ state }: { state: any }) {
  const { lifelineQuestion, lifelineContext, game, lifelineState } = state;
  const question = lifelineQuestion as LifelineQuestion;
  
  if (!question) return null;

  const gameTitle = game === 'spot_the_fraud' ? 'Spot the Fraud' : 'Fraud Detective';

  const shuffled = lifelineState?.shuffled || question.options.map((text, i) => ({ text, origIdx: i }));
  const correctShuffledIdx = lifelineState?.correctShuffledIdx ?? -1;
  const selectedIdx = lifelineState?.selectedIdx ?? null;
  const retryUnlocked = lifelineState?.retryUnlocked ?? false;
  const timeLeft = lifelineState?.timeLeft ?? 10;
  
  const isCorrect = selectedIdx !== null && selectedIdx === correctShuffledIdx;
  const isWrong   = selectedIdx !== null && selectedIdx !== correctShuffledIdx;

  return (
    <div className="flex h-full w-full flex-col bg-black">
      <Layout title={gameTitle}>
        <div className="flex min-h-0 flex-1 flex-col pb-4">
          <div className="shrink-0 pt-4">
            <EyebrowTag tone="coral">Lifeline</EyebrowTag>
            <div className="mt-3">
              <h1 className="font-sans font-normal text-white text-display-lg">
                {lifelineContext === 'reentry' ? 'Attempt Over.' : 'Run Over.'}
              </h1>
            </div>
            <p className="mt-2 text-body-sm text-[var(--text-on-dark-muted)]">
              {lifelineContext === 'reentry'
                ? 'You have already played this game. Answer the lifeline question to unlock a retry.'
                : 'Answer the lifeline question to unlock a retry.'}
            </p>
          </div>

          <div className="mt-4 shrink-0 border border-amber-500/40 bg-[rgba(245,158,11,0.04)]">
            <div className="flex items-center justify-between gap-3 border-b border-amber-500/20 px-4 py-2.5">
              <span className="font-mono font-medium uppercase tracking-[0.03em] text-amber-500 text-eyebrow-micro">
                {question.type === 'logo' ? 'Find the Logo' : 'Lifeline Question'}
              </span>
              <span className={cn(
                "font-mono font-medium tabular-nums transition-colors duration-300 text-eyebrow-micro",
                isCorrect ? "text-lime-400"
                  : isWrong ? "text-coral-600"
                  : timeLeft <= 3 ? "text-coral-600 animate-pulse"
                  : "text-[var(--text-on-dark-muted)]"
              )}>
                {isCorrect ? '✓ Retry unlocked' : isWrong ? 'Incorrect' : `${timeLeft}s`}
              </span>
            </div>

            <div className="h-0.5 w-full bg-ink-800">
              <div
                className={cn(
                  "h-full",
                  !retryUnlocked && timeLeft < 10 && "transition-[width] duration-1000 ease-linear",
                  isCorrect ? "bg-lime-400" : timeLeft <= 3 ? "bg-coral-600" : "bg-amber-500"
                )}
                style={{ width: retryUnlocked ? '100%' : `${(timeLeft / 10) * 100}%` }}
              />
            </div>

            <div className="px-4 pb-3 pt-4">
              <p className="font-sans leading-snug text-white text-body-md">
                {question.stem}
              </p>
            </div>

            <div className="flex flex-col stagger-in gap-2 px-4 pb-4">
              {shuffled.map((opt: any, idx: number) => {
                const isThisCorrect = idx === correctShuffledIdx;
                const isWrongPick   = selectedIdx === idx && !isThisCorrect;

                return (
                  <div
                    key={idx}
                    className={cn(
                      "flex w-full items-center border text-left transition-colors duration-[var(--dur-base)] gap-3 px-4 py-3",
                      retryUnlocked && isThisCorrect && "border-lime-400/60 bg-lime-400/8",
                      retryUnlocked && !isThisCorrect && "border-ink-800 bg-ink-900 opacity-30",
                      !retryUnlocked && isWrongPick && "border-coral-600/60 bg-coral-600/8",
                      !retryUnlocked && !isWrongPick && "border-ink-700 bg-ink-900",
                    )}
                  >
                    <span className={cn(
                      "shrink-0 font-mono font-medium tabular-nums text-eyebrow-micro",
                      retryUnlocked && isThisCorrect ? "text-lime-400" : "text-amber-500",
                    )}>
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span className={cn(
                      "min-w-0 flex-1 font-sans leading-snug text-body-md",
                      retryUnlocked && isThisCorrect ? "text-lime-300" : "text-white",
                    )}>
                      {opt.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="mt-auto flex shrink-0 flex-col gap-3 pt-5 px-4">
            <Button
              size="lg"
              variant="light"
              chevron
              disabled={!retryUnlocked}
              className="w-full pointer-events-none"
            >
              Retry
            </Button>
            <Button size="lg" variant="outline" className="w-full pointer-events-none">
              Exit Run
            </Button>
          </div>
        </div>
      </Layout>
    </div>
  );
}
