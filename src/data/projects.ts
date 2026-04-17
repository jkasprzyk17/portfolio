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
  {
    id: "2",
    title: "Łatwa Ustna",
    category: "personal",
    image: "/images/latwaustna-icon.png",
    liveUrl: "https://latwaustna.pl/",
    description:
      "AI-powered training platform that helps Polish high school students prepare for the oral matura exam by simulating the exam commission and providing instant, criteria-based feedback.",
    longDescription:
      "Łatwa Ustna is a web-based SaaS that lets maturzyści practice the Polish oral matura exam anytime. Students answer randomized official CKE questions by voice, the AI plays the role of the examination commission with follow-up questions, and each session ends with a scored breakdown, strengths, weaknesses, and a tailored improvement plan. A separate module analyzes written essays against official matura criteria.",
    technologies: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Supabase",
      "Stripe",
      "OpenAI API",
    ],
    features: [
      "All 76 official CKE oral exam questions with filtering by period, literature, and theme",
      "Voice-based AI commission that asks follow-up questions like a real exam",
      "Instant scoring with criteria breakdown, strengths, weaknesses, and improvement plan",
      "Essay analysis module using official matura criteria (up to 35 points)",
      "Progress tracking across mastered and challenging questions",
      "Browser-based with mobile microphone support — no installation required",
    ],
  },
];
