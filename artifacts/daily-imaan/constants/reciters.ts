/**
 * Curated reciter catalogue. All audio is streamed from alquran.cloud
 * (https://cdn.alquran.cloud/media/audio/ayah/<edition>/<globalAyahId>) and
 * the edition codes here are exactly the ones that endpoint expects.
 *
 * The selection is deliberately small (six reciters) and spans the most
 * widely respected styles — slow tarteel for learners, classical mujawwad,
 * and modern murattal — without taking sectarian positions.
 */

export interface Reciter {
  id: string;
  name: string;
  country: string;
  style: string;
}

export const RECITERS: Reciter[] = [
  {
    id: "ar.alafasy",
    name: "Mishary Rashid Al-Afasy",
    country: "Kuwait",
    style: "Clear and modern — recommended for first-time listeners",
  },
  {
    id: "ar.husary",
    name: "Mahmoud Khalil Al-Husary",
    country: "Egypt",
    style: "Classical, slow tarteel — excellent for learning tajweed",
  },
  {
    id: "ar.minshawi",
    name: "Mohamed Siddiq Al-Minshawi",
    country: "Egypt",
    style: "Warm, melodious mujawwad recitation",
  },
  {
    id: "ar.sudais",
    name: "Abdul Rahman Al-Sudais",
    country: "Saudi Arabia",
    style: "Imam of the Sacred Mosque, Makkah",
  },
  {
    id: "ar.shaatree",
    name: "Abu Bakr Al-Shatri",
    country: "Saudi Arabia",
    style: "Calm, even-paced recitation",
  },
  {
    id: "ar.ghamdi",
    name: "Saad Al-Ghamdi",
    country: "Saudi Arabia",
    style: "Soft and reflective",
  },
];

export const DEFAULT_RECITER_ID = "ar.alafasy";

export function getReciterById(id: string): Reciter {
  return RECITERS.find((r) => r.id === id) ?? RECITERS[0]!;
}
