const COLORS = {
  emerald: { name: "Emerald", role: "Primary", hex: "#1A6B4A", on: "light" },
  forest: { name: "Forest Ink", role: "Primary deep", hex: "#0F3B2C", on: "light" },
  sage: { name: "Sage Mist", role: "Tint / dividers", hex: "#D9E8DE", on: "dark" },
  cream: { name: "Manuscript Cream", role: "Canvas", hex: "#F7F1E3", on: "dark" },
  lantern: { name: "Lantern White", role: "Surface", hex: "#FBFAF6", on: "dark" },
  gold: { name: "Aged Gold", role: "Accent (sparing)", hex: "#C9A24A", on: "dark" },
  ink: { name: "Night Ink", role: "Body text", hex: "#1B1F1D", on: "light" },
  stone: { name: "Stone", role: "Muted text", hex: "#6B7368", on: "light" },
} as const;

function Swatch({
  hex, name, role, on,
}: { hex: string; name: string; role: string; on: "light" | "dark" }) {
  return (
    <div className="flex flex-col">
      <div
        className="h-32 w-full rounded-2xl flex items-end p-4"
        style={{
          backgroundColor: hex,
          boxShadow: "inset 0 0 0 1px rgba(15, 59, 44, 0.08)",
        }}
      >
        <span
          className="font-['Inter'] text-[11px] tracking-[0.14em] uppercase"
          style={{ color: on === "light" ? "rgba(255,255,255,0.85)" : "rgba(27,31,29,0.65)" }}
        >
          {role}
        </span>
      </div>
      <div className="mt-3 flex items-baseline justify-between">
        <span className="font-['Lora'] text-[15px]" style={{ color: COLORS.ink.hex }}>
          {name}
        </span>
        <span
          className="font-['Inter'] text-[12px] tabular-nums tracking-wider"
          style={{ color: COLORS.stone.hex }}
        >
          {hex.toUpperCase()}
        </span>
      </div>
    </div>
  );
}

function SectionTitle({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="mb-8">
      <div
        className="font-['Inter'] text-[11px] tracking-[0.24em] uppercase mb-2"
        style={{ color: COLORS.gold.hex }}
      >
        {kicker}
      </div>
      <h2
        className="font-['Lora'] text-[34px] leading-[1.15] tracking-[-0.01em]"
        style={{ color: COLORS.ink.hex }}
      >
        {title}
      </h2>
    </div>
  );
}

function HairlineDivider() {
  return (
    <div
      className="my-20 h-px w-full"
      style={{
        background: `linear-gradient(to right, transparent, ${COLORS.sage.hex} 20%, ${COLORS.sage.hex} 80%, transparent)`,
      }}
    />
  );
}

