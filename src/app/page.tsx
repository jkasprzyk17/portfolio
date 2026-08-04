import type { Metadata } from "next";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import OpenSource from "@/components/OpenSource";
import Experience from "@/components/Experience";
import Education from "@/components/Education";
import Contact from "@/components/Contact";
import Navigation from "@/components/Navigation";
import { experiences } from "@/data/experience";
import { education } from "@/data/education";
import { libraries } from "@/data/libraries";

export const metadata: Metadata = {
  title: "Jakub Kasprzyk — Mobile Software Engineer",
  description:
    "Portfolio of Jakub Kasprzyk, a Mobile Software Engineer based in Kraków building cross-platform apps with React Native and Expo.",
};

// Person schema, derived from the same data the page renders so the two
// can't drift apart. The first experience entry is the current role.
const current = experiences[0];

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Jakub Kasprzyk",
  jobTitle: current.title,
  description:
    "Mobile Software Engineer building cross-platform apps with React Native and Expo, and open-source native modules built on Nitro Modules.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Kraków",
    addressCountry: "PL",
  },
  worksFor: {
    "@type": "Organization",
    name: current.company,
    url: current.companyUrl,
  },
  alumniOf: education.map((e) => ({
    "@type": "EducationalOrganization",
    name: e.school,
    url: e.schoolUrl,
  })),
  knowsAbout: [
    "React Native",
    "Expo",
    "TypeScript",
    "Nitro Modules",
    "Swift",
    "Kotlin",
    "C++",
  ],
  sameAs: [
    "https://github.com/jkasprzyk17",
    "https://www.linkedin.com/in/jkasprzyk17/",
    "https://x.com/jkasprzyk17",
    ...libraries.map((l) => l.githubUrl),
  ],
};

export default function Home() {
  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        // Static, author-controlled object — no user input reaches this string.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <Navigation />
      <div className="max-w-2xl mx-auto px-5 sm:px-6">
        <Hero />
        <Experience />
        <OpenSource />
        <Projects />
        <Education />
        <Contact />
      </div>
    </main>
  );
}
