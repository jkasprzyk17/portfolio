"use client";

import {
  useLayoutEffect,
  useRef,
  useState,
  type PointerEventHandler,
  type ReactNode,
  type RefObject,
} from "react";
import { useTransform, type MotionValue } from "motion/react";
import * as m from "motion/react-m";

type Box = {
  /** The island at rest. */
  rest: { w: number; h: number };
  /** The island holding the notification. */
  open: { w: number; h: number };
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * A notification on the iOS skin. It doesn't drop in from off-screen: the
 * island itself grows into it and shrinks back when it's done, so this is
 * drawn as a second black shape that starts exactly over the resting one
 * (.island, which never moves) and returns to it before unmounting.
 *
 * It only draws: `open` (0 the island at rest, 1 holding the notification)
 * comes from Banner.tsx, which also moves it. Past 1 the shape simply keeps
 * growing, which is the spring's bounce and the give under a downward pull.
 */
export default function IslandNotice({
  pill,
  open,
  range,
  reduced,
  onPointerDown,
  children,
}: {
  /** The island at rest, to grow out of. */
  pill: RefObject<HTMLElement | null>;
  open: MotionValue<number>;
  /** Told here how far a finger travels to close it: its growth in height,
      so pushing it up closes it at the finger's own speed. */
  range: RefObject<number>;
  reduced: boolean;
  onPointerDown: PointerEventHandler;
  children: ReactNode;
}) {
  const content = useRef<HTMLDivElement>(null);
  const box = useRef<Box | null>(null);
  const [, setMeasured] = useState(false);

  // Before the first paint: until then the shape is the resting island (its
  // CSS says so), and the text is already laid out at its final width.
  // Layout offsets, not getBoundingClientRect, because the device may be
  // tilted toward the cursor. Only the size is driven from here: the corner
  // is one fixed radius in CSS, which a box too short for it wears as round
  // ends.
  useLayoutEffect(() => {
    const rest = pill.current;
    const text = content.current;
    if (!rest || !text) return;
    box.current = {
      rest: { w: rest.offsetWidth, h: rest.offsetHeight },
      open: { w: text.offsetWidth, h: text.offsetHeight },
    };
    range.current = Math.max(24, text.offsetHeight - rest.offsetHeight);
    setMeasured(true);
  }, [pill, range]);

  const width = useTransform(open, (p): number | string =>
    box.current
      ? lerp(box.current.rest.w, box.current.open.w, p)
      : "var(--island-w)",
  );
  const height = useTransform(open, (p): number | string =>
    box.current
      ? lerp(box.current.rest.h, box.current.open.h, p)
      : "var(--island-h)",
  );
  // The text arrives once there is room for it and is gone before the
  // shape has closed over it.
  const textOpacity = useTransform(open, [0.3, 0.85], [0, 1]);
  const textBlur = useTransform(open, [0.3, 0.85], ["blur(5px)", "blur(0px)"]);
  const textScale = useTransform(open, [0, 1], [0.94, 1]);

  // Reduced motion: it is there at full size, and `open` is only its fade.
  if (reduced) {
    return (
      <m.div
        className="island-notice"
        data-still=""
        role="status"
        style={{ opacity: open }}
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
      style={{ width, height }}
      onPointerDown={onPointerDown}
    >
      {/* The text keeps its final size and place throughout; the shape opens
          over it like a window, so nothing reflows while it grows. */}
      <m.div
        ref={content}
        className="island-notice__content"
        style={{ opacity: textOpacity, filter: textBlur, scale: textScale }}
      >
        {children}
      </m.div>
    </m.div>
  );
}
