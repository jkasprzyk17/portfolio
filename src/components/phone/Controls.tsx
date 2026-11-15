"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  animate,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "motion/react";
import * as m from "motion/react-m";
import { Moon } from "lucide-react";
import { setTheme, useTheme } from "@/lib/theme";
import { useBack } from "./nav";
import { setOs, useOs, type Os } from "./os";
import { usePan } from "./usePan";

// Control Centre comes down with a little give and goes away without any;
// Android's shade is the same spring both ways.
const SPRINGS = {
  ios: {
    open: { type: "spring", stiffness: 380, damping: 32 },
    close: { type: "spring", stiffness: 520, damping: 44 },
  },
  android: {
    open: { type: "spring", stiffness: 380, damping: 38 },
    close: { type: "spring", stiffness: 380, damping: 38 },
  },
} as const;

// How far a finger pulls Control Centre from away to in place. The Android
// shade is pulled by its own height instead, so it sticks to the finger.
const IOS_TRAVEL = 140;

/**
 * The phone's own controls for the two things about it a visitor can change:
 * the theme and the skin. Pulled down from the top right corner on iOS
 * (Control Centre), from anywhere along the top on Android (the quick
 * settings shade); the same two switches either way, and CSS gives them
 * each platform's shape. They are the real switches: the header's theme
 * button and the iOS/Android toggle beside the phone write the same two
 * attributes on <html>, so all of them always agree.
 *
 * Like a notification, it is one number (`open`: 0 away, 1 in place) that a
 * finger, a release and a tap all move, so any of them can take over from
 * another mid-flight.
 */
