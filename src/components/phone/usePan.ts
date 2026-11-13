import {
  useCallback,
  useRef,
  type PointerEvent as ReactPointerEvent,
} from "react";

export type Pan = {
  offset: { x: number; y: number };
  /** px per second, averaged over the last ~100ms of movement. */
  velocity: { x: number; y: number };
};

type Handlers = {
  onStart?: () => void;
  onMove: (pan: Pan) => void;
  onEnd: (pan: Pan) => void;
};

/**
 * One-finger drag from an element, tracked on the window so it keeps going
 * when the finger leaves the element (the element itself is usually what's
 * moving). Returns the pointerdown handler to put on the handle, and whether
 * the last press turned into a drag, so the click that follows can be ignored.
 */
export function usePan(handlers: Handlers, threshold = 3) {
  const latest = useRef(handlers);
  latest.current = handlers;
  const dragged = useRef(false);

  const onPointerDown = useCallback(
    (down: ReactPointerEvent) => {
      if (down.pointerType === "mouse" && down.button !== 0) return;
      const id = down.pointerId;
      const start = { x: down.clientX, y: down.clientY };
      let samples: { t: number; x: number; y: number }[] = [];
      let active = false;
      dragged.current = false;

      const read = (e: PointerEvent): Pan => {
        const first = samples[0];
        const last = samples[samples.length - 1];
        const dt = first && last ? (last.t - first.t) / 1000 : 0;
        return {
          offset: { x: e.clientX - start.x, y: e.clientY - start.y },
          velocity:
            dt > 0.016
              ? { x: (last.x - first.x) / dt, y: (last.y - first.y) / dt }
              : { x: 0, y: 0 },
        };
      };

      const move = (e: PointerEvent) => {
        if (e.pointerId !== id) return;
        const t = performance.now();
        samples.push({ t, x: e.clientX, y: e.clientY });
        while (samples.length > 2 && t - samples[0].t > 100) samples.shift();
        if (!active) {
          if (
            Math.hypot(e.clientX - start.x, e.clientY - start.y) < threshold
          ) {
            return;
          }
          active = true;
          dragged.current = true;
          latest.current.onStart?.();
        }
        latest.current.onMove(read(e));
      };

      const end = (e: PointerEvent) => {
        if (e.pointerId !== id) return;
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", end);
        window.removeEventListener("pointercancel", end);
        if (active) latest.current.onEnd(read(e));
        samples = [];
      };

      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", end);
      window.addEventListener("pointercancel", end);
    },
    [threshold],
  );

  return { onPointerDown, dragged };
}
