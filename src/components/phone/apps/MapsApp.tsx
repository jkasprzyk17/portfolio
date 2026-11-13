"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import {
  AnimatePresence,
  animate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from "motion/react";
// `m` is a marker everywhere in this file, hence the capital.
import * as M from "motion/react-m";
import { ArrowUpRight, LocateFixed, Minus, Plus, X } from "lucide-react";
import { Dots } from "../Info";
import {
  FULL,
  LEVEL_SHIFT,
  ZOOM_MAX,
  ZOOM_MIN,
  bounds,
  boundsOf,
  groupIds,
  groups,
  levelAt,
  markersAt,
  places,
  type GroupId,
  type Marker,
  type Place,
} from "./mapData";

// The camera is three numbers: the world point at the centre of the screen
// and a zoom. Everything on screen is derived from them, and they live in
// motion values, so panning and pinching never re-render React. React only
// hears about the zoom when it crosses a whole level, which is when the
// clusters change.
const HOME = {
  cx: (bounds.x0 + bounds.x1) / 2,
  cy: (bounds.y0 + bounds.y1) / 2 + 8,
  // Just under where level 3 begins: one cluster per group, as large as that
  // level gets.
  zoom: 3.2,
};
// How far the centre may stray: the pins plus a margin, so the map can't be
// thrown somewhere with nothing on it.
const LIMIT = {
  x0: bounds.x0 - 70,
  x1: bounds.x1 + 70,
  y0: bounds.y0 - 90,
  y1: bounds.y1 + 90,
};
const OVERZOOM = 0.45;

const CAMERA_SPRING = { type: "spring", stiffness: 170, damping: 26 } as const;
const ZOOM_SPRING = { type: "spring", stiffness: 300, damping: 34 } as const;
const MARKER_SPRING = { type: "spring", stiffness: 420, damping: 36 } as const;

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));
// Past a limit the value keeps moving, at a third of the speed: resistance
// instead of a wall.
const rubber = (v: number, min: number, max: number) =>
  v < min ? min - (min - v) * 0.35 : v > max ? max + (v - max) * 0.35 : v;

type Point = { x: number; y: number };

