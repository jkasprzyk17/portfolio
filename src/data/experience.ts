export interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  companyUrl?: string;
  location: string;
  period: string;
  description: string[];
  technologies?: string[];
  companyLogo?: string;
  projects?: {
    name: string;
    url?: string;
    description: string;
    features: string[];
    technologies: string[];
    logo?: string;
  }[];
}

export const experiences: ExperienceItem[] = [
  {
    id: "1",
    title: "Mobile Software Engineer",
    company: "App Magic",
    companyUrl: "https://appmagic.io",
    location: "Remote",
    period: "Oct 2025 – Present",
    companyLogo: "/images/appmagic-logo.png",
    description: [
      "Developing and maintaining cross-platform mobile applications for iOS and Android",
      "Implementing AI-powered features and integrating machine learning capabilities",
      "Collaborating with cross-functional teams to deliver high-quality mobile experiences",
    ],
    technologies: [
      "React Native",
      "TypeScript",
      "Kotlin",
      "Swift",
      "Node.js",
      "AI/ML Integration",
      "Cloud Services",
    ],
    projects: [
      {
        name: "TapNote",
        url: "https://tapnote.app",
        logo: "/images/tapnote-icon.png",
        description:
          "AI-powered note-taking and study application available on iOS and Android. The app helps students and professionals organize their learning with intelligent AI assistance and interactive study tools.",
        features: [
          "AI-generated notes from audio, text, and images",
          "Interactive flashcards with spaced repetition algorithm",
          "Customizable quizzes and practice tests",
          "Cross-platform synchronization across all devices",
          "Smart note organization with tags and categories",
          "Export functionality to PDF and other formats",
        ],
        technologies: [
          "React Native",
          "Kotlin",
          "Swift",
          "TypeScript",
          "Node.js",
          "AI/ML APIs",
          "Cloud Services",
        ],
      },
    ],
  },
  {
    id: "2",
    title: "Intern",
    company: "Software Mansion / SWM",
    companyUrl: "https://swmansion.com",
    location: "Kraków, PL",
    period: "Mar 2025 – Apr 2025",
    companyLogo: "/images/swm-logo.png",
    description: [
      "Contributed to open-source development of Radon IDE, a VSCode/Cursor extension",
      "Worked on features that enhance React Native and Expo development workflows",
      "Collaborated with experienced developers in an agile, open-source environment",
      "Gained hands-on experience with IDE development and extension architecture",
    ],
    technologies: [
      "TypeScript",
      "VSCode Extension API",
      "React Native",
      "Expo",
      "Node.js",
    ],
    projects: [
      {
        name: "Radon IDE",
        url: "https://radon.swmansion.com/",
        logo: "/images/radon-logo.png",
        description:
          "Radon IDE is an innovative VSCode/Cursor extension that transforms standard code editors into fully-featured Integrated Development Environments specifically designed for React Native and Expo development. The extension provides comprehensive tooling, debugging capabilities, and workflow enhancements that streamline the mobile development process.",
        features: [
          "Full IDE capabilities within VSCode/Cursor for React Native development",
          "Enhanced debugging and development tools for Expo projects",
          "Integrated workflow optimizations for mobile app development",
          "Seamless integration with React Native and Expo ecosystems",
          "Advanced code navigation and IntelliSense features",
          "Project scaffolding and template management",
        ],
        technologies: [
          "TypeScript",
          "VSCode Extension API",
          "React Native",
          "Expo",
          "Node.js",
        ],
      },
    ],
  },
  {
    id: "3",
    title: "Mobile Software Engineer",
    company: "MMLab Cloud / MyMusic",
    companyUrl: "https://mymusic.pl",
    location: "Kraków, PL",
    period: "Dec 2022 – Dec 2025",
    companyLogo: "/images/mymusic-logo.png",
    description: [
      "Developed and maintained production mobile applications used by thousands of users globally",
      "Implemented complex features including music distribution, analytics, and gamification systems",
      "Optimized app performance and improved user experience through iterative development",
      "Collaborated with product managers, designers, and backend engineers in an agile environment",
    ],
    technologies: [
      "React Native",
      "Kotlin",
      "Swift",
      "TypeScript",
      "Firebase",
      "REST APIs",
      "CI/CD",
    ],
    projects: [
      {
        name: "MUGO",
        url: "https://mugo.pl",
        logo: "/images/mugo-logo.png",
        description:
          "Global music distribution and artist promotion platform for independent artists. Enables musicians to distribute their music to major streaming platforms worldwide while providing powerful promotion tools and analytics.",
        features: [
          "Music distribution to 150+ streaming platforms (Spotify, Apple Music, etc.)",
          "Real-time analytics and streaming statistics",
          "Artist promotion tools and marketing campaigns",
          "Revenue tracking and payment management",
          "Social features for artist discovery and networking",
          "Playlist submission and promotion capabilities",
        ],
        technologies: [
          "React Native",
          "Kotlin",
          "Swift",
          "TypeScript",
          "Firebase",
          "REST APIs",
          "CI/CD",
        ],
      },
      {
        name: "JustWin",
        url: "https://justwin.pl",
        logo: "/images/justwin-logo.png",
        description:
          "Gamified mobile application featuring user engagement and challenge-based features. Creates an engaging experience through interactive challenges, rewards, and social competition.",
        features: [
          "Challenge-based gamification system",
          "User progress tracking and achievements",
          "Social features and leaderboards",
          "Reward system and virtual currency",
          "Push notifications for engagement",
          "Real-time updates and synchronization",
        ],
        technologies: [
          "React Native",
          "Kotlin",
          "Swift",
          "TypeScript",
          "Firebase",
          "REST APIs",
          "CI/CD",
        ],
      },
    ],
  },
];
