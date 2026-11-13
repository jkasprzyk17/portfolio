"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  AnimatePresence,
  LazyMotion,
  domAnimation,
  MotionConfig,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import * as m from "motion/react-m";
import dynamic from "next/dynamic";
import AndroidNav from "./AndroidNav";
import AppBoundary from "./AppBoundary";
import AppIcon from "./AppIcon";
import AppWindow, { type Rect, type ScreenSize } from "./AppWindow";
import Banner, { type Notice } from "./Banner";
import IconMenu, { type Shortcut } from "./IconMenu";
import { PhoneNavContext, createPhoneNav } from "./nav";
import WorkTimeline, { type TimelineRole } from "./WorkTimeline";
import {
  dockApps,
  gridApps,
  type AppDef,
  type ShippedApp as ShippedAppDef,
} from "./apps";

// Motion's DOM features are imported eagerly, not lazily. Without them an
// `m.div` renders once and then ignores its motion values, so on a slow
// connection an app window would open and stay the size of its icon until
// the chunk arrived (or forever, if it didn't). LazyMotion + `m` still keeps
// the drag and layout code out of the bundle.

// Every app is its own chunk: nobody needs the map, Supercluster or the full
// data files to see the home screen. They are fetched one after another once
// the page is idle, so by the time an icon is tapped its app is already
// there; the blank fallback only shows if someone is faster than that.
const loaders = {
  maps: () => import("./apps/MapsApp"),
  cv: () => import("./apps/CvApp"),
  notes: () => import("./apps/NotesApp"),
  messages: () => import("./apps/MessagesApp"),
  caret: () => import("./apps/CaretApp"),
  oss: () => import("./apps/OssApp"),
  shipped: () => import("./apps/ShippedApp"),
};
// next/dynamic insists on an object literal for its options, so the same
// two lines are spelled out for each app.
const Blank = () => <div className="scr" />;
const MapsApp = dynamic(loaders.maps, {
  ssr: false,
  loading: () => <div className="maps" />,
});
const CvApp = dynamic(loaders.cv, { ssr: false, loading: Blank });
const NotesApp = dynamic(loaders.notes, { ssr: false, loading: Blank });
const MessagesApp = dynamic(loaders.messages, { ssr: false, loading: Blank });
const CaretApp = dynamic(loaders.caret, { ssr: false, loading: Blank });
const OssApp = dynamic(loaders.oss, { ssr: false, loading: Blank });
const ShippedApp = dynamic(loaders.shipped, { ssr: false, loading: Blank });

function AppContent({ app }: { app: AppDef }) {
  switch (app.id) {
    case "maps":
      return <MapsApp />;
    case "cv":
      return <CvApp />;
    case "notes":
      return <NotesApp />;
    case "messages":
      return <MessagesApp />;
    case "caret":
      return <CaretApp />;
    case "oss":
      return <OssApp />;
    default:
      // Everything else on the home screen is an app from the data.
      return <ShippedApp name={app.name} />;
  }
}

// Layout offsets, not getBoundingClientRect: the home layer is scaled while
// an app is open and the whole device may be tilted, and both would skew a
// measured rect. Offsets describe where the icon rests.
function rectWithin(el: HTMLElement, root: HTMLElement): Rect {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== root) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  // The icon's corner, which differs by skin (rounded square or circle).
  const shape = el.firstElementChild ?? el;
  const corner = getComputedStyle(shape).borderTopLeftRadius;
  const r = corner.endsWith("%")
    ? (parseFloat(corner) / 100) * el.offsetWidth
    : parseFloat(corner);
  return { x, y, w: el.offsetWidth, h: el.offsetHeight, r };
}

