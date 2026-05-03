import "./_group.css";
import {
  Compass, Leaf, BookOpen, BookText, ChevronRight, Play, Bookmark, Share2, Shuffle, Clock, Sunrise,
} from "lucide-react";

/* =========================================================================
   Daily Imaan — Home (Variant 3, ready-to-graduate)
   Design decisions resolved in this mockup. Carry these to the Expo app.

   1. ADHKAR LABEL TIMING
      - Fajr  → Dhuhr   : "Morning Adhkar"  (subtitle: "Best before Asr")
      - Dhuhr → Asr     : "Morning Adhkar"  (subtitle: "Best before Asr")
      - Asr   → Maghrib : "Evening Adhkar"  (subtitle: "Best after Asr")
      - After Maghrib   : "Evening Adhkar"  (subtitle: "Best after Asr")
      Mockup shows the pre-Asr state so the label reads "Morning Adhkar".

   2. FIRST-RUN / EMPTY STATES
      - Resume Qur'an :  no last-read   → title "Start the Qur'an",
                                          subtitle "Begin with Al-Fatiha"
                         has last-read  → title "Resume Qur'an",
                                          subtitle "<Surah> <ayah>"
      - Adhkar count  :  resets daily at Fajr (not lifetime)
                         first time today → "0 of 28 read · ~7 min"
      - Streak chip   :  day 1 shows "1 day streak" (never 0/empty)

   3. TAPPABLE PRAYER PILL
      The whole green pill on the left is a tap target that opens the full
      day's prayer schedule. Whole-pill tap, no inline chevron clutter.

   4. DETERMINISTIC PER-DAY HADITH
      Pick once per Hijri date (deterministic seed: hash(date) mod
      collection length). Same hadith for every user on a given day; do
      NOT randomize on each open.

   5. BOOKMARK STATE
      Bookmark icon is muted when the ayah is unsaved (state shown here);
      switch to filled `--di-accent` when saved. No other state changes.

   6. HERO CHEVRON
      Full opacity for older-eye legibility (was 60%).

   7. PRAYER PILL ROBUSTNESS
      Long content like "Maghrib in 12h 45m · 7:18 PM" must not wrap.
      Title is whitespace-nowrap; secondary time string can truncate.

   8. TAB BAR CLEARANCE
      Wrapper has pb-24 so the Feeling hero gradient doesn't get clipped
      by the bottom tab bar in the real app.
   ========================================================================= */

/* Header
   - Wordmark in ink (was primary green) — frees the eye from the green stack
     of brand mark + hijri + prayer banner that was happening at the top.
   - Hijri date in stone/muted — informational, not headline.
   - Header compass dropped — Qibla lives as a tile below, no duplication.
   - Streak kept (per user). */
function Header() {
  return (
    <div className="flex items-start justify-between">
      <div>
        <div className="font-['Inter'] font-bold text-[26px] tracking-[-0.5px]" style={{ color: "var(--di-fg)" }}>
          Daily Imaan
        </div>
        <div className="font-['Inter'] text-[13px] mt-0.5" style={{ color: "var(--di-muted-fg)" }}>
          Sunday, May 3
        </div>
        <div className="font-['Inter'] text-[12px] mt-0.5 tracking-[0.2px]" style={{ color: "var(--di-muted-fg)" }}>
          16 Dhul-Qa&apos;dah 1447 AH
        </div>
      </div>
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: "var(--di-secondary)" }}>
        <Leaf size={15} style={{ color: "var(--di-primary)" }} />
        <span className="font-['Inter'] font-bold text-[15px]" style={{ color: "var(--di-fg)" }}>12</span>
        <span className="font-['Inter'] font-medium text-[12px]" style={{ color: "var(--di-muted-fg)" }}>day streak</span>
      </div>
    </div>
  );
}

/* Prayer + Qibla pair: same primary-green pill style so they read as
   "today's two time-sensitive prayer essentials." Prayer takes the wider
   share. Whole left pill is tappable → opens the full daily schedule.
   Title is nowrap-protected; the secondary time can truncate on narrow
   widths so "Maghrib in 12h 45m" never breaks the row. */
function PrayerAndQiblaRow() {
  return (
    <div className="flex gap-2.5">
      <div className="flex-1 min-w-0 flex items-center gap-2 px-3.5 py-2.5 rounded-[10px]" style={{ background: "var(--di-primary)" }}>
        <Clock size={16} style={{ color: "rgba(255,255,255,0.8)" }} className="shrink-0" />
        <span className="font-['Inter'] font-medium text-[13px] text-white whitespace-nowrap">Asr in 1h 23m</span>
        <span className="font-['Inter'] text-[12px] truncate" style={{ color: "rgba(255,255,255,0.7)" }}>· 4:42 PM</span>
      </div>
      <div className="shrink-0 flex items-center gap-1.5 px-3.5 py-2.5 rounded-[10px]" style={{ background: "var(--di-primary)" }}>
        <Compass size={16} style={{ color: "rgba(255,255,255,0.8)" }} />
        <span className="font-['Inter'] font-medium text-[13px] text-white">Qibla</span>
      </div>
    </div>
  );
}

