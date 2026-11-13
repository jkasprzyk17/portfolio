"use client";

import { ArrowDownToLine, ArrowUpRight } from "lucide-react";
import { experiences } from "@/data/experience";
import { libraries } from "@/data/libraries";
import { contributions } from "@/data/contributions";
import { projects } from "@/data/projects";
import { education } from "@/data/education";
import { contact, summary } from "@/data/profile";
import { summarise } from "@/lib/text";
import AppScreen from "../AppScreen";
import { Dots } from "../Info";

// The CV as a sheet of paper, set for a phone-wide column. Same data files
// as /cv (which is what cv.pdf is printed from), so the two can't disagree;
// the PDF itself is one tap away rather than squeezed onto a 300px screen,
// where an A4 page comes out at about 5px type.
export default function CvApp() {
  return (
    <AppScreen
      className="cv"
      title="CV"
      actions={
        <>
          <a className="pill pill--quiet" href="/cv">
            Full page <ArrowUpRight size={13} aria-hidden />
          </a>
          <a className="pill" href="/cv.pdf" download>
            PDF <ArrowDownToLine size={13} aria-hidden />
          </a>
        </>
      }
    >
      <article className="paper">
        <header>
          <p className="paper__name">Jakub Kasprzyk</p>
          <p className="paper__role">Mobile Software Engineer</p>
          <Dots
            className="paper__contact"
            items={[
              "Kraków, PL",
              <a key="email" href={`mailto:${contact.email}`}>
                {contact.email}
              </a>,
              <a key="phone" href={contact.phoneHref}>
                {contact.phone}
              </a>,
            ]}
          />
          <p className="paper__summary">{summary}</p>
        </header>

        <h3>Experience</h3>
        <ul className="paper__entries">
          {experiences.map((exp) => (
            <li key={exp.id}>
              <Dots className="paper__title" items={[exp.title, exp.company]} />
              <Dots
                className="paper__meta"
                items={[exp.period, exp.location]}
              />
              <ul className="paper__bullets">
                {exp.description.map((line) => (
                  <li key={line}>{line}</li>
                ))}
                {exp.projects?.map((p) => (
                  <li key={p.name}>
                    <strong>{p.name}</strong>:{" "}
                    {summarise(p.name, p.description)}
                  </li>
                ))}
              </ul>
              {exp.technologies && (
                <Dots className="paper__tech" items={exp.technologies} />
              )}
            </li>
          ))}
        </ul>

        <h3>Open Source</h3>
        <ul className="paper__entries">
          {libraries.map((lib) => (
            <li key={lib.id}>
              <p className="paper__title paper__title--mono">{lib.name}</p>
              <p className="paper__text">{lib.description}</p>
            </li>
          ))}
          {contributions.map((c) => (
            <li key={c.id}>
              <p className="paper__title paper__title--mono">{c.project}</p>
              <Dots className="paper__meta" items={["merged", c.date]} />
              <p className="paper__text">{c.title}</p>
            </li>
          ))}
        </ul>

        <h3>Own Projects</h3>
        <ul className="paper__entries">
          {projects.map((project) => (
            <li key={project.id}>
              <p className="paper__title">{project.title}</p>
              <Dots
                className="paper__meta"
                items={project.technologies.slice(0, 3)}
              />
              <p className="paper__text">{project.description}</p>
            </li>
          ))}
        </ul>

        <h3>Education</h3>
        <ul className="paper__entries">
          {education.map((item) => (
            <li key={item.id}>
              <p className="paper__title">{item.field}</p>
              <Dots
                className="paper__meta"
                items={[item.school, item.period]}
              />
            </li>
          ))}
        </ul>
      </article>
    </AppScreen>
  );
}
