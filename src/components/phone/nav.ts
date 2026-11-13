"use client";

import { createContext, useContext, useEffect, useRef } from "react";

type Handler = { level: number; run: () => void };

/**
 * One meaning of "back" for the whole phone, whatever asks for it: Esc, the
 * Android back button, anything added later. Whoever is deepest answers:
 * a pushed screen pops before the app underneath it closes.
 */
export type PhoneNav = {
  register: (handler: Handler) => () => void;
  /** Go back one step: pop a screen if there is one, otherwise close the app. */
  back: () => void;
  /** Close the app, however deep it is. */
  home: () => void;
};

export function createPhoneNav(): PhoneNav {
  let handlers: Handler[] = [];
  const top = () =>
    handlers.reduce<Handler | null>(
      (best, h) => (!best || h.level >= best.level ? h : best),
      null,
    );
  return {
    register(handler) {
      handlers.push(handler);
      return () => {
        handlers = handlers.filter((h) => h !== handler);
      };
    },
    back: () => top()?.run(),
    home: () => handlers.find((h) => h.level === 0)?.run(),
  };
}

export const PhoneNavContext = createContext<PhoneNav | null>(null);

/**
 * Take over "back" while `enabled`. Level 0 is the app window itself;
 * anything inside an app that can go back first uses a higher level.
 */
export function useBack(level: number, run: () => void, enabled = true) {
  const nav = useContext(PhoneNavContext);
  const latest = useRef(run);
  latest.current = run;
  useEffect(() => {
    if (!nav || !enabled) return;
    return nav.register({ level, run: () => latest.current() });
  }, [nav, level, enabled]);
}