/* Compact action tile — icon + title (+ optional subtitle, + optional
   thin progress strip). Title forced single-line + ellipsis so the row
   stays balanced. Tappable through the whole card. Progress strip opt-in
   for tiles that represent a daily journey (e.g. Adhkar). */
function CompactTile({
  icon, title, subtitle, iconBg, iconColor, progress,
}: {
  icon: React.ReactNode; title: string; subtitle?: string; iconBg: string; iconColor: string;
  progress?: number; // 0–1
}) {
  return (
    <div
      className="rounded-2xl py-2.5 px-3 flex flex-col gap-2"
      style={{ background: "var(--di-card)", boxShadow: "var(--di-card-shadow)" }}
    >
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: iconBg, color: iconColor }}
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-['Inter'] font-semibold text-[14px] leading-tight truncate" style={{ color: "var(--di-fg)" }}>
            {title}
          </div>
          {subtitle && (
            <div className="font-['Inter'] text-[11.5px] leading-tight mt-1 truncate" style={{ color: "var(--di-muted-fg)" }}>
              {subtitle}
            </div>
          )}
        </div>
      </div>
      {typeof progress === "number" && (
        <div className="h-1 rounded-full overflow-hidden" style={{ background: "var(--di-secondary)" }}>
          <div className="h-full" style={{ width: `${Math.max(0, Math.min(1, progress)) * 100}%`, background: "var(--di-primary)" }} />
        </div>
      )}
    </div>
  );
}

