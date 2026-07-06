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
import { Platform } from "react-native";

/**
 * Auth-session storage that survives app uninstall.
 *
 * The whole point of the anonymous session is "your streak survives
 * reinstalls" — but AsyncStorage lives in the app sandbox and is DELETED
 * on uninstall, which silently broke that promise: every reinstall minted
 * a brand-new anonymous user and orphaned the old row. iOS Keychain (and
 * Android Keystore-backed storage) persists across uninstall/reinstall,
 * so the session — and therefore the user's row — is recoverable.
 *
 * Implementation notes:
 *  - expo-secure-store warns above ~2 KB per value and a Supabase session
 *    JSON can exceed that, so values are transparently chunked across
 *    `key.0 … key.N` with a `__chunks__:N` marker stored under the bare key.
 *  - One-time migration: if the key is missing from SecureStore but present
 *    in AsyncStorage (installs upgrading from builds ≤12), the old value is
 *    adopted and copied into SecureStore so existing sessions carry over.
 *  - Falls back to plain AsyncStorage when SecureStore is unavailable
 *    (web, or any environment without the native module).
 */
const CHUNK_SIZE = 1800;
const CHUNK_MARKER = "__chunks__:";

type SecureStoreModule = typeof import("expo-secure-store");

let secureStore: SecureStoreModule | null | undefined;
function getSecureStore(): SecureStoreModule | null {
  if (secureStore !== undefined) return secureStore;
  if (Platform.OS === "web") {
    secureStore = null;
    return secureStore;
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    secureStore = require("expo-secure-store") as SecureStoreModule;
  } catch {
    secureStore = null;
  }
  return secureStore;
}

// AFTER_FIRST_UNLOCK so background token refresh can read the session
// while the device is locked (post first unlock after boot).
function secureOpts(ss: SecureStoreModule) {
  return { keychainAccessible: ss.AFTER_FIRST_UNLOCK };
}

async function removeChunks(ss: SecureStoreModule, key: string, count: number): Promise<void> {
  for (let i = 0; i < count; i++) {
    await ss.deleteItemAsync(`${key}.${i}`).catch(() => {});
  }
}

function parseChunkCount(marker: string | null): number {
  if (!marker || !marker.startsWith(CHUNK_MARKER)) return 0;
  const n = parseInt(marker.slice(CHUNK_MARKER.length), 10);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

const sessionStorage = {
  async getItem(key: string): Promise<string | null> {
    const ss = getSecureStore();
    if (!ss) return AsyncStorage.getItem(key);
    try {
      const head = await ss.getItemAsync(key);
      if (head !== null) {
        const chunks = parseChunkCount(head);
        if (chunks === 0) return head;
        let out = "";
        for (let i = 0; i < chunks; i++) {
          const part = await ss.getItemAsync(`${key}.${i}`);
          if (part === null) return null; // torn write — treat as absent
          out += part;
        }
        return out;
      }
      // Migration path: session written by an older build into AsyncStorage.
      const legacy = await AsyncStorage.getItem(key);
      if (legacy !== null) {
        await sessionStorage.setItem(key, legacy);
        await AsyncStorage.removeItem(key).catch(() => {});
      }
      return legacy;
    } catch {
      return AsyncStorage.getItem(key);
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    const ss = getSecureStore();
    if (!ss) {
      await AsyncStorage.setItem(key, value);
      return;
    }
    try {
      const oldChunks = parseChunkCount(await ss.getItemAsync(key));
      if (value.length <= CHUNK_SIZE) {
        await ss.setItemAsync(key, value, secureOpts(ss));
        if (oldChunks > 0) await removeChunks(ss, key, oldChunks);
        return;
      }
      const chunks = Math.ceil(value.length / CHUNK_SIZE);
      for (let i = 0; i < chunks; i++) {
        await ss.setItemAsync(
          `${key}.${i}`,
          value.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE),
          secureOpts(ss),
        );
      }
      // Marker written LAST so a torn write reads as absent, never corrupt.
      await ss.setItemAsync(key, `${CHUNK_MARKER}${chunks}`, secureOpts(ss));
      if (oldChunks > chunks) {
        for (let i = chunks; i < oldChunks; i++) {
          await ss.deleteItemAsync(`${key}.${i}`).catch(() => {});
        }
      }
    } catch {
      await AsyncStorage.setItem(key, value);
    }
  },

  async removeItem(key: string): Promise<void> {
    const ss = getSecureStore();
    await AsyncStorage.removeItem(key).catch(() => {});
    if (!ss) return;
    try {
      const oldChunks = parseChunkCount(await ss.getItemAsync(key));
      await ss.deleteItemAsync(key);
      if (oldChunks > 0) await removeChunks(ss, key, oldChunks);
    } catch {
      // best-effort
    }
  },
};

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
      const mod = await import("@supabase/supabase-js");
      const client = mod.createClient(URL, ANON_KEY, {
        auth: {
          // Keychain-backed (chunked) storage so the anonymous session
          // survives not just restarts but UNINSTALL + REINSTALL — this is
          // what makes "your streak survives reinstalls" actually true.
          // See `sessionStorage` above for chunking + legacy migration.
          storage: sessionStorage as unknown as Storage,
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
