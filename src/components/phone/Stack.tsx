"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  animate,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import * as m from "motion/react-m";
import { useBack } from "./nav";
import { usePan } from "./usePan";

type StackApi = {
  /** Slide a new screen in over the current one. */
  push: (screen: ReactNode) => void;
  /** Go back one screen. */
  pop: () => void;
};

const StackContext = createContext<StackApi | null>(null);

export function useStack() {
  const api = useContext(StackContext);
  if (!api) throw new Error("useStack must be used inside <Stack>");
  return api;
}

/**
 * What a screen's navigation bar needs to stay put while the screen under it
 * slides: how far to shift back against its layer, and how much of it shows.
 */
export type LayerBar = { x: MotionValue<string>; fade: MotionValue<number> };
const LayerBarContext = createContext<LayerBar | null>(null);

/** The bar's share of a push or pop; null outside a stack. */
export function useLayerBar() {
  return useContext(LayerBarContext);
}

const SPRING = { type: "spring", stiffness: 340, damping: 36 } as const;

/**
 * Screen-over-screen navigation inside one app: a list, then the thing you
 * tapped. One number drives the whole transition (0 = the top screen is off
 * to the right, 1 = it covers the one beneath), so the back button, Esc and
 * a swipe from the left edge are the same motion and can interrupt each other.
 */
export default function Stack({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const [pushed, setPushed] = useState<ReactNode[]>([]);
  const progress = useMotionValue(1);
  const running = useRef<{ stop: () => void } | null>(null);

  const topX = useTransform(progress, (p) => `${(1 - p) * 100}%`);
  // The screen beneath slides a little the other way and dims: it reads as
  // further back rather than simply covered.
  const underX = useTransform(progress, (p) => `${-22 * p}%`);
  const shade = useTransform(progress, [0, 1], [0, 0.16]);

  // The pages move; the bars don't. Each bar is shifted back by exactly what
  // its layer has moved, so it stays where a bar belongs, and the incoming
  // one fades in over the outgoing one in place: a back button appears where
  // it will be pressed instead of riding in on the page.
  const topBarX = useTransform(progress, (p) => `${(p - 1) * 100}%`);
  const underBarX = useTransform(progress, (p) => `${22 * p}%`);
  const topBarFade = useTransform(progress, [0.2, 1], [0, 1]);
  const underBarFade = useTransform(progress, [0, 0.6], [1, 0]);
  const bars = useMemo(
    () => ({
      top: { x: topBarX, fade: topBarFade },
      under: { x: underBarX, fade: underBarFade },
    }),
    [topBarX, topBarFade, underBarX, underBarFade],
  );

  const settle = useCallback(
    (to: 0 | 1, done?: () => void) => {
      running.current?.stop();
      if (reduced) {
        progress.set(to);
        done?.();
        return;
      }
      running.current = animate(progress, to, {
        ...SPRING,
        velocity: Math.max(-6, Math.min(6, progress.getVelocity())),
        onComplete: done,
      });
    },
    [reduced, progress],
  );

  const push = useCallback(
    (screen: ReactNode) => {
      running.current?.stop();
      progress.jump(0);
      setPushed((screens) => [...screens, screen]);
      settle(1);
    },
    [progress, settle],
  );

  const depth = pushed.length;
  const pop = useCallback(() => {
    if (depth === 0) return;
    settle(0, () => {
      setPushed((screens) => screens.slice(0, -1));
      // The screen that was beneath is the top one now, already in place.
      progress.jump(1);
    });
  }, [depth, settle, progress]);

  // With a screen pushed, "back" (Esc, the Android back button) pops it
  // instead of closing the app.
  useBack(1, pop, depth > 0);

  // Keyboard focus follows the screen: the row that was activated is in a
  // layer that just went inert.
  const layers = useRef(new Map<number, HTMLElement>());
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    layers.current.get(depth)?.focus({ preventScroll: true });
  }, [depth]);

  // Swipe from the left edge to go back.
  const pan = usePan({
    onStart: () => running.current?.stop(),
    onMove: ({ offset }) => {
      if (reduced) return;
      const width = rootRef.current?.clientWidth ?? 320;
      progress.set(Math.max(0, Math.min(1, 1 - offset.x / width)));
    },
    onEnd: ({ offset, velocity }) => {
      if (reduced) return;
      const width = rootRef.current?.clientWidth ?? 320;
      if (velocity.x > 400 || offset.x > width * 0.35) pop();
      else settle(1);
    },
  });

  const api = useMemo(() => ({ push, pop }), [push, pop]);
  const all = [children, ...pushed];

  return (
    <StackContext.Provider value={api}>
      <div ref={rootRef} className="stack">
        {all.map((screen, i) => {
          const role =
            i === all.length - 1
              ? "top"
              : i === all.length - 2
                ? "under"
                : "buried";
          return (
            <m.div
              key={i}
              ref={(el) => {
                if (el) layers.current.set(i, el);
                else layers.current.delete(i);
              }}
              className="stack__layer"
              data-role={role}
              tabIndex={-1}
              inert={role !== "top"}
              style={{
                x: role === "top" ? topX : role === "under" ? underX : "-22%",
              }}
            >
              <LayerBarContext.Provider
                value={role === "buried" ? null : bars[role]}
              >
                {screen}
              </LayerBarContext.Provider>
              {role === "under" && (
                <m.span
                  aria-hidden
                  className="stack__shade"
                  style={{ opacity: shade }}
                />
              )}
            </m.div>
          );
        })}
        {depth > 0 && (
          <div
            aria-hidden
            className="stack__edge"
            onPointerDown={pan.onPointerDown}
          />
        )}
      </div>
    </StackContext.Provider>
  );
}
