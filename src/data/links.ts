/**
 * The /links page: the one URL to put on a slide, in a bio, or behind a QR
 * code. Edit this file to change what the page shows; nothing else needs
 * touching.
 *
 * `icon` is a plain string so this stays a pure data file; LinkList maps the
 * keys onto lucide components.
 */
export type LinkIcon =
  | "github"
  | "linkedin"
  | "twitter"
  | "mail"
  | "phone"
  | "cv"
  | "app"
  | "package";

export interface LinkEntry {
  label: string;
  /** One short line under the label saying what the link actually is. */
  description: string;
  href: string;
  icon: LinkIcon;
  /** Set for anything that isn't a link to elsewhere on this site. */
  external?: boolean;
}

export const linkGroups: { title: string; links: LinkEntry[] }[] = [
  {
    title: "elsewhere",
    links: [
      {
        label: "GitHub",
        description: "Open source and side projects",
        href: "https://github.com/jkasprzyk17",
        icon: "github",
        external: true,
      },
      {
        label: "LinkedIn",
        description: "Work history and contact",
        href: "https://www.linkedin.com/in/jkasprzyk17/",
        icon: "linkedin",
        external: true,
      },
      {
        label: "Twitter / X",
        description: "@jkasprzyk17",
        href: "https://x.com/jkasprzyk17",
        icon: "twitter",
        external: true,
      },
    ],
  },
  {
    title: "building",
    links: [
      {
        label: "Łatwa Ustna",
        description: "AI tutor for the Polish matura exam",
        href: "https://latwaustna.pl/",
        icon: "app",
        external: true,
      },
      {
        label: "react-native-better-maps",
        description: "Native maps on Nitro Modules",
        href: "https://github.com/gmi-software/react-native-better-maps",
        icon: "package",
        external: true,
      },
      {
        label: "react-native-better-clustering",
        description: "C++ supercluster engine for map clustering",
        href: "https://github.com/gmi-software/react-native-better-clustering",
        icon: "package",
        external: true,
      },
    ],
  },
  {
    title: "get in touch",
    links: [
      {
        label: "Email",
        description: "kasprzykjakub@proton.me",
        href: "mailto:kasprzykjakub@proton.me",
        icon: "mail",
      },
      {
        label: "Phone",
        description: "+48 535 462 019",
        href: "tel:+48535462019",
        icon: "phone",
      },
      {
        label: "CV",
        description: "One page, printable",
        href: "/cv",
        icon: "cv",
      },
    ],
  },
];

/**
 * Pages that get a QR code hosted at a stable URL of their own, served from
 * /qr/<slug>.svg. Printed codes outlive slide decks, so treat a slug that has
 * been handed out as permanent: repoint `path` rather than renaming it.
 */
export interface QrTarget {
  slug: string;
  path: string;
  label: string;
  description: string;
}

export const qrTargets: QrTarget[] = [
  {
    slug: "links",
    path: "/links",
    label: "Links",
    description: "Every link on one page, the one to put on a slide",
  },
  { slug: "cv", path: "/cv", label: "CV", description: "The printable CV" },
  {
    slug: "home",
    path: "/",
    label: "Portfolio",
    description: "The front page",
  },
];
