"use client";

import { m } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { experiences } from "@/data/experience";

const ease = [0.65, 0, 0.35, 1] as const;

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[13px] tracking-[0.04em] uppercase text-fg-3 mb-6">
      {children}
    </h2>
  );
}

export default function Experience() {
  return (
    <section id="experience" className="py-14 border-t hairline">
      <SectionHeading>work</SectionHeading>

      <m.ul
        initial={{ opacity: 0, y: 6 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4, ease }}
        className="space-y-7"
      >
        {experiences.map((exp) => (
          <li key={exp.id} className="text-[15px] leading-6">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <div className="flex flex-wrap items-baseline gap-x-2 text-fg">
                <span className="font-medium">{exp.title}</span>
                <span className="text-fg-3">·</span>
                {exp.companyUrl ? (
                  <a
                    href={exp.companyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="prose-link inline-flex items-center gap-0.5"
                  >
                    {exp.company}
                    <ArrowUpRight size={12} className="opacity-60" />
                  </a>
                ) : (
                  <span>{exp.company}</span>
                )}
              </div>
              <span className="text-fg-3 text-[13px] tabular-nums">
                {exp.period}
              </span>
            </div>

            {exp.projects && exp.projects.length > 0 && (
              <p className="text-fg-2 text-[14px] mt-1">
                {exp.projects.map((p, i) => (
                  <span key={p.name}>
                    {i > 0 && <span className="text-fg-3">, </span>}
                    {p.url ? (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="prose-link"
                      >
                        {p.name}
                      </a>
                    ) : (
                      p.name
                    )}
                  </span>
                ))}
              </p>
            )}
          </li>
        ))}
      </m.ul>
    </section>
  );
}
