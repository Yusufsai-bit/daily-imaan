import ExpoModulesCore
import WidgetKit

// Writes ayat data to the shared App Group (group.com.dailyimaan.app) so the
// WidgetKit extension can read it without a network round-trip, then reloads
// all widget timelines so the home screen updates immediately.
public class DailyImaanWidgetModule: Module {
  public func definition() -> ModuleDefinition {
    Name("DailyImaanWidget")

    AsyncFunction("setWidgetData") { (arabic: String, english: String, surahRef: String, nextPrayer: String) in
      let defaults = UserDefaults(suiteName: "group.com.dailyimaan.app")
      defaults?.set(arabic, forKey: "widget_arabic")
      defaults?.set(english, forKey: "widget_english")
      defaults?.set(surahRef, forKey: "widget_surah_ref")
      defaults?.set(nextPrayer, forKey: "widget_next_prayer")
      defaults?.synchronize()

      if #available(iOS 14.0, *) {
        WidgetCenter.shared.reloadAllTimelines()
      }
    }
  }
}
