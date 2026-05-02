#!/bin/bash
set -e
# Daily Imaan is an Expo app with AsyncStorage; there is no backend or
# database, so post-merge only needs to reconcile installed packages.
pnpm install --frozen-lockfile
