import WidgetKit
import SwiftUI

// Reads ayat data written by the Daily Imaan app via App Group UserDefaults.
// The JS bridge writes to "group.com.dailyimaan" on every ayah change.

struct DailyAyatEntry: TimelineEntry {
    let date: Date
    let arabic: String
    let english: String
    let surahRef: String
}

struct DailyAyatProvider: TimelineProvider {
    private let suiteName = "group.com.dailyimaan"

    func placeholder(in context: Context) -> DailyAyatEntry {
        DailyAyatEntry(
            date: Date(),
            arabic: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
            english: "In the name of Allah, the Most Gracious, the Most Merciful.",
            surahRef: "Al-Fatihah 1:1"
        )
    }

    func getSnapshot(in context: Context, completion: @escaping (DailyAyatEntry) -> Void) {
        completion(loadEntry())
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<DailyAyatEntry>) -> Void) {
        let entry = loadEntry()
        let nextUpdate = Calendar.current.startOfDay(for: Calendar.current.date(byAdding: .day, value: 1, to: Date())!)
        completion(Timeline(entries: [entry], policy: .after(nextUpdate)))
    }

    private func loadEntry() -> DailyAyatEntry {
        let defaults = UserDefaults(suiteName: suiteName)
        return DailyAyatEntry(
            date: Date(),
            arabic: defaults?.string(forKey: "widget_arabic") ?? "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
            english: defaults?.string(forKey: "widget_english") ?? "In the name of Allah, the Most Gracious, the Most Merciful.",
            surahRef: defaults?.string(forKey: "widget_surah_ref") ?? "Al-Fatihah 1:1"
        )
    }
}

struct DailyAyatWidgetEntryView: View {
    var entry: DailyAyatProvider.Entry
    @Environment(\.widgetFamily) var family

    var body: some View {
        ZStack {
            Color(red: 0.051, green: 0.106, blue: 0.071)
            VStack(alignment: .leading, spacing: 8) {
                HStack {
                    Text("Daily Imaan")
                        .font(.caption2.weight(.bold))
                        .foregroundColor(Color(red: 0.176, green: 0.749, blue: 0.498))
                    Spacer()
                    Text(entry.surahRef)
                        .font(.caption2)
                        .foregroundColor(.white.opacity(0.5))
                }
                Spacer()
                Text(entry.arabic)
                    .font(.system(size: family == .systemSmall ? 14 : 18))
                    .foregroundColor(.white)
                    .multilineTextAlignment(.trailing)
                    .frame(maxWidth: .infinity, alignment: .trailing)
                    .lineLimit(3)
                Text("\"\(entry.english)\"")
                    .font(.caption)
                    .foregroundColor(.white.opacity(0.7))
                    .italic()
                    .lineLimit(family == .systemSmall ? 2 : 3)
            }
            .padding()
        }
    }
}

@main
struct DailyAyatWidget: Widget {
    let kind: String = "DailyAyatWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: DailyAyatProvider()) { entry in
            DailyAyatWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("Ayat of the Day")
        .description("See your daily Quran ayah on your home screen.")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}
