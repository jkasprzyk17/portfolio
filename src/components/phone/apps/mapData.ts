import Supercluster from "supercluster";
import { experiences } from "@/data/experience";
import { libraries } from "@/data/libraries";
import { contributions } from "@/data/contributions";
import { projects } from "@/data/projects";
import { firstSentence } from "@/lib/text";

export type GroupId = "work" | "oss" | "core" | "projects";

export const groups: Record<
  GroupId,
  {
    /** The group, as the legend names it. */
    label: string;
    /** One member of it, as a place's card names it. */
    one: string;
    color: string;
  }
> = {
  work: { label: "work", one: "Work", color: "var(--c-work)" },
  oss: { label: "libraries", one: "Library", color: "var(--c-oss)" },
  core: { label: "core fixes", one: "Core fix", color: "var(--c-core)" },
  projects: { label: "projects", one: "Project", color: "var(--c-projects)" },
};
export const groupIds = Object.keys(groups) as GroupId[];

export type Place = {
  id: string;
  group: GroupId;
  /** Short name drawn under the pin. */
  label: string;
  title: string;
  /** Short facts for the card's subtitle, most general first. */
  meta: string[];
  description: string;
  href?: string;
  /** Position in world units: screen px at the zoom where every pin is its own. */
  x: number;
  y: number;
};

// Hand-placed, then checked by running them through Supercluster: with
// RADIUS below the 13 pins go 1 → 2 → 4 (one per group) → 7 → 13 as you zoom
// in, with no zoom level where nothing changes. Within a group, pins sit in
// pairs about 48 units apart so each pair splits one level after the group
// does. Extra pins beyond the slots continue below the last one.
const slots: Record<GroupId, [number, number][]> = {
  work: [
    [48, 14],
    [64, 58],
    [154, 20],
    [172, 66],
  ],
  oss: [
    [50, 176],
    [70, 222],
    [160, 170],
    [180, 214],
    [112, 280],
  ],
  core: [
    [30, 372],
    [48, 418],
  ],
  projects: [
    [190, 380],
    [206, 426],
  ],
};

const slot = (group: GroupId, i: number): [number, number] => {
  const s = slots[group];
  const [x, y] = s[Math.min(i, s.length - 1)];
  const extra = Math.max(0, i - s.length + 1);
  return [x + extra * 14, y + extra * 46];
};

