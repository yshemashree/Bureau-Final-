/**
 * AI Demo Area — one of the 4 offline demo screens (doc section 13).
 *
 * State machine: idle video loop -> attendee taps the CTA -> the scripted AI
 * demo plays -> on completion, or after INACTIVITY_MS with no interaction,
 * it returns to the idle loop automatically. Nothing here calls the network;
 * everything is local content, so it keeps running with no internet.
 *
 * screenId comes from the route (/ai-demo/1 .. /ai-demo/4) so the same
 * kiosk build can drive any of the four physical screens by URL alone —
 * useful because 3 are vertical and 1 is horizontal.
 */
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'wouter';
import { getDemoScreen, DEMO_SCREENS, type DemoStep, type DemoScreenConfig } from '@/data/ai-demo-content';

const INACTIVITY_MS = 20_000;

type ScreenState = 'loop' | 'demo';

export default function AiDemo() {
  const { screenId } = useParams<{ screenId: string }>();
  // Use the specific screen's background video if available, otherwise fallback to the first one.
  const baseConfig = getDemoScreen(screenId) || DEMO_SCREENS[0];

  const [state, setState] = useState<ScreenState>('loop');
  const [activeDemo, setActiveDemo] = useState<DemoScreenConfig | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [videoFailed, setVideoFailed] = useState(false);
  const inactivityTimer = useRef<number | null>(null);

  const returnToLoop = () => {
    setState('loop');
    setStepIndex(0);
    setActiveDemo(null);
  };

  const armInactivityTimer = () => {
    if (inactivityTimer.current) window.clearTimeout(inactivityTimer.current);
    inactivityTimer.current = window.setTimeout(returnToLoop, INACTIVITY_MS);
  };

  const startDemo = (demo: DemoScreenConfig) => {
    setActiveDemo(demo);
    setStepIndex(0);
    setState('demo');
    armInactivityTimer();
  };

  // Auto-advance through the scripted steps while the demo is running.
  useEffect(() => {
    if (state !== 'demo' || !activeDemo) return;
    armInactivityTimer();

    const step = activeDemo.steps[stepIndex];
    if (!step) {
      returnToLoop();
      return;
    }
    const timer = window.setTimeout(() => {
      if (stepIndex + 1 >= activeDemo.steps.length) {
        returnToLoop();
      } else {
        setStepIndex((i) => i + 1);
      }
    }, step.durationMs);

    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, stepIndex, activeDemo]);

  useEffect(() => () => {
    if (inactivityTimer.current) window.clearTimeout(inactivityTimer.current);
  }, []);

  return (
    <div
      className="relative h-screen w-full overflow-hidden bg-black"
      data-orientation={baseConfig.orientation}
      onClick={() => { if (state === 'demo') armInactivityTimer(); }}
    >
      {!videoFailed ? (
        <video
          className="absolute inset-0 size-full object-cover"
          src={baseConfig.loopVideoSrc}
          autoPlay
          loop
          muted
          playsInline
          onError={() => setVideoFailed(true)}
        />
      ) : (
        <div className="absolute inset-0 bureau-matrix bg-[#00010f]" />
      )}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/60" />

      {state === 'loop' && (
        <div className="relative z-10 flex h-full w-full flex-col items-center justify-end gap-6 p-10 pb-20 text-center">
          <h1 className="font-sans text-[clamp(24px,3vw,36px)] font-normal text-white mb-2">Explore Bureau AI</h1>
          <div className="grid w-full max-w-2xl grid-cols-1 sm:grid-cols-2 gap-4">
            {DEMO_SCREENS.map((demo) => (
              <button
                key={demo.id}
                type="button"
                onClick={() => startDemo(demo)}
                className="tap flex min-h-[80px] flex-col justify-center items-center gap-1 border border-violet-500/50 bg-violet-700/80 hover:bg-violet-600 px-6 py-4 backdrop-blur-md transition-colors"
              >
                <span className="font-sans text-[clamp(18px,2vw,24px)] font-medium text-white">
                  {demo.label.replace('AI Demo — ', '')}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-violet-200">
                  Tap to play
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {state === 'demo' && activeDemo && <DemoOverlay step={activeDemo.steps[stepIndex]} />}
    </div>
  );
}

function DemoOverlay({ step }: { step: DemoStep | undefined }) {
  if (!step) return null;
  return (
    <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-5 px-12 text-center">
      <span className="font-mono text-[clamp(12px,1.2vw,16px)] uppercase tracking-[0.2em] text-violet-400">
        Bureau AI
      </span>
      <h2 className="font-sans text-[clamp(24px,3.4vw,42px)] font-normal text-white">{step.headline}</h2>
      <p className="max-w-[46ch] text-[clamp(14px,1.6vw,22px)] text-[var(--text-on-dark-muted)]">{step.body}</p>
    </div>
  );
}
