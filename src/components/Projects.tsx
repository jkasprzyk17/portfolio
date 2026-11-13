import { ArrowUpRight, Github } from "lucide-react";
import Image from "next/image";
import { projects } from "@/data/projects";
import SectionHeading from "@/components/SectionHeading";

export default function Projects() {
  return (
    <section id="projects" className="py-12">
      <SectionHeading
        color="var(--c-projects)"
        count={`${projects.length} side projects`}
      >
        projects
      </SectionHeading>

      <ul className="rise-on-scroll space-y-1">
        {projects.map((project) => {
          const primary = project.liveUrl || project.githubUrl;
          return (
            <li
              key={project.id}
              className="row flex gap-3.5 text-[15px] leading-6"
            >
              {project.image && (
                <span className="logo-tile size-10 rounded-[10px] mt-0.5">
                  <Image
                    src={project.image}
                    alt=""
                    width={40}
                    height={40}
                    className="size-full object-cover"
                  />
                </span>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <div className="flex items-baseline gap-2">
                    {primary ? (
                      <a
                        href={primary}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="prose-link inline-flex items-center gap-1 text-fg font-medium"
                      >
                        {project.title}
                        <ArrowUpRight size={13} className="opacity-60" />
                      </a>
                    ) : (
                      <span className="font-medium text-fg">
                        {project.title}
                      </span>
                    )}
                    {project.githubUrl && project.liveUrl && (
                      <a
                        href={project.githubUrl}
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
                    {project.technologies.slice(0, 2).join(" · ")}
                  </span>
                </div>
                <p className="text-fg-2 text-[14px] mt-1 text-pretty">
                  {project.description.split(".")[0]}.
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
