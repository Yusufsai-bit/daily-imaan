export interface FeelingEntry {
    key: string;
    label: string;
    subtitle: string;
    /**
     * Quranic verse(s) for this emotional state. Arabic is text_uthmani and
     * English is Saheeh International — both verified verbatim against the
     * Quran.com Foundation API on each build.
     */
    ayah: {
      arabic: string;
      english: string;
      reference: string;
    };
    /**
     * Sunnah-attested supplication. The `source` field cites the primary
     * hadith collection.
     */
    dua: {
      arabic: string;
      transliteration: string;
      english: string;
      source: string;
    };
  }

  /**
   * Curated emotion → ayah + dua map. The English ayah translation is
   * Saheeh International (verified against Quran.com), and the duas are
   * sunnah-attested with hadith citations. No AI-generated comfort or
   * commentary text is stored or shown to the user.
   */
  export const FEELINGS: FeelingEntry[] = [
    {
      key: "anxious",
      label: "I am feeling anxious",
      subtitle: "When the heart is restless",
      ayah: {
        arabic: "ٱلَّذِينَ ءَامَنُوا۟ وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ ٱللَّهِ ۗ أَلَا بِذِكْرِ ٱللَّهِ تَطْمَئِنُّ ٱلْقُلُوبُ",
        english: "Those who have believed and whose hearts are assured by the remembrance of Allāh. Unquestionably, by the remembrance of Allāh hearts are assured.",
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
    },
  {
      key: "sad",
      label: "I am feeling sad",
      subtitle: "When the heart is heavy",
      ayah: {
        arabic: "فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا إِنَّ مَعَ ٱلْعُسْرِ يُسْرًا",
        english: "For indeed, with hardship [will be] ease [i.e., relief]. Indeed, with hardship [will be] ease.",
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
    },
  {
      key: "grateful",
      label: "I am feeling grateful",
      subtitle: "When you wish to thank Allah",
      ayah: {
        arabic: "وَإِذْ تَأَذَّنَ رَبُّكُمْ لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ ۖ وَلَئِن كَفَرْتُمْ إِنَّ عَذَابِى لَشَدِيدٌ",
        english: "And [remember] when your Lord proclaimed, 'If you are grateful, I will surely increase you [in favor]; but if you deny, indeed, My punishment is severe.'",
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
    },
  {
      key: "regretful",
      label: "I am carrying regret",
      subtitle: "When you have slipped and feel far",
      ayah: {
        arabic: "۞ قُلْ يَـٰعِبَادِىَ ٱلَّذِينَ أَسْرَفُوا۟ عَلَىٰٓ أَنفُسِهِمْ لَا تَقْنَطُوا۟ مِن رَّحْمَةِ ٱللَّهِ ۚ إِنَّ ٱللَّهَ يَغْفِرُ ٱلذُّنُوبَ جَمِيعًا ۚ إِنَّهُۥ هُوَ ٱلْغَفُورُ ٱلرَّحِيمُ",
        english: "Say, \"O My servants who have transgressed against themselves [by sinning], do not despair of the mercy of Allāh. Indeed, Allāh forgives all sins. Indeed, it is He who is the Forgiving, the Merciful.\"",
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
    },
  {
      key: "tested",
      label: "I am being tested",
      subtitle: "When the trial feels too much",
      ayah: {
        arabic: "لَا يُكَلِّفُ ٱللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا ٱكْتَسَبَتْ ۗ رَبَّنَا لَا تُؤَاخِذْنَآ إِن نَّسِينَآ أَوْ أَخْطَأْنَا ۚ رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَآ إِصْرًا كَمَا حَمَلْتَهُۥ عَلَى ٱلَّذِينَ مِن قَبْلِنَا ۚ رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِۦ ۖ وَٱعْفُ عَنَّا وَٱغْفِرْ لَنَا وَٱرْحَمْنَآ ۚ أَنتَ مَوْلَىٰنَا فَٱنصُرْنَا عَلَى ٱلْقَوْمِ ٱلْكَـٰفِرِينَ",
        english: "Allāh does not charge a soul except [with that within] its capacity. It will have [the consequence of] what [good] it has gained, and it will bear [the consequence of] what [evil] it has earned. \"Our Lord, do not impose blame upon us if we have forgotten or erred. Our Lord, and lay not upon us a burden like that which You laid upon those before us. Our Lord, and burden us not with that which we have no ability to bear. And pardon us; and forgive us; and have mercy upon us. You are our protector, so give us victory over the disbelieving people.\"",
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
    },
  {
      key: "lost",
      label: "I need guidance",
      subtitle: "When the path is unclear",
      ayah: {
        arabic: "ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ",
        english: "Guide us to the straight path -",
        reference: "Surah Al-Fatihah 1:6",
      },
      dua: {
      arabic: "اللَّهُمَّ اهْدِنِي وَسَدِّدْنِي",
      transliteration: "Allahumma ihdini wa saddidni",
      english:
        "O Allah, guide me and make me steadfast.",
      source: "Sahih Muslim 2725 — narrated by 'Ali ibn Abi Talib (رضي الله عنه)",
    },
    },
  {
      key: "weak",
      label: "My imaan feels low",
      subtitle: "When faith feels distant",
      ayah: {
        arabic: "إِنَّمَا ٱلْمُؤْمِنُونَ ٱلَّذِينَ إِذَا ذُكِرَ ٱللَّهُ وَجِلَتْ قُلُوبُهُمْ وَإِذَا تُلِيَتْ عَلَيْهِمْ ءَايَـٰتُهُۥ زَادَتْهُمْ إِيمَـٰنًا وَعَلَىٰ رَبِّهِمْ يَتَوَكَّلُونَ",
        english: "The believers are only those who, when Allāh is mentioned, their hearts become fearful, and when His verses are recited to them, it increases them in faith; and upon their Lord they rely -",
        reference: "Surah Al-Anfal 8:2",
      },
      dua: {
      arabic: "يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ",
      transliteration: "Ya muqallibal-qulub, thabbit qalbi 'ala dinik",
      english:
        "O Turner of hearts, keep my heart firm upon Your religion.",
      source: "Tirmidhi (the Prophet ﷺ said this often)",
    },
    },
  {
      key: "alone",
      label: "I feel alone",
      subtitle: "When you need to feel His nearness",
      ayah: {
        arabic: "وَلَقَدْ خَلَقْنَا ٱلْإِنسَـٰنَ وَنَعْلَمُ مَا تُوَسْوِسُ بِهِۦ نَفْسُهُۥ ۖ وَنَحْنُ أَقْرَبُ إِلَيْهِ مِنْ حَبْلِ ٱلْوَرِيدِ",
        english: "And We have already created man and know what his soul whispers to him, and We are closer to him than [his] jugular vein.",
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
    },
];
  