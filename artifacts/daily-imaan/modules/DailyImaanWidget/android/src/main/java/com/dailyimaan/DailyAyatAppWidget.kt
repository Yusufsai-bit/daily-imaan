package com.dailyimaan

import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.view.View
import android.widget.RemoteViews
import org.json.JSONObject
import java.util.Calendar

class DailyAyatAppWidget : AppWidgetProvider() {
  override fun onUpdate(
    context: Context,
    appWidgetManager: AppWidgetManager,
    appWidgetIds: IntArray
  ) {
    val prefs = context.getSharedPreferences("daily_imaan_widget", Context.MODE_PRIVATE)
    val arabic = prefs.getString(
      "widget_arabic",
      "\u0628\u0650\u0633\u0652\u0645\u0650 \u0627\u0644\u0644\u0651\u064e\u0647\u0650 \u0627\u0644\u0631\u0651\u064e\u062d\u0652\u0645\u064e\u0670\u0646\u0650 \u0627\u0644\u0631\u0651\u064e\u062d\u0650\u064a\u0645\u0650"
    ) ?: ""
    val english = prefs.getString(
      "widget_english",
      "In the name of Allah, the Most Gracious, the Most Merciful."
    ) ?: ""
    val surahRef = prefs.getString("widget_surah_ref", "Al-Fatihah 1:1") ?: ""
    val nextPrayer = computeNextPrayer(prefs.getString("widget_prayer_times", null))
      ?: prefs.getString("widget_next_prayer", "") ?: ""

    for (id in appWidgetIds) {
      val views = RemoteViews(context.packageName, R.layout.daily_ayat_widget)
      views.setTextViewText(R.id.widget_arabic, arabic)
      views.setTextViewText(R.id.widget_english, "\u201c$english\u201d")
      views.setTextViewText(R.id.widget_surah, surahRef)
      if (nextPrayer.isNotEmpty()) {
        views.setTextViewText(R.id.widget_next_prayer, nextPrayer)
        views.setViewVisibility(R.id.widget_next_prayer, View.VISIBLE)
      } else {
        views.setViewVisibility(R.id.widget_next_prayer, View.GONE)
      }
      appWidgetManager.updateAppWidget(id, views)
    }
  }

  /**
   * Derives the next prayer from the full-day schedule JSON the app writes
   * ({"date":"YYYY-MM-DD","times":{"Fajr":"HH:mm",...}}) so the line is
   * correct at render time instead of frozen at whatever was true when the
   * app last opened. Falls back to null (caller uses the legacy string).
   */
  private fun computeNextPrayer(json: String?): String? {
    if (json.isNullOrEmpty()) return null
    return try {
      val times = JSONObject(json).getJSONObject("times")
      val order = listOf("Fajr", "Dhuhr", "Asr", "Maghrib", "Isha")
      val now = Calendar.getInstance()
      val nowMinutes = now.get(Calendar.HOUR_OF_DAY) * 60 + now.get(Calendar.MINUTE)
      var fallback: Pair<String, Int>? = null
      for (name in order) {
        if (!times.has(name)) continue
        val parts = times.getString(name).split(":")
        if (parts.size < 2) continue
        val minutes = (parts[0].toIntOrNull() ?: continue) * 60 + (parts[1].take(2).toIntOrNull() ?: continue)
        if (fallback == null) fallback = name to minutes
        if (minutes > nowMinutes) return format(name, minutes)
      }
      // Past Isha \u2014 tomorrow's Fajr is within a minute of today's.
      fallback?.let { format(it.first, it.second) }
    } catch (_: Exception) {
      null
    }
  }

  private fun format(name: String, minutes: Int): String {
    val h24 = minutes / 60
    val m = minutes % 60
    val am = h24 < 12
    val h12 = when {
      h24 == 0 -> 12
      h24 > 12 -> h24 - 12
      else -> h24
    }
    return "$name %d:%02d %s".format(h12, m, if (am) "AM" else "PM")
  }
}
