export interface MoodAyah {
  arabic: string;
  english: string;
  surahRef: string;
}

export interface MoodDua {
  arabic: string;
  transliteration: string;
  english: string;
  source: string;
}

export interface Mood {
  id: string;
  emoji: string;
  label: string;
  color: string;
  darkColor: string;
  textColor: string;
  ayah: MoodAyah;
  dua: MoodDua;
  comfort: string;
}

export const MOODS: Mood[] = [
  {
    id: "stressed",
    emoji: "😓",
    label: "Feeling stressed",
    color: "#FFF0ED",
    darkColor: "#3A1A15",
    textColor: "#C0392B",
    ayah: {
      arabic:
        "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
      english:
        "Verily, in the remembrance of Allah do hearts find rest.",
      surahRef: "Ar-Ra'd 13:28",
    },
    dua: {
      arabic:
        "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ",
      transliteration:
        "Allahumma inni a'udhu bika minal-hammi wal-hazan",
      english:
        "O Allah, I seek refuge in You from worry and grief.",
      source: "Bukhari",
    },
    comfort:
      "Stress is a sign you care deeply. Turn to Allah — He is the One who stills every storm.",
  },
  {
    id: "grateful",
    emoji: "🙏",
    label: "Feeling grateful",
    color: "#F0FFF4",
    darkColor: "#0D2B1A",
    textColor: "#1A6B4A",
    ayah: {
      arabic:
        "لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ",
      english:
        "If you are grateful, I will surely increase you in favour.",
      surahRef: "Ibrahim 14:7",
    },
    dua: {
      arabic:
        "اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ",
      transliteration:
        "Allahumma a'inni 'ala dhikrika wa shukrika wa husni 'ibadatik",
      english:
        "O Allah, help me to remember You, to be grateful to You, and to worship You in an excellent manner.",
      source: "Abu Dawud",
    },
    comfort:
      "Gratitude is the highest form of worship. Your thankful heart is already beloved to Allah.",
  },
  {
    id: "motivation",
    emoji: "💪",
    label: "Need motivation",
    color: "#FFF8E7",
    darkColor: "#2E2000",
    textColor: "#C8933C",
    ayah: {
      arabic:
        "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
      english:
        "Verily, with every hardship comes ease.",
      surahRef: "Ash-Sharh 94:6",
    },
    dua: {
      arabic:
        "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي",
      transliteration:
        "Rabbish rahli sadri wa yassir li amri",
      english:
        "My Lord, expand for me my chest and ease for me my task.",
      source: "Quran 20:25–26",
    },
    comfort:
      "Every prophet faced hardship. The struggle you feel today is shaping the person you are becoming.",
  },
  {
    id: "sad",
    emoji: "😢",
    label: "Feeling sad",
    color: "#EFF6FF",
    darkColor: "#0E1E33",
    textColor: "#2563EB",
    ayah: {
      arabic:
        "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
      english:
        "For indeed, with hardship will be ease.",
      surahRef: "Ash-Sharh 94:5",
    },
    dua: {
      arabic:
        "لَا إِلَهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ",
      transliteration:
        "La ilaha illa anta subhanaka inni kuntu minadh-dhalimin",
      english:
        "There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.",
      source: "Quran 21:87 — Dua of Yunus (AS)",
    },
    comfort:
      "Even prophets wept. Sadness is not weakness — it is the heart longing for something greater.",
  },
  {
    id: "anxious",
    emoji: "😰",
    label: "Feeling anxious",
    color: "#F5F0FF",
    darkColor: "#1A0D2E",
    textColor: "#7C3AED",
    ayah: {
      arabic:
        "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
      english:
        "Allah is sufficient for us, and He is the best Disposer of affairs.",
      surahRef: "Aal-Imran 3:173",
    },
    dua: {
      arabic:
        "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ",
      transliteration:
        "Allahumma inni as'alukal-'afiyata fid-dunya wal-akhirah",
      english:
        "O Allah, I ask You for well-being in this world and the Hereafter.",
      source: "Ibn Majah",
    },
    comfort:
      "Anxiety comes from carrying tomorrow's burdens today. Hand them to Allah — He already knows the outcome.",
  },
  {
    id: "hopeful",
    emoji: "✨",
    label: "Feeling hopeful",
    color: "#FFFBEB",
    darkColor: "#201A00",
    textColor: "#B45309",
    ayah: {
      arabic:
        "وَلَا تَيْأَسُوا مِن رَّوْحِ اللَّهِ ۖ إِنَّهُ لَا يَيْأَسُ مِن رَّوْحِ اللَّهِ إِلَّا الْقَوْمُ الْكَافِرُونَ",
      english:
        "Do not despair of the mercy of Allah. Indeed, no one despairs of the mercy of Allah except the disbelieving people.",
      surahRef: "Yusuf 12:87",
    },
    dua: {
      arabic:
        "اللَّهُمَّ إِنِّي أَسْأَلُكَ حُسْنَ الْخَاتِمَةِ",
      transliteration:
        "Allahumma inni as'aluka husnal-khatimah",
      english:
        "O Allah, I ask You for a good end.",
      source: "Tabarani",
    },
    comfort:
      "Hope is a gift from Allah. When you feel it, nurture it — it is the seed of every good thing to come.",
  },
];
