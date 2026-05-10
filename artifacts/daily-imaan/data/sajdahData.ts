/**
 * Sajdah (prostration) verses of the Qur'an.
 *
 * The Sunnah identifies a set of verses upon hearing or reciting which a
 * Muslim performs sajdah at-tilāwah (prostration of recitation). The exact
 * count varies slightly between schools (most commonly 14 or 15). This
 * dataset uses the consensus set of 15 commonly recognised across Hanafi,
 * Shafi'i, Maliki, and Hanbali schools.
 *
 * The home Surah-detail screen surfaces a small "Sajdah" badge on each of
 * these ayahs so the reader knows to prostrate (and shows a brief reminder
 * tooltip on first encounter). No school-specific guidance is offered here
 * — users defer to their local scholar where opinions diverge (notably
 * 22:77 is included by Hanafis but not always by others).
 *
 * Format: "<surahId>:<ayahNumber>". Both numbers are 1-based.
 */

export const SAJDAH_VERSES: ReadonlySet<string> = new Set([
  "7:206",   // Al-A'raf
  "13:15",   // Ar-Ra'd
  "16:50",   // An-Nahl
  "17:109",  // Al-Isra
  "19:58",   // Maryam
  "22:18",   // Al-Hajj (first sajdah)
  "22:77",   // Al-Hajj (Hanafi school includes; others differ)
  "25:60",   // Al-Furqan
  "27:26",   // An-Naml
  "32:15",   // As-Sajdah
  "38:24",   // Sad
  "41:38",   // Fussilat
  "53:62",   // An-Najm
  "84:21",   // Al-Inshiqaq
  "96:19",   // Al-Alaq
]);

/**
 * O(1) check: is the given (surahId, ayahNumber) pair a sajdah verse?
 * Both arguments are 1-based as everywhere else in the app.
 */
export function isSajdahVerse(surahId: number, ayahNumber: number): boolean {
  return SAJDAH_VERSES.has(`${surahId}:${ayahNumber}`);
}
