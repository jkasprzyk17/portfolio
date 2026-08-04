"use client";

import { m } from "motion/react";
import { ArrowUpRight, Github } from "lucide-react";
import { libraries } from "@/data/libraries";

const ease = [0.65, 0, 0.35, 1] as const;

export default function OpenSource() {
  return (
    <section id="open-source" className="py-14 border-t hairline">
      <h2 className="text-[13px] tracking-[0.04em] uppercase text-fg-3 mb-6">
        open source
      </h2>

      <m.ul
        initial={{ opacity: 0, y: 6 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4, ease }}
        className="space-y-6"
      >
        {libraries.map((library) => {
          const primary = library.npmUrl || library.githubUrl;
          return (
            <li key={library.id} className="text-[15px] leading-6">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <div className="flex items-baseline gap-2">
                  <a
                    href={primary}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="prose-link inline-flex items-center gap-1 font-mono text-[14px] text-fg font-medium"
                  >
                    {library.name}
                    <ArrowUpRight size={13} className="opacity-60" />
                  </a>
                  {library.npmUrl && (
                    <a
                      href={library.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Source"
                      className="text-fg-3 hover:text-fg transition-colors"
                    >
                      <Github size={13} />
                    </a>
                  )}
                </div>
                <span className="text-fg-3 text-[13px]">
                  {library.tags.slice(0, 2).join(" · ")}
                </span>
              </div>
              <p className="text-fg-2 text-[14px] mt-1 text-pretty">
                {library.description}
              </p>
            </li>
          );
        })}
      </m.ul>
    </section>
  );
}
