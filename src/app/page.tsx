import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import Navigation from "@/components/Navigation";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="max-w-2xl mx-auto px-5 sm:px-6">
        <Hero />
        <Experience />
        <Projects />
        <Contact />
      </div>
    </main>
  );
}
