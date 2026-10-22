"use client";

import { useMemo, useRef, useState } from "react";
import { Check, Copy, Download } from "lucide-react";
import { qrToSvg, type QrErrorCorrection } from "@/lib/qr";

/** PNG export size. Large enough for print and for a full-bleed slide. */
const PNG_SIZE = 2048;

const levels: { value: QrErrorCorrection; label: string; hint: string }[] = [
  { value: "L", label: "L", hint: "~7% recoverable, smallest code" },
  { value: "M", label: "M", hint: "~15% recoverable, good default" },
  { value: "Q", label: "Q", hint: "~25% recoverable" },
  { value: "H", label: "H", hint: "~30% recoverable, best for print" },
];

export interface Preset {
  label: string;
  description: string;
  /** What the code encodes. */
  target: string;
  /** Where the ready-made code for this target is hosted. */
  hostedUrl: string;
}

/** A filename stem from the encoded value, e.g. "jakub.dev/links" → "jakub-dev-links". */
function fileStem(value: string) {
  const stem = value
    .replace(/^https?:\/\//, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
    .slice(0, 48);
  return stem || "qr";
}

function download(href: string, filename: string) {
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  a.click();
}

export default function QrStudio({
  presets,
  initialValue,
}: {
  presets: Preset[];
  initialValue: string;
}) {
  const [value, setValue] = useState(initialValue);
  const [level, setLevel] = useState<QrErrorCorrection>("M");
  const [copied, setCopied] = useState<string | null>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const text = value.trim();

  // Everything is encoded here in the browser: no URL is ever sent anywhere,
  // which is the whole point of not using a random QR site.
  const { svg, error } = useMemo(() => {
    if (!text) return { svg: null, error: null };
    try {
      return {
        svg: qrToSvg(text, { errorCorrectionLevel: level, size: 1024 }),
        error: null,
      };
    } catch {
      return {
        svg: null,
        error:
          "Too much data for one QR code. Shorten the text, or lower the error correction level.",
      };
    }
  }, [text, level]);

  const svgHref = svg
    ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
    : null;

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(null), 1600);
    } catch {
      // Clipboard blocked (insecure context or denied). The URL is on screen
      // to copy by hand, so there is nothing useful to say here.
    }
  };

  const downloadSvg = () => {
    if (!svgHref) return;
    download(svgHref, `qr-${fileStem(text)}.svg`);
  };

  // Rasterise the same SVG through a canvas. Keeps one source of truth for
  // the code itself, and PNG is what Slides/Keynote/Word will actually take.
  const downloadPng = () => {
    if (!svgHref) return;
    const image = new window.Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = PNG_SIZE;
      canvas.height = PNG_SIZE;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      // No smoothing: module edges must stay hard when scaled up.
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(image, 0, 0, PNG_SIZE, PNG_SIZE);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        download(url, `qr-${fileStem(text)}.png`);
        // Revoking synchronously can abort the download in Safari and
        // Firefox before it has started reading the blob.
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }, "image/png");
    };
    image.src = svgHref;
  };

  return (
    <div className="space-y-10">
      <section>
        <label
          htmlFor="qr-value"
          className="mb-2 block text-[12px] uppercase tracking-[0.06em] text-fg-3"
        >
          encode
        </label>
        <input
          id="qr-value"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="https://example.com"
          autoComplete="off"
          spellCheck={false}
          className="w-full rounded-lg border hairline bg-bg-2 px-3.5 py-2.5 text-[14px] text-fg outline-none transition-colors placeholder:text-fg-3 focus:border-fg-3"
        />

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-[12px] text-fg-3">error correction</span>
          <div className="flex overflow-hidden rounded-lg border hairline">
            {levels.map((l) => (
              <button
                key={l.value}
                type="button"
                onClick={() => setLevel(l.value)}
                title={l.hint}
                aria-pressed={level === l.value}
                className={`px-3 py-1.5 text-[13px] transition-colors ${
                  level === l.value
                    ? "bg-fg text-bg"
                    : "text-fg-2 hover:bg-bg-2 hover:text-fg"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section>
        {/* Always on white, whatever the site theme: an inverted code scans
            badly, and these end up on projectors and paper. */}
        <div className="flex aspect-square w-full items-center justify-center rounded-xl border hairline bg-white p-5 sm:p-8">
          {svgHref ? (
            // eslint-disable-next-line @next/next/no-img-element -- a client-generated data URL, which next/image cannot optimise
            <img
              src={svgHref}
              alt={`QR code for ${text}`}
              className="h-full w-full"
            />
          ) : (
            <p className="max-w-xs text-center text-[13px] leading-6 text-neutral-500">
              {error ?? "Paste a link above to generate a code."}
            </p>
          )}
        </div>

        {svgHref && (
          <>
            <p className="mt-3 break-all text-center text-[12.5px] text-fg-3">
              {text}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={downloadSvg}
                className="pressable inline-flex items-center gap-1.5 rounded-lg border hairline px-3.5 py-2 text-[13px] text-fg-2 hover:border-fg-3 hover:text-fg"
              >
                <Download size={14} />
                SVG
              </button>
              <button
                type="button"
                onClick={downloadPng}
                className="pressable inline-flex items-center gap-1.5 rounded-lg border hairline px-3.5 py-2 text-[13px] text-fg-2 hover:border-fg-3 hover:text-fg"
              >
                <Download size={14} />
                PNG · {PNG_SIZE}px
              </button>
            </div>
          </>
        )}
      </section>

      <section>
        <h2 className="mb-1 text-[12px] uppercase tracking-[0.06em] text-fg-3">
          hosted codes
        </h2>
        <p className="mb-3 text-[13px] leading-6 text-fg-2">
          These are generated at build time and live at their own URLs: embed
          the URL instead of a file and the code can never go missing.
        </p>
        <ul className="space-y-2">
          {presets.map((preset) => (
            <li
              key={preset.hostedUrl}
              className="rounded-xl border hairline bg-bg-2 px-4 py-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[14px] font-medium text-fg">
                    {preset.label}
                  </p>
                  <p className="text-[12.5px] text-fg-3">
                    {preset.description}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setValue(preset.target)}
                  className="pressable shrink-0 rounded-md border hairline px-2.5 py-1 text-[12px] text-fg-2 hover:border-fg-3 hover:text-fg"
                >
                  Preview
                </button>
              </div>
              <div className="mt-2.5 flex items-center gap-2">
                <code className="min-w-0 flex-1 truncate text-[12px] text-fg-3">
                  {preset.hostedUrl}
                </code>
                <button
                  type="button"
                  onClick={() => copy(preset.hostedUrl)}
                  aria-label={`Copy ${preset.hostedUrl}`}
                  className="pressable shrink-0 text-fg-3 hover:text-fg"
                >
                  <span className="icon-swap">
                    <Copy
                      size={14}
                      data-hidden={copied === preset.hostedUrl || undefined}
                    />
                    <Check
                      size={14}
                      data-hidden={copied !== preset.hostedUrl || undefined}
                    />
                  </span>
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
