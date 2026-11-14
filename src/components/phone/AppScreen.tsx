"use client";

import { useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import * as m from "motion/react-m";
import { useLayerBar } from "./Stack";

/**
 * The frame every app except the map draws itself in: a navigation bar (an
 * optional back button, any actions), a large title, and a body that scrolls
 * on its own without dragging the page along.
 *
 * The title belongs to the page, not the bar: it scrolls away with the
 * content, and once it is out of sight the bar shows it small instead. Both
 * platforms do this; what differs is the bar, which CSS draws (buttons of
 * glass floating over the page on iOS, a solid strip on Android).
 *
 * Inside a Stack the bar also stays put while its page slides in or out,
 * fading against the other page's bar (see Stack.tsx).
 */
export default function AppScreen({
  title,
  back,
  actions,
  children,
  className = "",
}: {
  title: ReactNode;
  back?: { label: string; onClick: () => void };
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  // "scrolled": something is under the bar. "collapsed": the large title is,
  // so the bar has to say where you are.
  const [scroll, setScroll] = useState<"top" | "scrolled" | "collapsed">("top");
  const layerBar = useLayerBar();
  // In a stack, how much of the bar shows while its page is on the move. Put
  // on each piece directly, not on the bar or through a CSS variable: a bar
  // that isn't fully opaque would cut its glass buttons off from the page
  // they blur, and a variable would restyle everything inside it each frame.
  const fade = layerBar ? { opacity: layerBar.fade } : undefined;

  return (
    <div
      className={`scr ${className}`}
      data-scrolled={scroll === "top" ? undefined : ""}
      data-collapsed={scroll === "collapsed" ? "" : undefined}
    >
      <m.header
        className="scr__bar"
        style={layerBar ? { x: layerBar.x } : undefined}
      >
        {/* The soft edge the page fades into under the bar (iOS only). */}
        <m.span aria-hidden className="scr__edge" style={fade} />
        <div className="scr__lead">
          {back ? (
            <m.button
              type="button"
              className="scr__back"
              style={fade}
              onClick={back.onClick}
              aria-label={`Back to ${back.label}`}
            >
              {/* A chevron on iOS, an arrow on Android; CSS shows one. */}
              <ChevronLeft size={20} aria-hidden className="scr__back-ios" />
              <ArrowLeft size={20} aria-hidden className="scr__back-android" />
            </m.button>
          ) : null}
        </div>
        {/* The title again, for when the real one has scrolled away. Only
            for the eye: the heading below is the one that is read out. */}
        <m.span aria-hidden className="scr__mid" style={fade}>
          <span className="scr__inline">{title}</span>
        </m.span>
        <m.div className="scr__actions" style={fade}>
          {actions}
        </m.div>
      </m.header>
      <div
        className="scr__body"
        onScroll={(e) => {
          const y = e.currentTarget.scrollTop;
          // Not the moment the title touches the bar: once its last line
          // has cleared the row the small one appears in, so the two are
          // never read through each other.
          const gone = (titleRef.current?.offsetHeight ?? 0) + 24;
          setScroll(y > gone ? "collapsed" : y > 2 ? "scrolled" : "top");
        }}
      >
        {/* h2: the page's one h1 is the headline beside the phone. */}
        <h2 ref={titleRef} className="scr__title">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}

/**
 * A tappable row in a list. The button is only the title; it is stretched
 * over the whole row with a pseudo-element, so the row can hold paragraphs
 * and other content a <button> isn't allowed to contain.
 */
export function ListRow({
  title,
  onClick,
  children,
}: {
  title: ReactNode;
  onClick: () => void;
  children?: ReactNode;
}) {
  return (
    <li className="lrow">
      <div className="lrow__main">
        <button type="button" className="lrow__hit" onClick={onClick}>
          {title}
        </button>
        {children && <div className="lrow__sub">{children}</div>}
      </div>
      <ChevronRight size={16} aria-hidden className="lrow__chevron" />
    </li>
  );
}
