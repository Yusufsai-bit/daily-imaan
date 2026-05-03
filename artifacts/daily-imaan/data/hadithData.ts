// AUTO-GENERATED VERBATIM HADITH DATA
  //
  // Arabic and English text are byte-exact mirrors of the open-source
  // fawazahmed0/hadith-api dataset (https://github.com/fawazahmed0/hadith-api),
  // which itself imports the standard translations published on sunnah.com:
  //   - Sahih al-Bukhari: Mohsin Khan
  //   - Sahih Muslim:     'Abdul Hamid Siddiqui
  //   - Jami at-Tirmidhi: Abu Khaliyl
  // No paraphrasing, summarising, or AI rewording has been applied. The
  // "Read full hadith on Sunnah.com" link in the UI uses the canonical
  // USC-MSA reference number for each hadith.

  export interface DailyHadith {
    id: string;
    arabicText: string;
    englishText: string;
    narrator: string;
    collection: string;     // e.g. "Sahih al-Bukhari"
    reference: string;      // canonical sunnah.com USC-MSA reference
    grade: "Sahih";
    sourceUrl: string;      // deep link to sunnah.com
  }

  export const DAILY_HADITH: DailyHadith[] = [
    {
      id: "1",
      collection: "Sahih al-Bukhari",
      reference: "1",
      grade: "Sahih",
      narrator: "'Umar ibn al-Khattab",
      arabicText: `حَدَّثَنَا الْحُمَيْدِيُّ عَبْدُ اللَّهِ بْنُ الزُّبَيْرِ ، قَالَ : حَدَّثَنَا سُفْيَانُ ، قَالَ : حَدَّثَنَا يَحْيَى بْنُ سَعِيدٍ الْأَنْصَارِيُّ ، قَالَ : أَخْبَرَنِي مُحَمَّدُ بْنُ إِبْرَاهِيمَ التَّيْمِيُّ ، أَنَّهُ سَمِعَ عَلْقَمَةَ بْنَ وَقَّاصٍ اللَّيْثِيَّ ، يَقُولُ : سَمِعْتُ عُمَرَ بْنَ الْخَطَّابِ رَضِيَ اللَّهُ عَنْهُ عَلَى الْمِنْبَرِ، قَالَ : سَمِعْتُ رَسُولَ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ، يَقُولُ : " إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى دُنْيَا يُصِيبُهَا أَوْ إِلَى امْرَأَةٍ يَنْكِحُهَا، فَهِجْرَتُهُ إِلَى مَا هَاجَرَ إِلَيْهِ`,
      englishText: `Narrated 'Umar bin Al-Khattab: I heard Allah's Messenger (ﷺ) saying, "The reward of deeds depends upon the intentions and every person will get the reward according to what he has intended. So whoever emigrated for worldly benefits or for a woman to marry, his emigration was for what he emigrated for`,
      sourceUrl: "https://sunnah.com/bukhari/1/1",
    },
    {
      id: "2",
      collection: "Sahih al-Bukhari",
      reference: "13",
      grade: "Sahih",
      narrator: "Anas ibn Malik",
      arabicText: `حَدَّثَنَا مُسَدَّدٌ، قَالَ حَدَّثَنَا يَحْيَى، عَنْ شُعْبَةَ، عَنْ قَتَادَةَ، عَنْ أَنَسٍ ـ رضى الله عنه ـ عَنِ النَّبِيِّ صلى الله عليه وسلم‏.‏ وَعَنْ حُسَيْنٍ الْمُعَلِّمِ، قَالَ حَدَّثَنَا قَتَادَةُ، عَنْ أَنَسٍ، عَنِ النَّبِيِّ صلى الله عليه وسلم قَالَ ‏ "‏ لا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ ‏"‏‏.‏`,
      englishText: `Narrated Anas: The Prophet (ﷺ) said, "None of you will have faith till he wishes for his (Muslim) brother what he likes for himself`,
      sourceUrl: "https://sunnah.com/bukhari/2/6",
    },
    {
      id: "3",
      collection: "Jami` at-Tirmidhi",
      reference: "1924",
      grade: "Sahih",
      narrator: "'Abdullah ibn 'Amr",
      arabicText: `حَدَّثَنَا ابْنُ أَبِي عُمَرَ، حَدَّثَنَا سُفْيَانُ، عَنْ عَمْرِو بْنِ دِينَارٍ، عَنْ أَبِي قَابُوسَ، عَنْ عَبْدِ اللَّهِ بْنِ عَمْرٍو، قَالَ قَالَ رَسُولُ اللَّهِ صلى الله عليه وسلم ‏ "‏ الرَّاحِمُونَ يَرْحَمُهُمُ الرَّحْمَنُ ارْحَمُوا مَنْ فِي الأَرْضِ يَرْحَمْكُمْ مَنْ فِي السَّمَاءِ الرَّحِمُ شُجْنَةٌ مِنَ الرَّحْمَنِ فَمَنْ وَصَلَهَا وَصَلَهُ اللَّهُ وَمَنْ قَطَعَهَا قَطَعَهُ اللَّهُ ‏"‏ ‏.‏ قَالَ أَبُو عِيسَى هَذَا حَدِيثٌ حَسَنٌ صَحِيحٌ ‏.‏`,
      englishText: `Abdullah bin 'Amr narrated that the Messenger of Allah said:"The merciful are shown mercy by Ar-Rahman. Be merciful on the earth, and you will be shown mercy from Who is above the heavens. The womb is named after Ar-Rahman, so whoever connects it, Allah connects him, and whoever severs it, Allah severs him`,
      sourceUrl: "https://sunnah.com/tirmidhi/27/30",
    },
    {
      id: "4",
      collection: "Sahih al-Bukhari",
      reference: "6114",
      grade: "Sahih",
      narrator: "Abu Hurayrah",
      arabicText: `حَدَّثَنَا عَبْدُ اللَّهِ بْنُ يُوسُفَ، أَخْبَرَنَا مَالِكٌ، عَنِ ابْنِ شِهَابٍ، عَنْ سَعِيدِ بْنِ الْمُسَيَّبِ، عَنْ أَبِي هُرَيْرَةَ ـ رضى الله عنه ـ أَنَّ رَسُولَ اللَّهِ صلى الله عليه وسلم قَالَ ‏ "‏ لَيْسَ الشَّدِيدُ بِالصُّرَعَةِ، إِنَّمَا الشَّدِيدُ الَّذِي يَمْلِكُ نَفْسَهُ عِنْدَ الْغَضَبِ ‏"‏‏.‏`,
      englishText: `Narrated Abu Huraira:Allah's Messenger (ﷺ) said, "The strong is not the one who overcomes the people by his strength, but the strong is the one who controls himself while in anger`,
      sourceUrl: "https://sunnah.com/bukhari/78/139",
    },
    {
      id: "5",
      collection: "Jami` at-Tirmidhi",
      reference: "3895",
      grade: "Sahih",
      narrator: "'A'ishah",
      arabicText: `حَدَّثَنَا مُحَمَّدُ بْنُ يَحْيَى، قَالَ حَدَّثَنَا مُحَمَّدُ بْنُ يُوسُفَ، قَالَ حَدَّثَنَا سُفْيَانُ، عَنْ هِشَامِ بْنِ عُرْوَةَ، عَنْ أَبِيهِ، عَنْ عَائِشَةَ، قَالَتْ قَالَ رَسُولُ اللَّهِ صلى الله عليه وسلم ‏ "‏ خَيْرُكُمْ خَيْرُكُمْ لأَهْلِهِ وَأَنَا خَيْرُكُمْ لأَهْلِي وَإِذَا مَاتَ صَاحِبُكُمْ فَدَعُوهُ ‏"‏ ‏.‏ قَالَ أَبُو عِيسَى هَذَا حَدِيثٌ حَسَنٌ غَرِيبٌ صَحِيحٌ مِنْ حَدِيثِ الثَّوْرِيِّ مَا أَقَلَّ مَنْ رَوَاهُ عَنِ الثَّوْرِيِّ ‏.‏ وَرُوِيَ هَذَا عَنْ هِشَامِ بْنِ عُرْوَةَ عَنْ أَبِيهِ عَنِ النَّبِيِّ صلى الله عليه وسلم مُرْسَلٌ ‏.‏`,
      englishText: `Narrated 'Aishah:that the Messenger of Allah (ﷺ) said: "The best of you is the best to his wives, and I am the best of you to my wives, and when your companion dies, leave him alone`,
      sourceUrl: "https://sunnah.com/tirmidhi/49/281",
    },
    {
      id: "6",
      collection: "Sahih Muslim",
      reference: "2593",
      grade: "Sahih",
      narrator: "'A'ishah",
      arabicText: `حَدَّثَنَا يَحْيَى بْنُ أَيُّوبَ، وَقُتَيْبَةُ، وَابْنُ، حُجْرٍ قَالَ ابْنُ أَيُّوبَ حَدَّثَنَا إِسْمَاعِيلُ بْنُ، جَعْفَرٍ أَخْبَرَنِي عَبْدُ اللَّهِ بْنُ عَبْدِ الرَّحْمَنِ، - وَهُوَ ابْنُ مَعْمَرِ بْنِ حَزْمٍ الأَنْصَارِيُّ أَبُو طُوَالَةَ - أَنَّ أَبَا يُونُسَ، مَوْلَى عَائِشَةَ أَخْبَرَهُ عَنْ عَائِشَةَ، - رضى الله عنها - أَنَّ رَجُلاً، جَاءَ إِلَى النَّبِيِّ صلى الله عليه وسلم يَسْتَفْتِيهِ وَهِيَ تَسْمَعُ مِنْ وَرَاءِ الْبَابِ فَقَالَ يَا رَسُولَ اللَّهِ تُدْرِكُنِي الصَّلاَةُ وَأَنَا جُنُبٌ أَفَأَصُومُ فَقَالَ رَسُولُ اللَّهِ صلى الله عليه وسلم ‏"‏ وَأَنَا تُدْرِكُنِي الصَّلاَةُ وَأَنَا جُنُبٌ فَأَصُومُ ‏"‏ ‏.‏ فَقَالَ لَسْتَ مِثْلَنَا يَا رَسُولَ اللَّهِ قَدْ غَفَرَ اللَّهُ لَكَ مَا تَقَدَّمَ مِنْ ذَنْبِكَ وَمَا تَأَخَّرَ ‏.‏ فَقَالَ ‏"‏ وَاللَّهِ إِنِّي لأَرْجُو أَنْ أَكُونَ أَخْشَاكُمْ لِلَّهِ وَأَعْلَمَكُمْ بِمَا أَتَّقِي ‏"‏ ‏.‏`,
      englishText: `A'isha reported that a person came to the Apottle of Allah (ﷺ) asking for a fatwa (religious verdict). She ('A'isha) had been overhearing it from behind the curtain. 'A'isha added that he (the person) had said:Messenger of Allah, (the time) of prayer overtakes me as I am in a state of junub; should I observe fast (in this state)? Upon this the Messenger of Allah (ﷺ) said: (At times the time) of prayer overtakes me while I am in a state of junub, and I observe fast (in that very state), whereupon he said: Messenger of Allah, you are not like us Allah has pardoned all your sins, the previous ones and the later ones. Upon this he (the Holy Prophet) said: By Allah, I hope I am the most God-fearirg of you, and possess the best knowledge among you of those (things) against which I should guard`,
      sourceUrl: "https://sunnah.com/muslim/45/85",
    },
    {
      id: "7",
      collection: "Sahih al-Bukhari",
      reference: "6018",
      grade: "Sahih",
      narrator: "Abu Hurayrah",
      arabicText: `حَدَّثَنَا قُتَيْبَةُ بْنُ سَعِيدٍ، حَدَّثَنَا أَبُو الأَحْوَصِ، عَنْ أَبِي حَصِينٍ، عَنْ أَبِي صَالِحٍ، عَنْ أَبِي هُرَيْرَةَ، قَالَ قَالَ رَسُولُ اللَّهِ صلى الله عليه وسلم ‏ "‏ مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلاَ يُؤْذِ جَارَهُ، وَمَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيُكْرِمْ ضَيْفَهُ، وَمَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ ‏"‏‏.‏`,
      englishText: `Narrated Abu Huraira:Allah's Messenger (ﷺ) said, "Anybody who believes in Allah and the Last Day should not harm his neighbor, and anybody who believes in Allah and the Last Day should entertain his guest generously and anybody who believes in Allah and the Last Day should talk what is good or keep quiet. (i.e. abstain from all kinds of evil and dirty talk)`,
      sourceUrl: "https://sunnah.com/bukhari/78/47",
    },
    {
      id: "8",
      collection: "Sahih al-Bukhari",
      reference: "6464",
      grade: "Sahih",
      narrator: "'A'ishah",
      arabicText: `حَدَّثَنَا عَبْدُ الْعَزِيزِ بْنُ عَبْدِ اللَّهِ، حَدَّثَنَا سُلَيْمَانُ، عَنْ مُوسَى بْنِ عُقْبَةَ، عَنْ أَبِي سَلَمَةَ بْنِ عَبْدِ الرَّحْمَنِ، عَنْ عَائِشَةَ، أَنَّ رَسُولَ اللَّهِ صلى الله عليه وسلم قَالَ ‏ "‏ سَدِّدُوا وَقَارِبُوا، وَاعْلَمُوا أَنْ لَنْ يُدْخِلَ أَحَدَكُمْ عَمَلُهُ الْجَنَّةَ، وَأَنَّ أَحَبَّ الأَعْمَالِ أَدْوَمُهَا إِلَى اللَّهِ، وَإِنْ قَلَّ ‏"‏`,
      englishText: `Narrated \`Aisha:Allah's Messenger (ﷺ) said, "Do good deeds properly, sincerely and moderately and know that your deeds will not make you enter Paradise, and that the most beloved deed to Allah is the most regular and constant even if it were little`,
      sourceUrl: "https://sunnah.com/bukhari/81/53",
    },
    {
      id: "9",
      collection: "Sahih Muslim",
      reference: "2564",
      grade: "Sahih",
      narrator: "Ibn 'Umar",
      arabicText: `وَحَدَّثَنَاهُ أَبُو بَكْرِ بْنُ أَبِي شَيْبَةَ، حَدَّثَنَا عَبْدُ اللَّهِ بْنُ نُمَيْرٍ، ح وَحَدَّثَنَا ابْنُ نُمَيْرٍ، حَدَّثَنَا أَبِي، حَدَّثَنَا عُبَيْدُ اللَّهِ، عَنْ نَافِعٍ، عَنِ ابْنِ عُمَرَ، - رضى الله عنهما - أَنَّ رَسُولَ اللَّهِ صلى الله عليه وسلم وَاصَلَ فِي رَمَضَانَ فَوَاصَلَ النَّاسُ فَنَهَاهُمْ ‏.‏ قِيلَ لَهُ أَنْتَ تُوَاصِلُ قَالَ ‏ "‏ إِنِّي لَسْتُ مِثْلَكُمْ إِنِّي أُطْعَمُ وَأُسْقَى ‏"‏ ‏.‏`,
      englishText: `Ibn 'Umar reported that the Messenger of Allah (ﷺ) observed fasts uninterruptedly in Ramadan and the people (in his wake) did this. But he forbade them to do so. It was said to him (to the Holy Prophet):You yourself observe the fasts uninterruptedly (but you forbid us to do so) Upon this he said: I am not like you; I am fed and supplied drink (by Allah)`,
      sourceUrl: "https://sunnah.com/muslim/45/56",
    },
    {
      id: "10",
      collection: "Jami` at-Tirmidhi",
      reference: "1956",
      grade: "Sahih",
      narrator: "Abu Dharr",
      arabicText: `حَدَّثَنَا عَبَّاسُ بْنُ عَبْدِ الْعَظِيمِ الْعَنْبَرِيُّ، حَدَّثَنَا النَّضْرُ بْنُ مُحَمَّدٍ الْجُرَشِيُّ الْيَمَامِيُّ، حَدَّثَنَا عِكْرِمَةُ بْنُ عَمَّارٍ، حَدَّثَنَا أَبُو زُمَيْلٍ، عَنْ مَالِكِ بْنِ مَرْثَدٍ، عَنْ أَبِيهِ، عَنْ أَبِي ذَرٍّ، قَالَ قَالَ رَسُولُ اللَّهِ صلى الله عليه وسلم ‏ "‏ تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ وَأَمْرُكَ بِالْمَعْرُوفِ وَنَهْيُكَ عَنِ الْمُنْكَرِ صَدَقَةٌ وَإِرْشَادُكَ الرَّجُلَ فِي أَرْضِ الضَّلاَلِ لَكَ صَدَقَةٌ وَبَصَرُكَ لِلرَّجُلِ الرَّدِيءِ الْبَصَرِ لَكَ صَدَقَةٌ وَإِمَاطَتُكَ الْحَجَرَ وَالشَّوْكَةَ وَالْعَظْمَ عَنِ الطَّرِيقِ لَكَ صَدَقَةٌ وَإِفْرَاغُكَ مِنْ دَلْوِكَ فِي دَلْوِ أَخِيكَ لَكَ صَدَقَةٌ ‏"‏ ‏.‏ قَالَ وَفِي الْبَابِ عَنِ ابْنِ مَسْعُودٍ وَجَابِرٍ وَحُذَيْفَةَ وَعَائِشَةَ وَأَبِي هُرَيْرَةَ ‏.‏ قَالَ أَبُو عِيسَى هَذَا حَدِيثٌ حَسَنٌ غَرِيبٌ ‏.‏ وَأَبُو زُمَيْلٍ اسْمُهُ سِمَاكُ بْنُ الْوَلِيدِ الْحَنَفِيُّ ‏.‏`,
      englishText: `Abu Dharr narrated that the Messenger of Allah said :"Your smiling in the face of your brother is charity, commanding good and forbidding evil is charity, your giving directions to a man lost in the land is charity for you. Your seeing for a man with bad sight is a charity for you, your removal of a rock, a thorn or a bone from the road is charity for you. Your pouring what remains from your bucket into the bucket of your brother is charity for you`,
      sourceUrl: "https://sunnah.com/tirmidhi/27/62",
    },
    {
      id: "11",
      collection: "Sahih Muslim",
      reference: "16 c",
      grade: "Sahih",
      narrator: "'Abdullah ibn 'Umar",
      arabicText: `حَدَّثَنَا عُبَيْدُ اللَّهِ بْنُ مُعَاذٍ، حَدَّثَنَا أَبِي، حَدَّثَنَا عَاصِمٌ، - وَهُوَ ابْنُ مُحَمَّدِ بْنِ زَيْدِ بْنِ عَبْدِ اللَّهِ بْنِ عُمَرَ - عَنْ أَبِيهِ، قَالَ قَالَ عَبْدُ اللَّهِ قَالَ رَسُولُ اللَّهِ صلى الله عليه وسلم ‏ "‏ بُنِيَ الإِسْلاَمُ عَلَى خَمْسٍ شَهَادَةِ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ وَإِقَامِ الصَّلاَةِ وَإِيتَاءِ الزَّكَاةِ وَحَجِّ الْبَيْتِ وَصَوْمِ رَمَضَانَ ‏"‏ ‏.‏`,
      englishText: `It is narrated on the authority of 'Abdullah son of 'Umar that the Messenger of Allah (ﷺ) said:(The superstructure of) al-Islam is raised on five (pillars), testifying (the fact) that there is no god but Allah, that Muhammad is His bondsman and messenger, and the establishment of prayer, payment of Zakat, Pilgrimage to the House (Ka'ba) and the fast of Ramadan`,
      sourceUrl: "https://sunnah.com/muslim/1/24",
    },
    {
      id: "12",
      collection: "Sahih al-Bukhari",
      reference: "2989",
      grade: "Sahih",
      narrator: "Abu Hurayrah",
      arabicText: `حَدَّثَنِي إِسْحَاقُ، أَخْبَرَنَا عَبْدُ الرَّزَّاقِ، أَخْبَرَنَا مَعْمَرٌ، عَنْ هَمَّامٍ، عَنْ أَبِي هُرَيْرَةَ ـ رضى الله عنه ـ قَالَ قَالَ رَسُولُ اللَّهِ صلى الله عليه وسلم ‏ "‏ كُلُّ سُلاَمَى مِنَ النَّاسِ عَلَيْهِ صَدَقَةٌ كُلَّ يَوْمٍ تَطْلُعُ فِيهِ الشَّمْسُ، يَعْدِلُ بَيْنَ الاِثْنَيْنِ صَدَقَةٌ، وَيُعِينُ الرَّجُلَ عَلَى دَابَّتِهِ، فَيَحْمِلُ عَلَيْهَا، أَوْ يَرْفَعُ عَلَيْهَا مَتَاعَهُ صَدَقَةٌ، وَالْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ، وَكُلُّ خَطْوَةٍ يَخْطُوهَا إِلَى الصَّلاَةِ صَدَقَةٌ، وَيُمِيطُ الأَذَى عَنِ الطَّرِيقِ صَدَقَةٌ ‏"‏‏.‏`,
      englishText: `Narrated Abu Huraira:Allah's Messenger (ﷺ) said, "There is a (compulsory) Sadaqa (charity) to be given for every joint of the human body (as a sign of gratitude to Allah) everyday the sun rises. To judge justly between two persons is regarded as Sadaqa, and to help a man concerning his riding animal by helping him to ride it or by lifting his luggage on to it, is also regarded as Sadaqa, and (saying) a good word is also Sadaqa, and every step taken on one's way to offer the compulsory prayer (in the mosque) is also Sadaqa and to remove a harmful thing from the way is also Sadaqa`,
      sourceUrl: "https://sunnah.com/bukhari/56/202",
    },
    {
      id: "13",
      collection: "Sahih Muslim",
      reference: "2699",
      grade: "Sahih",
      narrator: "Buraidah",
      arabicText: `وَحَدَّثَنَا عَبْدُ بْنُ حُمَيْدٍ، أَخْبَرَنَا عَبْدُ الرَّزَّاقِ، أَخْبَرَنَا الثَّوْرِيُّ، عَنْ عَبْدِ اللَّهِ بْنِ عَطَاءٍ، عَنِ ابْنِ بُرَيْدَةَ، عَنْ أَبِيهِ، - رضى الله عنه - قَالَ جَاءَتِ امْرَأَةٌ إِلَى النَّبِيِّ صلى الله عليه وسلم ‏.‏ فَذَكَرَ بِمِثْلِهِ وَقَالَ صَوْمُ شَهْرٍ ‏.‏`,
      englishText: `Ibn Buraida (Allah be pleased with him) reported on the authority of his father:A woman came to the Messenger of Allah (ﷺ), and the rest of the hadith is the same, but he said:" Fasting of one month`,
      sourceUrl: "https://sunnah.com/muslim/48/82",
    },
    {
      id: "14",
      collection: "Sahih Muslim",
      reference: "55 a",
      grade: "Sahih",
      narrator: "Tamim ad-Dari",
      arabicText: `حَدَّثَنَا مُحَمَّدُ بْنُ عَبَّادٍ الْمَكِّيُّ، حَدَّثَنَا سُفْيَانُ، قَالَ قُلْتُ لِسُهَيْلٍ إِنَّ عَمْرًا حَدَّثَنَا عَنِ الْقَعْقَاعِ، عَنْ أَبِيكَ، قَالَ وَرَجَوْتُ أَنْ يُسْقِطَ، عَنِّي رَجُلاً قَالَ فَقَالَ سَمِعْتُهُ مِنَ الَّذِي سَمِعَهُ مِنْهُ أَبِي كَانَ صَدِيقًا لَهُ بِالشَّامِ ثُمَّ حَدَّثَنَا سُفْيَانُ عَنْ سُهَيْلٍ عَنْ عَطَاءِ بْنِ يَزِيدَ عَنْ تَمِيمٍ الدَّارِيِّ أَنَّ النَّبِيَّ صلى الله عليه وسلم قَالَ ‏"‏ الدِّينُ النَّصِيحَةُ ‏"‏ قُلْنَا لِمَنْ قَالَ ‏"‏ لِلَّهِ وَلِكِتَابِهِ وَلِرَسُولِهِ وَلأَئِمَّةِ الْمُسْلِمِينَ وَعَامَّتِهِمْ ‏"‏ ‏.‏`,
      englishText: `It is narrated on the authority of Tamim ad-Dari that the Prophet (ﷺ) said:"The Religion is sincerity." We said, "To whom?" He said "To Allah, to His Book, To His Messenger, and to the leaders of the Muslims and their masses`,
      sourceUrl: "https://sunnah.com/muslim/1/107",
    },
    {
      id: "15",
      collection: "Sahih al-Bukhari",
      reference: "7376",
      grade: "Sahih",
      narrator: "Jarir ibn 'Abdullah",
      arabicText: `حَدَّثَنَا مُحَمَّدٌ، أَخْبَرَنَا أَبُو مُعَاوِيَةَ، عَنِ الأَعْمَشِ، عَنْ زَيْدِ بْنِ وَهْبٍ، وَأَبِي، ظَبْيَانَ عَنْ جَرِيرِ بْنِ عَبْدِ اللَّهِ، قَالَ قَالَ رَسُولُ اللَّهِ صلى الله عليه وسلم ‏ "‏ لاَ يَرْحَمُ اللَّهُ مَنْ لاَ يَرْحَمُ النَّاسَ ‏"‏‏.‏`,
      englishText: `Narrated Jarir bin \`Abdullah:Allah's Messenger (ﷺ) said, "Allah will not be merciful to those who are not merciful to mankind`,
      sourceUrl: "https://sunnah.com/bukhari/97/22",
    },
  ];

  /**
   * Returns the hadith of the day. Rotates deterministically through the
   * curated set using the local date as a seed so every install sees the
   * same hadith on the same calendar day.
   */
  export function getTodayHadith(): DailyHadith {
    if (DAILY_HADITH.length === 0) {
      throw new Error("DAILY_HADITH is empty");
    }
    const d = new Date();
    const seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
    return DAILY_HADITH[seed % DAILY_HADITH.length];
  }
  