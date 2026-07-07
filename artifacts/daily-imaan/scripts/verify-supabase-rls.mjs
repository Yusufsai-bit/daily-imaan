/**
 * Live security check for the cloud-backup backend. Verifies, against the
 * real Supabase project, that:
 *   1. Anonymous sign-ins are enabled (the "streak survives reinstalls"
 *      feature silently no-ops without this — worth proving before launch).
 *   2. Row Level Security holds: user B cannot READ user A's state row.
 *   3. RLS holds on writes: user B cannot UPSERT a row as user A.
 *   4. A user CAN write and read back their own row (the happy path).
 *
 * Cleans up after itself (deletes both test rows, signs out both sessions).
 * The two throwaway anonymous users it creates are inert.
 *
 * Usage (PowerShell):
 *   $env:EXPO_PUBLIC_SUPABASE_URL  = "https://xxx.supabase.co"
 *   $env:EXPO_PUBLIC_SUPABASE_ANON_KEY = "eyJh..."
 *   node scripts/verify-supabase-rls.mjs
 *
 * Get the values with:  eas env:list production --include-sensitive
 */
import { createClient } from "@supabase/supabase-js";

const URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
if (!URL || !KEY) {
  console.error("Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY first.");
  process.exit(2);
}

const TABLE = "user_state";
let failures = 0;
const ok = (label) => console.log(`  ✅ ${label}`);
const bad = (label, detail) => {
  failures += 1;
  console.log(`  ❌ ${label}${detail ? ` — ${detail}` : ""}`);
};

function newClient() {
  return createClient(URL, KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}

console.log("1. Anonymous sign-ins");
const a = newClient();
const b = newClient();
const [ra, rb] = await Promise.all([a.auth.signInAnonymously(), b.auth.signInAnonymously()]);
if (ra.error || rb.error) {
  bad("anonymous sign-in", (ra.error ?? rb.error)?.message);
  console.log("\nEnable Authentication → Sign In / Up → Anonymous sign-ins in the Supabase dashboard.");
  process.exit(1);
}
const userA = ra.data.user.id;
const userB = rb.data.user.id;
ok(`two anonymous sessions created (${userA.slice(0, 8)}…, ${userB.slice(0, 8)}…)`);

console.log("2. Own-row write + read (happy path)");
const payload = { probe: "rls-verify", at: new Date().toISOString() };
const w = await a.from(TABLE).upsert(
  { user_id: userA, state: payload, updated_at: new Date().toISOString() },
  { onConflict: "user_id" },
);
if (w.error) bad("A upsert own row", w.error.message);
else ok("A wrote its own row");
const rOwn = await a.from(TABLE).select("state").eq("user_id", userA).maybeSingle();
if (rOwn.error || rOwn.data?.state?.probe !== "rls-verify") bad("A read own row back", rOwn.error?.message ?? "wrong data");
else ok("A read its own row back");

console.log("3. Cross-user READ must be blocked");
const rCross = await b.from(TABLE).select("state").eq("user_id", userA).maybeSingle();
if (rCross.data != null) bad("B can read A's row", "RLS SELECT policy is broken");
else ok("B sees nothing of A's row");

console.log("4. Cross-user WRITE must be blocked");
const wCross = await b.from(TABLE).upsert(
  { user_id: userA, state: { hijacked: true }, updated_at: new Date().toISOString() },
  { onConflict: "user_id" },
);
// RLS may surface as an explicit error OR a silent zero-row write — verify
// A's data is untouched either way.
const rAfter = await a.from(TABLE).select("state").eq("user_id", userA).maybeSingle();
if (rAfter.data?.state?.probe === "rls-verify") ok(`B could not overwrite A's row${wCross.error ? " (rejected with error)" : ""}`);
else bad("B overwrote A's row", "RLS INSERT/UPDATE policy is broken");

console.log("5. Cleanup");
await a.from(TABLE).delete().eq("user_id", userA);
await b.from(TABLE).delete().eq("user_id", userB);
await Promise.all([a.auth.signOut(), b.auth.signOut()]);
ok("test rows deleted, sessions closed");

if (failures === 0) {
  console.log("\n✅ PASS — anonymous auth live, RLS isolating users correctly.");
  process.exit(0);
}
console.log(`\n❌ ${failures} check(s) failed — fix before shipping the cloud-backup claim.`);
process.exit(1);
