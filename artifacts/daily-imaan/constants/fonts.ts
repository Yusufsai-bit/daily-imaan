// Amiri Quran — a specialised variant of Khaled Hosny's Amiri family, designed
// specifically for Mushaf-style Quranic typography. Renders Uthmani markings
// (small alif, madd, waqf signs) in proper Quranic style rather than the
// generic naskh forms used by Noto Naskh Arabic. Used for every Arabic block
// in the app: Quran ayat, hadith Arabic, du'a Arabic, dhikr, asma ul husna.
// Amiri Quran ships as Regular only — no bold variant exists, and Quranic
// text shouldn't be bolded anyway. Bold UI Arabic (none in the app today)
// would fall back to the system Arabic bold face.
export const ARABIC_FONT_REGULAR = "AmiriQuran_400Regular";
