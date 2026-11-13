import type { Metadata } from "next";
import Bio from "@/components/Bio";
import Intro from "@/components/Intro";
import SectionHeading from "@/components/SectionHeading";
import TopBar from "@/components/TopBar";
import OsToggle from "@/components/phone/OsToggle";
import Phone from "@/components/phone/Phone";
import "@/components/phone/phone.css";
import Projects from "@/components/Projects";
import OpenSource from "@/components/OpenSource";
import Experience from "@/components/Experience";
import Education from "@/components/Education";
import Contact from "@/components/Contact";
import { experiences } from "@/data/experience";
import { education } from "@/data/education";
import { libraries } from "@/data/libraries";
import { projects } from "@/data/projects";
import { contributions } from "@/data/contributions";
import { contact } from "@/data/profile";
import { display, mono } from "./fonts";

export const metadata: Metadata = {
  title: "Jakub Kasprzyk · Mobile Software Engineer",
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

// What the phone's home screen needs from the data, resolved here so the data
// files themselves stay out of the client bundle: the jobs for the timeline
// widget, and everything that has an app icon.
const MONTHS = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");
// "Jun 2026" → months since year 0, so durations are plain subtraction.
const monthNumber = (text: string) => {
  const [month, year] = text.trim().split(" ");
  return Number(year) * 12 + MONTHS.indexOf(month);
};
const builtAt = new Date();
const phoneTimeline = {
  // The month this page was built; the widget moves on from there itself.
  builtAt: builtAt.getFullYear() * 12 + builtAt.getMonth(),
  roles: experiences
    .map((e) => {
      const [from, to] = e.period.split(" – ");
      return {
        label: e.company.split(" / ").pop()!,
        from: monthNumber(from),
        to: to === "Present" ? null : monthNumber(to),
        period: e.period,
      };
    })
    .sort((a, b) => a.from - b.from),
};
const shippedApps = [
  ...experiences
    .flatMap((e) => e.projects ?? [])
    .filter((p) => p.logo)
    .map((p) => ({ name: p.name, icon: p.logo! })),
  ...projects
    .filter((p) => p.image)
    .map((p) => ({ name: p.title, icon: p.image! })),
];

// Long-press shortcuts, by app id: the places each icon can take you without
// opening the app. Links only, taken from the data.
const host = (url: string) => new URL(url).hostname.replace(/^www\./, "");
const prNumber = (url: string) => url.split("/").pop();
const phoneShortcuts: Record<
  string,
  { label: string; href: string; download?: boolean }[]
> = {
  cv: [
    { label: "Download PDF", href: "/cv.pdf", download: true },
    { label: "Open full page", href: "/cv" },
  ],
  messages: [
    { label: "Email", href: `mailto:${contact.email}` },
    { label: "Call", href: contact.phoneHref },
  ],
  caret: contributions.map((c) => ({
    label: `${c.project} #${prNumber(c.url)}`,
    href: c.url,
  })),
  oss: libraries.map((l) => ({
    label: l.name.replace(/^@[^/]+\//, ""),
    href: l.npmUrl ?? l.githubUrl,
  })),
  ...Object.fromEntries([
    ...experiences
      .flatMap((e) => e.projects ?? [])
      .filter((p) => p.logo && p.url)
      .map((p) => [
        `shipped-${p.name}`,
        [{ label: host(p.url!), href: p.url! }],
      ]),
    ...projects
      .filter((p) => p.image)
      .map((p) => [
        `shipped-${p.title}`,
        [
          ...(p.liveUrl ? [{ label: host(p.liveUrl), href: p.liveUrl }] : []),
          ...(p.githubUrl ? [{ label: "GitHub", href: p.githubUrl }] : []),
        ],
      ]),
  ]),
};

// The newest fix that landed upstream, for the notification in Caret.
const latestMerge = contributions[0]
  ? {
      label: `${contributions[0].project} #${prNumber(contributions[0].url)}`,
      title: contributions[0].title,
      date: contributions[0].date,
      href: contributions[0].url,
    }
  : null;

// Runs while the HTML is still being parsed, before anything below it paints,
// so a visitor with JavaScript never sees the flat page flash by. It only
// *claims* phone mode: Phone confirms it on hydration (data-hydrated). If that
// hasn't happened after five seconds the bundle is not coming any time soon
// (slow phone on venue wifi), and the class comes back off so the sections
// are readable instead of hidden behind a phone nobody can use.
const phoneModeInit = `(function() {
  var d = document.documentElement;
  d.classList.add('js');
  setTimeout(function() {
    if (!d.hasAttribute('data-hydrated')) d.classList.remove('js');
  }, 5000);
})();`;

export default function Home() {
  return (
    <main className={`home min-h-screen ${display.variable} ${mono.variable}`}>
      <script dangerouslySetInnerHTML={{ __html: phoneModeInit }} />
      <script
        type="application/ld+json"
        // Static, author-controlled object; no user input reaches this string.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <TopBar />

      <div className="stage">
        <Intro />
        <div className="js-only">
          <Phone
            timeline={phoneTimeline}
            shipped={shippedApps}
            shortcuts={phoneShortcuts}
            merged={latestMerge}
          />
        </div>
        <div className="js-only sm:hidden -mt-4 flex justify-center">
          <OsToggle />
        </div>
      </div>

      {/* The document. Shown when there is no JavaScript (or it never
          arrived); with the phone running, the same data is in its apps. */}
      <div className="flat-only max-w-2xl mx-auto px-5 sm:px-6">
        <section id="about" className="py-12">
          <SectionHeading color="var(--accent)">about</SectionHeading>
          <div className="space-y-4 text-[15.5px] leading-7 text-fg-2 text-pretty">
            <Bio />
          </div>
        </section>
        <Experience />
        <OpenSource />
        <Projects />
        <Education />
        <Contact />
      </div>
    </main>
  );
}
