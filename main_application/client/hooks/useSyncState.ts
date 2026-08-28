import { useEffect, useRef, useContext } from "react";
import { DisplayContext } from "@/components/layout";

let activeSyncCount = 0;

export function useSyncState(state: any) {
  const lastSentRef = useRef<string>("");
  const { isLed } = useContext(DisplayContext);

  useEffect(() => {
    if (isLed) return;

    // Stringify to compare deeply enough for our simple states
    const stateStr = JSON.stringify(state);
    if (stateStr === lastSentRef.current) return;
    
    lastSentRef.current = stateStr;

    fetch("/api/sync/state", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: stateStr,
    }).catch((err) => {
      console.warn("Failed to sync state to spectator:", err);
    });
  }, [state, isLed]);

  // Only send idle when the component actually unmounts and no other sync hook is active
  useEffect(() => {
    if (isLed) return;
    activeSyncCount++;

    return () => {
      activeSyncCount--;
      if (activeSyncCount === 0) {
        setTimeout(() => {
          if (activeSyncCount === 0) {
            fetch("/api/sync/state", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ type: "idle" }),
              keepalive: true
            }).catch(() => {});
          }
        }, 100);
      }
    };
  }, [isLed]);
}

