"use client";

// Still a client component for the footer year alone: as a server component
// on this static page it would freeze at the year of the last build.

import SectionHeading from "@/components/SectionHeading";
import { contact } from "@/data/profile";

const links = contact.socials;

export default function Contact() {
  const year = new Date().getFullYear();

  return (
    <section id="contact" className="pt-12 pb-14">
      <SectionHeading color="var(--accent)">contact</SectionHeading>

      <p className="rise-on-scroll font-display text-[2rem] leading-[1.1] sm:text-[2.5rem] tracking-[-0.02em] text-fg mb-6">
        Say <em className="text-accent">hi</em>.
      </p>

      <div className="rise-on-scroll text-[15px] leading-7 text-fg-2 space-y-3">
        <p>
          Email me at{" "}
          <a href={`mailto:${contact.email}`} className="prose-link">
            {contact.email}
          </a>{" "}
          or call{" "}
          <a href={contact.phoneHref} className="prose-link">
            {contact.phone}
          </a>
          .
        </p>
        <p>
          You can also reach me on{" "}
          {links.map((l, i) => (
            <span key={l.href}>
              {i > 0 && (i === links.length - 1 ? " or " : ", ")}
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="prose-link"
              >
                {l.label}
              </a>
            </span>
          ))}
          .
        </p>
      </div>

      <p className="mt-12 pt-6 border-t hairline font-mono text-[12px] text-fg-3">
        © {year} Jakub Kasprzyk · Kraków, PL
      </p>
    </section>
  );
}
