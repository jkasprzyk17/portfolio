"use client";

import { setOs, useOs } from "./os";

/**
 * Same app, two platforms: switches the phone's chrome (status bar, icon
 * shape, how you go back, the look of controls) and nothing else. CSS does
 * the work off the attribute, so the phone's components don't re-render and
 * don't need to know. The one exception is a notification, which arrives
 * differently on each platform rather than just looking different (see
 * Banner). iOS is the default for everyone.
 */
export default function OsToggle() {
  // Two copies of the toggle exist (beside the intro on wide screens, under
  // the phone on narrow ones); reading the attribute keeps them in step.
  const os = useOs();

  return (
    <div className="js-only os-toggle" role="group" aria-label="Phone skin">
      <button
        type="button"
        aria-pressed={os === "ios"}
        onClick={() => setOs("ios")}
      >
        iOS
      </button>
      <button
        type="button"
        aria-pressed={os === "android"}
        onClick={() => setOs("android")}
      >
        Android
      </button>
    </div>
  );
}