export default function MapsApp() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const terrainRef = useRef<SVGGElement>(null);

  const vw = useMotionValue(300);
  const vh = useMotionValue(600);
  const cx = useMotionValue(HOME.cx);
  const cy = useMotionValue(HOME.cy);
  const zoom = useMotionValue(HOME.zoom);

  const k = useTransform(zoom, (z) => 2 ** (z - FULL));
  const tx = useTransform([cx, k, vw], ([c, s, w]: number[]) => w / 2 - c * s);
  const ty = useTransform([cy, k, vh], ([c, s, h]: number[]) => h / 2 - c * s);

  // The terrain is vector, redrawn through an SVG transform so it stays
  // sharp at any zoom; markers sit in a scaled layer and undo the scale on
  // themselves (--inv) so they keep their size.
  const frame = useTransform([tx, ty, k], ([x, y, s]: number[]) => ({
    x,
    y,
    s,
  }));
  const paint = useCallback(
    ({ x, y, s }: { x: number; y: number; s: number }) => {
      terrainRef.current?.setAttribute(
        "transform",
        `translate(${x} ${y}) scale(${s})`,
      );
      worldRef.current?.style.setProperty("--inv", String(1 / s));
    },
    [],
  );
  useMotionValueEvent(frame, "change", paint);
  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const measure = () => {
      vw.set(el.clientWidth);
      vh.set(el.clientHeight);
      paint(frame.get());
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [vw, vh, frame, paint]);

  const [level, setLevel] = useState(levelAt(HOME.zoom));
  useMotionValueEvent(zoom, "change", (z) => {
    const next = levelAt(z);
    setLevel((prev) => (prev === next ? prev : next));
  });

  const markers = useMemo(() => markersAt(level), [level]);
  const previous = useRef(markers);
  useEffect(() => {
    previous.current = markers;
  }, [markers]);
  // Which marker each place is part of now: leaving markers read it to know
  // where to go.
  const owner = useMemo(() => {
    const map = new Map<string, Marker>();
    markers.forEach((m) => m.ids.forEach((id) => map.set(id, m)));
    return map;
  }, [markers]);

  const [selected, setSelected] = useState<Place | null>(null);

  // ── Camera moves ──────────────────────────────────────────────────────
  const running = useRef<{ stop: () => void }[]>([]);
  const stop = useCallback(() => {
    running.current.forEach((a) => a.stop());
    running.current = [];
  }, []);

  const flyTo = useCallback(
    (to: { cx?: number; cy?: number; zoom?: number }) => {
      stop();
      const run = (value: typeof cx, target: number) => {
        if (reduced) value.set(target);
        else running.current.push(animate(value, target, CAMERA_SPRING));
      };
      if (to.cx !== undefined) run(cx, clamp(to.cx, LIMIT.x0, LIMIT.x1));
      if (to.cy !== undefined) run(cy, clamp(to.cy, LIMIT.y0, LIMIT.y1));
      if (to.zoom !== undefined) run(zoom, clamp(to.zoom, ZOOM_MIN, ZOOM_MAX));
    },
    [stop, reduced, cx, cy, zoom],
  );

  // Change the zoom while the world point under `from` ends up under `to`
  // (the same screen point for a wheel, a moving midpoint for a pinch).
  const zoomAround = useCallback(
    (from: Point, to: Point, nextZoom: number) => {
      const s0 = 2 ** (zoom.get() - FULL);
      const s1 = 2 ** (nextZoom - FULL);
      const wx = cx.get() + (from.x - vw.get() / 2) / s0;
      const wy = cy.get() + (from.y - vh.get() / 2) / s0;
      zoom.set(nextZoom);
      cx.set(wx - (to.x - vw.get() / 2) / s1);
      cy.set(wy - (to.y - vh.get() / 2) / s1);
    },
    [zoom, cx, cy, vw, vh],
  );

  // An animated zoom about a fixed screen point: one value is sprung and
  // each step is applied through zoomAround.
  const focus = useRef<Point>({ x: 0, y: 0 });
  const sprungZoom = useMotionValue(HOME.zoom);
  useMotionValueEvent(sprungZoom, "change", (z) =>
    zoomAround(focus.current, focus.current, z),
  );
  const zoomTo = useCallback(
    (target: number, about?: Point) => {
      stop();
      focus.current = about ?? { x: vw.get() / 2, y: vh.get() / 2 };
      const to = clamp(target, ZOOM_MIN, ZOOM_MAX);
      if (reduced) {
        zoomAround(focus.current, focus.current, to);
        return;
      }
      sprungZoom.jump(zoom.get());
      running.current.push(animate(sprungZoom, to, ZOOM_SPRING));
    },
    [stop, reduced, zoom, sprungZoom, zoomAround, vw, vh],
  );

  const settle = useCallback(() => {
    // After a gesture: anything left outside the limits springs back in.
    const z = zoom.get();
    if (z < ZOOM_MIN || z > ZOOM_MAX) {
      zoomTo(clamp(z, ZOOM_MIN, ZOOM_MAX), focus.current);
      return;
    }
    const x = cx.get();
    const y = cy.get();
    if (x < LIMIT.x0 || x > LIMIT.x1 || y < LIMIT.y0 || y > LIMIT.y1) {
      flyTo({ cx: x, cy: y });
    }
  }, [zoom, cx, cy, zoomTo, flyTo]);

  const fit = useCallback(
    (b: { x0: number; x1: number; y0: number; y1: number }) => {
      // Room for the chips above and the labels and controls below.
      const w = Math.max(60, vw.get() - 110);
      const h = Math.max(60, vh.get() - 300);
      const scale = Math.min(
        w / Math.max(b.x1 - b.x0, 40),
        h / Math.max(b.y1 - b.y0, 40),
      );
      flyTo({
        cx: (b.x0 + b.x1) / 2,
        cy: (b.y0 + b.y1) / 2 + 6,
        zoom: Math.min(FULL + LEVEL_SHIFT + 0.6, FULL + Math.log2(scale)),
      });
    },
    [flyTo, vw, vh],
  );

  // ── Touch, mouse, trackpad ────────────────────────────────────────────
  const gesture = useRef({
    pointers: new Map<number, Point>(),
    moved: 0,
    pinched: false,
    pinchZoom: 0,
    samples: [] as { t: number; x: number; y: number }[],
    lastTap: { t: 0, x: 0, y: 0 },
    onMap: false,
  });

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const g = gesture.current;
    const local = (e: { clientX: number; clientY: number }): Point => {
      const rect = el.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const two = () => {
      const [a, b] = [...g.pointers.values()];
      return {
        mid: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
        dist: Math.hypot(a.x - b.x, a.y - b.y) || 1,
      };
    };

    const onMove = (e: PointerEvent) => {
      const before = g.pointers.get(e.pointerId);
      if (!before) return;
      const now = local(e);

      if (g.pointers.size >= 2) {
        const was = two();
        g.pointers.set(e.pointerId, now);
        const is = two();
        g.pinchZoom += Math.log2(is.dist / was.dist);
        zoomAround(was.mid, is.mid, rubber(g.pinchZoom, ZOOM_MIN, ZOOM_MAX));
        focus.current = is.mid;
        g.pinched = true;
        g.moved += 10;
        return;
      }

      g.pointers.set(e.pointerId, now);
      const s = k.get();
      cx.set(cx.get() - (now.x - before.x) / s);
      cy.set(cy.get() - (now.y - before.y) / s);
      g.moved += Math.abs(now.x - before.x) + Math.abs(now.y - before.y);
      const t = performance.now();
      g.samples.push({ t, ...now });
      while (g.samples.length > 2 && t - g.samples[0].t > 110)
        g.samples.shift();
    };

    const onUp = (e: PointerEvent) => {
      if (!g.pointers.delete(e.pointerId)) return;
      if (g.pointers.size > 0) {
        // One finger of a pinch lifted: the other carries on as a pan, from
        // where it is now.
        g.samples = [];
        return;
      }
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);

      if (g.pinched) {
        settle();
        return;
      }

      if (g.moved < 6) {
        if (!g.onMap) return;
        // A tap on the map itself: put the card away, and a second tap in
        // the same spot zooms in.
        setSelected(null);
        const p = local(e);
        const t = performance.now();
        const again =
          t - g.lastTap.t < 320 &&
          Math.hypot(p.x - g.lastTap.x, p.y - g.lastTap.y) < 30;
        g.lastTap = again ? { t: 0, x: 0, y: 0 } : { t, ...p };
        if (again) zoomTo(zoom.get() + 1, p);
        return;
      }

      // Let go while moving: the map keeps going and eases to a stop, and
      // bounces back if that would carry it past the limits.
      const first = g.samples[0];
      const last = g.samples[g.samples.length - 1];
      const dt = first && last ? (last.t - first.t) / 1000 : 0;
      const s = k.get();
      const vx = dt > 0.016 ? (last.x - first.x) / dt : 0;
      const vy = dt > 0.016 ? (last.y - first.y) / dt : 0;
      if (reduced || Math.hypot(vx, vy) < 60) {
        settle();
        return;
      }
      const glide = {
        type: "inertia",
        power: 0.5,
        timeConstant: 280,
        bounceStiffness: 260,
        bounceDamping: 34,
      } as const;
      // Inertia only reads where the value starts and how fast it is going;
      // the target is ignored. But Motion skips any animation whose start and
      // target are equal, so the target is nudged one unit the way it's moving.
      const worldVx = -vx / s;
      const worldVy = -vy / s;
      running.current = [
        animate(cx, cx.get() + Math.sign(worldVx || 1), {
          ...glide,
          velocity: worldVx,
          min: LIMIT.x0,
          max: LIMIT.x1,
        }),
        animate(cy, cy.get() + Math.sign(worldVy || 1), {
          ...glide,
          velocity: worldVy,
          min: LIMIT.y0,
          max: LIMIT.y1,
        }),
      ];
    };

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      const target = e.target as Element;
      // Chips, zoom buttons and the place card are on top of the map, not
      // part of it.
      if (target.closest("[data-map-ui]")) return;
      stop();
      if (g.pointers.size === 0) {
        g.moved = 0;
        g.pinched = false;
        g.samples = [];
        g.onMap = !target.closest("button, a");
        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);
        window.addEventListener("pointercancel", onUp);
      }
      g.pointers.set(e.pointerId, local(e));
      if (g.pointers.size === 2) g.pinchZoom = zoom.get();
    };

    // Wheel has to be a native, non-passive listener: React's onWheel can't
    // preventDefault, and without that the page scrolls under the map.
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const p = local(e);
      const delta = e.deltaY * (e.deltaMode === 1 ? 16 : 1);
      if (!e.ctrlKey && Math.abs(delta) >= 50) {
        // A mouse wheel notch: one sprung step rather than a jump.
        zoomTo(zoom.get() - Math.sign(delta) * 0.6, p);
        return;
      }
      // Trackpad: pinch arrives as ctrl+wheel, two-finger scroll as plain
      // wheel. Both are a stream of small deltas, applied as they come.
      stop();
      const dz = clamp(-delta * (e.ctrlKey ? 0.012 : 0.004), -0.5, 0.5);
      zoomAround(p, p, clamp(zoom.get() + dz, ZOOM_MIN, ZOOM_MAX));
    };

    // Safari reports a trackpad pinch as gesture events instead of
    // ctrl+wheel. On iOS they fire alongside touch pointers, which already
    // drive the pinch above, so they are ignored while fingers are down.
    let gestureZoom = 0;
    const onGestureStart = (e: Event) => {
      e.preventDefault();
      if (g.pointers.size) return;
      stop();
      gestureZoom = zoom.get();
    };
    const onGestureChange = (e: Event) => {
      e.preventDefault();
      if (g.pointers.size) return;
      const ge = e as Event & {
        scale: number;
        clientX: number;
        clientY: number;
      };
      const p = local(ge);
      zoomAround(
        p,
        p,
        rubber(gestureZoom + Math.log2(ge.scale), ZOOM_MIN, ZOOM_MAX),
      );
      focus.current = p;
    };
    const onGestureEnd = (e: Event) => {
      e.preventDefault();
      if (!g.pointers.size) settle();
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("gesturestart", onGestureStart);
    el.addEventListener("gesturechange", onGestureChange);
    el.addEventListener("gestureend", onGestureEnd);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("gesturestart", onGestureStart);
      el.removeEventListener("gesturechange", onGestureChange);
      el.removeEventListener("gestureend", onGestureEnd);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [cx, cy, zoom, k, reduced, stop, settle, zoomAround, zoomTo]);

  useEffect(() => stop, [stop]);

  // A drag that happens to start and end on a marker is not a tap on it.
  const tapped = (action: () => void) => () => {
    if (gesture.current.moved < 6) action();
  };

  const expand = (m: Marker) =>
    flyTo({
      cx: m.x,
      cy: m.y,
      // Far enough past the level where it breaks apart that the pieces
      // have room, not just barely over the line.
      zoom: (m.expandsAt ?? level + 1) + LEVEL_SHIFT + 0.3,
    });

  const select = (place: Place) => {
    setSelected(place);
    const z = Math.max(zoom.get(), FULL + LEVEL_SHIFT + 0.05);
    // Sit the pin a little above centre so the card doesn't cover it.
    flyTo({ cx: place.x, cy: place.y + 70 / 2 ** (z - FULL), zoom: z });
  };

  const status =
    markers.length === places.length
      ? `${places.length} places`
      : `${markers.length} cluster${markers.length === 1 ? "" : "s"}`;

  return (
    <div
      ref={rootRef}
      className="maps"
      data-level={level}
      role="group"
      aria-label="Map of everything I've shipped"
    >
      <svg className="maps__terrain" aria-hidden>
        <g ref={terrainRef}>
          <path
            className="park"
            d="M-42 42C-44-36 52-70 118-66S262-34 262 44 184 150 102 146-40 120-42 42Z"
          />
          <path
            className="river"
            d="M-6000 900C-3500 300-1800 700-700 430S-160 300 20 338 210 300 330 346 800 520 1500 380 4000 0 6000 600"
          />
          <g className="roads roads--far">
            <ellipse cx="120" cy="200" rx="2600" ry="2300" />
            <ellipse cx="120" cy="200" rx="900" ry="800" />
            <path d="M118-66C150-900 260-2400 300-5200" />
            <path d="M262 44C1200-100 2800-500 5200-900" />
            <path d="M-42 42C-900-80-2400-300-5200-640" />
            <path d="M-20 112C-700 600-2000 1500-4200 2600" />
            <path d="M232 122C900 700 2400 1900 4600 3300" />
            <path d="M102 146C120 240 140 330 150 420S400 2400 900 5200" />
          </g>
          <g className="roads roads--near">
            <path d="M-120 244C40 232 200 236 380 226" />
            <path d="M22 150C20 220 30 280 26 324" />
            <path d="M218 150C222 210 234 270 230 320" />
            <path d="M-110 448C40 440 200 458 380 450" />
            <path d="M116 350C120 420 112 480 114 560" />
            <path d="M-120 362C-60 366-20 368 60 376" />
            <path d="M232 372C280 368 330 372 390 366" />
            <path d="M-130-8C-90 20-60 60-40 100" />
          </g>
        </g>
      </svg>

      <M.div
        ref={worldRef}
        className="maps__world"
        style={{ x: tx, y: ty, scale: k, originX: 0, originY: 0 }}
      >
        <span
          aria-hidden
          className="district"
          style={{ translate: "110px -34px" }}
        >
          <i>Stare Miasto</i>
        </span>
        <span
          aria-hidden
          className="district"
          style={{ translate: "258px 262px" }}
        >
          <i>Kazimierz</i>
        </span>
        <span
          aria-hidden
          className="district"
          style={{ translate: "118px 486px" }}
        >
          <i>Podgórze</i>
        </span>
        <span
          aria-hidden
          className="district district--water"
          style={{ translate: "292px 318px" }}
        >
          <i>Wisła</i>
        </span>
        <span
          aria-hidden
          className="district district--city"
          style={{ translate: "115px -100px" }}
        >
          <i>Kraków</i>
        </span>

        <AnimatePresence initial={false} custom={owner}>
          {markers.map((m) => {
            // A marker that just split off starts where its parent was.
            const parent = previous.current.find(
              (p) => p.ids.length > m.ids.length && p.ids.includes(m.ids[0]),
            );
            const from = parent ?? m;
            const color = m.group ? groups[m.group].color : "var(--fg)";
            const label = m.group
              ? groups[m.group].label
              : m.ids.length === places.length
                ? "everything"
                : undefined;
            return (
              <M.div
                key={m.key}
                className="mk"
                initial={{ x: from.x, y: from.y, opacity: 0 }}
                animate={{ x: m.x, y: m.y, opacity: 1 }}
                exit="gone"
                variants={{
                  // Leaving because it merged: travel into the cluster that
                  // swallowed it. Leaving because it split: fade in place.
                  gone: (now: Map<string, Marker>) => {
                    const into = now.get(m.ids[0]);
                    const to =
                      into && into.ids.length > m.ids.length ? into : m;
                    return { x: to.x, y: to.y, opacity: 0 };
                  },
                }}
                transition={{
                  x: MARKER_SPRING,
                  y: MARKER_SPRING,
                  opacity: { duration: 0.16 },
                }}
              >
                <div className="mk__inv">
                  {m.place ? (
                    <button
                      type="button"
                      className="pin"
                      data-selected={selected?.id === m.place.id || undefined}
                      style={{ "--c": color } as CSSProperties}
                      aria-label={`${m.place.title}, ${groups[m.place.group].label}`}
                      onClick={tapped(() => select(m.place!))}
                    >
                      <span className="pin__dot" />
                      <span className="pin__label">{m.place.label}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="cluster"
                      style={
                        {
                          "--c": color,
                          "--size": `${32 + m.ids.length * 1.6}px`,
                        } as CSSProperties
                      }
                      aria-label={`${m.ids.length} ${label ?? "places"}. Zoom in`}
                      onClick={tapped(() => expand(m))}
                    >
                      <span className="cluster__count">{m.ids.length}</span>
                      {label && <span className="cluster__label">{label}</span>}
                    </button>
                  )}
                </div>
              </M.div>
            );
          })}
        </AnimatePresence>
      </M.div>

      <div className="maps__chips" data-map-ui>
        <button type="button" className="chip" onClick={() => flyTo(HOME)}>
          all {places.length}
        </button>
        {groupIds.map((id: GroupId) => (
          <button
            key={id}
            type="button"
            className="chip"
            onClick={() => fit(boundsOf(id))}
          >
            <i style={{ background: groups[id].color }} />
            {groups[id].label}
          </button>
        ))}
      </div>

      <p className="maps__status" aria-live="polite">
        {status}
      </p>

      <div className="maps__zoom" data-map-ui>
        <button
          type="button"
          aria-label="Show everything"
          onClick={() => flyTo(HOME)}
        >
          <LocateFixed size={15} />
        </button>
        <button
          type="button"
          aria-label="Zoom in"
          onClick={() => zoomTo(zoom.get() + 1)}
        >
          <Plus size={15} />
        </button>
        <button
          type="button"
          aria-label="Zoom out"
          onClick={() => zoomTo(zoom.get() - 1)}
        >
          <Minus size={15} />
        </button>
      </div>

      <AnimatePresence>
        {selected && (
          <M.div
            key={selected.id}
            className="place"
            data-map-ui
            initial={reduced ? { opacity: 0 } : { y: "110%" }}
            animate={reduced ? { opacity: 1 } : { y: 0 }}
            exit={reduced ? { opacity: 0 } : { y: "110%" }}
            transition={{ type: "spring", stiffness: 380, damping: 36 }}
          >
            {/* The pin you tapped, next to its name: the card is that pin
                opened up, and the colour says which kind without a label. */}
            <div className="place__head">
              <span
                aria-hidden
                className="place__pin"
                style={{ "--c": groups[selected.group].color } as CSSProperties}
              />
              <h3 className="place__title">{selected.title}</h3>
            </div>
            <Dots
              className="place__meta"
              items={[groups[selected.group].one, ...selected.meta]}
            />
            <p className="place__text">{selected.description}</p>
            {selected.href && (
              <a
                className="place__open"
                href={selected.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open <ArrowUpRight size={14} />
              </a>
            )}
            <button
              type="button"
              className="place__close"
              aria-label="Close"
              onClick={() => setSelected(null)}
            >
              <X size={15} />
            </button>
          </M.div>
        )}
      </AnimatePresence>
    </div>
  );
}
