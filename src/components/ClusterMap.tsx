"use client";

import { useState, type CSSProperties } from "react";
import { Minus, Plus } from "lucide-react";
import { experiences } from "@/data/experience";
import { libraries } from "@/data/libraries";
import { contributions } from "@/data/contributions";
import { projects } from "@/data/projects";

// The page's contents drawn the way react-native-better-clustering draws
// markers: one cluster, splitting into a cluster per section, splitting into
// a pin per thing. Pins come from the same data the sections render, so the
// counts can't drift. It is decoration on top of the sections below: the
// server renders zoom 1, which is readable with no JavaScript, and hidden
// levels are inert so only what is drawn can be focused or read out.

type Pin = { label: string; href: string };
type Group = {
  id: string;
  label: string;
  color: string;
  pins: Pin[];
  // Hand-placed positions in % of the map box, laid out so labels clear each
  // other at phone width. Extra pins beyond the slots reuse them with a nudge.
  slots: [number, number][];
};

const groups: Group[] = [
  {
    id: "work",
    label: "work",
    color: "var(--c-work)",
    pins: experiences.map((e) => ({
      label: e.company.split(" / ").pop()!,
      href: e.companyUrl ?? "#experience",
    })),
    slots: [
      [15, 26],
      [37, 19],
      [28, 41],
      [11, 52],
    ],
  },
  {
    id: "oss",
    label: "libraries",
    color: "var(--c-oss)",
    pins: libraries.map((l) => ({
      label: l.name.replace(/^@[^/]+\//, "").replace(/^react-native-/, ""),
      href: l.npmUrl ?? l.githubUrl,
    })),
    slots: [
      [63, 19],
      [75, 35],
      [52, 48],
      [89, 21],
      [84, 53],
    ],
  },
  {
    id: "core",
    label: "core fixes",
    color: "var(--c-core)",
    pins: contributions.map((c) => ({
      label: `rn #${c.url.split("/").pop()}`,
      href: c.url,
    })),
    slots: [
      [19, 74],
      [38, 85],
    ],
  },
  {
    id: "projects",
    label: "projects",
    color: "var(--c-projects)",
    pins: projects.map((p) => ({
      label: p.title,
      href: p.liveUrl ?? p.githubUrl ?? "#projects",
    })),
    slots: [
      // Kept left of the zoom control in the bottom-right corner.
      [60, 73],
      [70, 88],
    ],
  },
];

const slotFor = (g: Group, i: number): [number, number] => {
  const [x, y] = g.slots[i % g.slots.length];
  const lap = Math.floor(i / g.slots.length);
  return [x + lap * 4, y + lap * 7];
};

const centroid = (g: Group): [number, number] => {
  const used = g.pins.map((_, i) => slotFor(g, i));
  return [
    used.reduce((s, p) => s + p[0], 0) / used.length,
    used.reduce((s, p) => s + p[1], 0) / used.length,
  ];
};

const CENTER: [number, number] = [50, 52];
const total = groups.reduce((n, g) => n + g.pins.length, 0);

const at = ([x, y]: [number, number], extra?: CSSProperties) =>
  ({ "--x": x, "--y": y, ...extra }) as CSSProperties;

export default function ClusterMap() {
  const [zoom, setZoom] = useState<0 | 1 | 2>(1);
  const zoomIn = () => setZoom((z) => (z < 2 ? ((z + 1) as 1 | 2) : z));
  const zoomOut = () => setZoom((z) => (z > 0 ? ((z - 1) as 0 | 1) : z));

  const status =
    zoom === 0
      ? "1 cluster · tap it"
      : zoom === 1
        ? `${groups.length} clusters · tap one`
        : `${total} pins`;

  return (
    <figure className="cluster-map" data-zoom={zoom}>
      <div className="cluster-map__box">
        <svg
          aria-hidden
          className="cluster-map__terrain"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path
            className="river"
            d="M-5 62 C 18 50, 30 70, 48 58 S 78 40, 105 52"
          />
          <path d="M-5 30 C 25 26, 45 34, 105 22" />
          <path d="M44 -5 C 40 30, 52 60, 46 105" />
          <path d="M-5 88 C 30 92, 70 84, 105 90" />
          <path d="M72 -5 C 76 35, 68 70, 74 105" />
        </svg>

        <span className="cluster-map__meta cluster-map__meta--tl">
          Kraków<span> · 50.06°N 19.94°E</span>
        </span>
        <span
          className="cluster-map__meta cluster-map__meta--tr"
          aria-live="polite"
        >
          {status}
        </span>

        <div
          className="map-node"
          data-hidden={zoom !== 0 || undefined}
          inert={zoom !== 0}
          style={at(CENTER)}
        >
          <button
            type="button"
            className="cluster"
            style={{ "--c": "var(--fg)", "--size": "64px" } as CSSProperties}
            onClick={zoomIn}
            tabIndex={zoom === 0 ? 0 : -1}
            aria-label={`${total} things I've shipped. Zoom in`}
          >
            <span className="cluster__count">{total}</span>
            <span className="cluster__label">everything</span>
          </button>
        </div>

        {groups.map((g) => (
          <div
            key={g.id}
            className="map-node"
            data-hidden={zoom !== 1 || undefined}
            inert={zoom !== 1}
            style={at(zoom === 0 ? CENTER : centroid(g))}
          >
            <button
              type="button"
              className="cluster"
              style={
                {
                  "--c": g.color,
                  "--size": `${38 + g.pins.length * 4}px`,
                } as CSSProperties
              }
              onClick={zoomIn}
              tabIndex={zoom === 1 ? 0 : -1}
              aria-label={`${g.pins.length} ${g.label}. Zoom in`}
            >
              <span className="cluster__count">{g.pins.length}</span>
              <span className="cluster__label">{g.label}</span>
            </button>
          </div>
        ))}

        {groups.map((g) =>
          g.pins.map((pin, i) => (
            <div
              key={`${g.id}-${i}`}
              className="map-node"
              data-hidden={zoom !== 2 || undefined}
              inert={zoom !== 2}
              style={at(
                zoom === 2 ? slotFor(g, i) : zoom === 1 ? centroid(g) : CENTER,
                { transitionDelay: zoom === 2 ? `${i * 25}ms` : "0ms" },
              )}
            >
              <a
                className="pin"
                href={pin.href}
                {...(pin.href.startsWith("#")
                  ? {}
                  : { target: "_blank", rel: "noopener noreferrer" })}
                tabIndex={zoom === 2 ? 0 : -1}
                style={{ "--c": g.color } as CSSProperties}
              >
                <span className="pin__dot" />
                <span className="pin__label">{pin.label}</span>
              </a>
            </div>
          )),
        )}

        <div className="cluster-map__zoom">
          <button
            type="button"
            onClick={zoomIn}
            disabled={zoom === 2}
            aria-label="Zoom in"
          >
            <Plus size={14} />
          </button>
          <button
            type="button"
            onClick={zoomOut}
            disabled={zoom === 0}
            aria-label="Zoom out"
          >
            <Minus size={14} />
          </button>
        </div>
      </div>

      <figcaption className="sr-only">
        A map of everything on this page: {total} pins that cluster by section
        as you zoom out.
      </figcaption>
    </figure>
  );
}
