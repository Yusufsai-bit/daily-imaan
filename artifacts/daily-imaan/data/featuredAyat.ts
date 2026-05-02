export interface FeaturedAyah {
  id: number;
  surahId: number;
  surahNameEnglish: string;
  ayahNumber: number;
  arabicText: string;
  englishText: string;
  explanation: string;
}

export const FEATURED_AYAT: FeaturedAyah[] = [
  {
    id: 1, surahId: 1, surahNameEnglish: "Al-Fatihah", ayahNumber: 1,
    arabicText: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    englishText: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
    explanation: "Every meaningful act begins by invoking Allah's infinite mercy — a reminder that His compassion encompasses all things."
  },
  {
    id: 2, surahId: 1, surahNameEnglish: "Al-Fatihah", ayahNumber: 5,
    arabicText: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
    englishText: "It is You we worship and You we ask for help.",
    explanation: "This ayah is the heart of all prayer — a daily renewal of total devotion to Allah alone and reliance on none but Him."
  },
  {
    id: 3, surahId: 2, surahNameEnglish: "Al-Baqarah", ayahNumber: 45,
    arabicText: "وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ وَإِنَّهَا لَكَبِيرَةٌ إِلَّا عَلَى الْخَاشِعِينَ",
    englishText: "And seek help through patience and prayer. Indeed, it is difficult except for the humbly submissive.",
    explanation: "When life is overwhelming, prayer and patience are the two pillars that carry you through — not productivity hacks, not distraction."
  },
  {
    id: 4, surahId: 2, surahNameEnglish: "Al-Baqarah", ayahNumber: 152,
    arabicText: "فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ",
    englishText: "So remember Me; I will remember you. And be grateful to Me and do not deny Me.",
    explanation: "An extraordinary promise: when you remember Allah, He remembers you — gratitude is the key that opens this door."
  },
  {
    id: 5, surahId: 2, surahNameEnglish: "Al-Baqarah", ayahNumber: 155,
    arabicText: "وَلَنَبْلُوَنَّكُم بِشَيْءٍ مِّنَ الْخَوْفِ وَالْجُوعِ وَنَقْصٍ مِّنَ الْأَمْوَالِ وَالْأَنفُسِ وَالثَّمَرَاتِ ۗ وَبَشِّرِ الصَّابِرِينَ",
    englishText: "And We will surely test you with something of fear and hunger and a loss of wealth and lives and fruits, but give good tidings to the patient.",
    explanation: "Hardship is not punishment — it is a test Allah uses to elevate those who remain patient and hold firm."
  },
  {
    id: 6, surahId: 2, surahNameEnglish: "Al-Baqarah", ayahNumber: 186,
    arabicText: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ الدَّاعِ إِذَا دَعَانِ",
    englishText: "And when My servants ask you concerning Me — indeed I am near. I respond to the invocation of the supplicant when he calls upon Me.",
    explanation: "Allah does not need a middleman — He is nearer to you than you think, and He hears every dua you whisper."
  },
  {
    id: 7, surahId: 2, surahNameEnglish: "Al-Baqarah", ayahNumber: 255,
    arabicText: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ",
    englishText: "Allah — there is no deity except Him, the Ever-Living, the Sustainer of existence. Neither drowsiness overtakes Him nor sleep.",
    explanation: "Ayatul Kursi — while you sleep, worry, or lose control, Allah is always awake, sustaining all of creation without rest."
  },
  {
    id: 8, surahId: 2, surahNameEnglish: "Al-Baqarah", ayahNumber: 286,
    arabicText: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
    englishText: "Allah does not burden a soul beyond that it can bear.",
    explanation: "Whatever you are going through right now — Allah already knows you can handle it. You are stronger than you think."
  },
  {
    id: 9, surahId: 3, surahNameEnglish: "Ali 'Imran", ayahNumber: 139,
    arabicText: "وَلَا تَهِنُوا وَلَا تَحْزَنُوا وَأَنتُمُ الْأَعْلَوْنَ إِن كُنتُم مُّؤْمِنِينَ",
    englishText: "So do not weaken and do not grieve, and you will be superior if you are believers.",
    explanation: "Faith is not just a feeling — it is the source of real dignity and resilience that no difficulty can permanently take away."
  },
  {
    id: 10, surahId: 3, surahNameEnglish: "Ali 'Imran", ayahNumber: 173,
    arabicText: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
    englishText: "Sufficient for us is Allah, and He is the best Disposer of affairs.",
    explanation: "When you've done everything you can, these six words are the most powerful thing left — total trust placed in the One who controls all outcomes."
  },
  {
    id: 11, surahId: 3, surahNameEnglish: "Ali 'Imran", ayahNumber: 185,
    arabicText: "كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ",
    englishText: "Every soul will taste death.",
    explanation: "Not a threat — a reminder that this world is temporary and every day is a gift to invest in what truly matters."
  },
  {
    id: 12, surahId: 4, surahNameEnglish: "An-Nisa", ayahNumber: 103,
    arabicText: "إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا",
    englishText: "Indeed, prayer has been decreed upon the believers a decree of specified times.",
    explanation: "The five prayers are fixed anchors in the day — five moments where you step back from the world and return to what matters."
  },
  {
    id: 13, surahId: 6, surahNameEnglish: "Al-An'am", ayahNumber: 162,
    arabicText: "قُلْ إِنَّ صَلَاتِي وَنُسُكِي وَمَحْيَايَ وَمَمَاتِي لِلَّهِ رَبِّ الْعَالَمِينَ",
    englishText: "Say, 'Indeed, my prayer, my rites of sacrifice, my living and my dying are for Allah, Lord of the worlds.'",
    explanation: "The believer's entire life — work, rest, joy, grief — is an act of worship when dedicated to Allah."
  },
  {
    id: 14, surahId: 7, surahNameEnglish: "Al-A'raf", ayahNumber: 156,
    arabicText: "وَرَحْمَتِي وَسِعَتْ كُلَّ شَيْءٍ",
    englishText: "My mercy encompasses all things.",
    explanation: "No sin, no distance, no failure is bigger than Allah's mercy — it surrounds everything and everyone."
  },
  {
    id: 15, surahId: 8, surahNameEnglish: "Al-Anfal", ayahNumber: 2,
    arabicText: "إِنَّمَا الْمُؤْمِنُونَ الَّذِينَ إِذَا ذُكِرَ اللَّهُ وَجِلَتْ قُلُوبُهُمْ",
    englishText: "The believers are only those who, when Allah is mentioned, their hearts become fearful.",
    explanation: "True faith isn't just knowledge — it's a living connection with Allah that the heart feels when His name is heard."
  },
  {
    id: 16, surahId: 9, surahNameEnglish: "At-Tawbah", ayahNumber: 40,
    arabicText: "لَا تَحْزَنْ إِنَّ اللَّهَ مَعَنَا",
    englishText: "Do not grieve; indeed Allah is with us.",
    explanation: "These were the words of the Prophet ﷺ in the darkest hour — a reminder that Allah's company makes any difficulty bearable."
  },
  {
    id: 17, surahId: 10, surahNameEnglish: "Yunus", ayahNumber: 62,
    arabicText: "أَلَا إِنَّ أَوْلِيَاءَ اللَّهِ لَا خَوْفٌ عَلَيْهِمْ وَلَا هُمْ يَحْزَنُونَ",
    englishText: "Unquestionably, the allies of Allah — there will be no fear concerning them, nor will they grieve.",
    explanation: "Those who are close to Allah live with a freedom others don't understand — free from paralyzing fear, free from endless grief."
  },
  {
    id: 18, surahId: 11, surahNameEnglish: "Hud", ayahNumber: 88,
    arabicText: "وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ",
    englishText: "And my success is not but through Allah.",
    explanation: "Every achievement, every good outcome — the honest person knows it came through Allah's enabling, not their own effort alone."
  },
  {
    id: 19, surahId: 12, surahNameEnglish: "Yusuf", ayahNumber: 87,
    arabicText: "وَلَا تَيْأَسُوا مِن رَّوْحِ اللَّهِ ۖ إِنَّهُ لَا يَيْأَسُ مِن رَّوْحِ اللَّهِ إِلَّا الْقَوْمُ الْكَافِرُونَ",
    englishText: "Do not despair of relief from Allah. Indeed, no one despairs of relief from Allah except the disbelieving people.",
    explanation: "Despair is a spiritual trap — the believer always holds the certainty that Allah's relief can arrive at any moment, even the last one."
  },
  {
    id: 20, surahId: 13, surahNameEnglish: "Ar-Ra'd", ayahNumber: 11,
    arabicText: "إِنَّ اللَّهَ لَا يُغَيِّرُ مَا بِقَوْمٍ حَتَّىٰ يُغَيِّرُوا مَا بِأَنفُسِهِمْ",
    englishText: "Indeed, Allah will not change the condition of a people until they change what is in themselves.",
    explanation: "Real change starts inside — Allah has tied the transformation of our circumstances to the transformation of our inner selves."
  },
  {
    id: 21, surahId: 13, surahNameEnglish: "Ar-Ra'd", ayahNumber: 28,
    arabicText: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
    englishText: "Unquestionably, by the remembrance of Allah hearts are assured.",
    explanation: "No therapy, no success, no relationship satisfies the heart the way remembrance of Allah does — it's the only lasting peace."
  },
  {
    id: 22, surahId: 14, surahNameEnglish: "Ibrahim", ayahNumber: 7,
    arabicText: "لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ",
    englishText: "If you are grateful, I will surely increase you.",
    explanation: "Gratitude is not just an attitude — it is Allah's mechanism for multiplying blessings in your life."
  },
  {
    id: 23, surahId: 15, surahNameEnglish: "Al-Hijr", ayahNumber: 9,
    arabicText: "إِنَّا نَحْنُ نَزَّلْنَا الذِّكْرَ وَإِنَّا لَهُ لَحَافِظُونَ",
    englishText: "Indeed, it is We who sent down the Qur'an and indeed, We will be its guardian.",
    explanation: "The Quran is the only book in history unchanged for 1,400+ years — Allah Himself took responsibility for its preservation."
  },
  {
    id: 24, surahId: 16, surahNameEnglish: "An-Nahl", ayahNumber: 90,
    arabicText: "إِنَّ اللَّهَ يَأْمُرُ بِالْعَدْلِ وَالْإِحْسَانِ وَإِيتَاءِ ذِي الْقُرْبَىٰ",
    englishText: "Indeed, Allah orders justice and good conduct and giving to relatives.",
    explanation: "Three pillars of a righteous life: be fair in your dealings, go beyond fairness with excellence, and care for your family."
  },
  {
    id: 25, surahId: 17, surahNameEnglish: "Al-Isra", ayahNumber: 23,
    arabicText: "وَقَضَىٰ رَبُّكَ أَلَّا تَعْبُدُوا إِلَّا إِيَّاهُ وَبِالْوَالِدَيْنِ إِحْسَانًا",
    englishText: "Your Lord has decreed that you worship none but Him, and that you be kind to parents.",
    explanation: "Kindness to parents is placed immediately after worshipping Allah — call your parents today."
  },
  {
    id: 26, surahId: 17, surahNameEnglish: "Al-Isra", ayahNumber: 79,
    arabicText: "وَمِنَ اللَّيْلِ فَتَهَجَّدْ بِهِ نَافِلَةً لَّكَ عَسَىٰ أَن يَبْعَثَكَ رَبُّكَ مَقَامًا مَّحْمُودًا",
    englishText: "And from part of the night, pray with it as additional worship for you; perhaps your Lord will resurrect you to a praised station.",
    explanation: "The night prayer is a private conversation with Allah that the world doesn't see — and the reward it brings, no eye has seen."
  },
  {
    id: 27, surahId: 18, surahNameEnglish: "Al-Kahf", ayahNumber: 10,
    arabicText: "رَبَّنَا آتِنَا مِن لَّدُنكَ رَحْمَةً وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًا",
    englishText: "Our Lord, grant us from Yourself mercy and prepare for us from our affair right guidance.",
    explanation: "The dua of the People of the Cave — seeking both divine mercy and wise direction in uncertain times."
  },
  {
    id: 28, surahId: 18, surahNameEnglish: "Al-Kahf", ayahNumber: 46,
    arabicText: "الْمَالُ وَالْبَنُونَ زِينَةُ الْحَيَاةِ الدُّنْيَا ۖ وَالْبَاقِيَاتُ الصَّالِحَاتُ خَيْرٌ عِندَ رَبِّكَ",
    englishText: "Wealth and children are adornment of worldly life. But the enduring good deeds are better to your Lord for reward.",
    explanation: "What you own and achieve here is temporary decoration — your deeds, your character, and your prayers last beyond this world."
  },
  {
    id: 29, surahId: 19, surahNameEnglish: "Maryam", ayahNumber: 96,
    arabicText: "إِنَّ الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ سَيَجْعَلُ لَهُمُ الرَّحْمَٰنُ وُدًّا",
    englishText: "Indeed, those who have believed and done righteous deeds — the Most Merciful will appoint for them affection.",
    explanation: "When you build your life around faith and good deeds, Allah places love for you in the hearts of people — no networking required."
  },
  {
    id: 30, surahId: 20, surahNameEnglish: "Ta-Ha", ayahNumber: 114,
    arabicText: "وَقُل رَّبِّ زِدْنِي عِلْمًا",
    englishText: "And say, 'My Lord, increase me in knowledge.'",
    explanation: "The shortest and most powerful dua for learning — make it a habit to ask Allah to expand your understanding every day."
  },
  {
    id: 31, surahId: 21, surahNameEnglish: "Al-Anbiya", ayahNumber: 87,
    arabicText: "لَّا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ",
    englishText: "There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.",
    explanation: "The dua of Prophet Yunus from inside the whale — acknowledged weakness, affirmed Allah's greatness, and Allah answered it completely."
  },
  {
    id: 32, surahId: 22, surahNameEnglish: "Al-Hajj", ayahNumber: 46,
    arabicText: "فَإِنَّهَا لَا تَعْمَى الْأَبْصَارُ وَلَٰكِن تَعْمَى الْقُلُوبُ الَّتِي فِي الصُّدُورِ",
    englishText: "For indeed, it is not eyes that are blinded, but blinded are the hearts which are within the breasts.",
    explanation: "You can see everything and still understand nothing — real sight is the heart's ability to see truth, not just facts."
  },
  {
    id: 33, surahId: 23, surahNameEnglish: "Al-Mu'minun", ayahNumber: 1,
    arabicText: "قَدْ أَفْلَحَ الْمُؤْمِنُونَ",
    englishText: "Certainly will the believers have succeeded.",
    explanation: "Not 'might succeed' or 'could succeed' — Allah opens this surah with a declaration: the believers have already succeeded."
  },
  {
    id: 34, surahId: 24, surahNameEnglish: "An-Nur", ayahNumber: 35,
    arabicText: "اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ",
    englishText: "Allah is the Light of the heavens and the earth.",
    explanation: "Everything that is illuminated, everything that is guided, everything that is made clear — its source is Allah alone."
  },
  {
    id: 35, surahId: 25, surahNameEnglish: "Al-Furqan", ayahNumber: 63,
    arabicText: "وَعِبَادُ الرَّحْمَٰنِ الَّذِينَ يَمْشُونَ عَلَى الْأَرْضِ هَوْنًا",
    englishText: "And the servants of the Most Merciful are those who walk upon the earth easily.",
    explanation: "The believers don't carry the arrogance of the world — they move through life with humility, lightness, and calm dignity."
  },
  {
    id: 36, surahId: 28, surahNameEnglish: "Al-Qasas", ayahNumber: 24,
    arabicText: "رَبِّ إِنِّي لِمَا أَنزَلْتَ إِلَيَّ مِنْ خَيْرٍ فَقِيرٌ",
    englishText: "My Lord, indeed I am, for whatever good You would send down to me, in need.",
    explanation: "Prophet Musa's dua when he had nothing — just honest need presented to Allah — and what followed changed the course of his life."
  },
  {
    id: 37, surahId: 29, surahNameEnglish: "Al-Ankabut", ayahNumber: 2,
    arabicText: "أَحَسِبَ النَّاسُ أَن يُتْرَكُوا أَن يَقُولُوا آمَنَّا وَهُمْ لَا يُفْتَنُونَ",
    englishText: "Do the people think that they will be left to say, 'We believe' and they will not be tried?",
    explanation: "Faith is not just a statement — it is tested by life itself. The trial is proof that Allah takes your claim seriously."
  },
  {
    id: 38, surahId: 30, surahNameEnglish: "Ar-Rum", ayahNumber: 21,
    arabicText: "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا",
    englishText: "And of His signs is that He created for you from yourselves mates that you may find tranquility in them.",
    explanation: "Marriage in Islam is a sign of Allah — love between spouses is not just human affection, it's a mercy placed there by the Divine."
  },
  {
    id: 39, surahId: 33, surahNameEnglish: "Al-Ahzab", ayahNumber: 41,
    arabicText: "يَا أَيُّهَا الَّذِينَ آمَنُوا اذْكُرُوا اللَّهَ ذِكْرًا كَثِيرًا",
    englishText: "O you who have believed, remember Allah with much remembrance.",
    explanation: "The command is not 'sometimes' or 'when you feel like it' — it is much, constant, woven through every part of your day."
  },
  {
    id: 40, surahId: 36, surahNameEnglish: "Ya-Sin", ayahNumber: 82,
    arabicText: "إِنَّمَا أَمْرُهُ إِذَا أَرَادَ شَيْئًا أَن يَقُولَ لَهُ كُن فَيَكُونُ",
    englishText: "His command is only when He intends a thing that He says to it, 'Be,' and it is.",
    explanation: "Every obstacle you face — Allah can remove it with a single word. Nothing is beyond His will, not even what feels impossible."
  },
  {
    id: 41, surahId: 39, surahNameEnglish: "Az-Zumar", ayahNumber: 53,
    arabicText: "قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ",
    englishText: "Say, 'O My servants who have transgressed against themselves, do not despair of the mercy of Allah.'",
    explanation: "These words are addressed to every person who feels they've gone too far — Allah is calling them back before it's too late."
  },
  {
    id: 42, surahId: 40, surahNameEnglish: "Ghafir", ayahNumber: 60,
    arabicText: "وَقَالَ رَبُّكُمُ ادْعُونِي أَسْتَجِبْ لَكُمْ",
    englishText: "And your Lord says, 'Call upon Me; I will respond to you.'",
    explanation: "Allah doesn't just allow dua — He invites it, He promises to answer it. Don't hold back from calling on Him."
  },
  {
    id: 43, surahId: 42, surahNameEnglish: "Ash-Shuraa", ayahNumber: 30,
    arabicText: "وَمَا أَصَابَكُم مِّن مُّصِيبَةٍ فَبِمَا كَسَبَتْ أَيْدِيكُمْ وَيَعْفُو عَن كَثِيرٍ",
    englishText: "And whatever strikes you of disaster — it is for what your hands have earned; but He pardons much.",
    explanation: "Difficulties often trace back to our own choices — but the beautiful end of this ayah is that Allah pardons far more than He holds us to."
  },
  {
    id: 44, surahId: 47, surahNameEnglish: "Muhammad", ayahNumber: 7,
    arabicText: "يَا أَيُّهَا الَّذِينَ آمَنُوا إِن تَنصُرُوا اللَّهَ يَنصُرْكُمْ وَيُثَبِّتْ أَقْدَامَكُمْ",
    englishText: "O you who have believed, if you support Allah, He will support you and plant firmly your feet.",
    explanation: "The believer who stands for truth in their life, work, and character receives Allah's own backing and steadiness."
  },
  {
    id: 45, surahId: 49, surahNameEnglish: "Al-Hujurat", ayahNumber: 13,
    arabicText: "إِنَّ أَكْرَمَكُمْ عِندَ اللَّهِ أَتْقَاكُمْ",
    englishText: "Indeed, the most noble of you in the sight of Allah is the most righteous of you.",
    explanation: "Status in Allah's sight has nothing to do with ethnicity, wealth, or social standing — only taqwa (God-consciousness) measures rank."
  },
  {
    id: 46, surahId: 51, surahNameEnglish: "Adh-Dhariyat", ayahNumber: 56,
    arabicText: "وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ",
    englishText: "And I did not create the jinn and mankind except to worship Me.",
    explanation: "Your entire life has a purpose that transcends career, family, and goals — worshipping Allah is the answer to 'why am I here?'"
  },
  {
    id: 47, surahId: 55, surahNameEnglish: "Ar-Rahman", ayahNumber: 13,
    arabicText: "فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ",
    englishText: "So which of the favors of your Lord would you deny?",
    explanation: "Repeated 31 times in this surah — a gentle, insistent reminder to count the blessings you overlook every single day."
  },
  {
    id: 48, surahId: 57, surahNameEnglish: "Al-Hadid", ayahNumber: 3,
    arabicText: "هُوَ الْأَوَّلُ وَالْآخِرُ وَالظَّاهِرُ وَالْبَاطِنُ ۖ وَهُوَ بِكُلِّ شَيْءٍ عَلِيمٌ",
    englishText: "He is the First and the Last, the Ascendant and the Intimate, and He is, of all things, Knowing.",
    explanation: "Before anything existed and after everything ends, Allah is — He is closer to you than your own thoughts."
  },
  {
    id: 49, surahId: 57, surahNameEnglish: "Al-Hadid", ayahNumber: 4,
    arabicText: "وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ ۚ وَاللَّهُ بِمَا تَعْمَلُونَ بَصِيرٌ",
    englishText: "And He is with you wherever you are. And Allah, of what you do, is Seeing.",
    explanation: "You are never truly alone — in the office, the commute, the quiet moments of doubt — Allah is with you, watching with full knowledge."
  },
  {
    id: 50, surahId: 58, surahNameEnglish: "Al-Mujadila", ayahNumber: 11,
    arabicText: "يَرْفَعِ اللَّهُ الَّذِينَ آمَنُوا مِنكُمْ وَالَّذِينَ أُوتُوا الْعِلْمَ دَرَجَاتٍ",
    englishText: "Allah will raise those who have believed among you and those who were given knowledge, by degrees.",
    explanation: "Two things that elevate you in Allah's sight: sincere faith and the pursuit of knowledge — both are available to you today."
  },
  {
    id: 51, surahId: 65, surahNameEnglish: "At-Talaq", ayahNumber: 3,
    arabicText: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ",
    englishText: "And whoever relies upon Allah — then He is sufficient for him.",
    explanation: "Tawakkul doesn't mean doing nothing — it means doing your part and then placing the outcome entirely in Allah's hands."
  },
  {
    id: 52, surahId: 67, surahNameEnglish: "Al-Mulk", ayahNumber: 1,
    arabicText: "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
    englishText: "Blessed is He in whose hand is dominion, and He is over all things competent.",
    explanation: "Surah Al-Mulk — reading it every night before sleep is a Sunnah that protects in the grave. It begins by declaring Allah's absolute sovereignty."
  },
  {
    id: 53, surahId: 73, surahNameEnglish: "Al-Muzzammil", ayahNumber: 8,
    arabicText: "وَاذْكُرِ اسْمَ رَبِّكَ وَتَبَتَّلْ إِلَيْهِ تَبْتِيلًا",
    englishText: "And remember the name of your Lord and devote yourself to Him with complete devotion.",
    explanation: "Complete devotion — not 80%, not when convenient — is what transforms dhikr from a ritual into a way of living."
  },
  {
    id: 54, surahId: 84, surahNameEnglish: "Al-Inshiqaq", ayahNumber: 6,
    arabicText: "يَا أَيُّهَا الْإِنسَانُ إِنَّكَ كَادِحٌ إِلَىٰ رَبِّكَ كَدْحًا فَمُلَاقِيهِ",
    englishText: "O mankind, indeed you are laboring toward your Lord with great exertion and will meet it.",
    explanation: "Every step of your life's journey — the hard work, the struggle, the effort — is leading you to an inevitable meeting with Allah."
  },
  {
    id: 55, surahId: 87, surahNameEnglish: "Al-A'la", ayahNumber: 17,
    arabicText: "وَالْآخِرَةُ خَيْرٌ وَأَبْقَىٰ",
    englishText: "While the Hereafter is better and more enduring.",
    explanation: "Whatever you are chasing in this world — the Hereafter is better in quality and permanent in duration. Worth keeping in mind."
  },
  {
    id: 56, surahId: 89, surahNameEnglish: "Al-Fajr", ayahNumber: 27,
    arabicText: "يَا أَيَّتُهَا النَّفْسُ الْمُطْمَئِنَّةُ",
    englishText: "O reassured soul.",
    explanation: "The soul at peace — not anxious, not grasping, not running — is the state Allah calls to Himself with honour and love."
  },
  {
    id: 57, surahId: 93, surahNameEnglish: "Ad-Duha", ayahNumber: 5,
    arabicText: "وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ",
    englishText: "And your Lord is going to give you, and you will be satisfied.",
    explanation: "Revealed when the Prophet ﷺ felt abandoned — a divine promise that what Allah has planned is enough to bring complete contentment."
  },
  {
    id: 58, surahId: 94, surahNameEnglish: "Ash-Sharh", ayahNumber: 5,
    arabicText: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
    englishText: "For indeed, with hardship will be ease.",
    explanation: "The Arabic says 'with hardship' — not after it — meaning ease is already present inside the difficulty, not waiting at the end."
  },
  {
    id: 59, surahId: 94, surahNameEnglish: "Ash-Sharh", ayahNumber: 6,
    arabicText: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    englishText: "Indeed, with hardship will be ease.",
    explanation: "Scholars note that 'hardship' is the same hardship from the previous verse, but 'ease' is different — meaning one hardship brings multiple reliefs."
  },
  {
    id: 60, surahId: 96, surahNameEnglish: "Al-Alaq", ayahNumber: 1,
    arabicText: "اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ",
    englishText: "Read in the name of your Lord who created.",
    explanation: "The very first word of the Quran was a command to read — knowledge, learning, and reflection are at the heart of this faith."
  },
  {
    id: 61, surahId: 97, surahNameEnglish: "Al-Qadr", ayahNumber: 3,
    arabicText: "لَيْلَةُ الْقَدْرِ خَيْرٌ مِّنْ أَلْفِ شَهْرٍ",
    englishText: "The Night of Decree is better than a thousand months.",
    explanation: "One night — approximately in the last 10 nights of Ramadan — carries more weight than 83 years of worship. Look for it."
  },
  {
    id: 62, surahId: 103, surahNameEnglish: "Al-Asr", ayahNumber: 1,
    arabicText: "وَالْعَصْرِ ۝ إِنَّ الْإِنسَانَ لَفِي خُسْرٍ ۝ إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ",
    englishText: "By time, indeed mankind is in loss — except for those who have believed and done righteous deeds.",
    explanation: "This entire surah summarizes what saves a human life: faith, righteous action, truth-telling, and patience with others."
  },
  {
    id: 63, surahId: 109, surahNameEnglish: "Al-Kafirun", ayahNumber: 6,
    arabicText: "لَكُمْ دِينُكُمْ وَلِيَ دِينِ",
    englishText: "For you is your religion, and for me is my religion.",
    explanation: "A statement of principled coexistence — the believer is confident in their path without needing to be hostile about anyone else's."
  },
  {
    id: 64, surahId: 112, surahNameEnglish: "Al-Ikhlas", ayahNumber: 1,
    arabicText: "قُلْ هُوَ اللَّهُ أَحَدٌ",
    englishText: "Say, 'He is Allah, One.'",
    explanation: "The single most defining statement of Islamic theology — Allah's oneness, undivided and without partner or equal."
  },
  {
    id: 65, surahId: 2, surahNameEnglish: "Al-Baqarah", ayahNumber: 177,
    arabicText: "لَّيْسَ الْبِرَّ أَن تُوَلُّوا وُجُوهَكُمْ قِبَلَ الْمَشْرِقِ وَالْمَغْرِبِ وَلَٰكِنَّ الْبِرَّ مَنْ آمَنَ بِاللَّهِ",
    englishText: "Righteousness is not that you turn your faces toward the east or the west, but righteousness is one who believes in Allah.",
    explanation: "True righteousness goes far beyond ritual direction — it is a whole-life orientation of the heart toward Allah and His creation."
  },
  {
    id: 66, surahId: 3, surahNameEnglish: "Ali 'Imran", ayahNumber: 17,
    arabicText: "الصَّابِرِينَ وَالصَّادِقِينَ وَالْقَانِتِينَ وَالْمُنفِقِينَ وَالْمُسْتَغْفِرِينَ بِالْأَسْحَارِ",
    englishText: "The patient, the truthful, the obedient, those who spend in the way of Allah, and those who seek forgiveness before dawn.",
    explanation: "Five qualities Allah praises: patience, honesty, devotion, generosity, and seeking forgiveness in the quiet hours before dawn."
  },
  {
    id: 67, surahId: 39, surahNameEnglish: "Az-Zumar", ayahNumber: 9,
    arabicText: "قُلْ هَلْ يَسْتَوِي الَّذِينَ يَعْلَمُونَ وَالَّذِينَ لَا يَعْلَمُونَ",
    englishText: "Say, 'Are those who know equal to those who do not know?'",
    explanation: "Knowledge that leads to Allah is a supreme advantage — seek Islamic knowledge not just worldly knowledge."
  },
  {
    id: 68, surahId: 49, surahNameEnglish: "Al-Hujurat", ayahNumber: 12,
    arabicText: "يَا أَيُّهَا الَّذِينَ آمَنُوا اجْتَنِبُوا كَثِيرًا مِّنَ الظَّنِّ إِنَّ بَعْضَ الظَّنِّ إِثْمٌ",
    englishText: "O you who have believed, avoid much assumption. Indeed, some assumption is sin.",
    explanation: "Most conflict between people starts with assumptions — the believer checks their suspicions before letting them damage relationships."
  },
  {
    id: 69, surahId: 62, surahNameEnglish: "Al-Jumu'ah", ayahNumber: 10,
    arabicText: "فَإِذَا قُضِيَتِ الصَّلَاةُ فَانتَشِرُوا فِي الْأَرْضِ وَابْتَغُوا مِن فَضْلِ اللَّهِ",
    englishText: "And when the prayer has been concluded, disperse within the land and seek from the bounty of Allah.",
    explanation: "Islam integrates the sacred and the worldly — after prayer, go back into the world and earn your living, also an act of worship."
  },
  {
    id: 70, surahId: 76, surahNameEnglish: "Al-Insan", ayahNumber: 9,
    arabicText: "إِنَّمَا نُطْعِمُكُمْ لِوَجْهِ اللَّهِ لَا نُرِيدُ مِنكُمْ جَزَاءً وَلَا شُكُورًا",
    englishText: "We feed you only for the countenance of Allah. We wish not from you reward or gratitude.",
    explanation: "The purest form of charity asks nothing in return — not thanks, not recognition, not reciprocity. Just Allah's pleasure."
  },
  {
    id: 71, surahId: 92, surahNameEnglish: "Al-Layl", ayahNumber: 5,
    arabicText: "فَأَمَّا مَنْ أَعْطَىٰ وَاتَّقَىٰ ۝ وَصَدَّقَ بِالْحُسْنَىٰ ۝ فَسَنُيَسِّرُهُ لِلْيُسْرَىٰ",
    englishText: "As for he who gives and fears Allah and believes in the best reward — We will ease him toward ease.",
    explanation: "Generosity, God-consciousness, and faith in divine reward — three traits that make life continuously easier, not harder."
  },
  {
    id: 72, surahId: 2, surahNameEnglish: "Al-Baqarah", ayahNumber: 261,
    arabicText: "مَّثَلُ الَّذِينَ يُنفِقُونَ أَمْوَالَهُمْ فِي سَبِيلِ اللَّهِ كَمَثَلِ حَبَّةٍ أَنبَتَتْ سَبْعَ سَنَابِلَ",
    englishText: "The example of those who spend in the way of Allah is like a grain which grows seven spikes; in each spike is a hundred grains.",
    explanation: "One good deed given sincerely multiplies 700 times in reward — charity is the highest-return investment in existence."
  },
  {
    id: 73, surahId: 16, surahNameEnglish: "An-Nahl", ayahNumber: 128,
    arabicText: "إِنَّ اللَّهَ مَعَ الَّذِينَ اتَّقَوا وَّالَّذِينَ هُم مُّحْسِنُونَ",
    englishText: "Indeed, Allah is with those who fear Him and those who are doers of good.",
    explanation: "Allah's company — the greatest companionship — is given to those who live with taqwa and act with ihsan (excellence in all they do)."
  },
  {
    id: 74, surahId: 4, surahNameEnglish: "An-Nisa", ayahNumber: 59,
    arabicText: "يَا أَيُّهَا الَّذِينَ آمَنُوا أَطِيعُوا اللَّهَ وَأَطِيعُوا الرَّسُولَ",
    englishText: "O you who have believed, obey Allah and obey the Messenger.",
    explanation: "Two sources of guidance — the Quran and the Sunnah of the Prophet ﷺ — are the believer's complete compass for life."
  },
  {
    id: 75, surahId: 35, surahNameEnglish: "Fatir", ayahNumber: 15,
    arabicText: "يَا أَيُّهَا النَّاسُ أَنتُمُ الْفُقَرَاءُ إِلَى اللَّهِ ۖ وَاللَّهُ هُوَ الْغَنِيُّ الْحَمِيدُ",
    englishText: "O mankind, you are those in need of Allah, while Allah is the Free of need, the Praiseworthy.",
    explanation: "The honest starting point of faith: we need Allah for everything — breath, guidance, sustenance, hope — and He needs nothing from us."
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
