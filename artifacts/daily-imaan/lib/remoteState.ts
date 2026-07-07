/**
 * Remote-state mirror for AppContext.
 *
 * Provides two functions consumed by AppContext:
 *   - hydrateRemoteState() — pull on cold start. Returns the saved AppState
 *     for the current anonymous user, or null if there's no remote backend
 *     configured / the user has no remote record yet.
 *   - syncRemoteState(state) — fire-and-forget push after every state mutation.
 *     Debounced to ~1s so rapid bookmark taps don't hammer the backend.
 *
 * The remote layer is **optional**. Both functions silently no-op when:
 *   - `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY` are unset
 *   - The `@supabase/supabase-js` package isn't installed
 *   - Network is unreachable
 *
 * In other words: the app works fully offline, and adding the backend is a
 * two-env-var flip, not a code change.
 *
 * Storage shape: a single `user_state` row per anonymous user, with the full
 * AppState JSON in a `state jsonb` column and an `updated_at` timestamp for
 * last-write-wins conflict resolution. See supabase-schema.sql for the DDL.
 */

import { getSupabase } from "@/lib/supabase";

const TABLE = "user_state";
const PUSH_DEBOUNCE_MS = 1000;

let pushTimer: ReturnType<typeof setTimeout> | null = null;
let pendingPush: unknown | null = null;

/**
 * Hard suspend latch. Set when the user turns Cloud backup OFF (alongside
 * deleting the row) and cleared when they turn it back ON. Exists because
 * the AppContext gate alone has a race: a debounced save whose snapshot was
 * captured just BEFORE the toggle still carries cloudSyncEnabled=true and
 * would re-push (recreating the freshly-deleted row) moments after
 * deleteRemoteState ran. The latch makes "off" mean off immediately.
 */
let syncSuspended = false;

/** Re-allow pushes after the user turns Cloud backup back ON. */
export function resumeRemoteSync(): void {
  syncSuspended = false;
}

interface RowShape {
  user_id: string;
  state: unknown;
  updated_at: string;
}

/**
 * Ensure the user has an anonymous Supabase session. Creates one on first
 * call. Returns the user id or null when remote is disabled / unreachable.
 */
async function ensureAnonymousUser(): Promise<string | null> {
  const supabase = await getSupabase();
  if (!supabase) return null;
  try {
    // @ts-expect-error — supabase-js shape; typed as unknown above to avoid
    // pulling the SDK types when the package isn't installed.
    const { data: existing } = await supabase.auth.getSession();
    if (existing?.session?.user?.id) {
      return existing.session.user.id as string;
    }
    // @ts-expect-error — see above
    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) return null;
    return (data?.user?.id as string | undefined) ?? null;
  } catch {
    return null;
  }
}

/**
 * Pull the saved state for the current anonymous user. Returns null when
 * remote is unavailable or no record exists yet.
 */
export async function hydrateRemoteState(): Promise<unknown | null> {
  const supabase = await getSupabase();
  if (!supabase) return null;
  const userId = await ensureAnonymousUser();
  if (!userId) return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from(TABLE)
      .select("state")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) return null;
    return (data as RowShape | null)?.state ?? null;
  } catch {
    return null;
  }
}

/**
 * Schedule a debounced push of the latest state to the remote backend.
 * Multiple calls within PUSH_DEBOUNCE_MS coalesce into a single network
 * write — important because every settings tap and bookmark toggle calls
 * this. Errors are swallowed; the local AsyncStorage write is canonical.
 */
export function syncRemoteState(state: unknown): void {
  if (syncSuspended) return;
  pendingPush = state;
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(() => {
    void flushPush();
  }, PUSH_DEBOUNCE_MS);
}

/**
 * Cancel any queued (debounced) push without sending it. Called when the
 * user turns Cloud backup OFF so a pending write can't race the deletion.
 */
export function cancelPendingSync(): void {
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = null;
  pendingPush = null;
}

/**
 * Delete the current anonymous user's mirrored row and sign out, dropping
 * the Keychain session. Called when the user turns Cloud backup OFF in
 * Settings — the in-app privacy policy promises that disabling backup also
 * removes the server copy, so this must actually happen.
 *
 * Deliberately does NOT create a session: if there's no signed-in user,
 * there's nothing on the server to delete.
 */
export async function deleteRemoteState(): Promise<void> {
  syncSuspended = true;
  cancelPendingSync();
  const supabase = await getSupabase();
  if (!supabase) return;
  try {
    // @ts-expect-error — see ensureAnonymousUser
    const { data } = await supabase.auth.getSession();
    const userId = data?.session?.user?.id as string | undefined;
    if (!userId) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from(TABLE).delete().eq("user_id", userId);
    // @ts-expect-error — see ensureAnonymousUser
    await supabase.auth.signOut();
  } catch {
    // Best-effort: worst case the orphaned row is re-deleted next time the
    // toggle is flipped, and no further data is pushed either way because
    // syncRemoteState is gated on the setting.
  }
}

async function flushPush(): Promise<void> {
  const payload = pendingPush;
  pendingPush = null;
  pushTimer = null;
  if (!payload) return;
  const supabase = await getSupabase();
  if (!supabase) return;
  const userId = await ensureAnonymousUser();
  if (!userId) return;
  try {
    // @ts-expect-error — see ensureAnonymousUser
    await supabase.from(TABLE).upsert(
      {
        user_id: userId,
        state: payload,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );
  } catch {
    // Best-effort; local write is canonical.
  }
}
