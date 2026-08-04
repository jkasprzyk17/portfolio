export interface Library {
  id: string;
  name: string;
  description: string;
  githubUrl: string;
  npmUrl?: string;
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
    tags: ["Nitro Modules", "Swift", "Kotlin", "TypeScript"],
  },
  {
    id: "2",
    name: "react-native-better-clustering",
    description:
      "A faster drop-in replacement for react-native-map-clustering with the same MapView API and a C++ supercluster engine underneath.",
    githubUrl:
      "https://github.com/gmi-software/react-native-better-clustering",
    npmUrl: "https://www.npmjs.com/package/react-native-better-clustering",
    tags: ["Nitro Modules", "C++", "TypeScript"],
  },
];
