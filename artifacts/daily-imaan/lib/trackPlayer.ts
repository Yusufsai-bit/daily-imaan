import TrackPlayer, { Capability, RepeatMode, Event } from "react-native-track-player";
import { SURAHS } from "@/data/surahsData";
import { getReciterById } from "@/constants/reciters";
import { getLocalSurahDirIfComplete } from "@/lib/audioDownloads";

let playerReady = false;

export async function setupPlayer(): Promise<boolean> {
  if (playerReady) return true;
  try {
    await TrackPlayer.setupPlayer({ autoHandleInterruptions: true });
    await TrackPlayer.updateOptions({
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.Stop,
      ],
      compactCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
      ],
      progressUpdateEventInterval: 500,
    });
    playerReady = true;
    return true;
  } catch {
    return false;
  }
}

function ayahUrl(surahId: number, ayahN: number, reciter: string): string {
  const surah = SURAHS.find((s) => s.id === surahId);
  if (!surah) return "";
  const globalNum = surah.startingAyah + ayahN - 1;
  return `https://cdn.alquran.cloud/media/audio/ayah/${reciter}/${globalNum}`;
}

/** Play all ayahs of a surah, starting from `startAyah` (1-indexed). */
export async function playSurah(
  surahId: number,
  reciter: string,
  startAyah = 1,
): Promise<void> {
  const surah = SURAHS.find((s) => s.id === surahId);
  if (!surah) return;
  const reciterInfo = getReciterById(reciter);

  // Prefer the offline copy when the surah has been fully downloaded —
  // one marker check per surah, not per ayah.
  const localDir = await getLocalSurahDirIfComplete(surahId, reciter).catch(() => null);
  const urlFor = (n: number) =>
    localDir ? `${localDir}/${n}.mp3` : ayahUrl(surahId, n, reciter);

  const tracks = Array.from({ length: surah.ayahCount }, (_, i) => {
    const n = i + 1;
    return {
      id: `${surahId}:${n}`,
      url: urlFor(n),
      title: `${surah.nameEnglish} · Ayah ${n}`,
      artist: reciterInfo.name,
      album: surah.nameEnglish,
    };
  });

  await TrackPlayer.reset();
  await TrackPlayer.add(tracks);
  await TrackPlayer.setRepeatMode(RepeatMode.Off);
  if (startAyah > 1) {
    await TrackPlayer.skip(startAyah - 1);
  }
  await TrackPlayer.play();
}

/**
 * Play a single ayah. Pass repeatCount > 1 to queue the same ayah N times
 * (for memorisation / A-B loop). Pass Infinity for continuous repeat.
 */
export async function playSingleAyah(
  surahId: number,
  ayahN: number,
  reciter: string,
  repeatCount: number = 1,
): Promise<void> {
  const surah = SURAHS.find((s) => s.id === surahId);
  if (!surah) return;
  const reciterInfo = getReciterById(reciter);

  const localDir = await getLocalSurahDirIfComplete(surahId, reciter).catch(() => null);
  const url = localDir ? `${localDir}/${ayahN}.mp3` : ayahUrl(surahId, ayahN, reciter);
  const title = `${surah.nameEnglish} · Ayah ${ayahN}`;

  await TrackPlayer.reset();

  if (repeatCount === Infinity) {
    await TrackPlayer.add([{ id: `${surahId}:${ayahN}`, url, title, artist: reciterInfo.name, album: surah.nameEnglish }]);
    await TrackPlayer.setRepeatMode(RepeatMode.Track);
  } else {
    // Queue N copies with unique IDs so RNTP treats them as separate tracks.
    const count = Math.max(1, Math.min(repeatCount, 50));
    const tracks = Array.from({ length: count }, (_, i) => ({
      id: i === 0 ? `${surahId}:${ayahN}` : `${surahId}:${ayahN}:r${i}`,
      url,
      title,
      artist: reciterInfo.name,
      album: surah.nameEnglish,
    }));
    await TrackPlayer.add(tracks);
    await TrackPlayer.setRepeatMode(RepeatMode.Off);
  }

  await TrackPlayer.play();
}

/** Extract surahId and ayahN from a track ID string like "2:5". */
export function parseTrackId(id?: string): { surahId: number; ayahN: number } | null {
  if (!id) return null;
  const parts = id.split(":");
  if (parts.length !== 2) return null;
  const surahId = parseInt(parts[0] ?? "0");
  const ayahN = parseInt(parts[1] ?? "0");
  if (!surahId || !ayahN) return null;
  return { surahId, ayahN };
}
