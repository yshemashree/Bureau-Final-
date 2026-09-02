import { cn } from "@/lib/utils";
import { EyebrowTag } from "./bureau/eyebrow-tag";
import { ScanEye, Target, Fingerprint, CheckCircle2 } from "lucide-react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { SignalField, ScanFrame } from "./bureau";
import { Layout } from "./layout";
import { StatReadout } from "./bureau/stat-readout";
import { Button } from "./ui/button";

const EXPLAIN_FAIL_SECONDS = 10;
const RECOVERY_AUTO_CONTINUE_SECONDS = 5;

export function SpotTheFraudSpectator({ state }: { state: any }) {
  const { gameState, currentLevel, currentQuestion, shuffledOptions, imageOptions, selectedIndices, timeLeft, score, explainResult, pointsEarned, explainFailSec, correctExplainSec, failureCanAdvance, showEndGameDialog } = state;

  if (!currentQuestion) return null;

  if (gameState === 'explain') {
    const isCorrect = explainResult === 'correct';
    const isNearMiss = explainResult === 'nearMiss';
    const isWrong = explainResult === 'wrong' || explainResult === 'timeout';
    const isSkipped = explainResult === 'skipped';

    return (
      <Layout title="Spot the Fraud" back="/">
        <div className="flex min-h-0 flex-1 flex-col pt-4 pb-4 px-4 bg-black">
          <div className="shrink-0">
            <div className="flex">
              <span className={cn(
                "font-mono text-eyebrow-micro font-medium uppercase tracking-[0.03em]",
                isCorrect ? "text-lime-300" : isNearMiss ? "text-coral-400" : isSkipped ? "text-[var(--text-on-dark-muted)]" : "text-coral-600"
              )}>
                [{isCorrect ? 'Clear' : isNearMiss ? 'Near Miss' : isSkipped ? 'Skipped' : explainResult === 'timeout' ? 'Timeout' : 'Failed'}]
              </span>
            </div>
            
            <h1 className="mt-2 font-sans text-display-lg font-normal text-white">
              {isCorrect ? 'Correct.' : isNearMiss ? 'Partial Match.' : isSkipped ? 'Passed.' : explainResult === 'timeout' ? 'Time Expired.' : 'Incorrect.'}
            </h1>
          </div>
          
          <div className="mt-4 flex min-h-0 flex-1 flex-col">
            {(isCorrect || isNearMiss) && (
              <div className="mb-4 shrink-0">
                <StatReadout 
                  value={`+${pointsEarned}`} 
                  caption="Points Awarded" 
                  tone="on-dark" 
                  size="sm" 
                />
              </div>
            )}

            <div className="flex-1 min-h-0 app-scroll">
              <div className="flex flex-col gap-2 border-t border-ink-800 pt-4">
                <span className="font-mono text-eyebrow-micro font-medium uppercase tracking-[0.03em] text-white">
                  Mechanism
                </span>
                <p className="text-body-sm text-[var(--text-on-dark-muted)]">
                  {currentQuestion.why}
                </p>
              </div>
              
              <div className="mt-4 border-l border-violet-700 pl-3 py-1">
                <p className="font-mono text-eyebrow-micro uppercase tracking-[0.03em] text-[var(--text-on-dark-muted)]">
                  {currentQuestion.hook}
                </p>
              </div>
            </div>
          </div>

          <div className="shrink-0 pt-4">
            {(isWrong || isNearMiss) ? (
              <>
                {score > 0 && (
                  <div className="mb-4">
                    <StatReadout value={score} caption="Points Banked" tone="on-dark" size="sm" />
                  </div>
                )}
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-eyebrow-micro uppercase tracking-[0.03em] text-[var(--text-on-dark-muted)]">
                      {failureCanAdvance ? 'Auto-continue' : 'Auto-exit'}
                  </span>
                  <span className={cn(
                    "font-mono text-eyebrow-micro tabular-nums",
                    explainFailSec <= 3 ? "text-coral-600 animate-pulse" : "text-[var(--text-on-dark-muted)]"
                  )}>
                    {explainFailSec}s
                  </span>
                </div>
                <div className="h-0.5 w-full bg-ink-800 mb-4">
                  <div
                    className="h-full bg-coral-600 transition-[width] duration-1000 ease-linear"
                    style={{
                      width: `${Math.min(
                        100,
                        (explainFailSec /
                          (failureCanAdvance
                            ? RECOVERY_AUTO_CONTINUE_SECONDS
                            : EXPLAIN_FAIL_SECONDS)) *
                          100,
                      )}%`,
                    }}
                  />
                </div>

                {failureCanAdvance ? (
                  <>
                    <p className="mb-3 font-mono text-eyebrow-micro uppercase tracking-[0.03em] text-violet-400">
                      Skip Used
                    </p>
                    <Button variant="light" size="lg" chevron disabled className="w-full pointer-events-none">
                      Continue
                    </Button>
                  </>
                ) : (
                  <div className="py-2 border border-ink-800 rounded bg-ink-900 text-center text-body-sm text-[var(--text-on-dark-muted)]">
                    Use Kiosk or Phone to proceed
                  </div>
                )}
              </>
            ) : (
              <>
                {isCorrect && (
                  <div className="mb-2.5">
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="font-mono text-eyebrow-micro uppercase tracking-[0.03em] text-[var(--text-on-dark-muted)]">
                        Auto-continue
                      </span>
                      <span className="font-mono text-eyebrow-micro tabular-nums text-[var(--text-on-dark-muted)]">
                        {correctExplainSec}s
                      </span>
                    </div>
                    <div className="h-0.5 w-full bg-ink-800">
                      <div
                        className="correct-countdown-drain h-full w-full bg-violet-500"
                      />
                    </div>
                  </div>
                )}
                <Button variant="light" size="lg" chevron disabled className="w-full pointer-events-none">
                  Continue
                </Button>
              </>
            )}
          </div>
        </div>
      </Layout>
    );
  }

  const isImageQuestion = currentQuestion.kind === "image";
  // Read off the live question, not the level's own (occasionally stale)
  // metadata label - some "select 2" levels' actual question banks need 3,
  // exactly as on the player's own screen.
  const imageQuestionInstruction = currentQuestion.selectN === 1 ? 'Only One Correct' : `Select ${currentQuestion.selectN}`;
  const textLevelLabel =
    currentQuestion.selectN > 1 && currentLevel?.label
      ? currentLevel.label.replace(/select \d+/i, `select ${currentQuestion.selectN}`)
      : currentLevel?.label;

  return (
    <div className="flex h-full w-full flex-col p-6 bg-black">
      <div className="shrink-0 flex flex-col gap-2 border-b border-ink-800 pb-3">
        <div className="flex items-center justify-between">
          <EyebrowTag>
            {currentLevel?.kind === 'image'
              ? `Find the AI generated image · ${imageQuestionInstruction}`
              : textLevelLabel}
          </EyebrowTag>
          <span className="font-mono text-eyebrow-micro tabular-nums text-white uppercase tracking-[0.03em]">
            Score <span className="text-violet-500">{score}</span>
          </span>
        </div>
      </div>

      <div className="shrink-0 h-1 w-full bg-ink-800 mt-3 mb-6">
        <div
          className={cn(
            "h-full transition-[width] duration-1000 ease-linear",
            timeLeft <= 5 ? "bg-coral-600" : "bg-cyan-500"
          )}
          style={{ width: `${currentLevel ? (timeLeft / currentLevel.timerSec) * 100 : 0}%` }}
        />
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <h2 className="shrink-0 pt-2 pb-4 font-sans text-display-sm font-medium leading-snug text-white">
          {isImageQuestion ? 'Find the AI generated image.' : currentQuestion.stem}
        </h2>
        
        {isImageQuestion ? (
          <p className="mb-4 shrink-0 font-mono text-eyebrow-micro font-medium uppercase tracking-[0.03em] text-violet-500">
            {imageQuestionInstruction}
          </p>
        ) : currentQuestion.selectN > 1 && (
          <p className="mb-4 shrink-0 font-mono text-eyebrow-micro font-medium uppercase tracking-[0.03em] text-violet-500">
            Select {currentQuestion.selectN}
          </p>
        )}

        <div className={cn(
          "min-h-0 flex-1 gap-4 overflow-y-auto app-scroll",
          // Not every image level has exactly 4 options (level 7 has 6,
          // level 9 has 8), so this wraps and scrolls instead of a fixed
          // 2x2 grid that clips or overlaps the extra tiles.
          isImageQuestion ? "grid grid-cols-2" : "flex flex-col"
        )}>
          {shuffledOptions?.map((opt: any, i: number) => {
            const isSelected = selectedIndices?.includes(opt.originalIndex);
            const quizImage = isImageQuestion ? imageOptions[opt.originalIndex - 1] : null;

            return (
              <div
                key={i}
                className={cn(
                  "relative shrink-0 overflow-hidden border transition-colors duration-[var(--dur-base)] flex",
                  isImageQuestion ? "aspect-square w-full" : "items-center gap-4 px-6 py-4",
                  isSelected
                    ? "border-violet-700 bg-[rgba(71,21,255,0.08)]"
                    : "border-ink-800 bg-ink-900"
                )}
              >
                {isImageQuestion && quizImage && (
                  <>
                    <img
                      src={quizImage.src}
                      className={cn(
                        "absolute inset-0 size-full bg-ink-950 object-contain px-4 pt-4 pb-12 transition-opacity",
                        isSelected && "opacity-60"
                      )}
                    />
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-[rgba(0,2,36,0.82)] px-4 py-2">
                      <span className="font-mono text-eyebrow-micro font-medium tabular-nums text-white">
                        {quizImage.label}
                      </span>
                      <ScanEye className={cn("size-6", isSelected ? "text-violet-500" : "text-white/70")} />
                    </div>
                  </>
                )}
                {!isImageQuestion && (
                  <>
                    <span className={cn(
                      "shrink-0 font-mono text-body-md font-medium tabular-nums",
                      isSelected ? "text-violet-500" : "text-[var(--text-on-dark-muted)]"
                    )}>
                      {String(opt.originalIndex).padStart(2, '0')}
                    </span>
                    <span className="min-w-0 flex-1 font-sans text-body-lg leading-snug text-white">
                      {opt.text}
                    </span>
                  </>
                )}
                <div className={cn("shrink-0", isImageQuestion && "absolute right-3 top-3")}>
                  {isSelected
                    ? <div className="size-4 bg-violet-500" />
                    : <div className={cn("size-4 border", isImageQuestion ? "border-white/80 bg-[rgba(0,2,36,0.5)]" : "border-ink-700")} />
                  }
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {showEndGameDialog && (
         <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
           <div className="bg-ink-900 border border-ink-800 text-white w-[85vw] max-w-[320px] rounded-lg p-5">
             <h2 className="font-sans text-[20px] text-white">End Game Early?</h2>
             <p className="text-[14px] leading-snug text-[var(--text-on-dark-muted)] mt-2">
               Are you sure you want to exit? Your score will be submitted.
             </p>
             <div className="flex items-center justify-end gap-2 mt-4">
               <div className="px-4 py-2 font-mono uppercase text-eyebrow-micro tracking-[0.03em] border border-ink-800 text-[var(--text-on-dark-muted)] rounded">
                 Cancel
               </div>
               <div className="px-4 py-2 rounded font-mono uppercase text-eyebrow-micro tracking-[0.03em] bg-violet-700 text-white">
                 Submit & End
               </div>
             </div>
           </div>
         </div>
      )}
    </div>
  );
}