export default function Controls({
  blocked,
  onOpenChange,
}: {
  /** Something else has the screen (a long-press menu): stay away. */
  blocked: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const os = useOs();
  const reduced = !!useReducedMotion();
  const open = useMotionValue(0);
  // In the document: from the first pixel of a pull until it has gone again.
  const [shown, setShown] = useState(false);
  const running = useRef<{ stop: () => void } | null>(null);
  const grab = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  const range = useRef(IOS_TRAVEL);
  useLayoutEffect(() => {
    if (!shown) return;
    range.current =
      os === "android" && panel.current
        ? panel.current.offsetHeight
        : IOS_TRAVEL;
  }, [shown, os]);

  const settle = useCallback(
    (to: 0 | 1, velocity = 0) => {
      running.current?.stop();
      if (to) setShown(true);
      const done = () => {
        if (!to) setShown(false);
      };
      // Reduced motion: no travel, a short fade (see the styles below).
      running.current = reduced
        ? animate(open, to, { duration: 0.2, onComplete: done })
        : animate(open, to, {
            ...SPRINGS[os][to ? "open" : "close"],
            velocity,
            onComplete: done,
          });
    },
    [reduced, os, open],
  );
  useEffect(() => () => running.current?.stop(), []);

  useEffect(() => onOpenChange(shown), [shown, onOpenChange]);
  // Esc and Android's back button put it away before anything under it.
  useBack(100, () => settle(0), shown);

  // Opened from the keyboard, focus goes in with it and comes back out.
  const viaKeyboard = useRef(false);
  useEffect(() => {
    if (!viaKeyboard.current) return;
    if (shown) {
      panel.current?.querySelector("button")?.focus({ preventScroll: true });
    } else {
      viaKeyboard.current = false;
      grab.current?.focus({ preventScroll: true });
    }
  }, [shown]);

  const grabbed = useRef(0);
  const live = useRef(false);
  const pan = usePan({
    onStart: () => {
      live.current = !blocked;
      if (!live.current) return;
      running.current?.stop();
      grabbed.current = open.get();
      setShown(true);
    },
    onMove: ({ offset }) => {
      if (!live.current || reduced) return;
      const p = grabbed.current + offset.y / range.current;
      // Down to its place it follows the finger; past it, a little and no more.
      open.set(Math.max(0, p > 1 ? 1 + Math.min((p - 1) * 0.12, 0.05) : p));
    },
    onEnd: ({ offset, velocity }) => {
      if (!live.current) return;
      if (reduced) {
        // Nothing followed the finger, so only its direction counts.
        settle(
          offset.y > 10 ? 1 : offset.y < -10 ? 0 : grabbed.current ? 1 : 0,
        );
        return;
      }
      // A flick counts even if it didn't travel far.
      const to =
        velocity.y > 250 ? 1 : velocity.y < -250 ? 0 : open.get() > 0.5 ? 1 : 0;
      settle(to, velocity.y / range.current);
    },
  });
  // A pull ends in a click too; only a real tap should do anything.
  const tapped = () => {
    if (!pan.dragged.current) return true;
    pan.dragged.current = false;
    return false;
  };

  const scrim = useTransform(open, [0, 1], [0, 1]);
  // iOS: the modules come out of the corner the finger pulled from.
  const fade = useTransform(open, [0.15, 0.7], [0, 1]);
  const scale = useTransform(open, [0, 1], [0.9, 1], { clamp: false });
  const lift = useTransform(open, [0, 1], [-18, 0], { clamp: false });
  // Android: the shade comes down from above the screen, and stops at it.
  const shadeY = useTransform(open, (p) => `${Math.min(0, p - 1) * 100}%`);

  return (
    <>
      {/* The strip a pull starts from, which is also the way in without a
          gesture: it sits over the status bar's signal and battery. */}
      <button
        ref={grab}
        type="button"
        className="controls-grab"
        aria-label="Controls: theme and phone skin"
        aria-haspopup="dialog"
        aria-expanded={shown}
        onPointerDown={pan.onPointerDown}
        onClick={(e) => {
          if (!tapped() || blocked) return;
          viaKeyboard.current = e.detail === 0;
          settle(shown && open.get() > 0.5 ? 0 : 1);
        }}
      />

      {shown && (
        <div
          className="controls"
          role="dialog"
          aria-label="Controls"
          onPointerDown={pan.onPointerDown}
        >
          {/* The blur is on this layer alone and fades by its own opacity:
              nothing with a backdrop of its own sits inside a fading parent. */}
          <m.div
            className="controls__scrim"
            style={{ opacity: scrim }}
            onClick={() => {
              if (tapped()) settle(0);
            }}
          />
          <m.div
            ref={panel}
            className="controls__panel"
            style={
              reduced
                ? { opacity: open }
                : os === "android"
                  ? { y: shadeY }
                  : { opacity: fade, scale, y: lift, originX: 1, originY: 0 }
            }
          >
            <Switches tapped={tapped} />
          </m.div>
        </div>
      )}
    </>
  );
}

const SKINS: { os: Os; name: string }[] = [
  { os: "ios", name: "iOS" },
  { os: "android", name: "Android" },
];

/** The two switches. Mounted only while the panel is, so reading the theme
    in script never meets the server's guess at it. */
function Switches({ tapped }: { tapped: () => boolean }) {
  const dark = useTheme() === "dark";
  const os = useOs();
  return (
    <>
      <button
        type="button"
        className="ctl ctl--theme"
        aria-pressed={dark}
        onClick={() => {
          if (tapped()) setTheme(dark ? "light" : "dark");
        }}
      >
        <span className="ctl__icon" aria-hidden>
          <Moon />
        </span>
        <span className="ctl__text">
          <span className="ctl__name">Dark mode</span>
          <span className="ctl__state" aria-hidden>
            {dark ? "On" : "Off"}
          </span>
        </span>
      </button>

      <div className="ctl ctl--skin" role="group" aria-label="Phone skin">
        {SKINS.map((skin) => (
          <button
            key={skin.os}
            type="button"
            aria-pressed={os === skin.os}
            onClick={() => {
              if (tapped()) setOs(skin.os);
            }}
          >
            {skin.name}
          </button>
        ))}
      </div>
    </>
  );
}
