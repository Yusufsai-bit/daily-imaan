import Constants from "expo-constants";
import * as Sentry from "@sentry/react-native";

const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;
let initialized = false;
// User-controlled opt-out flag. AppContext flips this on load via
// setCrashReportsEnabled. Defaults to true so anonymized crash reports flow
// for the brief window before AppContext hydrates.
let userEnabled = true;

export function setCrashReportsEnabled(enabled: boolean): void {
  userEnabled = enabled;
}

function isActive(): boolean {
  return initialized && userEnabled;
}

export function initSentry(): void {
  if (!dsn || initialized) return;
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
    // Hard opt-out at the SDK boundary. Even native crashes, auto-instrumented
    // errors, and breadcrumbs are dropped while the user has crash reports
    // turned off — gating only our wrapper functions would leak telemetry
    // through Sentry's automatic capture paths.
    beforeSend: (event) => (userEnabled ? event : null),
    beforeBreadcrumb: (breadcrumb) => (userEnabled ? breadcrumb : null),
  });
}

export function captureError(error: unknown, context?: Record<string, unknown>): void {
  if (!isActive()) return;
  if (error instanceof Error) {
    Sentry.captureException(error, context ? { extra: context } : undefined);
  } else {
    Sentry.captureMessage(String(error), { level: "error", extra: context });
  }
}

export function reportRenderError(error: Error, componentStack: string): void {
  if (!isActive()) return;
  Sentry.captureException(error, { contexts: { react: { componentStack } } });
}

export function wrapRoot<T>(component: T): T {
  if (!initialized) return component;
  return (Sentry.wrap as unknown as (c: T) => T)(component);
}
