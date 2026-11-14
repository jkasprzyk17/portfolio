import type { CSSProperties } from "react";
import type { AppIconDef } from "./apps";

// Icons are drawn with nothing behind them: the artwork is the tile. That
// works for artwork that fills its square, which nearly all of it does. The
// exception gets the one adjustment it needs (measured from the file):
const adjust: Record<string, { ground?: string; scale?: number }> = {
  // Ships as a much rounder shape than the tile, on transparency. Its own
  // background colour fills the corners so it sits like the others.
  "/images/radon-logo.webp": { ground: "#effdf8" },
};

// Sized entirely in em, so the same markup is the 46px icon on the home
// screen and the full-width face an app window grows out of: the caller sets
// one font-size and everything (glyph, corner radius) follows.
export default function AppIcon({
  icon,
  style,
}: {
  icon: AppIconDef;
  style?: CSSProperties;
}) {
  if (icon.kind === "image") {
    const fix = adjust[icon.src];
    return (
      <span
        className="app-icon"
        style={fix?.ground ? { background: fix.ground, ...style } : style}
      >
        {/* Plain img: next/image would bake a fixed size into the src, and
            this one is drawn at two very different sizes. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={icon.src}
          alt=""
          draggable={false}
          style={fix?.scale ? { scale: fix.scale } : undefined}
        />
      </span>
    );
  }

  if (icon.kind === "folder") {
    return (
      <span className="app-icon app-icon--folder" style={style}>
        <span style={{ background: "var(--c-oss)" }} />
        <span style={{ background: "var(--c-work)" }} />
        <span style={{ background: "var(--c-core)" }} />
        <span style={{ background: "var(--c-projects)" }} />
      </span>
    );
  }

  const { Glyph, bg, fg } = icon;
  return (
    <span className="app-icon" style={{ background: bg, color: fg, ...style }}>
      <Glyph aria-hidden strokeWidth={1.9} />
    </span>
  );
}
