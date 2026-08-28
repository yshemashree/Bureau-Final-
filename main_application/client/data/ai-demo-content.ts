/**
 * Placeholder content for the AI Demo Area (doc section 13).
 *
 * The client's real AI demo, videos and "AI/demo responses" have not been
 * supplied yet — per the doc, the offline version can be either a locally
 * recreated demo or "a simulated version using pre-configured
 * responses/content". This is that simulated version: a scripted sequence
 * that plays out locally with no network calls, so the screen is functional
 * for rehearsal today and only the content needs swapping once the client
 * delivers their real videos/demo assets.
 *
 * To swap in real content:
 *  - Put each screen's idle-loop video at /public/assets/ai-demo/screen-N-loop.mp4
 *  - Replace the `steps` below with the client's real demo script, or point
 *    DEMO_SCREENS[n].mode at a different renderer entirely.
 */

export type ScreenOrientation = 'vertical' | 'horizontal';

export interface DemoStep {
  /** How long this step stays on screen before auto-advancing. */
  durationMs: number;
  headline: string;
  body: string;
}

export interface DemoScreenConfig {
  id: string;
  label: string;
  orientation: ScreenOrientation;
  ctaLabel: string;
  /** Local idle-loop video. Falls back to a static branded screen if this 404s. */
  loopVideoSrc: string;
  steps: DemoStep[];
}

const IDENTITY_STEPS: DemoStep[] = [
  { durationMs: 4000, headline: 'Bureau Identity', body: 'Watch Bureau AI analyse identity verification in real time.' },
  { durationMs: 5000, headline: 'Document verification', body: 'Extracting data, checking watermarks and running liveness detection…' },
  { durationMs: 4000, headline: 'Verified', body: 'Identity confirmed with 99.8% confidence in 1.2 seconds.' },
];

const SECURITY_STEPS: DemoStep[] = [
  { durationMs: 4000, headline: 'Bureau Security', body: 'Watch Bureau AI detect a synthetic identity ring.' },
  { durationMs: 5000, headline: 'Scanning device signals', body: 'Checking device fingerprint, network reputation and behavioural biometrics…' },
  { durationMs: 4000, headline: 'Threat Detected', body: 'Device previously associated with known fraud ring flagged.' },
];

const FRAUD_STEPS: DemoStep[] = [
  { durationMs: 4000, headline: 'Bureau Fraud', body: 'Fraud Detective, AI edition: watch Bureau trace a mule network.' },
  { durationMs: 5000, headline: 'Mapping the graph', body: 'Building a transaction graph from anonymised account activity…' },
  { durationMs: 5000, headline: 'Ring confirmed', body: '14 accounts, 1 coordinated ring, identified instantly.' },
];

const MONITOR_STEPS: DemoStep[] = [
  { durationMs: 4000, headline: 'Bureau Monitor', body: 'Continuous evaluation of active accounts.' },
  { durationMs: 5000, headline: 'Ongoing risk assessment', body: 'Monitoring transaction velocity and account changes…' },
  { durationMs: 4000, headline: 'Safe', body: 'Account behaviour is consistent with normal usage.' },
];

export const DEMO_SCREENS: DemoScreenConfig[] = [
  {
    id: '1',
    label: 'AI Demo — Identity',
    orientation: 'vertical',
    ctaLabel: 'Tap to see Identity AI in action',
    loopVideoSrc: '/assets/ai-demo/bureau-vertical-demo-video.mp4',
    steps: IDENTITY_STEPS,
  },
  {
    id: '2',
    label: 'AI Demo — Security',
    orientation: 'vertical',
    ctaLabel: 'Tap to see Security AI in action',
    loopVideoSrc: '/assets/ai-demo/bureau-vertical-demo-video.mp4',
    steps: SECURITY_STEPS,
  },
  {
    id: '3',
    label: 'AI Demo — Fraud',
    orientation: 'vertical',
    ctaLabel: 'Tap to see Fraud AI in action',
    loopVideoSrc: '/assets/ai-demo/bureau-vertical-demo-video.mp4',
    steps: FRAUD_STEPS,
  },
  {
    id: '4',
    label: 'AI Demo — Monitor',
    orientation: 'horizontal',
    ctaLabel: 'Tap to see Monitor AI in action',
    loopVideoSrc: '/assets/ai-demo/bureau-vertical-demo-video.mp4',
    steps: MONITOR_STEPS,
  },
];

export function getDemoScreen(id: string | undefined): DemoScreenConfig | undefined {
  return DEMO_SCREENS.find((s) => s.id === id);
}
