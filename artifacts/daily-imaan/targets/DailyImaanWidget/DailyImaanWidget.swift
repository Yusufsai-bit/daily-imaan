import WidgetKit
import SwiftUI

let APP_GROUP = "group.com.dailyimaan.app"

struct DailyImaanEntry: TimelineEntry {
    let date: Date
    let arabic: String
    let english: String
    let surahRef: String
    let nextPrayer: String
}

struct DailyImaanProvider: TimelineProvider {
    func placeholder(in context: Context) -> DailyImaanEntry {
        DailyImaanEntry(
            date: Date(),
            arabic: "\u{0628}\u{0650}\u{0633}\u{0652}\u{0645}\u{0650} \u{0627}\u{0644}\u{0644}\u{0651}\u{064e}\u{0647}\u{0650} \u{0627}\u{0644}\u{0631}\u{0651}\u{064e}\u{062d}\u{0652}\u{0645}\u{064e}\u{0670}\u{0646}\u{0650} \u{0627}\u{0644}\u{0631}\u{0651}\u{064e}\u{062d}\u{0650}\u{064a}\u{0645}\u{0650}",
            english: "In the name of Allah, the Most Gracious, the Most Merciful.",
            surahRef: "Al-Fatihah 1:1",
            nextPrayer: ""
        )
    }

    func getSnapshot(in context: Context, completion: @escaping (DailyImaanEntry) -> Void) {
        completion(readEntry())
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<DailyImaanEntry>) -> Void) {
        let entry = readEntry()
        let midnight = Calendar.current.startOfDay(for: Date().addingTimeInterval(86400))
        let timeline = Timeline(entries: [entry], policy: .after(midnight))
        completion(timeline)
    }

    private func readEntry() -> DailyImaanEntry {
        let defaults = UserDefaults(suiteName: APP_GROUP)
        let arabic = defaults?.string(forKey: "widget_arabic") ?? ""
        let english = defaults?.string(forKey: "widget_english") ?? ""
        let surahRef = defaults?.string(forKey: "widget_surah_ref") ?? "Daily Imaan"
        let nextPrayer = defaults?.string(forKey: "widget_next_prayer") ?? ""
        return DailyImaanEntry(date: Date(), arabic: arabic, english: english, surahRef: surahRef, nextPrayer: nextPrayer)
    }
}

struct DailyImaanWidgetView: View {
    var entry: DailyImaanEntry
    @Environment(\.widgetFamily) var family

    var body: some View {
        ZStack {
            Color(red: 0.05, green: 0.11, blue: 0.07)
            VStack(alignment: .leading, spacing: 4) {
                HStack {
                    Text("Daily Imaan")
                        .font(.system(size: 10, weight: .semibold))
                        .foregroundColor(Color(red: 0.18, green: 0.75, blue: 0.50))
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
                        .foregroundColor(Color(red: 0.18, green: 0.75, blue: 0.50))
                }
            }
            .padding(12)
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
