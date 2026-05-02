export interface FeaturedAyah {
  id: number;
  surahId: number;
  surahNameEnglish: string;
  ayahNumber: number;
  /** Arabic text in the standard Uthmani script. */
  arabicText: string;
  /** English translation. Source is credited in the UI (Saheeh International). */
  englishText: string;
}

export const FEATURED_AYAT: FeaturedAyah[] = [
  {
    id: 1, surahId: 1, surahNameEnglish: "Al-Fatihah", ayahNumber: 1,
    arabicText: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    englishText: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
  },
  {
    id: 2, surahId: 1, surahNameEnglish: "Al-Fatihah", ayahNumber: 5,
    arabicText: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
    englishText: "It is You we worship and You we ask for help.",
  },
  {
    id: 3, surahId: 2, surahNameEnglish: "Al-Baqarah", ayahNumber: 45,
    arabicText: "وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ وَإِنَّهَا لَكَبِيرَةٌ إِلَّا عَلَى الْخَاشِعِينَ",
    englishText: "And seek help through patience and prayer. Indeed, it is difficult except for the humbly submissive.",
  },
  {
    id: 4, surahId: 2, surahNameEnglish: "Al-Baqarah", ayahNumber: 152,
    arabicText: "فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ",
    englishText: "So remember Me; I will remember you. And be grateful to Me and do not deny Me.",
  },
  {
    id: 5, surahId: 2, surahNameEnglish: "Al-Baqarah", ayahNumber: 155,
    arabicText: "وَلَنَبْلُوَنَّكُم بِشَيْءٍ مِّنَ الْخَوْفِ وَالْجُوعِ وَنَقْصٍ مِّنَ الْأَمْوَالِ وَالْأَنفُسِ وَالثَّمَرَاتِ ۗ وَبَشِّرِ الصَّابِرِينَ",
    englishText: "And We will surely test you with something of fear and hunger and a loss of wealth and lives and fruits, but give good tidings to the patient.",
  },
  {
    id: 6, surahId: 2, surahNameEnglish: "Al-Baqarah", ayahNumber: 186,
    arabicText: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ",
    englishText: "And when My servants ask you concerning Me — indeed I am near. I respond to the invocation of the supplicant when he calls upon Me.",
  },
  {
    id: 7, surahId: 2, surahNameEnglish: "Al-Baqarah", ayahNumber: 255,
    arabicText: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ",
    englishText: "Allah — there is no deity except Him, the Ever-Living, the Sustainer of existence. Neither drowsiness overtakes Him nor sleep.",
  },
  {
    id: 8, surahId: 2, surahNameEnglish: "Al-Baqarah", ayahNumber: 286,
    arabicText: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
    englishText: "Allah does not burden a soul beyond that it can bear.",
  },
  {
    id: 9, surahId: 3, surahNameEnglish: "Ali 'Imran", ayahNumber: 139,
    arabicText: "وَلَا تَهِنُوا وَلَا تَحْزَنُوا وَأَنتُمُ الْأَعْلَوْنَ إِن كُنتُم مُّؤْمِنِينَ",
    englishText: "So do not weaken and do not grieve, and you will be superior if you are believers.",
  },
  {
    id: 10, surahId: 3, surahNameEnglish: "Ali 'Imran", ayahNumber: 173,
    arabicText: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
    englishText: "Sufficient for us is Allah, and He is the best Disposer of affairs.",
  },
  {
    id: 11, surahId: 3, surahNameEnglish: "Ali 'Imran", ayahNumber: 185,
    arabicText: "كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ",
    englishText: "Every soul will taste death.",
  },
  {
    id: 12, surahId: 4, surahNameEnglish: "An-Nisa", ayahNumber: 103,
    arabicText: "إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا",
    englishText: "Indeed, prayer has been decreed upon the believers a decree of specified times.",
  },
  {
    id: 13, surahId: 6, surahNameEnglish: "Al-An'am", ayahNumber: 162,
    arabicText: "قُلْ إِنَّ صَلَاتِي وَنُسُكِي وَمَحْيَايَ وَمَمَاتِي لِلَّهِ رَبِّ الْعَالَمِينَ",
    englishText: "Say, 'Indeed, my prayer, my rites of sacrifice, my living and my dying are for Allah, Lord of the worlds.'",
  },
  {
    id: 14, surahId: 7, surahNameEnglish: "Al-A'raf", ayahNumber: 156,
    arabicText: "وَرَحْمَتِي وَسِعَتْ كُلَّ شَيْءٍ",
    englishText: "My mercy encompasses all things.",
  },
  {
    id: 15, surahId: 8, surahNameEnglish: "Al-Anfal", ayahNumber: 2,
    arabicText: "إِنَّمَا الْمُؤْمِنُونَ الَّذِينَ إِذَا ذُكِرَ اللَّهُ وَجِلَتْ قُلُوبُهُمْ",
    englishText: "The believers are only those who, when Allah is mentioned, their hearts become fearful.",
  },
  {
    id: 16, surahId: 9, surahNameEnglish: "At-Tawbah", ayahNumber: 40,
    arabicText: "لَا تَحْزَنْ إِنَّ اللَّهَ مَعَنَا",
    englishText: "Do not grieve; indeed Allah is with us.",
  },
  {
    id: 17, surahId: 10, surahNameEnglish: "Yunus", ayahNumber: 62,
    arabicText: "أَلَا إِنَّ أَوْلِيَاءَ اللَّهِ لَا خَوْفٌ عَلَيْهِمْ وَلَا هُمْ يَحْزَنُونَ",
    englishText: "Unquestionably, the allies of Allah — there will be no fear concerning them, nor will they grieve.",
  },
  {
    id: 18, surahId: 11, surahNameEnglish: "Hud", ayahNumber: 88,
    arabicText: "وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ",
    englishText: "And my success is not but through Allah.",
  },
  {
    id: 19, surahId: 12, surahNameEnglish: "Yusuf", ayahNumber: 87,
    arabicText: "وَلَا تَيْأَسُوا مِن رَّوْحِ اللَّهِ ۖ إِنَّهُ لَا يَيْأَسُ مِن رَّوْحِ اللَّهِ إِلَّا الْقَوْمُ الْكَافِرُونَ",
    englishText: "Do not despair of relief from Allah. Indeed, no one despairs of relief from Allah except the disbelieving people.",
  },
  {
    id: 20, surahId: 13, surahNameEnglish: "Ar-Ra'd", ayahNumber: 11,
    arabicText: "إِنَّ اللَّهَ لَا يُغَيِّرُ مَا بِقَوْمٍ حَتَّىٰ يُغَيِّرُوا مَا بِأَنفُسِهِمْ",
    englishText: "Indeed, Allah will not change the condition of a people until they change what is in themselves.",
  },
  {
    id: 21, surahId: 13, surahNameEnglish: "Ar-Ra'd", ayahNumber: 28,
    arabicText: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
    englishText: "Unquestionably, by the remembrance of Allah hearts are assured.",
  },
  {
    id: 22, surahId: 14, surahNameEnglish: "Ibrahim", ayahNumber: 7,
    arabicText: "لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ",
    englishText: "If you are grateful, I will surely increase you.",
  },
  {
    id: 23, surahId: 15, surahNameEnglish: "Al-Hijr", ayahNumber: 9,
    arabicText: "إِنَّا نَحْنُ نَزَّلْنَا الذِّكْرَ وَإِنَّا لَهُ لَحَافِظُونَ",
    englishText: "Indeed, it is We who sent down the Qur'an and indeed, We will be its guardian.",
  },
  {
    id: 24, surahId: 16, surahNameEnglish: "An-Nahl", ayahNumber: 90,
    arabicText: "إِنَّ اللَّهَ يَأْمُرُ بِالْعَدْلِ وَالْإِحْسَانِ وَإِيتَاءِ ذِي الْقُرْبَىٰ",
    englishText: "Indeed, Allah orders justice and good conduct and giving to relatives.",
  },
  {
    id: 25, surahId: 17, surahNameEnglish: "Al-Isra", ayahNumber: 23,
    arabicText: "وَقَضَىٰ رَبُّكَ أَلَّا تَعْبُدُوا إِلَّا إِيَّاهُ وَبِالْوَالِدَيْنِ إِحْسَانًا",
    englishText: "Your Lord has decreed that you worship none but Him, and that you be kind to parents.",
  },
  {
    id: 26, surahId: 17, surahNameEnglish: "Al-Isra", ayahNumber: 79,
    arabicText: "وَمِنَ اللَّيْلِ فَتَهَجَّدْ بِهِ نَافِلَةً لَّكَ عَسَىٰ أَن يَبْعَثَكَ رَبُّكَ مَقَامًا مَّحْمُودًا",
    englishText: "And from part of the night, pray with it as additional worship for you; perhaps your Lord will resurrect you to a praised station.",
  },
  {
    id: 27, surahId: 18, surahNameEnglish: "Al-Kahf", ayahNumber: 10,
    arabicText: "رَبَّنَا آتِنَا مِن لَّدُنكَ رَحْمَةً وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًا",
    englishText: "Our Lord, grant us from Yourself mercy and prepare for us from our affair right guidance.",
  },
  {
    id: 28, surahId: 18, surahNameEnglish: "Al-Kahf", ayahNumber: 46,
    arabicText: "الْمَالُ وَالْبَنُونَ زِينَةُ الْحَيَاةِ الدُّنْيَا ۖ وَالْبَاقِيَاتُ الصَّالِحَاتُ خَيْرٌ عِندَ رَبِّكَ",
    englishText: "Wealth and children are adornment of worldly life. But the enduring good deeds are better to your Lord for reward.",
  },
  {
    id: 29, surahId: 19, surahNameEnglish: "Maryam", ayahNumber: 96,
    arabicText: "إِنَّ الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ سَيَجْعَلُ لَهُمُ الرَّحْمَٰنُ وُدًّا",
    englishText: "Indeed, those who have believed and done righteous deeds — the Most Merciful will appoint for them affection.",
  },
  {
    id: 30, surahId: 20, surahNameEnglish: "Ta-Ha", ayahNumber: 114,
    arabicText: "وَقُل رَّبِّ زِدْنِي عِلْمًا",
    englishText: "And say, 'My Lord, increase me in knowledge.'",
  },
  {
    id: 31, surahId: 21, surahNameEnglish: "Al-Anbiya", ayahNumber: 87,
    arabicText: "لَّا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ",
    englishText: "There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.",
  },
  {
    id: 32, surahId: 22, surahNameEnglish: "Al-Hajj", ayahNumber: 46,
    arabicText: "فَإِنَّهَا لَا تَعْمَى الْأَبْصَارُ وَلَٰكِن تَعْمَى الْقُلُوبُ الَّتِي فِي الصُّدُورِ",
    englishText: "For indeed, it is not eyes that are blinded, but blinded are the hearts which are within the breasts.",
  },
  {
    id: 33, surahId: 23, surahNameEnglish: "Al-Mu'minun", ayahNumber: 1,
    arabicText: "قَدْ أَفْلَحَ الْمُؤْمِنُونَ",
    englishText: "Certainly will the believers have succeeded.",
  },
  {
    id: 34, surahId: 24, surahNameEnglish: "An-Nur", ayahNumber: 35,
    arabicText: "اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ",
    englishText: "Allah is the Light of the heavens and the earth.",
  },
  {
    id: 35, surahId: 25, surahNameEnglish: "Al-Furqan", ayahNumber: 63,
    arabicText: "وَعِبَادُ الرَّحْمَٰنِ الَّذِينَ يَمْشُونَ عَلَى الْأَرْضِ هَوْنًا",
    englishText: "And the servants of the Most Merciful are those who walk upon the earth easily.",
  },
  {
    id: 36, surahId: 28, surahNameEnglish: "Al-Qasas", ayahNumber: 24,
    arabicText: "رَبِّ إِنِّي لِمَا أَنزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ",
    englishText: "My Lord, indeed I am, for whatever good You would send down to me, in need.",
  },
  {
    id: 37, surahId: 29, surahNameEnglish: "Al-Ankabut", ayahNumber: 2,
    arabicText: "أَحَسِبَ النَّاسُ أَن يُتْرَكُوا أَن يَقُولُوا آمَنَّا وَهُمْ لَا يُفْتَنُونَ",
    englishText: "Do the people think that they will be left to say, 'We believe' and they will not be tried?",
  },
  {
    id: 38, surahId: 30, surahNameEnglish: "Ar-Rum", ayahNumber: 21,
    arabicText: "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا",
    englishText: "And of His signs is that He created for you from yourselves mates that you may find tranquility in them.",
  },
  {
    id: 39, surahId: 33, surahNameEnglish: "Al-Ahzab", ayahNumber: 41,
    arabicText: "يَا أَيُّهَا الَّذِينَ آمَنُوا اذْكُرُوا اللَّهَ ذِكْرًا كَثِيرًا",
    englishText: "O you who have believed, remember Allah with much remembrance.",
  },
  {
    id: 40, surahId: 36, surahNameEnglish: "Ya-Sin", ayahNumber: 82,
    arabicText: "إِنَّمَا أَمْرُهُ إِذَا أَرَادَ شَيْئًا أَن يَقُولَ لَهُ كُن فَيَكُونُ",
    englishText: "His command is only when He intends a thing that He says to it, 'Be,' and it is.",
  },
  {
    id: 41, surahId: 39, surahNameEnglish: "Az-Zumar", ayahNumber: 53,
    arabicText: "قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ",
    englishText: "Say, 'O My servants who have transgressed against themselves, do not despair of the mercy of Allah.'",
  },
  {
    id: 42, surahId: 40, surahNameEnglish: "Ghafir", ayahNumber: 60,
    arabicText: "وَقَالَ رَبُّكُمُ ادْعُونِي أَسْتَجِبْ لَكُمْ",
    englishText: "And your Lord says, 'Call upon Me; I will respond to you.'",
  },
  {
    id: 43, surahId: 42, surahNameEnglish: "Ash-Shuraa", ayahNumber: 30,
    arabicText: "وَمَا أَصَابَكُم مِّن مُّصِيبَةٍ فَبِمَا كَسَبَتْ أَيْدِيكُمْ وَيَعْفُو عَن كَثِيرٍ",
    englishText: "And whatever strikes you of disaster — it is for what your hands have earned; but He pardons much.",
  },
  {
    id: 44, surahId: 47, surahNameEnglish: "Muhammad", ayahNumber: 7,
    arabicText: "يَا أَيُّهَا الَّذِينَ آمَنُوا إِن تَنصُرُوا اللَّهَ يَنصُرْكُمْ وَيُثَبِّتْ أَقْدَامَكُمْ",
    englishText: "O you who have believed, if you support Allah, He will support you and plant firmly your feet.",
  },
  {
    id: 45, surahId: 49, surahNameEnglish: "Al-Hujurat", ayahNumber: 13,
    arabicText: "إِنَّ أَكْرَمَكُمْ عِندَ اللَّهِ أَتْقَاكُمْ",
    englishText: "Indeed, the most noble of you in the sight of Allah is the most righteous of you.",
  },
  {
    id: 46, surahId: 51, surahNameEnglish: "Adh-Dhariyat", ayahNumber: 56,
    arabicText: "وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ",
    englishText: "And I did not create the jinn and mankind except to worship Me.",
  },
  {
    id: 47, surahId: 55, surahNameEnglish: "Ar-Rahman", ayahNumber: 13,
    arabicText: "فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ",
    englishText: "So which of the favors of your Lord would you deny?",
  },
  {
    id: 48, surahId: 57, surahNameEnglish: "Al-Hadid", ayahNumber: 3,
    arabicText: "هُوَ الْأَوَّلُ وَالْآخِرُ وَالظَّاهِرُ وَالْبَاطِنُ ۖ وَهُوَ بِكُلِّ شَيْءٍ عَلِيمٌ",
    englishText: "He is the First and the Last, the Ascendant and the Intimate, and He is, of all things, Knowing.",
  },
  {
    id: 49, surahId: 57, surahNameEnglish: "Al-Hadid", ayahNumber: 4,
    arabicText: "وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ ۚ وَاللَّهُ بِمَا تَعْمَلُونَ بَصِيرٌ",
    englishText: "And He is with you wherever you are. And Allah, of what you do, is Seeing.",
  },
  {
    id: 50, surahId: 58, surahNameEnglish: "Al-Mujadila", ayahNumber: 11,
    arabicText: "يَرْفَعِ اللَّهُ الَّذِينَ آمَنُوا مِنكُمْ وَالَّذِينَ أُوتُوا الْعِلْمَ دَرَجَاتٍ",
    englishText: "Allah will raise those who have believed among you and those who were given knowledge, by degrees.",
  },
  {
    id: 51, surahId: 65, surahNameEnglish: "At-Talaq", ayahNumber: 3,
    arabicText: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
    englishText: "And whoever relies upon Allah — then He is sufficient for him.",
  },
  {
    id: 52, surahId: 67, surahNameEnglish: "Al-Mulk", ayahNumber: 1,
    arabicText: "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
    englishText: "Blessed is He in whose hand is dominion, and He is over all things competent.",
  },
  {
    id: 53, surahId: 73, surahNameEnglish: "Al-Muzzammil", ayahNumber: 8,
    arabicText: "وَاذْكُرِ اسْمَ رَبِّكَ وَتَبَتَّلْ إِلَيْهِ تَبْتِيلًا",
    englishText: "And remember the name of your Lord and devote yourself to Him with complete devotion.",
  },
  {
    id: 54, surahId: 84, surahNameEnglish: "Al-Inshiqaq", ayahNumber: 6,
    arabicText: "يَا أَيُّهَا الْإِنسَانُ إِنَّكَ كَادِحٌ إِلَىٰ رَبِّكَ كَدْحًا فَمُلَاقِيهِ",
    englishText: "O mankind, indeed you are laboring toward your Lord with great exertion and will meet it.",
  },
  {
    id: 55, surahId: 87, surahNameEnglish: "Al-A'la", ayahNumber: 17,
    arabicText: "وَالْآخِرَةُ خَيْرٌ وَأَبْقَىٰ",
    englishText: "While the Hereafter is better and more enduring.",
  },
  {
    id: 56, surahId: 89, surahNameEnglish: "Al-Fajr", ayahNumber: 27,
    arabicText: "يَا أَيَّتُهَا النَّفْسُ الْمُطْمَئِنَّةُ",
    englishText: "O reassured soul.",
  },
  {
    id: 57, surahId: 93, surahNameEnglish: "Ad-Duha", ayahNumber: 5,
    arabicText: "وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ",
    englishText: "And your Lord is going to give you, and you will be satisfied.",
  },
  {
    id: 58, surahId: 94, surahNameEnglish: "Ash-Sharh", ayahNumber: 5,
    arabicText: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
    englishText: "For indeed, with hardship will be ease.",
  },
  {
    id: 59, surahId: 94, surahNameEnglish: "Ash-Sharh", ayahNumber: 6,
    arabicText: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    englishText: "Indeed, with hardship will be ease.",
  },
  {
    id: 60, surahId: 96, surahNameEnglish: "Al-Alaq", ayahNumber: 1,
    arabicText: "اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ",
    englishText: "Read in the name of your Lord who created.",
  },
  {
    id: 61, surahId: 97, surahNameEnglish: "Al-Qadr", ayahNumber: 3,
    arabicText: "لَيْلَةُ الْقَدْرِ خَيْرٌ مِّنْ أَلْفِ شَهْرٍ",
    englishText: "The Night of Decree is better than a thousand months.",
  },
  {
    id: 62, surahId: 103, surahNameEnglish: "Al-Asr", ayahNumber: 1,
    arabicText: "وَالْعَصْرِ ۝ إِنَّ الْإِنسَانَ لَفِي خُسْرٍ ۝ إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ",
    englishText: "By time, indeed mankind is in loss — except for those who have believed and done righteous deeds.",
  },
  {
    id: 63, surahId: 109, surahNameEnglish: "Al-Kafirun", ayahNumber: 6,
    arabicText: "لَكُمْ دِينُكُمْ وَلِيَ دِينِ",
    englishText: "For you is your religion, and for me is my religion.",
  },
  {
    id: 64, surahId: 112, surahNameEnglish: "Al-Ikhlas", ayahNumber: 1,
    arabicText: "قُلْ هُوَ اللَّهُ أَحَدٌ",
    englishText: "Say, 'He is Allah, One.'",
  },
  {
    id: 65, surahId: 2, surahNameEnglish: "Al-Baqarah", ayahNumber: 177,
    arabicText: "لَّيْسَ الْبِرَّ أَن تُوَلُّوا وُجُوهَكُمْ قِبَلَ الْمَشْرِقِ وَالْمَغْرِبِ وَلَٰكِنَّ الْبِرَّ مَنْ آمَنَ بِاللَّهِ",
    englishText: "Righteousness is not that you turn your faces toward the east or the west, but righteousness is one who believes in Allah.",
  },
  {
    id: 66, surahId: 3, surahNameEnglish: "Ali 'Imran", ayahNumber: 17,
    arabicText: "الصَّابِرِينَ وَالصَّادِقِينَ وَالْقَانِتِينَ وَالْمُنفِقِينَ وَالْمُسْتَغْفِرِينَ بِالْأَسْحَارِ",
    englishText: "The patient, the truthful, the obedient, those who spend in the way of Allah, and those who seek forgiveness before dawn.",
  },
  {
    id: 67, surahId: 39, surahNameEnglish: "Az-Zumar", ayahNumber: 9,
    arabicText: "قُلْ هَلْ يَسْتَوِي الَّذِينَ يَعْلَمُونَ وَالَّذِينَ لَا يَعْلَمُونَ",
    englishText: "Say, 'Are those who know equal to those who do not know?'",
  },
  {
    id: 68, surahId: 49, surahNameEnglish: "Al-Hujurat", ayahNumber: 12,
    arabicText: "يَا أَيُّهَا الَّذِينَ آمَنُوا اجْتَنِبُوا كَثِيرًا مِّنَ الظَّنِّ إِنَّ بَعْضَ الظَّنِّ إِثْمٌ",
    englishText: "O you who have believed, avoid much assumption. Indeed, some assumption is sin.",
  },
  {
    id: 69, surahId: 62, surahNameEnglish: "Al-Jumu'ah", ayahNumber: 10,
    arabicText: "فَإِذَا قُضِيَتِ الصَّلَاةُ فَانتَشِرُوا فِي الْأَرْضِ وَابْتَغُوا مِن فَضْلِ اللَّهِ",
    englishText: "And when the prayer has been concluded, disperse within the land and seek from the bounty of Allah.",
  },
  {
    id: 70, surahId: 76, surahNameEnglish: "Al-Insan", ayahNumber: 9,
    arabicText: "إِنَّمَا نُطْعِمُكُمْ لِوَجْهِ اللَّهِ لَا نُرِيدُ مِنكُمْ جَزَاءً وَلَا شُكُورًا",
    englishText: "We feed you only for the countenance of Allah. We wish not from you reward or gratitude.",
  },
  {
    id: 71, surahId: 92, surahNameEnglish: "Al-Layl", ayahNumber: 5,
    arabicText: "فَأَمَّا مَنْ أَعْطَىٰ وَاتَّقَىٰ ۝ وَصَدَّقَ بِالْحُسْنَىٰ ۝ فَسَنُيَسِّرُهُ لِلْيُسْرَىٰ",
    englishText: "As for he who gives and fears Allah and believes in the best reward — We will ease him toward ease.",
  },
  {
    id: 72, surahId: 2, surahNameEnglish: "Al-Baqarah", ayahNumber: 261,
    arabicText: "مَّثَلُ الَّذِينَ يُنفِقُونَ أَمْوَالَهُمْ فِي سَبِيلِ اللَّهِ كَمَثَلِ حَبَّةٍ أَنبَتَتْ سَبْعَ سَنَابِلَ",
    englishText: "The example of those who spend in the way of Allah is like a grain which grows seven spikes; in each spike is a hundred grains.",
  },
  {
    id: 73, surahId: 16, surahNameEnglish: "An-Nahl", ayahNumber: 128,
    arabicText: "إِنَّ اللَّهَ مَعَ الَّذِينَ اتَّقَوا وَّالَّذِينَ هُم مُّحْسِنُونَ",
    englishText: "Indeed, Allah is with those who fear Him and those who are doers of good.",
  },
  {
    id: 74, surahId: 4, surahNameEnglish: "An-Nisa", ayahNumber: 59,
    arabicText: "يَا أَيُّهَا الَّذِينَ آمَنُوا أَطِيعُوا اللَّهَ وَأَطِيعُوا الرَّسُولَ",
    englishText: "O you who have believed, obey Allah and obey the Messenger.",
  },
  {
    id: 75, surahId: 35, surahNameEnglish: "Fatir", ayahNumber: 15,
    arabicText: "يَا أَيُّهَا النَّاسُ أَنتُمُ الْفُقَرَاءُ إِلَى اللَّهِ ۖ وَاللَّهُ هُوَ الْغَنِيُّ الْحَمِيدُ",
    englishText: "O mankind, you are those in need of Allah, while Allah is the Free of need, the Praiseworthy.",
  },
];

export function getTodayAyah(order: "sequential" | "random"): FeaturedAyah {
  const total = FEATURED_AYAT.length;
  if (order === "random") {
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const index = seed % total;
    return FEATURED_AYAT[index];
  } else {
    const start = new Date(2024, 0, 1);
    const today = new Date();
    const diff = Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return FEATURED_AYAT[diff % total];
  }
}
