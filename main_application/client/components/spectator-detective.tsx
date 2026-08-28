import { cn } from "@/lib/utils";
import { EyebrowTag } from "./bureau/eyebrow-tag";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { SignalField, ScanFrame } from "./bureau";
import { Layout, ScreenBody } from "./layout";
import { Button } from "./ui/button";
import { Maximize, CheckCircle2 } from "lucide-react";

export function FraudDetectiveSpectator({ state }: { state: any }) {
  const { currentCase, caseScore, bonusScore, caseTimeLeft, graphNodes, graphEdges, selectedNode, solved, revealed, gameState, caseFailCanAdvance, caseFailSec, caseClosedSec, showClues, showEndGameDialog, caseFailTab } = state;
  const isFinished = solved || revealed;

  if (!currentCase || !graphNodes || !graphEdges) return null;

  // Replicate graph scaling logic from the main component
  const graphData = (() => {
    if (!graphNodes.length) return { viewBox: '-200 -200 400 400', width: 400, height: 400 };
    const PAD_X = 90;
    const PAD_TOP = 50;
    const PAD_BOTTOM = 75;
    const MIN_SPAN = 280;
    const xs = graphNodes.map((n: any) => n.x);
    const ys = graphNodes.map((n: any) => n.y);
    let minX = Math.min(...xs) - PAD_X;
    let maxX = Math.max(...xs) + PAD_X;
    let minY = Math.min(...ys) - PAD_TOP;
    let maxY = Math.max(...ys) + PAD_BOTTOM;
    if (maxX - minX < MIN_SPAN) {
      const mid = (minX + maxX) / 2;
      minX = mid - MIN_SPAN / 2;
      maxX = mid + MIN_SPAN / 2;
    }
    if (maxY - minY < MIN_SPAN) {
      const mid = (minY + maxY) / 2;
      minY = mid - MIN_SPAN / 2;
      maxY = mid + MIN_SPAN / 2;
    }
    return { viewBox: `${minX} ${minY} ${maxX - minX} ${maxY - minY}`, width: maxX - minX, height: maxY - minY };
  })();

  const gameTitle = currentCase ? currentCase.sector : 'Fraud Detective';

  return (
    <div className="flex h-full w-full flex-col bg-black">
      <div className="shrink-0 flex flex-col gap-2 border-b border-ink-800 p-6 pb-3">
        <div className="flex items-center justify-between">
          <EyebrowTag>{currentCase.sector}</EyebrowTag>
          <span className="font-mono text-eyebrow-micro tabular-nums text-white uppercase tracking-[0.03em]">
            Score <span className="text-violet-500">{caseScore + bonusScore}</span>
          </span>
        </div>
      </div>
      
      <div className="shrink-0 h-1 w-full bg-ink-800">
        <div
          className={cn(
            "h-full transition-[width] duration-1000 ease-linear",
            caseTimeLeft <= 10 ? "bg-coral-600" : "bg-cyan-500"
          )}
          style={{ width: `${(caseTimeLeft / 45) * 100}%` }}
        />
      </div>

      <div className="flex-1 min-h-0 bg-russian relative flex flex-col">
          {gameState === 'casefail' && (
            <div className="shrink-0 bg-black px-6 pt-6 pb-0">
              <div className="flex items-center justify-between gap-3">
                <EyebrowTag tone={caseFailCanAdvance ? 'violet' : 'coral'}>
                  {caseFailCanAdvance ? 'Skip Used' : 'Case Failed'}
                </EyebrowTag>
                <div className="relative flex items-baseline gap-1.5 pr-3">
                  <span className="font-sans text-display-md font-normal tabular-nums text-white">
                    {caseScore + bonusScore}
                  </span>
                  <span className="font-mono text-[11px] font-medium uppercase tracking-[0.03em] text-[var(--text-on-dark-muted)]">
                    Points Banked
                  </span>
                  <span aria-hidden className="absolute right-0 top-0 size-2 bg-violet-700" />
                </div>
              </div>
              <div className="-mx-6 mt-6 shrink-0 flex border-b border-ink-800">
                {(['graph', 'why'] as const).map((tab) => (
                  <div
                    key={tab}
                    className={cn(
                      "flex-1 py-3 text-center font-mono text-[14px] uppercase tracking-[0.1em] transition-colors",
                      caseFailTab === tab
                        ? "text-coral-500 border-b-2 border-coral-500 -mb-px"
                        : "text-[var(--text-on-dark-muted)]"
                    )}
                  >
                    {tab === 'graph' ? 'Answer' : 'Why?'}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex-1 min-h-0 relative overflow-hidden">
            {gameState === 'casefail' && caseFailTab === 'why' ? (
              <div className="absolute inset-0 bg-black overflow-y-auto px-6 py-6">
                <div className="border-l-2 border-coral-600/50 pl-4">
                  <p className="font-mono text-body-md text-[var(--text-on-dark-muted)] leading-snug">
                    {currentCase.explanation}
                  </p>
                </div>
              </div>
            ) : (
              <>
                <SignalField texture="dots" tone="russian" fade={false} />
                <TransformWrapper 
                  initialScale={0.9}
                  minScale={0.3}
                  maxScale={4}
                  centerOnInit
                  limitToBounds
                  minPositionX={-160}
                  maxPositionX={160}
                  minPositionY={-180}
                  maxPositionY={180}
                  panning={{ disabled: true }}
                  wheel={{ disabled: true }}
                  pinch={{ disabled: true }}
                  doubleClick={{ disabled: true }}
                >
                  {() => (
                    <TransformComponent
                      wrapperClass="w-full h-full"
                      contentClass="flex h-full w-full items-center justify-center"
                      contentStyle={{ width: '100%', height: '100%' }}
                    >
                      <svg className="block h-full w-full" viewBox={graphData.viewBox} preserveAspectRatio="xMidYMid meet">
                        <defs>
                          <marker id="arrow-normal" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                            <path d="M0,0 L0,6 L6,3 z" fill="rgba(139,92,246,0.7)" />
                          </marker>
                          <marker id="arrow-answer" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                            <path d="M0,0 L0,6 L6,3 z" fill="var(--coral-600)" />
                          </marker>
                        </defs>

                        {graphEdges.map((e: any, i: number) => {
                          const isAnswerEdge = isFinished && (currentCase.answer.includes(e.source.id) || currentCase.answer.includes(e.target.id));
                          const dx = e.target.x - e.source.x;
                          const dy = e.target.y - e.source.y;
                          const dist = Math.sqrt(dx * dx + dy * dy);
                          const pad = 30;
                          const safe = dist > pad * 2;
                          const x1a = safe ? e.source.x + (dx / dist) * pad : e.source.x;
                          const y1a = safe ? e.source.y + (dy / dist) * pad : e.source.y;
                          const x2a = safe ? e.target.x - (dx / dist) * pad : e.target.x;
                          const y2a = safe ? e.target.y - (dy / dist) * pad : e.target.y;
                          return (
                            <g key={i}>
                              <line
                                x1={x1a} y1={y1a}
                                x2={x2a} y2={y2a}
                                stroke={isAnswerEdge ? 'var(--coral-600)' : 'rgba(139,92,246,0.45)'}
                                strokeWidth={isAnswerEdge ? 2 : 1.5}
                                opacity={isFinished && !isAnswerEdge ? 0.15 : 1}
                                strokeDasharray={isAnswerEdge ? "none" : "4 4"}
                                markerEnd={isAnswerEdge ? 'url(#arrow-answer)' : 'url(#arrow-normal)'}
                              />
                            </g>
                          );
                        })}

                        {graphNodes.map((n: any) => {
                          const isSelected = selectedNode === n.id;
                          const isAnswerNode = isFinished && currentCase.answer.includes(n.id);
                          return (
                            <g 
                              key={n.id} 
                              transform={`translate(${n.x},${n.y})`}
                              className={cn(
                                "transition-opacity duration-[var(--dur-base)] ease-[var(--ease-standard)]",
                                isFinished && !isAnswerNode ? "opacity-30" : "opacity-100"
                              )}
                            >
                              <foreignObject x={-60} y={-60} width={120} height={120} className="overflow-visible">
                                <div className="flex h-full w-full flex-col items-center justify-center">
                                  {isSelected || isAnswerNode ? (
                                    <ScanFrame id={n.id.substring(0, 4)} tone={isAnswerNode ? 'coral' : 'violet'}>
                                      <div className={cn(
                                        "flex size-12 items-center justify-center border",
                                        isAnswerNode ? "border-coral-600 bg-coral-600 text-russian" : "border-violet-500 bg-violet-700 text-white"
                                      )}>
                                        <span className="font-mono text-body-md uppercase">{n.id.substring(0, 2)}</span>
                                      </div>
                                    </ScanFrame>
                                  ) : (
                                    <div className="flex size-12 items-center justify-center border border-ink-700 bg-ink-800 text-white">
                                      <span className="font-mono text-body-md uppercase">{n.id.substring(0, 2)}</span>
                                    </div>
                                  )}
                                  <span className={cn(
                                    "mt-1.5 text-center font-mono text-eyebrow-micro uppercase tracking-[0.03em] leading-none",
                                    isAnswerNode ? "text-coral-600" : "text-[var(--text-on-dark-muted)]"
                                  )}>
                                     {isFinished ? (currentCase.nodeLabels?.[n.id] || n.id) : n.id}
                                  </span>
                                </div>
                              </foreignObject>
                            </g>
                          );
                        })}
                      </svg>
                    </TransformComponent>
                  )}
                </TransformWrapper>
              </>
            )}
          </div>
        </div>

        <div className="shrink-0 space-y-1.5 border-t border-ink-800 pt-2 p-6">
        {gameState === 'casefail' ? (
          <div className="mt-auto">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-eyebrow-micro uppercase tracking-[0.03em] text-[var(--text-on-dark-muted)]">
                  {caseFailCanAdvance ? 'Auto-continue' : 'Auto-exit'}
                </span>
                <span className={cn(
                  "font-mono text-eyebrow-micro tabular-nums",
                  caseFailSec <= 3 ? "text-coral-600 animate-pulse" : "text-[var(--text-on-dark-muted)]"
                )}>
                  {caseFailSec}s
                </span>
              </div>
              <div className="h-0.5 w-full bg-ink-800">
                <div
                  className={cn(
                    "h-full bg-coral-600",
                    caseFailSec < 10 && "transition-[width] duration-1000 ease-linear"
                  )}
                  style={{ width: `${(caseFailSec / 10) * 100}%` }}
                />
              </div>
            </div>
            {caseFailCanAdvance ? (
              <>
                <p className="mb-3 font-mono text-eyebrow-micro uppercase tracking-[0.03em] text-violet-400">
                  Skip Used
                </p>
                <Button variant="light" size="lg" disabled className="w-full pointer-events-none" chevron>
                  Continue
                </Button>
              </>
            ) : (
              <div className="py-2 border border-ink-800 rounded bg-ink-900 text-center text-body-sm text-[var(--text-on-dark-muted)]">
                Use Kiosk or Phone to proceed
              </div>
            )}
          </div>
        ) : solved ? (
          <div className="mt-auto">
            <div className="animate-resolve-in border border-violet-500/60 bg-violet-700/10 mb-2">
              <div className="flex items-center gap-2 border-b border-violet-500/30 px-3 py-2">
                <CheckCircle2 className="size-3.5 shrink-0 text-violet-400" strokeWidth={1.5} />
                <span className="font-mono text-eyebrow-micro font-semibold uppercase tracking-[0.12em] text-violet-300">
                  Case Closed
                </span>
              </div>
              <div className="px-3 py-2.5">
                <p className="font-mono text-body-sm text-[var(--text-on-dark-muted)] leading-snug">
                  {currentCase.explanation}
                </p>
                <div className="mt-3">
                  <div className="mb-1 flex items-center justify-between font-mono text-eyebrow-micro uppercase tracking-[0.03em] text-[var(--text-on-dark-muted)]">
                    <span>Next case loading</span>
                    <span className="tabular-nums">{caseClosedSec}s</span>
                  </div>
                  <div className="h-0.5 bg-ink-800">
                    <div className="correct-countdown-drain h-full w-full bg-violet-500" />
                  </div>
                </div>
              </div>
            </div>
            <Button variant="light" size="lg" className="w-full pointer-events-none" disabled chevron>
              Next Round
            </Button>
          </div>
        ) : (
            showClues ? (
              <div className="animate-in fade-in slide-in-from-bottom-2 mt-auto">
                <div className="border border-amber-500/20 bg-[rgba(245,158,11,0.04)]">
                  <div className="flex items-center justify-between border-b border-amber-500/20 px-3 py-2 bg-amber-500/10">
                    <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-amber-500">
                      Investigator Clues
                    </span>
                  </div>
                  <div className="divide-y divide-amber-500/10 max-h-[30vh] overflow-y-auto app-scroll">
                    {currentCase.clues.map((clue: string, i: number) => (
                       <div key={i} className="flex items-start gap-2 px-3 py-1.5">
                         <span className="shrink-0 font-mono text-[12px] font-bold tabular-nums text-amber-400 leading-snug pt-px">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                         <p className="font-mono text-[13px] text-[var(--text-on-dark)] leading-snug">
                          {clue}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <h2 className="font-sans text-display-xs text-white leading-snug">{currentCase.instruction}</h2>
            )
        )}

        {/* Render buttons if it's active case */}
        {gameState === 'case' && !solved && (
           <div className="shrink-0 mt-4 pt-4 border-t border-ink-800">
             <div className="flex items-center gap-2">
                <Button variant={selectedNode ? 'default' : 'secondary'} size="lg" className="min-w-0 flex-1 pointer-events-none" chevron>
                  Submit accusation
                </Button>
                <Button variant="outline" size="sm" className="shrink-0 pointer-events-none">
                  Skip case
                </Button>
                <Button variant="outline" size="sm" className="shrink-0 border-coral-500/30 text-coral-400 pointer-events-none">
                  End Run
                </Button>
             </div>
           </div>
        )}
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
