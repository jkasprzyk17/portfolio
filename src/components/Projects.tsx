"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";
import { projects } from "@/data/projects";

const ease = [0.65, 0, 0.35, 1] as const;

export default function Projects() {
  return (
    <section id="projects" className="py-14 border-t hairline">
      <h2 className="text-[13px] tracking-[0.04em] uppercase text-fg-3 mb-6">
        projects
      </h2>

      <motion.ul
        initial={{ opacity: 0, y: 6 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4, ease }}
        className="space-y-6"
      >
        {projects.map((project) => {
          const primary = project.liveUrl || project.githubUrl;
          return (
            <li key={project.id} className="text-[15px] leading-6">
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
                    <span className="font-medium text-fg">{project.title}</span>
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
                <span className="text-fg-3 text-[13px]">
                  {project.technologies.slice(0, 2).join(" · ")}
                </span>
              </div>
              <p className="text-fg-2 text-[14px] mt-1 text-pretty">
                {project.description.split(".")[0]}.
              </p>
            </li>
          );
        })}
      </motion.ul>
    </section>
  );
}
