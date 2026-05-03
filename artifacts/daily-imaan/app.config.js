// Dynamic Expo config — wraps app.json so we can inject the Apple Developer
// Team ID from the EAS build environment instead of hard-coding it. The Team
// ID is required by @bacons/apple-targets for the home-screen widget and is
// part of the iOS provisioning profile.
//
// USAGE
//   Local dev / Expo Go:    APPLE_TEAM_ID is not required. The placeholder is
//                           left in place; the widget native target is not
//                           built in Expo Go anyway.
//   EAS production build:   Set APPLE_TEAM_ID in your EAS secrets:
//                             eas secret:create --scope project \
//                               --name APPLE_TEAM_ID --value ABCDE12345
//                           If it's missing while running a production iOS
//                           build, this config FAILS LOUD instead of silently
//                           shipping a broken provisioning profile.
//
// Find your Team ID at https://developer.apple.com/account → Membership.

const base = require("./app.json");

const PLACEHOLDER = "REPLACE_WITH_APPLE_TEAM_ID";

module.exports = ({ config: _ }) => {
  const expo = JSON.parse(JSON.stringify(base.expo)); // deep clone

  const envTeamId = (process.env.APPLE_TEAM_ID || "").trim();
  const isProductionIosBuild =
    process.env.EAS_BUILD === "true" &&
    process.env.EAS_BUILD_PLATFORM === "ios" &&
    process.env.EAS_BUILD_PROFILE === "production";

  if (envTeamId) {
    if (!/^[A-Z0-9]{10}$/.test(envTeamId)) {
      throw new Error(
        `[app.config.js] APPLE_TEAM_ID="${envTeamId}" is not a valid 10-character Apple Team ID. ` +
          "Find yours at https://developer.apple.com/account → Membership."
      );
    }
    // Inject into the @bacons/apple-targets plugin entry.
    expo.plugins = expo.plugins.map((p) => {
      if (Array.isArray(p) && p[0] === "@bacons/apple-targets") {
        return [p[0], { ...(p[1] || {}), appleTeamId: envTeamId }];
      }
      return p;
    });
  } else if (isProductionIosBuild) {
    // Hard-fail rather than ship "REPLACE_WITH_APPLE_TEAM_ID" to App Store Connect.
    throw new Error(
      "[app.config.js] APPLE_TEAM_ID env var is required for production iOS builds. " +
        "Run `eas secret:create --scope project --name APPLE_TEAM_ID --value <YOUR_TEAM_ID>` and re-run the build."
    );
  } else {
    // Local / non-production build — leave the placeholder so the absence is
    // visible but doesn't block Expo Go or development builds.
    void PLACEHOLDER;
  }

  return expo;
};
