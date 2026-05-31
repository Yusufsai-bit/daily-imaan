package com.dailyimaan

import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
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
      "\u0628\u0650\u0633\u0652\u0645\u0650 \u0627\u0644\u0644\u0651\u064e\u0647\u0650 \u0627\u0644\u0631\u0651\u064e\u062d\u0652\u0645\u064e\u0670\u0646\u0650 \u0627\u0644\u0631\u0651\u064e\u062d\u0650\u064a\u0645\u0650"
    ) ?: ""
    val english = prefs.getString(
      "widget_english",
      "In the name of Allah, the Most Gracious, the Most Merciful."
    ) ?: ""
    val surahRef = prefs.getString("widget_surah_ref", "Al-Fatihah 1:1") ?: ""

    for (id in appWidgetIds) {
      val views = RemoteViews(context.packageName, R.layout.daily_ayat_widget)
      views.setTextViewText(R.id.widget_arabic, arabic)
      views.setTextViewText(R.id.widget_english, "\u201c$english\u201d")
      views.setTextViewText(R.id.widget_surah, surahRef)
      appWidgetManager.updateAppWidget(id, views)
    }
  }
}
