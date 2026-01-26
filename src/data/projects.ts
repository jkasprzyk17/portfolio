export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  appStoreUrl?: string;
  playStoreUrl?: string;
  image?: string;
  features?: string[];
  category: "professional" | "personal";
}

export const projects: Project[] = [
  {
    id: "1",
    title: "Miniliga",
    category: "personal",
    image: "/images/miniliga-icon.png",
    description:
      "Platform for managing amateur and semi-professional football leagues with both web and mobile applications. Streamlines league operations, team management, and provides real-time updates to players and organizers.",
    longDescription:
      "Miniliga is a full-stack platform designed to streamline football league management. The platform enables league organizers to manage teams, schedules, matches, standings, and statistics. Players and teams can track their performance, view fixtures, and engage with the league community through the mobile app.",
    technologies: [
      "React Native",
      "TypeScript",
      "Next.js",
      "Node.js",
      "PostgreSQL",
      "Expo",
      "Tailwind CSS",
    ],
    features: [
      "Team management and league organization",
      "Match scheduling and results tracking",
      "Real-time statistics and standings",
      "Push notifications for match updates",
      "Player profiles and performance metrics",
      "Web dashboard for administrators",
      "Mobile app for iOS and Android",
    ],
    githubUrl: "https://github.com/jkasprzyk17",
    // Add app store links when available
  },
];
