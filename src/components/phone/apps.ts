import {
  FileText,
  MapPin,
  MessageCircle,
  StickyNote,
  TextCursorInput,
  type LucideIcon,
} from "lucide-react";
export type AppIconDef =
  | { kind: "glyph"; Glyph: LucideIcon; bg: string; fg: string }
  | { kind: "image"; src: string }
  | { kind: "folder" };

export type AppDef = {
  id: string;
  name: string;
  icon: AppIconDef;
};

// Dock: the four apps that are about Jakub rather than about one project.
export const dockApps: AppDef[] = [
  {
    id: "maps",
    name: "Maps",
    icon: { kind: "glyph", Glyph: MapPin, bg: "var(--c-work)", fg: "#fff" },
  },
  {
    id: "cv",
    name: "CV",
    icon: { kind: "glyph", Glyph: FileText, bg: "var(--fg)", fg: "var(--bg)" },
  },
  {
    id: "notes",
    name: "Notes",
    icon: {
      kind: "glyph",
      Glyph: StickyNote,
      bg: "var(--c-projects)",
      fg: "#fff",
    },
  },
  {
    id: "messages",
    name: "Messages",
    icon: {
      kind: "glyph",
      Glyph: MessageCircle,
      bg: "var(--c-core)",
      fg: "#fff",
    },
  },
];

/** An app that exists in the data: name and icon, resolved on the server. */
export type ShippedApp = { name: string; icon: string };

// The data files stay on the server: page.tsx picks out what has an icon and
// hands it over, so shipping a new app is a data change, and the full
// experience and project descriptions aren't part of the first download.
export const gridApps = (shipped: ShippedApp[]): AppDef[] => [
  {
    id: "caret",
    name: "Caret",
    icon: {
      kind: "glyph",
      Glyph: TextCursorInput,
      bg: "var(--c-oss)",
      fg: "#fff",
    },
  },
  { id: "oss", name: "Open source", icon: { kind: "folder" } },
  ...shipped.map((app) => ({
    id: `shipped-${app.name}`,
    name: app.name,
    icon: { kind: "image" as const, src: app.icon },
  })),
];
