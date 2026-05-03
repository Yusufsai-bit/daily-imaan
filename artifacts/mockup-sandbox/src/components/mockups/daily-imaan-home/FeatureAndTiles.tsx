import "./_group.css";
import {
  Compass, Leaf, BookOpen, BookText, ChevronRight, Play, Bookmark, Share2, Shuffle, Clock,
} from "lucide-react";

function Header() {
  return (
    <div className="flex items-start justify-between">
      <div>
        <div className="font-['Inter'] font-bold text-[26px] tracking-[-0.5px]" style={{ color: "var(--di-primary)" }}>
          Daily Imaan
        </div>
        <div className="font-['Inter'] text-[13px] mt-0.5" style={{ color: "var(--di-muted-fg)" }}>
          Sunday, May 3
        </div>
        <div className="font-['Inter'] font-medium text-[12px] mt-0.5 tracking-[0.2px]" style={{ color: "var(--di-primary)" }}>
          16 Dhul-Qa&apos;dah 1447 AH
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "var(--di-muted)" }}>
          <Compass size={18} style={{ color: "var(--di-primary)" }} />
        </div>
        <div className="flex items-center gap-1 px-3 py-1.5 rounded-full" style={{ background: "var(--di-secondary)" }}>
          <Leaf size={16} style={{ color: "var(--di-primary)" }} />
          <span className="font-['Inter'] font-bold text-[16px]" style={{ color: "var(--di-fg)" }}>12</span>
        </div>
      </div>
    </div>
  );
}

function PrayerBanner() {
  return (
    <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-[10px]" style={{ background: "var(--di-primary)" }}>
      <Clock size={16} style={{ color: "rgba(255,255,255,0.8)" }} />
      <span className="font-['Inter'] font-medium text-[13px] text-white">Next: Asr · 4:42 PM</span>
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
        <div className="font-['Inter'] text-[10px] tracking-[0.3px] mt-1" style={{ color: "var(--di-muted-fg)" }}>
          Translation: Saheeh International
        </div>
        <div className="flex gap-2 mt-3">
          <div className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-[10px]" style={{ background: "var(--di-secondary)" }}>
            <Play size={16} style={{ color: "var(--di-primary)" }} />
            <span className="font-['Inter'] font-medium text-[14px]" style={{ color: "var(--di-primary)" }}>Listen</span>
          </div>
          <div className="w-10 h-10 flex items-center justify-center rounded-[10px]" style={{ background: "var(--di-secondary)" }}>
            <Bookmark size={16} style={{ color: "var(--di-accent)" }} />
          </div>
          <div className="w-10 h-10 flex items-center justify-center rounded-[10px]" style={{ background: "var(--di-secondary)" }}>
            <Share2 size={16} style={{ color: "var(--di-muted-fg)" }} />
          </div>
          <div className="w-10 h-10 flex items-center justify-center rounded-[10px]" style={{ background: "var(--di-secondary)" }}>
            <Shuffle size={16} style={{ color: "var(--di-muted-fg)" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* Hero: "I am feeling" gets full-bleed treatment on a soft sage panel — it's the
   emotional gateway and most worth tapping. The whole card is the affordance, so
   no internal CTA is needed. */
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

/* Hadith promoted to a full content card under the feeling hero — same treatment
   as Variant 1. Lets the user read today's hadith without tapping. */
function HadithContentCard() {
  return (
    <div className="rounded-2xl p-5" style={{ background: "var(--di-card)", boxShadow: "var(--di-card-shadow)" }}>
      <div className="flex items-center justify-between mb-3">
        <div className="inline-block px-2.5 py-1 rounded-lg" style={{ background: "var(--di-accent-soft)" }}>
          <span className="font-['Inter'] font-semibold text-[12px]" style={{ color: "var(--di-accent)" }}>
            Hadith · Book 1 · 1
          </span>
        </div>
        <span className="font-['Inter'] text-[11px]" style={{ color: "var(--di-muted-fg)" }}>Riyad as-Salihin</span>
      </div>
      <div className="text-right font-['Amiri'] text-[20px] leading-[1.9]" style={{ color: "var(--di-fg)", direction: "rtl" }}>
        إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ
      </div>
      <div className="h-px my-3" style={{ background: "var(--di-border)" }} />
      <div className="font-['Inter'] text-[14px] leading-[1.6]" style={{ color: "#374151" }}>
        &ldquo;The reward of deeds depends upon the intentions and every person will get the reward according to what he has intended.&rdquo;
      </div>
      <div className="font-['Inter'] text-[10px] tracking-[0.3px] mt-1.5" style={{ color: "var(--di-muted-fg)" }}>
        Narrated by &lsquo;Umar ibn al-Khattab · Sahih
      </div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t" style={{ borderColor: "var(--di-border)" }}>
        <span className="font-['Inter'] font-medium text-[13px]" style={{ color: "var(--di-primary)" }}>Read full hadith</span>
        <ChevronRight size={16} style={{ color: "var(--di-primary)" }} />
      </div>
    </div>
  );
}

/* Secondary: Hadith + Qibla as a 2-up tile pair below the hero. Equal weight to
   each other but visually subordinate to the feeling hero. */
function SecondaryTile({
  icon, title, subtitle, iconBg, iconColor,
}: {
  icon: React.ReactNode; title: string; subtitle: string; iconBg: string; iconColor: string;
}) {
  return (
    <div
      className="flex-1 rounded-2xl p-4 flex flex-col gap-2.5"
      style={{ background: "var(--di-card)", boxShadow: "var(--di-card-shadow)" }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center"
        style={{ background: iconBg, color: iconColor }}
      >
        {icon}
      </div>
      <div>
        <div className="font-['Inter'] font-semibold text-[14px] leading-tight" style={{ color: "var(--di-fg)" }}>
          {title}
        </div>
        <div className="font-['Inter'] text-[11.5px] leading-[1.4] mt-1" style={{ color: "var(--di-muted-fg)" }}>
          {subtitle}
        </div>
      </div>
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
        <PrayerBanner />

        {/* Quick-access tiles surfaced near the top so the most-used tools
            (Qur'an reader + Qibla) are one tap from landing. */}
        <div className="flex gap-3">
          <SecondaryTile
            icon={<BookText size={20} />}
            iconBg="var(--di-primary-soft)"
            iconColor="var(--di-primary)"
            title="Read Qur'an"
            subtitle="Browse all 114 surahs"
          />
          <SecondaryTile
            icon={<Compass size={20} />}
            iconBg="var(--di-accent-soft)"
            iconColor="var(--di-accent)"
            title="Qibla"
            subtitle="Direction to Makkah"
          />
        </div>

        {/* Daily content stack: Ayat → Feeling hero → Hadith. No section
            header — let the cards speak. */}
        <AyatCard />
        <FeelingHero />
        <HadithContentCard />
      </div>
    </div>
  );
}
