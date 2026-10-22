import { create } from "qrcode";

/**
 * QR rendering, shared by the server (hosted /qr/<slug>.svg codes) and the
 * browser (the generator on /qr). Runs in both, so nothing here touches the
 * DOM or Node APIs.
 *
 * Colours are hardcoded black-on-white rather than taken from the theme
 * tokens: a code inverted by dark mode scans badly, and these end up on
 * projectors and paper where the site's palette means nothing.
 */
const QR_DARK = "#000000";
const QR_LIGHT = "#ffffff";

/** The spec's quiet zone: four modules of background on every side. */
const QUIET_ZONE = 4;

export type QrErrorCorrection = "L" | "M" | "Q" | "H";

export interface QrSvgOptions {
  /**
   * Error correction level. "M" (~15% recoverable) is the default trade-off;
   * "H" survives more damage but makes the code denser for the same URL.
   */
  errorCorrectionLevel?: QrErrorCorrection;
  /** Rendered edge length in px. Omit for a viewBox-only, fluid SVG. */
  size?: number;
  /** Adds the XML prolog, needed when the SVG is served as its own file. */
  standalone?: boolean;
  /** Accessible name, for when the SVG is opened or embedded on its own. */
  title?: string;
}

/**
 * Escapes text destined for XML content. The generator feeds arbitrary user
 * input through here, so this is the one place untrusted text meets markup.
 */
function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Encodes `text` and renders the modules as a single SVG path.
 *
 * One path rather than a rect per module: a few hundred rects leave hairline
 * seams between neighbours when the browser scales them up, which is exactly
 * what happens to a code blown up to fill a slide.
 */
export function qrToSvg(text: string, options: QrSvgOptions = {}) {
  const {
    errorCorrectionLevel = "M",
    size,
    standalone = false,
    title,
  } = options;

  const { modules } = create(text, { errorCorrectionLevel });
  const count = modules.size;
  const span = count + QUIET_ZONE * 2;

  let path = "";
  for (let row = 0; row < count; row++) {
    for (let col = 0; col < count; col++) {
      if (modules.get(row, col)) {
        path += `M${col + QUIET_ZONE} ${row + QUIET_ZONE}h1v1h-1z`;
      }
    }
  }

  // Each module is one viewBox unit, so the whole thing scales from the
  // viewBox and the optional width/height only pick a default rendered size.
  const dimensions = size ? ` width="${size}" height="${size}"` : "";
  const prolog = standalone ? '<?xml version="1.0" encoding="UTF-8"?>' : "";
  const label = title ? `<title>${escapeXml(title)}</title>` : "";

  return (
    `${prolog}<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${span} ${span}"` +
    `${dimensions} shape-rendering="crispEdges" role="img">` +
    `${label}<rect width="${span}" height="${span}" fill="${QR_LIGHT}"/>` +
    `<path d="${path}" fill="${QR_DARK}"/>` +
    `</svg>`
  );
}
