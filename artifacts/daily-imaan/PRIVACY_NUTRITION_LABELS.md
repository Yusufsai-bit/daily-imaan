# Daily Imaan — Privacy Disclosures

Use this reference when filling out **App Store Connect → App Privacy** and **Play Console → Data Safety**. The answers below are derived from a complete read of the source code and reflect what the app actually does as of v1.0.0.

---

## Apple — App Store Connect "App Privacy"

### Tracking

> **Does this app collect data from this app that is linked to the user or device, in a way that's used to track them?**

**No.** Daily Imaan does not use any third-party tracking SDK and does not link any data to an identity.

### Data Linked to You

> **Does the app collect any data and link it to the user's identity?**

**No data linked to you.**

### Data Not Linked to You

> **Does the app collect any data NOT linked to the user's identity?**

**Yes — declare the following:**

| Data Type | Category | Purpose | Why |
| --- | --- | --- | --- |
| **Coarse / Precise Location** | Location | App Functionality | Sent to AlAdhan API to calculate prayer times. |
| **Crash Data** | Diagnostics | App Functionality, Analytics | Sentry crash reports (if a DSN is configured for the build). |
| **Performance Data** | Diagnostics | App Functionality, Analytics | Sentry performance traces (if DSN is configured). |

For each entry above, when prompted "Is the data linked to the user's identity?", answer **NO**. When prompted "Is the data used to track the user?", answer **NO**.

### NOT collected (do NOT list these)

- Contact info (no email, no phone, no name)
- Health, financial, contacts, search, browsing, purchases, identifiers
- User content, messages, photos, audio
- Sensitive info

---

## Google — Play Console "Data Safety"

### Data collection and security

| Question | Answer |
| --- | --- |
| Is your app collecting or sharing any of the required user data types? | **Yes** (see table below). |
| Is all of the user data collected by your app encrypted in transit? | **Yes** — all API calls are over HTTPS. |
| Do you provide a way for users to request that their data be deleted? | **Yes** — uninstalling the app removes everything (no server-side copy). State this in your data safety description. |

### Data types — declare these

| Data Type | Collected? | Shared? | Optional? | Purpose |
| --- | --- | --- | --- | --- |
| **Approximate location** | Yes | Yes (with AlAdhan) | Optional | App functionality |
| **Precise location** | Yes (if granted) | Yes (with AlAdhan) | Optional | App functionality |
| **Crash logs** | Yes (if Sentry DSN set) | Yes (with Sentry) | Required | App functionality, Analytics |
| **Diagnostics** | Yes (if Sentry DSN set) | Yes (with Sentry) | Required | App functionality, Analytics |

### Do NOT declare these (the app does not collect them)

- Personal info (name, email, ID, address, phone, race, ethnicity, religion, sexual orientation, etc.)
- Financial info
- Health & fitness
- Messages, photos, audio, files
- Calendar, contacts
- App activity (we do not log in-app interactions to a server)
- Web browsing
- App info & performance other than crash logs / diagnostics
- Device or other IDs

### Security practices to declare

- ✅ Data is encrypted in transit (HTTPS to all third parties).
- ✅ You provide a mechanism for data deletion (uninstall = full erasure).
- ❌ The app is NOT participating in Google Play Families.

---

## If you ship without Sentry (DSN not configured)

If `EXPO_PUBLIC_SENTRY_DSN` is unset for the production build, the Sentry SDK initializes to a no-op and no crash data is sent. In that case **remove the Crash Data and Diagnostics rows** from both Apple and Google declarations above.
