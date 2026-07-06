import WidgetKit
import SwiftUI

let APP_GROUP = "group.com.dailyimaan.app"

// Fallback shown before the app has ever written widget data (fresh install,
// widget added first) — bismillah rather than an empty rectangle.
let FALLBACK_ARABIC = "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ"
let FALLBACK_ENGLISH = "In the name of Allah, the Entirely Merciful, the Especially Merciful."
let FALLBACK_REF = "Al-Fatihah 1:1"

struct DailyImaanEntry: TimelineEntry {
    let date: Date
    let arabic: String
    let english: String
    let surahRef: String
    let nextPrayer: String
}

/// One prayer with its concrete Date today, parsed from the JSON the app
/// writes to the App Group (`widget_prayer_times`).
struct PrayerSlot {
    let name: String
    let date: Date
}

struct DailyImaanProvider: TimelineProvider {
    func placeholder(in context: Context) -> DailyImaanEntry {
        DailyImaanEntry(
            date: Date(),
            arabic: FALLBACK_ARABIC,
            english: FALLBACK_ENGLISH,
            surahRef: FALLBACK_REF,
            nextPrayer: ""
        )
    }

    func getSnapshot(in context: Context, completion: @escaping (DailyImaanEntry) -> Void) {
        completion(baseEntry(at: Date(), nextPrayer: legacyNextPrayer()))
    }

    // Multi-entry timeline: one entry now plus one at each remaining prayer
    // time today, each showing the prayer that comes AFTER it. This is what
    // keeps the "next prayer" line honest all day without the app running —
    // the previous single-entry timeline showed whatever was true when the
    // app last opened, e.g. "Fajr 5:30 AM" at 9 PM.
    func getTimeline(in context: Context, completion: @escaping (Timeline<DailyImaanEntry>) -> Void) {
        let now = Date()
        let slots = loadPrayerSlots()

        var entries: [DailyImaanEntry] = [
            baseEntry(at: now, nextPrayer: nextPrayerText(after: now, slots: slots)),
        ]
        for slot in slots where slot.date > now {
            // 60s past the slot so "after" skips the slot itself.
            entries.append(
                baseEntry(
                    at: slot.date,
                    nextPrayer: nextPrayerText(after: slot.date.addingTimeInterval(60), slots: slots)
                )
            )
        }

        // Rebuild at midnight: prayer times drift ~1 min/day, so reusing
        // today's HH:mm for tomorrow is within a minute; the app rewrites
        // exact times on next open.
        let midnight = Calendar.current.startOfDay(for: now.addingTimeInterval(86400))
        completion(Timeline(entries: entries, policy: .after(midnight)))
    }

    private func defaults() -> UserDefaults? {
        UserDefaults(suiteName: APP_GROUP)
    }

    private func baseEntry(at date: Date, nextPrayer: String) -> DailyImaanEntry {
        let d = defaults()
        let arabic = d?.string(forKey: "widget_arabic") ?? ""
        let english = d?.string(forKey: "widget_english") ?? ""
        let surahRef = d?.string(forKey: "widget_surah_ref") ?? ""
        return DailyImaanEntry(
            date: date,
            arabic: arabic.isEmpty ? FALLBACK_ARABIC : arabic,
            english: english.isEmpty ? FALLBACK_ENGLISH : english,
            surahRef: surahRef.isEmpty ? FALLBACK_REF : surahRef,
            nextPrayer: nextPrayer
        )
    }

    /// The single pre-formatted string older app builds wrote. Used as a
    /// fallback when the JSON schedule is absent.
    private func legacyNextPrayer() -> String {
        defaults()?.string(forKey: "widget_next_prayer") ?? ""
    }

    /// Parse `{"date":"YYYY-MM-DD","times":{"Fajr":"HH:mm",...}}` into
    /// concrete Dates for TODAY, sorted ascending.
    private func loadPrayerSlots() -> [PrayerSlot] {
        guard
            let json = defaults()?.string(forKey: "widget_prayer_times"),
            let data = json.data(using: .utf8),
            let obj = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
            let times = obj["times"] as? [String: String]
        else { return [] }

        let order = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"]
        let cal = Calendar.current
        let today = Date()
        var slots: [PrayerSlot] = []
        for name in order {
            guard let raw = times[name] else { continue }
            let parts = raw.split(separator: ":")
            guard
                parts.count >= 2,
                let hour = Int(parts[0]),
                let minute = Int(parts[1].prefix(2)),
                (0...23).contains(hour),
                (0...59).contains(minute),
                let date = cal.date(bySettingHour: hour, minute: minute, second: 0, of: today)
            else { continue }
            slots.append(PrayerSlot(name: name, date: date))
        }
        return slots.sorted { $0.date < $1.date }
    }

