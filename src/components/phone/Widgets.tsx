"use client";

import { Children, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";

/**
 * The home screen's widgets. Where the screen is tall enough they sit one
 * under the other. Where it isn't (a phone in the hand, where the browser's
 * own bars take a fifth of the height) they share one place and are swiped
 * between, like a stack of widgets on a real one.
 *
 * Which of the two it is, is decided in the stylesheet from the screen's
 * shape. The swiping is the browser's own scrolling with snap points, so it
 * has the platform's momentum and never fights the page's vertical scroll;
 * all that is left to do here is the dots.
 */
export default function Widgets({ children }: { children: ReactNode }) {
  const pages = Children.toArray(children);
  const row = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const reduced = useReducedMotion();

  const show = (i: number) => {
    const el = row.current;
    if (!el) return;
    el.scrollTo({
      left: i * el.clientWidth,
      behavior: reduced ? "auto" : "smooth",
    });
  };

  return (
    <div className="widgets">
      <div
        ref={row}
        className="widgets__row"
        onScroll={(e) => {
          const el = e.currentTarget;
          if (el.clientWidth)
            setPage(Math.round(el.scrollLeft / el.clientWidth));
        }}
      >
        {children}
      </div>
      {pages.length > 1 && (
        <div className="widgets__dots">
          {pages.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Widget ${i + 1} of ${pages.length}`}
              aria-current={i === page || undefined}
              onClick={() => show(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
