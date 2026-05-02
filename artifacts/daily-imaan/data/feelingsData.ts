export interface FeelingEntry {
  key: string;
  label: string;
  subtitle: string;
  ayah: {
    arabic: string;
    english: string;
    reference: string;
  };
  dua: {
    arabic: string;
    transliteration: string;
    english: string;
    source: string;
  };
  reminder: string;
}

export const FEELINGS: FeelingEntry[] = [
  {
    key: "anxious",
    label: "I am feeling anxious",
    subtitle: "When the heart is restless",
    ayah: {
      arabic:
        "ٱلَّذِينَ ءَامَنُوا۟ وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ ٱللَّهِ ۗ أَلَا بِذِكْرِ ٱللَّهِ تَطْمَئِنُّ ٱلْقُلُوبُ",
      english:
        "Those who believe and whose hearts find rest in the remembrance of Allah — truly, in the remembrance of Allah do hearts find rest.",
      reference: "Surah Ar-Ra'd 13:28",
    },
    dua: {
      arabic:
        "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ",
      transliteration:
        "Allahumma inni a'udhu bika minal-hammi wal-hazan, wa a'udhu bika minal-'ajzi wal-kasal",
      english:
        "O Allah, I seek refuge in You from worry and grief, and I seek refuge in You from helplessness and laziness.",
      source: "Bukhari (from Anas ibn Malik رضي الله عنه)",
    },
    reminder: "Allah ﷻ knows what your heart is carrying.",
  },
  {
    key: "sad",
    label: "I am feeling sad",
    subtitle: "When the heart is heavy",
    ayah: {
      arabic: "فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ ٱلْعُسْرِ يُسْرًا",
      english:
        "For indeed, with hardship comes ease. Indeed, with hardship comes ease.",
      reference: "Surah Ash-Sharh 94:5-6",
    },
    dua: {
      arabic:
        "اللَّهُمَّ رَحْمَتَكَ أَرْجُو، فَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ، وَأَصْلِحْ لِي شَأْنِي كُلَّهُ",
      transliteration:
        "Allahumma rahmataka arju, fala takilni ila nafsi tarfata 'ayn, wa aslih li sha'ni kullah",
      english:
        "O Allah, I hope for Your mercy, so do not leave me to myself even for the blink of an eye, and rectify all my affairs.",
      source: "Abu Dawud",
    },
    reminder: "This too shall pass — by His mercy.",
  },
  {
    key: "grateful",
    label: "I am feeling grateful",
    subtitle: "When you wish to thank Allah",
    ayah: {
      arabic: "وَإِذْ تَأَذَّنَ رَبُّكُمْ لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ",
      english:
        "And remember when your Lord proclaimed: 'If you are grateful, I will surely increase you [in favor].'",
      reference: "Surah Ibrahim 14:7",
    },
    dua: {
      arabic: "اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ",
      transliteration:
        "Allahumma a'inni 'ala dhikrika wa shukrika wa husni 'ibadatik",
      english:
        "O Allah, help me to remember You, to thank You, and to worship You in the best manner.",
      source: "Abu Dawud (from Mu'adh ibn Jabal رضي الله عنه)",
    },
    reminder: "Alhamdulillah — every breath is from Him.",
  },
  {
    key: "regretful",
    label: "I am carrying regret",
    subtitle: "When you have slipped and feel far",
    ayah: {
      arabic:
        "قُلْ يَٰعِبَادِىَ ٱلَّذِينَ أَسْرَفُوا۟ عَلَىٰٓ أَنفُسِهِمْ لَا تَقْنَطُوا۟ مِن رَّحْمَةِ ٱللَّهِ ۚ إِنَّ ٱللَّهَ يَغْفِرُ ٱلذُّنُوبَ جَمِيعًا",
      english:
        "Say: O My servants who have transgressed against themselves — do not despair of the mercy of Allah. Indeed, Allah forgives all sins.",
      reference: "Surah Az-Zumar 39:53",
    },
    dua: {
      arabic:
        "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي، فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
      transliteration:
        "Allahumma anta Rabbi la ilaha illa ant, khalaqtani wa ana 'abduk, abu'u laka bini'matika 'alayya, wa abu'u bidhanbi, faghfir li fa-innahu la yaghfirudh-dhunuba illa ant",
      english:
        "O Allah, You are my Lord, none has the right to be worshipped except You. You created me and I am Your servant. I acknowledge Your favor upon me and I acknowledge my sin, so forgive me — for none forgives sins except You.",
      source: "Sayyid al-Istighfar — Bukhari",
    },
    reminder: "His door never closes. Walk back gently.",
  },
  {
    key: "tested",
    label: "I am being tested",
    subtitle: "When the trial feels too much",
    ayah: {
      arabic: "لَا يُكَلِّفُ ٱللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
      english:
        "Allah does not burden a soul beyond that it can bear.",
      reference: "Surah Al-Baqarah 2:286",
    },
    dua: {
      arabic:
        "لَا إِلَٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ",
      transliteration:
        "La ilaha illa anta subhanaka inni kuntu minaz-zalimin",
      english:
        "There is no deity except You; glory be to You. Indeed, I have been of the wrongdoers.",
      source: "Du'a of Yunus عليه السلام — Quran 21:87",
    },
    reminder: "He chose this for you, knowing you can carry it.",
  },
  {
    key: "lost",
    label: "I need guidance",
    subtitle: "When the path is unclear",
    ayah: {
      arabic: "ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ",
      english: "Guide us to the straight path.",
      reference: "Surah Al-Fatihah 1:6",
    },
    dua: {
      arabic:
        "اللَّهُمَّ أَرِنَا الْحَقَّ حَقًّا وَارْزُقْنَا اتِّبَاعَهُ، وَأَرِنَا الْبَاطِلَ بَاطِلًا وَارْزُقْنَا اجْتِنَابَهُ",
      transliteration:
        "Allahumma arinal-haqqa haqqan warzuqnat-tiba'ah, wa arinal-batila batilan warzuqnaj-tinabah",
      english:
        "O Allah, show us the truth as truth and grant us its following, and show us falsehood as falsehood and grant us its avoidance.",
      source: "A well-known supplication of the righteous",
    },
    reminder: "Ask Him — He guides whom He wills.",
  },
  {
    key: "weak",
    label: "My imaan feels low",
    subtitle: "When faith feels distant",
    ayah: {
      arabic:
        "إِنَّمَا ٱلْمُؤْمِنُونَ ٱلَّذِينَ إِذَا ذُكِرَ ٱللَّهُ وَجِلَتْ قُلُوبُهُمْ وَإِذَا تُلِيَتْ عَلَيْهِمْ ءَايَٰتُهُۥ زَادَتْهُمْ إِيمَٰنًا",
      english:
        "The believers are only those whose hearts tremble when Allah is mentioned, and when His verses are recited, their faith increases.",
      reference: "Surah Al-Anfal 8:2",
    },
    dua: {
      arabic: "يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ",
      transliteration: "Ya muqallibal-qulub, thabbit qalbi 'ala dinik",
      english:
        "O Turner of hearts, keep my heart firm upon Your religion.",
      source: "Tirmidhi (the Prophet ﷺ said this often)",
    },
    reminder: "One sincere step toward Him is enough to begin.",
  },
  {
    key: "alone",
    label: "I feel alone",
    subtitle: "When you need to feel His nearness",
    ayah: {
      arabic: "وَنَحْنُ أَقْرَبُ إِلَيْهِ مِنْ حَبْلِ ٱلْوَرِيدِ",
      english:
        "And We are closer to him than his jugular vein.",
      reference: "Surah Qaf 50:16",
    },
    dua: {
      arabic:
        "حَسْبِيَ اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ، عَلَيْهِ تَوَكَّلْتُ، وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ",
      transliteration:
        "Hasbiyallahu la ilaha illa huwa, 'alayhi tawakkaltu, wa huwa Rabbul-'arshil-'azim",
      english:
        "Allah is sufficient for me. None has the right to be worshipped except Him. Upon Him I rely, and He is the Lord of the Magnificent Throne.",
      source: "Abu Dawud — Quran 9:129",
    },
    reminder: "You are never alone — He is closer than your own breath.",
  },
];
