import { useState, useEffect } from "react";

export function useSyncStream() {
  const [state, setState] = useState<any>({ type: "idle" });

  useEffect(() => {
    const eventSource = new EventSource("/api/sync/stream");

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setState(data);
      } catch (err) {
        console.error("Failed to parse sync state:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("EventSource failed:", err);
      eventSource.close();
      // Wait and reconnect
      setTimeout(() => {
        setState({ type: "idle", reconnecting: true });
      }, 5000);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return state;
}
