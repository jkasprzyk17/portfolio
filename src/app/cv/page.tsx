import type { Metadata } from "next";
import Link from "next/link";
import { experiences } from "@/data/experience";
import { libraries } from "@/data/libraries";
import { projects } from "@/data/projects";
import { education } from "@/data/education";
import PrintButton from "./PrintButton";

export const metadata: Metadata = {
  title: "CV — Jakub Kasprzyk",
  description:
    "Curriculum vitae of Jakub Kasprzyk, Mobile Software Engineer based in Kraków.",
  robots: { index: false },
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8 break-inside-avoid">
      <h2 className="text-[12px] tracking-[0.08em] uppercase text-fg-3 pb-2 mb-4 border-b hairline">
        {title}
      </h2>
      {children}
    </section>
  );
}

// First sentence, keeping its own full stop — descriptions in the data files
// are sometimes one sentence and sometimes several.
function firstSentence(text: string) {
  return text.match(/^.*?\.(?=\s|$)/)?.[0] ?? text;
}

// "Radon IDE — Radon IDE is an innovative…" reads badly next to the name, so
// drop the subject when the description repeats it.
function summarise(name: string, description: string) {
  const sentence = firstSentence(description);
  const prefix = `${name} is `;
  return sentence.startsWith(prefix) ? sentence.slice(prefix.length) : sentence;
}

function Row({ left, right }: { left: React.ReactNode; right: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-4">
      <div className="flex flex-wrap items-baseline gap-x-2 text-fg">{left}</div>
      <span className="text-fg-3 text-[13px] tabular-nums whitespace-nowrap">
        {right}
      </span>
    </div>
  );
}

export default function CV() {
  return (
    <main className="max-w-3xl mx-auto px-5 sm:px-6 py-12 print:py-0 text-[14px] leading-6">
      <div className="flex items-baseline justify-between gap-4 mb-6 no-print">
        <Link href="/" className="prose-link text-[14px]">
          ← Back to portfolio
        </Link>
        <PrintButton />
      </div>

      <header className="break-inside-avoid">
        <h1 className="text-3xl font-semibold tracking-tight text-fg">
          Jakub Kasprzyk
        </h1>
        <p className="text-fg-2 mt-1">Mobile Software Engineer</p>
        <p className="text-fg-3 text-[13px] mt-3">
          Kraków, PL ·{" "}
          <a href="mailto:kasprzykjakub@proton.me" className="prose-link">
            kasprzykjakub@proton.me
          </a>{" "}
          ·{" "}
          <a href="tel:+48535462019" className="prose-link">
            +48 535 462 019
          </a>{" "}
          ·{" "}
          <a href="https://github.com/jkasprzyk17" className="prose-link">
            github.com/jkasprzyk17
          </a>{" "}
          ·{" "}
          <a
            href="https://www.linkedin.com/in/jkasprzyk17/"
            className="prose-link"
          >
            linkedin.com/in/jkasprzyk17
          </a>
        </p>
        <p className="text-fg-2 mt-5 text-pretty">
          Mobile Software Engineer with four years of commercial experience,
          building cross-platform apps with React Native and Expo. Currently at
          GMI software, where I also author open-source native modules built on
          Nitro Modules.
        </p>
      </header>

      <Section title="Experience">
        <ul className="space-y-6">
          {experiences.map((exp) => (
            <li key={exp.id} className="break-inside-avoid">
              <Row
                left={
                  <>
                    <span className="font-medium">{exp.title}</span>
                    <span className="text-fg-3">·</span>
                    {exp.companyUrl ? (
                      <a href={exp.companyUrl} className="prose-link">
                        {exp.company}
                      </a>
                    ) : (
                      <span>{exp.company}</span>
                    )}
                    <span className="text-fg-3 text-[13px]">
                      {exp.location}
                    </span>
                  </>
                }
                right={exp.period}
              />

              <ul className="mt-2 space-y-1 text-fg-2">
                {exp.description.map((line) => (
                  <li key={line} className="flex gap-2">
                    <span className="text-fg-3 select-none">–</span>
                    <span className="text-pretty">{line}</span>
                  </li>
                ))}
              </ul>

              {exp.projects && exp.projects.length > 0 && (
                <ul className="mt-2 space-y-1 text-fg-2">
                  {exp.projects.map((p) => (
                    <li key={p.name} className="flex gap-2">
                      <span className="text-fg-3 select-none">–</span>
                      <span className="text-pretty">
                        {p.url ? (
                          <a href={p.url} className="prose-link font-medium">
                            {p.name}
                          </a>
                        ) : (
                          <span className="font-medium text-fg">{p.name}</span>
                        )}
                        {" — "}
                        {summarise(p.name, p.description)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {exp.technologies && (
                <p className="mt-2 text-fg-3 text-[13px]">
                  {exp.technologies.join(" · ")}
                </p>
              )}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Open Source">
        <ul className="space-y-4">
          {libraries.map((lib) => (
            <li key={lib.id} className="break-inside-avoid">
              <Row
                left={
                  <a
                    href={lib.githubUrl}
                    className="prose-link font-mono text-[13px] font-medium"
                  >
                    {lib.name}
                  </a>
                }
                right={lib.tags.slice(0, 2).join(" · ")}
              />
              <p className="mt-1 text-fg-2 text-pretty">{lib.description}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Own Projects">
        <ul className="space-y-4">
          {projects.map((project) => {
            const url = project.liveUrl || project.githubUrl;
            return (
              <li key={project.id} className="break-inside-avoid">
                <Row
                  left={
                    url ? (
                      <a href={url} className="prose-link font-medium">
                        {project.title}
                      </a>
                    ) : (
                      <span className="font-medium">{project.title}</span>
                    )
                  }
                  right={project.technologies.slice(0, 3).join(" · ")}
                />
                <p className="mt-1 text-fg-2 text-pretty">
                  {project.description}
                </p>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section title="Education">
        <ul className="space-y-4">
          {education.map((item) => (
            <li key={item.id} className="break-inside-avoid">
              <Row
                left={
                  <>
                    <span className="font-medium">{item.field}</span>
                    <span className="text-fg-3">·</span>
                    {item.schoolUrl ? (
                      <a href={item.schoolUrl} className="prose-link">
                        {item.school}
                      </a>
                    ) : (
                      <span>{item.school}</span>
                    )}
                    <span className="text-fg-3 text-[13px]">
                      {item.location}
                    </span>
                  </>
                }
                right={item.period}
              />
            </li>
          ))}
        </ul>
      </Section>
    </main>
  );
}
