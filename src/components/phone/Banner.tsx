"use client";

import { useEffect, type RefObject } from "react";
import { AnimatePresence, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import AppIcon from "./AppIcon";
import type { AppDef } from "./apps";
import IslandNotice from "./Island";
import { useOs } from "./os";
import { usePan } from "./usePan";

export type Notice = {
  id: string;
  /** Whose notification it is: icon and name. */
  app: AppDef;
  title: string;
  body: string;
  when: string;
  /** A notification that leads somewhere outside the phone. */
  href?: string;
};

const HIDE_AFTER = 6500;

/**
 * A notification at the top of the screen: the way a phone asks for
 * attention, so it needs no explaining. It leaves on its own, can be flicked
 * away upward, and tapping it goes where it says.
 *
 * How it arrives is the platform's: on iOS the island opens into it, on
 * Android a banner drops in from above. Everything else (what it says, how
 * long it stays, what a tap or a flick does) is the same code for both.
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
  const reduced = useReducedMotion();
  const os = useOs();

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(onDismiss, HIDE_AFTER);
    return () => clearTimeout(timer);
  }, [notice, onDismiss]);

  const pan = usePan({
    onMove: () => {},
    onEnd: ({ offset, velocity }) => {
      if (offset.y < -10 || velocity.y < -200) onDismiss();
    },
  });

  // Reduced motion: it fades where it is instead of travelling.
  const away = reduced ? { opacity: 0 } : { y: "-140%", opacity: 1 };
  const here = reduced ? { opacity: 1 } : { y: 0, opacity: 1 };

  const content = notice && (
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

  const hit =
    notice &&
    (notice.href ? (
      <a
        className="banner__hit"
        href={notice.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onDismiss}
      >
        {content}
      </a>
    ) : (
      <button
        type="button"
        className="banner__hit"
        onClick={() => {
          // A flick ends in a click too.
          if (pan.dragged.current) pan.dragged.current = false;
          else onActivate(notice);
        }}
      >
        {content}
      </button>
    ));

  return (
    <AnimatePresence>
      {notice &&
        (os === "android" ? (
          <m.div
            key={notice.id}
            className="banner"
            role="status"
            initial={away}
            animate={here}
            exit={away}
            transition={{ type: "spring", stiffness: 380, damping: 34 }}
            onPointerDown={pan.onPointerDown}
          >
            {hit}
          </m.div>
        ) : (
          <IslandNotice
            key={notice.id}
            pill={island}
            reduced={!!reduced}
            onPointerDown={pan.onPointerDown}
          >
            {hit}
          </IslandNotice>
        ))}
    </AnimatePresence>
  );
}
