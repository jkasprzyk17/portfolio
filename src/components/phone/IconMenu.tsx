"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowDownToLine, ArrowUpRight } from "lucide-react";
import * as m from "motion/react-m";
import AppIcon from "./AppIcon";
import type { Rect, ScreenSize } from "./AppWindow";
import type { AppDef } from "./apps";

export type Shortcut = { label: string; href: string; download?: boolean };

const GAP = 10;
const SPRING = { type: "spring", stiffness: 520, damping: 36 } as const;

/**
 * What a long press on an icon brings up: the icon lifted off a blurred home
 * screen, and next to it the places you can go straight to without opening
 * the app. It grows out of the icon and stays inside the screen, flipping
 * above or to the left when the icon is near an edge.
 */
export default function IconMenu({
  app,
  rect,
  screen,
  shortcuts,
  focusFirst,
  canDismiss,
  onOpen,
  onClose,
}: {
  app: AppDef;
  rect: Rect;
  screen: ScreenSize;
  shortcuts: Shortcut[];
  /** Opened from the keyboard: put focus on the first item. */
  focusFirst: boolean;
  /** False while the finger that opened the menu is still down. */
  canDismiss: () => boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [place, setPlace] = useState<{
    left: number;
    top: number;
    fromRight: boolean;
    fromBottom: boolean;
  } | null>(null);

  useLayoutEffect(() => {
    const el = menuRef.current;
    if (!el) return;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    // Below the icon and its label if there is room, otherwise above.
    const below = rect.y + rect.h + 24;
    const fromBottom = below + h > screen.h - GAP;
    const fromRight = rect.x + w > screen.w - GAP;
    setPlace({
      left: fromRight ? Math.max(GAP, rect.x + rect.w - w) : rect.x,
      top: fromBottom ? Math.max(GAP, rect.y - GAP - h) : below,
      fromRight,
      fromBottom,
    });
  }, [rect, screen.w, screen.h]);

  useEffect(() => {
    if (focusFirst && place) {
      menuRef.current
        ?.querySelector<HTMLElement>('[role="menuitem"]')
        ?.focus({ preventScroll: true });
    }
  }, [focusFirst, place]);

  return (
    <>
      <m.div
        className="menu-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.16 }}
        onClick={() => {
          if (canDismiss()) onClose();
        }}
      />

      <m.span
        aria-hidden
        className="menu-icon"
        style={{ left: rect.x, top: rect.y, fontSize: rect.w }}
        initial={{ scale: 1 }}
        animate={{ scale: 1.08 }}
        exit={{ scale: 1 }}
        transition={SPRING}
      >
        <AppIcon icon={app.icon} />
      </m.span>

      <m.div
        ref={menuRef}
        className="menu"
        role="menu"
        aria-label={`${app.name} shortcuts`}
        style={{
          left: place?.left ?? 0,
          top: place?.top ?? 0,
          visibility: place ? "visible" : "hidden",
          originX: place?.fromRight ? 1 : 0,
          originY: place?.fromBottom ? 1 : 0,
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={SPRING}
      >
        <button
          type="button"
          role="menuitem"
          className="menu__item"
          onClick={onOpen}
        >
          Open {app.name}
        </button>
        {shortcuts.map((s) => (
          <a
            key={s.href}
            role="menuitem"
            className="menu__item"
            href={s.href}
            download={s.download}
            {...(/^https?:/.test(s.href)
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            onClick={onClose}
          >
            <span>{s.label}</span>
            {s.download ? (
              <ArrowDownToLine size={14} aria-hidden />
            ) : (
              <ArrowUpRight size={14} aria-hidden />
            )}
          </a>
        ))}
      </m.div>
    </>
  );
}
