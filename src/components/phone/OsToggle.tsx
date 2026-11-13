"use client";

import { useSyncExternalStore } from "react";

type Os = "ios" | "android";

// The choice lives on <html data-os>, like the theme does; this reads it, so
// the two copies of the toggle (beside the intro on wide screens, under the
// phone on narrow ones) always agree.
const read = (): Os =>
  document.documentElement.dataset.os === "android" ? "android" : "ios";
const subscribe = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-os"],
  });
  return () => observer.disconnect();
};

/**
 * Same app, two platforms: switches the phone's chrome (status bar, icon
 * shape, how you go back, the look of controls) and nothing else. CSS does
 * the work off the attribute, so the phone's components don't re-render and
 * don't need to know. iOS is the default for everyone.
 */
export default function OsToggle() {
  const os = useSyncExternalStore(subscribe, read, () => "ios" as Os);

  const pick = (next: Os) => {
    if (next === "android") document.documentElement.dataset.os = "android";
    else delete document.documentElement.dataset.os;
  };

  return (
    <div className="js-only os-toggle" role="group" aria-label="Phone skin">
      <button
        type="button"
        aria-pressed={os === "ios"}
        onClick={() => pick("ios")}
      >
        iOS
      </button>
      <button
        type="button"
        aria-pressed={os === "android"}
        onClick={() => pick("android")}
      >
        Android
      </button>
    </div>
  );
}
