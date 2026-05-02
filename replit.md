# Workspace

## Overview

pnpm workspace monorepo using TypeScript. The active product is **Daily Imaan**,
a production iOS/Android Expo mobile app for busy Muslims. Each package
manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Mobile**: Expo SDK 54, expo-router, React 19, React Native 0.81
- **Persistence**: AsyncStorage (no backend, no database)
- **Audio**: expo-av (recitation streamed from cdn.alquran.cloud)
- **Tafsir**: Quran.com Foundation API (Ibn Kathir Abridged), AsyncStorage cache with LRU eviction

## Active artifacts

- `artifacts/daily-imaan/` — production Expo app (root path `/`)
- `artifacts/mockup-sandbox/` — design canvas for UI prototyping

## Notes

The earlier `artifacts/api-server/` Express+Drizzle backend and the
shared `lib/api-client-react`, `lib/api-spec`, `lib/api-zod`, `lib/db`
packages have been removed — Daily Imaan is offline-first and never
called the backend. Removing them reclaimed cold-start time, lockfile
size, and ~171 transitive dependencies.

The bundled Qur'an text (~2.3 MB) lives in `data/quranFullData.ts` and
is loaded **lazily** via dynamic `import()` from `data/quranFull.ts`.
Always import `getQuranSurah` / `QURAN_TRANSLATION_LABEL` from
`data/quranFull` — never reach into `quranFullData` directly or you
defeat the lazy-load.

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm --filter @workspace/daily-imaan run dev` — run the Expo app
- `pnpm --filter @workspace/daily-imaan run typecheck` — typecheck the app

See the `pnpm-workspace` skill for workspace structure and TypeScript setup.
See the `expo` skill for Expo build conventions.
