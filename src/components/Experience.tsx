import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { experiences } from "@/data/experience";
import SectionHeading from "@/components/SectionHeading";

export default function Experience() {
  return (
    <section id="experience" className="py-12">
      <SectionHeading
        color="var(--c-work)"
        count={`${experiences.length} roles`}
      >
        work
      </SectionHeading>

      <ul className="rise-on-scroll space-y-1">
        {experiences.map((exp) => (
          <li key={exp.id} className="row flex gap-3.5 text-[15px] leading-6">
            <span className="logo-tile size-10 rounded-[10px] mt-0.5">
              {exp.companyLogo ? (
                <Image
                  src={exp.companyLogo}
                  alt=""
                  width={40}
                  height={40}
                  className="size-full object-contain"
                />
              ) : (
                <span className="font-display text-[18px] text-[#171612]">
                  {exp.company[0]}
                </span>
              )}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <div className="flex flex-wrap items-baseline gap-x-2 text-fg">
                  <span className="font-medium">{exp.title}</span>
                  <span className="text-fg-3 max-sm:hidden">·</span>
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
                <span className="font-mono text-fg-3 text-[12px] tabular-nums">
                  {exp.period}
                </span>
              </div>

              {exp.projects && exp.projects.length > 0 && (
                <ul className="flex flex-wrap gap-1.5 mt-2">
                  {exp.projects.map((p) => {
                    const chip = (
                      <>
                        {p.logo && (
                          <Image
                            src={p.logo}
                            alt=""
                            width={16}
                            height={16}
                            className="size-4 rounded-[4px] bg-white"
                          />
                        )}
                        {p.name}
                      </>
                    );
                    const cls =
                      "inline-flex items-center gap-1.5 rounded-full border hairline px-2.5 h-7 font-mono text-[12px] text-fg-2";
                    return (
                      <li key={p.name}>
                        {p.url ? (
                          <a
                            href={p.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${cls} pressable hover:text-fg hover:border-fg-3`}
                          >
                            {chip}
                          </a>
                        ) : (
                          <span className={cls}>{chip}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
