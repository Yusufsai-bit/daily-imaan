/**
 * Supabase client — lazy, env-gated, graceful when absent.
 *
 * The app is fully functional without a Supabase backend. When
 * `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` are set, we
 * lazily initialise a client; otherwise every backed-up call no-ops. This
 * means a fresh checkout works offline-only out of the box, and you can flip
 * the backend on by adding two EAS secrets at build time.
 *
 * SETUP (5 minutes):
 *   1. Create a free project at https://supabase.com.
 *   2. In Authentication → Providers, ensure "Email" and "Anonymous Sign-Ins"
 *      are both enabled. Anonymous sessions are how Daily Imaan persists
 *      streaks across reinstalls without asking for a login.
 *   3. Run the SQL in lib/supabase-schema.sql (creates the `user_state`
 *      table + row-level security policy).
 *   4. From Project Settings → API, copy the Project URL and the anon key.
 *   5. Set as EAS secrets:
 *        eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://xxx.supabase.co"
 *        eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "eyJh..."
 *   6. Install the SDK: pnpm add @supabase/supabase-js
 *   7. Rebuild. The app will silently start syncing on first launch.
 *
 * When env vars are missing, `getSupabase()` returns null and the rest of the
 * app falls back to local-only AsyncStorage. No errors, no warnings.
 */

// supabase-js relies on the global URL constructor, which has known parsing
// quirks on React Native's JS engine. The polyfill (~1KB) makes URL parsing
// behave like the browser. Importing the /auto subpath registers the
// polyfill as a side effect — must be the FIRST import in this file.
import "react-native-url-polyfill/auto";

import AsyncStorage from "@react-native-async-storage/async-storage";

// Type-only import keeps the SDK out of the bundle when @supabase/supabase-js
// is not installed yet. The dynamic import below is what actually loads it.
type SupabaseClient = unknown;

const URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

let cached: SupabaseClient | null = null;
let initPromise: Promise<SupabaseClient | null> | null = null;

export async function getSupabase(): Promise<SupabaseClient | null> {
  if (!URL || !ANON_KEY) return null;
  if (cached) return cached;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      // Dynamic import so the SDK is optional. If `@supabase/supabase-js` is
      // not installed, this throws and we silently fall back to local-only.
      // @ts-expect-error — package may not be installed in fresh checkouts;
      // the failure path is the intended one.
      const mod = await import("@supabase/supabase-js");
      const client = mod.createClient(URL, ANON_KEY, {
        auth: {
          // React Native: persist the session in AsyncStorage so anonymous
          // sessions survive app restarts. Without this, every cold start
          // creates a new anonymous user and the streak migration is wasted.
          storage: AsyncStorage as unknown as Storage,
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false,
        },
      });
      cached = client;
      return client;
    } catch {
      // SDK missing or createClient failed — fall back to local-only.
      cached = null;
      return null;
    }
  })();

  return initPromise;
}
