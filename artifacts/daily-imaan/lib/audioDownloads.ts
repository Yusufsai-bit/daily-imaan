/**
 * Offline surah audio. Downloads every ayah MP3 of a surah for the chosen
 * reciter into the app's document directory so recitation plays with no
 * network — commutes, flights, weak signal.
 *
 * Layout: <documentDirectory>/quran-audio/<reciter>/<surahId>/<ayahN>.mp3
 * A `.complete` marker file is written only after every ayah has landed, so
 * a half-finished download is never mistaken for an offline copy (playback
 * checks the marker once per surah, not per file). Re-running a failed
 * download resumes: existing non-empty files are skipped.
 *
 * Uses the legacy expo-file-system API surface (stable, documented) — the
 * SDK 54 package exports it under /legacy.
 */
import * as FileSystem from "expo-file-system/legacy";

import { SURAHS } from "@/data/surahsData";

const ROOT = `${FileSystem.documentDirectory ?? ""}quran-audio`;

function surahDir(surahId: number, reciter: string): string {
  return `${ROOT}/${encodeURIComponent(reciter)}/${surahId}`;
}

function markerPath(surahId: number, reciter: string): string {
  return `${surahDir(surahId, reciter)}/.complete`;
}

/** True when the surah is fully downloaded for this reciter. */
export async function isSurahDownloaded(surahId: number, reciter: string): Promise<boolean> {
  if (!FileSystem.documentDirectory) return false;
  try {
    const info = await FileSystem.getInfoAsync(markerPath(surahId, reciter));
    return info.exists;
  } catch {
    return false;
  }
}

/**
 * The local directory holding this surah's audio, or null when not (fully)
 * downloaded. Used by lib/trackPlayer to prefer local files.
 */
export async function getLocalSurahDirIfComplete(
  surahId: number,
  reciter: string,
): Promise<string | null> {
  return (await isSurahDownloaded(surahId, reciter)) ? surahDir(surahId, reciter) : null;
}

/**
 * Download all ayah MP3s for a surah with a small concurrency pool.
 * onProgress fires with (completedCount, total). Throws on any failed file
 * — the marker is only written after a fully successful pass.
 */
export async function downloadSurahAudio(
  surahId: number,
  reciter: string,
  onProgress?: (done: number, total: number) => void,
): Promise<void> {
  if (!FileSystem.documentDirectory) throw new Error("File system unavailable");
  const surah = SURAHS.find((s) => s.id === surahId);
  if (!surah) throw new Error(`Unknown surah ${surahId}`);

  const dir = surahDir(surahId, reciter);
  await FileSystem.makeDirectoryAsync(dir, { intermediates: true }).catch(() => {});

  const total = surah.ayahCount;
  let done = 0;
  const queue: number[] = Array.from({ length: total }, (_, i) => i + 1);

  const worker = async (): Promise<void> => {
    for (;;) {
      const n = queue.shift();
      if (n === undefined) return;
      const dest = `${dir}/${n}.mp3`;
      const existing = await FileSystem.getInfoAsync(dest);
      const alreadyGood = existing.exists && (existing.size ?? 0) > 1024;
      if (!alreadyGood) {
        const globalNum = surah.startingAyah + n - 1;
        const url = `https://cdn.alquran.cloud/media/audio/ayah/${reciter}/${globalNum}`;
        const res = await FileSystem.downloadAsync(url, dest);
        if (res.status !== 200) {
          await FileSystem.deleteAsync(dest, { idempotent: true }).catch(() => {});
          throw new Error(`HTTP ${res.status} for ayah ${n}`);
        }
      }
      done += 1;
      onProgress?.(done, total);
    }
  };

  // 4 parallel downloads — fast without hammering the CDN.
  await Promise.all(Array.from({ length: 4 }, () => worker()));
  await FileSystem.writeAsStringAsync(markerPath(surahId, reciter), new Date().toISOString());
}

/** Remove a downloaded surah (all files + marker). Idempotent. */
export async function deleteSurahAudio(surahId: number, reciter: string): Promise<void> {
  if (!FileSystem.documentDirectory) return;
  await FileSystem.deleteAsync(surahDir(surahId, reciter), { idempotent: true }).catch(() => {});
}
