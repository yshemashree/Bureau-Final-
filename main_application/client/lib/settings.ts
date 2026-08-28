/**
 * Small local settings the app needs before (or without) admin auth — right
 * now just the Game 2 (Spoof the System) live redirect URL. Writing it goes
 * through the admin-gated `set_spoof_url` action; this is read-only.
 */
const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export async function fetchSpoofLiveUrl(): Promise<string | null> {
  try {
    const res = await fetch(`${base}/api/settings/spoof-url`);
    if (!res.ok) throw new Error(`${res.status}`);
    const body = (await res.json()) as { url: string | null };
    return body.url ?? null;
  } catch {
    return null;
  }
}