export function BrandGuide() {
  return (
    <div
      className="min-h-screen w-full"
      style={{
        backgroundColor: COLORS.cream.hex,
        color: COLORS.ink.hex,
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <div className="mx-auto max-w-[1100px] px-16 py-20">

        {/* COVER */}
        <header className="border-b pb-16" style={{ borderColor: COLORS.sage.hex }}>
          <div className="flex items-center gap-3 mb-12">
            <div
              className="h-10 w-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: COLORS.emerald.hex }}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                <path
                  d="M16 4a8 8 0 1 0 4 14.5A9 9 0 0 1 16 4z"
                  fill={COLORS.cream.hex}
                />
              </svg>
            </div>
            <span className="font-['Lora'] text-[17px]" style={{ color: COLORS.ink.hex }}>
              daily imaan
            </span>
          </div>

          <div
            className="font-['Inter'] text-[12px] tracking-[0.28em] uppercase mb-6"
            style={{ color: COLORS.gold.hex }}
          >
            Brand Guide · v1.0
          </div>
          <h1
            className="font-['Lora'] text-[68px] leading-[1.05] tracking-[-0.02em] max-w-[820px]"
            style={{ color: COLORS.ink.hex }}
          >
            A gentle daily return to the words of Allah.
          </h1>
          <p
            className="mt-8 max-w-[640px] text-[17px] leading-[1.65]"
            style={{ color: COLORS.stone.hex }}
          >
            Daily Imaan is for busy Muslims. One verse a day, in your own time, with no streaks
            to break and nothing to feel guilty about. The brand should feel like a quiet room
            with sunlight in it — calm, generous, and reverent.
          </p>
        </header>

        <HairlineDivider />

        {/* ESSENCE */}
        <section>
          <SectionTitle kicker="01 — Essence" title="What we are, and what we never become." />
          <div className="grid grid-cols-2 gap-10">
            <div
              className="rounded-2xl p-8"
              style={{ backgroundColor: COLORS.lantern.hex, border: `1px solid ${COLORS.sage.hex}` }}
            >
              <div
                className="font-['Inter'] text-[11px] tracking-[0.2em] uppercase mb-4"
                style={{ color: COLORS.emerald.hex }}
              >
                We are
              </div>
              <ul className="space-y-3 text-[15px] leading-[1.6]" style={{ color: COLORS.ink.hex }}>
                <li>· Calm and unhurried</li>
                <li>· Reverent toward the text — never casual with it</li>
                <li>· Generous: zero ads, zero gamification, zero dark patterns</li>
                <li>· A companion, not a coach</li>
                <li>· Quiet enough to read on a tired evening</li>
              </ul>
            </div>
            <div
              className="rounded-2xl p-8"
              style={{ backgroundColor: COLORS.lantern.hex, border: `1px solid ${COLORS.sage.hex}` }}
            >
              <div
                className="font-['Inter'] text-[11px] tracking-[0.2em] uppercase mb-4"
                style={{ color: "#A65A4A" }}
              >
                We are not
              </div>
              <ul className="space-y-3 text-[15px] leading-[1.6]" style={{ color: COLORS.ink.hex }}>
                <li>· Streak-shaming or guilt-inducing</li>
                <li>· An AI commentary on the Qur'an</li>
                <li>· Loud, branded, or "engagement-driven"</li>
                <li>· A scholar — we cite, we never interpret</li>
                <li>· Trying to be everything (Tasbih, Qibla, Adhan, etc.)</li>
              </ul>
            </div>
          </div>
        </section>

        <HairlineDivider />

        {/* COLOR */}
        <section>
          <SectionTitle kicker="02 — Color" title="A palette of paper, leaf, and lamplight." />
          <p
            className="max-w-[680px] text-[15px] leading-[1.7] mb-10"
            style={{ color: COLORS.stone.hex }}
          >
            Emerald carries the brand — it's already the icon background and ties the app to
            the long visual tradition of Islamic manuscripts and tilework. Cream and Sage do the
            heavy lifting in surfaces; Aged Gold appears only as illumination, never as decoration.
          </p>
          <div className="grid grid-cols-4 gap-6">
            <Swatch {...COLORS.emerald} />
            <Swatch {...COLORS.forest} />
            <Swatch {...COLORS.sage} />
            <Swatch {...COLORS.cream} />
            <Swatch {...COLORS.lantern} />
            <Swatch {...COLORS.gold} />
            <Swatch {...COLORS.ink} />
            <Swatch {...COLORS.stone} />
          </div>

          <div
            className="mt-12 rounded-2xl p-6 grid grid-cols-3 gap-6"
            style={{ backgroundColor: COLORS.lantern.hex, border: `1px solid ${COLORS.sage.hex}` }}
          >
            <div>
              <div className="font-['Inter'] text-[11px] tracking-[0.2em] uppercase mb-2" style={{ color: COLORS.stone.hex }}>
                Primary action
              </div>
              <div className="font-['Lora'] text-[15px]" style={{ color: COLORS.ink.hex }}>
                Emerald on Cream
              </div>
              <div className="font-['Inter'] text-[12px] mt-1" style={{ color: COLORS.stone.hex }}>
                Contrast 6.4 : 1 · AA Large
              </div>
            </div>
            <div>
              <div className="font-['Inter'] text-[11px] tracking-[0.2em] uppercase mb-2" style={{ color: COLORS.stone.hex }}>
                Body text
              </div>
              <div className="font-['Lora'] text-[15px]" style={{ color: COLORS.ink.hex }}>
                Night Ink on Cream
              </div>
              <div className="font-['Inter'] text-[12px] mt-1" style={{ color: COLORS.stone.hex }}>
                Contrast 14.1 : 1 · AAA
              </div>
            </div>
            <div>
              <div className="font-['Inter'] text-[11px] tracking-[0.2em] uppercase mb-2" style={{ color: COLORS.stone.hex }}>
                Quiet metadata
              </div>
              <div className="font-['Lora'] text-[15px]" style={{ color: COLORS.ink.hex }}>
                Stone on Cream
              </div>
              <div className="font-['Inter'] text-[12px] mt-1" style={{ color: COLORS.stone.hex }}>
                Contrast 4.9 : 1 · AA
              </div>
            </div>
          </div>
        </section>

        <HairlineDivider />

        {/* TYPOGRAPHY */}
        <section>
          <SectionTitle kicker="03 — Typography" title="Three voices. One library." />
          <p
            className="max-w-[680px] text-[15px] leading-[1.7] mb-10"
            style={{ color: COLORS.stone.hex }}
          >
            All Google Fonts. <span style={{ color: COLORS.ink.hex }}>Lora</span> for headlines and
            anything that should feel literary. <span style={{ color: COLORS.ink.hex }}>Inter</span>{" "}
            for everything functional. <span style={{ color: COLORS.ink.hex }}>Amiri</span> — Khaled
            Hosny's classical naskh — is the only typeface that touches Arabic text.
          </p>

          <div className="space-y-10">

            {/* Lora */}
            <div
              className="rounded-2xl p-10"
              style={{ backgroundColor: COLORS.lantern.hex, border: `1px solid ${COLORS.sage.hex}` }}
            >
              <div className="flex items-baseline justify-between mb-6">
                <div className="font-['Lora'] text-[28px]" style={{ color: COLORS.ink.hex }}>
                  Lora
                </div>
                <div className="font-['Inter'] text-[12px] tracking-[0.18em] uppercase" style={{ color: COLORS.stone.hex }}>
                  Display · Headlines · Verse English
                </div>
              </div>
              <div className="font-['Lora'] text-[42px] leading-[1.15] tracking-[-0.01em]" style={{ color: COLORS.ink.hex }}>
                Indeed, with hardship comes ease.
              </div>
              <div className="font-['Lora'] text-[18px] italic leading-[1.55] mt-6 max-w-[640px]" style={{ color: COLORS.stone.hex }}>
                A humanist serif with quiet personality. Use 400 / 500 / 600. Avoid 700 — it
                competes with the Arabic.
              </div>
            </div>

            {/* Inter */}
            <div
              className="rounded-2xl p-10"
              style={{ backgroundColor: COLORS.lantern.hex, border: `1px solid ${COLORS.sage.hex}` }}
            >
              <div className="flex items-baseline justify-between mb-6">
                <div className="font-['Inter'] text-[28px] font-medium" style={{ color: COLORS.ink.hex }}>
                  Inter
                </div>
                <div className="font-['Inter'] text-[12px] tracking-[0.18em] uppercase" style={{ color: COLORS.stone.hex }}>
                  Body · UI · Metadata
                </div>
              </div>
              <div className="font-['Inter'] text-[15px] leading-[1.65] max-w-[640px]" style={{ color: COLORS.ink.hex }}>
                Weight 400 for body, 500 for emphasis, 600 for buttons. Use the optical-size axis —
                set 14–16 for paragraph text and 24+ for UI labels at small sizes. Tabular numerals
                for ayah and surah numbers.
              </div>
              <div className="mt-5 flex items-center gap-6 font-['Inter'] text-[12px] tracking-[0.14em] uppercase" style={{ color: COLORS.stone.hex }}>
                <span>Surah · 94</span>
                <span style={{ color: COLORS.sage.hex }}>•</span>
                <span>Ayah · 5–6</span>
                <span style={{ color: COLORS.sage.hex }}>•</span>
                <span>Read · Today</span>
              </div>
            </div>

            {/* Amiri */}
            <div
              className="rounded-2xl p-10"
              style={{
                backgroundColor: COLORS.lantern.hex,
                border: `1px solid ${COLORS.sage.hex}`,
                backgroundImage: `radial-gradient(circle at 90% 0%, rgba(201,162,74,0.05), transparent 50%)`,
              }}
            >
              <div className="flex items-baseline justify-between mb-6">
                <div
                  className="text-[28px]"
                  style={{ fontFamily: "Amiri, serif", color: COLORS.ink.hex }}
                  dir="rtl"
                >
                  أميري
                </div>
                <div className="font-['Inter'] text-[12px] tracking-[0.18em] uppercase" style={{ color: COLORS.stone.hex }}>
                  Arabic · Qur'an · Sacred text only
                </div>
              </div>
              <div
                dir="rtl"
                className="text-[44px] leading-[2.0] tracking-normal"
                style={{ fontFamily: "Amiri, serif", color: COLORS.ink.hex }}
              >
                فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ ٱلْعُسْرِ يُسْرًا
              </div>
              <div
                className="font-['Lora'] italic text-[16px] leading-[1.55] mt-6 max-w-[640px]"
                style={{ color: COLORS.stone.hex }}
              >
                "For indeed, with hardship will be ease. Indeed, with hardship will be ease."
                <span className="block mt-1 not-italic font-['Inter'] text-[12px] tracking-[0.14em] uppercase">
                  Surah Ash-Sharh · 94 : 5–6 · Saheeh International
                </span>
              </div>
            </div>
          </div>

          {/* Type scale */}
          <div className="mt-12">
            <div className="font-['Inter'] text-[11px] tracking-[0.22em] uppercase mb-6" style={{ color: COLORS.stone.hex }}>
              Type scale (mobile)
            </div>
            <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${COLORS.sage.hex}` }}>
              {[
                { token: "display", size: "32 / 38", weight: "Lora 500", sample: "Welcome back." },
                { token: "title",   size: "22 / 28", weight: "Lora 500", sample: "Your verse for today" },
                { token: "verse",   size: "18 / 30", weight: "Lora 400", sample: "Indeed, with hardship comes ease." },
                { token: "body",    size: "15 / 24", weight: "Inter 400", sample: "Tap to read the full passage and tafsir from Ibn Kathir." },
                { token: "label",   size: "13 / 18", weight: "Inter 500", sample: "Mark as read" },
                { token: "meta",    size: "11 / 16", weight: "Inter 500 · 0.18em tracking · UPPER", sample: "Surah · 94 · Ayah 5" },
              ].map((row, i) => (
                <div
                  key={row.token}
                  className="grid grid-cols-12 gap-6 px-6 py-5 items-baseline"
                  style={{
                    backgroundColor: i % 2 === 0 ? COLORS.lantern.hex : "transparent",
                    borderTop: i === 0 ? "none" : `1px solid ${COLORS.sage.hex}`,
                  }}
                >
                  <div className="col-span-2 font-['Inter'] text-[12px] tracking-[0.14em] uppercase" style={{ color: COLORS.gold.hex }}>
                    {row.token}
                  </div>
                  <div className="col-span-2 font-['Inter'] text-[12px] tabular-nums" style={{ color: COLORS.stone.hex }}>
                    {row.size}
                  </div>
                  <div className="col-span-3 font-['Inter'] text-[12px]" style={{ color: COLORS.stone.hex }}>
                    {row.weight}
                  </div>
                  <div
                    className="col-span-5"
                    style={{
                      fontFamily: row.weight.startsWith("Lora") ? "Lora, serif" : "Inter, sans-serif",
                      color: COLORS.ink.hex,
                      fontSize: row.token === "display" ? 32 : row.token === "title" ? 22 : row.token === "verse" ? 18 : row.token === "body" ? 15 : row.token === "label" ? 13 : 11,
                      letterSpacing: row.token === "meta" ? "0.18em" : undefined,
                      textTransform: row.token === "meta" ? "uppercase" : undefined,
                      fontWeight: row.weight.includes("500") ? 500 : 400,
                    }}
                  >
                    {row.sample}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <HairlineDivider />

        {/* COMPONENTS */}
        <section>
          <SectionTitle kicker="04 — Components" title="The vocabulary of the app." />

          <div className="grid grid-cols-2 gap-10">

            {/* Ayah card */}
            <div>
              <div className="font-['Inter'] text-[11px] tracking-[0.2em] uppercase mb-4" style={{ color: COLORS.stone.hex }}>
                Ayah card — the hero
              </div>
              <div
                className="rounded-3xl p-8"
                style={{
                  backgroundColor: COLORS.lantern.hex,
                  border: `1px solid ${COLORS.sage.hex}`,
                  boxShadow: "0 1px 0 rgba(15,59,44,0.04)",
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="font-['Inter'] text-[11px] tracking-[0.2em] uppercase" style={{ color: COLORS.gold.hex }}>
                    Today
                  </div>
                  <div className="font-['Inter'] text-[11px] tracking-[0.18em] uppercase tabular-nums" style={{ color: COLORS.stone.hex }}>
                    94 : 5
                  </div>
                </div>
                <div
                  dir="rtl"
                  className="text-[28px] leading-[2.1] mb-6"
                  style={{ fontFamily: "Amiri, serif", color: COLORS.ink.hex }}
                >
                  فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا
                </div>
                <div
                  className="text-[17px] leading-[1.55]"
                  style={{ fontFamily: "Lora, serif", color: COLORS.ink.hex }}
                >
                  "For indeed, with hardship will be ease."
                </div>
                <div className="mt-2 font-['Inter'] text-[12px]" style={{ color: COLORS.stone.hex }}>
                  Saheeh International
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div>
              <div className="font-['Inter'] text-[11px] tracking-[0.2em] uppercase mb-4" style={{ color: COLORS.stone.hex }}>
                Buttons
              </div>
              <div
                className="rounded-3xl p-8 space-y-5"
                style={{ backgroundColor: COLORS.lantern.hex, border: `1px solid ${COLORS.sage.hex}` }}
              >
                <button
                  className="w-full rounded-full px-6 py-4 font-['Inter'] text-[15px] font-medium"
                  style={{ backgroundColor: COLORS.emerald.hex, color: COLORS.lantern.hex }}
                >
                  Read today's verse
                </button>
                <button
                  className="w-full rounded-full px-6 py-4 font-['Inter'] text-[15px] font-medium"
                  style={{
                    backgroundColor: "transparent",
                    color: COLORS.emerald.hex,
                    border: `1px solid ${COLORS.emerald.hex}`,
                  }}
                >
                  See in context
                </button>
                <button
                  className="w-full font-['Inter'] text-[14px] font-medium py-2"
                  style={{ color: COLORS.stone.hex }}
                >
                  Mark as read
                </button>
              </div>
            </div>

            {/* Tafsir attribution */}
            <div className="col-span-2">
              <div className="font-['Inter'] text-[11px] tracking-[0.2em] uppercase mb-4" style={{ color: COLORS.stone.hex }}>
                Tafsir attribution — never paraphrased, always cited
              </div>
              <div
                className="rounded-3xl p-8"
                style={{ backgroundColor: COLORS.lantern.hex, border: `1px solid ${COLORS.sage.hex}` }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className="h-1 w-8 rounded-full"
                    style={{ backgroundColor: COLORS.gold.hex }}
                  />
                  <div className="font-['Inter'] text-[11px] tracking-[0.2em] uppercase" style={{ color: COLORS.gold.hex }}>
                    Tafsir Ibn Kathir
                  </div>
                </div>
                <p
                  className="font-['Lora'] text-[16px] leading-[1.7] max-w-[820px]"
                  style={{ color: COLORS.ink.hex }}
                >
                  "Allah informs that with hardship comes ease, and He emphasizes this by repeating
                  it, indicating that one hardship will not overcome two eases…"
                </p>
                <div className="mt-5 font-['Inter'] text-[12px] tracking-[0.14em] uppercase" style={{ color: COLORS.stone.hex }}>
                  Verbatim · via quran.com · No AI commentary
                </div>
              </div>
            </div>

          </div>

          {/* Tokens */}
          <div className="mt-12 grid grid-cols-3 gap-6">
            <div
              className="rounded-2xl p-6"
              style={{ backgroundColor: COLORS.lantern.hex, border: `1px solid ${COLORS.sage.hex}` }}
            >
              <div className="font-['Inter'] text-[11px] tracking-[0.2em] uppercase mb-3" style={{ color: COLORS.stone.hex }}>
                Radius
              </div>
              <div className="space-y-3">
                {[
                  ["sm", 8, "Inputs, chips"],
                  ["md", 16, "Cards"],
                  ["lg", 24, "Hero ayah card"],
                  ["pill", 999, "Buttons"],
                ].map(([name, r, use]) => (
                  <div key={name as string} className="flex items-center gap-4">
                    <div
                      className="h-9 w-9 shrink-0"
                      style={{
                        backgroundColor: COLORS.emerald.hex,
                        borderRadius: r as number,
                      }}
                    />
                    <div className="font-['Inter'] text-[13px] flex-1" style={{ color: COLORS.ink.hex }}>
                      {name}
                    </div>
                    <div className="font-['Inter'] text-[12px]" style={{ color: COLORS.stone.hex }}>
                      {use}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="rounded-2xl p-6"
              style={{ backgroundColor: COLORS.lantern.hex, border: `1px solid ${COLORS.sage.hex}` }}
            >
              <div className="font-['Inter'] text-[11px] tracking-[0.2em] uppercase mb-3" style={{ color: COLORS.stone.hex }}>
                Spacing · 8pt grid
              </div>
              <div className="space-y-3">
                {[4, 8, 16, 24, 32, 48].map((s) => (
                  <div key={s} className="flex items-center gap-4">
                    <div className="font-['Inter'] text-[12px] w-10 tabular-nums" style={{ color: COLORS.stone.hex }}>
                      {s}px
                    </div>
                    <div
                      className="h-2 rounded-full"
                      style={{ width: s * 2, backgroundColor: COLORS.emerald.hex }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div
              className="rounded-2xl p-6"
              style={{ backgroundColor: COLORS.lantern.hex, border: `1px solid ${COLORS.sage.hex}` }}
            >
              <div className="font-['Inter'] text-[11px] tracking-[0.2em] uppercase mb-3" style={{ color: COLORS.stone.hex }}>
                Motion
              </div>
              <ul className="space-y-2 font-['Inter'] text-[13px] leading-[1.6]" style={{ color: COLORS.ink.hex }}>
                <li>· 200–400ms · ease-out</li>
                <li>· No bounce, no spring</li>
                <li>· Fade + tiny rise (4px)</li>
                <li>· One thing moves at a time</li>
                <li>· Honor reduce-motion</li>
              </ul>
            </div>
          </div>
        </section>

        <HairlineDivider />

        {/* VOICE */}
        <section>
          <SectionTitle kicker="05 — Voice" title="How we speak in the interface." />
          <div className="grid grid-cols-2 gap-10">
            <div
              className="rounded-2xl p-8"
              style={{ backgroundColor: COLORS.lantern.hex, border: `1px solid ${COLORS.sage.hex}` }}
            >
              <div className="font-['Inter'] text-[11px] tracking-[0.2em] uppercase mb-4" style={{ color: COLORS.emerald.hex }}>
                Say this
              </div>
              <ul className="space-y-4 font-['Lora'] text-[16px] leading-[1.55]" style={{ color: COLORS.ink.hex }}>
                <li>"Welcome back."</li>
                <li>"Your verse for today is ready."</li>
                <li>"Take a moment when you're ready."</li>
                <li>"Read at your own pace."</li>
              </ul>
            </div>
            <div
              className="rounded-2xl p-8"
              style={{ backgroundColor: COLORS.lantern.hex, border: `1px solid ${COLORS.sage.hex}` }}
            >
              <div className="font-['Inter'] text-[11px] tracking-[0.2em] uppercase mb-4" style={{ color: "#A65A4A" }}>
                Never this
              </div>
              <ul
                className="space-y-4 font-['Lora'] text-[16px] leading-[1.55]"
                style={{ color: COLORS.stone.hex, textDecoration: "line-through", textDecorationColor: "rgba(166,90,74,0.4)" }}
              >
                <li>"Don't break your streak!"</li>
                <li>"You missed yesterday."</li>
                <li>"3 days in a row! Keep going!"</li>
                <li>"Tap to earn your daily reward."</li>
              </ul>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mt-24 pt-10 flex items-center justify-between" style={{ borderTop: `1px solid ${COLORS.sage.hex}` }}>
          <div className="font-['Lora'] text-[14px]" style={{ color: COLORS.stone.hex }}>
            Daily Imaan · Brand Guide v1.0 · For internal use
          </div>
          <div className="font-['Inter'] text-[11px] tracking-[0.2em] uppercase" style={{ color: COLORS.gold.hex }}>
            Lora · Inter · Amiri
          </div>
        </footer>

      </div>
    </div>
  );
}
