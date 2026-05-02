import Constants from "expo-constants";
import * as Sentry from "@sentry/react-native";

const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;
let initialized = false;

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
  });
}

export function captureError(error: unknown, context?: Record<string, unknown>): void {
  if (!initialized) return;
  if (error instanceof Error) {
    Sentry.captureException(error, context ? { extra: context } : undefined);
  } else {
    Sentry.captureMessage(String(error), { level: "error", extra: context });
  }
}

export function reportRenderError(error: Error, componentStack: string): void {
  if (!initialized) return;
  Sentry.captureException(error, { contexts: { react: { componentStack } } });
}

export function wrapRoot<T>(component: T): T {
  if (!initialized) return component;
  return (Sentry.wrap as unknown as (c: T) => T)(component);
}
