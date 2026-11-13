"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";
import {
  animate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import * as m from "motion/react-m";
import AppIcon from "./AppIcon";
import type { AppDef } from "./apps";
import { useBack } from "./nav";
import { usePan } from "./usePan";

export type Rect = {
  x: number;
  y: number;
  w: number;
  h: number;
  /** Corner radius in px, when the rect is an icon. */
  r?: number;
};
export type ScreenSize = { w: number; h: number; r: number };

// Slightly underdamped: fast, settles without a visible wobble. Physical
// (stiffness/damping) rather than duration-based so a release mid-gesture can
// hand its velocity straight to the spring.
const SPRING = {
  type: "spring",
  stiffness: 320,
  damping: 34,
  mass: 1,
} as const;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * One app, as a sheet the size of the screen that lives between two poses:
 * its icon's rect (scaled down, clipped square) and the full screen. Opening,
 * closing and the swipe-up gesture all just move x / y / scale between those
 * poses, so any of them can interrupt any other mid-flight.
 */
export default function AppWindow({
  app,
  getOrigin,
  size,
  progress,
  onClosed,
  children,
}: {
  app: AppDef;
  /** Where the app's icon sits right now, in screen coordinates. */
  getOrigin: () => Rect;
  size: ScreenSize;
  /** 0 on the home screen, 1 with the app full-screen. Written here. */
  progress: MotionValue<number>;
  onClosed: () => void;
  children: ReactNode;
}) {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const origin = useRef(getOrigin());
  const s0 = origin.current.w / size.w;

  const x = useMotionValue(origin.current.x);
  const y = useMotionValue(origin.current.y);
  const scale = useMotionValue(s0);
  const fade = useMotionValue(reduced ? 0 : 1);

  // How far between icon (0) and full screen (1), derived from scale so the
  // drag gesture, which sets scale directly, drives everything else too.
  const t = useTransform(scale, (v) => clamp01((v - s0) / (1 - s0)));
  useMotionValueEvent(t, "change", (v) => progress.set(v));

  // Window coordinates: at t=0 the visible part is a square the width of the
  // screen with the icon's corner radius, which the scale shrinks to exactly
  // the icon.
  const clipPath = useTransform(t, (v) => {
    const bottom = (size.h - size.w) * (1 - v);
    // The icon's own corner, in window coordinates: square-ish on iOS,
    // a full circle in the Android skin.
    const o = origin.current;
    const radius = lerp((o.r ?? 0.23 * o.w) / s0, size.r, v);
    return `inset(0px 0px ${bottom}px 0px round ${radius}px)`;
  });
  const faceOpacity = useTransform(t, [0, 0.3], [1, 0]);
  const bodyOpacity = useTransform(t, [0.04, 0.32], [0, 1]);

  const running = useRef<{ stop: () => void }[]>([]);
  const closing = useRef(false);

  const springTo = useCallback(
    (to: { x: number; y: number; scale: number }, onDone?: () => void) => {
      running.current.forEach((a) => a.stop());
      // The release velocity carries into the spring, capped: a hard shove
      // should speed the sheet on its way, not fling it past its target.
      const cap = (v: number, max: number) => Math.max(-max, Math.min(max, v));
      running.current = [
        animate(x, to.x, { ...SPRING, velocity: cap(x.getVelocity(), 1600) }),
        animate(y, to.y, { ...SPRING, velocity: cap(y.getVelocity(), 1600) }),
        animate(scale, to.scale, {
          ...SPRING,
          velocity: cap(scale.getVelocity(), 2.5),
          // Only fires if this run finishes; an interrupting gesture stops
          // it, so a cancelled close can't unmount the app.
          onComplete: onDone,
        }),
      ];
    },
    [x, y, scale],
  );

  const open = useCallback(() => {
    closing.current = false;
    if (reduced) {
      x.set(0);
      y.set(0);
      scale.set(1);
      animate(fade, 1, { duration: 0.2 });
      return;
    }
    springTo({ x: 0, y: 0, scale: 1 });
  }, [reduced, springTo, x, y, scale, fade]);

  const close = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    if (reduced) {
      animate(fade, 0, { duration: 0.15, onComplete: onClosed });
      return;
    }
    // Re-measure: the icon may have moved since opening (resize, rotation).
    const o = (origin.current = getOrigin());
    springTo({ x: o.x, y: o.y, scale: o.w / size.w }, onClosed);
  }, [reduced, springTo, getOrigin, size.w, onClosed, fade]);

  useEffect(() => {
    open();
    rootRef.current?.focus({ preventScroll: true });
    // Mount only: reopening after a cancelled swipe goes through open().
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // "Back" with nothing deeper to go back from closes the app. Esc and the
  // Android back button both arrive through here (see nav.ts).
  useBack(0, close);

  useEffect(
    () => () => {
      running.current.forEach((a) => a.stop());
      progress.set(0);
    },
    [progress],
  );

  // Swipe up from the home bar. The sheet's bottom edge follows the finger
  // and it shrinks as it lifts, like putting a card back on a table. The
  // gesture is relative to wherever the sheet was grabbed, so catching it
  // mid-open or mid-close continues from that pose instead of snapping.
  const grab = useRef({ x: 0, y: 0, scale: 1 });
  const pan = usePan({
    onStart: () => {
      if (reduced) return;
      closing.current = false;
      running.current.forEach((a) => a.stop());
      grab.current = { x: x.get(), y: y.get(), scale: scale.get() };
    },
    onMove: ({ offset }) => {
      if (reduced) return;
      const g = grab.current;
      const up = Math.max(0, -offset.y);
      const lift = Math.min(1, up / (size.h * 0.55));
      const sc = g.scale * (1 - 0.58 * lift);
      scale.set(sc);
      x.set(g.x + offset.x * 0.7 + (size.w * (g.scale - sc)) / 2);
      // Pulling down gets a little give instead of a hard wall.
      y.set(g.y + size.h * (g.scale - sc) - up + Math.max(0, offset.y) * 0.12);
    },
    onEnd: ({ offset, velocity }) => {
      if (reduced) return;
      // A flick counts even if it didn't travel far.
      const far = offset.y < -size.h * 0.14;
      const fast = velocity.y < -500;
      if (far || fast) close();
      else open();
    },
  });

  return (
    <m.div
      ref={rootRef}
      className="app"
      role="dialog"
      aria-label={app.name}
      tabIndex={-1}
      style={{ x, y, scale, clipPath, opacity: fade, originX: 0, originY: 0 }}
    >
      <m.div className="app__body" style={{ opacity: bodyOpacity }}>
        {children}
      </m.div>

      <m.div aria-hidden className="app__face" style={{ opacity: faceOpacity }}>
        <AppIcon icon={app.icon} style={{ fontSize: size.w }} />
      </m.div>

      <m.button
        type="button"
        className="homebar"
        aria-label={`Close ${app.name}`}
        onPointerDown={pan.onPointerDown}
        onClick={() => {
          // A drag ends in a click too; only a real tap should close.
          if (pan.dragged.current) pan.dragged.current = false;
          else close();
        }}
      />
    </m.div>
  );
}
