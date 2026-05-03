/**
 * Curated daily hadith. Every entry is from one of the six major Sunni
 * collections (Bukhari, Muslim, Abu Dawud, Tirmidhi, Nasa'i, Ibn Majah)
 * or Muwatta Malik. Arabic text and English translations are taken
 * verbatim from sunnah.com (which serves established scholarly editions:
 * USC-MSA / Mohsin Khan / Abdul Hamid Siddiqui depending on the book).
 *
 * STRICT RULE: zero AI commentary. We store only the matn (text), the
 * collection citation, the grading, and a deep-link to sunnah.com so the
 * user can read the full chain and footnotes. We never paraphrase or
 * "explain" the hadith in our own words.
 */
export interface DailyHadith {
  id: number;
  /** Arabic matn (text of the hadith only — chain of narrators omitted). */
  arabicText: string;
  /** English translation, verbatim from sunnah.com. */
  englishText: string;
  /** Narrator name as cited by the collection (e.g. "Abu Hurairah"). */
  narrator: string;
  /** Collection name as English text (e.g. "Sahih al-Bukhari"). */
  collection: string;
  /** Hadith reference, e.g. "1" for the Book/Hadith number used by sunnah.com. */
  reference: string;
  /** Grading as published by the collection. All entries are sahih. */
  grade: "Sahih";
  /** Deep link to the hadith on sunnah.com. */
  sourceUrl: string;
}

