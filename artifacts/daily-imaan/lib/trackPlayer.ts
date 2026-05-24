import TrackPlayer, { Capability, RepeatMode } from "react-native-track-player";
import { SURAHS } from "@/data/surahsData";
import { getReciterById } from "@/constants/reciters";

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
      progressUpdateEventThrottle: 500,
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

  const tracks = Array.from({ length: surah.ayahCount }, (_, i) => {
    const n = i + 1;
    return {
      id: `${surahId}:${n}`,
      url: ayahUrl(surahId, n, reciter),
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

/** Play a single ayah then stop. */
export async function playSingleAyah(
  surahId: number,
  ayahN: number,
  reciter: string,
): Promise<void> {
  const surah = SURAHS.find((s) => s.id === surahId);
  if (!surah) return;
  const reciterInfo = getReciterById(reciter);

  await TrackPlayer.reset();
  await TrackPlayer.add([
    {
      id: `${surahId}:${ayahN}`,
      url: ayahUrl(surahId, ayahN, reciter),
      title: `${surah.nameEnglish} · Ayah ${ayahN}`,
      artist: reciterInfo.name,
      album: surah.nameEnglish,
    },
  ]);
  await TrackPlayer.setRepeatMode(RepeatMode.Off);
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
