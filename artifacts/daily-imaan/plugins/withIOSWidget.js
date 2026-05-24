// Config plugin: adds a WidgetKit extension to the iOS Xcode project on prebuild.
// The widget reads from App Group shared UserDefaults (written by the main app)
// and shows the daily ayah + next prayer time on the home/lock screen.
//
// App Group ID: group.com.dailyimaan.app
// Shared UserDefaults keys:
//   widget_arabic      — Arabic ayah text
//   widget_english     — English translation
//   widget_surah_ref   — "Al-Baqarah 2:255"
//   widget_next_prayer — "Dhuhr at 12:30"

const {
  withXcodeProject,
  withEntitlementsPlist,
  withInfoPlist,
  withDangerousMod,
} = require("expo/config-plugins");
const fs = require("fs");
const path = require("path");

const APP_GROUP = "group.com.dailyimaan.app";
const WIDGET_TARGET = "DailyImaanWidget";
const BUNDLE_ID = "com.dailyimaan.app.widget";

// ─── Swift widget source files ────────────────────────────────────────────────

const WIDGET_SWIFT = `import WidgetKit
import SwiftUI

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
            arabic: "\\u0628\\u0650\\u0633\\u0652\\u0645\\u0650 \\u0627\\u0644\\u0644\\u0651\\u064e\\u0647\\u0650 \\u0627\\u0644\\u0631\\u0651\\u064e\\u062d\\u0652\\u0645\\u064e\\u0670\\u0646\\u0650 \\u0627\\u0644\\u0631\\u0651\\u064e\\u062d\\u0650\\u064a\\u0645\\u0650",
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
        // Refresh once per day at midnight
        let midnight = Calendar.current.startOfDay(for: Date().addingTimeInterval(86400))
        let timeline = Timeline(entries: [entry], policy: .after(midnight))
        completion(timeline)
    }

    private func readEntry() -> DailyImaanEntry {
        let defaults = UserDefaults(suiteName: "${APP_GROUP}")
        let arabic = defaults?.string(forKey: "widget_arabic") ?? ""
        let english = defaults?.string(forKey: "widget_english") ?? ""
        let surahRef = defaults?.string(forKey: "widget_surah_ref") ?? "Daily Imaan"
        let nextPrayer = defaults?.string(forKey: "widget_next_prayer") ?? ""
        return DailyImaanEntry(date: Date(), arabic: arabic, english: english, surahRef: surahRef, nextPrayer: nextPrayer)
    }
}

struct DailyImaanWidgetView: View {
    var entry: DailyImaanEntry
    @Environment(\\.widgetFamily) var family

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
                    Text("\\"\\(entry.english)\\"")
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
`;

const INFO_PLIST = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>NSExtension</key>
    <dict>
        <key>NSExtensionPointIdentifier</key>
        <string>com.apple.widgetkit-extension</string>
    </dict>
</dict>
</plist>
`;

// ─── Add App Group entitlement to main app ────────────────────────────────────
function withAppGroupEntitlement(config) {
  return withEntitlementsPlist(config, (cfg) => {
    const existing = cfg.modResults["com.apple.security.application-groups"] ?? [];
    if (!existing.includes(APP_GROUP)) {
      cfg.modResults["com.apple.security.application-groups"] = [...existing, APP_GROUP];
    }
    return cfg;
  });
}

// ─── Write widget Swift files into ios/ tree ──────────────────────────────────
function withWidgetFiles(config) {
  return withDangerousMod(config, [
    "ios",
    (cfg) => {
      const root = cfg.modRequest.platformProjectRoot;
      const widgetDir = path.join(root, WIDGET_TARGET);
      fs.mkdirSync(widgetDir, { recursive: true });

      fs.writeFileSync(path.join(widgetDir, "DailyImaanWidget.swift"), WIDGET_SWIFT);
      fs.writeFileSync(path.join(widgetDir, "Info.plist"), INFO_PLIST);

      // Entitlements for the widget extension (needs same App Group)
      const entitlements = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>com.apple.security.application-groups</key>
    <array>
        <string>${APP_GROUP}</string>
    </array>
</dict>
</plist>
`;
      fs.writeFileSync(path.join(widgetDir, `${WIDGET_TARGET}.entitlements`), entitlements);
      return cfg;
    },
  ]);
}

// ─── Add widget target to Xcode project ──────────────────────────────────────
function withWidgetXcodeTarget(config) {
  return withXcodeProject(config, (cfg) => {
    const project = cfg.modResults;

    // Skip if already added
    const targets = project.pbxNativeTargetSection();
    const alreadyAdded = Object.values(targets).some(
      (t) => t && typeof t === "object" && t.name === WIDGET_TARGET
    );
    if (alreadyAdded) return cfg;

    const { uuid: widgetTargetUuid, target: widgetTarget } = project.addTarget(
      WIDGET_TARGET,
      "app_extension",
      WIDGET_TARGET,
      BUNDLE_ID
    );

    // Add Swift source file to the target
    project.addSourceFile(
      `${WIDGET_TARGET}/DailyImaanWidget.swift`,
      { target: widgetTargetUuid },
      widgetTarget.productReference
    );

    // Add Info.plist as resource
    project.addResourceFile(
      `${WIDGET_TARGET}/Info.plist`,
      { target: widgetTargetUuid },
      widgetTarget.productReference
    );

    // Build settings for the widget target
    const buildConfigs = project.pbxXCBuildConfigurationSection();
    Object.keys(buildConfigs).forEach((key) => {
      const bc = buildConfigs[key];
      if (
        bc &&
        typeof bc === "object" &&
        bc.buildSettings &&
        bc.buildSettings.PRODUCT_NAME === `"${WIDGET_TARGET}"`
      ) {
        bc.buildSettings.SWIFT_VERSION = "5.0";
        bc.buildSettings.IPHONEOS_DEPLOYMENT_TARGET = "16.0";
        bc.buildSettings.TARGETED_DEVICE_FAMILY = '"1,2"';
        bc.buildSettings.INFOPLIST_FILE = `${WIDGET_TARGET}/Info.plist`;
        bc.buildSettings.CODE_SIGN_ENTITLEMENTS = `${WIDGET_TARGET}/${WIDGET_TARGET}.entitlements`;
        bc.buildSettings.SKIP_INSTALL = "YES";
        bc.buildSettings.ALWAYS_EMBED_SWIFT_STANDARD_LIBRARIES = "NO";
      }
    });

    return cfg;
  });
}

module.exports = (config) =>
  withWidgetFiles(withAppGroupEntitlement(withWidgetXcodeTarget(config)));
