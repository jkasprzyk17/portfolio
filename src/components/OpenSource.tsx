import { ArrowUpRight, Github } from "lucide-react";
import { libraries } from "@/data/libraries";
import { contributions } from "@/data/contributions";
import SectionHeading from "@/components/SectionHeading";

export default function OpenSource() {
  return (
    <section id="open-source" className="py-12">
      <SectionHeading
        color="var(--c-oss)"
        count={`${libraries.length} libraries`}
      >
        open source
      </SectionHeading>

      <ul className="rise-on-scroll space-y-1">
        {libraries.map((library) => {
          const primary = library.npmUrl || library.githubUrl;
          return (
            <li key={library.id} className="row text-[15px] leading-6">
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
                <span className="font-mono text-fg-3 text-[12px]">
                  {library.tags.slice(0, 2).join(" · ")}
                </span>
              </div>
              <p className="text-fg-2 text-[14px] mt-1 text-pretty">
                {library.description}
              </p>
            </li>
          );
        })}
      </ul>

      <h3 className="flex items-center gap-2.5 font-mono text-[12px] text-fg-3 mt-9 mb-4">
        <span
          aria-hidden
          className="size-2 rounded-[2px]"
          style={{ background: "var(--c-core)" }}
        />
        merged upstream
      </h3>

      <ul className="rise-on-scroll space-y-1">
        {contributions.map((contribution) => (
          <li key={contribution.id} className="row text-[15px] leading-6">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <a
                href={contribution.url}
                target="_blank"
                rel="noopener noreferrer"
                className="prose-link inline-flex items-center gap-1 font-mono text-[14px] text-fg font-medium"
              >
                {contribution.project}
                <ArrowUpRight size={13} className="opacity-60" />
              </a>
              <span className="font-mono text-fg-3 text-[12px]">
                merged · {contribution.date}
              </span>
            </div>
            <p className="text-fg-2 text-[14px] mt-1 text-pretty">
              {contribution.title}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
