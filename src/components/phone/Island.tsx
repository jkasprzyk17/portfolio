"use client";

import {
  useLayoutEffect,
  useRef,
  useState,
  type PointerEventHandler,
  type ReactNode,
  type RefObject,
} from "react";
import * as m from "motion/react-m";

// A little bounce on the way out, none on the way back: the island reaches
// for your attention and then just puts itself away.
const GROW = { type: "spring", stiffness: 420, damping: 30 } as const;
const SHRINK = { type: "spring", stiffness: 520, damping: 44 } as const;

type Box = {
  /** The island at rest. */
  rest: { w: number; h: number };
  /** The island holding the notification. */
  open: { w: number; h: number };
};

/**
 * A notification on the iOS skin. It doesn't drop in from off-screen: the
 * island itself grows into it and shrinks back when it's done, so this is
 * drawn as a second black shape that starts exactly over the resting one
 * (.island, which never moves) and returns to it before unmounting.
 */
export default function IslandNotice({
  pill,
  reduced,
  onPointerDown,
  children,
}: {
  /** The island at rest, to grow out of. */
  pill: RefObject<HTMLElement | null>;
  reduced: boolean;
  onPointerDown: PointerEventHandler;
  children: ReactNode;
}) {
  const content = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<Box | null>(null);

  // Before the first paint: until then the shape is the resting island (its
  // CSS says so), and the text is already laid out at its final width.
  // Layout offsets, not getBoundingClientRect, because the device may be
  // tilted toward the cursor. Only the size is animated: the corner is one
  // fixed radius in CSS, which a box too short for it wears as round ends.
  useLayoutEffect(() => {
    const rest = pill.current;
    const text = content.current;
    if (!rest || !text) return;
    setBox({
      rest: { w: rest.offsetWidth, h: rest.offsetHeight },
      open: { w: text.offsetWidth, h: text.offsetHeight },
    });
  }, [pill]);

  // Reduced motion: it appears at full size where it is, and fades.
  if (reduced) {
    return (
      <m.div
        className="island-notice"
        data-still=""
        role="status"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onPointerDown={onPointerDown}
      >
        <div className="island-notice__content">{children}</div>
      </m.div>
    );
  }

  return (
    <m.div
      className="island-notice"
      role="status"
      animate={
        box
          ? { width: box.open.w, height: box.open.h, transition: GROW }
          : undefined
      }
      exit={
        box
          ? { width: box.rest.w, height: box.rest.h, transition: SHRINK }
          : undefined
      }
      onPointerDown={onPointerDown}
    >
      {/* The text keeps its final size and place throughout; the shape opens
          over it like a window, so nothing reflows while it grows. */}
      <m.div
        ref={content}
        className="island-notice__content"
        initial={{ opacity: 0, scale: 0.94, filter: "blur(5px)" }}
        animate={{
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          transition: { delay: 0.08, duration: 0.3, ease: [0.23, 1, 0.32, 1] },
        }}
        exit={{
          opacity: 0,
          filter: "blur(5px)",
          transition: { duration: 0.12 },
        }}
      >
        {children}
      </m.div>
    </m.div>
  );
}
