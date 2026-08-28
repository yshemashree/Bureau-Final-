import { useEffect, useRef } from 'react';

/**
 * Intercepts the browser/hardware back button while `active` is true.
 *
 * The three games run entirely on client-side state at a single route, so
 * the router never sees a history entry per screen — a physical back press
 * mid-run pops straight out to whatever page preceded the game (usually the
 * hub), silently discarding the run. This pushes a same-URL history entry
 * to catch that pop, undoes it, and calls `onBackAttempt` (wired to the same
 * "End Game Early?" dialog the in-app back chevron already uses) instead.
 */
export function useBackGuard(active: boolean, onBackAttempt: () => void) {
  const onBackAttemptRef = useRef(onBackAttempt);
  onBackAttemptRef.current = onBackAttempt;

  useEffect(() => {
    if (!active) return;

    window.history.pushState({ backGuard: true }, '');

    const handlePopState = () => {
      window.history.pushState({ backGuard: true }, '');
      onBackAttemptRef.current();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [active]);
}
