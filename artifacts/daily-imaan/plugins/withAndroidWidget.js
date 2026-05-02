// Config plugin: generates all native Android 12+ App Widget files on prebuild.
// Adds DailyAyatAppWidget receiver to AndroidManifest.xml and writes
// the Kotlin provider, XML layout, and widget info XML into the android/ tree.

const { withAndroidManifest, withDangerousMod } = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

// ─── Android Manifest: register the AppWidgetProvider receiver ───────────────
function withWidgetManifest(config) {
  return withAndroidManifest(config, (cfg) => {
    const app = cfg.modResults.manifest.application[0];
    if (!app.receiver) app.receiver = [];

    const alreadyAdded = app.receiver.some(
      (r) => r.$?.["android:name"] === "com.dailyimaan.DailyAyatAppWidget"
    );
    if (!alreadyAdded) {
      app.receiver.push({
        $: {
          "android:name": "com.dailyimaan.DailyAyatAppWidget",
          "android:exported": "true",
        },
        "intent-filter": [
          {
            action: [
              {
                $: { "android:name": "android.appwidget.action.APPWIDGET_UPDATE" },
              },
            ],
          },
        ],
        "meta-data": [
          {
            $: {
              "android:name": "android.appwidget.provider",
              "android:resource": "@xml/daily_ayat_widget_info",
            },
          },
        ],
      });
    }
    return cfg;
  });
}

// ─── Dangerous mod: write native files into android/ tree ────────────────────
function withWidgetFiles(config) {
  return withDangerousMod(config, [
    "android",
    (cfg) => {
      const root = cfg.modRequest.platformProjectRoot;

      // 1. Kotlin AppWidgetProvider
      const javaDir = path.join(
        root,
        "app/src/main/java/com/dailyimaan"
      );
      fs.mkdirSync(javaDir, { recursive: true });
      fs.writeFileSync(
        path.join(javaDir, "DailyAyatAppWidget.kt"),
        `package com.dailyimaan

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.RemoteViews

class DailyAyatAppWidget : AppWidgetProvider() {
  override fun onUpdate(
    context: Context,
    appWidgetManager: AppWidgetManager,
    appWidgetIds: IntArray
  ) {
    val prefs = context.getSharedPreferences("daily_imaan_widget", Context.MODE_PRIVATE)
    val arabic = prefs.getString(
      "widget_arabic",
      "\\u0628\\u0650\\u0633\\u0652\\u0645\\u0650 \\u0627\\u0644\\u0644\\u0651\\u064e\\u0647\\u0650"
    ) ?: ""
    val english = prefs.getString(
      "widget_english",
      "In the name of Allah, the Most Gracious, the Most Merciful."
    ) ?: ""
    val surahRef = prefs.getString("widget_surah_ref", "Al-Fatihah 1:1") ?: ""

    val launchIntent = Intent(Intent.ACTION_VIEW, Uri.parse("daily-imaan://")).apply {
      addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP)
    }
    val pendingIntent = PendingIntent.getActivity(
      context, 0, launchIntent,
      PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
    )

    for (id in appWidgetIds) {
      val views = RemoteViews(context.packageName, R.layout.daily_ayat_widget)
      views.setTextViewText(R.id.widget_arabic, arabic)
      views.setTextViewText(R.id.widget_english, "\\u201c$english\\u201d")
      views.setTextViewText(R.id.widget_surah, surahRef)
      views.setOnClickPendingIntent(R.id.widget_root, pendingIntent)
      appWidgetManager.updateAppWidget(id, views)
    }
  }
}
`
      );

      // 2. Widget info XML (res/xml)
      const xmlDir = path.join(root, "app/src/main/res/xml");
      fs.mkdirSync(xmlDir, { recursive: true });
      fs.writeFileSync(
        path.join(xmlDir, "daily_ayat_widget_info.xml"),
        `<?xml version="1.0" encoding="utf-8"?>
<appwidget-provider xmlns:android="http://schemas.android.com/apk/res/android"
    android:minWidth="180dp"
    android:minHeight="110dp"
    android:targetCellWidth="3"
    android:targetCellHeight="2"
    android:updatePeriodMillis="86400000"
    android:initialLayout="@layout/daily_ayat_widget"
    android:resizeMode="horizontal|vertical"
    android:widgetCategory="home_screen" />
`
      );

      // 3. Widget layout XML (res/layout)
      const layoutDir = path.join(root, "app/src/main/res/layout");
      fs.mkdirSync(layoutDir, { recursive: true });
      fs.writeFileSync(
        path.join(layoutDir, "daily_ayat_widget.xml"),
        `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/widget_root"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:background="#0D1B12"
    android:padding="16dp"
    android:gravity="center_vertical">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="horizontal"
        android:gravity="center_vertical">

        <TextView
            android:id="@+id/widget_app_name"
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_weight="1"
            android:text="Daily Imaan"
            android:textColor="#2DBF7F"
            android:textSize="11sp"
            android:textStyle="bold" />

        <TextView
            android:id="@+id/widget_surah"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="Al-Fatihah 1:1"
            android:textColor="#66FAFAF8"
            android:textSize="10sp" />
    </LinearLayout>

    <TextView
        android:id="@+id/widget_arabic"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginTop="8dp"
        android:textColor="#FAFAF8"
        android:textSize="18sp"
        android:gravity="end"
        android:maxLines="3" />

    <TextView
        android:id="@+id/widget_english"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginTop="6dp"
        android:textColor="#B3FAFAF8"
        android:textSize="11sp"
        android:textStyle="italic"
        android:maxLines="2"
        android:ellipsize="end" />

</LinearLayout>
`
      );

      // 4. strings.xml — add widget_description if it doesn't exist
      const valuesDir = path.join(root, "app/src/main/res/values");
      fs.mkdirSync(valuesDir, { recursive: true });
      const stringsPath = path.join(valuesDir, "widget_strings.xml");
      if (!fs.existsSync(stringsPath)) {
        fs.writeFileSync(
          stringsPath,
          `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="widget_description">Daily Quran ayat on your home screen</string>
</resources>
`
        );
      }

      return cfg;
    },
  ]);
}

module.exports = (config) => withWidgetManifest(withWidgetFiles(config));
