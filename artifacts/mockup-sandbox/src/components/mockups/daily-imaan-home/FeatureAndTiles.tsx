import "./_group.css";
import {
  Compass, Leaf, BookOpen, BookText, ChevronRight, Play, Bookmark, Share2, Shuffle, Clock, Moon,
} from "lucide-react";

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
   share since its content (next prayer + time) is longer. */
function PrayerAndQiblaRow() {
  return (
    <div className="flex gap-2.5">
      {/* Countdown reads as utility instead of just info. */}
      <div className="flex-1 flex items-center gap-2 px-3.5 py-2.5 rounded-[10px]" style={{ background: "var(--di-primary)" }}>
        <Clock size={16} style={{ color: "rgba(255,255,255,0.8)" }} />
        <span className="font-['Inter'] font-medium text-[13px] text-white">Asr in 1h 23m</span>
        <span className="font-['Inter'] text-[12px]" style={{ color: "rgba(255,255,255,0.7)" }}>· 4:42 PM</span>
      </div>
      <div className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-[10px]" style={{ background: "var(--di-primary)" }}>
        <Compass size={16} style={{ color: "rgba(255,255,255,0.8)" }} />
        <span className="font-['Inter'] font-medium text-[13px] text-white">Qibla</span>
      </div>
    </div>
  );
}

/* Compact tile strip near the top — single row, icon + label (and an
   optional small muted subtitle for context, e.g. last-read surah).
   Title forced single-line + ellipsis so two tiles always feel balanced
   regardless of label length. Tappable through the full card. */
function CompactTile({
  icon, title, subtitle, iconBg, iconColor,
}: {
  icon: React.ReactNode; title: string; subtitle?: string; iconBg: string; iconColor: string;
}) {
  return (
    <div
      className="flex-1 min-w-0 rounded-2xl py-2.5 px-3 flex items-center gap-2"
      style={{ background: "var(--di-card)", boxShadow: "var(--di-card-shadow)" }}
    >
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
        {/* Tafsir Ibn Kathir snippet — verbatim, attributed. Lives inside
            the Ayat card so understanding sits next to the verse, instead
            of behind a separate tap. The "Read full tafsir" CTA also
            satisfies the symmetry with Hadith's "Read full hadith". */}
        <div className="mt-3 pt-3 pl-3 border-l-2" style={{ borderColor: "var(--di-accent)" }}>
          <div className="font-['Inter'] font-semibold text-[10px] tracking-[1.2px]" style={{ color: "var(--di-accent)" }}>
            TAFSIR · IBN KATHIR
          </div>
          <div className="font-['Inter'] text-[13px] leading-[1.55] mt-1.5" style={{ color: "#4a5240" }}>
            &ldquo;This is from the kindness, gentleness, and graciousness of Allah toward His creation.&rdquo;
          </div>
          <div className="flex items-center gap-1 mt-2">
            <span className="font-['Inter'] font-medium text-[12px]" style={{ color: "var(--di-primary)" }}>Read full tafsir</span>
            <ChevronRight size={13} style={{ color: "var(--di-primary)" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* Evening Adhkar card — surfaces after Asr (in the morning we'd swap to
   "Morning Adhkar"). Verbatim from Hisn al-Muslim / sunnah.com. Progress
   indicator turns it into a small daily ritual without gamifying it.
   Sits as the third content card, below Hadith. */
function AdhkarCard() {
  return (
    <div>
      <div className="font-['Inter'] font-semibold text-[11px] tracking-[1.2px] mb-2.5" style={{ color: "var(--di-muted-fg)" }}>
        EVENING ADHKAR
      </div>
      <div className="rounded-2xl p-5" style={{ background: "var(--di-card)", boxShadow: "var(--di-card-shadow)" }}>
        <div className="flex items-start gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "var(--di-primary-soft)" }}
          >
            <Moon size={20} style={{ color: "var(--di-primary)" }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-['Inter'] font-semibold text-[15px] leading-tight" style={{ color: "var(--di-fg)" }}>
              Begin your evening remembrance
            </div>
            <div className="font-['Inter'] text-[12.5px] leading-[1.5] mt-1" style={{ color: "var(--di-muted-fg)" }}>
              28 du&apos;as · about 7 minutes · from Hisn al-Muslim
            </div>
          </div>
        </div>
        {/* Progress strip — read like a journey, not a streak. */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-['Inter'] text-[11.5px]" style={{ color: "var(--di-muted-fg)" }}>0 of 28 read</span>
            <span className="font-['Inter'] text-[11.5px]" style={{ color: "var(--di-muted-fg)" }}>Best after Asr</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--di-secondary)" }}>
            <div className="h-full" style={{ width: "0%", background: "var(--di-primary)" }} />
          </div>
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t" style={{ borderColor: "var(--di-border)" }}>
          <span className="font-['Inter'] font-medium text-[13px]" style={{ color: "var(--di-primary)" }}>Start reading</span>
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
      <ChevronRight size={18} style={{ color: "var(--di-primary)", opacity: 0.6 }} />
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

        {/* Resume reading takes a full-width tile — it's the user's
            personal continuation, the most likely tap on a returning visit. */}
        <CompactTile
          icon={<BookText size={16} />}
          iconBg="var(--di-primary-soft)"
          iconColor="var(--di-primary)"
          title="Resume Qur'an"
          subtitle="Al-Baqarah 2:255"
        />

        {/* Daily content stack — Ayat (with tafsir inset) → Hadith →
            Evening Adhkar (time-aware) → Feeling hero as the gentle
            next step. */}
        <AyatCard />
        <HadithContentCard />
        <AdhkarCard />
        <FeelingHero />
      </div>
    </div>
  );
}
