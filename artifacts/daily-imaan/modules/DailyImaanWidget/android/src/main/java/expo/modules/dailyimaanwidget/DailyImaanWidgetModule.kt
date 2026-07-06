package expo.modules.dailyimaanwidget

import android.appwidget.AppWidgetManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

// Writes ayat payload to SharedPreferences (daily_imaan_widget) and
// broadcasts an ACTION_APPWIDGET_UPDATE so the home screen widget refreshes.
class DailyImaanWidgetModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("DailyImaanWidget")

    // prayerTimesJson: {"date":"YYYY-MM-DD","times":{"Fajr":"HH:mm",...}} —
    // stored for parity with iOS; the Android widget doesn't render a
    // prayer line yet but the data is there when it does.
    AsyncFunction("setWidgetData") { arabic: String, english: String, surahRef: String, nextPrayer: String, prayerTimesJson: String ->
      val context: Context = appContext.reactContext ?: return@AsyncFunction
      val prefs = context.getSharedPreferences("daily_imaan_widget", Context.MODE_PRIVATE)
      val edit = prefs.edit()
        .putString("widget_arabic", arabic)
        .putString("widget_english", english)
        .putString("widget_surah_ref", surahRef)
        .putString("widget_next_prayer", nextPrayer)
      if (prayerTimesJson.isNotEmpty()) {
        edit.putString("widget_prayer_times", prayerTimesJson)
      }
      edit.apply()

      val mgr = AppWidgetManager.getInstance(context)
      val ids = mgr.getAppWidgetIds(
        ComponentName(context, "com.dailyimaan.DailyAyatAppWidget")
      )
      if (ids.isNotEmpty()) {
        val intent = Intent(AppWidgetManager.ACTION_APPWIDGET_UPDATE).apply {
          putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, ids)
        }
        context.sendBroadcast(intent)
      }
    }
  }
}