// "Once per visit": remembered for the tab's lifetime. Storage can be
// unavailable (private mode, blocked cookies); then it is once per page load.
const shown = new Set<string>();
function seen(key: string) {
  if (shown.has(key)) return true;
  try {
    return sessionStorage.getItem(`phone:${key}`) === "1";
  } catch {
    return false;
  }
}
function markSeen(key: string) {
  shown.add(key);
  try {
    sessionStorage.setItem(`phone:${key}`, "1");
  } catch {
    // Remembered in memory above.
  }
}

function Clock() {
  // Kraków time, wherever the visitor is. Empty until mounted: the server
  // can't know the minute this HTML will be read.
  const [time, setTime] = useState("");
  useEffect(() => {
    const format = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Europe/Warsaw",
    });
    const tick = () => setTime(format.format(new Date()));
    tick();
    const id = setInterval(tick, 10_000);
    return () => clearInterval(id);
  }, []);
  return <span className="statusbar__time">{time}</span>;
}

export default function Phone({
  timeline,
  shipped,
  shortcuts,
  merged,
}: {
  /** The jobs drawn in the home-screen widget. */
  timeline: { roles: TimelineRole[]; builtAt: number };
  shipped: ShippedAppDef[];
  /** Long-press shortcuts by app id. */
  shortcuts: Record<string, Shortcut[]>;
  /** The newest fix merged upstream, announced in Caret. */
  merged: { label: string; title: string; date: string; href: string } | null;
}) {
  const grid = useMemo(() => gridApps(shipped), [shipped]);
  useEffect(() => {
    const idle =
      window.requestIdleCallback ?? ((fn: () => void) => setTimeout(fn, 1200));
    idle(async () => {
      for (const load of Object.values(loaders)) await load().catch(() => {});
    });
  }, []);

  const screenRef = useRef<HTMLDivElement>(null);
  const icons = useRef(new Map<string, HTMLElement>());
  const [active, setActive] = useState<AppDef | null>(null);
  const [size, setSize] = useState<ScreenSize | null>(null);

  // 0 on the home screen, 1 with an app full-screen; written by AppWindow.
  const progress = useMotionValue(0);
  const homeScale = useTransform(progress, [0, 1], [1, 0.9]);
  const homeOpacity = useTransform(progress, [0, 0.85], [1, 0.2]);

  // The device turns to face the cursor, like something you could pick up.
  // Mouse only, and only while the cursor is somewhere else: once it is over
  // the device the tilt eases flat, so what you point at is where it is (a
  // tilted map would put every pin a few pixels from where it looks).
  const reduced = useReducedMotion();
  const bodyRef = useRef<HTMLDivElement>(null);
  const rotateX = useSpring(0, { stiffness: 110, damping: 18 });
  const rotateY = useSpring(0, { stiffness: 110, damping: 18 });
  const glareX = useTransform(rotateY, [-14, 14], ["-45%", "45%"]);
  const glareOpacity = useTransform([rotateX, rotateY], ([x, y]: number[]) =>
    Math.min(1, Math.hypot(x, y) / 12),
  );
  useEffect(() => {
    if (
      reduced ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches
    ) {
      return;
    }
    const flat = () => {
      rotateX.set(0);
      rotateY.set(0);
    };
    const onMove = (e: PointerEvent) => {
      const el = bodyRef.current;
      if (e.pointerType !== "mouse" || !el) return;
      if (el.contains(e.target as Node)) return flat();
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2);
      const dy =
        (e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2);
      rotateY.set(Math.max(-1, Math.min(1, dx)) * 14);
      rotateX.set(Math.max(-1, Math.min(1, dy)) * -10);
    };
    window.addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("pointerleave", flat);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", flat);
    };
  }, [reduced, rotateX, rotateY]);

  // Confirm phone mode. The inline script in page.tsx already set `js` on a
  // hard load; this covers client-side navigation from /cv or /links, and
  // marks hydration so that script's watchdog stands down. If the watchdog
  // already fell back to the flat page and the visitor has started reading
  // it, leave them there rather than swapping the page under them.
  // A layout effect, not a passive one: coming back from /cv the page is
  // rendered on the client, and the class has to be on before that first
  // paint or the flat sections show for a frame.
  useLayoutEffect(() => {
    const root = document.documentElement;
    const reading = !root.classList.contains("js") && window.scrollY > 40;
    root.setAttribute("data-hydrated", "");
    if (!reading) root.classList.add("js");
    return () => root.removeAttribute("data-hydrated");
  }, []);

  useEffect(() => {
    const el = screenRef.current;
    if (!el) return;
    const measure = () =>
      setSize({
        w: el.clientWidth,
        h: el.clientHeight,
        r: parseFloat(getComputedStyle(el).getPropertyValue("--r")) || 0,
      });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // When the on-screen keyboard closes, iOS leaves the page wherever it
  // scrolled to make room, often with the top of the screen under the header.
  const recentre = useCallback(() => {
    if (!window.matchMedia("(max-width: 639px)").matches) return;
    screenRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, []);
  useEffect(() => {
    const el = screenRef.current;
    if (!el) return;
    const onBlur = (e: FocusEvent) => {
      if (!(e.target instanceof HTMLElement)) return;
      if (!e.target.matches("input, textarea")) return;
      // Not if focus simply moved to another field.
      setTimeout(() => {
        if (!document.activeElement?.matches("input, textarea")) recentre();
      }, 80);
    };
    el.addEventListener("focusout", onBlur);
    return () => el.removeEventListener("focusout", onBlur);
  }, [recentre]);

  // A short tick on Android when something is tapped. Only ever called from
  // a tap handler: browsers ignore vibration without a user gesture, and
  // iOS has no such API at all.
  const buzz = (ms: number) => {
    if (reduced) return;
    try {
      navigator.vibrate?.(ms);
    } catch {
      // Not allowed here; it was only a nicety.
    }
  };

  const open = (app: AppDef) => {
    if (active || !size) return;
    // Whoever opens an app has found out the phone works: no invitation
    // later, and the one on screen right now goes too.
    markSeen("invite");
    setNotice((n) => (n?.id === "invite" ? null : n));
    setActive(app);
    // On a phone the screen is taller than what's left under the intro, so
    // bring all of it into view before the app fills it. Centred rather than
    // nearest: flush with the bottom edge, the home bar lands in the strip
    // where iOS Safari keeps its collapsed address bar, and swipes that
    // start there never reach the page. (.screen's scroll-margin keeps the
    // top clear of the sticky header.)
    recentre();
  };

  // Keyboard users get focus put back on the icon the app came from, once
  // the home layer has stopped being inert (after the state change commits).
  // Touch and mouse users don't: Safari draws the focus ring on any element
  // focused from script, and a ring appearing after a swipe looks like a bug.
  const keyboard = useRef(false);
  useEffect(() => {
    const onKey = () => (keyboard.current = true);
    const onPointer = () => (keyboard.current = false);
    window.addEventListener("keydown", onKey, true);
    window.addEventListener("pointerdown", onPointer, true);
    return () => {
      window.removeEventListener("keydown", onKey, true);
      window.removeEventListener("pointerdown", onPointer, true);
    };
  }, []);
  // The long-press menu, if one is up (declared here because closing it
  // shares the focus-return logic below).
  const [menu, setMenu] = useState<{
    app: AppDef;
    rect: Rect;
    viaKeyboard: boolean;
  } | null>(null);
  const returnFocusTo = useRef<string | null>(null);
  const closeMenu = useCallback(() => {
    setMenu((m) => {
      if (m?.viaKeyboard) returnFocusTo.current = m.app.id;
      return null;
    });
  }, []);
  const closed = useCallback(() => {
    setActive((app) => {
      returnFocusTo.current = keyboard.current ? (app?.id ?? null) : null;
      return null;
    });
  }, []);
  useEffect(() => {
    if (active || menu || !returnFocusTo.current) return;
    icons.current
      .get(returnFocusTo.current)
      ?.closest("button")
      ?.focus({ preventScroll: true });
    returnFocusTo.current = null;
  }, [active, menu]);

  const getOrigin = useCallback((): Rect => {
    const el = active && icons.current.get(active.id);
    const root = screenRef.current;
    if (!el || !root) return { x: 0, y: 0, w: 1, h: 1 };
    return rectWithin(el, root);
  }, [active]);

  // ── Notifications ─────────────────────────────────────────────────────
  const [notice, setNotice] = useState<Notice | null>(null);
  const dismissNotice = useCallback(() => setNotice(null), []);

  // The invitation: two seconds after the home screen has actually been in
  // view, once per visit, and never if an app has already been opened.
  useEffect(() => {
    const el = screenRef.current;
    if (!el || active || seen("invite")) return;
    const messages = dockApps.find((app) => app.id === "messages");
    if (!messages) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        clearTimeout(timer);
        if (!entry.isIntersecting) return;
        timer = setTimeout(() => {
          if (seen("invite")) return;
          markSeen("invite");
          setNotice({
            id: "invite",
            app: messages,
            title: "Jakub Kasprzyk",
            body: "Go on, tap something.",
            when: "now",
          });
        }, 2000);
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [active]);

  // In Caret, the news that the fix landed: a moment after the app opens,
  // once per visit, dated when it was actually merged.
  useEffect(() => {
    if (active?.id !== "caret" || !merged || seen("merged")) return;
    const caret = active;
    const timer = setTimeout(() => {
      markSeen("merged");
      setNotice({
        id: "merged",
        app: caret,
        title: `${merged.label} merged`,
        body: merged.title,
        when: merged.date,
        href: merged.href,
      });
    }, 2500);
    return () => clearTimeout(timer);
  }, [active, merged]);

  const activateNotice = (n: Notice) => {
    setNotice(null);
    if (!active) open(n.app);
  };

  // ── Long press ────────────────────────────────────────────────────────
  // The click that follows a long press belongs to the press, not to the
  // icon; and the finger that opened the menu must lift before a tap on the
  // backdrop can close it again.
  const swallowClick = useRef(false);
  const fingerUp = useRef(true);

  const openMenu = (app: AppDef, viaKeyboard: boolean) => {
    const el = icons.current.get(app.id);
    const root = screenRef.current;
    if (!el || !root || active) return;
    markSeen("invite");
    setNotice(null);
    setMenu({ app, rect: rectWithin(el, root), viaKeyboard });
  };

  const startPress = (e: ReactPointerEvent, app: AppDef) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    swallowClick.current = false;
    const x0 = e.clientX;
    const y0 = e.clientY;
    const stopWatching = () => {
      clearTimeout(timer);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", stopWatching);
      window.removeEventListener("pointercancel", stopWatching);
    };
    // Moving (or the page starting to scroll, which arrives as a cancel)
    // means this was never a press.
    const onMove = (ev: PointerEvent) => {
      if (Math.hypot(ev.clientX - x0, ev.clientY - y0) > 8) stopWatching();
    };
    const timer = setTimeout(() => {
      stopWatching();
      swallowClick.current = true;
      fingerUp.current = false;
      const lifted = () => {
        window.removeEventListener("pointerup", lifted);
        window.removeEventListener("pointercancel", lifted);
        // After this event's own click has been dispatched. The swallow
        // flag gets longer: a touch click can trail its pointerup, and a flag
        // left set would eat the next keyboard activation instead.
        setTimeout(() => (fingerUp.current = true), 0);
        setTimeout(() => (swallowClick.current = false), 500);
      };
      window.addEventListener("pointerup", lifted);
      window.addEventListener("pointercancel", lifted);
      buzz(14);
      openMenu(app, false);
    }, 450);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", stopWatching);
    window.addEventListener("pointercancel", stopWatching);
  };

  // ── Back ──────────────────────────────────────────────────────────────
  const nav = useMemo(createPhoneNav, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (menu) closeMenu();
      else if (active) nav.back();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu, active, nav, closeMenu]);

  const icon = (app: AppDef, i: number) => (
    <button
      key={app.id}
      type="button"
      className="icon-btn"
      style={{ "--i": i } as CSSProperties}
      onPointerDown={(e) => startPress(e, app)}
      // Right click, the keyboard's menu key, and Android's own long press.
      onContextMenu={(e) => {
        e.preventDefault();
        openMenu(app, keyboard.current);
      }}
      onClick={() => {
        if (swallowClick.current || menu) {
          swallowClick.current = false;
          return;
        }
        buzz(8);
        open(app);
      }}
    >
      <span
        ref={(el) => {
          if (el) icons.current.set(app.id, el);
          else icons.current.delete(app.id);
        }}
        className="icon-btn__icon"
        // The open app's window *is* its icon, grown; hide the original.
        style={{ opacity: active?.id === app.id ? 0 : 1 }}
      >
        <AppIcon icon={app.icon} />
      </span>
      <span className="icon-btn__label">{app.name}</span>
    </button>
  );

  return (
    <PhoneNavContext.Provider value={nav}>
      <LazyMotion features={domAnimation} strict>
        <MotionConfig reducedMotion="user">
          <div className="device rise-in" style={{ animationDelay: "120ms" }}>
            <m.div
              ref={bodyRef}
              className="device__body"
              style={{ rotateX, rotateY }}
            >
              <span aria-hidden className="device__key device__key--power" />
              <span aria-hidden className="device__key device__key--up" />
              <span aria-hidden className="device__key device__key--down" />

              <div
                ref={screenRef}
                className="screen"
                data-app-open={active ? "" : undefined}
              >
                <m.div
                  className="home-screen"
                  style={{ scale: homeScale, opacity: homeOpacity }}
                  inert={active !== null || menu !== null}
                >
                  <div className="widget">
                    <WorkTimeline {...timeline} />
                  </div>

                  <div className="icons">{grid.map(icon)}</div>

                  <div className="dock">
                    {dockApps.map((app, i) => icon(app, grid.length + i))}
                  </div>
                </m.div>

                {active && size && (
                  <AppWindow
                    key={active.id}
                    app={active}
                    getOrigin={getOrigin}
                    size={size}
                    progress={progress}
                    onClosed={closed}
                  >
                    <AppBoundary name={active.name}>
                      <AppContent app={active} />
                    </AppBoundary>
                  </AppWindow>
                )}

                <AnimatePresence>
                  {menu && size && (
                    <IconMenu
                      key={menu.app.id}
                      app={menu.app}
                      rect={menu.rect}
                      screen={size}
                      shortcuts={shortcuts[menu.app.id] ?? []}
                      focusFirst={menu.viaKeyboard}
                      canDismiss={() => fingerUp.current}
                      onClose={closeMenu}
                      onOpen={() => {
                        setMenu(null);
                        open(menu.app);
                      }}
                    />
                  )}
                </AnimatePresence>

                <AndroidNav />

                <Banner
                  notice={notice}
                  onActivate={activateNotice}
                  onDismiss={dismissNotice}
                />

                <div className="statusbar" aria-hidden>
                  <Clock />
                  <span className="statusbar__right">
                    <span className="statusbar__carrier">Kraków</span>
                    <span className="statusbar__bars">
                      <i />
                      <i />
                      <i />
                      <i />
                    </span>
                    <span className="statusbar__battery">
                      <i />
                    </span>
                  </span>
                </div>
                <span aria-hidden className="device__camera" />
                <m.span
                  aria-hidden
                  className="device__glare"
                  style={{ x: glareX, opacity: glareOpacity }}
                />
              </div>
            </m.div>
          </div>
        </MotionConfig>
      </LazyMotion>
    </PhoneNavContext.Provider>
  );
}
