"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  type MouseEvent,
  type ReactNode,
  type RefObject,
} from "react";
import {
  AnimatePresence,
  animate,
  useMotionValue,
  usePresence,
  useReducedMotion,
  useTransform,
} from "motion/react";
import * as m from "motion/react-m";
import AppIcon from "./AppIcon";
import type { AppDef } from "./apps";
import IslandNotice from "./Island";
import { useOs, type Os } from "./os";
import { usePan } from "./usePan";

export type Notice = {
  id: string;
  /** A notification that leads somewhere outside the phone. */
  href?: string;
} & (
  | {
      /** Whose notification it is: icon and name. */
      app: AppDef;
      title: string;
      body: string;
      when: string;
    }
  | {
      /** Not a message from an app: something drawn as given, held the same
          way. A live activity, opened (see LiveActivity.tsx). */
      content: ReactNode;
      app?: undefined;
    }
);

const HIDE_AFTER = 6500;
// After it has been held and let go: time to finish reading, not a fresh
// six seconds.
const HIDE_AFTER_HOLD = 3000;

// The island reaches out with a little bounce and puts itself away without
// one; the Android banner is the same spring both ways.
const SPRINGS = {
  ios: {
    open: { type: "spring", stiffness: 420, damping: 30 },
    close: { type: "spring", stiffness: 520, damping: 44 },
  },
  android: {
    open: { type: "spring", stiffness: 380, damping: 34 },
    close: { type: "spring", stiffness: 380, damping: 34 },
  },
} as const;

/**
 * A notification at the top of the screen: the way a phone asks for
 * attention, so it needs no explaining. It leaves on its own, can be pushed
 * away upward, and tapping it goes where it says.
 *
 * How it arrives is the platform's: on iOS the island opens into it, on
 * Android a banner drops in from above. Everything else (what it says, how
 * long it stays, what a tap or a push does) is the same code for both.
 */
export default function Banner({
  notice,
  island,
  onActivate,
  onDismiss,
}: {
  notice: Notice | null;
  /** The island at rest, which an iOS notification grows out of. */
  island: RefObject<HTMLElement | null>;
  onActivate: (notice: Notice) => void;
  onDismiss: () => void;
}) {
  const os = useOs();
  return (
    <AnimatePresence>
      {notice && (
        <NoticeView
          // Switching skins mid-notice starts it again in the other one.
          key={`${notice.id}:${os}`}
          notice={notice}
          os={os}
          island={island}
          onActivate={onActivate}
          onDismiss={onDismiss}
        />
      )}
    </AnimatePresence>
  );
}

/**
 * One notification, from arriving to gone. A single number, `open`, is its
 * whole state: 0 away, 1 in place. Arriving, leaving and a finger pushing it
 * all just move that number, so any of them can take over from any other
 * mid-flight and a release hands its speed to the spring. The two skins only
 * differ in what they draw for a given value.
 */
function NoticeView({
  notice,
  os,
  island,
  onActivate,
  onDismiss,
}: {
  notice: Notice;
  os: Os;
  island: RefObject<HTMLElement | null>;
  onActivate: (notice: Notice) => void;
  onDismiss: () => void;
}) {
  const reduced = !!useReducedMotion();
  const [isPresent, safeToRemove] = usePresence();
  const open = useMotionValue(0);
  const running = useRef<{ stop: () => void } | null>(null);
  // How far a finger has to push to put it fully away, in px. Each skin
  // sets it from what it draws, so the notice tracks the finger one to one.
  const range = useRef(80);

  const settle = useCallback(
    (to: 0 | 1, velocity = 0, done?: () => void) => {
      running.current?.stop();
      // Reduced motion: no travel, a short fade (the skins draw `open` as
      // opacity then).
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

  // In when it appears; out, from wherever it is and at whatever speed it
  // was going, when it is taken away.
  useEffect(() => {
    if (isPresent) settle(1);
    else settle(0, open.getVelocity(), () => safeToRemove?.());
  }, [isPresent, settle, open, safeToRemove]);
  useEffect(() => () => running.current?.stop(), []);

  // It leaves by itself, unless a finger is on it.
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const leaveIn = useCallback(
    (ms: number) => {
      clearTimeout(timer.current);
      timer.current = setTimeout(onDismiss, ms);
    },
    [onDismiss],
  );
  useEffect(() => {
    if (isPresent) leaveIn(HIDE_AFTER);
    return () => clearTimeout(timer.current);
  }, [isPresent, leaveIn]);

  const grabbed = useRef(1);
  const pan = usePan({
    onStart: () => {
      if (!isPresent) return;
      clearTimeout(timer.current);
      if (reduced) return;
      running.current?.stop();
      grabbed.current = open.get();
    },
    onMove: ({ offset }) => {
      if (!isPresent || reduced) return;
      // Up follows the finger; down gives a little and no more.
      const travel = offset.y < 0 ? offset.y : Math.min(offset.y * 0.18, 10);
      open.set(Math.max(0, grabbed.current + travel / range.current));
    },
    onEnd: ({ offset, velocity }) => {
      if (!isPresent) return;
      // A flick counts even if it didn't travel far.
      const flicked = velocity.y < -200;
      const pushed = reduced ? offset.y < -10 : open.get() < 0.6;
      if (flicked || pushed) {
        onDismiss();
        return;
      }
      if (!reduced) settle(1, velocity.y / range.current);
      leaveIn(HIDE_AFTER_HOLD);
    },
  });

  // A push ends in a click too; only a real tap should go anywhere. For the
  // link that means stopping the browser from following it.
  const tapped = (e: MouseEvent) => {
    if (!pan.dragged.current) return true;
    pan.dragged.current = false;
    e.preventDefault();
    return false;
  };

  const content = !notice.app ? (
    notice.content
  ) : (
    <>
      <AppIcon icon={notice.app.icon} style={{ fontSize: 34 }} />
      <span className="banner__text">
        <span className="banner__top">
          <span className="banner__app">{notice.app.name}</span>
          <span className="banner__when">{notice.when}</span>
        </span>
        <span className="banner__title">{notice.title}</span>
        <span className="banner__body">{notice.body}</span>
      </span>
    </>
  );

  const hit = notice.href ? (
    <a
      className="banner__hit"
      href={notice.href}
      target="_blank"
      rel="noopener noreferrer"
      // Dragging a link would otherwise start the browser's own drag of it.
      draggable={false}
      onClick={(e) => {
        if (tapped(e)) onDismiss();
      }}
    >
      {content}
    </a>
  ) : (
    <button
      type="button"
      className="banner__hit"
      onClick={(e) => {
        if (tapped(e)) onActivate(notice);
      }}
    >
      {content}
    </button>
  );

  // Android: the banner's own height and a bit, above the screen.
  const bannerRef = useRef<HTMLDivElement>(null);
  const bannerY = useTransform(open, (p) => `${(p - 1) * 140}%`);
  useLayoutEffect(() => {
    if (os === "android" && bannerRef.current) {
      range.current = bannerRef.current.offsetHeight * 1.4;
    }
  }, [os]);

  if (os === "android") {
    return (
      <m.div
        ref={bannerRef}
        className="banner"
        role="status"
        style={reduced ? { opacity: open } : { y: bannerY }}
        onPointerDown={pan.onPointerDown}
      >
        {hit}
      </m.div>
    );
  }

  return (
    <IslandNotice
      pill={island}
      open={open}
      range={range}
      reduced={reduced}
      onPointerDown={pan.onPointerDown}
    >
      {hit}
    </IslandNotice>
  );
}
