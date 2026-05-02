import Constants from "expo-constants";
import * as Sentry from "@sentry/react-native";

// DSN is read from EXPO_PUBLIC_SENTRY_DSN at build/runtime. When unset (e.g.
// during local development before a Sentry account is provisioned), Sentry
// init is skipped entirely and every wrapper below becomes a no-op. This
// keeps the app functional without requiring a Sentry project to exist.
const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;

let initialized = false;

export function initSentry(): void {
  if (!dsn) {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log(
        "[sentry] EXPO_PUBLIC_SENTRY_DSN not set — crash reporting disabled.",
      );
    }
    return;
  }
  if (initialized) return;
  initialized = true;

  Sentry.init({
    dsn,
    debug: false,
    enableNative: true,
    sendDefaultPii: false,
    tracesSampleRate: 0.1,
    environment: __DEV__ ? "development" : "production",
    release: Constants.expoConfig?.version ?? "0.0.0",
    dist: String(
      Constants.expoConfig?.ios?.buildNumber ??
        Constants.expoConfig?.android?.versionCode ??
        "1",
    ),
  });
}

export function captureError(
  error: unknown,
  context?: Record<string, unknown>,
): void {
  if (!initialized) return;
  if (error instanceof Error) {
    Sentry.captureException(error, context ? { extra: context } : undefined);
  } else {
    Sentry.captureMessage(String(error), {
      level: "error",
      extra: context,
    });
  }
}

export function reportRenderError(
  error: Error,
  componentStack: string,
): void {
  if (!initialized) return;
  Sentry.captureException(error, {
    contexts: { react: { componentStack } },
  });
}

// Wraps the root component for navigation tracking when Sentry is active;
// otherwise returns the component unchanged.
export function wrapRoot<T>(component: T): T {
  if (!initialized) return component;
  // Sentry.wrap signature accepts a component and returns the same shape.
  // The cast is safe because we only invoke this with the root layout.
  return (Sentry.wrap as unknown as (c: T) => T)(component);
}
