"use client";

import { useEffect } from "react";
import { AnimatePresence, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import AppIcon from "./AppIcon";
import type { AppDef } from "./apps";
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
 * A notification dropping in from the top of the screen: the way a phone
 * asks for attention, so it needs no explaining. It leaves on its own, can
 * be flicked away upward, and tapping it goes where it says.
 */
export default function Banner({
  notice,
  onActivate,
  onDismiss,
}: {
  notice: Notice | null;
  onActivate: (notice: Notice) => void;
  onDismiss: () => void;
}) {
  const reduced = useReducedMotion();

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

  return (
    <AnimatePresence>
      {notice && (
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
          {notice.href ? (
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
          )}
        </m.div>
      )}
    </AnimatePresence>
  );
}
