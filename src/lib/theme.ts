"use client";

import { useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

// The theme lives only on <html data-theme> (set before first paint by the
// script in layout.tsx) and in localStorage for the next visit. Everything
// that changes it goes through here, so the two can't disagree.
const read = (): Theme =>
  document.documentElement.getAttribute("data-theme") === "dark"
    ? "dark"
    : "light";

export function setTheme(next: Theme) {
  document.documentElement.setAttribute("data-theme", next);
  try {
    localStorage.setItem("theme", next);
  } catch {
    // Storage is off (private mode): the choice lasts for this page.
  }
}

export function toggleTheme() {
  setTheme(read() === "dark" ? "light" : "dark");
}

const subscribe = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
};

/**
 * The theme, for the rare thing that has to say it in words. Most of the
 * site follows the attribute in CSS and never asks. Only for components that
 * mount after the page has loaded: the server doesn't know the answer, so
 * anything rendered there would say "light" until hydration.
 */
export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, read, () => "light" as Theme);
}
