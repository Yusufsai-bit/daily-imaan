import "./_group.css";
import {
  Compass, Leaf, BookOpen, Heart, Play, Bookmark, Share2, Shuffle, Clock,
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

/* Tile renders a square-ish card with large icon, title, and 1-line subtitle.
   Equal weight for all three entries — they're peer destinations. */
function Tile({
  icon, title, subtitle, iconBg, iconColor,
}: {
  icon: React.ReactNode; title: string; subtitle: string; iconBg: string; iconColor: string;
}) {
  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-2.5 aspect-square"
      style={{ background: "var(--di-card)", boxShadow: "var(--di-card-shadow)" }}
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center"
        style={{ background: iconBg, color: iconColor }}
      >
        {icon}
      </div>
      <div className="mt-auto">
        <div className="font-['Inter'] font-semibold text-[15px] leading-tight" style={{ color: "var(--di-fg)" }}>
          {title}
        </div>
        <div className="font-['Inter'] text-[12px] leading-[1.35] mt-1" style={{ color: "var(--di-muted-fg)" }}>
          {subtitle}
        </div>
      </div>
    </div>
  );
}

export function ToolsGrid() {
  return (
    <div
      className="min-h-screen w-full"
      style={{ background: "var(--di-bg)", fontFamily: "Inter, system-ui, sans-serif" }}
    >
      <div className="px-5 pt-3 pb-24 flex flex-col gap-4">
        <Header />
        <PrayerBanner />
        <AyatCard />

        <div>
          <div className="font-['Inter'] font-semibold text-[11px] tracking-[1.2px] mb-2.5" style={{ color: "var(--di-muted-fg)" }}>
            FOR YOUR DAY
          </div>
          {/* 2-column grid: feeling tile spans full width on row 1, hadith + qibla share row 2.
              Actually a cleaner pattern is 2 + 2: but we have 3 entries. Use row 1 = feeling
              (full width emphasized); row 2 = hadith | qibla peers. Wait — equal-weight
              hypothesis means all three should be peers. Use 2x2 with feeling spanning two? No —
              keep three equal square tiles in a row, then pad. Mobile width is tight, so do
              2 on row 1 and 1 on row 2, all equal squares. */}
          <div className="grid grid-cols-2 gap-3">
            <Tile
              icon={<Heart size={22} />}
              iconBg="var(--di-primary-soft)"
              iconColor="var(--di-primary)"
              title="I am feeling…"
              subtitle="Verses & du&apos;a for your heart"
            />
            <Tile
              icon={<BookOpen size={22} />}
              iconBg="var(--di-accent-soft)"
              iconColor="var(--di-accent)"
              title="Daily Hadith"
              subtitle="Riyad as-Salihin"
            />
            <Tile
              icon={<Compass size={22} />}
              iconBg="var(--di-primary-soft)"
              iconColor="var(--di-primary)"
              title="Qibla"
              subtitle="Direction to Makkah"
            />
            <div
              className="rounded-2xl p-4 flex flex-col justify-center aspect-square"
              style={{ background: "var(--di-secondary)" }}
            >
              <div className="font-['Lora'] italic text-[14px] leading-[1.45]" style={{ color: "var(--di-primary)" }}>
                &ldquo;Verily, with hardship comes ease.&rdquo;
              </div>
              <div className="font-['Inter'] text-[10px] tracking-[0.3px] mt-2" style={{ color: "var(--di-muted-fg)" }}>
                Quran 94:6
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
