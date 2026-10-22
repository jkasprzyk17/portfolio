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
      "Miniliga is a full-stack platform designed to streamline football league management. The platform enables league organizers to manage teams, schedules, matches, standings, and statistics. Players and teams can track their performance, view fixtures, and engage with the league community through the mobile app. An ASP.NET Core API on PostgreSQL serves the Expo mobile app, the Next.js website and the admin panel, and pushes live match timelines and chat messages over SignalR.",
    technologies: [
      "React Native",
      "Next.js",
      "ASP.NET Core",
      "Expo",
      "TypeScript",
      "C#",
      "SignalR",
      "PostgreSQL",
      "Tailwind CSS",
    ],
    features: [
      "Team management and league organization",
      "Match scheduling and results tracking",
      "Real-time statistics and standings",
      "Live match timeline and in-app chat over SignalR",
      "Push notifications for match updates",
      "Player profiles and performance metrics",
      "Web dashboard for administrators",
      "Mobile app for iOS and Android",
    ],
    liveUrl: "https://miniliga.app",
  },
  {
    id: "2",
    title: "Łatwa Ustna",
    category: "personal",
    image: "/images/latwaustna-icon.png",
    liveUrl: "https://latwaustna.pl/",
    description:
      "AI-powered training platform that helps Polish high school students prepare for the written and oral matura exam by simulating the exam commission and providing instant, criteria-based feedback.",
    longDescription:
      "Łatwa Ustna is a web-based SaaS that lets maturzyści practice both the written and oral Polish matura anytime. For the oral exam, students answer randomized official CKE questions by voice and the AI plays the role of the examination commission with follow-up questions, ending each session with a scored breakdown, strengths, weaknesses, and a tailored improvement plan. For the written part, a separate module analyzes essays against the official matura criteria. Spoken answers are transcribed with AssemblyAI and scored by OpenAI models.",
    technologies: [
      "Next.js",
      "TypeScript",
      "OpenAI API",
      "AssemblyAI",
      "Supabase",
      "Stripe",
      "Algolia",
      "Tailwind CSS",
      "Sentry",
      "PostHog",
    ],
    features: [
      "All 76 official CKE oral exam questions with filtering by period, literature, and theme",
      "Voice-based AI commission that asks follow-up questions like a real exam",
      "Instant scoring with criteria breakdown, strengths, weaknesses, and improvement plan",
      "Essay analysis module using official matura criteria (up to 35 points)",
      "Progress tracking across mastered and challenging questions",
      "Runs in the browser with mobile microphone support, no installation required",
    ],
  },
];
