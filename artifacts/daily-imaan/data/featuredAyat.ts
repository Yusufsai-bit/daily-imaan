export interface FeaturedAyah {
    id: number;
    surahId: number;
    surahNameEnglish: string;
    ayahNumber: number;
    /** Arabic text in the standard Uthmani script (verified against Quran.com). */
    arabicText: string;
    /**
     * English translation, verified verbatim against the Saheeh International
     * edition served by the Quran.com Foundation API. Footnote markers are
     * stripped; bracketed clarifications by the translators are preserved.
     */
    englishText: string;
  }

  /**
   * Featured ayat curated for daily reflection. Every entry's Arabic and English
   * text was audited against the Quran.com Foundation API on this build:
   *   - Arabic:  text_uthmani via /api/v4/quran/verses/uthmani
   *   - English: Saheeh International (translation id 20) via /api/qdc/translations/20
   * No AI-generated commentary is stored or shown anywhere in this file.
   */
  export const FEATURED_AYAT: FeaturedAyah[] = [
    {
      id: 1, surahId: 1, surahNameEnglish: "Al-Fatihah", ayahNumber: 1,
      arabicText: "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ",
      englishText: "In the name of Allāh, the Entirely Merciful, the Especially Merciful.",
    },
  {
      id: 2, surahId: 1, surahNameEnglish: "Al-Fatihah", ayahNumber: 5,
      arabicText: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
      englishText: "It is You we worship and You we ask for help.",
    },
  {
      id: 3, surahId: 2, surahNameEnglish: "Al-Baqarah", ayahNumber: 45,
      arabicText: "وَٱسْتَعِينُوا۟ بِٱلصَّبْرِ وَٱلصَّلَوٰةِ ۚ وَإِنَّهَا لَكَبِيرَةٌ إِلَّا عَلَى ٱلْخَـٰشِعِينَ",
      englishText: "And seek help through patience and prayer; and indeed, it is difficult except for the humbly submissive [to Allāh]",
    },
  {
      id: 4, surahId: 2, surahNameEnglish: "Al-Baqarah", ayahNumber: 152,
      arabicText: "فَٱذْكُرُونِىٓ أَذْكُرْكُمْ وَٱشْكُرُوا۟ لِى وَلَا تَكْفُرُونِ",
      englishText: "So remember Me; I will remember you. And be grateful to Me and do not deny Me.",
    },
  {
      id: 5, surahId: 2, surahNameEnglish: "Al-Baqarah", ayahNumber: 155,
      arabicText: "وَلَنَبْلُوَنَّكُم بِشَىْءٍ مِّنَ ٱلْخَوْفِ وَٱلْجُوعِ وَنَقْصٍ مِّنَ ٱلْأَمْوَٰلِ وَٱلْأَنفُسِ وَٱلثَّمَرَٰتِ ۗ وَبَشِّرِ ٱلصَّـٰبِرِينَ",
      englishText: "And We will surely test you with something of fear and hunger and a loss of wealth and lives and fruits, but give good tidings to the patient,",
    },
  {
      id: 6, surahId: 2, surahNameEnglish: "Al-Baqarah", ayahNumber: 186,
      arabicText: "وَإِذَا سَأَلَكَ عِبَادِى عَنِّى فَإِنِّى قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ ٱلدَّاعِ إِذَا دَعَانِ ۖ فَلْيَسْتَجِيبُوا۟ لِى وَلْيُؤْمِنُوا۟ بِى لَعَلَّهُمْ يَرْشُدُونَ",
      englishText: "And when My servants ask you, [O Muḥammad], concerning Me - indeed I am near. I respond to the invocation of the supplicant when he calls upon Me. So let them respond to Me [by obedience] and believe in Me that they may be [rightly] guided.",
    },
  {
      id: 7, surahId: 2, surahNameEnglish: "Al-Baqarah", ayahNumber: 255,
      arabicText: "ٱللَّهُ لَآ إِلَـٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ ۚ لَا تَأْخُذُهُۥ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُۥ مَا فِى ٱلسَّمَـٰوَٰتِ وَمَا فِى ٱلْأَرْضِ ۗ مَن ذَا ٱلَّذِى يَشْفَعُ عِندَهُۥٓ إِلَّا بِإِذْنِهِۦ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَىْءٍ مِّنْ عِلْمِهِۦٓ إِلَّا بِمَا شَآءَ ۚ وَسِعَ كُرْسِيُّهُ ٱلسَّمَـٰوَٰتِ وَٱلْأَرْضَ ۖ وَلَا يَـُٔودُهُۥ حِفْظُهُمَا ۚ وَهُوَ ٱلْعَلِىُّ ٱلْعَظِيمُ",
      englishText: "Allāh - there is no deity except Him, the Ever-Living, the Self-Sustaining. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is [presently] before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Kursī extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.",
    },
  {
      id: 8, surahId: 2, surahNameEnglish: "Al-Baqarah", ayahNumber: 286,
      arabicText: "لَا يُكَلِّفُ ٱللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا ٱكْتَسَبَتْ ۗ رَبَّنَا لَا تُؤَاخِذْنَآ إِن نَّسِينَآ أَوْ أَخْطَأْنَا ۚ رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَآ إِصْرًا كَمَا حَمَلْتَهُۥ عَلَى ٱلَّذِينَ مِن قَبْلِنَا ۚ رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِۦ ۖ وَٱعْفُ عَنَّا وَٱغْفِرْ لَنَا وَٱرْحَمْنَآ ۚ أَنتَ مَوْلَىٰنَا فَٱنصُرْنَا عَلَى ٱلْقَوْمِ ٱلْكَـٰفِرِينَ",
      englishText: "Allāh does not charge a soul except [with that within] its capacity. It will have [the consequence of] what [good] it has gained, and it will bear [the consequence of] what [evil] it has earned. \"Our Lord, do not impose blame upon us if we have forgotten or erred. Our Lord, and lay not upon us a burden like that which You laid upon those before us. Our Lord, and burden us not with that which we have no ability to bear. And pardon us; and forgive us; and have mercy upon us. You are our protector, so give us victory over the disbelieving people.\"",
    },
  {
      id: 9, surahId: 3, surahNameEnglish: "Ali 'Imran", ayahNumber: 139,
      arabicText: "وَلَا تَهِنُوا۟ وَلَا تَحْزَنُوا۟ وَأَنتُمُ ٱلْأَعْلَوْنَ إِن كُنتُم مُّؤْمِنِينَ",
      englishText: "So do not weaken and do not grieve, and you will be superior if you are [true] believers.",
    },
  {
      id: 10, surahId: 3, surahNameEnglish: "Ali 'Imran", ayahNumber: 173,
      arabicText: "ٱلَّذِينَ قَالَ لَهُمُ ٱلنَّاسُ إِنَّ ٱلنَّاسَ قَدْ جَمَعُوا۟ لَكُمْ فَٱخْشَوْهُمْ فَزَادَهُمْ إِيمَـٰنًا وَقَالُوا۟ حَسْبُنَا ٱللَّهُ وَنِعْمَ ٱلْوَكِيلُ",
      englishText: "Those to whom people [i.e., hypocrites] said, \"Indeed, the people have gathered against you, so fear them.\" But it [merely] increased them in faith, and they said, \"Sufficient for us is Allāh, and [He is] the best Disposer of affairs.\"",
    },
  {
      id: 11, surahId: 3, surahNameEnglish: "Ali 'Imran", ayahNumber: 185,
      arabicText: "كُلُّ نَفْسٍ ذَآئِقَةُ ٱلْمَوْتِ ۗ وَإِنَّمَا تُوَفَّوْنَ أُجُورَكُمْ يَوْمَ ٱلْقِيَـٰمَةِ ۖ فَمَن زُحْزِحَ عَنِ ٱلنَّارِ وَأُدْخِلَ ٱلْجَنَّةَ فَقَدْ فَازَ ۗ وَمَا ٱلْحَيَوٰةُ ٱلدُّنْيَآ إِلَّا مَتَـٰعُ ٱلْغُرُورِ",
      englishText: "Every soul will taste death, and you will only be given your [full] compensation on the Day of Resurrection. So he who is drawn away from the Fire and admitted to Paradise has attained [his desire]. And what is the life of this world except the enjoyment of delusion.",
    },
  {
      id: 12, surahId: 4, surahNameEnglish: "An-Nisa", ayahNumber: 103,
      arabicText: "فَإِذَا قَضَيْتُمُ ٱلصَّلَوٰةَ فَٱذْكُرُوا۟ ٱللَّهَ قِيَـٰمًا وَقُعُودًا وَعَلَىٰ جُنُوبِكُمْ ۚ فَإِذَا ٱطْمَأْنَنتُمْ فَأَقِيمُوا۟ ٱلصَّلَوٰةَ ۚ إِنَّ ٱلصَّلَوٰةَ كَانَتْ عَلَى ٱلْمُؤْمِنِينَ كِتَـٰبًا مَّوْقُوتًا",
      englishText: "And when you have completed the prayer, remember Allāh standing, sitting, or [lying] on your sides. But when you become secure, re-establish [regular] prayer. Indeed, prayer has been decreed upon the believers a decree of specified times.",
    },
  {
      id: 13, surahId: 6, surahNameEnglish: "Al-An'am", ayahNumber: 162,
      arabicText: "قُلْ إِنَّ صَلَاتِى وَنُسُكِى وَمَحْيَاىَ وَمَمَاتِى لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ",
      englishText: "Say, \"Indeed, my prayer, my rites of sacrifice, my living and my dying are for Allāh, Lord of the worlds.",
    },
  {
      id: 14, surahId: 7, surahNameEnglish: "Al-A'raf", ayahNumber: 156,
      arabicText: "۞ وَٱكْتُبْ لَنَا فِى هَـٰذِهِ ٱلدُّنْيَا حَسَنَةً وَفِى ٱلْـَٔاخِرَةِ إِنَّا هُدْنَآ إِلَيْكَ ۚ قَالَ عَذَابِىٓ أُصِيبُ بِهِۦ مَنْ أَشَآءُ ۖ وَرَحْمَتِى وَسِعَتْ كُلَّ شَىْءٍ ۚ فَسَأَكْتُبُهَا لِلَّذِينَ يَتَّقُونَ وَيُؤْتُونَ ٱلزَّكَوٰةَ وَٱلَّذِينَ هُم بِـَٔايَـٰتِنَا يُؤْمِنُونَ",
      englishText: "And decree for us in this world [that which is] good and [also] in the Hereafter; indeed, we have turned back to You.\" [Allāh] said, \"My punishment - I afflict with it whom I will, but My mercy encompasses all things.\" So I will decree it [especially] for those who fear Me and give zakāh and those who believe in Our verses-",
    },
  {
      id: 15, surahId: 8, surahNameEnglish: "Al-Anfal", ayahNumber: 2,
      arabicText: "إِنَّمَا ٱلْمُؤْمِنُونَ ٱلَّذِينَ إِذَا ذُكِرَ ٱللَّهُ وَجِلَتْ قُلُوبُهُمْ وَإِذَا تُلِيَتْ عَلَيْهِمْ ءَايَـٰتُهُۥ زَادَتْهُمْ إِيمَـٰنًا وَعَلَىٰ رَبِّهِمْ يَتَوَكَّلُونَ",
      englishText: "The believers are only those who, when Allāh is mentioned, their hearts become fearful, and when His verses are recited to them, it increases them in faith; and upon their Lord they rely -",
    },
  {
      id: 16, surahId: 9, surahNameEnglish: "At-Tawbah", ayahNumber: 40,
      arabicText: "إِلَّا تَنصُرُوهُ فَقَدْ نَصَرَهُ ٱللَّهُ إِذْ أَخْرَجَهُ ٱلَّذِينَ كَفَرُوا۟ ثَانِىَ ٱثْنَيْنِ إِذْ هُمَا فِى ٱلْغَارِ إِذْ يَقُولُ لِصَـٰحِبِهِۦ لَا تَحْزَنْ إِنَّ ٱللَّهَ مَعَنَا ۖ فَأَنزَلَ ٱللَّهُ سَكِينَتَهُۥ عَلَيْهِ وَأَيَّدَهُۥ بِجُنُودٍ لَّمْ تَرَوْهَا وَجَعَلَ كَلِمَةَ ٱلَّذِينَ كَفَرُوا۟ ٱلسُّفْلَىٰ ۗ وَكَلِمَةُ ٱللَّهِ هِىَ ٱلْعُلْيَا ۗ وَٱللَّهُ عَزِيزٌ حَكِيمٌ",
      englishText: "If you do not aid him [i.e., the Prophet (ﷺ)] - Allāh has already aided him when those who disbelieved had driven him out [of Makkah] as one of two, when they were in the cave and he [i.e., Muḥammad (ﷺ)] said to his companion, \"Do not grieve; indeed Allāh is with us.\" And Allāh sent down His tranquility upon him and supported him with soldiers [i.e., angels] you did not see and made the word of those who disbelieved the lowest, while the word of Allāh - that is the highest. And Allāh is Exalted in Might and Wise.",
    },
  {
      id: 17, surahId: 10, surahNameEnglish: "Yunus", ayahNumber: 62,
      arabicText: "أَلَآ إِنَّ أَوْلِيَآءَ ٱللَّهِ لَا خَوْفٌ عَلَيْهِمْ وَلَا هُمْ يَحْزَنُونَ",
      englishText: "Unquestionably, [for] the allies of Allāh there will be no fear concerning them, nor will they grieve -",
    },
  {
      id: 18, surahId: 11, surahNameEnglish: "Hud", ayahNumber: 88,
      arabicText: "قَالَ يَـٰقَوْمِ أَرَءَيْتُمْ إِن كُنتُ عَلَىٰ بَيِّنَةٍ مِّن رَّبِّى وَرَزَقَنِى مِنْهُ رِزْقًا حَسَنًا ۚ وَمَآ أُرِيدُ أَنْ أُخَالِفَكُمْ إِلَىٰ مَآ أَنْهَىٰكُمْ عَنْهُ ۚ إِنْ أُرِيدُ إِلَّا ٱلْإِصْلَـٰحَ مَا ٱسْتَطَعْتُ ۚ وَمَا تَوْفِيقِىٓ إِلَّا بِٱللَّهِ ۚ عَلَيْهِ تَوَكَّلْتُ وَإِلَيْهِ أُنِيبُ",
      englishText: "He said, \"O my people, have you considered: if I am upon clear evidence from my Lord and He has provided me with a good provision from Him...? And I do not intend to differ from you in that which I have forbidden you; I only intend reform as much as I am able. And my success is not but through Allāh. Upon Him I have relied, and to Him I return.",
    },
  {
      id: 19, surahId: 12, surahNameEnglish: "Yusuf", ayahNumber: 87,
      arabicText: "يَـٰبَنِىَّ ٱذْهَبُوا۟ فَتَحَسَّسُوا۟ مِن يُوسُفَ وَأَخِيهِ وَلَا تَا۟يْـَٔسُوا۟ مِن رَّوْحِ ٱللَّهِ ۖ إِنَّهُۥ لَا يَا۟يْـَٔسُ مِن رَّوْحِ ٱللَّهِ إِلَّا ٱلْقَوْمُ ٱلْكَـٰفِرُونَ",
      englishText: "O my sons, go and find out about Joseph and his brother and despair not of relief from Allāh. Indeed, no one despairs of relief from Allāh except the disbelieving people.\"",
    },
  {
      id: 20, surahId: 13, surahNameEnglish: "Ar-Ra'd", ayahNumber: 11,
      arabicText: "لَهُۥ مُعَقِّبَـٰتٌ مِّنۢ بَيْنِ يَدَيْهِ وَمِنْ خَلْفِهِۦ يَحْفَظُونَهُۥ مِنْ أَمْرِ ٱللَّهِ ۗ إِنَّ ٱللَّهَ لَا يُغَيِّرُ مَا بِقَوْمٍ حَتَّىٰ يُغَيِّرُوا۟ مَا بِأَنفُسِهِمْ ۗ وَإِذَآ أَرَادَ ٱللَّهُ بِقَوْمٍ سُوٓءًا فَلَا مَرَدَّ لَهُۥ ۚ وَمَا لَهُم مِّن دُونِهِۦ مِن وَالٍ",
      englishText: "For him [i.e., each one] are successive [angels] before and behind him who protect him by the decree of Allāh. Indeed, Allāh will not change the condition of a people until they change what is in themselves. And when Allāh intends for a people ill, there is no repelling it. And there is not for them besides Him any patron.",
    },
  {
      id: 21, surahId: 13, surahNameEnglish: "Ar-Ra'd", ayahNumber: 28,
      arabicText: "ٱلَّذِينَ ءَامَنُوا۟ وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ ٱللَّهِ ۗ أَلَا بِذِكْرِ ٱللَّهِ تَطْمَئِنُّ ٱلْقُلُوبُ",
      englishText: "Those who have believed and whose hearts are assured by the remembrance of Allāh. Unquestionably, by the remembrance of Allāh hearts are assured.\"",
    },
  {
      id: 22, surahId: 14, surahNameEnglish: "Ibrahim", ayahNumber: 7,
      arabicText: "وَإِذْ تَأَذَّنَ رَبُّكُمْ لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ ۖ وَلَئِن كَفَرْتُمْ إِنَّ عَذَابِى لَشَدِيدٌ",
      englishText: "And [remember] when your Lord proclaimed, 'If you are grateful, I will surely increase you [in favor]; but if you deny, indeed, My punishment is severe.'\"",
    },
  {
      id: 23, surahId: 15, surahNameEnglish: "Al-Hijr", ayahNumber: 9,
      arabicText: "إِنَّا نَحْنُ نَزَّلْنَا ٱلذِّكْرَ وَإِنَّا لَهُۥ لَحَـٰفِظُونَ",
      englishText: "Indeed, it is We who sent down the message [i.e., the Qur’ān], and indeed, We will be its guardian.",
    },
  {
      id: 24, surahId: 16, surahNameEnglish: "An-Nahl", ayahNumber: 90,
      arabicText: "۞ إِنَّ ٱللَّهَ يَأْمُرُ بِٱلْعَدْلِ وَٱلْإِحْسَـٰنِ وَإِيتَآئِ ذِى ٱلْقُرْبَىٰ وَيَنْهَىٰ عَنِ ٱلْفَحْشَآءِ وَٱلْمُنكَرِ وَٱلْبَغْىِ ۚ يَعِظُكُمْ لَعَلَّكُمْ تَذَكَّرُونَ",
      englishText: "Indeed, Allāh orders justice and good conduct and giving [help] to relatives and forbids immorality and bad conduct and oppression. He admonishes you that perhaps you will be reminded.",
    },
  {
      id: 25, surahId: 17, surahNameEnglish: "Al-Isra", ayahNumber: 23,
      arabicText: "۞ وَقَضَىٰ رَبُّكَ أَلَّا تَعْبُدُوٓا۟ إِلَّآ إِيَّاهُ وَبِٱلْوَٰلِدَيْنِ إِحْسَـٰنًا ۚ إِمَّا يَبْلُغَنَّ عِندَكَ ٱلْكِبَرَ أَحَدُهُمَآ أَوْ كِلَاهُمَا فَلَا تَقُل لَّهُمَآ أُفٍّ وَلَا تَنْهَرْهُمَا وَقُل لَّهُمَا قَوْلًا كَرِيمًا",
      englishText: "And your Lord has decreed that you worship not except Him, and to parents, good treatment. Whether one or both of them reach old age [while] with you, say not to them [so much as], \"uff,\" and do not repel them but speak to them a noble word.",
    },
  {
      id: 26, surahId: 17, surahNameEnglish: "Al-Isra", ayahNumber: 79,
      arabicText: "وَمِنَ ٱلَّيْلِ فَتَهَجَّدْ بِهِۦ نَافِلَةً لَّكَ عَسَىٰٓ أَن يَبْعَثَكَ رَبُّكَ مَقَامًا مَّحْمُودًا",
      englishText: "And from [part of] the night, pray with it [i.e., recitation of the Qur’ān] as additional [worship] for you; it is expected that your Lord will resurrect you to a praised station.",
    },
  {
      id: 27, surahId: 18, surahNameEnglish: "Al-Kahf", ayahNumber: 10,
      arabicText: "إِذْ أَوَى ٱلْفِتْيَةُ إِلَى ٱلْكَهْفِ فَقَالُوا۟ رَبَّنَآ ءَاتِنَا مِن لَّدُنكَ رَحْمَةً وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًا",
      englishText: "[Mention] when the youths retreated to the cave and said, \"Our Lord, grant us from Yourself mercy and prepare for us from our affair right guidance.\"",
    },
  {
      id: 28, surahId: 18, surahNameEnglish: "Al-Kahf", ayahNumber: 46,
      arabicText: "ٱلْمَالُ وَٱلْبَنُونَ زِينَةُ ٱلْحَيَوٰةِ ٱلدُّنْيَا ۖ وَٱلْبَـٰقِيَـٰتُ ٱلصَّـٰلِحَـٰتُ خَيْرٌ عِندَ رَبِّكَ ثَوَابًا وَخَيْرٌ أَمَلًا",
      englishText: "Wealth and children are [but] adornment of the worldly life. But the enduring good deeds are better to your Lord for reward and better for [one's] hope.",
    },
  {
      id: 29, surahId: 19, surahNameEnglish: "Maryam", ayahNumber: 96,
      arabicText: "إِنَّ ٱلَّذِينَ ءَامَنُوا۟ وَعَمِلُوا۟ ٱلصَّـٰلِحَـٰتِ سَيَجْعَلُ لَهُمُ ٱلرَّحْمَـٰنُ وُدًّا",
      englishText: "Indeed, those who have believed and done righteous deeds - the Most Merciful will appoint for them affection.",
    },
  {
      id: 30, surahId: 20, surahNameEnglish: "Ta-Ha", ayahNumber: 114,
      arabicText: "فَتَعَـٰلَى ٱللَّهُ ٱلْمَلِكُ ٱلْحَقُّ ۗ وَلَا تَعْجَلْ بِٱلْقُرْءَانِ مِن قَبْلِ أَن يُقْضَىٰٓ إِلَيْكَ وَحْيُهُۥ ۖ وَقُل رَّبِّ زِدْنِى عِلْمًا",
      englishText: "So high [above all] is Allāh, the Sovereign, the Truth. And, [O Muḥammad], do not hasten with [recitation of] the Qur’ān before its revelation is completed to you, and say, \"My Lord, increase me in knowledge.\"",
    },
  {
      id: 31, surahId: 21, surahNameEnglish: "Al-Anbiya", ayahNumber: 87,
      arabicText: "وَذَا ٱلنُّونِ إِذ ذَّهَبَ مُغَـٰضِبًا فَظَنَّ أَن لَّن نَّقْدِرَ عَلَيْهِ فَنَادَىٰ فِى ٱلظُّلُمَـٰتِ أَن لَّآ إِلَـٰهَ إِلَّآ أَنتَ سُبْحَـٰنَكَ إِنِّى كُنتُ مِنَ ٱلظَّـٰلِمِينَ",
      englishText: "And [mention] the man of the fish [i.e., Jonah], when he went off in anger and thought that We would not decree [anything] upon him. And he called out within the darknesses, \"There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.\"",
    },
  {
      id: 32, surahId: 22, surahNameEnglish: "Al-Hajj", ayahNumber: 46,
      arabicText: "أَفَلَمْ يَسِيرُوا۟ فِى ٱلْأَرْضِ فَتَكُونَ لَهُمْ قُلُوبٌ يَعْقِلُونَ بِهَآ أَوْ ءَاذَانٌ يَسْمَعُونَ بِهَا ۖ فَإِنَّهَا لَا تَعْمَى ٱلْأَبْصَـٰرُ وَلَـٰكِن تَعْمَى ٱلْقُلُوبُ ٱلَّتِى فِى ٱلصُّدُورِ",
      englishText: "So have they not traveled through the earth and have hearts by which to reason and ears by which to hear? For indeed, it is not eyes that are blinded, but blinded are the hearts which are within the breasts.",
    },
  {
      id: 33, surahId: 23, surahNameEnglish: "Al-Mu'minun", ayahNumber: 1,
      arabicText: " قَدْ أَفْلَحَ ٱلْمُؤْمِنُونَ",
      englishText: "Certainly will the believers have succeeded:",
    },
  {
      id: 34, surahId: 24, surahNameEnglish: "An-Nur", ayahNumber: 35,
      arabicText: "۞ ٱللَّهُ نُورُ ٱلسَّمَـٰوَٰتِ وَٱلْأَرْضِ ۚ مَثَلُ نُورِهِۦ كَمِشْكَوٰةٍ فِيهَا مِصْبَاحٌ ۖ ٱلْمِصْبَاحُ فِى زُجَاجَةٍ ۖ ٱلزُّجَاجَةُ كَأَنَّهَا كَوْكَبٌ دُرِّىٌّ يُوقَدُ مِن شَجَرَةٍ مُّبَـٰرَكَةٍ زَيْتُونَةٍ لَّا شَرْقِيَّةٍ وَلَا غَرْبِيَّةٍ يَكَادُ زَيْتُهَا يُضِىٓءُ وَلَوْ لَمْ تَمْسَسْهُ نَارٌ ۚ نُّورٌ عَلَىٰ نُورٍ ۗ يَهْدِى ٱللَّهُ لِنُورِهِۦ مَن يَشَآءُ ۚ وَيَضْرِبُ ٱللَّهُ ٱلْأَمْثَـٰلَ لِلنَّاسِ ۗ وَٱللَّهُ بِكُلِّ شَىْءٍ عَلِيمٌ",
      englishText: "Allāh is the Light of the heavens and the earth. The example of His light is like a niche within which is a lamp; the lamp is within glass, the glass as if it were a pearly [white] star lit from [the oil of] a blessed olive tree, neither of the east nor of the west, whose oil would almost glow even if untouched by fire. Light upon light. Allāh guides to His light whom He wills. And Allāh presents examples for the people, and Allāh is Knowing of all things.",
    },
  {
      id: 35, surahId: 25, surahNameEnglish: "Al-Furqan", ayahNumber: 63,
      arabicText: "وَعِبَادُ ٱلرَّحْمَـٰنِ ٱلَّذِينَ يَمْشُونَ عَلَى ٱلْأَرْضِ هَوْنًا وَإِذَا خَاطَبَهُمُ ٱلْجَـٰهِلُونَ قَالُوا۟ سَلَـٰمًا",
      englishText: "And the servants of the Most Merciful are those who walk upon the earth easily, and when the ignorant address them [harshly], they say [words of] peace,",
    },
  {
      id: 36, surahId: 28, surahNameEnglish: "Al-Qasas", ayahNumber: 24,
      arabicText: "فَسَقَىٰ لَهُمَا ثُمَّ تَوَلَّىٰٓ إِلَى ٱلظِّلِّ فَقَالَ رَبِّ إِنِّى لِمَآ أَنزَلْتَ إِلَىَّ مِنْ خَيْرٍ فَقِيرٌ",
      englishText: "So he watered [their flocks] for them; then he went back to the shade and said, \"My Lord, indeed I am, for whatever good You would send down to me, in need.\"",
    },
  {
      id: 37, surahId: 29, surahNameEnglish: "Al-Ankabut", ayahNumber: 2,
      arabicText: "أَحَسِبَ ٱلنَّاسُ أَن يُتْرَكُوٓا۟ أَن يَقُولُوٓا۟ ءَامَنَّا وَهُمْ لَا يُفْتَنُونَ",
      englishText: "Do the people think that they will be left to say, \"We believe\" and they will not be tried?",
    },
  {
      id: 38, surahId: 30, surahNameEnglish: "Ar-Rum", ayahNumber: 21,
      arabicText: "وَمِنْ ءَايَـٰتِهِۦٓ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَٰجًا لِّتَسْكُنُوٓا۟ إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ إِنَّ فِى ذَٰلِكَ لَـَٔايَـٰتٍ لِّقَوْمٍ يَتَفَكَّرُونَ",
      englishText: "And of His signs is that He created for you from yourselves mates that you may find tranquility in them; and He placed between you affection and mercy. Indeed in that are signs for a people who give thought.",
    },
  {
      id: 39, surahId: 33, surahNameEnglish: "Al-Ahzab", ayahNumber: 41,
      arabicText: "يَـٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ ٱذْكُرُوا۟ ٱللَّهَ ذِكْرًا كَثِيرًا",
      englishText: "O you who have believed, remember Allāh with much remembrance",
    },
  {
      id: 40, surahId: 36, surahNameEnglish: "Ya-Sin", ayahNumber: 82,
      arabicText: "إِنَّمَآ أَمْرُهُۥٓ إِذَآ أَرَادَ شَيْـًٔا أَن يَقُولَ لَهُۥ كُن فَيَكُونُ",
      englishText: "His command is only when He intends a thing that He says to it, \"Be,\" and it is.",
    },
  {
      id: 41, surahId: 39, surahNameEnglish: "Az-Zumar", ayahNumber: 53,
      arabicText: "۞ قُلْ يَـٰعِبَادِىَ ٱلَّذِينَ أَسْرَفُوا۟ عَلَىٰٓ أَنفُسِهِمْ لَا تَقْنَطُوا۟ مِن رَّحْمَةِ ٱللَّهِ ۚ إِنَّ ٱللَّهَ يَغْفِرُ ٱلذُّنُوبَ جَمِيعًا ۚ إِنَّهُۥ هُوَ ٱلْغَفُورُ ٱلرَّحِيمُ",
      englishText: "Say, \"O My servants who have transgressed against themselves [by sinning], do not despair of the mercy of Allāh. Indeed, Allāh forgives all sins. Indeed, it is He who is the Forgiving, the Merciful.\"",
    },
  {
      id: 42, surahId: 40, surahNameEnglish: "Ghafir", ayahNumber: 60,
      arabicText: "وَقَالَ رَبُّكُمُ ٱدْعُونِىٓ أَسْتَجِبْ لَكُمْ ۚ إِنَّ ٱلَّذِينَ يَسْتَكْبِرُونَ عَنْ عِبَادَتِى سَيَدْخُلُونَ جَهَنَّمَ دَاخِرِينَ",
      englishText: "And your Lord says, \"Call upon Me; I will respond to you.\" Indeed, those who disdain My worship will enter Hell [rendered] contemptible.",
    },
  {
      id: 43, surahId: 42, surahNameEnglish: "Ash-Shuraa", ayahNumber: 30,
      arabicText: "وَمَآ أَصَـٰبَكُم مِّن مُّصِيبَةٍ فَبِمَا كَسَبَتْ أَيْدِيكُمْ وَيَعْفُوا۟ عَن كَثِيرٍ",
      englishText: "And whatever strikes you of disaster - it is for what your hands have earned; but He pardons much.",
    },
  {
      id: 44, surahId: 47, surahNameEnglish: "Muhammad", ayahNumber: 7,
      arabicText: "يَـٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوٓا۟ إِن تَنصُرُوا۟ ٱللَّهَ يَنصُرْكُمْ وَيُثَبِّتْ أَقْدَامَكُمْ",
      englishText: "O you who have believed, if you support Allāh, He will support you and plant firmly your feet.",
    },
  {
      id: 45, surahId: 49, surahNameEnglish: "Al-Hujurat", ayahNumber: 13,
      arabicText: "يَـٰٓأَيُّهَا ٱلنَّاسُ إِنَّا خَلَقْنَـٰكُم مِّن ذَكَرٍ وَأُنثَىٰ وَجَعَلْنَـٰكُمْ شُعُوبًا وَقَبَآئِلَ لِتَعَارَفُوٓا۟ ۚ إِنَّ أَكْرَمَكُمْ عِندَ ٱللَّهِ أَتْقَىٰكُمْ ۚ إِنَّ ٱللَّهَ عَلِيمٌ خَبِيرٌ",
      englishText: "O mankind, indeed We have created you from male and female and made you peoples and tribes that you may know one another. Indeed, the most noble of you in the sight of Allāh is the most righteous of you. Indeed, Allāh is Knowing and Aware.",
    },
  {
      id: 46, surahId: 51, surahNameEnglish: "Adh-Dhariyat", ayahNumber: 56,
      arabicText: "وَمَا خَلَقْتُ ٱلْجِنَّ وَٱلْإِنسَ إِلَّا لِيَعْبُدُونِ",
      englishText: "And I did not create the jinn and mankind except to worship Me.",
    },
  {
      id: 47, surahId: 55, surahNameEnglish: "Ar-Rahman", ayahNumber: 13,
      arabicText: "فَبِأَىِّ ءَالَآءِ رَبِّكُمَا تُكَذِّبَانِ",
      englishText: "So which of the favors of your Lord would you deny?",
    },
  {
      id: 48, surahId: 57, surahNameEnglish: "Al-Hadid", ayahNumber: 3,
      arabicText: "هُوَ ٱلْأَوَّلُ وَٱلْـَٔاخِرُ وَٱلظَّـٰهِرُ وَٱلْبَاطِنُ ۖ وَهُوَ بِكُلِّ شَىْءٍ عَلِيمٌ",
      englishText: "He is the First and the Last, the Ascendant and the Intimate, and He is, of all things, Knowing.",
    },
  {
      id: 49, surahId: 57, surahNameEnglish: "Al-Hadid", ayahNumber: 4,
      arabicText: "هُوَ ٱلَّذِى خَلَقَ ٱلسَّمَـٰوَٰتِ وَٱلْأَرْضَ فِى سِتَّةِ أَيَّامٍ ثُمَّ ٱسْتَوَىٰ عَلَى ٱلْعَرْشِ ۚ يَعْلَمُ مَا يَلِجُ فِى ٱلْأَرْضِ وَمَا يَخْرُجُ مِنْهَا وَمَا يَنزِلُ مِنَ ٱلسَّمَآءِ وَمَا يَعْرُجُ فِيهَا ۖ وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ ۚ وَٱللَّهُ بِمَا تَعْمَلُونَ بَصِيرٌ",
      englishText: "It is He who created the heavens and earth in six days and then established Himself above the Throne. He knows what penetrates into the earth and what emerges from it and what descends from the heaven and what ascends therein; and He is with you wherever you are. And Allāh, of what you do, is Seeing.",
    },
  {
      id: 50, surahId: 58, surahNameEnglish: "Al-Mujadila", ayahNumber: 11,
      arabicText: "يَـٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوٓا۟ إِذَا قِيلَ لَكُمْ تَفَسَّحُوا۟ فِى ٱلْمَجَـٰلِسِ فَٱفْسَحُوا۟ يَفْسَحِ ٱللَّهُ لَكُمْ ۖ وَإِذَا قِيلَ ٱنشُزُوا۟ فَٱنشُزُوا۟ يَرْفَعِ ٱللَّهُ ٱلَّذِينَ ءَامَنُوا۟ مِنكُمْ وَٱلَّذِينَ أُوتُوا۟ ٱلْعِلْمَ دَرَجَـٰتٍ ۚ وَٱللَّهُ بِمَا تَعْمَلُونَ خَبِيرٌ",
      englishText: "O you who have believed, when you are told, \"Space yourselves\" in assemblies, then make space; Allāh will make space for you. And when you are told, \"Arise,\" then arise; Allāh will raise those who have believed among you and those who were given knowledge, by degrees. And Allāh is Aware of what you do.",
    },
  {
      id: 51, surahId: 65, surahNameEnglish: "At-Talaq", ayahNumber: 3,
      arabicText: "وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ ۚ وَمَن يَتَوَكَّلْ عَلَى ٱللَّهِ فَهُوَ حَسْبُهُۥٓ ۚ إِنَّ ٱللَّهَ بَـٰلِغُ أَمْرِهِۦ ۚ قَدْ جَعَلَ ٱللَّهُ لِكُلِّ شَىْءٍ قَدْرًا",
      englishText: "And will provide for him from where he does not expect. And whoever relies upon Allāh - then He is sufficient for him. Indeed, Allāh will accomplish His purpose. Allāh has already set for everything a [decreed] extent.",
    },
  {
      id: 52, surahId: 67, surahNameEnglish: "Al-Mulk", ayahNumber: 1,
      arabicText: " تَبَـٰرَكَ ٱلَّذِى بِيَدِهِ ٱلْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَىْءٍ قَدِيرٌ",
      englishText: "Blessed is He in whose hand is dominion, and He is over all things competent -",
    },
  {
      id: 53, surahId: 73, surahNameEnglish: "Al-Muzzammil", ayahNumber: 8,
      arabicText: "وَٱذْكُرِ ٱسْمَ رَبِّكَ وَتَبَتَّلْ إِلَيْهِ تَبْتِيلًا",
      englishText: "And remember the name of your Lord and devote yourself to Him with [complete] devotion.",
    },
  {
      id: 54, surahId: 84, surahNameEnglish: "Al-Inshiqaq", ayahNumber: 6,
      arabicText: "يَـٰٓأَيُّهَا ٱلْإِنسَـٰنُ إِنَّكَ كَادِحٌ إِلَىٰ رَبِّكَ كَدْحًا فَمُلَـٰقِيهِ",
      englishText: "O mankind, indeed you are laboring toward your Lord with [great] exertion and will meet it.",
    },
  {
      id: 55, surahId: 87, surahNameEnglish: "Al-A'la", ayahNumber: 17,
      arabicText: "وَٱلْـَٔاخِرَةُ خَيْرٌ وَأَبْقَىٰٓ",
      englishText: "While the Hereafter is better and more enduring.",
    },
  {
      id: 56, surahId: 89, surahNameEnglish: "Al-Fajr", ayahNumber: 27,
      arabicText: "يَـٰٓأَيَّتُهَا ٱلنَّفْسُ ٱلْمُطْمَئِنَّةُ",
      englishText: "[To the righteous it will be said], \"O reassured soul,",
    },
  {
      id: 57, surahId: 93, surahNameEnglish: "Ad-Duha", ayahNumber: 5,
      arabicText: "وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰٓ",
      englishText: "And your Lord is going to give you, and you will be satisfied.",
    },
  {
      id: 58, surahId: 94, surahNameEnglish: "Ash-Sharh", ayahNumber: 5,
      arabicText: "فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا",
      englishText: "For indeed, with hardship [will be] ease [i.e., relief].",
    },
  {
      id: 59, surahId: 94, surahNameEnglish: "Ash-Sharh", ayahNumber: 6,
      arabicText: "إِنَّ مَعَ ٱلْعُسْرِ يُسْرًا",
      englishText: "Indeed, with hardship [will be] ease.",
    },
  {
      id: 60, surahId: 96, surahNameEnglish: "Al-Alaq", ayahNumber: 1,
      arabicText: " ٱقْرَأْ بِٱسْمِ رَبِّكَ ٱلَّذِى خَلَقَ",
      englishText: "Recite in the name of your Lord who created",
    },
  {
      id: 61, surahId: 97, surahNameEnglish: "Al-Qadr", ayahNumber: 3,
      arabicText: "لَيْلَةُ ٱلْقَدْرِ خَيْرٌ مِّنْ أَلْفِ شَهْرٍ",
      englishText: "The Night of Decree is better than a thousand months.",
    },
  {
      id: 62, surahId: 103, surahNameEnglish: "Al-Asr", ayahNumber: 1,
      arabicText: " وَٱلْعَصْرِ",
      englishText: "By time,",
    },
  {
      id: 63, surahId: 109, surahNameEnglish: "Al-Kafirun", ayahNumber: 6,
      arabicText: "لَكُمْ دِينُكُمْ وَلِىَ دِينِ",
      englishText: "For you is your religion, and for me is my religion.\"",
    },
  {
      id: 64, surahId: 112, surahNameEnglish: "Al-Ikhlas", ayahNumber: 1,
      arabicText: " قُلْ هُوَ ٱللَّهُ أَحَدٌ",
      englishText: "Say, \"He is Allāh, [who is] One,",
    },
  {
      id: 65, surahId: 2, surahNameEnglish: "Al-Baqarah", ayahNumber: 177,
      arabicText: "۞ لَّيْسَ ٱلْبِرَّ أَن تُوَلُّوا۟ وُجُوهَكُمْ قِبَلَ ٱلْمَشْرِقِ وَٱلْمَغْرِبِ وَلَـٰكِنَّ ٱلْبِرَّ مَنْ ءَامَنَ بِٱللَّهِ وَٱلْيَوْمِ ٱلْـَٔاخِرِ وَٱلْمَلَـٰٓئِكَةِ وَٱلْكِتَـٰبِ وَٱلنَّبِيِّـۧنَ وَءَاتَى ٱلْمَالَ عَلَىٰ حُبِّهِۦ ذَوِى ٱلْقُرْبَىٰ وَٱلْيَتَـٰمَىٰ وَٱلْمَسَـٰكِينَ وَٱبْنَ ٱلسَّبِيلِ وَٱلسَّآئِلِينَ وَفِى ٱلرِّقَابِ وَأَقَامَ ٱلصَّلَوٰةَ وَءَاتَى ٱلزَّكَوٰةَ وَٱلْمُوفُونَ بِعَهْدِهِمْ إِذَا عَـٰهَدُوا۟ ۖ وَٱلصَّـٰبِرِينَ فِى ٱلْبَأْسَآءِ وَٱلضَّرَّآءِ وَحِينَ ٱلْبَأْسِ ۗ أُو۟لَـٰٓئِكَ ٱلَّذِينَ صَدَقُوا۟ ۖ وَأُو۟لَـٰٓئِكَ هُمُ ٱلْمُتَّقُونَ",
      englishText: "Righteousness is not that you turn your faces toward the east or the west, but [true] righteousness is [in] one who believes in Allāh, the Last Day, the angels, the Book, and the prophets and gives wealth, in spite of love for it, to relatives, orphans, the needy, the traveler, those who ask [for help], and for freeing slaves; [and who] establishes prayer and gives zakāh; [those who] fulfill their promise when they promise; and [those who] are patient in poverty and hardship and during battle. Those are the ones who have been true, and it is those who are the righteous.",
    },
  {
      id: 66, surahId: 3, surahNameEnglish: "Ali 'Imran", ayahNumber: 17,
      arabicText: "ٱلصَّـٰبِرِينَ وَٱلصَّـٰدِقِينَ وَٱلْقَـٰنِتِينَ وَٱلْمُنفِقِينَ وَٱلْمُسْتَغْفِرِينَ بِٱلْأَسْحَارِ",
      englishText: "The patient, the true, the obedient, those who spend [in the way of Allāh], and those who seek forgiveness before dawn.",
    },
  {
      id: 67, surahId: 39, surahNameEnglish: "Az-Zumar", ayahNumber: 9,
      arabicText: "أَمَّنْ هُوَ قَـٰنِتٌ ءَانَآءَ ٱلَّيْلِ سَاجِدًا وَقَآئِمًا يَحْذَرُ ٱلْـَٔاخِرَةَ وَيَرْجُوا۟ رَحْمَةَ رَبِّهِۦ ۗ قُلْ هَلْ يَسْتَوِى ٱلَّذِينَ يَعْلَمُونَ وَٱلَّذِينَ لَا يَعْلَمُونَ ۗ إِنَّمَا يَتَذَكَّرُ أُو۟لُوا۟ ٱلْأَلْبَـٰبِ",
      englishText: "Is one who is devoutly obedient during periods of the night, prostrating and standing [in prayer], fearing the Hereafter and hoping for the mercy of his Lord, [like one who does not]? Say, \"Are those who know equal to those who do not know?\" Only they will remember [who are] people of understanding.",
    },
  {
      id: 68, surahId: 49, surahNameEnglish: "Al-Hujurat", ayahNumber: 12,
      arabicText: "يَـٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ ٱجْتَنِبُوا۟ كَثِيرًا مِّنَ ٱلظَّنِّ إِنَّ بَعْضَ ٱلظَّنِّ إِثْمٌ ۖ وَلَا تَجَسَّسُوا۟ وَلَا يَغْتَب بَّعْضُكُم بَعْضًا ۚ أَيُحِبُّ أَحَدُكُمْ أَن يَأْكُلَ لَحْمَ أَخِيهِ مَيْتًا فَكَرِهْتُمُوهُ ۚ وَٱتَّقُوا۟ ٱللَّهَ ۚ إِنَّ ٱللَّهَ تَوَّابٌ رَّحِيمٌ",
      englishText: "O you who have believed, avoid much [negative] assumption. Indeed, some assumption is sin. And do not spy or backbite each other. Would one of you like to eat the flesh of his brother when dead? You would detest it. And fear Allāh; indeed, Allāh is Accepting of Repentance and Merciful.",
    },
  {
      id: 69, surahId: 62, surahNameEnglish: "Al-Jumu'ah", ayahNumber: 10,
      arabicText: "فَإِذَا قُضِيَتِ ٱلصَّلَوٰةُ فَٱنتَشِرُوا۟ فِى ٱلْأَرْضِ وَٱبْتَغُوا۟ مِن فَضْلِ ٱللَّهِ وَٱذْكُرُوا۟ ٱللَّهَ كَثِيرًا لَّعَلَّكُمْ تُفْلِحُونَ",
      englishText: "And when the prayer has been concluded, disperse within the land and seek from the bounty of Allāh, and remember Allāh often that you may succeed.",
    },
  {
      id: 70, surahId: 76, surahNameEnglish: "Al-Insan", ayahNumber: 9,
      arabicText: "إِنَّمَا نُطْعِمُكُمْ لِوَجْهِ ٱللَّهِ لَا نُرِيدُ مِنكُمْ جَزَآءً وَلَا شُكُورًا",
      englishText: "[Saying], \"We feed you only for the face [i.e., approval] of Allāh. We wish not from you reward or gratitude.",
    },
  {
      id: 71, surahId: 92, surahNameEnglish: "Al-Layl", ayahNumber: 5,
      arabicText: "فَأَمَّا مَنْ أَعْطَىٰ وَٱتَّقَىٰ",
      englishText: "As for he who gives and fears Allāh",
    },
  {
      id: 72, surahId: 2, surahNameEnglish: "Al-Baqarah", ayahNumber: 261,
      arabicText: "مَّثَلُ ٱلَّذِينَ يُنفِقُونَ أَمْوَٰلَهُمْ فِى سَبِيلِ ٱللَّهِ كَمَثَلِ حَبَّةٍ أَنۢبَتَتْ سَبْعَ سَنَابِلَ فِى كُلِّ سُنۢبُلَةٍ مِّا۟ئَةُ حَبَّةٍ ۗ وَٱللَّهُ يُضَـٰعِفُ لِمَن يَشَآءُ ۗ وَٱللَّهُ وَٰسِعٌ عَلِيمٌ",
      englishText: "The example of those who spend their wealth in the way of Allāh is like a seed [of grain] which grows seven spikes; in each spike is a hundred grains. And Allāh multiplies [His reward] for whom He wills. And Allāh is all-Encompassing and Knowing.",
    },
  {
      id: 73, surahId: 16, surahNameEnglish: "An-Nahl", ayahNumber: 128,
      arabicText: "إِنَّ ٱللَّهَ مَعَ ٱلَّذِينَ ٱتَّقَوا۟ وَّٱلَّذِينَ هُم مُّحْسِنُونَ",
      englishText: "Indeed, Allāh is with those who fear Him and those who are doers of good.",
    },
  {
      id: 74, surahId: 4, surahNameEnglish: "An-Nisa", ayahNumber: 59,
      arabicText: "يَـٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوٓا۟ أَطِيعُوا۟ ٱللَّهَ وَأَطِيعُوا۟ ٱلرَّسُولَ وَأُو۟لِى ٱلْأَمْرِ مِنكُمْ ۖ فَإِن تَنَـٰزَعْتُمْ فِى شَىْءٍ فَرُدُّوهُ إِلَى ٱللَّهِ وَٱلرَّسُولِ إِن كُنتُمْ تُؤْمِنُونَ بِٱللَّهِ وَٱلْيَوْمِ ٱلْـَٔاخِرِ ۚ ذَٰلِكَ خَيْرٌ وَأَحْسَنُ تَأْوِيلًا",
      englishText: "O you who have believed, obey Allāh and obey the Messenger and those in authority among you. And if you disagree over anything, refer it to Allāh and the Messenger, if you should believe in Allāh and the Last Day. That is the best [way] and best in result.",
    },
  {
      id: 75, surahId: 35, surahNameEnglish: "Fatir", ayahNumber: 15,
      arabicText: "۞ يَـٰٓأَيُّهَا ٱلنَّاسُ أَنتُمُ ٱلْفُقَرَآءُ إِلَى ٱللَّهِ ۖ وَٱللَّهُ هُوَ ٱلْغَنِىُّ ٱلْحَمِيدُ",
      englishText: "O mankind, you are those in need of Allāh, while Allāh is the Free of need, the Praiseworthy.",
    },
    // ────────────────────────────────────────────────────────────────────
    // v1.0 expansion — 25 additional gentle, lapsed-friendly verses drawn
    // primarily from Juz 'Amma. Every entry below is verbatim Saheeh
    // International, audited against the bundled `quranFullData.ts` (which
    // is itself sourced byte-exact from the Quran.com Foundation API).
    // No paraphrasing or AI commentary. Selection criteria: warmth,
    // mercy, dignity, refuge, hope; explicitly avoiding judgement-heavy
    // verses on a daily-rotation surface.
    // ────────────────────────────────────────────────────────────────────
    {
      id: 76, surahId: 93, surahNameEnglish: "Ad-Duha", ayahNumber: 1,
      arabicText: "وَٱلضُّحَىٰ",
      englishText: "By the morning brightness",
    },
    {
      id: 77, surahId: 93, surahNameEnglish: "Ad-Duha", ayahNumber: 3,
      arabicText: "مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ",
      englishText: "Your Lord has not taken leave of you, [O Muḥammad], nor has He detested [you].",
    },
    {
      id: 78, surahId: 93, surahNameEnglish: "Ad-Duha", ayahNumber: 7,
      arabicText: "وَوَجَدَكَ ضَآلًّا فَهَدَىٰ",
      englishText: "And He found you lost and guided [you],",
    },
    {
      id: 79, surahId: 93, surahNameEnglish: "Ad-Duha", ayahNumber: 11,
      arabicText: "وَأَمَّا بِنِعْمَةِ رَبِّكَ فَحَدِّثْ",
      englishText: "But as for the favor of your Lord, report [it].",
    },
    {
      id: 80, surahId: 94, surahNameEnglish: "Ash-Sharh", ayahNumber: 1,
      arabicText: "أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ",
      englishText: "Did We not expand for you, [O Muḥammad], your breast?",
    },
    {
      id: 81, surahId: 94, surahNameEnglish: "Ash-Sharh", ayahNumber: 8,
      arabicText: "وَإِلَىٰ رَبِّكَ فَٱرْغَب",
      englishText: "And to your Lord direct [your] longing.",
    },
    {
      id: 82, surahId: 95, surahNameEnglish: "At-Tin", ayahNumber: 4,
      arabicText: "لَقَدْ خَلَقْنَا ٱلْإِنسَـٰنَ فِىٓ أَحْسَنِ تَقْوِيمٍ",
      englishText: "We have certainly created man in the best of stature;",
    },
    {
      id: 83, surahId: 95, surahNameEnglish: "At-Tin", ayahNumber: 6,
      arabicText: "إِلَّا ٱلَّذِينَ ءَامَنُوا۟ وَعَمِلُوا۟ ٱلصَّـٰلِحَـٰتِ فَلَهُمْ أَجْرٌ غَيْرُ مَمْنُونٍ",
      englishText: "Except for those who believe and do righteous deeds, for they will have a reward uninterrupted.",
    },
    {
      id: 84, surahId: 99, surahNameEnglish: "Az-Zalzalah", ayahNumber: 7,
      arabicText: "فَمَن يَعْمَلْ مِثْقَالَ ذَرَّةٍ خَيْرًا يَرَهُۥ",
      englishText: "So whoever does an atom's weight of good will see it,",
    },
    {
      id: 85, surahId: 99, surahNameEnglish: "Az-Zalzalah", ayahNumber: 8,
      arabicText: "وَمَن يَعْمَلْ مِثْقَالَ ذَرَّةٍ شَرًّا يَرَهُۥ",
      englishText: "And whoever does an atom's weight of evil will see it.",
    },
    {
      id: 86, surahId: 110, surahNameEnglish: "An-Nasr", ayahNumber: 1,
      arabicText: "إِذَا جَآءَ نَصْرُ ٱللَّهِ وَٱلْفَتْحُ",
      englishText: "When the victory of Allāh has come and the conquest,",
    },
    {
      id: 87, surahId: 110, surahNameEnglish: "An-Nasr", ayahNumber: 3,
      arabicText: "فَسَبِّحْ بِحَمْدِ رَبِّكَ وَٱسْتَغْفِرْهُ ۚ إِنَّهُۥ كَانَ تَوَّابًۢا",
      englishText: "Then exalt [Him] with praise of your Lord and ask forgiveness of Him. Indeed, He is ever Accepting of Repentance.",
    },
    {
      id: 88, surahId: 112, surahNameEnglish: "Al-Ikhlas", ayahNumber: 2,
      arabicText: "ٱللَّهُ ٱلصَّمَدُ",
      englishText: "Allāh, the Eternal Refuge.",
    },
    {
      id: 89, surahId: 112, surahNameEnglish: "Al-Ikhlas", ayahNumber: 3,
      arabicText: "لَمْ يَلِدْ وَلَمْ يُولَدْ",
      englishText: "He neither begets nor is born,",
    },
    {
      id: 90, surahId: 112, surahNameEnglish: "Al-Ikhlas", ayahNumber: 4,
      arabicText: "وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ",
      englishText: "Nor is there to Him any equivalent.\"",
    },
    {
      id: 91, surahId: 113, surahNameEnglish: "Al-Falaq", ayahNumber: 1,
      arabicText: "قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ",
      englishText: "Say, \"I seek refuge in the Lord of daybreak",
    },
    {
      id: 92, surahId: 113, surahNameEnglish: "Al-Falaq", ayahNumber: 2,
      arabicText: "مِن شَرِّ مَا خَلَقَ",
      englishText: "From the evil of that which He created",
    },
    {
      id: 93, surahId: 113, surahNameEnglish: "Al-Falaq", ayahNumber: 3,
      arabicText: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ",
      englishText: "And from the evil of darkness when it settles",
    },
    {
      id: 94, surahId: 113, surahNameEnglish: "Al-Falaq", ayahNumber: 5,
      arabicText: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ",
      englishText: "And from the evil of an envier when he envies.\"",
    },
    {
      id: 95, surahId: 114, surahNameEnglish: "An-Nas", ayahNumber: 1,
      arabicText: "قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ",
      englishText: "Say, \"I seek refuge in the Lord of mankind,",
    },
    {
      id: 96, surahId: 114, surahNameEnglish: "An-Nas", ayahNumber: 2,
      arabicText: "مَلِكِ ٱلنَّاسِ",
      englishText: "The Sovereign of mankind,",
    },
    {
      id: 97, surahId: 114, surahNameEnglish: "An-Nas", ayahNumber: 3,
      arabicText: "إِلَـٰهِ ٱلنَّاسِ",
      englishText: "The God of mankind,",
    },
    {
      id: 98, surahId: 92, surahNameEnglish: "Al-Layl", ayahNumber: 7,
      arabicText: "فَسَنُيَسِّرُهُۥ لِلْيُسْرَىٰ",
      englishText: "We will ease him toward ease.",
    },
    {
      id: 99, surahId: 91, surahNameEnglish: "Ash-Shams", ayahNumber: 9,
      arabicText: "قَدْ أَفْلَحَ مَن زَكَّىٰهَا",
      englishText: "He has succeeded who purifies it,",
    },
    {
      id: 100, surahId: 108, surahNameEnglish: "Al-Kawthar", ayahNumber: 1,
      arabicText: "إِنَّآ أَعْطَيْنَـٰكَ ٱلْكَوْثَرَ",
      englishText: "Indeed, We have granted you, [O Muḥammad], al-Kawthar.",
    },
    {
      id: 101, surahId: 65, surahNameEnglish: "At-Talaq", ayahNumber: 2,
      arabicText: "فَإِذَا بَلَغْنَ أَجَلَهُنَّ فَأَمْسِكُوهُنَّ بِمَعْرُوفٍ أَوْ فَارِقُوهُنَّ بِمَعْرُوفٍ وَأَشْهِدُوا۟ ذَوَىْ عَدْلٍ مِّنكُمْ وَأَقِيمُوا۟ ٱلشَّهَـٰدَةَ لِلَّهِ ۚ ذَٰلِكُمْ يُوعَظُ بِهِۦ مَن كَانَ يُؤْمِنُ بِٱللَّهِ وَٱلْيَوْمِ ٱلْـَٔاخِرِ ۚ وَمَن يَتَّقِ ٱللَّهَ يَجْعَل لَّهُۥ مَخْرَجًا",
      englishText: "And when they have [nearly] fulfilled their term, either retain them according to acceptable terms or part with them according to acceptable terms. And bring to witness two just men from among you and establish the testimony for [the acceptance of] Allāh. That is instructed to whoever should believe in Allāh and the Last Day. And whoever fears Allāh - He will make for him a way out",
    },
  {
      id: 102, surahId: 65, surahNameEnglish: "At-Talaq", ayahNumber: 7,
      arabicText: "لِيُنفِقْ ذُو سَعَةٍ مِّن سَعَتِهِۦ ۖ وَمَن قُدِرَ عَلَيْهِ رِزْقُهُۥ فَلْيُنفِقْ مِمَّآ ءَاتَىٰهُ ٱللَّهُ ۚ لَا يُكَلِّفُ ٱللَّهُ نَفْسًا إِلَّا مَآ ءَاتَىٰهَا ۚ سَيَجْعَلُ ٱللَّهُ بَعْدَ عُسْرٍ يُسْرًا",
      englishText: "Let a man of wealth spend from his wealth, and he whose provision is restricted - let him spend from what Allāh has given him. Allāh does not charge a soul except [according to] what He has given it. Allāh will bring about, after hardship, ease [i.e., relief].",
    },
  {
      id: 103, surahId: 93, surahNameEnglish: "Ad-Duhaa", ayahNumber: 4,
      arabicText: "وَلَلْـَٔاخِرَةُ خَيْرٌ لَّكَ مِنَ ٱلْأُولَىٰ",
      englishText: "And the Hereafter is better for you than the first [life].",
    },
  {
      id: 104, surahId: 2, surahNameEnglish: "Al-Baqarah", ayahNumber: 153,
      arabicText: "يَـٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ ٱسْتَعِينُوا۟ بِٱلصَّبْرِ وَٱلصَّلَوٰةِ ۚ إِنَّ ٱللَّهَ مَعَ ٱلصَّـٰبِرِينَ",
      englishText: "O you who have believed, seek help through patience and prayer. Indeed, Allāh is with the patient.",
    },
  {
      id: 105, surahId: 2, surahNameEnglish: "Al-Baqarah", ayahNumber: 201,
      arabicText: "وَمِنْهُم مَّن يَقُولُ رَبَّنَآ ءَاتِنَا فِى ٱلدُّنْيَا حَسَنَةً وَفِى ٱلْـَٔاخِرَةِ حَسَنَةً وَقِنَا عَذَابَ ٱلنَّارِ",
      englishText: "But among them is he who says, \"Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire.\"",
    },
  {
      id: 106, surahId: 3, surahNameEnglish: "Ali 'Imran", ayahNumber: 8,
      arabicText: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً ۚ إِنَّكَ أَنتَ ٱلْوَهَّابُ",
      englishText: "[Who say], \"Our Lord, let not our hearts deviate after You have guided us and grant us from Yourself mercy. Indeed, You are the Bestower.",
    },
  {
      id: 107, surahId: 3, surahNameEnglish: "Ali 'Imran", ayahNumber: 159,
      arabicText: "فَبِمَا رَحْمَةٍ مِّنَ ٱللَّهِ لِنتَ لَهُمْ ۖ وَلَوْ كُنتَ فَظًّا غَلِيظَ ٱلْقَلْبِ لَٱنفَضُّوا۟ مِنْ حَوْلِكَ ۖ فَٱعْفُ عَنْهُمْ وَٱسْتَغْفِرْ لَهُمْ وَشَاوِرْهُمْ فِى ٱلْأَمْرِ ۖ فَإِذَا عَزَمْتَ فَتَوَكَّلْ عَلَى ٱللَّهِ ۚ إِنَّ ٱللَّهَ يُحِبُّ ٱلْمُتَوَكِّلِينَ",
      englishText: "So by mercy from Allāh, [O Muḥammad], you were lenient with them. And if you had been rude [in speech] and harsh in heart, they would have disbanded from about you. So pardon them and ask forgiveness for them and consult them in the matter. And when you have decided, then rely upon Allāh. Indeed, Allāh loves those who rely [upon Him].",
    },
  {
      id: 108, surahId: 10, surahNameEnglish: "Yunus", ayahNumber: 57,
      arabicText: "يَـٰٓأَيُّهَا ٱلنَّاسُ قَدْ جَآءَتْكُم مَّوْعِظَةٌ مِّن رَّبِّكُمْ وَشِفَآءٌ لِّمَا فِى ٱلصُّدُورِ وَهُدًى وَرَحْمَةٌ لِّلْمُؤْمِنِينَ",
      englishText: "O mankind, there has come to you instruction from your Lord and healing for what is in the breasts and guidance and mercy for the believers.",
    },
  {
      id: 109, surahId: 12, surahNameEnglish: "Yusuf", ayahNumber: 86,
      arabicText: "قَالَ إِنَّمَآ أَشْكُوا۟ بَثِّى وَحُزْنِىٓ إِلَى ٱللَّهِ وَأَعْلَمُ مِنَ ٱللَّهِ مَا لَا تَعْلَمُونَ",
      englishText: "He said, \"I only complain of my suffering and my grief to Allāh, and I know from Allāh that which you do not know.",
    },
  {
      id: 110, surahId: 16, surahNameEnglish: "An-Nahl", ayahNumber: 97,
      arabicText: "مَنْ عَمِلَ صَـٰلِحًا مِّن ذَكَرٍ أَوْ أُنثَىٰ وَهُوَ مُؤْمِنٌ فَلَنُحْيِيَنَّهُۥ حَيَوٰةً طَيِّبَةً ۖ وَلَنَجْزِيَنَّهُمْ أَجْرَهُم بِأَحْسَنِ مَا كَانُوا۟ يَعْمَلُونَ",
      englishText: "Whoever does righteousness, whether male or female, while he is a believer - We will surely cause him to live a good life, and We will surely give them their reward [in the Hereafter] according to the best of what they used to do.",
    },
  {
      id: 111, surahId: 20, surahNameEnglish: "Taha", ayahNumber: 25,
      arabicText: "قَالَ رَبِّ ٱشْرَحْ لِى صَدْرِى",
      englishText: "[Moses] said, \"My Lord, expand [i.e., relax] for me my breast [with assurance]",
    },
  {
      id: 112, surahId: 23, surahNameEnglish: "Al-Mu'minun", ayahNumber: 118,
      arabicText: "وَقُل رَّبِّ ٱغْفِرْ وَٱرْحَمْ وَأَنتَ خَيْرُ ٱلرَّٰحِمِينَ",
      englishText: "And, [O Muḥammad], say, \"My Lord, forgive and have mercy, and You are the best of the merciful.\"",
    },
  {
      id: 113, surahId: 25, surahNameEnglish: "Al-Furqan", ayahNumber: 74,
      arabicText: "وَٱلَّذِينَ يَقُولُونَ رَبَّنَا هَبْ لَنَا مِنْ أَزْوَٰجِنَا وَذُرِّيَّـٰتِنَا قُرَّةَ أَعْيُنٍ وَٱجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا",
      englishText: "And those who say, \"Our Lord, grant us from among our wives and offspring comfort to our eyes and make us a leader [i.e., example] for the righteous.\"",
    },
  {
      id: 114, surahId: 29, surahNameEnglish: "Al-'Ankabut", ayahNumber: 69,
      arabicText: "وَٱلَّذِينَ جَـٰهَدُوا۟ فِينَا لَنَهْدِيَنَّهُمْ سُبُلَنَا ۚ وَإِنَّ ٱللَّهَ لَمَعَ ٱلْمُحْسِنِينَ",
      englishText: "And those who strive for Us - We will surely guide them to Our ways. And indeed, Allāh is with the doers of good.",
    },
  {
      id: 115, surahId: 41, surahNameEnglish: "Fussilat", ayahNumber: 30,
      arabicText: "إِنَّ ٱلَّذِينَ قَالُوا۟ رَبُّنَا ٱللَّهُ ثُمَّ ٱسْتَقَـٰمُوا۟ تَتَنَزَّلُ عَلَيْهِمُ ٱلْمَلَـٰٓئِكَةُ أَلَّا تَخَافُوا۟ وَلَا تَحْزَنُوا۟ وَأَبْشِرُوا۟ بِٱلْجَنَّةِ ٱلَّتِى كُنتُمْ تُوعَدُونَ",
      englishText: "Indeed, those who have said, \"Our Lord is Allāh\" and then remained on a right course - the angels will descend upon them, [saying], \"Do not fear and do not grieve but receive good tidings of Paradise, which you were promised.",
    },
  {
      id: 116, surahId: 46, surahNameEnglish: "Al-Ahqaf", ayahNumber: 13,
      arabicText: "إِنَّ ٱلَّذِينَ قَالُوا۟ رَبُّنَا ٱللَّهُ ثُمَّ ٱسْتَقَـٰمُوا۟ فَلَا خَوْفٌ عَلَيْهِمْ وَلَا هُمْ يَحْزَنُونَ",
      englishText: "Indeed, those who have said, \"Our Lord is Allāh,\" and then remained on a right course - there will be no fear concerning them, nor will they grieve.",
    },
  {
      id: 117, surahId: 55, surahNameEnglish: "Ar-Rahman", ayahNumber: 60,
      arabicText: "هَلْ جَزَآءُ ٱلْإِحْسَـٰنِ إِلَّا ٱلْإِحْسَـٰنُ",
      englishText: "Is the reward for good [anything] but good?",
    },
  {
      id: 118, surahId: 64, surahNameEnglish: "At-Taghabun", ayahNumber: 11,
      arabicText: "مَآ أَصَابَ مِن مُّصِيبَةٍ إِلَّا بِإِذْنِ ٱللَّهِ ۗ وَمَن يُؤْمِنۢ بِٱللَّهِ يَهْدِ قَلْبَهُۥ ۚ وَٱللَّهُ بِكُلِّ شَىْءٍ عَلِيمٌ",
      englishText: "No disaster strikes except by permission of Allāh. And whoever believes in Allāh - He will guide his heart. And Allāh is Knowing of all things.",
    },
  {
      id: 119, surahId: 87, surahNameEnglish: "Al-A'la", ayahNumber: 8,
      arabicText: "وَنُيَسِّرُكَ لِلْيُسْرَىٰ",
      englishText: "And We will ease you toward ease.",
    },
];

  /**
   * Day-key arithmetic: YYYYMMDD as a single integer. Lets us compute the
   * gap between two calendar dates without falling into millisecond / DST
   * traps that come from `(Date.getTime() - other.getTime()) / 86_400_000`.
   *
   * The previous implementation used the millisecond-difference trick. On
   * DST-transition days the diff is 23 or 25 hours, so `Math.floor` would
   * either repeat yesterday's verse or skip one. This version is timezone-
   * stable: anchored to local-calendar day numbers, no clock arithmetic.
   */
  function dayKey(d: Date): number {
    return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  }

  /**
   * Number of distinct calendar days between two day-keys. Inclusive on the
   * start side, exclusive on the end. Clean integer regardless of DST.
   */
  function daysSinceEpochKey(today: number, start: number): number {
    // Decode both keys back into Date objects anchored at UTC noon (so DST
    // can't shift the delta) and divide by exactly 24h.
    const y1 = Math.floor(start / 10000);
    const m1 = Math.floor((start % 10000) / 100) - 1;
    const d1 = start % 100;
    const y2 = Math.floor(today / 10000);
    const m2 = Math.floor((today % 10000) / 100) - 1;
    const d2 = today % 100;
    const startUtc = Date.UTC(y1, m1, d1);
    const todayUtc = Date.UTC(y2, m2, d2);
    return Math.round((todayUtc - startUtc) / (1000 * 60 * 60 * 24));
  }

  export function getTodayAyah(order: "sequential" | "random"): FeaturedAyah {
    const total = FEATURED_AYAT.length;
    const today = new Date();
    const todayKey = dayKey(today);
    if (order === "random") {
      // Deterministic per-day shuffle — same seed within a day, different
      // seed every day. Identity is the day-key itself; we mod into the pool.
      const index = todayKey % total;
      return FEATURED_AYAT[index]!;
    }
    // Sequential: index = (today - 2024-01-01) mod pool_size, computed in
    // pure date arithmetic so DST and leap-day transitions never repeat or
    // skip a verse.
    const startKey = 2024 * 10000 + 1 * 100 + 1; // 20240101
    const diff = daysSinceEpochKey(todayKey, startKey);
    const index = ((diff % total) + total) % total; // safe-mod for negatives
    return FEATURED_AYAT[index]!;
  }