export const places: Place[] = [
  ...experiences.map((e, i) => {
    const [x, y] = slot("work", i);
    return {
      id: `work-${e.id}`,
      group: "work" as const,
      label: e.company.split(" / ").pop()!,
      title: e.company,
      meta: [e.title, e.period],
      description: e.description[0] + ".",
      href: e.companyUrl,
      x,
      y,
    };
  }),
  ...libraries.map((l, i) => {
    const [x, y] = slot("oss", i);
    return {
      id: `oss-${l.id}`,
      group: "oss" as const,
      label: l.name.replace(/^@[^/]+\//, "").replace(/^react-native-/, ""),
      title: l.name,
      meta: l.tags,
      description: l.description,
      href: l.npmUrl ?? l.githubUrl,
      x,
      y,
    };
  }),
  ...contributions.map((c, i) => {
    const [x, y] = slot("core", i);
    const pr = c.url.split("/").pop();
    return {
      id: `core-${c.id}`,
      group: "core" as const,
      label: `rn #${pr}`,
      title: `${c.project} #${pr}`,
      meta: ["merged upstream", c.date],
      description: c.title,
      href: c.url,
      x,
      y,
    };
  }),
  ...projects.map((p, i) => {
    const [x, y] = slot("projects", i);
    return {
      id: `projects-${p.id}`,
      group: "projects" as const,
      label: p.title,
      title: p.title,
      meta: p.technologies.slice(0, 3),
      description: firstSentence(p.description),
      href: p.liveUrl ?? p.githubUrl,
      x,
      y,
    };
  }),
];

const byId = new Map(places.map((p) => [p.id, p]));

/** The zoom at which one world unit is one screen px and every pin stands alone. */
export const FULL = 4;
export const ZOOM_MIN = 0.8;
export const ZOOM_MAX = 5.4;
/**
 * Clusters for whole level L are shown from zoom L + LEVEL_SHIFT, not from L.
 * Supercluster's radius is exact only at whole zooms; switching a little late
 * means that at the tightest moment of each level neighbouring bubbles are
 * about 36px apart instead of 30, which is the difference between touching
 * and overlapping.
 */
export const LEVEL_SHIFT = 0.25;
export const levelAt = (zoom: number) =>
  Math.max(0, Math.min(FULL, Math.floor(zoom - LEVEL_SHIFT)));
/** Cluster radius in screen px at whole zoom levels. */
const RADIUS = 30;

// Supercluster thinks in longitude/latitude on a Mercator square. Our world
// is a small patch in the middle of that square, FULL levels deep.
const WORLD = 256 * 2 ** FULL;
const OX = WORLD / 2 - 115;
const OY = WORLD / 2 - 220;

const toLngLat = (x: number, y: number): [number, number] => {
  const mx = (OX + x) / WORLD;
  const my = (OY + y) / WORLD;
  return [
    mx * 360 - 180,
    (Math.atan(Math.sinh(Math.PI * (1 - 2 * my))) * 180) / Math.PI,
  ];
};
const fromLngLat = ([lng, lat]: number[]): [number, number] => {
  const mx = (lng + 180) / 360;
  const sin = Math.sin((lat * Math.PI) / 180);
  const my = 0.5 - (0.25 * Math.log((1 + sin) / (1 - sin))) / Math.PI;
  return [mx * WORLD - OX, my * WORLD - OY];
};

const index = new Supercluster<{ id: string }>({
  radius: RADIUS,
  extent: 256,
  minZoom: 0,
  // One below FULL: from FULL up, getClusters hands back the raw points.
  maxZoom: FULL - 1,
}).load(
  places.map((p) => ({
    type: "Feature" as const,
    properties: { id: p.id },
    geometry: { type: "Point" as const, coordinates: toLngLat(p.x, p.y) },
  })),
);

export type Marker = {
  /** Stable across zoom levels: the ids it contains, not Supercluster's id. */
  key: string;
  x: number;
  y: number;
  ids: string[];
  /** Set when the marker is a single place. */
  place?: Place;
  /** Set when every place inside belongs to one group. */
  group?: GroupId;
  /** Zoom at which this cluster breaks apart. */
  expandsAt?: number;
};

const cache = new Map<number, Marker[]>();

export function markersAt(level: number): Marker[] {
  const z = Math.max(0, Math.min(FULL, level));
  const hit = cache.get(z);
  if (hit) return hit;

  const markers = index
    .getClusters([-180, -85, 180, 85], z)
    .map((f): Marker => {
      const [x, y] = fromLngLat(f.geometry.coordinates);
      const props = f.properties;
      if ("cluster" in props && props.cluster) {
        const ids = index
          .getLeaves(props.cluster_id, Infinity)
          .map((leaf) => leaf.properties.id)
          .sort();
        const kinds = new Set(ids.map((id) => byId.get(id)!.group));
        return {
          key: ids.join("+"),
          x,
          y,
          ids,
          group: kinds.size === 1 ? [...kinds][0] : undefined,
          expandsAt: index.getClusterExpansionZoom(props.cluster_id),
        };
      }
      const place = byId.get(props.id)!;
      return {
        key: place.id,
        x: place.x,
        y: place.y,
        ids: [place.id],
        place,
        group: place.group,
      };
    });
  cache.set(z, markers);
  return markers;
}

/** Everything, for "fit all" and for clamping the camera. */
export const bounds = {
  x0: Math.min(...places.map((p) => p.x)),
  x1: Math.max(...places.map((p) => p.x)),
  y0: Math.min(...places.map((p) => p.y)),
  y1: Math.max(...places.map((p) => p.y)),
};

export function boundsOf(group: GroupId) {
  const ps = places.filter((p) => p.group === group);
  return {
    x0: Math.min(...ps.map((p) => p.x)),
    x1: Math.max(...ps.map((p) => p.x)),
    y0: Math.min(...ps.map((p) => p.y)),
    y1: Math.max(...ps.map((p) => p.y)),
  };
}