    private func nextPrayerText(after date: Date, slots: [PrayerSlot]) -> String {
        let fmt = DateFormatter()
        fmt.timeStyle = .short
        fmt.dateStyle = .none
        if let next = slots.first(where: { $0.date > date }) {
            return "\(next.name) \(fmt.string(from: next.date))"
        }
        if let fajr = slots.first {
            // Past Isha — tomorrow's Fajr is within a minute of today's.
            return "Fajr \(fmt.string(from: fajr.date))"
        }
        return legacyNextPrayer()
    }
}

// iOS 17 requires containerBackground(for: .widget); without it, widgets
// built against the iOS 17+ SDK render a "please adopt containerBackground"
// placeholder instead of content. iOS 16 keeps the plain background.
extension View {
    @ViewBuilder
    func dailyImaanWidgetBackground(_ color: Color) -> some View {
        if #available(iOSApplicationExtension 17.0, *) {
            containerBackground(for: .widget) { color }
        } else {
            background(color)
        }
    }
}

struct DailyImaanWidgetView: View {
    var entry: DailyImaanEntry
    @Environment(\.widgetFamily) var family

    private let brandGreen = Color(red: 0.18, green: 0.75, blue: 0.50)
    private let bgGreen = Color(red: 0.05, green: 0.11, blue: 0.07)

    var body: some View {
        if family == .accessoryRectangular {
            // Lock screen: system-vibrant rendering, no custom colors or
            // dark card — just the essentials at glance size.
            VStack(alignment: .leading, spacing: 1) {
                if !entry.nextPrayer.isEmpty {
                    Text(entry.nextPrayer)
                        .font(.headline)
                }
                Text(entry.surahRef)
                    .font(.caption2)
                    .opacity(0.8)
                Text(entry.english)
                    .font(.caption2)
                    .lineLimit(entry.nextPrayer.isEmpty ? 2 : 1)
                    .opacity(0.7)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .dailyImaanWidgetBackground(.clear)
        } else {
            VStack(alignment: .leading, spacing: 4) {
                HStack {
                    Text("Daily Imaan")
                        .font(.system(size: 10, weight: .semibold))
                        .foregroundColor(brandGreen)
                    Spacer()
                    Text(entry.surahRef)
                        .font(.system(size: 9))
                        .foregroundColor(.white.opacity(0.45))
                }
                if !entry.arabic.isEmpty {
                    Text(entry.arabic)
                        .font(.system(size: family == .systemSmall ? 14 : 17))
                        .foregroundColor(.white)
                        .multilineTextAlignment(.trailing)
                        .frame(maxWidth: .infinity, alignment: .trailing)
                        .lineLimit(family == .systemSmall ? 2 : 4)
                }
                if !entry.english.isEmpty && family != .systemSmall {
                    Text("\"\(entry.english)\"")
                        .font(.system(size: 10))
                        .italic()
                        .foregroundColor(.white.opacity(0.65))
                        .lineLimit(2)
                }
                if !entry.nextPrayer.isEmpty {
                    Spacer()
                    Text(entry.nextPrayer)
                        .font(.system(size: 10, weight: .medium))
                        .foregroundColor(brandGreen)
                }
            }
            .padding(12)
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .dailyImaanWidgetBackground(bgGreen)
        }
    }
}

@main
struct DailyImaanWidget: Widget {
    let kind = "DailyImaanWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: DailyImaanProvider()) { entry in
            DailyImaanWidgetView(entry: entry)
        }
        .configurationDisplayName("Daily Imaan")
        .description("Today's Quranic verse and next prayer time.")
        .supportedFamilies([.systemSmall, .systemMedium, .accessoryRectangular])
    }
}