export const DAILY_HADITH: DailyHadith[] = [
  {
    id: 1,
    arabicText:
      "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",
    englishText:
      "The reward of deeds depends upon the intentions and every person will get the reward according to what he has intended.",
    narrator: "Umar ibn al-Khattab",
    collection: "Sahih al-Bukhari",
    reference: "1",
    grade: "Sahih",
    sourceUrl: "https://sunnah.com/bukhari:1",
  },
  {
    id: 2,
    arabicText:
      "لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
    englishText:
      "None of you will have faith till he wishes for his (Muslim) brother what he likes for himself.",
    narrator: "Anas ibn Malik",
    collection: "Sahih al-Bukhari",
    reference: "13",
    grade: "Sahih",
    sourceUrl: "https://sunnah.com/bukhari:13",
  },
  {
    id: 3,
    arabicText:
      "الرَّاحِمُونَ يَرْحَمُهُمُ الرَّحْمَنُ، ارْحَمُوا مَنْ فِي الأَرْضِ يَرْحَمْكُمْ مَنْ فِي السَّمَاءِ",
    englishText:
      "The merciful are shown mercy by the All-Merciful. Show mercy to those on earth, and the One above the heavens will show mercy to you.",
    narrator: "Abdullah ibn Amr",
    collection: "Jami` at-Tirmidhi",
    reference: "1924",
    grade: "Sahih",
    sourceUrl: "https://sunnah.com/tirmidhi:1924",
  },
  {
    id: 4,
    arabicText:
      "لَيْسَ الشَّدِيدُ بِالصُّرَعَةِ، إِنَّمَا الشَّدِيدُ الَّذِي يَمْلِكُ نَفْسَهُ عِنْدَ الْغَضَبِ",
    englishText:
      "The strong man is not the one who can wrestle (others) down. The strong man is only the one who can control himself when he is angry.",
    narrator: "Abu Hurairah",
    collection: "Sahih al-Bukhari",
    reference: "6114",
    grade: "Sahih",
    sourceUrl: "https://sunnah.com/bukhari:6114",
  },
  {
    id: 5,
    arabicText:
      "خَيْرُكُمْ خَيْرُكُمْ لأَهْلِهِ وَأَنَا خَيْرُكُمْ لأَهْلِي",
    englishText:
      "The best of you is the one who is best to his family, and I am the best of you to my family.",
    narrator: "Aisha",
    collection: "Jami` at-Tirmidhi",
    reference: "3895",
    grade: "Sahih",
    sourceUrl: "https://sunnah.com/tirmidhi:3895",
  },
  {
    id: 6,
    arabicText:
      "إِنَّ اللَّهَ رَفِيقٌ يُحِبُّ الرِّفْقَ، وَيُعْطِي عَلَى الرِّفْقِ مَا لاَ يُعْطِي عَلَى الْعُنْفِ",
    englishText:
      "Verily, Allah is gentle and He loves gentleness, and He rewards for gentleness what He does not reward for harshness.",
    narrator: "Aisha",
    collection: "Sahih Muslim",
    reference: "2593",
    grade: "Sahih",
    sourceUrl: "https://sunnah.com/muslim:2593a",
  },
  {
    id: 7,
    arabicText:
      "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ",
    englishText:
      "Whoever believes in Allah and the Last Day, let him speak good or remain silent.",
    narrator: "Abu Hurairah",
    collection: "Sahih al-Bukhari",
    reference: "6018",
    grade: "Sahih",
    sourceUrl: "https://sunnah.com/bukhari:6018",
  },
  {
    id: 8,
    arabicText:
      "أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ",
    englishText:
      "The most beloved of deeds to Allah are those that are most consistent, even if they are small.",
    narrator: "Aisha",
    collection: "Sahih al-Bukhari",
    reference: "6464",
    grade: "Sahih",
    sourceUrl: "https://sunnah.com/bukhari:6464",
  },
  {
    id: 9,
    arabicText:
      "إِنَّ اللَّهَ لاَ يَنْظُرُ إِلَى أَجْسَادِكُمْ وَلاَ إِلَى صُوَرِكُمْ وَلَكِنْ يَنْظُرُ إِلَى قُلُوبِكُمْ",
    englishText:
      "Verily Allah does not look at your bodies nor at your faces, but He looks at your hearts.",
    narrator: "Abu Hurairah",
    collection: "Sahih Muslim",
    reference: "2564",
    grade: "Sahih",
    sourceUrl: "https://sunnah.com/muslim:2564c",
  },
  {
    id: 10,
    arabicText: "تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ",
    englishText: "Your smile to your brother is charity for you.",
    narrator: "Abu Dharr",
    collection: "Jami` at-Tirmidhi",
    reference: "1956",
    grade: "Sahih",
    sourceUrl: "https://sunnah.com/tirmidhi:1956",
  },
  {
    id: 11,
    arabicText:
      "قُلْ آمَنْتُ بِاللَّهِ ثُمَّ اسْتَقِمْ",
    englishText:
      "Say: 'I believe in Allah,' and then be steadfast.",
    narrator: "Sufyan ibn Abdullah",
    collection: "Sahih Muslim",
    reference: "38",
    grade: "Sahih",
    sourceUrl: "https://sunnah.com/muslim:38",
  },
  {
    id: 12,
    arabicText:
      "الْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ",
    englishText: "A good word is charity.",
    narrator: "Abu Hurairah",
    collection: "Sahih al-Bukhari",
    reference: "2989",
    grade: "Sahih",
    sourceUrl: "https://sunnah.com/bukhari:2989",
  },
  {
    id: 13,
    arabicText:
      "مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ",
    englishText:
      "Whoever travels a path in search of knowledge, Allah will make easy for him a path to Paradise.",
    narrator: "Abu Hurairah",
    collection: "Sahih Muslim",
    reference: "2699",
    grade: "Sahih",
    sourceUrl: "https://sunnah.com/muslim:2699a",
  },
  {
    id: 14,
    arabicText: "الدِّينُ النَّصِيحَةُ",
    englishText:
      "The religion is sincere good will.",
    narrator: "Tamim al-Dari",
    collection: "Sahih Muslim",
    reference: "55",
    grade: "Sahih",
    sourceUrl: "https://sunnah.com/muslim:55a",
  },
  {
    id: 15,
    arabicText:
      "مَنْ لاَ يَرْحَمِ النَّاسَ لاَ يَرْحَمْهُ اللَّهُ",
    englishText:
      "Allah will not show mercy to the one who does not show mercy to people.",
    narrator: "Jarir ibn Abdullah",
    collection: "Sahih al-Bukhari",
    reference: "7376",
    grade: "Sahih",
    sourceUrl: "https://sunnah.com/bukhari:7376",
  },
];

/**
 * Daily-rotation selector. Mirrors the pattern in featuredAyat.ts so the
 * hadith of the day stays stable across re-renders within a calendar day
 * and rotates at midnight local time. Uses a date-derived seed so the
 * sequence is deterministic per device but spread across the corpus.
 */
export function getTodayHadith(): DailyHadith {
  const today = new Date();
  const seed =
    today.getFullYear() * 10000 +
    (today.getMonth() + 1) * 100 +
    today.getDate();
  const index = seed % DAILY_HADITH.length;
  return DAILY_HADITH[index]!;
}
