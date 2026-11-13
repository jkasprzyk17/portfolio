export interface Library {
  id: string;
  name: string;
  description: string;
  githubUrl: string;
  npmUrl?: string;
  /** The npm install line from the README, peer packages included. */
  install?: string;
  tags: string[];
}

export const libraries: Library[] = [
  {
    id: "1",
    name: "react-native-better-maps",
    description:
      "High-performance maps for React Native built on Nitro Modules and the New Architecture, backed by MapKit on iOS and Google Maps on Android.",
    githubUrl: "https://github.com/gmi-software/react-native-better-maps",
    npmUrl: "https://www.npmjs.com/package/react-native-better-maps",
    install: "npm install react-native-better-maps react-native-nitro-modules",
    tags: ["Nitro Modules", "Swift", "Kotlin", "TypeScript"],
  },
  {
    id: "2",
    name: "react-native-better-clustering",
    description:
      "A faster drop-in replacement for react-native-map-clustering with the same MapView API and a C++ supercluster engine underneath.",
    githubUrl: "https://github.com/gmi-software/react-native-better-clustering",
    npmUrl: "https://www.npmjs.com/package/react-native-better-clustering",
    install:
      "npm install react-native-better-clustering react-native-nitro-modules react-native-maps",
    tags: ["Nitro Modules", "C++", "TypeScript"],
  },
  {
    id: "3",
    name: "react-native-better-pdf",
    description:
      "A native, virtualized PDF viewer for React Native built on Nitro Views, using PDFKit on iOS and the platform PdfRenderer on Android, with no WebView and no bundled PDFium.",
    githubUrl: "https://github.com/gmi-software/react-native-better-pdf",
    npmUrl: "https://www.npmjs.com/package/react-native-better-pdf",
    install: "npm install react-native-better-pdf react-native-nitro-modules",
    tags: ["Nitro Views", "Swift", "Kotlin", "TypeScript"],
  },
  {
    id: "4",
    name: "@gmisoftware/react-native-pay",
    description:
      "Apple Pay and Google Pay for React Native behind one type-safe API, with native payment buttons and an Expo config plugin.",
    githubUrl: "https://github.com/gmi-software/react-native-pay",
    npmUrl: "https://www.npmjs.com/package/@gmisoftware/react-native-pay",
    install:
      "npm install @gmisoftware/react-native-pay react-native-nitro-modules",
    tags: ["Nitro Modules", "Swift", "Kotlin", "TypeScript"],
  },
  {
    id: "5",
    name: "better-skills",
    description:
      "Agent Skills that teach AI coding agents to use GMI's React Native libraries and react-native-maps.",
    githubUrl: "https://github.com/gmi-software/better-skills",
    tags: ["Agent Skills", "AI tooling"],
  },
];
