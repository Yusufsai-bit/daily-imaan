import { useEffect, useState } from "react";
import { AccessibilityInfo } from "react-native";

/**
 * Tracks the OS "Reduce Motion" accessibility setting (iOS: Settings →
 * Accessibility → Motion; Android: Remove animations).
 *
 * Consumers should keep FUNCTIONAL movement (e.g. the qibla needle must
 * still point the right way) but replace decorative animation with an
 * instant jump: pass duration 0 / setValue instead of running springs and
 * bounces. Vestibular-disorder users get motion sickness from exactly the
 * kind of playful movement this app uses for delight.
 */
export function useReduceMotion(): boolean {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => {
        if (mounted) setReduceMotion(enabled);
      })
      .catch(() => {
        // Older platforms without the API — leave animations on.
      });
    const sub = AccessibilityInfo.addEventListener("reduceMotionChanged", setReduceMotion);
    return () => {
      mounted = false;
      sub.remove();
    };
  }, []);

  return reduceMotion;
}
