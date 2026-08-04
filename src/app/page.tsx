import type { Metadata } from "next";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import OpenSource from "@/components/OpenSource";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "Jakub Kasprzyk — Mobile Software Engineer",
  description:
    "Portfolio of Jakub Kasprzyk, a Mobile Software Engineer based in Kraków building cross-platform apps with React Native and Expo.",
};

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="max-w-2xl mx-auto px-5 sm:px-6">
        <Hero />
        <Experience />
        <OpenSource />
        <Projects />
        <Contact />
      </div>
    </main>
  );
}
