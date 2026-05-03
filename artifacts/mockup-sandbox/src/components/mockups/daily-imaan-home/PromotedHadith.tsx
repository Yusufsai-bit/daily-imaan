import "./_group.css";
import {
  Compass, Leaf, BookOpen, ChevronRight, Play, Bookmark, Share2, Shuffle, Clock,
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
        <div className="self-start inline-block px-2.5 py-1 rounded-lg mb-3" style={{ background: "var(--di-secondary)" }}>
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

/* The defining move: Hadith promoted from a row in "Shortcuts" to a full content card
   that mirrors the Ayat card. Reads like daily content, not navigation. */
function HadithContentCard() {
  return (
    <div>
      <div className="flex items-center justify-between mb-2.5">
        <div className="font-['Inter'] font-semibold text-[11px] tracking-[1.2px]" style={{ color: "var(--di-muted-fg)" }}>
          HADITH OF THE DAY
        </div>
        <span className="font-['Inter'] text-[11px]" style={{ color: "var(--di-muted-fg)" }}>Riyad as-Salihin</span>
      </div>
      <div className="rounded-2xl p-5" style={{ background: "var(--di-card)", boxShadow: "var(--di-card-shadow)" }}>
        <div className="inline-block px-2.5 py-1 rounded-lg mb-3" style={{ background: "var(--di-accent-soft)" }}>
          <span className="font-['Inter'] font-semibold text-[12px]" style={{ color: "var(--di-accent)" }}>
            Book 1 · Hadith 1
          </span>
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
    </div>
  );
}

/* "I am feeling" promoted to a single emphasized card. Bigger heart icon, larger title,
   warmer copy. The only remaining tool entry on home — Qibla lives in the header. */
function FeelingCard() {
  return (
    <div className="rounded-2xl p-5 flex items-center gap-4" style={{ background: "var(--di-card)", boxShadow: "var(--di-card-shadow)" }}>
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
        style={{ background: "var(--di-primary-soft)" }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--di-primary)" }}>
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </div>
      <div className="flex-1">
        <div className="font-['Inter'] font-semibold text-[17px]" style={{ color: "var(--di-fg)" }}>
          I am feeling…
        </div>
        <div className="font-['Inter'] text-[13px] leading-[1.45] mt-0.5" style={{ color: "var(--di-muted-fg)" }}>
          Find a verse or du&apos;a for what&apos;s on your heart today
        </div>
      </div>
      <ChevronRight size={18} style={{ color: "var(--di-muted-fg)" }} />
    </div>
  );
}

export function PromotedHadith() {
  return (
    <div
      className="min-h-screen w-full"
      style={{ background: "var(--di-bg)", fontFamily: "Inter, system-ui, sans-serif" }}
    >
      <div className="px-5 pt-3 pb-24 flex flex-col gap-4">
        <Header />
        <PrayerBanner />
        <AyatCard />
        <HadithContentCard />
        <div>
          <div className="font-['Inter'] font-semibold text-[11px] tracking-[1.2px] mb-2.5" style={{ color: "var(--di-muted-fg)" }}>
            TODAY
          </div>
          <FeelingCard />
        </div>
      </div>
    </div>
  );
}