function AyatCard() {
  return (
    <div>
      <div className="font-['Inter'] font-semibold text-[11px] tracking-[1.2px] mb-2.5" style={{ color: "var(--di-muted-fg)" }}>
        AYAT OF THE DAY
      </div>
      <div className="rounded-2xl p-5" style={{ background: "var(--di-card)", boxShadow: "var(--di-ayat-shadow)" }}>
        <div className="inline-block px-2.5 py-1 rounded-lg mb-3" style={{ background: "var(--di-secondary)" }}>
          <span className="font-['Inter'] font-semibold text-[12px]" style={{ color: "var(--di-primary)" }}>
            Al-Baqarah · 2:286
          </span>
        </div>
        <div className="text-right font-['Amiri'] text-[26px] leading-[1.85]" style={{ color: "var(--di-fg)", direction: "rtl" }}>
          لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا
        </div>
        <div className="h-px my-3" style={{ background: "var(--di-border)" }} />
        <div className="font-['Inter'] text-[15px] leading-[1.6]" style={{ color: "#374151" }}>
          &ldquo;Allah does not charge a soul except [with that within] its capacity.&rdquo;
        </div>
        <div className="font-['Inter'] text-[12px] tracking-[0.2px] mt-1.5" style={{ color: "var(--di-muted-fg)" }}>
          Translation: Saheeh International
        </div>
        <div className="flex gap-2 mt-3">
          {/* Filled primary so Listen actually wins as the lead action,
              instead of blending in with the secondary icon buttons. */}
          <div className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-[10px]" style={{ background: "var(--di-primary)" }}>
            <Play size={16} style={{ color: "white" }} />
            <span className="font-['Inter'] font-medium text-[14px] text-white">Listen</span>
          </div>
          {/* All three secondary actions share the muted treatment.
              Bookmark gets its colored/filled state only when actually saved. */}
          <div className="w-10 h-10 flex items-center justify-center rounded-[10px]" style={{ background: "var(--di-secondary)" }}>
            <Bookmark size={16} style={{ color: "var(--di-muted-fg)" }} />
          </div>
          <div className="w-10 h-10 flex items-center justify-center rounded-[10px]" style={{ background: "var(--di-secondary)" }}>
            <Share2 size={16} style={{ color: "var(--di-muted-fg)" }} />
          </div>
          <div className="w-10 h-10 flex items-center justify-center rounded-[10px]" style={{ background: "var(--di-secondary)" }}>
            <Shuffle size={16} style={{ color: "var(--di-muted-fg)" }} />
          </div>
        </div>
        {/* Mirrors the Hadith card's "Read full hadith" CTA so the two
            content cards feel like a real pair. */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t" style={{ borderColor: "var(--di-border)" }}>
          <span className="font-['Inter'] font-medium text-[13px]" style={{ color: "var(--di-primary)" }}>Read in Al-Baqarah</span>
          <ChevronRight size={16} style={{ color: "var(--di-primary)" }} />
        </div>
      </div>
    </div>
  );
}

/* Hadith card mirrors Ayat: outer "HADITH OF THE DAY" label so users who
   don't know Riyad as-Salihin's numbering still know what they're reading.
   Internal badge is the source book (the meaningful info), with the hadith
   number as muted metadata on the right. */
function HadithContentCard() {
  return (
    <div>
      <div className="font-['Inter'] font-semibold text-[11px] tracking-[1.2px] mb-2.5" style={{ color: "var(--di-muted-fg)" }}>
        HADITH OF THE DAY
      </div>
      <div className="rounded-2xl p-5" style={{ background: "var(--di-card)", boxShadow: "var(--di-card-shadow)" }}>
        <div className="flex items-center justify-between mb-3">
          <div className="inline-block px-2.5 py-1 rounded-lg" style={{ background: "var(--di-accent-soft)" }}>
            <span className="font-['Inter'] font-semibold text-[12px]" style={{ color: "var(--di-accent)" }}>
              Riyad as-Salihin
            </span>
          </div>
          <span className="font-['Inter'] text-[11px]" style={{ color: "var(--di-muted-fg)" }}>Book 1 · Hadith 1</span>
        </div>
        <div className="text-right font-['Amiri'] text-[20px] leading-[1.9]" style={{ color: "var(--di-fg)", direction: "rtl" }}>
          إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ
        </div>
        <div className="h-px my-3" style={{ background: "var(--di-border)" }} />
        <div className="font-['Inter'] text-[14px] leading-[1.6]" style={{ color: "#374151" }}>
          &ldquo;The reward of deeds depends upon the intentions and every person will get the reward according to what he has intended.&rdquo;
        </div>
        <div className="font-['Inter'] text-[12px] tracking-[0.2px] mt-1.5" style={{ color: "var(--di-muted-fg)" }}>
          Narrated by &lsquo;Umar ibn al-Khattab · Sahih
        </div>
        {/* Same secondary action row as the Ayat card — bookmark, share,
            shuffle. No Listen (no audio recitation for hadith yet). All
            muted; bookmark fills `--di-accent` only when actually saved. */}
        <div className="flex gap-2 mt-3 justify-end">
          <div className="w-10 h-10 flex items-center justify-center rounded-[10px]" style={{ background: "var(--di-secondary)" }}>
            <Bookmark size={16} style={{ color: "var(--di-muted-fg)" }} />
          </div>
          <div className="w-10 h-10 flex items-center justify-center rounded-[10px]" style={{ background: "var(--di-secondary)" }}>
            <Share2 size={16} style={{ color: "var(--di-muted-fg)" }} />
          </div>
          <div className="w-10 h-10 flex items-center justify-center rounded-[10px]" style={{ background: "var(--di-secondary)" }}>
            <Shuffle size={16} style={{ color: "var(--di-muted-fg)" }} />
          </div>
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t" style={{ borderColor: "var(--di-border)" }}>
          <span className="font-['Inter'] font-medium text-[13px]" style={{ color: "var(--di-primary)" }}>Read full hadith</span>
          <ChevronRight size={16} style={{ color: "var(--di-primary)" }} />
        </div>
      </div>
    </div>
  );
}

/* Hero: gentle next step after the content. Whole card is the affordance. */
function FeelingHero() {
  return (
    <div
      className="rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, var(--di-sage) 0%, var(--di-cream) 100%)",
      }}
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
        style={{ background: "rgba(255,255,255,0.7)" }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--di-primary)" }}>
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </div>
      <div className="flex-1">
        <div className="font-['Lora'] text-[20px] leading-[1.3] tracking-[-0.01em]" style={{ color: "var(--di-primary)" }}>
          How is your heart today?
        </div>
        <div className="font-['Inter'] text-[13px] leading-[1.5] mt-1.5" style={{ color: "#3a4a40" }}>
          Find a verse or du&apos;a for what&apos;s on your heart today.
        </div>
      </div>
      <ChevronRight size={18} style={{ color: "var(--di-primary)" }} />
    </div>
  );
}

export function FeatureAndTiles() {
  return (
    <div
      className="min-h-screen w-full"
      style={{ background: "var(--di-bg)", fontFamily: "Inter, system-ui, sans-serif" }}
    >
      <div className="px-5 pt-3 pb-24 flex flex-col gap-4">
        <Header />
        <PrayerAndQiblaRow />

        {/* Two personal-action tiles — same compact format. Resume Qur'an
            is where the user left off; Adhkar is the time-aware ritual
            (label swaps to "Morning Adhkar" before noon). Both live above
            the daily content as quick taps. */}
        <CompactTile
          icon={<BookText size={16} />}
          iconBg="var(--di-primary-soft)"
          iconColor="var(--di-primary)"
          title="Resume Qur'an"
          subtitle="Al-Baqarah 2:255"
        />
        {/* Adhkar label is time-aware (see header rule 1). The screen
            time here is pre-Asr, so the label is "Morning Adhkar" with
            "Best before Asr." Progress strip resets daily at Fajr. */}
        <CompactTile
          icon={<Sunrise size={16} />}
          iconBg="var(--di-primary-soft)"
          iconColor="var(--di-primary)"
          title="Morning Adhkar"
          subtitle="0 of 28 read · best before Asr"
          progress={0}
        />

        {/* Daily content stack — Ayat → Hadith → Feeling hero. */}
        <AyatCard />
        <HadithContentCard />
        <FeelingHero />
      </div>
    </div>
  );
}
