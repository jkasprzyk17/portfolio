"use client";

import { useSyncExternalStore } from "react";

export type Os = "ios" | "android";

// The choice lives on <html data-os>, like the theme does; anything that
// needs it in script reads it from there, so every reader agrees.
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

export function useOs(): Os {
  return useSyncExternalStore(subscribe, read, () => "ios" as Os);
}

export function setOs(next: Os) {
  if (next === "android") document.documentElement.dataset.os = "android";
  else delete document.documentElement.dataset.os;
}
